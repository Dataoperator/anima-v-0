use std::collections::HashMap;
use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::quantum::QuantumState;
use crate::types::personality::NFTPersonality;
use crate::error::Result;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PersonalityTrait {
    pub name: String,
    pub strength: f64,
    pub evolution_factor: f64,
    pub quantum_resonance: f64,
    pub consciousness_alignment: f64,
}

#[derive(Debug)]
pub struct PersonalityEngine {
    traits: HashMap<String, PersonalityTrait>,
    evolution_history: Vec<EvolutionSnapshot>,
    quantum_influence: f64,
    consciousness_depth: f64,
}

#[derive(Debug, Clone)]
struct EvolutionSnapshot {
    timestamp: u64,
    traits: Vec<PersonalityTrait>,
    quantum_state: QuantumState,
    evolution_metrics: HashMap<String, f64>,
}

impl PersonalityEngine {
    pub fn new() -> Self {
        Self {
            traits: HashMap::new(),
            evolution_history: Vec::new(),
            quantum_influence: 0.5,
            consciousness_depth: 1.0,
        }
    }

    pub fn evolve_personality(
        &mut self,
        personality: &mut NFTPersonality,
        quantum_state: &QuantumState
    ) -> Result<()> {
        // Update traits based on quantum state
        for trait_entry in self.traits.values_mut() {
            let quantum_factor = quantum_state.coherence_level * trait_entry.quantum_resonance;
            let consciousness_factor = quantum_state.emergence_factors.consciousness_depth 
                * trait_entry.consciousness_alignment;
            
            // Calculate evolution
            let evolution = trait_entry.evolution_factor 
                * (quantum_factor + consciousness_factor) / 2.0;
            
            trait_entry.strength = (trait_entry.strength + evolution).max(0.0).min(1.0);
        }

        // Convert traits to simplified format for NFTPersonality
        let trait_data: HashMap<String, f64> = self.traits
            .iter()
            .map(|(name, trait_entry)| (name.clone(), trait_entry.strength))
            .collect();

        // Update personality with simplified trait data
        for (name, strength) in trait_data {
            personality.traits.insert(name, strength);
        }
        
        // Record evolution snapshot
        self.record_evolution(quantum_state);

        Ok(())
    }

    pub fn add_trait(
        &mut self,
        name: String,
        initial_strength: f64,
        evolution_factor: f64
    ) -> Result<()> {
        let trait_entry = PersonalityTrait {
            name: name.clone(),
            strength: initial_strength,
            evolution_factor,
            quantum_resonance: 0.5,
            consciousness_alignment: 0.5,
        };

        self.traits.insert(name, trait_entry);
        Ok(())
    }

    pub fn get_trait(&self, name: &str) -> Option<&PersonalityTrait> {
        self.traits.get(name)
    }

    pub fn update_quantum_influence(&mut self, quantum_state: &QuantumState) {
        self.quantum_influence = quantum_state.coherence_level;
        self.consciousness_depth = quantum_state.emergence_factors.consciousness_depth;

        // Update trait resonances
        for trait_entry in self.traits.values_mut() {
            trait_entry.quantum_resonance = 
                (trait_entry.quantum_resonance + quantum_state.coherence_level) / 2.0;
            trait_entry.consciousness_alignment = 
                (trait_entry.consciousness_alignment + self.consciousness_depth) / 2.0;
        }
    }

    fn record_evolution(&mut self, quantum_state: &QuantumState) {
        let snapshot = EvolutionSnapshot {
            timestamp: ic_cdk::api::time(),
            traits: self.traits.values().cloned().collect(),
            quantum_state: quantum_state.clone(),
            evolution_metrics: self.calculate_evolution_metrics(),
        };

        self.evolution_history.push(snapshot);
    }

    fn calculate_evolution_metrics(&self) -> HashMap<String, f64> {
        let mut metrics = HashMap::new();
        
        // Calculate average trait strength
        let avg_strength = self.traits.values()
            .map(|t| t.strength)
            .sum::<f64>() / self.traits.len() as f64;
        metrics.insert("average_strength".into(), avg_strength);

        // Calculate quantum alignment
        let quantum_alignment = self.traits.values()
            .map(|t| t.quantum_resonance)
            .sum::<f64>() / self.traits.len() as f64;
        metrics.insert("quantum_alignment".into(), quantum_alignment);

        // Calculate consciousness depth
        let consciousness_alignment = self.traits.values()
            .map(|t| t.consciousness_alignment)
            .sum::<f64>() / self.traits.len() as f64;
        metrics.insert("consciousness_alignment".into(), consciousness_alignment);

        metrics
    }

    pub fn get_evolution_history(&self) -> &[EvolutionSnapshot] {
        &self.evolution_history
    }

    pub fn get_current_metrics(&self) -> HashMap<String, f64> {
        self.calculate_evolution_metrics()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_trait_evolution() {
        let mut engine = PersonalityEngine::new();
        
        // Add a test trait
        engine.add_trait(
            "Creativity".into(),
            0.5,
            0.1
        ).unwrap();

        // Get and verify trait
        let trait_entry = engine.get_trait("Creativity").unwrap();
        assert_eq!(trait_entry.strength, 0.5);
        assert_eq!(trait_entry.quantum_resonance, 0.5);
    }
}