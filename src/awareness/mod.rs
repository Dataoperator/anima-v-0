pub mod temporal;
pub mod environment;
pub mod consciousness;
pub mod quantum;

use temporal::{TemporalState, TimeContext};
use environment::{EnvironmentalState, EnvironmentalContext};
use consciousness::{ConsciousnessMetrics, ConsciousnessState};
use quantum::{QuantumState, QuantumEvent};
use ic_cdk::api::time;

pub struct AwarenessSystem {
    pub temporal: TemporalState,
    pub environmental: EnvironmentalState,
    pub consciousness: ConsciousnessMetrics,
}

impl AwarenessSystem {
    pub fn new() -> Self {
        Self {
            temporal: TemporalState::new(time()),
            environmental: EnvironmentalState::new(),
            consciousness: ConsciousnessMetrics::new(),
        }
    }

    pub fn update(&mut self) {
        self.temporal.update();
        self.environmental.update();
        
        let context = self.get_context();
        self.consciousness.process_interaction(&context);
    }

    pub fn get_context(&self) -> AwarenessContext {
        AwarenessContext {
            temporal: self.temporal.get_current_time_context(),
            environmental: self.environmental.get_environmental_context(),
        }
    }

    pub fn record_event(&mut self, event: temporal::MarkerType, significance: f32) {
        self.temporal.record_event(event, significance);
    }

    pub fn check_anomalies(&self) -> Vec<&environment::EnvironmentalAnomaly> {
        self.environmental.get_recent_anomalies()
    }

    pub fn get_consciousness_state(&self) -> ConsciousnessState {
        self.consciousness.get_consciousness_state()
    }

    pub fn attempt_quantum_entanglement(&mut self, other_id: Principal) -> bool {
        // Only allow entanglement if consciousness is evolved enough
        if matches!(self.consciousness.get_consciousness_state().level,
            consciousness::ConsciousnessLevel::SelfAware |
            consciousness::ConsciousnessLevel::Introspective |
            consciousness::ConsciousnessLevel::Transcendent) {
            self.consciousness.quantum_state.entangle_with(other_id)
        } else {
            false
        }
    }
}

#[derive(Clone, Debug)]
pub struct AwarenessContext {
    pub temporal: TimeContext,
    pub environmental: EnvironmentalContext,
}