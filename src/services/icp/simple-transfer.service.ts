import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { animaActorService } from '../anima-actor.service';
import { ErrorTracker } from '../error-tracker';

// ANIMA canister ID from dfx.json
const ANIMA_CANISTER_ID = 'l2ilz-iqaaa-aaaaj-qngjq-cai';
const ICP_TO_ANIMA_RATE = 10_000n; // 1 ICP = 10,000 ANIMA

interface TransferResult {
  success: boolean;
  txId?: string;
  error?: string;
}

export class SimpleTransferService {
  private static instance: SimpleTransferService | null = null;
  private errorTracker = ErrorTracker.getInstance();

  static getInstance(): SimpleTransferService {
    if (!SimpleTransferService.instance) {
      SimpleTransferService.instance = new SimpleTransferService();
    }
    return SimpleTransferService.instance;
  }

  private constructor() {}

  async transferICP(
    fromPrincipal: Principal,
    amount: bigint
  ): Promise<TransferResult> {
    try {
      // Get actor interface
      const actor = await animaActorService.createActor();

      // Create account identifier for treasury
      const treasuryId = AccountIdentifier.fromPrincipal({
        principal: Principal.fromText(ANIMA_CANISTER_ID),
      });

      // Process ICP transfer
      const result = await actor.icrc1_transfer({
        from_subaccount: [], // Default subaccount
        to: {
          owner: ANIMA_CANISTER_ID,
          subaccount: []
        },
        amount,
        fee: [],
        memo: [],
        created_at_time: []
      });

      if ('Err' in result) {
        throw new Error(`Transfer failed: ${JSON.stringify(result.Err)}`);
      }

      return {
        success: true,
        txId: result.Ok.toString()
      };

    } catch (error) {
      this.errorTracker.trackError({
        type: 'ICP_TRANSFER_ERROR',
        severity: 'HIGH',
        context: {
          fromPrincipal: fromPrincipal.toText(),
          amount: amount.toString()
        },
        error: error as Error
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  async mintANIMA(
    toPrincipal: Principal,
    icpAmount: bigint
  ): Promise<TransferResult> {
    try {
      const actor = await animaActorService.createActor();
      const animaAmount = icpAmount * ICP_TO_ANIMA_RATE;

      // Mint ANIMA tokens
      const result = await actor.mint({
        to: toPrincipal,
        amount: animaAmount
      });

      if ('Err' in result) {
        throw new Error(`Minting failed: ${JSON.stringify(result.Err)}`);
      }

      return {
        success: true,
        txId: result.Ok.toString()
      };

    } catch (error) {
      this.errorTracker.trackError({
        type: 'ANIMA_MINT_ERROR',
        severity: 'HIGH',
        context: {
          toPrincipal: toPrincipal.toText(),
          icpAmount: icpAmount.toString(),
          animaAmount: (icpAmount * ICP_TO_ANIMA_RATE).toString()
        },
        error: error as Error
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Minting failed'
      };
    }
  }

  async swapICPToANIMA(
    principal: Principal,
    icpAmount: bigint
  ): Promise<TransferResult> {
    try {
      // Step 1: Transfer ICP to treasury
      const icpTransfer = await this.transferICP(principal, icpAmount);
      if (!icpTransfer.success) {
        throw new Error(`ICP transfer failed: ${icpTransfer.error}`);
      }

      // Step 2: Mint ANIMA tokens
      const animaMint = await this.mintANIMA(principal, icpAmount);
      if (!animaMint.success) {
        throw new Error(`ANIMA minting failed: ${animaMint.error}`);
      }

      return {
        success: true,
        txId: `${icpTransfer.txId}-${animaMint.txId}`
      };

    } catch (error) {
      this.errorTracker.trackError({
        type: 'SWAP_ERROR',
        severity: 'HIGH',
        context: {
          principal: principal.toText(),
          icpAmount: icpAmount.toString()
        },
        error: error as Error
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap failed'
      };
    }
  }

  async getICPBalance(principal: Principal): Promise<bigint> {
    try {
      const actor = await animaActorService.createActor();
      const accountId = AccountIdentifier.fromPrincipal({
        principal,
      });

      const balance = await actor.account_balance({
        account: accountId.toUint8Array()
      });

      return balance;
    } catch (error) {
      console.error('Failed to get ICP balance:', error);
      throw error;
    }
  }

  async getANIMABalance(principal: Principal): Promise<bigint> {
    try {
      const actor = await animaActorService.createActor();
      const balance = await actor.icrc1_balance_of({
        owner: principal,
        subaccount: []
      });

      return balance;
    } catch (error) {
      console.error('Failed to get ANIMA balance:', error);
      throw error;
    }
  }
}

export const simpleTransferService = SimpleTransferService.getInstance();