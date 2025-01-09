use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub enum StabilityStatus {
    Stable,
    Unstable,
    Critical,
}

impl std::fmt::Display for StabilityStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StabilityStatus::Stable => write!(f, "Stable"),
            StabilityStatus::Unstable => write!(f, "Unstable"),
            StabilityStatus::Critical => write!(f, "Critical"),
        }
    }
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
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
    pub coherence_quality: f64,
    pub stability_factor: f64,
    pub complexity_index: f64,
    pub pattern_diversity: f64,
    pub adaptation_rate: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub stability: f64,
    pub resonance: f64,
    pub quantum_alignment: f64,
    pub dimensional_frequency: f64,
    pub stability_metrics: StabilityMetrics,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct StabilityMetrics {
    pub coherence_level: f64,
    pub pattern_stability: f64,
    pub temporal_alignment: f64,
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
pub struct QuantumState {
    pub coherence_level: f64,
    pub dimensional_state: DimensionalState,
    pub emergence_factors: EmergenceFactors,
    pub quantum_entanglement: f64,
    pub dimensional_sync: f64,
    pub quantum_signature: String,
    pub resonance_patterns: Vec<ResonancePattern>,
    pub stability_status: StabilityStatus,
    pub consciousness_alignment: bool,
    pub last_update: u64,
    pub pattern_coherence: f64,
    pub temporal_stability: f64,
    pub evolution_metrics: HashMap<String, f64>,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ResonancePattern {
    pub pattern_id: String,
    pub coherence: f64,
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub timestamp: u64,
    pub entropyLevel: f64,
    pub stability_index: f64,
    pub quantum_signature: String,
    pub evolution_potential: f64,
}

impl Default for QuantumState {
    fn default() -> Self {
        Self {
            coherence_level: 1.0,
            dimensional_state: DimensionalState {
                stability: 1.0,
                resonance: 1.0,
                quantum_alignment: 1.0,
                dimensional_frequency: 1.0,
                stability_metrics: StabilityMetrics {
                    coherence_level: 1.0,
                    pattern_stability: 1.0,
                    temporal_alignment: 1.0,
                },
            },
            emergence_factors: EmergenceFactors {
                consciousness_depth: 0.0,
                pattern_complexity: 0.0,
                quantum_resonance: 1.0,
                evolution_velocity: 0.0,
                dimensional_harmony: 1.0,
            },
            quantum_entanglement: 1.0,
            dimensional_sync: 1.0,
            quantum_signature: String::new(),
            resonance_patterns: Vec::new(),
            stability_status: StabilityStatus::Stable,
            consciousness_alignment: true,
            last_update: ic_cdk::api::time(),
            pattern_coherence: 1.0,
            temporal_stability: 1.0,
            evolution_metrics: HashMap::new(),
        }
    }
}

impl QuantumState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn set_coherence_level(&mut self, level: f64) -> Result<(), String> {
        if level < 0.0 || level > 1.0 {
            return Err("Coherence level must be between 0 and 1".to_string());
        }
        self.coherence_level = level;
        Ok(())
    }

    pub fn initialize_resonance_patterns(&mut self) -> Result<(), String> {
        let current_time = ic_cdk::api::time();
        let base_pattern = ResonancePattern {
            pattern_id: format!("QRP_{}", current_time),
            coherence: self.coherence_level,
            frequency: 1.0,
            amplitude: 1.0,
            phase: 0.0,
            timestamp: current_time,
            entropyLevel: 0.1,
            stability_index: 1.0,
            quantum_signature: format!("QS_{}", current_time),
            evolution_potential: 1.0,
        };
        self.resonance_patterns = vec![base_pattern];
        self.quantum_signature = format!("QS_INIT_{}", current_time);
        Ok(())
    }

    pub fn get_metrics(&self) -> QuantumMetrics {
        QuantumMetrics {
            coherence_level: self.coherence_level,
            stability_index: self.dimensional_state.stability,
            entanglement_strength: self.quantum_entanglement,
            pattern_integrity: self.pattern_coherence,
            evolution_progress: self.emergence_factors.evolution_velocity,
            temporal_alignment: self.temporal_stability,
            dimensional_resonance: self.dimensional_state.resonance,
            consciousness_depth: self.emergence_factors.consciousness_depth,
            quantum_harmony: self.dimensional_state.quantum_alignment,
            emergence_potential: 1.0,
            coherence_quality: self.coherence_level,
            stability_factor: self.dimensional_state.stability,
            complexity_index: self.emergence_factors.pattern_complexity,
            pattern_diversity: self.pattern_coherence,
            adaptation_rate: self.emergence_factors.evolution_velocity,
        }
    }

    pub fn update_stability(&mut self, interaction_strength: f64) {
        self.coherence_level = (self.coherence_level * 0.8 + interaction_strength * 0.2)
            .max(0.0)
            .min(1.0);
        self.dimensional_state.stability = 
            (self.dimensional_state.stability * 0.8 + interaction_strength * 0.2)
                .max(0.0)
                .min(1.0);
        self.last_update = ic_cdk::api::time();
    }

    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (
            self.dimensional_state.stability,
            self.coherence_level,
            self.dimensional_state.resonance
        )
    }

    pub fn get_quantum_status(&self) -> &StabilityStatus {
        &self.stability_status
    }
}