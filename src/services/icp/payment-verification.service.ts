import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { animaActorService } from '../anima-actor.service';

interface PaymentDetails {
  payer: Principal;
  amount: bigint;
  memo: bigint;
  block: bigint;
  timestamp: bigint;
}

interface VerificationResult {
  verified: boolean;
  payment?: PaymentDetails;
  error?: string;
}

export class PaymentVerificationService {
  private static instance: PaymentVerificationService | null = null;
  private readonly TREASURY_CANISTER_ID = 'l2ilz-iqaaa-aaaaj-qngjq-cai';
  private paymentCache = new Map<string, PaymentDetails>();
  
  private constructor() {}

  static getInstance(): PaymentVerificationService {
    if (!PaymentVerificationService.instance) {
      PaymentVerificationService.instance = new PaymentVerificationService();
    }
    return PaymentVerificationService.instance;
  }

  // Generate a unique payment identifier
  async createPaymentIdentifier(payer: Principal): Promise<string> {
    const timestamp = BigInt(Date.now());
    const random = BigInt(Math.floor(Math.random() * 1000000));
    const memo = (timestamp << 20n) | random;
    
    // Format: timestamp-random-principal
    return `${timestamp}-${random}-${payer.toText()}`;
  }

  // Create transaction memo from payment ID
  private createMemo(paymentId: string): bigint {
    return BigInt('0x' + Buffer.from(paymentId).toString('hex'));
  }

  // Get payment info from memo
  private parsePaymentId(memo: bigint): string {
    const hex = memo.toString(16);
    return Buffer.from(hex, 'hex').toString();
  }

  // Generate expected transfer info for verification
  async generateTransferDetails(
    payer: Principal,
    amount: bigint
  ): Promise<{ 
    paymentId: string;
    memo: bigint; 
    recipient: Uint8Array;
  }> {
    // Create unique payment ID
    const paymentId = await this.createPaymentIdentifier(payer);
    const memo = this.createMemo(paymentId);

    // Get treasury account identifier
    const treasuryId = AccountIdentifier.fromPrincipal({
      principal: Principal.fromText(this.TREASURY_CANISTER_ID),
    });

    // Cache expected payment details
    this.paymentCache.set(paymentId, {
      payer,
      amount,
      memo,
      block: 0n,
      timestamp: BigInt(Date.now())
    });

    // Auto-cleanup old cache entries
    setTimeout(() => {
      this.paymentCache.delete(paymentId);
    }, 30 * 60 * 1000); // 30 minutes

    return {
      paymentId,
      memo,
      recipient: treasuryId.toUint8Array()
    };
  }

  // Verify payment in ledger
  async verifyPayment(
    paymentId: string,
    expectedAmount: bigint
  ): Promise<VerificationResult> {
    try {
      const cached = this.paymentCache.get(paymentId);
      if (!cached) {
        return {
          verified: false,
          error: 'Payment identifier not found or expired'
        };
      }

      const actor = await animaActorService.createActor();
      
      // Get blocks since cached timestamp
      const blocks = await actor.query_blocks({
        start: cached.timestamp,
        length: 100n
      });

      // Find matching transaction
      for (const block of blocks.blocks) {
        if (!block.transaction.transfer) continue;
        
        const transfer = block.transaction.transfer;
        if (
          transfer.memo === cached.memo &&
          transfer.amount === expectedAmount &&
          transfer.from === cached.payer.toText()
        ) {
          // Update cache with block info
          cached.block = block.height;
          this.paymentCache.set(paymentId, cached);

          return {
            verified: true,
            payment: cached
          };
        }
      }

      return {
        verified: false,
        error: 'Payment not found in recent blocks'
      };

    } catch (error) {
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  // Monitor payment completion
  async waitForPayment(
    paymentId: string,
    expectedAmount: bigint,
    timeoutMs: number = 300000 // 5 minutes
  ): Promise<VerificationResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkPayment = async () => {
        const result = await this.verifyPayment(paymentId, expectedAmount);
        
        if (result.verified) {
          resolve(result);
          return;
        }

        if (Date.now() - startTime > timeoutMs) {
          resolve({
            verified: false,
            error: 'Payment verification timeout'
          });
          return;
        }

        // Check again in 5 seconds
        setTimeout(checkPayment, 5000);
      };

      checkPayment();
    });
  }
}

export const paymentVerificationService = PaymentVerificationService.getInstance();