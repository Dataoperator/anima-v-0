use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::personality::NFTPersonality;
use crate::types::Timestamp;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaState {
    pub id: u64,
    pub owner: Principal,
    pub name: String,
    pub personality: NFTPersonality,
    pub created_at: Timestamp,
    pub last_interaction: Timestamp,
}

impl AnimaState {
    pub fn new(id: u64, owner: Principal, name: String, personality: NFTPersonality) -> Self {
        let now = ic_cdk::api::time();
        Self {
            id,
            owner,
            name,
            personality,
            created_at: now,
            last_interaction: now,
        }
    }
}