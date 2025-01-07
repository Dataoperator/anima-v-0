import { Principal } from '@dfinity/principal';

export interface Transaction {
  id: string;
  type: 'Creation' | 'Resurrection' | 'GrowthPack';
  status: 'Pending' | 'Complete' | 'Failed';
  amount: bigint;
  fee: bigint;
  timestamp: Date;
  blockHeight?: bigint;
  error?: string;
  retryCount: number;
  from: Principal;
  to: Principal;
  networkLatency?: number;
  cyclesCost?: bigint;
}

export interface NetworkMetrics {
  averageLatency: number;
  errorRate: number;
  successRate: number;
  averageFee: bigint;
  peakTime: Date | null;
  totalTransactions: number;
}

class TransactionMonitor {
  private transactions: Map<string, Transaction> = new Map();
  private metrics: NetworkMetrics = {
    averageLatency: 0,
    errorRate: 0,
    successRate: 100,
    averageFee: BigInt(0),
    peakTime: null,
    totalTransactions: 0
  };

  private listeners: Set<(tx: Transaction) => void> = new Set();

  public async trackTransaction(tx: Omit<Transaction, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    const transaction = { ...tx, id };
    this.transactions.set(id, transaction as Transaction);
    this.notifyListeners(transaction as Transaction);
    return id;
  }

  public async updateTransaction(
    id: string,
    update: Partial<Transaction>
  ): Promise<void> {
    const tx = this.transactions.get(id);
    if (!tx) throw new Error('Transaction not found');

    const updatedTx = { ...tx, ...update };
    this.transactions.set(id, updatedTx);
    this.updateMetrics(updatedTx);
    this.notifyListeners(updatedTx);

    // Store in stable storage if completed or failed
    if (update.status === 'Complete' || update.status === 'Failed') {
      await this.persistTransaction(updatedTx);
    }
  }

  public getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  public getMetrics(): NetworkMetrics {
    return { ...this.metrics };
  }

  public subscribe(listener: (tx: Transaction) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async getTransactionHistory(
    principal: Principal,
    limit = 10
  ): Promise<Transaction[]> {
    // Implement fetching from stable storage
    return Array.from(this.transactions.values())
      .filter(tx => tx.from === principal || tx.to === principal)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private updateMetrics(tx: Transaction): void {
    if (tx.status === 'Complete') {
      this.metrics.totalTransactions++;
      
      if (tx.networkLatency) {
        this.metrics.averageLatency = 
          (this.metrics.averageLatency * (this.metrics.totalTransactions - 1) + 
           tx.networkLatency) / this.metrics.totalTransactions;
      }

      const successfulTxs = Array.from(this.transactions.values())
        .filter(t => t.status === 'Complete').length;
      
      this.metrics.successRate = 
        (successfulTxs / this.metrics.totalTransactions) * 100;
      
      this.metrics.errorRate = 100 - this.metrics.successRate;

      // Update average fee
      this.metrics.averageFee = 
        (this.metrics.averageFee * BigInt(this.metrics.totalTransactions - 1) +
         tx.fee) / BigInt(this.metrics.totalTransactions);

      // Update peak time
      const hour = tx.timestamp.getHours();
      const txsInThisHour = Array.from(this.transactions.values())
        .filter(t => t.timestamp.getHours() === hour).length;
      
      if (!this.metrics.peakTime || txsInThisHour > this.getPeakTimeTransactions()) {
        this.metrics.peakTime = new Date(tx.timestamp);
      }
    }
  }

  private getPeakTimeTransactions(): number {
    if (!this.metrics.peakTime) return 0;
    const peakHour = this.metrics.peakTime.getHours();
    return Array.from(this.transactions.values())
      .filter(tx => tx.timestamp.getHours() === peakHour).length;
  }

  private async persistTransaction(tx: Transaction): Promise<void> {
    // Implement stable storage persistence
    // This would interact with your canister's stable memory
  }

  private notifyListeners(tx: Transaction): void {
    this.listeners.forEach(listener => listener(tx));
  }
}

export const transactionMonitor = new TransactionMonitor();