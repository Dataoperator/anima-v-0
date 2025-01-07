import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }: { IDL: typeof IDL }) => {
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Timestamp = IDL.Record({ 'timestamp_nanos': IDL.Nat64 });
  const TransferArgs = IDL.Record({
    'to' : IDL.Vec(IDL.Nat8),
    'fee' : Tokens,
    'memo' : IDL.Nat64,
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Tokens
  });
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos': IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee': Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of': IDL.Nat64 }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance': Tokens })
  });
  const TransferResult = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : TransferError
  });
  const AccountBalanceArgs = IDL.Record({
    'account': IDL.Vec(IDL.Nat8)
  });

  const Account = IDL.Record({
    'owner': IDL.Principal,
    'subaccount': IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  
  const ICRCTransferArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat
  });

  const ICRCTransferError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat
    }),
    'TemporarilyUnavailable': IDL.Null,
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });

  const ICRCTransferResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': ICRCTransferError
  });

  return IDL.Service({
    'account_balance' : IDL.Func([AccountBalanceArgs], [Tokens], ['query']),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'icrc1_balance_of': IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_transfer': IDL.Func([ICRCTransferArgs], [ICRCTransferResult], [])
  });
};