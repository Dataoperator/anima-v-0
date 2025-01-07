import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';
import { ICPLedgerService, icpLedgerService } from './icp-ledger';
import { QuantumState } from '../quantum/types';
import { quantumStateService } from './quantum-state.service';
import { ErrorContext } from '@/types/error';
import { AccountIdentifier } from '@dfinity/nns';

export interface WalletState {
  balance: number;
  animaBalance: number;
  swapRate: number;
  isInitialized: boolean;
  lastUpdate: number;
  depositAddress: string;
}

export interface SwapParams {
  amount: number;
  direction: 'icpToAnima' | 'animaToIcp';
  expectedOutput: number;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  txId?: string;
}

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
      // Generate a unique deposit address for the user based on their II principal
      const accountIdentifier = AccountIdentifier.fromPrincipal({
        principal,
        // We can add subaccounts later for multiple addresses
        subAccount: undefined
      });

      this.state.depositAddress = accountIdentifier.toHex();
      return this.state.depositAddress;
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
      await this.refreshBalance(principal);
      await this.getSwapRate('icpToAnima');
      
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
      const [icpBalance, animaBalance] = await Promise.all([
        icpLedgerService.getBalance(this.state.depositAddress),
        this.getAnimaBalance(principal)
      ]);

      this.state = {
        ...this.state,
        balance: Number(icpBalance) / 1e8, // Convert from e8s to ICP
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
      const actor = await this.getActor(principal);
      const balance = await actor.token_balance();
      return Number(balance) / 1e8;
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
      const currentRate = await this.getSwapRate(params.direction);
      const slippageTolerance = 0.01; // 1%
      const expectedRate = params.expectedOutput / params.amount;

      if (Math.abs(currentRate - expectedRate) / expectedRate > slippageTolerance) {
        throw new Error('Price slippage too high');
      }

      if (params.direction === 'icpToAnima') {
        // Convert ICP to ANIMA
        const amountE8s = BigInt(Math.floor(params.amount * 1e8));
        await icpLedgerService.transfer({
          to: Principal.fromText(process.env.ANIMA_CANISTER_ID || ''),
          amount: amountE8s,
          memo: BigInt(Date.now())
        });
      } else {
        // Convert ANIMA to ICP
        const actor = await this.getActor(Principal.fromText(process.env.ANIMA_CANISTER_ID || ''));
        await actor.transfer({
          to: this.state.depositAddress,
          amount: BigInt(Math.floor(params.amount * 1e8))
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
      const quantumState = await quantumStateService.getQuantumStatus();
      if (quantumState.coherence < 0.5) {
        throw new Error('Quantum coherence too low for minting');
      }

      const amountE8s = BigInt(Math.floor(amount * 1e8));
      const actor = await this.getActor(Principal.fromText(process.env.ANIMA_CANISTER_ID || ''));
      
      await actor.mint({
        to: this.state.depositAddress,
        amount: amountE8s,
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

  private async getActor(principal: Principal): Promise<ActorSubclass<any>> {
    // Implementation of actor creation
    return {} as ActorSubclass<any>;
  }
}

export const walletService = new WalletService();