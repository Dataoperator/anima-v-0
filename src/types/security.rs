use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_stable_structures::Storable;
use std::borrow::Cow;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SecurityMetrics {
    pub total_events: u64,
    pub critical_events: u64,
    pub warning_events: u64,
    pub last_update: u64,
    pub event_log: Vec<SecurityEvent>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SecurityEvent {
    pub timestamp: u64,
    pub event_type: SecurityEventType,
    pub description: String,
    pub actor: Option<Principal>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SecurityEventType {
    AuthenticationAttempt,
    StateModification,
    TokenTransfer,
    ConfigurationChange,
    SystemAlert,
}

impl Storable for SecurityMetrics {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

impl Default for SecurityMetrics {
    fn default() -> Self {
        Self {
            total_events: 0,
            critical_events: 0,
            warning_events: 0,
            last_update: ic_cdk::api::time(),
            event_log: Vec::new(),
        }
    }
}