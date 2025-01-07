use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub valence: f64,
    pub arousal: f64,
    pub dominance: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MemoryImpact {
    pub intensity: f64,
    pub relevance: f64,
    pub trait_impacts: HashMap<String, f64>,
}