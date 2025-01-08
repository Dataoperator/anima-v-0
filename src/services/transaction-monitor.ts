import type { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { PaymentPurpose } from './payment-verification';
import { EventEmitter } from '../utils/event-emitter';

interface Transaction {
  id: string;
  payer: Principal;
  recipient: Principal;
  amount: bigint;
  purpose: PaymentPurpose;
  status: 'pending' | 'completed' | 'failed' | 'recovering';
  timestamp: number;
  retryCount: number;
  lastChecked: number;
  blockHeight?: bigint;
}

const MAX_RETRIES = 3;
const CHECK_INTERVAL = 5000; // 5 seconds
const RECOVERY_DELAY = 10000; // 10 seconds
const TRANSACTION_TIMEOUT = 300000; // 5 minutes

export class TransactionMonitor extends EventEmitter {
  private static instance: TransactionMonitor;
  private transactions: Map<string, Transaction>;
  private readonly errorTracker: ErrorTracker;
  private monitoringInterval: NodeJS.Timer | null = null;
  private isMonitoring = false;

  private constructor(private ledger: ActorSubclass) {
    super();
    this.transactions = new Map();
    this.errorTracker = ErrorTracker.getInstance();
    this.startGlobalMonitoring();
  }

  static getInstance(ledger: ActorSubclass): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor(ledger);
    }
    return TransactionMonitor.instance;
  }

  private startGlobalMonitoring(): void {
    if (this.isMonitoring) return;

    this.monitoringInterval = setInterval(async () => {
      const now = Date.now();
      
      for (const [id, tx] of this.transactions.entries()) {
        // Skip recently checked transactions
        if (now - tx.lastChecked < CHECK_INTERVAL) continue;

        // Check for timeout
        if (now - tx.timestamp > TRANSACTION_TIMEOUT) {
          await this.handleTransactionTimeout(id, tx);
          continue;
        }

        // Check transaction status
        if (tx.status === 'pending' || tx.status === 'recovering') {
          await this.checkTransactionStatus(id, tx);
        }
      }
    }, CHECK_INTERVAL);

    this.isMonitoring = true;
  }

  private async handleTransactionTimeout(id: string, tx: Transaction): Promise<void> {
    console.error(`Transaction ${id} timed out after ${TRANSACTION_TIMEOUT}ms`);
    
    // Mark as failed and emit event
    tx.status = 'failed';
    this.emit('transactionFailed', {
      id,
      reason: 'TIMEOUT',
      transaction: tx
    });

    // Track error
    await this.errorTracker.trackError(
      ErrorCategory.PAYMENT,
      new Error(`Transaction timeout: ${id}`),
      ErrorSeverity.HIGH,
      {
        transactionId: id,
        timeElapsed: Date.now() - tx.timestamp,
        retryCount: tx.retryCount
      }
    );

    // Remove from monitoring
    this.transactions.delete(id);
  }

  private async checkTransactionStatus(id: string, tx: Transaction): Promise<void> {
    try {
      tx.lastChecked = Date.now();

      // Get current block height
      const info = await this.ledger.query_blocks({
        start: tx.blockHeight || 0n,
        length: 100n
      });

      // Look for our transaction
      const found = info.blocks.some(block => 
        block.transaction &&
        block.transaction.transfer.amount.e8s === tx.amount &&
        block.transaction.transfer.from.toString() === tx.payer.toString() &&
        block.transaction.transfer.to.toString() === tx.recipient.toString()
      );

      if (found) {
        tx.status = 'completed';
        this.emit('transactionCompleted', {
          id,
          transaction: tx,
          blockHeight: info.chain_length
        });
        
        // Remove completed transaction from monitoring
        this.transactions.delete(id);
        return;
      }

      // Transaction not found - check if we should retry
      if (tx.retryCount < MAX_RETRIES) {
        await this.initiateRecovery(id, tx);
      } else {
        tx.status = 'failed';
        this.emit('transactionFailed', {
          id,
          reason: 'MAX_RETRIES_EXCEEDED',
          transaction: tx
        });
        this.transactions.delete(id);
      }

    } catch (error) {
      console.error(`Error checking transaction ${id}:`, error);
      await this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Transaction check failed'),
        ErrorSeverity.MEDIUM,
        { transactionId: id }
      );
    }
  }

  private async initiateRecovery(id: string, tx: Transaction): Promise<void> {
    try {
      tx.status = 'recovering';
      tx.retryCount++;

      this.emit('transactionRecovering', {
        id,
        retryCount: tx.retryCount,
        transaction: tx
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RECOVERY_DELAY));

      // Update block height for next check
      const currentInfo = await this.ledger.query_blocks({
        start: 0n,
        length: 1n
      });
      tx.blockHeight = currentInfo.chain_length;

    } catch (error) {
      console.error(`Recovery initiation failed for transaction ${id}:`, error);
      await this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Recovery initiation failed'),
        ErrorSeverity.HIGH,
        { transactionId: id }
      );
    }
  }

  startMonitoring(config: {
    id: string;
    payer: Principal;
    recipient: Principal;
    amount: bigint;
    purpose: PaymentPurpose;
  }): void {
    const tx: Transaction = {
      ...config,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0,
      lastChecked: 0
    };

    this.transactions.set(config.id, tx);
    this.emit('transactionStarted', {
      id: config.id,
      transaction: tx
    });
  }

  async getTransactionStatus(id: string): Promise<{
    status: Transaction['status'];
    lastChecked: number;
    retryCount: number;
  } | null> {
    const tx = this.transactions.get(id);
    if (!tx) return null;

    return {
      status: tx.status,
      lastChecked: tx.lastChecked,
      retryCount: tx.retryCount
    };
  }

  isTransactionPending(id: string): boolean {
    const tx = this.transactions.get(id);
    return tx?.status === 'pending' || tx?.status === 'recovering';
  }

  dispose(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.isMonitoring = false;
    this.transactions.clear();
    TransactionMonitor.instance = null as any;
  }
}

export const createTransactionMonitor = (ledger: ActorSubclass): TransactionMonitor => {
  return TransactionMonitor.getInstance(ledger);
};