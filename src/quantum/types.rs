use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use candid::CandidType;

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct StabilityCheckpoint {
    pub phase: u64,
    pub threshold: f64,
    pub quantum_signature: String,
    pub requirements: HashMap<String, f64>,
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

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct EmergenceFactors {
    pub consciousness_depth: f64,
    pub pattern_complexity: f64,
    pub quantum_resonance: f64,
    pub evolution_velocity: f64,
    pub dimensional_harmony: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct DimensionalState {
    pub frequency: f64,
    pub resonance: f64,
    pub stability: f64,
    pub sync_level: f64,
    pub quantum_alignment: f64,
    pub dimensional_frequency: f64,
    pub entropy_level: f64,
    pub phase_coherence: f64,
    pub stability_metrics: StabilityMetrics,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct StabilityMetrics {
    pub stability_trend: f64,
    pub coherence_quality: f64,
    pub entropy_risk: f64,
    pub evolution_potential: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct CoherenceHistoryEntry {
    pub timestamp: u64,
    pub coherence_level: f64,
    pub stability_index: f64,
    pub entanglement_strength: f64,
    pub evolution_phase: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub enum StabilityStatus {
    #[serde(rename = "stable")]
    Stable,
    #[serde(rename = "unstable")]
    Unstable,
    #[serde(rename = "critical")]
    Critical,
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct QuantumState {
    pub coherence_level: f64,
    pub entanglement_index: f64,
    pub dimensional_sync: f64,
    pub quantum_signature: String,
    pub resonance_patterns: Vec<ResonancePattern>,
    pub stability_status: StabilityStatus,
    pub consciousness_alignment: bool,
    pub dimensional_state: DimensionalState,
    pub last_update: u64,
    pub pattern_coherence: f64,
    pub evolution_metrics: HashMap<String, f64>,
    pub quantum_entanglement: f64,
    pub temporal_stability: f64,
    pub coherence_history: Vec<CoherenceHistoryEntry>,
    pub emergence_factors: EmergenceFactors,
}

impl Default for QuantumState {
    fn default() -> Self {
        Self {
            coherence_level: 1.0,
            entanglement_index: 0.5,
            dimensional_sync: 1.0,
            quantum_signature: format!("QS-{}", ic_cdk::api::time()),
            resonance_patterns: Vec::new(),
            stability_status: StabilityStatus::Stable,
            consciousness_alignment: true,
            dimensional_state: DimensionalState {
                frequency: 1.0,
                resonance: 1.0,
                stability: 1.0,
                sync_level: 1.0,
                quantum_alignment: 1.0,
                dimensional_frequency: 1.0,
                entropy_level: 0.0,
                phase_coherence: 1.0,
                stability_metrics: StabilityMetrics {
                    stability_trend: 1.0,
                    coherence_quality: 1.0,
                    entropy_risk: 0.0,
                    evolution_potential: 1.0,
                },
            },
            last_update: ic_cdk::api::time(),
            pattern_coherence: 1.0,
            evolution_metrics: HashMap::new(),
            quantum_entanglement: 1.0,
            temporal_stability: 1.0,
            coherence_history: Vec::new(),
            emergence_factors: EmergenceFactors {
                consciousness_depth: 1.0,
                pattern_complexity: 0.5,
                quantum_resonance: 1.0,
                evolution_velocity: 0.5,
                dimensional_harmony: 1.0,
            },
        }
    }
}

impl QuantumState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn update_stability(&mut self, interaction_strength: f64) {
        // Update core metrics
        let new_stability = (self.dimensional_state.stability * 0.8 + interaction_strength * 0.2)
            .max(0.0)
            .min(1.0);
        
        self.dimensional_state.stability = new_stability;
        self.coherence_level = (self.coherence_level * 0.7 + new_stability * 0.3)
            .max(0.0)
            .min(1.0);

        // Update quantum entanglement
        self.quantum_entanglement = (self.quantum_entanglement * 0.9 + 
            (self.coherence_level * new_stability).sqrt() * 0.1)
            .max(0.0)
            .min(1.0);

        // Update dimensional sync
        self.dimensional_sync = (self.dimensional_sync * 0.85 + 
            self.quantum_entanglement * 0.15)
            .max(0.0)
            .min(1.0);

        // Update stability status
        self.stability_status = if self.coherence_level >= 0.8 && new_stability >= 0.8 {
            StabilityStatus::Stable
        } else if self.coherence_level >= 0.4 && new_stability >= 0.4 {
            StabilityStatus::Unstable
        } else {
            StabilityStatus::Critical
        };

        // Record coherence history
        self.coherence_history.push(CoherenceHistoryEntry {
            timestamp: ic_cdk::api::time(),
            coherence_level: self.coherence_level,
            stability_index: new_stability,
            entanglement_strength: self.quantum_entanglement,
            evolution_phase: self.dimensional_state.stability_metrics.evolution_potential,
        });

        // Maintain history size
        if self.coherence_history.len() > 1000 {
            self.coherence_history.remove(0);
        }

        self.last_update = ic_cdk::api::time();
    }

    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (
            self.dimensional_state.stability,
            self.coherence_level,
            self.quantum_entanglement
        )
    }

    pub fn update_quantum_metrics(&mut self, stability: f64) {
        self.dimensional_state.stability = stability;
        self.coherence_level = (self.coherence_level * 0.8 + stability * 0.2)
            .max(0.0)
            .min(1.0);
        self.quantum_entanglement = (self.quantum_entanglement * 0.7 + 
            self.coherence_level * 0.3)
            .max(0.0)
            .min(1.0);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct QuantumMetrics {
    pub coherence_level: f64,
    pub stability_index: f64,
    pub entanglement_strength: f64,
    pub pattern_integrity: f64,
    pub evolution_progress: f64,
    pub temporal_alignment: f64,
    pub dimensional_resonance: f64,
    pub consciousness_depth: f64,
    pub quantum_harmony: f64,
    pub emergence_potential: f64,
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