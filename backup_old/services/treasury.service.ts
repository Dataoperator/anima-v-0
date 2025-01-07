import { Principal } from '@dfinity/principal';
import { ICPLedgerService } from './icp-ledger';
import { ErrorTracker } from '@/error/quantum_error';

const TREASURY_PRINCIPAL = 'l2ilz-iqaaa-aaaaj-qngjq-cai'; // Replace with actual treasury principal
const GENESIS_FEE = BigInt(100_000_000); // 1 ICP

export class TreasuryService {
  private static instance: TreasuryService;
  private errorTracker: ErrorTracker;
  private transferHistory: Map<string, {
    amount: bigint;
    timestamp: number;
    status: 'pending' | 'complete' | 'failed';
    transactionId?: string;
  }>;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    this.transferHistory = new Map();
  }

  static getInstance(): TreasuryService {
    if (!TreasuryService.instance) {
      TreasuryService.instance = new TreasuryService();
    }
    return TreasuryService.instance;
  }

  async processGenesisFee(ledger: ICPLedgerService): Promise<{ success: boolean; transactionId?: string }> {
    console.log('🔄 Processing genesis fee transfer...');
    
    try {
      const balance = await ledger.getBalance();
      if (balance < GENESIS_FEE) {
        throw new Error(`Insufficient balance: ${Number(balance) / 100_000_000} ICP`);
      }

      const transferId = `genesis-${Date.now()}`;
      this.transferHistory.set(transferId, {
        amount: GENESIS_FEE,
        timestamp: Date.now(),
        status: 'pending'
      });

      // Transfer to treasury
      const result = await ledger.transfer({
        to: Principal.fromText(TREASURY_PRINCIPAL),
        amount: GENESIS_FEE,
        memo: BigInt(Date.now()),
        fee: BigInt(10000) // 0.0001 ICP fee
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const transactionId = result.Ok.toString();
      
      // Update history
      this.transferHistory.set(transferId, {
        amount: GENESIS_FEE,
        timestamp: Date.now(),
        status: 'complete',
        transactionId
      });

      console.log('✅ Genesis fee transferred successfully');
      console.log('📝 Transaction ID:', transactionId);

      return {
        success: true,
        transactionId
      };

    } catch (error) {
      console.error('❌ Genesis fee transfer failed:', error);

      await this.errorTracker.trackError({
        errorType: 'TREASURY_TRANSFER',
        severity: 'HIGH',
        context: 'Genesis Fee Processing',
        error: error as Error
      });

      return {
        success: false
      };
    }
  }

  async verifyTransfer(transactionId: string): Promise<boolean> {
    // Verify the transaction status on-chain
    // This would call your ledger's verification method
    try {
      // Add verification logic here
      return true;
    } catch (error) {
      console.error('❌ Transfer verification failed:', error);
      return false;
    }
  }

  getTransferHistory(): Map<string, any> {
    return new Map(this.transferHistory);
  }

  getTransferStatus(transferId: string) {
    return this.transferHistory.get(transferId);
  }
}

export const treasuryService = TreasuryService.getInstance();