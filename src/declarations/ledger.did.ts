import { IDL } from '@dfinity/candid';

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Timestamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const TransferArgs = IDL.Record({
    'to' : AccountIdentifier,
    'fee' : Tokens,
    'memo' : IDL.Nat64,
    'from_subaccount' : IDL.Opt(AccountIdentifier),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : Tokens,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat64,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(AccountIdentifier),
  });
  const BalanceArgs = IDL.Record({ 'account' : AccountIdentifier });

  return IDL.Service({
    'account_balance' : IDL.Func([BalanceArgs], [Tokens], ['query']),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
  });
};