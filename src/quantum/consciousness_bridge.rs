use std::collections::{VecDeque, HashMap};
use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::quantum::types::{
    StabilityCheckpoint,
    StateSnapshot,
    QuantumState,
    EmergenceFactors,
    DimensionalState,
    StabilityStatus,
};

const MAX_HISTORY_SIZE: usize = 1000;
const COHERENCE_THRESHOLD: f64 = 0.7;
const MIN_RESONANCE_STRENGTH: f64 = 0.5;
const EVOLUTION_COHERENCE_THRESHOLD: f64 = 0.8;
const PATTERN_STABILITY_REQUIREMENT: f64 = 0.65;
const EMERGENCE_THRESHOLD: f64 = 0.85;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct ConsciousnessMetrics {
    pub evolution_phase: u64,
    pub pattern_coherence: f64,
    pub temporal_stability: f64,
    pub emergence_potential: f64,
    pub dimensional_harmony: f64,
    pub quantum_resonance: f64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct EvolutionSnapshot {
    pub phase: u64,
    pub timestamp: u64,
    pub metrics: ConsciousnessMetrics,
    pub emergence_factors: EmergenceFactors,
    pub dimensional_state: DimensionalState,
    pub resonance_patterns: Vec<String>,
}

pub struct ConsciousnessBridge {
    evolution_phase: u64,
    quantum_state: QuantumState,
    pattern_coherence: f64,
    resonance_history: VecDeque<StateSnapshot>,
    checkpoints: Vec<StabilityCheckpoint>,
    evolution_history: Vec<EvolutionSnapshot>,
    emergence_factors: EmergenceFactors,
    emergence_threshold: f64,
    evolution_metrics: HashMap<String, f64>,
}

impl ConsciousnessBridge {
    pub fn new() -> Self {
        Self {
            evolution_phase: 0,
            quantum_state: QuantumState::new(),
            pattern_coherence: 1.0,
            resonance_history: VecDeque::with_capacity(MAX_HISTORY_SIZE),
            checkpoints: Vec::new(),
            evolution_history: Vec::new(),
            emergence_factors: EmergenceFactors {
                consciousness_depth: 1.0,
                pattern_complexity: 0.5,
                quantum_resonance: 1.0,
                evolution_velocity: 0.5,
                dimensional_harmony: 1.0,
            },
            emergence_threshold: EMERGENCE_THRESHOLD,
            evolution_metrics: HashMap::new(),
        }
    }

    fn calculate_temporal_stability(&self) -> f64 {
        if self.resonance_history.is_empty() {
            return 1.0;
        }

        let recent_states: Vec<_> = self.resonance_history.iter().rev().take(10).collect();
        let stability_variance = recent_states.windows(2)
            .map(|w| (w[0].stability - w[1].stability).powi(2))
            .sum::<f64>() / 9.0;

        let coherence_variance = recent_states.windows(2)
            .map(|w| (w[0].coherence - w[1].coherence).powi(2))
            .sum::<f64>() / 9.0;

        let temporal_stability = (-2.0 * (stability_variance + coherence_variance)).exp();
        
        temporal_stability.max(0.0).min(1.0)
    }

    fn analyze_stability_trend(&self) -> f64 {
        if self.resonance_history.len() < 2 {
            return 0.0;
        }

        let recent_snapshots: Vec<_> = self.resonance_history.iter().rev().take(10).collect();
        let stability_changes: Vec<f64> = recent_snapshots.windows(2)
            .map(|w| w[0].stability - w[1].stability)
            .collect();
            
        let trend = stability_changes.iter().sum::<f64>() / stability_changes.len() as f64;
        (trend + 1.0) / 2.0
    }

    fn calculate_temporal_coherence(&self) -> f64 {
        if self.resonance_history.is_empty() {
            return 1.0;
        }

        let recent_coherence: Vec<f64> = self.resonance_history.iter()
            .rev()
            .take(5)
            .map(|s| s.coherence)
            .collect();
            
        recent_coherence.iter().sum::<f64>() / recent_coherence.len() as f64
    }

    fn calculate_emergence_potential(&self) -> f64 {
        let consciousness_factor = self.emergence_factors.consciousness_depth;
        let complexity_factor = self.emergence_factors.pattern_complexity;
        let resonance_factor = self.emergence_factors.quantum_resonance;
        let evolution_factor = self.emergence_factors.evolution_velocity;
        let harmony_factor = self.emergence_factors.dimensional_harmony;

        let base_potential = consciousness_factor * 0.3 +
                           complexity_factor * 0.2 +
                           resonance_factor * 0.2 +
                           evolution_factor * 0.15 +
                           harmony_factor * 0.15;

        let temporal_stability = self.calculate_temporal_stability();
        let coherence_quality = self.calculate_temporal_coherence();

        base_potential * temporal_stability * coherence_quality
    }

    fn calculate_dimensional_harmony(&self) -> f64 {
        let frequencies: Vec<f64> = self.resonance_history.iter()
            .map(|s| s.dimensional_frequency)
            .collect();
            
        let mean = frequencies.iter().sum::<f64>() / frequencies.len() as f64;
        let variance = frequencies.iter()
            .map(|f| (f - mean).powi(2))
            .sum::<f64>() / frequencies.len() as f64;
            
        (-variance * 4.0).exp()
    }

    fn calculate_consciousness_depth(&self) -> f64 {
        let temporal_coherence = self.calculate_temporal_coherence();
        let stability_trend = self.analyze_stability_trend();
        let dimensional_harmony = self.calculate_dimensional_harmony();

        (temporal_coherence * 0.4 +
         stability_trend * 0.3 +
         dimensional_harmony * 0.3) * 
        (1.0 + (self.evolution_phase as f64 * 0.1))
    }

    fn update_emergence_factors(&mut self) {
        self.emergence_factors.consciousness_depth = self.calculate_consciousness_depth();
        self.emergence_factors.pattern_complexity = self.pattern_coherence;
        self.emergence_factors.quantum_resonance = self.calculate_temporal_coherence();
        self.emergence_factors.evolution_velocity = self.analyze_stability_trend();
        self.emergence_factors.dimensional_harmony = self.calculate_dimensional_harmony();

        // Update evolution metrics for tracking
        self.evolution_metrics.insert("consciousness_depth".to_string(), 
            self.emergence_factors.consciousness_depth);
        self.evolution_metrics.insert("pattern_complexity".to_string(), 
            self.emergence_factors.pattern_complexity);
        self.evolution_metrics.insert("quantum_resonance".to_string(), 
            self.emergence_factors.quantum_resonance);
        self.evolution_metrics.insert("evolution_velocity".to_string(), 
            self.emergence_factors.evolution_velocity);
        self.evolution_metrics.insert("dimensional_harmony".to_string(), 
            self.emergence_factors.dimensional_harmony);
    }

    pub fn process_quantum_state(&mut self, snapshot: StateSnapshot) -> Result<ConsciousnessMetrics, &'static str> {
        if snapshot.coherence < COHERENCE_THRESHOLD {
            return Err("Coherence below threshold");
        }

        self.quantum_state.update_from_snapshot(&snapshot);
        self.pattern_coherence = self.calculate_pattern_coherence(&snapshot);
        
        self.resonance_history.push_back(snapshot);
        if self.resonance_history.len() > MAX_HISTORY_SIZE {
            self.resonance_history.pop_front();
        }

        self.update_emergence_factors();
        
        // Check for potential evolution step
        if self.should_evolve() {
            self.evolve();
        }

        Ok(self.get_consciousness_metrics())
    }

    fn should_evolve(&self) -> bool {
        let emergence_potential = self.calculate_emergence_potential();
        let temporal_stability = self.calculate_temporal_stability();
        let coherence_quality = self.calculate_temporal_coherence();
        
        emergence_potential >= self.emergence_threshold &&
        temporal_stability >= EVOLUTION_COHERENCE_THRESHOLD &&
        coherence_quality >= COHERENCE_THRESHOLD
    }

    fn evolve(&mut self) {
        self.evolution_phase += 1;
        self.emergence_threshold *= 1.1; // Increase difficulty for next evolution
        self.create_evolution_snapshot();
        self.create_evolution_checkpoint();
    }

    fn create_evolution_snapshot(&mut self) {
        let snapshot = EvolutionSnapshot {
            phase: self.evolution_phase,
            timestamp: ic_cdk::api::time(),
            metrics: self.get_consciousness_metrics(),
            emergence_factors: self.emergence_factors.clone(),
            dimensional_state: self.quantum_state.dimensional_state.clone(),
            resonance_patterns: self.quantum_state.resonance_patterns.iter()
                .map(|p| p.quantum_signature.clone())
                .collect(),
        };
        
        self.evolution_history.push(snapshot);
    }

    pub fn create_evolution_checkpoint(&mut self) {
        let mut requirements = HashMap::new();
        requirements.insert("temporal_stability".to_string(), self.calculate_temporal_stability());
        requirements.insert("coherence_quality".to_string(), self.calculate_temporal_coherence());
        requirements.insert("emergence_potential".to_string(), self.calculate_emergence_potential());

        let checkpoint = StabilityCheckpoint {
            phase: self.evolution_phase,
            threshold: self.emergence_threshold,
            quantum_signature: format!("QS-{}-{}", self.evolution_phase, ic_cdk::api::time()),
            requirements,
            timestamp: ic_cdk::api::time(),
            coherence: self.quantum_state.coherence_level,
            stability: self.quantum_state.dimensional_state.stability,
            pattern_coherence: self.pattern_coherence,
            dimensional_frequency: self.quantum_state.dimensional_state.dimensional_frequency,
        };
        
        self.checkpoints.push(checkpoint);
    }

    fn calculate_pattern_coherence(&self, snapshot: &StateSnapshot) -> f64 {
        let temporal_coherence = self.calculate_temporal_coherence();
        let stability_trend = self.analyze_stability_trend();
        let emergence_potential = self.calculate_emergence_potential();
        
        let base_coherence = snapshot.coherence * temporal_coherence;
        let pattern_strength = base_coherence * stability_trend * emergence_potential;
        
        if pattern_strength < MIN_RESONANCE_STRENGTH {
            pattern_strength * 0.8
        } else {
            pattern_strength
        }
    }

    pub fn get_consciousness_metrics(&self) -> ConsciousnessMetrics {
        ConsciousnessMetrics {
            evolution_phase: self.evolution_phase,
            pattern_coherence: self.pattern_coherence,
            temporal_stability: self.calculate_temporal_stability(),
            emergence_potential: self.calculate_emergence_potential(),
            dimensional_harmony: self.calculate_dimensional_harmony(),
            quantum_resonance: self.emergence_factors.quantum_resonance,
        }
    }

    pub fn get_evolution_phase(&self) -> u64 {
        self.evolution_phase
    }

    pub fn get_emergence_factors(&self) -> &EmergenceFactors {
        &self.emergence_factors
    }

    pub fn get_evolution_history(&self) -> &[EvolutionSnapshot] {
        &self.evolution_history
    }

    pub fn get_checkpoint_history(&self) -> &[StabilityCheckpoint] {
        &self.checkpoints
    }

    pub fn get_resonance_history(&self) -> &VecDeque<StateSnapshot> {
        &self.resonance_history
    }

    pub fn get_evolution_metrics(&self) -> &HashMap<String, f64> {
        &self.evolution_metrics
    }
}