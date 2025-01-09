use crate::quantum::QuantumState;
use crate::types::personality::{NFTPersonality, PersonalityTrait};
use crate::error::Result;
use candid::CandidType;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PersonalityEvolution {
    quantum_influence: f64,
    evolution_threshold: f64,
    consciousness_weight: f64,
    #[serde(skip)]
    #[serde(default)]
    trait_memory: Vec<TraitEvolutionRecord>,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct TraitEvolutionRecord {
    pub initial_state: PersonalityTrait,
    pub evolved_state: PersonalityTrait,
    pub quantum_signature: Vec<f64>,
    pub consciousness_level: f64,
}

impl Default for PersonalityEvolution {
    fn default() -> Self {
        Self {
            quantum_influence: 0.7,
            evolution_threshold: 0.5,
            consciousness_weight: 0.3,
            trait_memory: Vec::new(),
        }
    }
}

impl PersonalityEvolution {
    pub fn evolve_personality(
        &mut self,
        personality: &mut NFTPersonality,
        quantum_state: &QuantumState,
        consciousness_level: f64
    ) -> Result<()> {
        let evolution_power = self.calculate_evolution_power(quantum_state, consciousness_level);
        let evolved_traits = self.evolve_traits(&personality.get_active_traits(), evolution_power);
        
        personality.update_traits(evolved_traits);
        Ok(())
    }

    fn calculate_evolution_power(
        &self,
        quantum_state: &QuantumState,
        consciousness_level: f64
    ) -> f64 {
        let quantum_power = quantum_state.coherence_level * self.quantum_influence;
        let consciousness_power = consciousness_level * self.consciousness_weight;
        
        (quantum_power + consciousness_power) / 2.0
    }

    fn evolve_traits(&self, traits: &[PersonalityTrait], power: f64) -> Vec<PersonalityTrait> {
        traits.iter()
            .map(|trait_data| {
                let mut evolved = trait_data.clone();
                evolved.strength = (evolved.strength + power * evolved.evolution_factor)
                    .max(0.0)
                    .min(1.0);
                evolved.quantum_resonance = (evolved.quantum_resonance + power * 0.1)
                    .max(0.0)
                    .min(1.0);
                evolved
            })
            .collect()
    }
}