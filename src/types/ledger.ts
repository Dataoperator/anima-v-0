import { Principal } from '@dfinity/principal';

export interface ICPTransfer {
  to: Uint8Array;
  fee: { e8s: bigint };
  memo: bigint;
  from_subaccount?: [] | [Uint8Array];
  created_at_time?: [] | [{ timestamp_nanos: bigint }];
  amount: { e8s: bigint };
}

export interface ICPBalance {
  e8s: bigint;
}

export type TransferResult = {
  Ok?: bigint;
  Err?: TransferError;
};

export interface TransferError {
  InsufficientFunds?: { balance: ICPBalance };
  TxDuplicate?: { duplicate_of: bigint };
  TxCreatedInFuture?: null;
  BadFee?: { expected_fee: ICPBalance };
  GenericError?: { message: string; error_code: bigint };
}

export interface LedgerService {
  account_balance: (args: { account: Uint8Array }) => Promise<ICPBalance>;
  transfer: (args: ICPTransfer) => Promise<TransferResult>;
}

export interface AccountIdentifier {
  hash: Uint8Array;
  principal: Principal;
  subaccount?: Uint8Array;
}

export enum TransferStatus {
  Pending = 'PENDING',
  Complete = 'COMPLETE',
  Failed = 'FAILED',
  TimedOut = 'TIMED_OUT'
}

export interface TransferState {
  status: TransferStatus;
  timestamp: number;
  blockHeight?: bigint;
  error?: string;
}

export interface PaymentVerification {
  amount: bigint;
  from: Principal;
  to: Uint8Array;
  timestamp: number;
  status: TransferStatus;
  memo?: bigint;
  blockHeight?: bigint;
}

export interface PaymentMetrics {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageAmount: bigint;
  averageProcessingTime: number;
}

export enum PaymentErrorCode {
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  InvalidAmount = 'INVALID_AMOUNT',
  InvalidRecipient = 'INVALID_RECIPIENT',
  TransactionFailed = 'TRANSACTION_FAILED',
  VerificationFailed = 'VERIFICATION_FAILED',
  Timeout = 'TIMEOUT',
  NetworkError = 'NETWORK_ERROR',
  UnknownError = 'UNKNOWN_ERROR'
}