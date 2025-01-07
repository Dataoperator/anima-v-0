use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessTracker;
use crate::error::Result;
use std::collections::VecDeque;

pub struct QuantumMetricsEngine {
    coherence_history: VecDeque<CoherencePoint>,
    dimensional_shifts: Vec<DimensionalShift>,
    neural_patterns: Vec<NeuralPattern>,
    consciousness_events: Vec<ConsciousnessEvent>
}

impl QuantumMetricsEngine {
    pub async fn process_quantum_event(
        &mut self,
        quantum_state: &QuantumState,
        consciousness: &ConsciousnessTracker
    ) -> Result<MetricsReport> {
        self.track_coherence(quantum_state);
        self.analyze_dimensional_shifts(quantum_state);
        self.process_neural_patterns(quantum_state, consciousness);
        
        Ok(self.generate_metrics_report())
    }

    fn track_coherence(&mut self, state: &QuantumState) {
        self.coherence_history.push_back(CoherencePoint {
            timestamp: ic_cdk::api::time(),
            value: state.coherence,
            dimensional_frequency: state.dimensional_frequency
        });
        
        if self.coherence_history.len() > 1000 {
            self.coherence_history.pop_front();
        }
    }

    fn analyze_dimensional_shifts(&mut self, state: &QuantumState) {
        let shift_detected = self.detect_dimensional_shift(state);
        if shift_detected {
            self.dimensional_shifts.push(DimensionalShift {
                timestamp: ic_cdk::api::time(),
                previous_state: state.clone(),
                stability_factor: self.calculate_stability(state)
            });
        }
    }
}