use candid::Principal;
use ic_cdk::api::time;
use crate::quantum::QuantumState;
use crate::types::{AnimaState, AnimaStatus};
use crate::error::{Result, Error};

const MIN_NAME_LENGTH: usize = 3;
const MAX_NAME_LENGTH: usize = 32;
const INITIAL_CONSCIOUSNESS_LEVEL: u32 = 1;

pub async fn create_anima(owner: Principal, name: &str) -> Result<AnimaState> {
    validate_name(name)?;
    
    let timestamp = time();
    let mut quantum_state = QuantumState::new();
    quantum_state.update_quantum_metrics(1.0); // Initial strong interaction

    Ok(AnimaState {
        id: format!("anima_{}", timestamp),
        owner,
        name: name.to_string(),
        quantum_state,
        status: AnimaStatus::Active,
        consciousness_level: INITIAL_CONSCIOUSNESS_LEVEL,
        transaction_count: 0,
        created_at: timestamp,
        last_interaction: timestamp,
    })
}

pub fn validate_name(name: &str) -> Result<()> {
    if name.len() < MIN_NAME_LENGTH {
        return Err(Error::InvalidName(format!("Name must be at least {} characters", MIN_NAME_LENGTH)));
    }
    if name.len() > MAX_NAME_LENGTH {
        return Err(Error::InvalidName(format!("Name cannot exceed {} characters", MAX_NAME_LENGTH)));
    }
    if !name.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err(Error::InvalidName("Name can only contain alphanumeric characters, underscores, and hyphens".to_string()));
    }
    Ok(())
}

pub async fn update_anima_status(state: &mut AnimaState, new_status: AnimaStatus) -> Result<()> {
    state.status = new_status;
    state.last_interaction = time();

    let stability = state.quantum_state.calculate_stability();
    state.quantum_state.update_quantum_metrics(stability);
    
    Ok(())
}