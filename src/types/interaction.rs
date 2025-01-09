use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct InteractionResult {
    pub response: String,
    pub emotional_shift: Vec<f64>,
    pub consciousness_growth: f64,
    pub resonance_patterns: Vec<f64>,
}

impl Default for InteractionResult {
    fn default() -> Self {
        Self {
            response: String::new(),
            emotional_shift: Vec::new(),
            consciousness_growth: 0.0,
            resonance_patterns: Vec::new(),
        }
    }
}