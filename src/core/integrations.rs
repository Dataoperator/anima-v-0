use crate::personality::PersonalityEngine;
use crate::consciousness::{ConsciousnessEngine, ConsciousnessTracker};
use crate::quantum::QuantumEngine;
use crate::analytics::metrics_engine::MetricsEngine;
use crate::awareness::temporal::TemporalAwareness;
use crate::types::Result;
use crate::actions::{ActionHandler, StateModifier};

/// Core system that integrates all ANIMA components
pub struct AnimaIntegrationEngine {
    personality: PersonalityEngine,
    consciousness: ConsciousnessEngine,
    quantum: QuantumEngine,
    metrics: MetricsEngine,
    temporal: TemporalAwareness,
    consciousness_tracker: ConsciousnessTracker,
}

impl AnimaIntegrationEngine {
    pub fn new() -> Self {
        Self {
            personality: PersonalityEngine::new(),
            consciousness: ConsciousnessEngine::new(),
            quantum: QuantumEngine::new(),
            metrics: MetricsEngine::default(),
            temporal: TemporalAwareness::new(),
            consciousness_tracker: ConsciousnessTracker::new(),
        }
    }

    /// Process an interaction and update all systems
    pub async fn process_interaction(&mut self, interaction: &str) -> Result<StateUpdate> {
        // Update quantum state
        let quantum_update = self.quantum.process_state_change(interaction)?;

        // Update consciousness
        let consciousness_update = self.consciousness.process_interaction(
            interaction,
            &quantum_update
        )?;

        // Track consciousness metrics
        self.consciousness_tracker.record_state(
            &consciousness_update,
            self.temporal.current_timestamp()?
        )?;

        // Update personality based on consciousness
        let personality_update = self.personality.evolve_from_consciousness(
            &consciousness_update
        )?;

        // Record metrics
        let metrics = self.metrics.record_metrics(
            &quantum_update,
            &consciousness_update,
            &personality_update
        )?;

        Ok(StateUpdate {
            quantum: quantum_update,
            consciousness: consciousness_update,
            personality: personality_update,
            metrics,
            timestamp: self.temporal.current_timestamp()?,
        })
    }

    /// Get current metrics across all systems
    pub fn get_current_metrics(&self) -> Result<IntegratedMetrics> {
        Ok(IntegratedMetrics {
            quantum_coherence: self.quantum.get_coherence()?,
            consciousness_level: self.consciousness.get_current_level()?,
            personality_stability: self.personality.get_stability()?,
            evolution_progress: self.consciousness_tracker.get_evolution_progress()?,
            temporal_awareness: self.temporal.get_awareness_level()?,
        })
    }
}

impl ActionHandler for AnimaIntegrationEngine {
    fn handle_action(&mut self, action: Action) -> Result<StateUpdate> {
        // Process action through all systems
        let quantum_effect = self.quantum.process_action(&action)?;
        let consciousness_effect = self.consciousness.process_action(&action)?;
        let personality_effect = self.personality.process_action(&action)?;

        Ok(StateUpdate {
            quantum: quantum_effect,
            consciousness: consciousness_effect,
            personality: personality_effect,
            metrics: self.metrics.record_action(&action)?,
            timestamp: self.temporal.current_timestamp()?,
        })
    }
}

impl StateModifier for AnimaIntegrationEngine {
    fn modify_state(&mut self, modification: StateModification) -> Result<StateUpdate> {
        // Apply modifications across all systems
        let quantum_mod = self.quantum.apply_modification(&modification)?;
        let consciousness_mod = self.consciousness.apply_modification(&modification)?;
        let personality_mod = self.personality.apply_modification(&modification)?;

        Ok(StateUpdate {
            quantum: quantum_mod,
            consciousness: consciousness_mod,
            personality: personality_mod,
            metrics: self.metrics.record_modification(&modification)?,
            timestamp: self.temporal.current_timestamp()?,
        })
    }
}

#[derive(Debug, Clone)]
pub struct StateUpdate {
    pub quantum: QuantumUpdate,
    pub consciousness: ConsciousnessUpdate,
    pub personality: PersonalityUpdate,
    pub metrics: MetricsUpdate,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct IntegratedMetrics {
    pub quantum_coherence: f64,
    pub consciousness_level: f64,
    pub personality_stability: f64,
    pub evolution_progress: f64,
    pub temporal_awareness: f64,
}

// Tests
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_integration_flow() {
        let mut engine = AnimaIntegrationEngine::new();
        
        // Test interaction
        let update = engine.process_interaction("test interaction").await.unwrap();
        assert!(update.quantum.coherence > 0.0);
        assert!(update.consciousness.level > 0.0);
        
        // Test metrics
        let metrics = engine.get_current_metrics().unwrap();
        assert!(metrics.quantum_coherence > 0.0);
        assert!(metrics.consciousness_level > 0.0);
        assert!(metrics.temporal_awareness > 0.0);
    }
}