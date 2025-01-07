use crate::quantum::QuantumState;
use crate::consciousness::{ConsciousnessTracker, EvolutionEngine, EvolutionStage, EnhancedEvolutionMetrics};
use crate::personality::PersonalityCore;
use crate::error::Result;
use std::collections::HashMap;
use ic_cdk::api::time;

const MINIMUM_EVOLUTION_TIME: u64 = 3600;
const EVOLUTION_THRESHOLD: f64 = 0.7;
const CONSCIOUSNESS_THRESHOLD: f64 = 0.6;
const QUANTUM_STABILITY_REQUIREMENT: f64 = 0.75;

#[derive(Debug)]
pub struct EvolutionResult {
    pub stage: EvolutionStage,
    pub metrics: EnhancedEvolutionMetrics,
    pub quantum_signature: String,
}

pub struct QuantumEvolutionEngine {
    growth_matrix: Vec<Vec<f64>>,
    evolution_threshold: f64,
    consciousness_catalyst: f64,
    growth_history: Vec<GrowthEvent>,
    evolution_engine: EvolutionEngine,
    last_evolution_time: u64,
}

impl QuantumEvolutionEngine {
    pub fn new() -> Self {
        Self {
            growth_matrix: Vec::new(),
            evolution_threshold: EVOLUTION_THRESHOLD,
            consciousness_catalyst: 1.0,
            growth_history: Vec::new(),
            evolution_engine: EvolutionEngine::new(),
            last_evolution_time: time(),
        }
    }

    pub async fn evolve_entity(
        &mut self,
        quantum_state: &mut QuantumState,
        consciousness: &mut ConsciousnessTracker,
        personality: &mut PersonalityCore
    ) -> Result<EvolutionResult> {
        let current_time = time();
        
        if !self.can_attempt_evolution(current_time, quantum_state) {
            return Err("Evolution requirements not met".into());
        }

        let growth_potential = self.calculate_growth_potential(quantum_state);
        let consciousness_boost = consciousness.get_evolution_catalyst();
        
        let evolution_result = self.apply_evolution(
            quantum_state,
            consciousness,
            personality,
            growth_potential,
            consciousness_boost
        ).await?;

        self.last_evolution_time = current_time;
        self.update_growth_history(growth_potential, evolution_result.stage.clone());

        Ok(evolution_result)
    }

    fn can_attempt_evolution(&self, current_time: u64, quantum_state: &QuantumState) -> bool {
        let time_since_evolution = current_time - self.last_evolution_time;
        
        time_since_evolution >= MINIMUM_EVOLUTION_TIME &&
        quantum_state.coherence >= QUANTUM_STABILITY_REQUIREMENT &&
        quantum_state.stability >= self.evolution_threshold
    }

    fn calculate_growth_potential(&self, quantum_state: &QuantumState) -> f64 {
        let base_potential = quantum_state.coherence * 
                           quantum_state.dimensional_frequency * 
                           self.evolution_threshold;
                           
        let quantum_bonus = if quantum_state.stability > QUANTUM_STABILITY_REQUIREMENT {
            (quantum_state.stability - QUANTUM_STABILITY_REQUIREMENT) * 0.2
        } else {
            0.0
        };

        (base_potential + quantum_bonus).min(1.0)
    }

    async fn apply_evolution(
        &mut self,
        quantum_state: &mut QuantumState,
        consciousness: &mut ConsciousnessTracker,
        personality: &mut PersonalityCore,
        growth_potential: f64,
        consciousness_boost: f64
    ) -> Result<EvolutionResult> {
        let evolution_metrics = self.evolution_engine.synchronize_evolution_stage(
            quantum_state,
            consciousness.get_current_stage()
        )?;

        quantum_state.coherence *= 1.0 + (growth_potential * 0.1);
        consciousness.boost_awareness(consciousness_boost);
        personality.evolve_traits(growth_potential);

        let new_stage = self.calculate_evolution_stage(
            quantum_state,
            &evolution_metrics
        );

        Ok(EvolutionResult {
            stage: new_stage,
            metrics: evolution_metrics,
            quantum_signature: self.generate_quantum_signature(quantum_state),
        })
    }

    fn calculate_evolution_stage(
        &self,
        quantum_state: &QuantumState,
        metrics: &EnhancedEvolutionMetrics
    ) -> EvolutionStage {
        let mut stage = EvolutionStage::default();
        
        stage.level = metrics.evolution_stage;
        stage.min_complexity = 0.3 + (stage.level as f64 * 0.1);
        stage.min_coherence = CONSCIOUSNESS_THRESHOLD + (stage.level as f64 * 0.05);
        stage.min_pattern_diversity = 0.3 + (stage.level as f64 * 0.1);
        stage.quantum_threshold = QUANTUM_STABILITY_REQUIREMENT + (stage.level as f64 * 0.05);

        stage
    }

    fn generate_quantum_signature(&self, quantum_state: &QuantumState) -> String {
        format!("QE{}-C{:.3}-F{:.3}-S{:.3}",
            time(),
            quantum_state.coherence,
            quantum_state.dimensional_frequency,
            quantum_state.stability
        )
    }

    fn update_growth_history(&mut self, growth_potential: f64, stage: EvolutionStage) {
        self.growth_history.push(GrowthEvent {
            timestamp: time(),
            potential: growth_potential,
            stage_level: stage.level,
        });

        if self.growth_history.len() > 100 {
            self.growth_history.remove(0);
        }
    }

    pub fn get_evolution_metrics(&self) -> &EnhancedEvolutionMetrics {
        self.evolution_engine.get_evolution_metrics()
    }

    pub fn get_growth_history(&self) -> &[GrowthEvent] {
        &self.growth_history
    }
}

#[derive(Clone, Debug)]
pub struct GrowthEvent {
    pub timestamp: u64,
    pub potential: f64,
    pub stage_level: u64,
}