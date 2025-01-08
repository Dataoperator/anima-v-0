import { Principal } from '@dfinity/principal';
import { WalletService } from './wallet.service';
import { ErrorTracker } from './error-tracker';
import { ic } from '@dfinity/agent';

export class TreasuryService {
  private static instance: TreasuryService | null = null;
  private errorTracker: ErrorTracker;
  
  // Our project canister ID from dfx.json
  private readonly PROJECT_CANISTER_ID = 'l2ilz-iqaaa-aaaaj-qngjq-cai';
  private readonly ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
  
  // Fixed exchange rate: 1 ICP = 10000 ANIMA
  private readonly EXCHANGE_RATE = BigInt(10000);

  private constructor(private walletService: WalletService) {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(walletService: WalletService): TreasuryService {
    if (!TreasuryService.instance) {
      TreasuryService.instance = new TreasuryService(walletService);
    }
    return TreasuryService.instance;
  }

  async processSwap(from: Principal, icpAmount: bigint): Promise<bigint> {
    try {
      // Calculate ANIMA amount
      const animaAmount = icpAmount * this.EXCHANGE_RATE;

      // Transfer ICP to project canister
      const blockHeight = await this.transferToTreasury(from, icpAmount);

      // Record the transaction
      await this.recordTreasuryTransaction({
        from: from.toString(),
        type: 'SWAP',
        icpAmount,
        animaAmount,
        blockHeight: blockHeight.toString(),
        timestamp: Date.now()
      });

      return animaAmount;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'SwapProcessingError',
        message: error instanceof Error ? error.message : 'Failed to process swap',
        context: {
          from: from.toString(),
          icpAmount: icpAmount.toString()
        }
      });
      throw error;
    }
  }

  private async transferToTreasury(from: Principal, amount: bigint): Promise<bigint> {
    // ICP ledger transfer args
    const transferArgs = {
      memo: BigInt(Date.now()),
      amount: { e8s: amount },
      fee: { e8s: BigInt(10000) }, // 0.0001 ICP fee
      from_subaccount: [], // default subaccount
      to: this.PROJECT_CANISTER_ID,
      created_at_time: []
    };

    try {
      // Call ICP ledger transfer
      const result = await ic.call(this.ICP_LEDGER_CANISTER_ID, {
        methodName: 'transfer',
        args: [transferArgs],
      });

      return result.Ok;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TreasuryTransferError',
        message: error instanceof Error ? error.message : 'Transfer to treasury failed',
        context: {
          from: from.toString(),
          amount: amount.toString()
        }
      });
      throw error;
    }
  }

  private async recordTreasuryTransaction(tx: {
    from: string;
    type: 'SWAP' | 'WITHDRAWAL';
    icpAmount: bigint;
    animaAmount: bigint;
    blockHeight: string;
    timestamp: number;
  }): Promise<void> {
    try {
      // Call our project canister to record the transaction
      await ic.call(this.PROJECT_CANISTER_ID, {
        methodName: 'record_treasury_transaction',
        args: [tx],
      });
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransactionRecordError',
        message: error instanceof Error ? error.message : 'Failed to record transaction',
        context: tx
      });
      // Note: We don't throw here as the transfer already succeeded
      console.error('Failed to record transaction:', error);
    }
  }

  async getTreasuryBalance(): Promise<bigint> {
    try {
      const balance = await ic.call(this.ICP_LEDGER_CANISTER_ID, {
        methodName: 'account_balance',
        args: [{
          owner: Principal.fromText(this.PROJECT_CANISTER_ID),
          subaccount: []
        }],
      });
      return balance.e8s;
    } catch (error) {
      this.errorTracker.trackError({
        type: 'BalanceCheckError',
        message: error instanceof Error ? error.message : 'Failed to check treasury balance',
        context: { canisterId: this.PROJECT_CANISTER_ID }
      });
      throw error;
    }
  }

  async getTransactionHistory(): Promise<any[]> {
    try {
      return await ic.call(this.PROJECT_CANISTER_ID, {
        methodName: 'get_treasury_transactions',
        args: [],
      });
    } catch (error) {
      this.errorTracker.trackError({
        type: 'TransactionHistoryError',
        message: error instanceof Error ? error.message : 'Failed to get transaction history',
        context: {}
      });
      throw error;
    }
  }
}