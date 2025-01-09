import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { Principal } from "@dfinity/principal";
import { icpLedgerService } from "./icp-ledger";
import type { ActorMethod } from '@dfinity/agent';

// Define our own Result type since it's not exported from candid
type Result<T, E> = { Ok: T } | { Err: E };

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

interface LedgerTransaction {
  id: bigint;
  amount: {
    e8s: bigint;
  };
  timestamp: bigint;
  status: string;
  from?: Principal;
  to?: Principal;
  quantum_signature?: string;
  memo?: string;
}

interface LedgerTransactionsResponse {
  transactions: LedgerTransaction[];
  balance: {
    e8s: bigint;
  };
}

type GetTransactionsResult = Result<
  LedgerTransactionsResponse,
  string
>;

export class TransactionHistoryService {
  private static instance: TransactionHistoryService;
  private transactions: Transaction[] = [];
  private listeners: Set<(transactions: Transaction[]) => void> = new Set();
  private pollingInterval: number | null = null;

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
      window.clearInterval(this.pollingInterval);
    }

    // Initial fetch
    await this.fetchTransactions(identity);

    // Poll every 5 seconds
    this.pollingInterval = window.setInterval(() => {
      this.fetchTransactions(identity).catch(console.error);
    }, 5000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      window.clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async fetchTransactions(identity: Identity) {
    try {
      const actor = await icpLedgerService.getActor();
      if (!actor) {
        throw new Error('ICP Ledger service not initialized');
      }

      const principal = identity.getPrincipal();
      const accountId = this.principalToAccountIdentifier(principal);

      // Get account transactions from the actor
      const result = await (actor.get_account_balance_and_transactions as ActorMethod<[{
        account: string;
        start: bigint;
        length: bigint;
      }], GetTransactionsResult>)({
        account: accountId,
        start: 0n,
        length: 50n
      });

      if ('Ok' in result) {
        this.transactions = this.transformTransactions(result.Ok.transactions);
        await this.enrichTransactionsWithQuantumData(identity);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }

  private transformTransactions(rawTransactions: LedgerTransaction[]): Transaction[] {
    return rawTransactions.map(tx => ({
      id: tx.id.toString(),
      type: this.determineTransactionType({
        from: tx.from ? Principal.fromText(tx.from.toString()) : undefined,
        to: tx.to ? Principal.fromText(tx.to.toString()) : undefined
      }),
      amount: tx.amount.e8s,
      timestamp: tx.timestamp || BigInt(Date.now()),
      status: tx.status as Transaction['status'] || 'completed',
      from: tx.from?.toString(),
      to: tx.to?.toString(),
      memo: tx.memo?.toString(),
    }));
  }

  private async enrichTransactionsWithQuantumData(identity: Identity) {
    try {
      const animaActor = animaActorService.createActor(identity);
      const quantumStatus = await animaActor.get_quantum_status();
      
      if ('Ok' in quantumStatus) {
        // Update quantum signatures for relevant transactions
        this.transactions = this.transactions.map(tx => {
          if (tx.type === 'mint') {
            return {
              ...tx,
              quantum_signature: quantumStatus.Ok
            };
          }
          return tx;
        });
      }
    } catch (error) {
      console.error('Failed to enrich transactions with quantum data:', error);
    }
  }

  private determineTransactionType(tx: { from?: Principal; to?: Principal }): Transaction['type'] {
    if (!tx.from) return 'mint';
    if (!tx.to) return 'burn';
    return 'transfer';
  }

  private principalToAccountIdentifier(principal: Principal): string {
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