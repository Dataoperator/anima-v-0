use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f32,
}

impl Memory {
    pub fn new(content: String, emotional_impact: f32) -> Self {
        Self {
            timestamp: ic_cdk::api::time(),
            content,
            emotional_impact,
        }
    }

    pub fn calculate_relevance(&self, current_time: u64) -> f32 {
        let age = current_time - self.timestamp;
        let age_hours = age as f32 / (60.0 * 60.0 * 1_000_000_000.0);
        
        // Decay formula: impact * e^(-decay_rate * age_in_hours)
        let decay_rate = 0.001; // Adjust this to control decay speed
        self.emotional_impact * (-decay_rate * age_hours).exp()
    }
}