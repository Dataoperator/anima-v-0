import { Identity } from '@dfinity/principal';
import { WalletService } from './wallet.service';
import { PaymentType } from '@/types/payment';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export class PaymentService {
  private static instance: PaymentService | null = null;
  private walletService: WalletService;
  private errorTracker: ErrorTracker;

  private constructor(identity: Identity) {
    this.walletService = WalletService.getInstance(identity);
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(identity: Identity): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService(identity);
    }
    return PaymentService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.walletService.initialize();
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Payment service initialization failed'),
        ErrorSeverity.CRITICAL
      );
      throw error;
    }
  }

  async createPayment(type: PaymentType) {
    const config = {
      [PaymentType.Creation]: BigInt(1_00_000_000), // 1 ICP
      [PaymentType.Growth]: BigInt(50_000_000),     // 0.5 ICP
      [PaymentType.Evolution]: BigInt(20_000_000)   // 0.2 ICP
    };

    const amount = config[type] || BigInt(0);
    if (amount === BigInt(0)) {
      throw new Error('Invalid payment type');
    }

    // Generate unique memo for tracking
    const memo = BigInt(Date.now());

    return {
      amount,
      memo,
      type
    };
  }

  async processPayment(payment: { amount: bigint; memo: bigint; type: PaymentType }) {
    try {
      const quantumMetrics = this.walletService.getQuantumMetrics();
      
      // Check quantum state before processing
      if (quantumMetrics.coherenceLevel < 0.3) {
        throw new Error('Quantum coherence too low for transaction');
      }
      
      if (quantumMetrics.stabilityIndex < 0.3) {
        throw new Error('Quantum stability insufficient');
      }

      const transaction = await this.walletService.spend(
        payment.amount,
        `ANIMA_${payment.type}_${payment.memo.toString()}`
      );

      return transaction.status === 'completed';
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Payment processing failed'),
        ErrorSeverity.HIGH,
        { 
          type: payment.type,
          amount: payment.amount.toString(),
          memo: payment.memo.toString()
        }
      );
      throw error;
    }
  }

  getBalance(): bigint {
    return this.walletService.getBalance();
  }

  getQuantumMetrics() {
    return this.walletService.getQuantumMetrics();
  }

  isInitialized(): boolean {
    return this.walletService.isInitialized();
  }

  dispose(): void {
    PaymentService.instance = null;
  }
}