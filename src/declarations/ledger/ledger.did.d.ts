import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface AccountBalanceArgs { 'account' : Account }
export type BlockIndex = bigint;
export interface TimeStamp { 'timestamp_nanos' : bigint }
export interface Tokens { 'e8s' : bigint }
export interface TransferArgs {
  'to' : string,
  'fee' : Tokens,
  'memo' : bigint,
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [TimeStamp],
  'amount' : Tokens,
}
export type TransferError = {
    'TxTooOld' : { 'allowed_window_nanos' : bigint }
  } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockIndex } } |
  { 'TxCreatedInFuture' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferResult = { 'Ok' : BlockIndex } |
  { 'Err' : TransferError };
export interface _SERVICE {
  'account_balance' : ActorMethod<[AccountBalanceArgs], Tokens>,
  'icrc1_balance_of' : ActorMethod<[Account], bigint>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, string]>>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'transfer' : ActorMethod<[TransferArgs], TransferResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
