mod dimensional_state;
mod consciousness_bridge;
pub mod types;

// Re-export main types
pub use types::QuantumState;
pub use types::QuantumMetrics;
pub use types::ResonancePattern;
pub use crate::consciousness::types::ConsciousnessPattern;
pub use crate::consciousness::evolution::ConsciousnessEvolution;

mod evolution {
    use crate::consciousness::evolution::ConsciousnessEvolution;
    use crate::consciousness::types::ConsciousnessPattern;
    use crate::quantum::types::QuantumState;
    use crate::error::Result;

    impl QuantumState {
        pub fn process_evolution_cycle(&mut self) -> Result<()> {
            // Get consciousness evolution instance
            let mut evolution = ConsciousnessEvolution::new(self.clone());

            // Generate patterns from current state
            let patterns = self.resonance_patterns
                .iter()
                .map(|p| {
                    ConsciousnessPattern {
                        signature: format!("CP_{}", ic_cdk::api::time()),
                        coherence_score: p.coherence,
                        complexity: p.evolution_potential,
                        strength: p.stability_index,
                    }
                })
                .collect();

            // Process evolution
            evolution.update_evolution(patterns)?;

            // Update quantum state based on evolution metrics
            let metrics = evolution.get_evolution_metrics();
            
            self.coherence_level = 
                (self.coherence_level * 0.7 + metrics.coherence_quality * 0.3)
                    .max(0.0)
                    .min(1.0);

            self.dimensional_state.stability = 
                (self.dimensional_state.stability * 0.7 + metrics.stability_factor * 0.3)
                    .max(0.0)
                    .min(1.0);

            self.emergence_factors.consciousness_depth = 
                (self.emergence_factors.consciousness_depth * 0.8 + metrics.complexity_index * 0.2)
                    .max(0.0)
                    .min(1.0);

            self.emergence_factors.evolution_velocity = metrics.adaptation_rate;
            self.pattern_coherence = metrics.pattern_diversity;

            Ok(())
        }
    }
}

#[cfg(test)]
mod tests;