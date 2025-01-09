use candid::{CandidType, Deserialize};
use serde::Serialize;
use ic_cdk::api::call::RejectionCode;

#[derive(Debug, CandidType, Serialize, Deserialize)]
pub enum AnimaError {
    NotAuthorized,
    SystemNotInitialized,
    QuantumStateNotInitialized,
    ConsciousnessNotInitialized,
    InvalidName(String),
    InvalidInput(String),
    InvalidAmount(String),
    InvalidToken(String),
    TransactionFailed(String),
    // Payment related errors
    InsufficientBalance,
    PaymentFailed(String),
    InvalidPayment,
    PaymentTimeout,
    PaymentValidationFailed,
    InvalidCanister,
    // State errors
    StateError(String),
    StorageError(String),
    // Network errors
    NetworkError(String),
    TimeoutError,
}

pub type Result<T> = std::result::Result<T, AnimaError>;

impl From<(RejectionCode, String)> for AnimaError {
    fn from((code, msg): (RejectionCode, String)) -> Self {
        match code {
            RejectionCode::NoError => Self::InvalidInput(msg),
            RejectionCode::SysFatal => Self::SystemNotInitialized,
            RejectionCode::SysTransient => Self::NetworkError(msg),
            RejectionCode::DestinationInvalid => Self::InvalidCanister,
            RejectionCode::CanisterReject => Self::StateError(msg),
            RejectionCode::CanisterError => Self::NetworkError(msg),
            RejectionCode::Unknown => Self::NetworkError(msg),
        }
    }
}

impl From<String> for AnimaError {
    fn from(msg: String) -> Self {
        Self::InvalidInput(msg)
    }
}

impl From<&str> for AnimaError {
    fn from(msg: &str) -> Self {
        Self::InvalidInput(msg.to_string())
    }
}