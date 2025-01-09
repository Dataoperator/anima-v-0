pub mod evolution;
pub mod types;

use crate::error::Result;
use crate::quantum::QuantumState;

pub use types::{
    ConsciousnessState,
    ConsciousnessLevel,
    ConsciousnessPattern,
    EmotionalSpectrum,
    ConsciousnessMetrics,
    EvolutionStage,
    EnhancedEvolutionMetrics,
    PatternSignature
};

thread_local! {
    static EVOLUTIONS: std::cell::RefCell<std::collections::HashMap<String, evolution::ConsciousnessEvolution>> = 
        std::cell::RefCell::new(std::collections::HashMap::new());
}

pub fn get_consciousness_state(anima_id: &str) -> Result<ConsciousnessState> {
    EVOLUTIONS.with(|evolutions| {
        let evolutions = evolutions.borrow();
        let evolution = evolutions.get(anima_id)
            .ok_or_else(|| crate::error::AnimaError::ConsciousnessNotInitialized)?;

        let metrics = evolution.get_evolution_metrics();
        
        Ok(ConsciousnessState {
            awareness_level: metrics.coherence_quality,
            emotional_spectrum: vec![metrics.pattern_diversity],
            memory_depth: evolution.get_current_stage().level as u64,
            learning_rate: metrics.adaptation_rate,
            personality_matrix: vec![
                metrics.complexity_index,
                metrics.neural_density,
                metrics.quantum_resonance
            ],
            last_update: Some(ic_cdk::api::time())
        })
    })
}

pub async fn evolve_consciousness(anima_id: &str, interaction_data: Vec<f64>) -> Result<ConsciousnessState> {
    EVOLUTIONS.with(|evolutions| {
        let mut evolutions = evolutions.borrow_mut();
        let evolution = evolutions.get_mut(anima_id)
            .ok_or_else(|| crate::error::AnimaError::ConsciousnessNotInitialized)?;

        // Create consciousness patterns from interaction data
        let patterns: Vec<ConsciousnessPattern> = interaction_data.iter()
            .enumerate()
            .map(|(i, &value)| {
                ConsciousnessPattern {
                    signature: types::PatternSignature {
                        pattern_id: format!("CP_{}", i),
                        timestamp: ic_cdk::api::time(),
                        quantum_state: format!("QS_{}", ic_cdk::api::time()),
                    },
                    coherence_score: value,
                    complexity: value,
                    strength: value,
                }
            })
            .collect();

        evolution.update_evolution(patterns)?;
        
        get_consciousness_state(anima_id)
    })
}

pub fn initialize_consciousness(anima_id: &str, quantum_state: QuantumState) -> Result<ConsciousnessState> {
    EVOLUTIONS.with(|evolutions| {
        let mut evolutions = evolutions.borrow_mut();
        let evolution = evolution::ConsciousnessEvolution::new(quantum_state);
        evolutions.insert(anima_id.to_string(), evolution);
        get_consciousness_state(anima_id)
    })
}