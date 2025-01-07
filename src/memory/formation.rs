use crate::error::Result;
use crate::quantum::QuantumState;
use crate::types::personality::NFTPersonality;
use super::{Memory, EventType};

pub struct MemoryFormation {
    coherence_threshold: f64,
    importance_threshold: f64,
    quantum_weight: f64,
}

impl Default for MemoryFormation {
    fn default() -> Self {
        Self {
            coherence_threshold: 0.3,
            importance_threshold: 0.5,
            quantum_weight: 0.4,
        }
    }
}

impl MemoryFormation {
    pub fn form_memory(
        &self,
        content: String,
        personality: &NFTPersonality,
        quantum_state: &QuantumState,
        event_type: EventType,
    ) -> Result<Memory> {
        let emotional_impact = self.calculate_emotional_impact(personality, quantum_state);
        let importance_score = self.calculate_importance(quantum_state, emotional_impact);

        let mut memory = Memory::new(
            content.clone(),
            personality.clone(),
            quantum_state.clone(),
            event_type,
            emotional_impact,
        );

        memory = memory.with_importance(importance_score);
        memory = memory.with_keywords(self.extract_keywords(&content));
        memory = self.enhance_with_quantum_signature(memory, quantum_state);

        Ok(memory)
    }

    fn calculate_emotional_impact(&self, personality: &NFTPersonality, quantum_state: &QuantumState) -> f64 {
        let base_impact = personality.emotional_state.valence.abs() * 
                         personality.emotional_state.arousal;

        let quantum_influence = quantum_state.coherence * 
                              quantum_state.resonance_metrics.stability;

        (base_impact + quantum_influence) / 2.0
    }

    fn calculate_importance(&self, quantum_state: &QuantumState, emotional_impact: f64) -> f64 {
        let quantum_factor = quantum_state.resonance_metrics.field_strength * 
                           quantum_state.resonance_metrics.consciousness_alignment;

        let raw_importance = (emotional_impact + quantum_factor) / 2.0;
        raw_importance.max(0.0).min(1.0)
    }

    fn extract_keywords(&self, content: &str) -> Vec<String> {
        content
            .split_whitespace()
            .filter(|word| word.len() > 3)
            .map(|word| word.to_lowercase())
            .take(5)
            .collect()
    }

    fn enhance_with_quantum_signature(&self, mut memory: Memory, quantum_state: &QuantumState) -> Memory {
        let mut signature = Vec::new();
        signature.extend_from_slice(&quantum_state.coherence.to_be_bytes());
        signature.extend_from_slice(&quantum_state.resonance_metrics.field_strength.to_be_bytes());
        memory.resonance_signature = signature;
        memory
    }

    pub fn verify_formation(&self, memory: &Memory, current_quantum_state: &QuantumState) -> bool {
        let coherence_match = memory.quantum_state.coherence >= self.coherence_threshold;
        let importance_match = memory.importance_score >= self.importance_threshold;
        let resonance = memory.calculate_resonance(current_quantum_state);
        
        coherence_match && importance_match && resonance >= self.quantum_weight
    }
}