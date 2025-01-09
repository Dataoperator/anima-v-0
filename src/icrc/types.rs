use candid::{CandidType, Principal, Nat};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, CandidType, Serialize, Deserialize, PartialEq, Eq)]
pub struct TransferArgs {
    pub to: Principal,
    pub amount: Nat,
    pub fee: Option<Nat>,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct TransactionDetails {
    pub from: Principal,
    pub to: Principal,
    pub amount: Nat,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize, PartialEq, Eq)]
pub enum AcceptedToken {
    ICP,
    ANIMA
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PaymentRecord {
    pub token: AcceptedToken,
    pub amount: Nat,
    pub block: u64,
    pub timestamp: u64,
}

pub type BlockIndex = u64;
pub type Memo = Vec<u8>;
pub type Tokens = u128;