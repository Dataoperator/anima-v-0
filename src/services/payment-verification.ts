import { TransactionMonitor } from './transaction-monitor';
import { BalanceTracker } from './balance-tracker';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { Principal } from '@dfinity/principal';
import type { ActorSubclass } from '@dfinity/agent';

export type PaymentPurpose = 'MINT' | 'GROWTH' | 'RESURRECTION';

interface PaymentVerificationConfig {
  purpose: PaymentPurpose;
  amount: bigint;
  payer: Principal;
  recipient: Principal;
}

interface VerificationResult {
  transactionId: string;
  timestamp: number;
}

export class PaymentVerificationSystem {
  private readonly errorTracker: ErrorTracker;
  private readonly VERIFICATION_TIMEOUT = 300000; // 5 minutes

  constructor(
    private ledger: ActorSubclass,
    private transactionMonitor: TransactionMonitor,
    private balanceTracker: BalanceTracker
  ) {
    this.errorTracker = ErrorTracker.getInstance();
  }

  async initiateVerification(config: PaymentVerificationConfig): Promise<VerificationResult> {
    try {
      // Generate unique transaction ID
      const transactionId = this.generateTransactionId();
      
      // Verify payer has sufficient balance
      const currentBalance = await this.balanceTracker.getBalance(config.payer);
      if (currentBalance < config.amount) {
        throw new Error('Insufficient balance');
      }

      // Start monitoring this transaction
      this.transactionMonitor.startMonitoring({
        id: transactionId,
        payer: config.payer,
        recipient: config.recipient,
        amount: config.amount,
        purpose: config.purpose
      });

      return {
        transactionId,
        timestamp: Date.now()
      };
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Payment verification initiation failed'),
        ErrorSeverity.HIGH,
        { config }
      );
      throw error;
    }
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      return await this.transactionMonitor.isTransactionComplete(transactionId);
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Payment verification failed'),
        ErrorSeverity.HIGH,
        { transactionId }
      );
      return false;
    }
  }

  private generateTransactionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}