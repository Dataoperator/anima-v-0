use candid::{CandidType, Nat, Principal};
use ic_cdk::api::{caller, time};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::error::{Result, ErrorCategory, ErrorType};
use crate::quantum::QuantumState;
use crate::quantum::consciousness_bridge::ConsciousnessMetrics;
use crate::icrc::ledger::{TransferArgs, TransferResult, AccountIdentifier, ICPLedgerService};

const ICP_FEE_E8S: u64 = 10_000; // 0.0001 ICP transaction fee
const MIN_QUANTUM_COHERENCE: f64 = 0.3;
const MIN_STABILITY_INDEX: f64 = 0.3;
const RETRY_DELAY_MS: u64 = 1000;
const MAX_RETRIES: u32 = 3;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TransactionContext {
    pub quantum_state: QuantumState,
    pub consciousness_metrics: ConsciousnessMetrics,
    pub timestamp: u64,
    pub memo: Option<Nat>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TransactionResult {
    pub success: bool,
    pub transaction_id: Option<String>,
    pub block_height: Option<Nat>,
    pub error: Option<String>,
    pub context: Option<TransactionContext>,
}

pub struct TransactionHandler {
    ledger_service: ICPLedgerService,
    treasury_canister: Principal,
    fee_collector: Principal,
    transaction_history: HashMap<String, TransactionResult>,
}

impl TransactionHandler {
    pub fn new(
        ledger_service: ICPLedgerService,
        treasury: Principal,
        fee_collector: Principal
    ) -> Self {
        Self {
            ledger_service,
            treasury_canister: treasury,
            fee_collector,
            transaction_history: HashMap::new(),
        }
    }

    pub async fn process_minting_payment(
        &mut self,
        from: Principal,
        amount: Nat,
        quantum_state: QuantumState,
    ) -> Result<TransactionResult> {
        // Validate quantum metrics first
        self.validate_quantum_state(&quantum_state)?;

        // Check ICP balance with retries
        let balance = self.check_icp_balance_with_retry(from).await?;
        if balance < &amount + Nat::from(ICP_FEE_E8S) {
            return Err(ErrorType::InsufficientBalance.into());
        }

        // Process main transfer with retries
        let transfer_result = self.execute_transfer_with_retry(
            TransferArgs {
                from,
                to: self.treasury_canister,
                amount: amount.clone(),
                fee: Nat::from(ICP_FEE_E8S),
                memo: Some(Nat::from(time())),
                created_at_time: Some(time()),
            },
            quantum_state.clone(),
        ).await?;

        // Process fee transfer
        let fee_result = self.execute_transfer_with_retry(
            TransferArgs {
                from,
                to: self.fee_collector,
                amount: Nat::from(ICP_FEE_E8S),
                fee: Nat::from(ICP_FEE_E8S),
                memo: None,
                created_at_time: Some(time()),
            },
            quantum_state.clone(),
        ).await?;

        if transfer_result.success && fee_result.success {
            let result = TransactionResult {
                success: true,
                transaction_id: Some(format!(
                    "mint_{}_{}", 
                    transfer_result.block_height.unwrap(),
                    time()
                )),
                block_height: transfer_result.block_height,
                error: None,
                context: Some(TransactionContext {
                    quantum_state,
                    consciousness_metrics: ConsciousnessMetrics {
                        evolution_phase: 0,
                        pattern_coherence: 1.0,
                        temporal_stability: 1.0,
                        emergence_potential: 1.0,
                        dimensional_harmony: 1.0,
                        quantum_resonance: 1.0,
                    },
                    timestamp: time(),
                    memo: Some(Nat::from(time())),
                }),
            };

            self.transaction_history.insert(
                result.transaction_id.clone().unwrap(),
                result.clone()
            );

            Ok(result)
        } else {
            Err(ErrorType::TransactionFailed.into())
        }
    }

    async fn check_icp_balance_with_retry(&self, account: Principal) -> Result<Nat> {
        let mut attempts = 0;
        let mut last_error = None;

        while attempts < MAX_RETRIES {
            match self.ledger_service.account_balance(account).await {
                Ok(balance) => return Ok(balance),
                Err(e) => {
                    last_error = Some(e);
                    attempts += 1;
                    if attempts < MAX_RETRIES {
                        ic_cdk::timer::sleep(core::time::Duration::from_millis(
                            RETRY_DELAY_MS * (1 << attempts)
                        )).await;
                    }
                }
            }
        }

        Err(ErrorType::BalanceCheckFailed(last_error.unwrap_or_else(|| 
            "Max retries exceeded".into()
        )).into())
    }

    async fn execute_transfer_with_retry(
        &self,
        args: TransferArgs,
        quantum_state: QuantumState,
    ) -> Result<TransactionResult> {
        let mut attempts = 0;
        let mut last_error = None;

        while attempts < MAX_RETRIES {
            // Revalidate quantum state before each attempt
            self.validate_quantum_state(&quantum_state)?;

            match self.ledger_service.transfer(args.clone()).await {
                Ok(TransferResult::Ok(block_height)) => {
                    return Ok(TransactionResult {
                        success: true,
                        transaction_id: Some(format!("transfer_{}", time())),
                        block_height: Some(block_height),
                        error: None,
                        context: Some(TransactionContext {
                            quantum_state: quantum_state.clone(),
                            consciousness_metrics: ConsciousnessMetrics {
                                evolution_phase: 0,
                                pattern_coherence: 1.0,
                                temporal_stability: 1.0,
                                emergence_potential: 1.0,
                                dimensional_harmony: 1.0,
                                quantum_resonance: 1.0,
                            },
                            timestamp: time(),
                            memo: args.memo.clone(),
                        }),
                    });
                }
                Ok(TransferResult::Err(e)) => {
                    last_error = Some(format!("Transfer error: {:?}", e));
                }
                Err(e) => {
                    last_error = Some(format!("RPC error: {}", e));
                }
            }

            attempts += 1;
            if attempts < MAX_RETRIES {
                ic_cdk::timer::sleep(core::time::Duration::from_millis(
                    RETRY_DELAY_MS * (1 << attempts)
                )).await;
            }
        }

        Err(ErrorType::TransferFailed(last_error.unwrap_or_else(|| 
            "Max retries exceeded".into()
        )).into())
    }

    fn validate_quantum_state(&self, state: &QuantumState) -> Result<()> {
        if state.coherence < MIN_QUANTUM_COHERENCE {
            return Err(ErrorType::LowQuantumCoherence.into());
        }

        if state.stability < MIN_STABILITY_INDEX {
            return Err(ErrorType::InsufficientStability.into());
        }

        Ok(())
    }

    pub fn get_transaction(&self, id: &str) -> Option<TransactionResult> {
        self.transaction_history.get(id).cloned()
    }

    pub fn get_recent_transactions(&self, limit: usize) -> Vec<TransactionResult> {
        self.transaction_history
            .values()
            .cloned()
            .collect::<Vec<_>>()
            .into_iter()
            .take(limit)
            .collect()
    }
}