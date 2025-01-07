use candid::Principal;
use ic_cdk::api::management_canister::provisional::CanisterId;
use crate::quantum::QuantumState;
use crate::types::Result;
use super::pricing_config::{PricingConfig, TokenType, calculate_total_cost};
use super::ledger::{TransferArgs, Memo, BlockIndex, Tokens};

pub struct TransactionProcessor {
    pricing_config: PricingConfig,
    ledger_canister: CanisterId,
    research_wallet: Principal,
    platform_wallet: Principal,
}

impl TransactionProcessor {
    pub fn new(
        pricing_config: PricingConfig,
        ledger_canister: CanisterId,
        research_wallet: Principal,
        platform_wallet: Principal,
    ) -> Self {
        Self {
            pricing_config,
            ledger_canister,
            research_wallet,
            platform_wallet,
        }
    }

    /// Process minting payment with R&D fees
    pub async fn process_mint_payment(
        &self,
        from: Principal,
        base_price: u64,
        quantum_state: &QuantumState,
        token_type: TokenType,
    ) -> Result<PaymentReceipt> {
        // Calculate total cost including R&D fees
        let total_cost = calculate_total_cost(
            base_price,
            quantum_state.get_complexity()?,
            &self.pricing_config,
        );

        // Verify payment token is accepted
        self.verify_token_acceptance(token_type, total_cost)?;

        // Split payment into components
        let (rd_amount, platform_amount, compute_amount) = self.split_payment(total_cost)?;

        // Process main payment
        let block_height = match token_type {
            TokenType::ICP => {
                self.process_icp_transfers(
                    from,
                    rd_amount,
                    platform_amount,
                    compute_amount,
                ).await?
            },
            TokenType::ICRC1 => {
                self.process_icrc1_transfers(
                    from,
                    rd_amount,
                    platform_amount,
                    compute_amount,
                ).await?
            },
            TokenType::ICRC2 => {
                self.process_icrc2_transfers(
                    from,
                    rd_amount,
                    platform_amount,
                    compute_amount,
                ).await?
            }
        };

        Ok(PaymentReceipt {
            payer: from,
            total_amount: total_cost,
            rd_amount,
            platform_amount,
            compute_amount,
            token_type,
            block_height,
            timestamp: ic_cdk::api::time(),
        })
    }

    /// Process ICP transfers
    async fn process_icp_transfers(
        &self,
        from: Principal,
        rd_amount: u64,
        platform_amount: u64,
        compute_amount: u64,
    ) -> Result<BlockIndex> {
        // Transfer R&D fee
        let rd_block = self.transfer_icp(
            from,
            self.research_wallet,
            rd_amount,
            Memo(1), // R&D fee memo
        ).await?;

        // Transfer platform fee
        let platform_block = self.transfer_icp(
            from,
            self.platform_wallet,
            platform_amount,
            Memo(2), // Platform fee memo
        ).await?;

        // Transfer compute costs
        let compute_block = self.transfer_icp(
            from,
            self.platform_wallet, // Compute costs go to platform
            compute_amount,
            Memo(3), // Compute cost memo
        ).await?;

        // Return the last block height
        Ok(compute_block)
    }

    /// Transfer ICP tokens
    async fn transfer_icp(
        &self,
        from: Principal,
        to: Principal,
        amount: u64,
        memo: Memo,
    ) -> Result<BlockIndex> {
        let args = TransferArgs {
            memo,
            amount: Tokens::from_e8s(amount),
            fee: Tokens::from_e8s(10_000), // 0.0001 ICP fee
            from_subaccount: None,
            to,
            created_at_time: None,
        };

        let block_height = ic_cdk::call(self.ledger_canister, "transfer", (args,))
            .await
            .map_err(|e| anyhow::anyhow!("Transfer failed: {:?}", e))?;

        Ok(block_height)
    }

    /// Process ICRC1 transfers
    async fn process_icrc1_transfers(
        &self,
        from: Principal,
        rd_amount: u64,
        platform_amount: u64,
        compute_amount: u64,
    ) -> Result<BlockIndex> {
        // Implement ICRC1 token transfers
        let token_config = self.get_token_config(TokenType::ICRC1)?;
        
        let rd_transfer = ic_cdk::call(
            token_config.canister_id,
            "icrc1_transfer",
            (ICRCTransferArgs {
                from: from,
                to: self.research_wallet,
                amount: rd_amount,
                fee: None,
                memo: Some(vec![1]), // R&D fee memo
                created_at_time: None,
            },),
        ).await?;

        let platform_transfer = ic_cdk::call(
            token_config.canister_id,
            "icrc1_transfer",
            (ICRCTransferArgs {
                from: from,
                to: self.platform_wallet,
                amount: platform_amount,
                fee: None,
                memo: Some(vec![2]), // Platform fee memo
                created_at_time: None,
            },),
        ).await?;

        let compute_transfer = ic_cdk::call(
            token_config.canister_id,
            "icrc1_transfer",
            (ICRCTransferArgs {
                from: from,
                to: self.platform_wallet,
                amount: compute_amount,
                fee: None,
                memo: Some(vec![3]), // Compute cost memo
                created_at_time: None,
            },),
        ).await?;

        Ok(compute_transfer.block_index)
    }

    /// Process ICRC2 transfers (supports atomic operations)
    async fn process_icrc2_transfers(
        &self,
        from: Principal,
        rd_amount: u64,
        platform_amount: u64,
        compute_amount: u64,
    ) -> Result<BlockIndex> {
        let token_config = self.get_token_config(TokenType::ICRC2)?;
        
        // ICRC2 supports batch operations
        let batch_transfer = ic_cdk::call(
            token_config.canister_id,
            "icrc2_transfer_batch",
            (vec![
                ICRCTransferArgs {
                    from: from,
                    to: self.research_wallet,
                    amount: rd_amount,
                    fee: None,
                    memo: Some(vec![1]),
                    created_at_time: None,
                },
                ICRCTransferArgs {
                    from: from,
                    to: self.platform_wallet,
                    amount: platform_amount,
                    fee: None,
                    memo: Some(vec![2]),
                    created_at_time: None,
                },
                ICRCTransferArgs {
                    from: from,
                    to: self.platform_wallet,
                    amount: compute_amount,
                    fee: None,
                    memo: Some(vec![3]),
                    created_at_time: None,
                },
            ],),
        ).await?;

        Ok(batch_transfer.last_block_index)
    }

    /// Split payment into components
    fn split_payment(&self, total: u64) -> Result<(u64, u64, u64)> {
        let rd_amount = (total as f64 * self.pricing_config.fees.rd_fee_percentage) as u64;
        let compute_amount = self.pricing_config.fees.quantum_compute_fee +
            self.pricing_config.fees.consciousness_init_fee;
        let platform_amount = total - rd_amount - compute_amount;

        Ok((rd_amount, platform_amount, compute_amount))
    }

    /// Verify token is accepted and meets minimum amount
    fn verify_token_acceptance(&self, token_type: TokenType, amount: u64) -> Result<()> {
        let token_config = self.get_token_config(token_type)?;

        if amount < token_config.minimum_amount {
            return Err(anyhow::anyhow!(format!(
                "Amount below minimum required: {} < {}",
                amount,
                token_config.minimum_amount
            )));
        }

        Ok(())
    }

    /// Get token configuration
    fn get_token_config(&self, token_type: TokenType) -> Result<&AcceptedToken> {
        self.pricing_config.payment_settings.accepted_tokens
            .iter()
            .find(|t| t.token_type == token_type)
            .ok_or_else(|| anyhow::anyhow!("Token type not accepted"))
    }
}

#[derive(Debug, Clone)]
pub struct PaymentReceipt {
    pub payer: Principal,
    pub total_amount: u64,
    pub rd_amount: u64,
    pub platform_amount: u64,
    pub compute_amount: u64,
    pub token_type: TokenType,
    pub block_height: BlockIndex,
    pub timestamp: u64,
}

#[derive(Debug, Clone, candid::CandidType)]
struct ICRCTransferArgs {
    from: Principal,
    to: Principal,
    amount: u64,
    fee: Option<u64>,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_payment_processing() {
        let config = PricingConfig::default();
        let processor = TransactionProcessor::new(
            config.clone(),
            CanisterId::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(),
            Principal::anonymous(), // Research wallet
            Principal::anonymous(), // Platform wallet
        );

        let quantum_state = QuantumState {
            coherence: 0.9,
            energy: 0.8,
            stability: 0.95,
            // ... other fields
        };

        let split = processor.split_payment(1_000_000_000).unwrap(); // 10 ICP
        assert_eq!(split.0 + split.1 + split.2, 1_000_000_000);
    }

    #[test]
    fn test_token_verification() {
        let config = PricingConfig::default();
        let processor = TransactionProcessor::new(
            config.clone(),
            CanisterId::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(),
            Principal::anonymous(),
            Principal::anonymous(),
        );

        // Test minimum amount verification
        let result = processor.verify_token_acceptance(
            TokenType::ICP,
            50_000_000, // 0.5 ICP - below minimum
        );
        assert!(result.is_err());

        // Test accepted token verification
        let result = processor.verify_token_acceptance(
            TokenType::ICP,
            200_000_000, // 2 ICP - above minimum
        );
        assert!(result.is_ok());
    }
}