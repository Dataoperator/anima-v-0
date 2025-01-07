use crate::quantum::QuantumState;
use crate::types::Result;

pub struct QuantumTraitEvolution {
    coherence_threshold: f64,
    evolution_rate: f64,
    stability_factor: f64,
}

impl QuantumTraitEvolution {
    pub fn new(coherence_threshold: f64, evolution_rate: f64, stability_factor: f64) -> Self {
        Self {
            coherence_threshold,
            evolution_rate,
            stability_factor,
        }
    }

    /// Calculate trait evolution based on quantum state
    pub fn calculate_evolution(&self, state: &QuantumState, current_traits: &[TraitValue]) -> Result<Vec<TraitEvolution>> {
        let mut evolutions = Vec::new();
        
        // Only evolve traits if quantum coherence is above threshold
        if state.coherence >= self.coherence_threshold {
            for trait_value in current_traits {
                let evolution = self.calculate_trait_evolution(trait_value, state)?;
                evolutions.push(evolution);
            }
        }
        
        Ok(evolutions)
    }

    /// Calculate individual trait evolution
    fn calculate_trait_evolution(&self, trait_value: &TraitValue, state: &QuantumState) -> Result<TraitEvolution> {
        let evolution_potential = self.calculate_evolution_potential(state);
        let stability_influence = self.calculate_stability_influence(state);
        
        let evolution_magnitude = evolution_potential * stability_influence * self.evolution_rate;
        
        Ok(TraitEvolution {
            trait_name: trait_value.name.clone(),
            current_value: trait_value.value,
            evolution_delta: evolution_magnitude,
            confidence: self.calculate_confidence(state),
        })
    }

    /// Calculate evolution potential based on quantum state
    fn calculate_evolution_potential(&self, state: &QuantumState) -> f64 {
        let coherence_factor = (state.coherence - self.coherence_threshold).max(0.0);
        let energy_factor = state.energy.min(1.0);
        
        coherence_factor * energy_factor
    }

    /// Calculate stability influence on evolution
    fn calculate_stability_influence(&self, state: &QuantumState) -> f64 {
        let stability = state.stability.max(0.0).min(1.0);
        (stability * self.stability_factor).exp()
    }

    /// Calculate confidence in evolution prediction
    fn calculate_confidence(&self, state: &QuantumState) -> f64 {
        let base_confidence = state.coherence * state.stability;
        let scaled_confidence = base_confidence.powf(0.5); // Square root for smoother scaling
        scaled_confidence.max(0.0).min(1.0)
    }
}

#[derive(Debug, Clone)]
pub struct TraitValue {
    pub name: String,
    pub value: f64,
}

#[derive(Debug)]
pub struct TraitEvolution {
    pub trait_name: String,
    pub current_value: f64,
    pub evolution_delta: f64,
    pub confidence: f64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_trait_evolution_calculation() {
        let evolution_system = QuantumTraitEvolution::new(0.5, 0.1, 0.8);
        
        let state = QuantumState {
            coherence: 0.8,
            energy: 0.7,
            stability: 0.9,
            // ... other fields ...
        };
        
        let traits = vec![
            TraitValue {
                name: "Creativity".to_string(),
                value: 0.6,
            }
        ];
        
        let evolutions = evolution_system.calculate_evolution(&state, &traits).unwrap();
        
        assert!(!evolutions.is_empty());
        assert!(evolutions[0].confidence > 0.0 && evolutions[0].confidence <= 1.0);
        assert!(evolutions[0].evolution_delta != 0.0);
    }
}