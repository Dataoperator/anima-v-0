use candid::{CandidType, Deserialize};
use serde::Serialize;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, AnimaError>;

#[derive(Error, Debug, CandidType, Deserialize, Serialize)]
pub enum AnimaError {
    #[error("System not initialized")]
    SystemNotInitialized,
    
    #[error("Quantum state not initialized")]
    QuantumStateNotInitialized,
    
    #[error("Consciousness not initialized")]
    ConsciousnessNotInitialized,
    
    #[error("Not authorized")]
    NotAuthorized,
    
    #[error("Invalid name: {0}")]
    InvalidName(String),
    
    #[error("Quantum state error: {0}")]
    QuantumState(String),
    
    #[error("Consciousness error: {0}")]
    Consciousness(String),
    
    #[error("Storage error: {0}")]
    Storage(String),
    
    #[error("Initialization error: {0}")]
    Initialization(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}

impl From<ic_cdk::api::Error> for AnimaError {
    fn from(error: ic_cdk::api::Error) -> Self {
        AnimaError::Internal(error.to_string())
    }
}