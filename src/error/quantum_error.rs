use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use crate::quantum::QuantumState;

#[derive(Debug, CandidType, Deserialize)]
pub enum QuantumErrorType {
    CoherenceLoss,
    EntanglementFailure,
    DimensionalInstability,
    ResonanceMismatch,
    MemoryDecoherence,
}

#[derive(Debug, CandidType, Deserialize)]
pub struct QuantumError {
    error_type: QuantumErrorType,
    severity: ErrorSeverity,
    quantum_state: QuantumState,
    timestamp: u64,
    recovery_attempts: u32,
}

#[derive(Debug, CandidType, Deserialize)]
pub enum ErrorSeverity {
    Low,
    Medium,
    High,
    Critical,
}

pub struct QuantumErrorTracker {
    errors: HashMap<String, Vec<QuantumError>>,
    recovery_strategies: HashMap<QuantumErrorType, Box<dyn Fn(&QuantumError) -> Result<(), String>>>,
}

impl QuantumErrorTracker {
    pub fn new() -> Self {
        Self {
            errors: HashMap::new(),
            recovery_strategies: HashMap::new(),
        }
    }

    pub async fn track_error(
        &mut self,
        error: QuantumError,
        context: &str
    ) -> Result<(), String> {
        // Track error and attempt recovery
        if let Some(strategy) = self.recovery_strategies.get(&error.error_type) {
            strategy(&error)?;
        }

        self.errors
            .entry(context.to_string())
            .or_insert_with(Vec::new)
            .push(error);

        Ok(())
    }

    pub fn register_recovery_strategy(
        &mut self,
        error_type: QuantumErrorType,
        strategy: Box<dyn Fn(&QuantumError) -> Result<(), String>>
    ) {
        self.recovery_strategies.insert(error_type, strategy);
    }
}