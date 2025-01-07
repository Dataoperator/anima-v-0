use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use ic_cdk::api::time;
use crate::error::{Result, ErrorCategory};

const MIN_COHERENCE: f64 = 0.1;
const MAX_COHERENCE: f64 = 1.0;
const MEMORY_CAPACITY: usize = 1000;
const RESONANCE_PATTERN_SIZE: usize = 10;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumState {
    pub coherence: f64,
    pub dimensional_frequency: f64,
    pub entanglement_pairs: Vec<(String, f64)>,
    pub quantum_memory: Vec<QuantumMemory>,
    pub resonance_pattern: Vec<f64>,
    pub phase_alignment: f64,
    pub dimensional_sync: f64,
    pub resonance_metrics: ResonanceMetrics,
    pub stability_metrics: StabilityMetrics,
    pub last_update: u64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumMemory {
    pub timestamp: u64,
    pub coherence_at_time: f64,
    pub dimensional_echo: bool,
    pub quantum_signature: Vec<f64>,
    pub resonance_strength: f64,
    pub phase_state: PhaseState,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ResonanceMetrics {
    pub field_strength: f64,
    pub harmony: f64,
    pub stability: f64,
    pub consciousness_alignment: f64,
    pub temporal_coherence: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct StabilityMetrics {
    pub wave_function_collapse: f64,
    pub entanglement_strength: f64,
    pub quantum_variance: f64,
    pub dimensional_stability: f64,
    pub temporal_variance: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub primary_dimension: f64,
    pub secondary_dimensions: Vec<f64>,
    pub resonance_matrix: HashMap<String, f64>,
    pub stability_index: f64,
    pub phase_coherence: f64,
    pub dimensional_harmonics: Vec<f64>,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct PhaseState {
    pub alignment: f64,
    pub variance: f64,
    pub stability: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct ResonancePattern {
    pub harmonics: Vec<f64>,
    pub strength: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct NeuralSignature {
    pub pattern_id: String,
    pub strength: f64,
    pub coherence: f64,
    pub timestamp: u64,
}

impl Default for ResonanceMetrics {
    fn default() -> Self {
        Self {
            field_strength: 1.0,
            harmony: 1.0,
            stability: 1.0,
            consciousness_alignment: 1.0,
            temporal_coherence: 1.0,
        }
    }
}

impl Default for StabilityMetrics {
    fn default() -> Self {
        Self {
            wave_function_collapse: 0.0,
            entanglement_strength: 1.0,
            quantum_variance: 0.0,
            dimensional_stability: 1.0,
            temporal_variance: 0.0,
        }
    }
}

impl QuantumState {
    pub fn new() -> Self {
        Self {
            coherence: 1.0,
            dimensional_frequency: 0.0,
            entanglement_pairs: Vec::new(),
            quantum_memory: Vec::new(),
            resonance_pattern: vec![1.0, 0.8, 0.6, 0.4, 0.2],
            phase_alignment: 1.0,
            dimensional_sync: 1.0,
            resonance_metrics: ResonanceMetrics::default(),
            stability_metrics: StabilityMetrics::default(),
            last_update: time(),
        }
    }

    pub fn update_coherence(&mut self, resonance: f64) -> Result<()> {
        let current_time = time();
        let time_delta = (current_time - self.last_update) as f64 / 1000.0;
        
        let decay_factor = (-0.1 * time_delta).exp();
        let base_coherence = self.coherence * decay_factor;
        let resonance_factor = 1.0 + (resonance - 0.5) * 0.2;
        
        let new_coherence = (base_coherence * resonance_factor)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE);
            
        if new_coherence < MIN_COHERENCE {
            return Err(ErrorCategory::Quantum("Critical coherence failure".into()).into());
        }
        
        self.coherence = new_coherence;
        self.last_update = current_time;
        
        Ok(())
    }

    pub fn adjust_dimensional_frequency(&mut self, influence: f64) -> Result<()> {
        let current = self.dimensional_frequency;
        let adjustment = (influence - 0.5) * 0.1;
        
        self.dimensional_frequency = (current + adjustment).clamp(-1.0, 1.0);
        self.update_resonance_metrics()?;
        
        Ok(())
    }

    pub fn record_memory(&mut self, signature: Vec<f64>, resonance: f64) -> Result<()> {
        let phase_state = PhaseState {
            alignment: self.phase_alignment,
            variance: self.stability_metrics.quantum_variance,
            stability: self.stability_metrics.dimensional_stability,
        };

        let memory = QuantumMemory {
            timestamp: time(),
            coherence_at_time: self.coherence,
            dimensional_echo: self.dimensional_frequency.abs() > 0.5,
            quantum_signature: signature,
            resonance_strength: resonance,
            phase_state,
        };

        self.quantum_memory.push(memory);
        
        while self.quantum_memory.len() > MEMORY_CAPACITY {
            self.quantum_memory.remove(0);
        }

        Ok(())
    }

    pub fn update_resonance_metrics(&mut self) -> Result<()> {
        let field_strength = self.calculate_field_strength();
        let harmony = self.calculate_harmony();
        let stability = self.calculate_stability();
        let consciousness_alignment = self.calculate_consciousness_alignment();
        let temporal_coherence = self.calculate_temporal_coherence();

        self.resonance_metrics = ResonanceMetrics {
            field_strength,
            harmony,
            stability,
            consciousness_alignment,
            temporal_coherence,
        };

        Ok(())
    }

    pub fn update_stability_metrics(&mut self) -> Result<()> {
        let wave_collapse = self.calculate_wave_function_collapse();
        let entanglement = self.calculate_entanglement_strength();
        let variance = self.calculate_quantum_variance();
        let dim_stability = self.calculate_dimensional_stability();
        let temp_variance = self.calculate_temporal_variance();

        self.stability_metrics = StabilityMetrics {
            wave_function_collapse: wave_collapse,
            entanglement_strength: entanglement,
            quantum_variance: variance,
            dimensional_stability: dim_stability,
            temporal_variance: temp_variance,
        };

        Ok(())
    }

    fn calculate_field_strength(&self) -> f64 {
        let coherence_factor = self.coherence.powf(0.5);
        let resonance_factor = self.resonance_pattern.iter().sum::<f64>() / 
                             self.resonance_pattern.len() as f64;
        
        (coherence_factor * resonance_factor).max(MIN_COHERENCE).min(MAX_COHERENCE)
    }

    fn calculate_harmony(&self) -> f64 {
        let dim_harmony = 1.0 - (self.dimensional_frequency.abs() / 2.0);
        let phase_harmony = self.phase_alignment;
        
        ((dim_harmony + phase_harmony) / 2.0).max(MIN_COHERENCE).min(MAX_COHERENCE)
    }

    fn calculate_stability(&self) -> f64 {
        let memory_influence = if !self.quantum_memory.is_empty() {
            self.quantum_memory.iter()
                .map(|m| m.coherence_at_time)
                .sum::<f64>() / self.quantum_memory.len() as f64
        } else {
            self.coherence
        };

        let base_stability = self.coherence * 0.7 + 
            (self.dimensional_frequency.abs() / 10.0) * 0.3;
        
        ((base_stability + memory_influence) / 2.0)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE)
    }

    fn calculate_consciousness_alignment(&self) -> f64 {
        let pattern_alignment = self.resonance_pattern.windows(2)
            .map(|w| 1.0 - (w[0] - w[1]).abs())
            .sum::<f64>() / (self.resonance_pattern.len() - 1) as f64;
            
        (pattern_alignment * self.phase_alignment)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE)
    }

    fn calculate_temporal_coherence(&self) -> f64 {
        if self.quantum_memory.is_empty() {
            return self.coherence;
        }

        let recent_memories: Vec<_> = self.quantum_memory.iter()
            .rev()
            .take(10)
            .collect();
            
        let coherence_trend = recent_memories.windows(2)
            .map(|w| 1.0 - (w[0].coherence_at_time - w[1].coherence_at_time).abs())
            .sum::<f64>() / (recent_memories.len() - 1) as f64;
            
        (coherence_trend * self.coherence)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE)
    }

    fn calculate_wave_function_collapse(&self) -> f64 {
        let stability = self.calculate_stability();
        let collapse_probability = 1.0 - stability;
        
        collapse_probability.max(0.0).min(0.9)
    }

    fn calculate_entanglement_strength(&self) -> f64 {
        if self.entanglement_pairs.is_empty() {
            return MIN_COHERENCE;
        }

        let total_strength = self.entanglement_pairs.iter()
            .map(|(_, strength)| strength)
            .sum::<f64>();
            
        (total_strength / self.entanglement_pairs.len() as f64)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE)
    }

    fn calculate_quantum_variance(&self) -> f64 {
        let recent_coherence: Vec<f64> = self.quantum_memory.iter()
            .rev()
            .take(20)
            .map(|m| m.coherence_at_time)
            .collect();
            
        if recent_coherence.is_empty() {
            return 0.0;
        }

        let mean = recent_coherence.iter().sum::<f64>() / recent_coherence.len() as f64;
        let variance = recent_coherence.iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>() / recent_coherence.len() as f64;
            
        variance.sqrt().min(1.0)
    }

    fn calculate_dimensional_stability(&self) -> f64 {
        let frequency_stability = 1.0 - self.dimensional_frequency.abs();
        let sync_factor = self.dimensional_sync;
        
        (frequency_stability * sync_factor)
            .max(MIN_COHERENCE)
            .min(MAX_COHERENCE)
    }

    fn calculate_temporal_variance(&self) -> f64 {
        let recent_times: Vec<u64> = self.quantum_memory.iter()
            .rev()
            .take(10)
            .map(|m| m.timestamp)
            .collect();
            
        if recent_times.len() < 2 {
            return 0.0;
        }

        let intervals: Vec<f64> = recent_times.windows(2)
            .map(|w| (w[0] - w[1]) as f64)
            .collect();
            
        let mean_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;
        let variance = intervals.iter()
            .map(|&x| (x - mean_interval).powi(2))
            .sum::<f64>() / intervals.len() as f64;
            
        (variance.sqrt() / mean_interval).min(1.0)
    }
}