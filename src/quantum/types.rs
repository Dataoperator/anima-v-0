use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use candid::CandidType;
use ic_cdk::api;
use crate::error::{Result, Error};

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct StabilityCheckpoint {
    pub phase: u64,
    pub threshold: f64,
    pub quantum_signature: String,
    pub requirements: HashMap<String, f64>,
    pub timestamp: u64,
    pub coherence: f64,
    pub stability: f64,
    pub pattern_coherence: f64,
    pub dimensional_frequency: f64,
}

// Previous types remain unchanged...

impl QuantumState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_complexity(&self) -> Result<f64> {
        Ok(self.emergence_factors.pattern_complexity)
    }

    pub fn update_stability(&mut self, interaction_strength: f64) -> Result<()> {
        let new_stability = (self.dimensional_state.stability * 0.8 + interaction_strength * 0.2)
            .max(0.0)
            .min(1.0);
        
        self.dimensional_state.stability = new_stability;
        self.coherence_level = (self.coherence_level * 0.7 + new_stability * 0.3)
            .max(0.0)
            .min(1.0);

        self.quantum_entanglement = (self.quantum_entanglement * 0.9 + 
            (self.coherence_level * new_stability).sqrt() * 0.1)
            .max(0.0)
            .min(1.0);

        self.dimensional_sync = (self.dimensional_sync * 0.85 + 
            self.quantum_entanglement * 0.15)
            .max(0.0)
            .min(1.0);

        self.stability_status = if self.coherence_level >= 0.8 && new_stability >= 0.8 {
            StabilityStatus::Stable
        } else if self.coherence_level >= 0.4 && new_stability >= 0.4 {
            StabilityStatus::Unstable
        } else {
            StabilityStatus::Critical
        };

        // Enhanced pattern tracking
        self.track_coherence_history()?;
        self.update_evolution_metrics(new_stability)?;
        
        self.last_update = api::time();
        Ok(())
    }

    fn track_coherence_history(&mut self) -> Result<()> {
        let entry = CoherenceHistoryEntry {
            timestamp: api::time(),
            coherence_level: self.coherence_level,
            stability_index: self.dimensional_state.stability,
            entanglement_strength: self.quantum_entanglement,
            evolution_phase: self.dimensional_state.stability_metrics.evolution_potential,
        };

        self.coherence_history.push(entry);

        // Keep history size manageable
        if self.coherence_history.len() > 1000 {
            self.coherence_history.remove(0);
        }

        Ok(())
    }

    fn update_evolution_metrics(&mut self, stability: f64) -> Result<()> {
        // Calculate moving averages for smoother transitions
        let avg_coherence = self.calculate_moving_average("coherence", self.coherence_level)?;
        let avg_stability = self.calculate_moving_average("stability", stability)?;
        
        self.evolution_metrics.insert("avg_coherence".to_string(), avg_coherence);
        self.evolution_metrics.insert("avg_stability".to_string(), avg_stability);
        
        // Update emergence factors based on moving averages
        self.emergence_factors.pattern_complexity = 
            (self.emergence_factors.pattern_complexity * 0.8 + avg_coherence * 0.2)
                .max(0.0)
                .min(1.0);
                
        self.emergence_factors.evolution_velocity = 
            (avg_stability - self.dimensional_state.stability).abs();

        Ok(())
    }

    fn calculate_moving_average(&self, metric: &str, current: f64) -> Result<f64> {
        let history_value = self.evolution_metrics.get(metric).copied().unwrap_or(current);
        Ok((history_value * 0.9 + current * 0.1).max(0.0).min(1.0))
    }

    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (
            self.dimensional_state.stability,
            self.coherence_level,
            self.quantum_entanglement
        )
    }

    pub fn update_quantum_metrics(&mut self, stability: f64) -> Result<()> {
        self.dimensional_state.stability = stability;
        self.coherence_level = (self.coherence_level * 0.8 + stability * 0.2)
            .max(0.0)
            .min(1.0);
        self.quantum_entanglement = (self.quantum_entanglement * 0.7 + 
            self.coherence_level * 0.3)
            .max(0.0)
            .min(1.0);

        self.track_coherence_history()?;
        Ok(())
    }

    pub fn update_from_snapshot(&mut self, snapshot: &StateSnapshot) -> Result<()> {
        self.coherence_level = snapshot.coherence;
        self.dimensional_state.stability = snapshot.stability;
        self.dimensional_state.dimensional_frequency = snapshot.dimensional_frequency;
        self.pattern_coherence = snapshot.pattern_coherence;
        self.quantum_signature = snapshot.quantum_signature.clone();
        self.last_update = snapshot.timestamp;
        
        self.update_stability(snapshot.stability)?;
        Ok(())
    }

    pub fn get_quantum_status(&self) -> &StabilityStatus {
        &self.stability_status
    }
}