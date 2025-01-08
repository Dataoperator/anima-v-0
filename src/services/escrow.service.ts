import { Principal } from '@dfinity/principal';
import { ErrorTracker } from './error-tracker';
import { WalletService } from './wallet.service';
import { PriceOracle } from './price-oracle';
import { TreasuryService } from './treasury.service';

export interface EscrowEntry {
  id: string;
  depositor: Principal;
  amount: bigint;
  targetTokenAmount: bigint;
  timestamp: bigint;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  expiresAt: bigint;
}

export interface SwapParameters {
  minReceived: bigint;
  maxSlippage: number;
  deadline: bigint;
}

export class EscrowService {
  private static instance: EscrowService | null = null;
  private escrows: Map<string, EscrowEntry> = new Map();
  private errorTracker: ErrorTracker;
  private priceOracle: PriceOracle;
  private readonly ESCROW_TIMEOUT = BigInt(3600); // 1 hour

  private constructor(
    private walletService: WalletService,
    private treasuryService: TreasuryService
  ) {
    this.errorTracker = ErrorTracker.getInstance();
    this.priceOracle = PriceOracle.getInstance();
  }

  static getInstance(
    walletService: WalletService,
    treasuryService: TreasuryService
  ): EscrowService {
    if (!EscrowService.instance) {
      EscrowService.instance = new EscrowService(walletService, treasuryService);
    }
    return EscrowService.instance;
  }

  async createEscrow(
    depositor: Principal,
    amount: bigint,
    params: SwapParameters
  ): Promise<string> {
    try {
      const price = await this.priceOracle.getCurrentPrice();
      const targetTokenAmount = (amount * price) / BigInt(100);

      if (targetTokenAmount < params.minReceived) {
        throw new Error('Target amount below minimum received');
      }

      const id = crypto.randomUUID();
      const now = BigInt(Date.now());

      const escrow: EscrowEntry = {
        id,
        depositor,
        amount,
        targetTokenAmount,
        timestamp: now,
        status: 'pending',
        expiresAt: now + this.ESCROW_TIMEOUT
      };

      // Transfer to escrow wallet
      await this.walletService.transfer({
        from: depositor,
        to: Principal.fromText(process.env.ESCROW_ADDRESS!),
        amount,
        memo: `Escrow ${id}`
      });

      this.escrows.set(id, escrow);

      // Start timeout for automatic refund
      setTimeout(() => {
        this.handleEscrowTimeout(id).catch(error => {
          this.errorTracker.trackError({
            type: 'EscrowTimeoutError',
            message: error instanceof Error ? error.message : 'Failed to handle escrow timeout',
            context: { escrowId: id }
          });
        });
      }, Number(this.ESCROW_TIMEOUT * BigInt(1000)));

      return id;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'EscrowCreationError',
        message: error instanceof Error ? error.message : 'Failed to create escrow',
        context: { depositor: depositor.toString(), amount: amount.toString() }
      });
      throw error;
    }
  }

  async completeSwap(escrowId: string): Promise<void> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    if (escrow.status !== 'pending') {
      throw new Error('Invalid escrow status');
    }

    if (escrow.expiresAt < BigInt(Date.now())) {
      throw new Error('Escrow expired');
    }

    try {
      // Transfer ICP to treasury
      await this.walletService.transfer({
        from: Principal.fromText(process.env.ESCROW_ADDRESS!),
        to: Principal.fromText(process.env.TREASURY_ADDRESS!),
        amount: escrow.amount,
        memo: `Complete ${escrowId}`
      });

      // Update escrow status
      escrow.status = 'completed';
      this.escrows.set(escrowId, escrow);

    } catch (error) {
      escrow.status = 'failed';
      this.escrows.set(escrowId, escrow);
      
      this.errorTracker.trackError({
        type: 'SwapCompletionError',
        message: error instanceof Error ? error.message : 'Failed to complete swap',
        context: { escrowId, amount: escrow.amount.toString() }
      });
      throw error;
    }
  }

  async refundEscrow(escrowId: string): Promise<void> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }

    if (escrow.status !== 'pending') {
      throw new Error('Invalid escrow status');
    }

    try {
      // Return ICP to depositor
      await this.walletService.transfer({
        from: Principal.fromText(process.env.ESCROW_ADDRESS!),
        to: escrow.depositor,
        amount: escrow.amount,
        memo: `Refund ${escrowId}`
      });

      escrow.status = 'refunded';
      this.escrows.set(escrowId, escrow);

    } catch (error) {
      this.errorTracker.trackError({
        type: 'EscrowRefundError',
        message: error instanceof Error ? error.message : 'Failed to refund escrow',
        context: { escrowId, amount: escrow.amount.toString() }
      });
      throw error;
    }
  }

  private async handleEscrowTimeout(escrowId: string): Promise<void> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow || escrow.status !== 'pending') {
      return;
    }

    try {
      await this.refundEscrow(escrowId);
    } catch (error) {
      this.errorTracker.trackError({
        type: 'EscrowTimeoutHandlingError',
        message: error instanceof Error ? error.message : 'Failed to handle escrow timeout',
        context: { escrowId }
      });
    }
  }

  getEscrow(id: string): EscrowEntry | undefined {
    return this.escrows.get(id);
  }

  async getActiveEscrows(depositor: Principal): Promise<EscrowEntry[]> {
    return Array.from(this.escrows.values())
      .filter(e => e.depositor.toString() === depositor.toString() && 
                  e.status === 'pending');
  }
}