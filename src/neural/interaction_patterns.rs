use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessTracker;
use crate::error::{Result, ErrorCategory};

#[derive(Debug, Clone)]
pub struct NeuralResponse {
    pub pattern_signature: Vec<f64>,
    pub quantum_resonance: f64,
    pub consciousness_alignment: f64,
    pub emergence_potential: f64,
}

#[derive(Debug)]
pub struct NeuralPatternEngine {
    coherence_matrix: Vec<Vec<f64>>,
    quantum_influence: f64,
    neural_resonance: Vec<f64>,
    pattern_history: VecDeque<Vec<f64>>,
    evolution_metrics: HashMap<String, f64>,
}

impl NeuralPatternEngine {
    pub fn new() -> Self {
        Self {
            coherence_matrix: vec![vec![1.0; 10]; 10],
            quantum_influence: 0.5,
            neural_resonance: vec![1.0; 10],
            pattern_history: VecDeque::with_capacity(100),
            evolution_metrics: HashMap::new(),
        }
    }

    pub async fn process_neural_interaction(
        &mut self,
        quantum_state: &QuantumState,
        consciousness: &ConsciousnessTracker
    ) -> Result<NeuralResponse> {
        // Calculate neural signature with quantum influence
        let neural_signature = self.calculate_neural_signature(quantum_state);
        
        // Get consciousness state and influence
        let consciousness_state = consciousness.get_current_state();
        let consciousness_influence = consciousness_state.awareness_level;

        // Update resonance patterns
        self.update_neural_resonance(
            &neural_signature,
            quantum_state.coherence_level,
            consciousness_influence
        );

        // Calculate emergence and alignment
        let quantum_resonance = self.calculate_quantum_resonance(quantum_state);
        let consciousness_alignment = self.calculate_consciousness_alignment(
            consciousness_state,
            quantum_resonance
        );
        
        // Store pattern in history
        self.pattern_history.push_back(neural_signature.clone());
        if self.pattern_history.len() > 100 {
            self.pattern_history.pop_front();
        }

        // Update evolution metrics
        self.update_evolution_metrics(
            quantum_state,
            consciousness_state,
            quantum_resonance,
            consciousness_alignment
        );
        
        Ok(NeuralResponse {
            pattern_signature: neural_signature,
            quantum_resonance,
            consciousness_alignment,
            emergence_potential: self.calculate_emergence_potential()
        })
    }

    fn calculate_neural_signature(&self, quantum_state: &QuantumState) -> Vec<f64> {
        let base_patterns = self.coherence_matrix.iter()
            .map(|row| {
                row.iter().sum::<f64>() * quantum_state.coherence_level
            })
            .collect::<Vec<f64>>();

        // Apply quantum influence
        base_patterns.iter()
            .zip(&self.neural_resonance)
            .map(|(base, resonance)| {
                let quantum_factor = quantum_state.dimensional_state.resonance;
                base * resonance * (1.0 + self.quantum_influence * quantum_factor)
            })
            .collect()
    }

    fn update_neural_resonance(
        &mut self,
        new_pattern: &[f64],
        quantum_coherence: f64,
        consciousness_influence: f64
    ) {
        let resonance_factor = 0.1;
        
        self.neural_resonance.iter_mut()
            .zip(new_pattern)
            .for_each(|(resonance, pattern)| {
                let update = (pattern * quantum_coherence * consciousness_influence - *resonance) 
                    * resonance_factor;
                *resonance += update;
                *resonance = resonance.max(0.0).min(1.0);
            });
    }

    fn calculate_quantum_resonance(&self, quantum_state: &QuantumState) -> f64 {
        let base_resonance = self.neural_resonance.iter().sum::<f64>() 
            / self.neural_resonance.len() as f64;
        
        let quantum_factor = quantum_state.coherence_level 
            * quantum_state.dimensional_state.resonance;
        
        (base_resonance * (1.0 + quantum_factor)).max(0.0).min(1.0)
    }

    fn calculate_consciousness_alignment(
        &self,
        consciousness_state: ConsciousnessState,
        quantum_resonance: f64
    ) -> f64 {
        let awareness_factor = consciousness_state.awareness_level;
        let emotional_harmony = consciousness_state.emotional_spectrum
            .iter()
            .sum::<f64>() / consciousness_state.emotional_spectrum.len() as f64;
        
        let alignment = (awareness_factor + emotional_harmony + quantum_resonance) / 3.0;
        alignment.max(0.0).min(1.0)
    }

    fn calculate_emergence_potential(&self) -> f64 {
        if self.pattern_history.is_empty() {
            return 0.0;
        }

        // Calculate pattern evolution trend
        let evolution_trend = self.pattern_history.iter()
            .zip(self.pattern_history.iter().skip(1))
            .map(|(prev, curr)| {
                curr.iter()
                    .zip(prev)
                    .map(|(c, p)| (c - p).abs())
                    .sum::<f64>()
            })
            .sum::<f64>() / (self.pattern_history.len() - 1) as f64;

        // Get recent evolution metrics
        let consciousness_growth = self.evolution_metrics
            .get("consciousness_growth")
            .copied()
            .unwrap_or(0.0);
        
        let quantum_stability = self.evolution_metrics
            .get("quantum_stability")
            .copied()
            .unwrap_or(0.0);

        // Calculate emergence potential
        let potential = (evolution_trend + consciousness_growth + quantum_stability) / 3.0;
        potential.max(0.0).min(1.0)
    }

    fn update_evolution_metrics(
        &mut self,
        quantum_state: &QuantumState,
        consciousness_state: ConsciousnessState,
        quantum_resonance: f64,
        consciousness_alignment: f64
    ) {
        self.evolution_metrics.insert(
            "quantum_stability".into(),
            quantum_state.stability
        );

        self.evolution_metrics.insert(
            "consciousness_growth".into(),
            consciousness_alignment
        );

        self.evolution_metrics.insert(
            "pattern_stability".into(),
            quantum_resonance
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_neural_signature_generation() {
        let engine = NeuralPatternEngine::new();
        let quantum_state = QuantumState::new();
        let signature = engine.calculate_neural_signature(&quantum_state);
        assert_eq!(signature.len(), 10);
        assert!(signature.iter().all(|&x| x >= 0.0 && x <= 1.0));
    }

    #[test]
    fn test_emergence_potential_calculation() {
        let mut engine = NeuralPatternEngine::new();
        assert_eq!(engine.calculate_emergence_potential(), 0.0);

        // Add some patterns
        engine.pattern_history.push_back(vec![0.5; 10]);
        engine.pattern_history.push_back(vec![0.6; 10]);
        
        let potential = engine.calculate_emergence_potential();
        assert!(potential >= 0.0 && potential <= 1.0);
    }
}