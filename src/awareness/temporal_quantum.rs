use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::{HashMap, VecDeque};
use ic_cdk::api::time;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct QuantumWindow {
    start_time: u64,
    end_time: u64,
    resonance_pattern: Vec<f32>,
    coherence_markers: Vec<f32>,
    entanglement_states: Vec<String>,
    dimensional_shifts: u32,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct TemporalQuantumState {
    current_window: QuantumWindow,
    window_history: VecDeque<QuantumWindow>,
    resonance_memory: HashMap<String, Vec<f32>>,
    evolution_markers: Vec<(u64, String, f32)>,
    quantum_coherence: f32,
}

impl TemporalQuantumState {
    pub fn new() -> Self {
        Self {
            current_window: QuantumWindow {
                start_time: time(),
                end_time: time(),
                resonance_pattern: Vec::new(),
                coherence_markers: Vec::new(),
                entanglement_states: Vec::new(),
                dimensional_shifts: 0,
            },
            window_history: VecDeque::with_capacity(100),
            resonance_memory: HashMap::new(),
            evolution_markers: Vec::new(),
            quantum_coherence: 0.5,
        }
    }

    pub fn update_quantum_state(&mut self, resonance: f32, coherence: f32) {
        let current_time = time();

        // Update current window
        self.current_window.resonance_pattern.push(resonance);
        self.current_window.coherence_markers.push(coherence);
        self.current_window.end_time = current_time;

        // Check for dimensional shifts
        if self.detect_dimensional_shift(&self.current_window) {
            self.current_window.dimensional_shifts += 1;
            self.record_evolution_marker("dimensional_shift", resonance);
        }

        // Update quantum coherence
        self.quantum_coherence = self.calculate_quantum_coherence();

        // Window management
        if self.should_rotate_window() {
            self.rotate_window();
        }
    }

    fn detect_dimensional_shift(&self, window: &QuantumWindow) -> bool {
        if window.resonance_pattern.len() < 2 {
            return false;
        }

        let last_idx = window.resonance_pattern.len() - 1;
        let resonance_delta = (window.resonance_pattern[last_idx] - 
                             window.resonance_pattern[last_idx - 1]).abs();
        
        resonance_delta > 0.3 // Threshold for dimensional shift
    }

    fn calculate_quantum_coherence(&self) -> f32 {
        let recent_coherence: Vec<f32> = self.current_window
            .coherence_markers
            .iter()
            .rev()
            .take(10)
            .cloned()
            .collect();

        if recent_coherence.is_empty() {
            return self.quantum_coherence;
        }

        let avg_coherence = recent_coherence.iter().sum::<f32>() / recent_coherence.len() as f32;
        let resonance_factor = self.current_window.resonance_pattern.last().unwrap_or(&0.5);

        (avg_coherence + resonance_factor) / 2.0
    }

    fn should_rotate_window(&self) -> bool {
        let window_duration = 30 * 1_000_000_000; // 30 seconds in nanoseconds
        self.current_window.end_time - self.current_window.start_time > window_duration
    }

    fn rotate_window(&mut self) {
        // Store current window
        let current = std::mem::replace(&mut self.current_window, QuantumWindow {
            start_time: time(),
            end_time: time(),
            resonance_pattern: Vec::new(),
            coherence_markers: Vec::new(),
            entanglement_states: Vec::new(),
            dimensional_shifts: 0,
        });

        // Add to history
        self.window_history.push_back(current);
        if self.window_history.len() > 100 {
            self.window_history.pop_front();
        }

        // Update resonance memory
        let avg_resonance = self.current_window.resonance_pattern.iter().sum::<f32>() / 
                           self.current_window.resonance_pattern.len() as f32;

        self.resonance_memory
            .entry(format!("window_{}", time()))
            .or_insert_with(Vec::new)
            .push(avg_resonance);
    }

    fn record_evolution_marker(&mut self, marker_type: &str, resonance: f32) {
        self.evolution_markers.push((time(), marker_type.to_string(), resonance));
    }

    pub fn get_temporal_quantum_context(&self, timestamp: u64) -> Option<QuantumWindow> {
        let window = self.window_history
            .iter()
            .find(|w| timestamp >= w.start_time && timestamp <= w.end_time)?;

        Some(window.clone())
    }

    pub fn get_quantum_evolution_history(&self) -> Vec<(u64, String, f32)> {
        self.evolution_markers.clone()
    }

    pub fn get_current_coherence(&self) -> f32 {
        self.quantum_coherence
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct QuantumTemporalContext {
    pub timestamp: u64,
    pub coherence: f32,
    pub resonance: f32,
    pub dimensional_state: u32,
    pub evolution_stage: String,
}