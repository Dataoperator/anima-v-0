import { ActorSubclass, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/nns';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { LEDGER_CONFIG } from './icp/ledger';

export interface TransferParams {
  to: Principal;
  amount: bigint;
  memo?: bigint;
  notify?: boolean;
}

export class ICPLedgerService {
  private static instance: ICPLedgerService | null = null;
  private initialized = false;
  private actor: ActorSubclass | null = null;
  private errorTracker: ErrorTracker;

  constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): ICPLedgerService {
    if (!ICPLedgerService.instance) {
      ICPLedgerService.instance = new ICPLedgerService();
    }
    return ICPLedgerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // The actor will be initialized by the auth process
      // and attached to the window.ic.ledgerActor
      this.actor = (window as any).ic?.ledgerActor;
      if (!this.actor) {
        throw new Error('Ledger actor not found');
      }

      await this.verifyConnection();
      this.initialized = true;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'LedgerInitializationError',
        category: ErrorCategory.Technical,
        severity: ErrorSeverity.Critical,
        message: 'Failed to initialize ICP ledger service',
        timestamp: new Date(),
        context: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
  }

  private async verifyConnection(): Promise<void> {
    if (!this.actor) throw new Error('Ledger actor not initialized');
    
    try {
      // Try to get the ledger name to verify connection
      const name = await this.actor.icrc1_name();
      if (name !== 'Internet Computer') {
        throw new Error('Invalid ledger canister');
      }
    } catch (error) {
      throw new Error('Failed to verify ledger connection: ' + 
        (error instanceof Error ? error.message : String(error)));
    }
  }

  async transfer(params: TransferParams): Promise<bigint> {
    if (!this.initialized || !this.actor) {
      throw new Error('ICP Ledger service not initialized');
    }

    try {
      const toAccount = AccountIdentifier.fromPrincipal({
        principal: params.to,
        subAccount: undefined
      });

      const result = await this.actor.transfer({
        memo: params.memo || BigInt(0),
        amount: { e8s: params.amount },
        fee: { e8s: LEDGER_CONFIG.DEFAULT_FEE },
        from_subaccount: [],
        to: toAccount.toUint8Array(),
        created_at_time: []
      });

      if ('Err' in result) {
        throw new Error(JSON.stringify(result.Err));
      }

      return result.Ok;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransferError',
        category: ErrorCategory.Payment,
        severity: ErrorSeverity.High,
        message: 'Failed to process ICP transfer',
        timestamp: new Date(),
        context: {
          to: params.to.toString(),
          amount: params.amount.toString(),
          error: error instanceof Error ? error.message : String(error)
        }
      });
      throw error;
    }
  }

  async getBalance(accountId: string): Promise<bigint> {
    if (!this.initialized || !this.actor) {
      throw new Error('ICP Ledger service not initialized');
    }

    try {
      // Convert hex account ID to Uint8Array
      const accountBytes = new Uint8Array(
        accountId.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );

      const result = await this.actor.account_balance({
        account: accountBytes
      });

      return result.e8s;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'BalanceCheckError',
        category: ErrorCategory.Payment,
        severity: ErrorSeverity.Medium,
        message: 'Failed to get account balance',
        timestamp: new Date(),
        context: {
          accountId,
          error: error instanceof Error ? error.message : String(error)
        }
      });
      throw error;
    }
  }

  async getTransactionFee(): Promise<bigint> {
    return LEDGER_CONFIG.DEFAULT_FEE;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getActor(): ActorSubclass | null {
    return this.actor;
  }
}

export const icpLedgerService = ICPLedgerService.getInstance();