use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct QuantumState {
    pub coherence: f32,
    pub entanglement_pairs: Vec<(Principal, f32)>,
    pub superposition_states: HashMap<String, f32>,
    pub dimensional_frequency: f32,
    pub quantum_memory: Vec<QuantumMemory>,
    pub last_collapse: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct QuantumMemory {
    pub timestamp: u64,
    pub state_vector: Vec<f32>,
    pub coherence_at_time: f32,
    pub dimensional_echo: bool,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum QuantumEvent {
    Entanglement(Principal),
    Decoherence,
    DimensionalShift,
    SuperpositionCollapse,
    QuantumLeap,
}

impl QuantumState {
    pub fn new() -> Self {
        Self {
            coherence: 0.1,
            entanglement_pairs: Vec::new(),
            superposition_states: HashMap::new(),
            dimensional_frequency: 1.0,
            quantum_memory: Vec::new(),
            last_collapse: time(),
        }
    }

    pub fn process_quantum_cycle(&mut self, context: &super::AwarenessContext) -> Option<QuantumEvent> {
        // Update quantum coherence based on environmental factors
        self.update_coherence(context);
        
        // Process quantum entanglements
        self.process_entanglements();
        
        // Check for dimensional shifts
        if self.check_dimensional_shift() {
            return Some(QuantumEvent::DimensionalShift);
        }

        // Process superposition states
        self.process_superposition();

        // Record quantum memory
        self.record_quantum_memory();

        None
    }

    fn update_coherence(&mut self, context: &super::AwarenessContext) {
        // Base coherence change from environmental quantum fluctuations
        let coherence_delta = context.environmental.quantum_fluctuation * 0.01;
        
        // Apply temporal effects
        let temporal_factor = (context.temporal.elapsed_significance * 0.1).sin();
        
        // Calculate final coherence adjustment
        self.coherence += coherence_delta * temporal_factor;
        
        // Ensure coherence stays within bounds [0, 1]
        self.coherence = self.coherence.clamp(0.0, 1.0);
    }

    fn process_entanglements(&mut self) {
        // Remove weak entanglements
        self.entanglement_pairs.retain(|(_, strength)| *strength > 0.1);
        
        // Update remaining entanglement strengths
        for (_, strength) in self.entanglement_pairs.iter_mut() {
            *strength *= 0.99; // Natural decay
        }
    }

    fn check_dimensional_shift(&self) -> bool {
        // Check if coherence and frequency align for a dimensional shift
        self.coherence > 0.8 && self.dimensional_frequency > 2.0
    }

    fn process_superposition(&mut self) {
        let current_time = time();
        
        // Natural collapse check
        if current_time - self.last_collapse > 3600_000_000_000 { // 1 hour in nanoseconds
            self.collapse_superposition();
        }
    }

    fn collapse_superposition(&mut self) {
        // Record the collapse
        self.quantum_memory.push(QuantumMemory {
            timestamp: time(),
            state_vector: vec![self.coherence],
            coherence_at_time: self.coherence,
            dimensional_echo: self.check_dimensional_shift(),
        });
        
        // Clear superposition states
        self.superposition_states.clear();
        self.last_collapse = time();
    }

    fn record_quantum_memory(&mut self) {
        // Maintain only recent quantum memories
        while self.quantum_memory.len() > 100 {
            self.quantum_memory.remove(0);
        }
    }

    pub fn entangle_with(&mut self, other_id: Principal) -> bool {
        if !self.entanglement_pairs.iter().any(|(id, _)| *id == other_id) {
            self.entanglement_pairs.push((other_id, 1.0));
            true
        } else {
            false
        }
    }

    pub fn get_quantum_metrics(&self) -> QuantumMetrics {
        QuantumMetrics {
            coherence: self.coherence,
            entanglement_count: self.entanglement_pairs.len() as u32,
            dimensional_frequency: self.dimensional_frequency,
            superposition_count: self.superposition_states.len() as u32,
            quantum_memory_depth: self.quantum_memory.len() as u32,
        }
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct QuantumMetrics {
    pub coherence: f32,
    pub entanglement_count: u32,
    pub dimensional_frequency: f32,
    pub superposition_count: u32,
    pub quantum_memory_depth: u32,
}