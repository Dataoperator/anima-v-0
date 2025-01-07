use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::fmt;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub enum ErrorCategory {
    Quantum(String),
    Evolution(String),
    Consciousness(String),
    Payment(String),
    System(String),
}

#[derive(Debug, CandidType, Deserialize, Serialize)]
pub enum Error {
    Quantum(String),
    Evolution(String),
    Consciousness(String),
    Payment(String),
    System(String),
    NotAuthorized(String),
    InvalidState(String),
    InvalidName(String),
    QuantumVerificationFailed(String),
}

impl From<ErrorCategory> for Error {
    fn from(category: ErrorCategory) -> Self {
        match category {
            ErrorCategory::Quantum(msg) => Error::Quantum(msg),
            ErrorCategory::Evolution(msg) => Error::Evolution(msg),
            ErrorCategory::Consciousness(msg) => Error::Consciousness(msg),
            ErrorCategory::Payment(msg) => Error::Payment(msg),
            ErrorCategory::System(msg) => Error::System(msg),
        }
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::Quantum(msg) => write!(f, "Quantum Error: {}", msg),
            Error::Evolution(msg) => write!(f, "Evolution Error: {}", msg),
            Error::Consciousness(msg) => write!(f, "Consciousness Error: {}", msg),
            Error::Payment(msg) => write!(f, "Payment Error: {}", msg),
            Error::System(msg) => write!(f, "System Error: {}", msg),
            Error::NotAuthorized(msg) => write!(f, "Authorization Error: {}", msg),
            Error::InvalidState(msg) => write!(f, "Invalid State: {}", msg),
            Error::InvalidName(msg) => write!(f, "Invalid Name: {}", msg),
            Error::QuantumVerificationFailed(msg) => write!(f, "Quantum Verification Failed: {}", msg),
        }
    }
}

impl std::error::Error for Error {}