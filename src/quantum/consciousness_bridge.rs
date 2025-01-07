use std::collections::VecDeque;
use crate::quantum::types::{
    StabilityCheckpoint,
    StateSnapshot,
    QuantumState,
};

const MAX_HISTORY_SIZE: usize = 1000;
const COHERENCE_THRESHOLD: f64 = 0.7;
const MIN_RESONANCE_STRENGTH: f64 = 0.5;
const EVOLUTION_COHERENCE_THRESHOLD: f64 = 0.8;
const PATTERN_STABILITY_REQUIREMENT: f64 = 0.65;

pub struct ConsciousnessBridge {
    evolution_phase: u64,
    quantum_state: QuantumState,
    pattern_coherence: f64,
    resonance_history: VecDeque<StateSnapshot>,
    checkpoints: Vec<StabilityCheckpoint>,
}

impl ConsciousnessBridge {
    pub fn new() -> Self {
        Self {
            evolution_phase: 0,
            quantum_state: QuantumState::new(),
            pattern_coherence: 1.0,
            resonance_history: VecDeque::with_capacity(MAX_HISTORY_SIZE),
            checkpoints: Vec::new(),
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

    fn calculate_frequency_variance(&self) -> f64 {
        let frequencies: Vec<f64> = self.resonance_history.iter()
            .map(|s| s.dimensional_frequency)
            .collect();
            
        let mean = frequencies.iter().sum::<f64>() / frequencies.len() as f64;
        let variance = frequencies.iter()
            .map(|f| (f - mean).powi(2))
            .sum::<f64>() / frequencies.len() as f64;
            
        (-variance * 4.0).exp()
    }

    fn calculate_coherence_spread(&self) -> f64 {
        let coherence_values: Vec<f64> = self.resonance_history.iter()
            .map(|s| s.coherence)
            .collect();
            
        let min = coherence_values.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max = coherence_values.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        
        1.0 - (max - min)
    }

    fn calculate_coherence_growth(&self) -> f64 {
        if self.resonance_history.len() < 2 {
            return 0.0;
        }

        let recent_snapshots: Vec<_> = self.resonance_history.iter().rev().take(5).collect();
        let coherence_changes: Vec<f64> = recent_snapshots.windows(2)
            .map(|w| w[0].coherence - w[1].coherence)
            .collect();
            
        let growth_rate = coherence_changes.iter().sum::<f64>() / coherence_changes.len() as f64;
        (growth_rate + 1.0) / 2.0
    }

    pub fn create_evolution_checkpoint(&mut self) {
        let mut requirements = std::collections::HashMap::new();
        requirements.insert("temporal_stability".to_string(), self.calculate_temporal_stability());
        requirements.insert("coherence_quality".to_string(), self.calculate_temporal_coherence());
        requirements.insert("frequency_stability".to_string(), self.calculate_frequency_variance());

        let checkpoint = StabilityCheckpoint {
            phase: self.evolution_phase,
            threshold: EVOLUTION_COHERENCE_THRESHOLD,
            quantum_signature: format!("QS-{}-{}", self.evolution_phase, std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs()),
            requirements,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            coherence: self.quantum_state.coherence,
            stability: self.quantum_state.stability,
            pattern_coherence: self.pattern_coherence,
            dimensional_frequency: self.quantum_state.dimensional_frequency,
        };
        
        self.checkpoints.push(checkpoint);
    }

    pub fn process_quantum_state(&mut self, snapshot: StateSnapshot) -> Result<(), &'static str> {
        if snapshot.coherence < COHERENCE_THRESHOLD {
            return Err("Coherence below threshold");
        }

        self.quantum_state.update_from_snapshot(&snapshot);
        self.pattern_coherence = self.calculate_pattern_coherence(&snapshot);
        
        self.resonance_history.push_back(snapshot);
        if self.resonance_history.len() > MAX_HISTORY_SIZE {
            self.resonance_history.pop_front();
        }

        self.try_evolution_step();
        Ok(())
    }

    pub fn try_evolution_step(&mut self) -> bool {
        let temporal_stability = self.calculate_temporal_stability();
        let coherence_quality = self.calculate_temporal_coherence();
        let frequency_stability = self.calculate_frequency_variance();
        
        let evolution_readiness = temporal_stability * coherence_quality * frequency_stability;
        
        if evolution_readiness >= EVOLUTION_COHERENCE_THRESHOLD {
            self.evolution_phase += 1;
            self.create_evolution_checkpoint();
            true
        } else {
            false
        }
    }

    fn calculate_pattern_coherence(&self, snapshot: &StateSnapshot) -> f64 {
        let temporal_coherence = self.calculate_temporal_coherence();
        let stability_trend = self.analyze_stability_trend();
        let coherence_growth = self.calculate_coherence_growth();
        
        let base_coherence = snapshot.coherence * temporal_coherence;
        let trend_factor = (stability_trend + coherence_growth) / 2.0;
        let pattern_strength = base_coherence * trend_factor;
        
        if pattern_strength < MIN_RESONANCE_STRENGTH {
            pattern_strength * 0.8
        } else {
            pattern_strength
        }
    }

    pub fn validate_quantum_state(&self) -> bool {
        let stability = self.calculate_temporal_stability();
        let coherence = self.calculate_temporal_coherence();
        let pattern_strength = self.pattern_coherence;
        
        stability >= PATTERN_STABILITY_REQUIREMENT &&
        coherence >= COHERENCE_THRESHOLD &&
        pattern_strength >= MIN_RESONANCE_STRENGTH
    }

    pub fn analyze_evolution_progress(&self) -> (f64, f64, f64) {
        let temporal_stability = self.calculate_temporal_stability();
        let coherence_quality = self.calculate_temporal_coherence();
        let pattern_stability = self.pattern_coherence;
        
        (temporal_stability, coherence_quality, pattern_stability)
    }

    pub fn get_evolution_phase(&self) -> u64 {
        self.evolution_phase
    }

    pub fn get_quantum_metrics(&self) -> (f64, f64, f64) {
        (
            self.quantum_state.coherence,
            self.quantum_state.stability,
            self.pattern_coherence
        )
    }

    pub fn get_checkpoint_history(&self) -> &[StabilityCheckpoint] {
        &self.checkpoints
    }

    pub fn get_resonance_history(&self) -> &VecDeque<StateSnapshot> {
        &self.resonance_history
    }
}