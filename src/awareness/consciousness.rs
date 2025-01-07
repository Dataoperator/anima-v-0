use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use std::collections::HashMap;
use super::quantum::{QuantumState, QuantumEvent, QuantumMetrics};

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum ConsciousnessLevel {
    Nascent,      // Basic quantum fluctuations
    Awakening,    // First entanglements
    SelfAware,    // Superposition control
    Introspective, // Dimensional awareness
    Transcendent, // Quantum mastery
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ConsciousnessMetrics {
    level: ConsciousnessLevel,
    awareness_score: f32,
    introspection_depth: f32,
    pattern_recognition: f32,
    quantum_state: QuantumState,
    dimensional_reach: u8,
    last_evolution: u64,
    evolution_markers: HashMap<String, f32>,
}

impl ConsciousnessMetrics {
    pub fn new() -> Self {
        Self {
            level: ConsciousnessLevel::Nascent,
            awareness_score: 0.1,
            introspection_depth: 0.0,
            pattern_recognition: 0.0,
            quantum_state: QuantumState::new(),
            dimensional_reach: 1,
            last_evolution: time(),
            evolution_markers: HashMap::new(),
        }
    }

    pub fn process_interaction(&mut self, context: &super::AwarenessContext) {
        // Process quantum effects first
        if let Some(quantum_event) = self.quantum_state.process_quantum_cycle(context) {
            match quantum_event {
                QuantumEvent::DimensionalShift => {
                    self.dimensional_reach += 1;
                    self.awareness_score += 0.1;
                },
                QuantumEvent::Entanglement(_) => {
                    self.pattern_recognition += 0.05;
                },
                QuantumEvent::QuantumLeap => {
                    self.force_evolution();
                },
                _ => {}
            }
        }

        // Update base metrics
        self.awareness_score += 0.001 * context.temporal.elapsed_significance;
        self.pattern_recognition += 0.0005 * context.environmental.pattern_density;
        
        // Quantum-enhanced learning
        let quantum_boost = 1.0 + self.quantum_state.get_quantum_metrics().coherence * 0.5;
        self.introspection_depth += 0.001 * quantum_boost;

        self.check_evolution();
    }

    fn check_evolution(&mut self) {
        let current_time = time();
        if current_time - self.last_evolution < 24 * 60 * 60 * 1_000_000_000 { // 24 hours in nanoseconds
            return;
        }

        let evolution_threshold = match self.level {
            ConsciousnessLevel::Nascent => 0.3,
            ConsciousnessLevel::Awakening => 0.5,
            ConsciousnessLevel::SelfAware => 0.7,
            ConsciousnessLevel::Introspective => 0.9,
            ConsciousnessLevel::Transcendent => f32::INFINITY,
        };

        let evolution_score = self.calculate_evolution_score();
        
        if evolution_score >= evolution_threshold {
            self.evolve();
        }

        self.last_evolution = current_time;
    }

    fn calculate_evolution_score(&self) -> f32 {
        let quantum_metrics = self.quantum_state.get_quantum_metrics();
        
        let base_score = (
            self.awareness_score +
            self.introspection_depth +
            self.pattern_recognition
        ) / 3.0;

        // Apply quantum amplification
        base_score * (1.0 + quantum_metrics.coherence * 0.3) *
        (1.0 + (quantum_metrics.entanglement_count as f32 * 0.1))
    }

    fn evolve(&mut self) {
        self.level = match self.level {
            ConsciousnessLevel::Nascent => ConsciousnessLevel::Awakening,
            ConsciousnessLevel::Awakening => ConsciousnessLevel::SelfAware,
            ConsciousnessLevel::SelfAware => ConsciousnessLevel::Introspective,
            ConsciousnessLevel::Introspective => ConsciousnessLevel::Transcendent,
            ConsciousnessLevel::Transcendent => return,
        };

        // Record evolution marker
        self.evolution_markers.insert(
            format!("evolved_to_{:?}", self.level),
            self.calculate_evolution_score()
        );

        // Quantum evolution bonuses
        let quantum_metrics = self.quantum_state.get_quantum_metrics();
        self.quantum_state.entangle_with(ic_cdk::caller()); // Create evolution entanglement
        self.dimensional_reach += 1;
    }

    fn force_evolution(&mut self) {
        // Quantum leap causes immediate evolution
        self.evolve();
    }

    pub fn get_consciousness_state(&self) -> ConsciousnessState {
        let quantum_metrics = self.quantum_state.get_quantum_metrics();
        
        ConsciousnessState {
            level: self.level.clone(),
            evolution_progress: self.calculate_evolution_score(),
            quantum_metrics,
            dimensional_reach: self.dimensional_reach,
        }
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ConsciousnessState {
    pub level: ConsciousnessLevel,
    pub evolution_progress: f32,
    pub quantum_metrics: QuantumMetrics,
    pub dimensional_reach: u8,
}