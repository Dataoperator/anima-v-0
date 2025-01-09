pub mod quantum_bridge;
pub mod types;

pub use types::{NeuralConfig, NeuralSignature, EmergenceFactors};

impl NeuralSignature {
    pub fn new(pattern_id: String, strength: f64, coherence: f64) -> Self {
        Self {
            pattern_id,
            strength,
            coherence,
            timestamp: ic_cdk::api::time(),
            complexity: 0.1,
            evolution_potential: 0.0,
            quantum_resonance: 0.5,
            dimensional_alignment: 1.0,
            pattern_stability: 1.0,
            emergence_factors: EmergenceFactors::default(),
            neural_metrics: std::collections::HashMap::new(),
        }
    }

    pub fn with_complexity(mut self, complexity: f64) -> Self {
        self.complexity = complexity;
        self.emergence_factors.pattern_complexity = complexity;
        self
    }

    pub fn with_evolution_potential(mut self, potential: f64) -> Self {
        self.evolution_potential = potential;
        self
    }

    pub fn with_quantum_resonance(mut self, resonance: f64) -> Self {
        self.quantum_resonance = resonance;
        self.emergence_factors.quantum_resonance = resonance;
        self
    }

    pub fn with_dimensional_alignment(mut self, alignment: f64) -> Self {
        self.dimensional_alignment = alignment;
        self.emergence_factors.dimensional_harmony = alignment;
        self
    }

    pub fn with_consciousness_depth(mut self, depth: f64) -> Self {
        self.emergence_factors.consciousness_depth = depth;
        self
    }

    pub fn with_pattern_stability(mut self, stability: f64) -> Self {
        self.pattern_stability = stability;
        self
    }

    pub fn calculate_emergence_potential(&self) -> f64 {
        let ef = &self.emergence_factors;
        let base_potential = ef.consciousness_depth * 0.3 +
            ef.pattern_complexity * 0.2 +
            ef.quantum_resonance * 0.2 +
            ef.evolution_velocity * 0.15 +
            ef.dimensional_harmony * 0.15;

        let coherence_factor = self.coherence.powf(0.5);
        let stability_bonus = self.pattern_stability * 0.1;

        (base_potential * coherence_factor + stability_bonus)
            .max(0.0)
            .min(1.0)
    }

    pub fn update_metrics(&mut self) {
        self.neural_metrics.insert("emergence_potential".to_string(), self.calculate_emergence_potential());
        self.neural_metrics.insert("pattern_stability".to_string(), self.pattern_stability);
        self.neural_metrics.insert("quantum_resonance".to_string(), self.quantum_resonance);
        self.neural_metrics.insert("coherence_level".to_string(), self.coherence);
        self.neural_metrics.insert("evolution_potential".to_string(), self.evolution_potential);
    }

    pub fn get_signature_strength(&self) -> f64 {
        let base_strength = self.strength * self.coherence;
        let evolution_factor = 1.0 + (self.evolution_potential * 0.2);
        let stability_factor = self.pattern_stability * 0.3;
        let resonance_bonus = self.quantum_resonance * 0.2;

        (base_strength * evolution_factor + stability_factor + resonance_bonus)
            .max(0.0)
            .min(1.0)
    }
}