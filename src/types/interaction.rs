use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ActionResult {
    Success {
        response: String,
        personality_updates: Vec<PersonalityUpdate>,
    },
    Error(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalityUpdate {
    pub trait_name: String,
    pub old_value: f64,
    pub new_value: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionContext {
    pub interaction_type: String,
    pub intensity: f64,
    pub quantum_influence: f64,
    pub timestamp: u64,
    pub metadata: Option<InteractionMetadata>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionMetadata {
    pub source: String,
    pub category: String,
    pub emotional_context: Option<String>,
    pub dimensional_context: Option<String>,
}