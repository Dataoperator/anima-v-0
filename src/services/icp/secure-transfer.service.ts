import { Principal } from '@dfinity/principal';
import { animaActorService } from '../anima-actor.service';
import { ErrorTracker } from '../error-tracker';
import { paymentVerificationService } from './payment-verification.service';

const ICP_TO_ANIMA_RATE = 10_000n; // 1 ICP = 10,000 ANIMA

interface TransferResult {
  success: boolean;
  paymentId?: string;
  txId?: string;
  error?: string;
}

export class SecureTransferService {
  private static instance: SecureTransferService | null = null;
  private errorTracker = ErrorTracker.getInstance();
  private pendingMints = new Map<string, {
    principal: Principal;
    amount: bigint;
    timestamp: number;
  }>();

  static getInstance(): SecureTransferService {
    if (!SecureTransferService.instance) {
      SecureTransferService.instance = new SecureTransferService();
    }
    return SecureTransferService.instance;
  }

  private constructor() {
    // Cleanup old pending mints periodically
    setInterval(() => {
      const now = Date.now();
      for (const [paymentId, data] of this.pendingMints.entries()) {
        if (now - data.timestamp > 30 * 60 * 1000) { // 30 minutes
          this.pendingMints.delete(paymentId);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  async initiateSwap(
    fromPrincipal: Principal,
    icpAmount: bigint
  ): Promise<TransferResult> {
    try {
      // Step 1: Generate payment details
      const { paymentId, memo, recipient } = 
        await paymentVerificationService.generateTransferDetails(
          fromPrincipal,
          icpAmount
        );

      // Step 2: Get actor interface
      const actor = await animaActorService.createActor();

      // Step 3: Transfer ICP with unique memo
      const result = await actor.icrc1_transfer({
        from_subaccount: [], // Default subaccount
        to: {
          owner: Principal.fromText(recipient.toString()),
          subaccount: []
        },
        amount: icpAmount,
        fee: [],
        memo: [memo],
        created_at_time: []
      });

      if ('Err' in result) {
        throw new Error(`Transfer failed: ${JSON.stringify(result.Err)}`);
      }

      // Step 4: Record pending mint
      this.pendingMints.set(paymentId, {
        principal: fromPrincipal,
        amount: icpAmount,
        timestamp: Date.now()
      });

      return {
        success: true,
        paymentId,
        txId: result.Ok.toString()
      };

    } catch (error) {
      this.errorTracker.trackError({
        type: 'ICP_TRANSFER_ERROR',
        severity: 'HIGH',
        context: {
          fromPrincipal: fromPrincipal.toText(),
          amount: icpAmount.toString()
        },
        error: error as Error
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  async completeSwap(paymentId: string): Promise<TransferResult> {
    try {
      // Step 1: Get pending mint info
      const pendingMint = this.pendingMints.get(paymentId);
      if (!pendingMint) {
        throw new Error('Payment ID not found or expired');
      }

      // Step 2: Verify the payment
      const verification = await paymentVerificationService.verifyPayment(
        paymentId,
        pendingMint.amount
      );

      if (!verification.verified) {
        throw new Error(verification.error || 'Payment verification failed');
      }

      // Step 3: Calculate ANIMA amount
      const animaAmount = pendingMint.amount * ICP_TO_ANIMA_RATE;

      // Step 4: Mint ANIMA tokens
      const actor = await animaActorService.createActor();
      const result = await actor.mint({
        to: pendingMint.principal,
        amount: animaAmount,
        memo: [BigInt(paymentId)], // Link mint to original payment
        verification: {
          payment_id: paymentId,
          block_height: verification.payment!.block,
          timestamp: verification.payment!.timestamp
        }
      });

      if ('Err' in result) {
        throw new Error(`Minting failed: ${JSON.stringify(result.Err)}`);
      }

      // Step 5: Cleanup
      this.pendingMints.delete(paymentId);

      return {
        success: true,
        paymentId,
        txId: result.Ok.toString()
      };

    } catch (error) {
      this.errorTracker.trackError({
        type: 'SWAP_COMPLETION_ERROR',
        severity: 'HIGH',
        context: {
          paymentId,
          pendingMint: this.pendingMints.get(paymentId)
        },
        error: error as Error
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap completion failed'
      };
    }
  }

  async getSwapStatus(paymentId: string): Promise<{
    status: 'pending' | 'completed' | 'expired' | 'unknown';
    details?: any;
  }> {
    // Check pending mints
    const pendingMint = this.pendingMints.get(paymentId);
    if (pendingMint) {
      const verification = await paymentVerificationService.verifyPayment(
        paymentId,
        pendingMint.amount
      );

      if (verification.verified) {
        return {
          status: 'completed',
          details: verification.payment
        };
      }

      if (Date.now() - pendingMint.timestamp > 30 * 60 * 1000) {
        return { status: 'expired' };
      }

      return { status: 'pending' };
    }

    return { status: 'unknown' };
  }
}

export const secureTransferService = SecureTransferService.getInstance();