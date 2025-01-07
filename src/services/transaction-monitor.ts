import type { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { PaymentPurpose } from './payment-verification';

interface Transaction {
  id: string;
  payer: Principal;
  recipient: Principal;
  amount: bigint;
  purpose: PaymentPurpose;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}

export class TransactionMonitor {
  private transactions: Map<string, Transaction>;
  private readonly errorTracker: ErrorTracker;

  constructor(private ledger: ActorSubclass) {
    this.transactions = new Map();
    this.errorTracker = ErrorTracker.getInstance();
  }

  startMonitoring(config: {
    id: string;
    payer: Principal;
    recipient: Principal;
    amount: bigint;
    purpose: PaymentPurpose;
  }): void {
    this.transactions.set(config.id, {
      ...config,
      status: 'pending',
      timestamp: Date.now()
    });

    // Set timeout to clean up old transactions
    setTimeout(() => {
      this.transactions.delete(config.id);
    }, 3600000); // 1 hour
  }

  async isTransactionComplete(transactionId: string): Promise<boolean> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return false;

    try {
      // Check for transfer in ledger
      const transfers = await this.ledger.get_transactions({
        start: BigInt(transaction.timestamp),
        length: 100n
      });

      const matchingTransfer = transfers.transactions.find(
        transfer => 
          transfer.transfer.amount.e8s === transaction.amount &&
          transfer.transfer.from.toString() === transaction.payer.toString() &&
          transfer.transfer.to.toString() === transaction.recipient.toString()
      );

      if (matchingTransfer) {
        transaction.status = 'completed';
        return true;
      }

      return false;
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Transaction verification failed'),
        ErrorSeverity.HIGH,
        { transactionId }
      );
      return false;
    }
  }
}