import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';

interface ICPTransfer {
  amount: { e8s: bigint };
  fee: { e8s: bigint };
  memo: bigint;
  from_subaccount?: number[];
  to: string | Principal;
  created_at_time?: bigint;
}

interface TransactionResponse {
  height: bigint;
  blockId: string;
}

export class ICPLedgerService {
  private static instance: ICPLedgerService | null = null;
  private errorTracker: ErrorTracker;
  private readonly DEFAULT_FEE = BigInt(10_000);
  private readonly DEFAULT_SUBACCOUNT = [];
  private initialized: boolean = false;

  private constructor(private ledgerActor: ActorSubclass) {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(ledgerActor: ActorSubclass): ICPLedgerService {
    if (!ICPLedgerService.instance) {
      ICPLedgerService.instance = new ICPLedgerService(ledgerActor);
    }
    return ICPLedgerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Verify actor connection with a simple call
      await this.ledgerActor.icrc1_name();
      this.initialized = true;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'LedgerInitializationError',
        category: ErrorCategory.Technical,
        severity: ErrorSeverity.High,
        message: 'Failed to initialize ICP ledger',
        timestamp: new Date(),
        context: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
  }

  async transfer(args: {
    to: Principal | string;
    amount: bigint;
    memo?: bigint;
    fee?: bigint;
    fromSubaccount?: number[];
  }): Promise<TransactionResponse> {
    if (!this.initialized) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      const transfer: ICPTransfer = {
        amount: { e8s: args.amount },
        fee: { e8s: args.fee || this.DEFAULT_FEE },
        memo: args.memo || BigInt(0),
        from_subaccount: args.fromSubaccount || this.DEFAULT_SUBACCOUNT,
        to: args.to,
        created_at_time: [],
      };

      const result = await this.ledgerActor.transfer(transfer);

      if ('Ok' in result) {
        return {
          height: result.Ok,
          blockId: result.Ok.toString(),
        };
      } else if ('Err' in result) {
        throw new Error(JSON.stringify(result.Err));
      }

      throw new Error('Unknown transfer response format');
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransferError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Transfer failed',
        timestamp: new Date(),
        context: { args }
      });
      throw error;
    }
  }

  async getBalance(principal: Principal): Promise<bigint> {
    if (!this.initialized) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      const result = await this.ledgerActor.account_balance({
        account: principal,
      });
      return result.e8s;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'BalanceCheckError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Balance check failed',
        timestamp: new Date(),
        context: { principal: principal.toString() }
      });
      throw error;
    }
  }

  async getTransactions(args: {
    start: bigint;
    length: bigint;
  }): Promise<{
    transactions: Array<{
      timestamp: bigint;
      transfer: ICPTransfer;
      type: 'transfer' | 'mint' | 'burn';
    }>;
  }> {
    if (!this.initialized) {
      throw new Error('ICPLedgerService not initialized');
    }

    try {
      return await this.ledgerActor.get_transactions(args);
    } catch (error) {
      this.errorTracker.trackError({
        type: 'GetTransactionsError',
        category: ErrorCategory.PAYMENT,
        severity: ErrorSeverity.HIGH,
        message: error instanceof Error ? error.message : 'Get transactions failed',
        timestamp: new Date(),
        context: { args }
      });
      throw error;
    }
  }

  formatICP(amount: bigint): string {
    return `${Number(amount) / 100_000_000} ICP`;
  }

  validateTransferAmount(amount: bigint): boolean {
    return amount > 0 && amount < BigInt(Number.MAX_SAFE_INTEGER);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  dispose(): void {
    this.initialized = false;
    ICPLedgerService.instance = null;
  }
}