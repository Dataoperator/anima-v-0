export const LEDGER_CONFIG = {
  MAINNET_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai', // ICP Ledger canister ID
  TREASURY_PRINCIPAL: 'l2ilz-iqaaa-aaaaj-qngjq-cai', // Your ANIMA treasury principal
  TREASURY_ACCOUNT_ID: '', // Will be computed from treasury principal
  DEFAULT_FEE: BigInt(10_000), // 0.0001 ICP
  MIN_TRANSFER: BigInt(1_00_000_000), // 1 ICP
  MAX_TRANSFER: BigInt(100_00_000_000), // 100 ICP
  QUANTUM_THRESHOLDS: {
    STABILITY: 0.7,
    COHERENCE: 0.8,
    ENTANGLEMENT: 0.5
  },
  SYNC_INTERVAL: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
};

export const ICP_DECIMALS = 8;

export type Tokens = {
  e8s: bigint;
};

export type TransferArgs = {
  to: Uint8Array;
  fee: Tokens;
  memo: bigint;
  from_subaccount?: Uint8Array[];
  created_at_time?: {
    timestamp_nanos: bigint;
  }[];
  amount: Tokens;
};

export type TransferError = {
  kind: 'TxTooOld' | 'BadFee' | 'TxDuplicate' | 'TxCreatedInFuture' | 'InsufficientFunds';
  message: string;
  data?: any;
};

export type TransferResult = {
  Ok?: bigint;
  Err?: TransferError;
};

export type AccountBalanceArgs = {
  account: Uint8Array;
};

// Re-export the IDL factory
export { idlFactory } from './ledger.did';