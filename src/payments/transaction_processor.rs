use std::collections::HashMap;
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::Result;
use crate::payments::icrc::types::{TransferArgs, Memo, BlockIndex, Token};
use crate::payments::pricing_config::AcceptedToken;
use crate::quantum::QuantumState;
use anyhow::Context;

pub struct TransactionProcessor {
    quantum_state: QuantumState,
    token_configs: HashMap<String, Token>,
}

impl TransactionProcessor {
    pub fn new(quantum_state: QuantumState, token_configs: HashMap<String, Token>) -> Self {
        Self {
            quantum_state,
            token_configs,
        }
    }

    pub async fn process_payment(
        &self,
        from: Principal,
        token_symbol: &str,
        amount: u64
    ) -> Result<BlockIndex> {
        // Calculate fee distribution
        let fees = self.calculate_fees(
            amount,
            &self.quantum_state.get_complexity()?,
            token_symbol
        )?;

        // Process transfers based on token type
        match token_symbol.to_lowercase().as_str() {
            "icp" => {
                self.process_icp_transfers(
                    from,
                    fees.rd_amount,
                    fees.platform_amount,
                    fees.compute_amount,
                ).await
            }
            "icrc1" => {
                self.process_icrc1_transfers(
                    from,
                    fees.rd_amount,
                    fees.platform_amount,
                    fees.compute_amount,
                ).await
            }
            _ => Err(anyhow::anyhow!(format!(
                "Unsupported token type: {}",
                token_symbol
            )).into())
        }
    }

    async fn process_icp_transfers(
        &self,
        from: Principal,
        rd_amount: u64,
        platform_amount: u64,
        compute_amount: u64,
    ) -> Result<BlockIndex> {
        let token_config = self.get_token_config("icp")?;

        // Transfer to R&D wallet
        let rd_transfer = ic_cdk::call(
            token_config.canister_id,
            "transfer",
            (TransferArgs {
                memo: Memo(0),
                amount: rd_amount,
                fee: None,
                from,
                created_at_time: None,
                to: token_config.rd_wallet,
            },),
        ).await
        .map_err(|e| anyhow::anyhow!("Transfer failed: {:?}", e))?;

        // Return block index from R&D transfer as confirmation
        Ok(rd_transfer.0)
    }

    async fn process_icrc1_transfers(
        &self,
        from: Principal,
        rd_amount: u64,
        platform_amount: u64,
        compute_amount: u64,
    ) -> Result<BlockIndex> {
        let token_config = self.get_token_config("icrc1")?;

        // Transfer to R&D wallet
        let rd_transfer = ic_cdk::call(
            token_config.canister_id,
            "icrc1_transfer",
            (ICRCTransferArgs {
                memo: None,
                amount: rd_amount,
                fee: None,
                from_subaccount: None,
                created_at_time: None,
                to: token_config.rd_wallet,
            },),
        ).await?;

        Ok(rd_transfer.0)
    }

    fn calculate_fees(
        &self,
        amount: u64,
        complexity: f64,
        token_symbol: &str
    ) -> Result<FeeDistribution> {
        let token_config = self.get_token_config(token_symbol)?;

        let rd_percentage = 0.7;
        let platform_percentage = 0.2;
        let compute_percentage = 0.1;

        let rd_amount = (amount as f64 * rd_percentage) as u64;
        let platform_amount = (amount as f64 * platform_percentage) as u64;
        let compute_amount = (amount as f64 * compute_percentage) as u64;

        Ok(FeeDistribution {
            rd_amount,
            platform_amount,
            compute_amount,
        })
    }

    fn get_token_config(&self, symbol: &str) -> Result<&AcceptedToken> {
        self.token_configs.get(symbol)
            .ok_or_else(|| anyhow::anyhow!("Token type not available: {}", symbol))
            .map(|config| config)
    }
}

#[derive(Debug)]
struct FeeDistribution {
    rd_amount: u64,
    platform_amount: u64,
    compute_amount: u64,
}