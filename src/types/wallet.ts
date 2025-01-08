import { Principal } from '@dfinity/principal';

export interface WalletState {
  balance: number;
  animaBalance: number;
  swapRate: number;
  isInitialized: boolean;
  lastUpdate: number;
  depositAddress: string;
  rawAddress?: Uint8Array;
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

export interface DepositAddressInfo {
  address: string;
  rawAddress: Uint8Array;
  principal: Principal;
  subaccount?: number[];
}