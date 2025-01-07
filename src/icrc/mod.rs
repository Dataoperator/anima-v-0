use candid::{CandidType, Principal};
use ic_cdk::api::caller;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: String,
    pub royalties: u16,
    pub royalty_recipient: Principal,
    pub description: String,
    pub image: String,
    pub total_supply: u128,
}

impl Default for CollectionMetadata {
    fn default() -> Self {
        Self {
            name: "Living NFT Collection".to_string(),
            symbol: "LNFT".to_string(),
            royalties: 500, // 5%
            royalty_recipient: Principal::anonymous(),
            description: "AI-driven NFTs that evolve and learn through interactions".to_string(),
            image: String::new(),
            total_supply: 0,
        }
    }
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize, Default)]
pub struct ICRCState {
    pub metadata: CollectionMetadata,
    pub approvals: HashMap<u64, Principal>,
    pub operators: HashMap<Principal, Vec<Principal>>,
    pub token_count: u128,
}

impl ICRCState {
    pub fn new(metadata: CollectionMetadata) -> Self {
        Self {
            metadata,
            approvals: HashMap::new(),
            operators: HashMap::new(),
            token_count: 0,
        }
    }

    pub fn increment_supply(&mut self) {
        self.token_count += 1;
        self.metadata.total_supply += 1;
    }

    pub fn approve(&mut self, token_id: u64, spender: Principal) -> bool {
        self.approvals.insert(token_id, spender);
        true
    }

    pub fn is_approved(&self, token_id: u64, spender: Principal) -> bool {
        self.approvals.get(&token_id).map_or(false, |approved| *approved == spender)
    }

    pub fn clear_approval(&mut self, token_id: u64) {
        self.approvals.remove(&token_id);
    }
}

pub fn initialize_collection() -> ICRCState {
    ICRCState::new(CollectionMetadata::default())
}

pub fn validate_transfer(from: Principal, to: Principal) -> Result<bool, String> {
    if from == Principal::anonymous() || to == Principal::anonymous() {
        return Err("Cannot transfer to/from anonymous principal".to_string());
    }
    
    if caller() != from {
        return Err("Only token owner can transfer".to_string());
    }

    Ok(true)
}