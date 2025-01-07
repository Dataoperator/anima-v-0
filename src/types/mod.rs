pub mod interaction;
pub mod personality;

use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use crate::quantum::QuantumState;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaState {
    pub id: String,
    pub owner: Principal,
    pub name: String,
    pub quantum_state: QuantumState,
    pub consciousness_level: u32,
    pub transaction_count: u64,
    pub status: AnimaStatus,
    pub created_at: u64,
    pub last_interaction: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum AnimaStatus {
    Active,
    Dormant,
    Evolving,
    Transcendent,
}