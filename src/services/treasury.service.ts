import { Principal } from '@dfinity/principal';
import { WalletService } from './wallet.service';
import { ErrorTracker } from './error-tracker';

export class TreasuryService {
  private static instance: TreasuryService | null = null;
  private errorTracker: ErrorTracker;
  private readonly TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || '';
  private initialized = false;

  private constructor(private walletService: WalletService) {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(walletService: WalletService): TreasuryService {
    if (!TreasuryService.instance) {
      TreasuryService.instance = new TreasuryService(walletService);
    }
    return TreasuryService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Verify treasury wallet exists
      const treasuryWallet = await this.walletService.getWallet(this.TREASURY_ADDRESS);
      if (!treasuryWallet) {
        throw new Error('Treasury wallet not found');
      }
      this.initialized = true;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TreasuryInitializationError',
        message: error instanceof Error ? error.message : 'Failed to initialize treasury',
        context: { treasuryAddress: this.TREASURY_ADDRESS }
      });
      throw error;
    }
  }

  async collectFees(amount: bigint, from: Principal): Promise<void> {
    if (!this.initialized) {
      throw new Error('Treasury not initialized');
    }

    try {
      await this.walletService.transfer({
        from,
        to: Principal.fromText(this.TREASURY_ADDRESS),
        amount,
        memo: 'ANIMA Quantum Fee'
      });
    } catch (error) {
      this.errorTracker.trackError({
        type: 'FeeCollectionError',
        message: error instanceof Error ? error.message : 'Failed to collect fees',
        context: { amount: amount.toString(), from: from.toString() }
      });
      throw error;
    }
  }

  async distributePools(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Treasury not initialized');
    }

    try {
      // TODO: Implement staking and rewards pool distribution
    } catch (error) {
      this.errorTracker.trackError({
        type: 'PoolDistributionError',
        message: error instanceof Error ? error.message : 'Failed to distribute pools',
        context: {}
      });
      throw error;
    }
  }
}