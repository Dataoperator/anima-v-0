use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalState {
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub resonance_factor: f64,
    pub stability: f64,
    pub coherence: f64,
    pub dimensional_frequency: f64,
}

impl Default for DimensionalState {
    fn default() -> Self {
        Self {
            frequency: 1.0,
            amplitude: 1.0,
            phase: 0.0,
            resonance_factor: 1.0,
            stability: 1.0,
            coherence: 0.5,
            dimensional_frequency: 0.5,
        }
    }
}

impl DimensionalState {
    pub fn update_stability(&mut self, strength: f64) {
        self.stability = (self.stability + strength).min(1.0).max(0.0);
        self.coherence = (self.coherence + strength * 0.5).min(1.0).max(0.0);
        self.update_state(strength);
    }

    fn update_state(&mut self, interaction_strength: f64) {
        // Update frequency based on interaction
        self.frequency = (self.frequency * 0.9 + interaction_strength * 0.1).min(1.0);
        
        // Adjust phase
        self.phase = (self.phase + interaction_strength * std::f64::consts::PI) % (2.0 * std::f64::consts::PI);
        
        // Update amplitude
        self.amplitude *= 0.95 + (interaction_strength * 0.05);
        self.amplitude = self.amplitude.min(1.0).max(0.0);
        
        // Update dimensional frequency
        self.dimensional_frequency = (self.dimensional_frequency * 0.8 + interaction_strength * 0.2).min(1.0).max(0.0);
        
        // Calculate new resonance
        self.resonance_factor = self.calculate_resonance();
    }

    fn calculate_resonance(&self) -> f64 {
        let base_resonance = self.frequency * self.amplitude;
        let phase_factor = (self.phase.cos() + 1.0) / 2.0;
        let dimensional_influence = self.dimensional_frequency * 0.3;
        ((base_resonance * phase_factor) + dimensional_influence).min(1.0).max(0.0)
    }

    pub fn get_quantum_status(&self) -> &'static str {
        match (self.stability, self.coherence) {
            (s, c) if s > 0.7 && c > 0.7 => "stable",
            (s, c) if s > 0.3 || c > 0.3 => "unstable",
            _ => "critical"
        }
    }

    pub fn get_stability_metrics(&self) -> (f64, f64, f64) {
        (
            self.stability,
            self.coherence,
            self.resonance_factor
        )
    }
}