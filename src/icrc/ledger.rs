use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::{call, time};

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<[u8; 32]>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct TransferArg {
    pub from_subaccount: Option<[u8; 32]>,
    pub to: Account,
    pub amount: Nat,
    pub fee: Option<Nat>,
    pub memo: Option<[u8; 32]>,
    pub created_at_time: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct TransferError {
    pub kind: TransferErrorKind,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub enum TransferErrorKind {
    BadFee { expected_fee: Nat },
    BadBurn { min_burn_amount: Nat },
    InsufficientFunds { balance: Nat },
    TooOld,
    CreatedInFuture { ledger_time: u64 },
    TemporarilyUnavailable,
    Duplicate { duplicate_of: Nat },
    GenericError { error_code: Nat, message: String },
}

#[derive(CandidType, Debug)]
pub enum PaymentVerificationError {
    InsufficientFunds,
    TransferFailed(String),
    InvalidAmount,
    Timeout,
}

pub const LEDGER_CANISTER_ID: &str = "ryjl3-tyaaa-aaaaa-aaaba-cai";

pub async fn verify_icp_transfer(
    from: Principal,
    amount: Nat,
    block_height: Nat,
    timeout_secs: u64,
) -> Result<bool, PaymentVerificationError> {
    let start_time = time();
    let timeout = start_time + (timeout_secs * 1_000_000_000);

    while time() < timeout {
        let args = TransferArg {
            from_subaccount: None,
            to: Account {
                owner: from,
                subaccount: None,
            },
            amount,
            fee: None,
            memo: None,
            created_at_time: Some(time()),
        };

        match call(Principal::from_text(LEDGER_CANISTER_ID).unwrap(), "icrc1_transfer", (args,)).await {
            Ok(result) => {
                match result {
                    Ok(_) => return Ok(true),
                    Err(e) => {
                        match e.kind {
                            TransferErrorKind::InsufficientFunds { .. } => {
                                return Err(PaymentVerificationError::InsufficientFunds)
                            }
                            _ => continue,
                        }
                    }
                }
            }
            Err(e) => {
                if time() >= timeout {
                    return Err(PaymentVerificationError::Timeout);
                }
                // Wait briefly before retrying
                std::thread::sleep(std::time::Duration::from_secs(1));
                continue;
            }
        }
    }

    Err(PaymentVerificationError::Timeout)
}

pub fn validate_payment_amount(amount: Nat, required_amount: Nat) -> Result<(), PaymentVerificationError> {
    if amount < required_amount {
        Err(PaymentVerificationError::InvalidAmount)
    } else {
        Ok(())
    }
}