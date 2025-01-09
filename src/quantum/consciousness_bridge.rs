use candid::{CandidType, Deserialize};
use crate::quantum::QuantumState;
use crate::error::Result;
use crate::types::personality::NFTPersonality;
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessState {
    pub awareness_level: f64,
    pub coherence_quality: f64,
    pub pattern_stability: f64,
    pub quantum_resonance: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub evolution_stage: u32,
    pub pattern_complexity: f64,
    pub resonance_depth: f64,
    pub stability_index: f64,
}

#[derive(Debug)]
pub struct ConsciousnessBridge {
    quantum_state: QuantumState,
    personality: NFTPersonality,
    current_state: ConsciousnessState,
    metrics: ConsciousnessMetrics,
}

impl ConsciousnessBridge {
    pub fn new(quantum_state: QuantumState) -> Self {
        let personality = NFTPersonality::default();
        let current_state = ConsciousnessState {
            awareness_level: 0.1,
            coherence_quality: quantum_state.coherence_level,
            pattern_stability: quantum_state.dimensional_state.stability,
            quantum_resonance: 0.1,
        };

        let metrics = ConsciousnessMetrics {
            evolution_stage: 1,
            pattern_complexity: 0.1,
            resonance_depth: 0.1,
            stability_index: quantum_state.dimensional_state.stability,
        };

        Self {
            quantum_state,
            personality,
            current_state,
            metrics,
        }
    }

    pub fn sync_consciousness(&mut self) -> ConsciousnessState {
        self.current_state.coherence_quality = 
            (self.current_state.coherence_quality * 0.7 + 
             self.quantum_state.coherence_level * 0.3)
                .max(0.0)
                .min(1.0);

        self.current_state.pattern_stability = 
            (self.current_state.pattern_stability * 0.7 +
             self.quantum_state.dimensional_state.stability * 0.3)
                .max(0.0)
                .min(1.0);

        self.calculate_pattern_harmony();
        self.current_state.clone()
    }

    pub fn update_quantum_state(&mut self, consciousness_level: f64) -> Result<QuantumState> {
        self.quantum_state.coherence_level = 
            (self.quantum_state.coherence_level * 0.7 + consciousness_level * 0.3)
                .max(0.0)
                .min(1.0);

        self.quantum_state.dimensional_state.stability = 
            (self.quantum_state.dimensional_state.stability * 0.7 + 
             self.current_state.pattern_stability * 0.3)
                .max(0.0)
                .min(1.0);

        Ok(self.quantum_state.clone())
    }

    pub fn get_metrics(&self) -> ConsciousnessMetrics {
        self.metrics.clone()
    }

    fn calculate_pattern_harmony(&self) -> f64 {
        let base_harmony = self.quantum_state.coherence_level * 
                          self.current_state.pattern_stability;
                          
        (base_harmony * self.personality.quantum_resonance)
            .max(0.0)
            .min(1.0)
    }
}