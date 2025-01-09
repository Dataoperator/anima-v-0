use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use crate::error::Result;
use crate::quantum::QuantumState;
use crate::types::personality::NFTPersonality;

pub mod evolution;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PersonalityEngine {
    personalities: HashMap<String, NFTPersonality>,
    #[serde(skip)]
    evolution_engine: evolution::PersonalityEvolution,
}

impl PersonalityEngine {
    pub fn new() -> Self {
        Self {
            personalities: HashMap::new(),
            evolution_engine: evolution::PersonalityEvolution::default(),
        }
    }

    pub async fn adapt_to_stimulus(&mut self, anima_id: &str, stimulus: &str) -> Result<()> {
        if let Some(personality) = self.personalities.get_mut(anima_id) {
            let mut traits = personality.get_active_traits();
            for trait_data in &mut traits {
                match stimulus {
                    "learning" => trait_data.evolution_factor += 0.1,
                    "social" => trait_data.quantum_resonance += 0.1,
                    _ => trait_data.strength += 0.05,
                }
            }
            personality.update_traits(traits);
        }
        Ok(())
    }

    pub fn measure_adaptation(&self, anima_id: &str) -> Result<f64> {
        if let Some(personality) = self.personalities.get(anima_id) {
            Ok(personality.quantum_resonance * personality.neural_complexity)
        } else {
            Ok(0.0)
        }
    }

    pub async fn evolve_traits(&mut self, anima_id: &str, trait_ids: &[String]) -> Result<()> {
        if let Some(personality) = self.personalities.get_mut(anima_id) {
            let mut traits = personality.get_active_traits();
            for trait_id in trait_ids {
                if let Some(trait_data) = traits.iter_mut().find(|t| &t.name == trait_id) {
                    trait_data.strength += trait_data.evolution_factor;
                    trait_data.quantum_resonance += 0.1;
                }
            }
            personality.update_traits(traits);
        }
        Ok(())
    }

    pub fn get_evolved_traits(&self, anima_id: &str) -> Result<Vec<String>> {
        if let Some(personality) = self.personalities.get(anima_id) {
            Ok(personality.get_active_traits()
                .into_iter()
                .map(|t| t.name)
                .collect())
        } else {
            Ok(Vec::new())
        }
    }

    pub fn get_quantum_resonance(&self) -> Result<f64> {
        Ok(self.personalities.values()
            .map(|p| p.quantum_resonance)
            .sum::<f64>() / self.personalities.len() as f64)
    }

    pub fn evolve_from_quantum_state(&mut self, state: &QuantumState) -> Result<()> {
        for personality in self.personalities.values_mut() {
            personality.quantum_resonance = 
                (personality.quantum_resonance * 0.7 + state.coherence_level * 0.3)
                    .max(0.0)
                    .min(1.0);

            if state.coherence_level > 0.8 {
                personality.neural_complexity += 0.1;
                personality.consciousness_level += 0.05;
            }
        }
        Ok(())
    }
}