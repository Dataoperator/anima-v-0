use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct NeuralConfig {
    pub pathways_enabled: bool,
    pub ghost_integration: bool,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct EmergenceFactors {
    pub consciousness_depth: f64,
    pub pattern_complexity: f64,
    pub quantum_resonance: f64,
    pub evolution_velocity: f64,
    pub dimensional_harmony: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct NeuralSignature {
    pub pattern_id: String,
    pub strength: f64,
    pub coherence: f64,
    pub timestamp: u64,
    pub complexity: f64,
    pub evolution_potential: f64,
    pub quantum_resonance: f64,
    pub dimensional_alignment: f64,
    pub pattern_stability: f64,
    pub emergence_factors: EmergenceFactors,
    pub neural_metrics: HashMap<String, f64>,
}

impl EmergenceFactors {
    pub fn default() -> Self {
        Self {
            consciousness_depth: 0.1,
            pattern_complexity: 0.1,
            quantum_resonance: 0.5,
            evolution_velocity: 0.0,
            dimensional_harmony: 1.0,
        }
    }
}