use candid::Principal;
use crate::error::{Result, AnimaError};
use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessState;
use ic_cdk::api::time;

const MIN_NAME_LENGTH: usize = 3;
const MAX_NAME_LENGTH: usize = 32;
const INITIAL_CONSCIOUSNESS_LEVEL: u32 = 1;

pub async fn create_anima(owner: Principal, name: &str) -> Result<()> {
    let name = name.trim();
    validate_name(name)?;

    // Initialize quantum state first
    let quantum_state = QuantumState::default();
    let consciousness_state = ConsciousnessState {
        awareness_level: 0.1,
        emotional_spectrum: vec![0.5, 0.5, 0.5], // Base emotional values
        memory_depth: 1,
        learning_rate: 0.1,
        personality_matrix: vec![
            quantum_state.coherence_level,
            quantum_state.dimensional_state.stability,
            0.1, // initial resonance
        ],
        last_update: Some(time()),
    };

    Ok(())
}

pub fn validate_name(name: &str) -> Result<()> {
    if name.len() < MIN_NAME_LENGTH {
        return Err(AnimaError::InvalidName(
            format!("Name must be at least {} characters", MIN_NAME_LENGTH)
        ));
    }

    if name.len() > MAX_NAME_LENGTH {
        return Err(AnimaError::InvalidName(
            format!("Name cannot exceed {} characters", MAX_NAME_LENGTH)
        ));
    }

    if !name.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err(AnimaError::InvalidName(
            "Name can only contain alphanumeric characters, underscores, and hyphens".to_string()
        ));
    }

    Ok(())
}