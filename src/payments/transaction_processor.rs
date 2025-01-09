use candid::{Principal, Nat};
use ic_cdk::api::call::CallResult;
use crate::error::{Result, AnimaError};
use crate::icrc::types::{TransferArgs, AcceptedToken};

pub struct PaymentProcessor {
    owner: Principal,
    accepted_tokens: Vec<(AcceptedToken, u64)>,
}

impl PaymentProcessor {
    pub fn new(owner: Principal) -> Self {
        let accepted_tokens = vec![
            (AcceptedToken::ICP, 100_000_000),   // 1 ICP in e8s
            (AcceptedToken::ANIMA, 1_000_000),   // 1 ANIMA token
        ];

        Self {
            owner,
            accepted_tokens,
        }
    }

    pub async fn transfer(
        &self,
        to: Principal,
        amount: u128,
        token_type: AcceptedToken,
        memo: Option<Vec<u8>>,
    ) -> Result<u64> {
        // Validate amount meets minimum
        if amount < self.get_minimum_amount(&token_type) {
            return Err(AnimaError::InvalidAmount("Amount below minimum".to_string()));
        }

        // Create transfer arguments
        let args = TransferArgs {
            to,
            amount: Nat::from(amount),
            fee: None,
            memo: memo.map(|m| m.to_vec()),
            created_at_time: Some(ic_cdk::api::time()),
        };

        // Get token canister ID
        let token_canister = self.get_token_canister(&token_type)?;

        // Execute transfer
        let result: CallResult<(u64,)> = ic_cdk::api::call::call(
            token_canister,
            "icrc1_transfer",
            (args,),
        ).await;

        match result {
            Ok((block_index,)) => Ok(block_index),
            Err((code, msg)) => Err(AnimaError::TransactionFailed(
                format!("{:?}: {}", code, msg)
            )),
        }
    }

    fn get_minimum_amount(&self, token_type: &AcceptedToken) -> u128 {
        self.accepted_tokens
            .iter()
            .find(|(t, _)| t == token_type)
            .map(|(_, min)| *min as u128)
            .unwrap_or(0)
    }

    fn get_token_canister(&self, token_type: &AcceptedToken) -> Result<Principal> {
        match token_type {
            AcceptedToken::ICP => Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
                .map_err(|_| AnimaError::InvalidInput("Invalid ICP ledger canister ID".to_string())),
            AcceptedToken::ANIMA => Principal::from_text("aanaa-xaaaa-aaaaa-aaa")
                .map_err(|_| AnimaError::InvalidInput("Invalid ANIMA token canister ID".to_string())),
        }
    }
}