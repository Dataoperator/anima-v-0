import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { ICPLedgerService, icpLedgerService } from './icp-ledger';
import { QuantumState } from '../quantum/types';
import { quantumStateService } from './quantum-state.service';
import { ErrorContext } from '@/types/error';
import { WalletState, SwapParams, TransactionResult } from '@/types/wallet';
import { animaActorService } from './anima-actor.service';
import { accountService } from './icp-account.service';

const ANIMA_CANISTER_ID = 'l2ilz-iqaaa-aaaaj-qngjq-cai';

class WalletService {
  private errorTracker: ErrorTracker;
  private state: WalletState = {
    balance: 0,
    animaBalance: 0,
    swapRate: 0,
    isInitialized: false,
    lastUpdate: 0,
    depositAddress: ''
  };

  constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  private async trackError(error: Error, context: ErrorContext) {
    await this.errorTracker.trackError({
      error,
      errorType: 'WALLET_ERROR',
      severity: ErrorSeverity.HIGH,
      context
    });
  }

  async generateDepositAddress(principal: Principal): Promise<string> {
    try {
      // Generate a deterministic subaccount for the user
      const subaccount = accountService.generateSubaccount(principal.toText());
      
      // Create account identifier
      const accountIdBytes = accountService.createAccountIdentifier(
        Principal.fromText(ANIMA_CANISTER_ID),
        subaccount
      );

      const address = accountService.accountToHex(accountIdBytes);
      
      this.state = {
        ...this.state,
        depositAddress: address,
        accountIdBytes
      };
      
      return address;
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Deposit address generation failed'),
        { operation: 'generate_address', principal: principal.toText() }
      );
      throw error;
    }
  }

  async initialize(principal: Principal): Promise<WalletState> {
    try {
      const depositAddress = await this.generateDepositAddress(principal);
      
      // Only proceed with balance check if account generation was successful
      if (this.state.accountIdBytes && accountService.validateAccountId(this.state.accountIdBytes)) {
        await this.refreshBalance(principal);
        await this.getSwapRate('icpToAnima');
      }
      
      this.state = {
        ...this.state,
        isInitialized: true,
        depositAddress
      };
      
      return this.state;
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Initialization failed'),
        { operation: 'wallet_init', principal: principal.toText() }
      );
      throw error;
    }
  }

  async refreshBalance(principal: Principal): Promise<void> {
    try {
      if (!this.state.accountIdBytes || !accountService.validateAccountId(this.state.accountIdBytes)) {
        throw new Error('Invalid account identifier');
      }

      const [icpBalance, animaBalance] = await Promise.all([
        icpLedgerService.account_balance({ account: this.state.accountIdBytes }),
        this.getAnimaBalance(principal)
      ]);

      this.state = {
        ...this.state,
        balance: Number(icpBalance.e8s) / 1e8,
        animaBalance,
        lastUpdate: Date.now()
      };
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Balance refresh failed'),
        { operation: 'refresh_balance', principal: principal.toText() }
      );
      throw error;
    }
  }

  async getAnimaBalance(principal: Principal): Promise<number> {
    try {
      if (!this.state.accountIdBytes || !accountService.validateAccountId(this.state.accountIdBytes)) {
        throw new Error('Invalid account identifier');
      }

      const actor = await this.getActor();
      const balance = await actor.token_balance({ 
        owner: principal,
        subaccount: this.state.accountIdBytes
      });
      return Number(balance.e8s) / 1e8;
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Get ANIMA balance failed'),
        { operation: 'anima_balance', principal: principal.toText() }
      );
      throw error;
    }
  }

  async getSwapRate(direction: 'icpToAnima' | 'animaToIcp'): Promise<number> {
    try {
      const quantumState = await quantumStateService.getQuantumStatus();
      const baseRate = direction === 'icpToAnima' ? 100 : 0.01;
      const quantumModifier = 1 + (quantumState.coherence * 0.1);
      
      this.state.swapRate = baseRate * quantumModifier;
      return this.state.swapRate;
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Get swap rate failed'),
        { operation: 'swap_rate', direction }
      );
      throw error;
    }
  }

  async swapTokens(params: SwapParams): Promise<TransactionResult> {
    try {
      if (!this.state.accountIdBytes || !accountService.validateAccountId(this.state.accountIdBytes)) {
        throw new Error('Invalid account identifier');
      }

      const currentRate = await this.getSwapRate(params.direction);
      const slippageTolerance = 0.01;
      const expectedRate = params.expectedOutput / params.amount;

      if (Math.abs(currentRate - expectedRate) / expectedRate > slippageTolerance) {
        throw new Error('Price slippage too high');
      }

      if (params.direction === 'icpToAnima') {
        const amountE8s = BigInt(Math.floor(params.amount * 1e8));
        await icpLedgerService.transfer({
          to: this.state.accountIdBytes,
          amount: { e8s: amountE8s },
          memo: BigInt(Date.now())
        });
      } else {
        const actor = await this.getActor();
        await actor.transfer({
          to: this.state.accountIdBytes,
          amount: { e8s: BigInt(Math.floor(params.amount * 1e8)) }
        });
      }

      return {
        success: true,
        txId: `swap_${Date.now()}`
      };
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Swap tokens failed'),
        { operation: 'swap_tokens', params: JSON.stringify(params) }
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Swap failed'
      };
    }
  }

  async mintAnima(amount: number): Promise<TransactionResult> {
    try {
      if (!this.state.accountIdBytes || !accountService.validateAccountId(this.state.accountIdBytes)) {
        throw new Error('Invalid account identifier');
      }

      const quantumState = await quantumStateService.getQuantumStatus();
      if (quantumState.coherence < 0.5) {
        throw new Error('Quantum coherence too low for minting');
      }

      const amountE8s = BigInt(Math.floor(amount * 1e8));
      const actor = await this.getActor();
      
      await actor.mint({
        to: this.state.accountIdBytes,
        amount: { e8s: amountE8s },
        quantum_state: quantumState
      });

      return {
        success: true,
        txId: `mint_${Date.now()}`
      };
    } catch (error) {
      await this.trackError(
        error instanceof Error ? error : new Error('Mint ANIMA failed'),
        { operation: 'mint_anima', amount: amount.toString() }
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mint failed'
      };
    }
  }

  getState(): WalletState {
    return { ...this.state };
  }

  private async getActor(): Promise<ActorSubclass<any>> {
    try {
      const actor = animaActorService.createActor(ANIMA_CANISTER_ID);
      if (!actor) {
        throw new Error('Failed to create actor');
      }
      return actor;
    } catch (error) {
      throw new Error(`Actor creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const walletService = new WalletService();