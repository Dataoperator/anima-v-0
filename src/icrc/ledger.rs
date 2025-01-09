use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use crate::error::{Result, AnimaError};
use crate::icrc::types::TransactionDetails;

pub const LEDGER_CANISTER_ID: &str = "ryjl3-tyaaa-aaaaa-aaaba-cai";

#[derive(Debug)]
pub enum PaymentVerificationError {
    InsufficientFunds,
    TransferFailed(String),
    InvalidAmount,
    Timeout,
}

impl From<PaymentVerificationError> for AnimaError {
    fn from(e: PaymentVerificationError) -> Self {
        match e {
            PaymentVerificationError::InsufficientFunds => AnimaError::InsufficientBalance,
            PaymentVerificationError::TransferFailed(msg) => AnimaError::PaymentFailed(msg),
            PaymentVerificationError::InvalidAmount => AnimaError::InvalidAmount("Invalid payment amount".to_string()),
            PaymentVerificationError::Timeout => AnimaError::PaymentTimeout,
        }
    }
}

pub async fn verify_icp_transfer(
    from: Principal,
    amount: &Nat,
    block_height: Option<u64>,
) -> Result<bool> {
    validate_payment_amount(amount, &get_required_amount())?;

    let block = match block_height {
        Some(h) => h,
        None => {
            let ledger = Principal::from_text(LEDGER_CANISTER_ID)
                .map_err(|_| AnimaError::InvalidCanister)?;

            let result: CallResult<(Nat,)> = ic_cdk::api::call::call(
                ledger,
                "icrc1_total_supply",
                (),
            ).await;

            match result {
                Ok((height,)) => {
                    let height_str = height.to_string();
                    height_str.parse::<u64>()
                        .map_err(|_| AnimaError::PaymentFailed("Invalid block height".to_string()))?
                },
                Err((_, msg)) => return Err(AnimaError::PaymentFailed(msg))
            }
        }
    };

    let transfer_valid = verify_block_transfer(block, from, amount).await?;

    if !transfer_valid {
        return Err(AnimaError::PaymentValidationFailed);
    }

    Ok(true)
}

async fn verify_block_transfer(block: u64, from: Principal, expected_amount: &Nat) -> Result<bool> {
    let ledger = Principal::from_text(LEDGER_CANISTER_ID)
        .map_err(|_| AnimaError::InvalidCanister)?;

    let args = (block,);
    let result: CallResult<(TransactionDetails,)> = ic_cdk::api::call::call(
        ledger, 
        "get_transaction",
        args,
    ).await;

    match result {
        Ok((tx,)) => {
            if tx.from == from && tx.amount == *expected_amount {
                Ok(true)
            } else {
                Ok(false)
            }
        },
        Err((_, msg)) => Err(AnimaError::PaymentFailed(msg))
    }
}

pub fn validate_payment_amount(amount: &Nat, required_amount: &Nat) -> Result<()> {
    if amount < required_amount {
        Err(PaymentVerificationError::InsufficientFunds.into())
    } else {
        Ok(())
    }
}

fn get_required_amount() -> Nat {
    Nat::from(100_000_000u64) // 1 ICP in e8s
}