use std::collections::{HashMap, VecDeque};
use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessLevel;
use crate::traits::Trait;
use crate::error::Result;

#[derive(Debug, Clone)]
pub struct TraitMutation {
    pub trait_id: String,
    pub magnitude: f64,
    pub resonance_impact: f64,
    pub timestamp: u64,
}

#[derive(Debug)]
pub struct EvolutionOutcome {
    pub evolved_traits: Vec<Trait>,
    pub resonance_shift: f64,
    pub quantum_impact: f64,
}

pub struct TraitEvolutionEngine {
    evolution_matrix: Vec<Vec<f64>>,
    quantum_catalyst: f64,
    mutation_threshold: f64,
    trait_memory: VecDeque<TraitMutation>,
    resonance_patterns: HashMap<String, Vec<f64>>,
    dimensional_weights: Vec<f64>,
    memory_capacity: usize,
}

impl TraitEvolutionEngine {
    pub fn new() -> Self {
        Self {
            evolution_matrix: vec![vec![1.0; 5]; 5],
            quantum_catalyst: 1.2,
            mutation_threshold: 0.6,
            trait_memory: VecDeque::with_capacity(100),
            resonance_patterns: HashMap::new(),
            dimensional_weights: vec![1.0, 0.8, 1.2, 0.9, 1.1],
            memory_capacity: 100,
        }
    }

    pub async fn evolve_traits(
        &mut self,
        traits: &mut Vec<Trait>,
        quantum_state: &QuantumState,
        consciousness_level: Option<ConsciousnessLevel>
    ) -> Result<EvolutionOutcome> {
        let evolution_power = self.calculate_evolution_power(quantum_state, consciousness_level);
        let resonance_factor = quantum_state.calculate_resonance();
        
        let mut outcome = EvolutionOutcome {
            evolved_traits: Vec::new(),
            resonance_shift: 0.0,
            quantum_impact: 0.0,
        };

        if evolution_power > self.mutation_threshold {
            self.apply_trait_mutations(traits, evolution_power, resonance_factor, &mut outcome).await?;
            self.process_dimensional_resonance(traits, quantum_state, &mut outcome);
            self.update_resonance_patterns(traits, quantum_state);
        }

        Ok(outcome)
    }

    fn calculate_evolution_power(
        &self, 
        quantum_state: &QuantumState,
        consciousness_level: Option<ConsciousnessLevel>
    ) -> f64 {
        let consciousness_multiplier = match consciousness_level {
            Some(ConsciousnessLevel::Transcendent) => 1.5,
            Some(ConsciousnessLevel::Enlightened) => 1.3,
            Some(ConsciousnessLevel::Awakened) => 1.2,
            Some(ConsciousnessLevel::Aware) => 1.1,
            _ => 1.0,
        };

        let base_power = quantum_state.coherence 
            * self.quantum_catalyst 
            * (1.0 + quantum_state.dimensional_frequency)
            * consciousness_multiplier;

        let resonance_bonus = quantum_state.resonance_field * 0.2;
        let phase_modifier = 1.0 + (quantum_state.phase_alignment * 0.15);

        (base_power + resonance_bonus) * phase_modifier
    }

    async fn apply_trait_mutations(
        &mut self,
        traits: &mut Vec<Trait>,
        power: f64,
        resonance: f64,
        outcome: &mut EvolutionOutcome
    ) -> Result<()> {
        for trait in traits.iter_mut() {
            let mutation = self.generate_trait_mutation(trait, power, resonance);
            
            if let Some(mutation) = mutation {
                self.record_mutation(mutation.clone());
                outcome.resonance_shift += mutation.resonance_impact;
                self.apply_mutation(trait, &mutation)?;
                outcome.evolved_traits.push(trait.clone());
            }
        }
        
        outcome.quantum_impact = power * resonance;
        Ok(())
    }

    fn generate_trait_mutation(
        &self,
        trait_: &Trait,
        power: f64,
        resonance: f64
    ) -> Option<TraitMutation> {
        let historical_influence = self.calculate_historical_influence(&trait_.id);
        let resonance_factor = self.get_resonance_pattern(&trait_.id)
            .map(|pattern| pattern.iter().sum::<f64>() / pattern.len() as f64)
            .unwrap_or(1.0);

        let magnitude = power * resonance * historical_influence * resonance_factor;
        
        if magnitude > self.mutation_threshold {
            Some(TraitMutation {
                trait_id: trait_.id.clone(),
                magnitude,
                resonance_impact: resonance * 0.1,
                timestamp: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
            })
        } else {
            None
        }
    }

    fn calculate_historical_influence(&self, trait_id: &str) -> f64 {
        let recent_mutations: Vec<_> = self.trait_memory
            .iter()
            .filter(|m| m.trait_id == trait_id)
            .collect();

        if recent_mutations.is_empty() {
            return 1.0;
        }

        let sum_magnitude: f64 = recent_mutations.iter()
            .map(|m| m.magnitude)
            .sum();

        1.0 + (sum_magnitude / recent_mutations.len() as f64).min(0.5)
    }

    fn process_dimensional_resonance(
        &self,
        traits: &[Trait],
        quantum_state: &QuantumState,
        outcome: &mut EvolutionOutcome
    ) {
        let dimensional_resonance = traits.iter()
            .enumerate()
            .map(|(i, trait_)| {
                self.dimensional_weights[i % self.dimensional_weights.len()] 
                * trait_.power 
                * quantum_state.dimensional_frequency
            })
            .sum::<f64>() / traits.len() as f64;

        outcome.quantum_impact *= 1.0 + (dimensional_resonance * 0.1);
    }

    fn update_resonance_patterns(
        &mut self,
        traits: &[Trait],
        quantum_state: &QuantumState
    ) {
        for trait_ in traits {
            let pattern = self.resonance_patterns
                .entry(trait_.id.clone())
                .or_insert_with(Vec::new);

            pattern.push(quantum_state.calculate_resonance());
            if pattern.len() > 10 {
                pattern.remove(0);
            }
        }
    }

    fn record_mutation(&mut self, mutation: TraitMutation) {
        if self.trait_memory.len() >= self.memory_capacity {
            self.trait_memory.pop_front();
        }
        self.trait_memory.push_back(mutation);
    }

    fn get_resonance_pattern(&self, trait_id: &str) -> Option<&Vec<f64>> {
        self.resonance_patterns.get(trait_id)
    }

    fn apply_mutation(&self, trait_: &mut Trait, mutation: &TraitMutation) -> Result<()> {
        trait_.power = (trait_.power + mutation.magnitude).min(10.0);
        trait_.last_evolution = mutation.timestamp;
        Ok(())
    }
}