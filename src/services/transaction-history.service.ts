import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { Principal } from "@dfinity/principal";

export interface Transaction {
  id: string;
  type: 'deposit' | 'mint' | 'transfer' | 'burn';
  amount: bigint;
  timestamp: bigint;
  status: 'pending' | 'completed' | 'failed';
  from?: string;
  to?: string;
  quantum_signature?: string;
  memo?: string;
  error?: string;
}

export class TransactionHistoryService {
  private static instance: TransactionHistoryService;
  private transactions: Transaction[] = [];
  private listeners: Set<(transactions: Transaction[]) => void> = new Set();
  private pollingInterval: NodeJS.Timer | null = null;

  private constructor() {}

  static getInstance(): TransactionHistoryService {
    if (!TransactionHistoryService.instance) {
      TransactionHistoryService.instance = new TransactionHistoryService();
    }
    return TransactionHistoryService.instance;
  }

  subscribe(callback: (transactions: Transaction[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.transactions);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.transactions]));
  }

  async startPolling(identity: Identity) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial fetch
    await this.fetchTransactions(identity);

    // Poll every 5 seconds
    this.pollingInterval = setInterval(() => {
      this.fetchTransactions(identity).catch(console.error);
    }, 5000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async fetchTransactions(identity: Identity) {
    try {
      const actor = animaActorService.createActor(identity);
      const principal = identity.getPrincipal();

      // Get account identifier for the principal
      const accountId = this.principalToAccountIdentifier(principal);

      // Fetch transactions from the ledger canister
      // Note: This is a simplified example. You'll need to implement the actual ledger canister calls
      const result = await actor.get_transactions({
        account: accountId,
        offset: 0n,
        limit: 50n
      });

      if ('Ok' in result) {
        this.transactions = result.Ok.transactions.map(tx => ({
          id: tx.id.toString(),
          type: this.determineTransactionType(tx),
          amount: tx.amount,
          timestamp: tx.timestamp,
          status: tx.status,
          from: tx.from?.toString(),
          to: tx.to?.toString(),
          quantum_signature: tx.quantum_signature,
          memo: tx.memo?.toString()
        }));

        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }

  private determineTransactionType(tx: any): Transaction['type'] {
    // Implement logic to determine transaction type based on your canister's transaction data
    return 'transfer';
  }

  private principalToAccountIdentifier(principal: Principal): string {
    // Implement the conversion from principal to account identifier
    // This is a placeholder. You'll need to implement the actual conversion logic
    return principal.toText();
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    const newTransaction = {
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.transactions.unshift(newTransaction);
    this.notifyListeners();
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }
}

export const transactionHistoryService = TransactionHistoryService.getInstance();