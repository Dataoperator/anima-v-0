export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const AccountBalanceArgs = IDL.Record({ 'account' : Account });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const TransferArgs = IDL.Record({
    'to' : IDL.Text,
    'fee' : Tokens,
    'memo' : IDL.Nat64,
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(TimeStamp),
    'amount' : Tokens,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  return IDL.Service({
    'account_balance' : IDL.Func([AccountBalanceArgs], [Tokens], ['query']),
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
