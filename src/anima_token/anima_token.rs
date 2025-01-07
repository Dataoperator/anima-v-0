use candid::{Decode, Encode};
use ic_cdk::api::call::CallResult;
use ic_cdk::api::{time, trap};
use ic_cdk::export::candid;
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

// Constants
const TOKEN_NAME: &str = "ANIMA Token";
const TOKEN_SYMBOL: &str = "ANIMA";
const DECIMALS: u8 = 8;
const TRANSFER_FEE: u128 = 10_000;
const GENESIS_AMOUNT: u128 = 1_000_000_000 * 10u128.pow(DECIMALS as u32);

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(candid::CandidType, Clone, Default)]
struct State {
    balances: HashMap<Principal, u128>,
    allowances: HashMap<(Principal, Principal), Allowance>,
    total_supply: u128,
    minting_account: Option<Account>,
    transactions: Vec<Transaction>,
}

#[derive(candid::CandidType, Clone)]
struct Account {
    owner: Principal,
    subaccount: Option<Vec<u8>>,
}

#[derive(candid::CandidType, Clone)]
struct Allowance {
    amount: u128,
    expires_at: Option<u64>,
}

#[derive(candid::CandidType, Clone)]
struct Transaction {
    from: Account,
    to: Account,
    amount: u128,
    fee: u128,
    memo: Option<Vec<u8>>,
    timestamp: u64,
}

#[derive(candid::CandidType)]
enum TransferError {
    BadFee { expected_fee: u128 },
    BadBurn { min_burn_amount: u128 },
    InsufficientFunds { balance: u128 },
    TooOld,
    CreatedInFuture { ledger_time: u64 },
    Duplicate { duplicate_of: u128 },
    TemporarilyUnavailable,
    GenericError { error_code: u128, message: String },
}

type TransferResult = Result<u128, TransferError>;

// Initialize the token
#[init]
fn init() {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.minting_account = Some(Account {
            owner: caller,
            subaccount: None,
        });
        state.balances.insert(caller, GENESIS_AMOUNT);
        state.total_supply = GENESIS_AMOUNT;
    });
}

// Token Metadata
#[query]
fn icrc1_name() -> String {
    TOKEN_NAME.to_string()
}

#[query]
fn icrc1_symbol() -> String {
    TOKEN_SYMBOL.to_string()
}

#[query]
fn icrc1_decimals() -> u8 {
    DECIMALS
}

#[query]
fn icrc1_fee() -> u128 {
    TRANSFER_FEE
}

#[query]
fn icrc1_total_supply() -> u128 {
    STATE.with(|state| state.borrow().total_supply)
}

#[query]
fn icrc1_minting_account() -> Option<Account> {
    STATE.with(|state| state.borrow().minting_account.clone())
}

// Balance operations
#[query]
fn icrc1_balance_of(account: Account) -> u128 {
    STATE.with(|state| {
        state.borrow().balances.get(&account.owner).copied().unwrap_or(0)
    })
}

// Transfer operation
#[update]
fn icrc1_transfer(args: TransferArgs) -> TransferResult {
    let caller = ic_cdk::caller();
    
    if args.amount == 0 {
        return Ok(0);
    }

    // Verify fee
    if let Some(fee) = args.fee {
        if fee != TRANSFER_FEE {
            return Err(TransferError::BadFee {
                expected_fee: TRANSFER_FEE,
            });
        }
    }

    // Check timing
    let now = time();
    if let Some(created_at_time) = args.created_at_time {
        if created_at_time > now {
            return Err(TransferError::CreatedInFuture { ledger_time: now });
        }
        if now - created_at_time > 24 * 60 * 60 * 1_000_000_000 {
            return Err(TransferError::TooOld);
        }
    }

    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Check balance
        let from_balance = state.balances.get(&args.from.owner).copied().unwrap_or(0);
        let total_debit = args.amount + TRANSFER_FEE;
        
        if from_balance < total_debit {
            return Err(TransferError::InsufficientFunds {
                balance: from_balance,
            });
        }

        // Update balances
        *state.balances.entry(args.from.owner).or_insert(0) -= total_debit;
        *state.balances.entry(args.to.owner).or_insert(0) += args.amount;

        // Record transaction
        let tx = Transaction {
            from: args.from,
            to: args.to,
            amount: args.amount,
            fee: TRANSFER_FEE,
            memo: args.memo,
            timestamp: now,
        };
        state.transactions.push(tx);

        Ok(state.transactions.len() as u128 - 1)
    })
}

// Approvals
#[query]
fn icrc2_allowance(args: AllowanceArgs) -> Allowance {
    STATE.with(|state| {
        state
            .borrow()
            .allowances
            .get(&(args.account.owner, args.spender.owner))
            .cloned()
            .unwrap_or(Allowance {
                amount: 0,
                expires_at: None,
            })
    })
}

#[update]
fn icrc2_approve(args: ApproveArgs) -> TransferResult {
    let caller = ic_cdk::caller();
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        state.allowances.insert(
            (caller, args.spender.owner),
            Allowance {
                amount: args.amount,
                expires_at: args.expires_at,
            },
        );
        
        Ok(0)
    })
}

// Types for args
#[derive(candid::CandidType)]
struct TransferArgs {
    from: Account,
    to: Account,
    amount: u128,
    fee: Option<u128>,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}

#[derive(candid::CandidType)]
struct AllowanceArgs {
    account: Account,
    spender: Account,
}

#[derive(candid::CandidType)]
struct ApproveArgs {
    from_subaccount: Option<Vec<u8>>,
    spender: Account,
    amount: u128,
    expires_at: Option<u64>,
    fee: Option<u128>,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}

// Generate Candid interface
ic_cdk::export_candid!();