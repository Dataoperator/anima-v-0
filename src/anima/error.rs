use candid::{CandidType, Deserialize};
use std::fmt;

#[derive(CandidType, Deserialize, Debug)]
pub enum AnimaError {
    NotFound,
    NotAuthorized,
    Configuration(String),
    External(String),
}

impl fmt::Display for AnimaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AnimaError::NotFound => write!(f, "Anima not found"),
            AnimaError::NotAuthorized => write!(f, "Not authorized to perform this action"),
            AnimaError::Configuration(msg) => write!(f, "Configuration error: {}", msg),
            AnimaError::External(msg) => write!(f, "External error: {}", msg),
        }
    }
}

impl From<String> for AnimaError {
    fn from(error: String) -> Self {
        AnimaError::External(error)
    }
}

impl From<&str> for AnimaError {
    fn from(error: &str) -> Self {
        AnimaError::External(error.to_string())
    }
}

impl From<std::io::Error> for AnimaError {
    fn from(error: std::io::Error) -> Self {
        AnimaError::External(error.to_string())
    }
}

impl From<serde_json::Error> for AnimaError {
    fn from(error: serde_json::Error) -> Self {
        AnimaError::External(error.to_string())
    }
}