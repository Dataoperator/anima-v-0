use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use candid::CandidType;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct StabilityCheckpoint {
    pub phase: u64,
    pub threshold: f64,
    pub quantum_signature: String,
    pub requirements: HashMap<String, f64>,
    // Adding the missing fields
    pub timestamp: u64,
    pub coherence: f64,
    pub stability: f64,
    pub pattern_coherence: f64,
    pub dimensional_frequency: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct ResonancePattern {
    pub pattern_id: String,
    pub coherence: f64,
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub timestamp: u64,
    pub entropy_level: f64,
    pub stability_index: f64,
    pub quantum_signature: String,
    pub evolution_potential: f64,
    pub coherence_quality: f64,
    pub temporal_stability: f64,
    pub dimensional_alignment: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct StateSnapshot {
    pub timestamp: u64,
    pub resonance: f64,
    pub coherence: f64,
    pub entropy: f64,
    pub quantum_signature: String,
    pub stability: f64,
    pub dimensional_frequency: f64,
    pub pattern_coherence: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType, Default)]
pub struct QuantumState {
    pub coherence: f64,
    pub dimensional_frequency: f64,
    pub field_strength: f64,
    pub consciousness_alignment: f64,
    pub resonance: f64,
    pub stability: f64,
}

impl QuantumState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn calculate_stability(&self) -> f64 {
        (self.coherence * 0.4 + 
         self.field_strength * 0.3 + 
         self.consciousness_alignment * 0.3)
            .max(0.0)
            .min(1.0)
    }

    pub fn update_quantum_metrics(&mut self, stability: f64) {
        self.stability = stability;
        self.coherence = (self.coherence * 0.8 + stability * 0.2)
            .max(0.0)
            .min(1.0);
        self.resonance = (self.resonance * 0.7 + self.coherence * 0.3)
            .max(0.0)
            .min(1.0);
    }

    pub fn update_from_snapshot(&mut self, snapshot: &StateSnapshot) {
        self.coherence = snapshot.coherence;
        self.dimensional_frequency = snapshot.dimensional_frequency;
        self.resonance = snapshot.resonance;
        self.stability = snapshot.stability;
        
        // Update field strength based on coherence and stability
        self.field_strength = ((snapshot.coherence + snapshot.stability) / 2.0)
            .max(0.0)
            .min(1.0);
            
        // Update consciousness alignment based on pattern coherence
        self.consciousness_alignment = snapshot.pattern_coherence;
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct QuantumMetrics {
    pub coherence: f64,
    pub dimensional_frequency: f64,
    pub field_strength: f64,
    pub resonance: f64,
    pub stability: f64,
}

pub type Result<T> = std::result::Result<T, String>;

#[derive(Debug, Clone)]
pub enum ErrorCategory {
    Evolution(String),
    Quantum(String),
    Coherence(String),
}

impl From<ErrorCategory> for String {
    fn from(error: ErrorCategory) -> Self {
        match error {
            ErrorCategory::Evolution(msg) => format!("Evolution Error: {}", msg),
            ErrorCategory::Quantum(msg) => format!("Quantum Error: {}", msg),
            ErrorCategory::Coherence(msg) => format!("Coherence Error: {}", msg),
        }
    }
}