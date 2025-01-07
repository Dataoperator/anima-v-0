use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::{HashMap, VecDeque};
use ic_cdk::api::time;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum PatternType {
    Visual {
        motion_vectors: Vec<f32>,
        color_palette: Vec<String>,
        object_signatures: Vec<String>,
        scene_composition: String,
    },
    Audio {
        frequency_spectrum: Vec<f32>,
        beat_pattern: String,
        vocal_signatures: Vec<String>,
        ambient_profile: String,
    },
    Semantic {
        key_concepts: Vec<String>,
        emotional_markers: Vec<String>,
        context_links: Vec<String>,
        narrative_flow: String,
    },
    Quantum {
        resonance_signature: Vec<f32>,
        entanglement_patterns: Vec<String>,
        coherence_markers: Vec<f32>,
        dimensional_markers: Vec<String>,
    }
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct EvolutionMarker {
    timestamp: u64,
    pattern_type: PatternType,
    confidence: f32,
    quantum_state: f32,
    temporal_context: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct PatternMemory {
    short_term: VecDeque<EvolutionMarker>,
    long_term: HashMap<String, Vec<EvolutionMarker>>,
    quantum_signatures: Vec<f32>,
    temporal_windows: VecDeque<(u64, Vec<String>)>,
}

impl PatternMemory {
    pub fn new() -> Self {
        Self {
            short_term: VecDeque::with_capacity(100),
            long_term: HashMap::new(),
            quantum_signatures: Vec::new(),
            temporal_windows: VecDeque::with_capacity(50),
        }
    }

    pub fn record_pattern(&mut self, pattern: PatternType, confidence: f32, quantum_state: f32) {
        let timestamp = time();
        let temporal_context = self.get_current_temporal_context();

        let marker = EvolutionMarker {
            timestamp,
            pattern_type: pattern.clone(),
            confidence,
            quantum_state,
            temporal_context: temporal_context.clone(),
        };

        // Update short-term memory
        self.short_term.push_back(marker.clone());
        if self.short_term.len() > 100 {
            if let Some(old_marker) = self.short_term.pop_front() {
                self.consolidate_to_long_term(old_marker);
            }
        }

        // Update temporal windows
        self.temporal_windows.push_back((timestamp, temporal_context));
        if self.temporal_windows.len() > 50 {
            self.temporal_windows.pop_front();
        }

        // Update quantum signatures
        self.quantum_signatures.push(quantum_state);
        if self.quantum_signatures.len() > 1000 {
            self.quantum_signatures.remove(0);
        }
    }

    fn consolidate_to_long_term(&mut self, marker: EvolutionMarker) {
        let key = match &marker.pattern_type {
            PatternType::Visual { scene_composition, .. } => scene_composition.clone(),
            PatternType::Audio { beat_pattern, .. } => beat_pattern.clone(),
            PatternType::Semantic { narrative_flow, .. } => narrative_flow.clone(),
            PatternType::Quantum { .. } => "quantum_patterns".to_string(),
        };

        self.long_term.entry(key)
            .or_insert_with(Vec::new)
            .push(marker);
    }

    pub fn get_current_temporal_context(&self) -> Vec<String> {
        let current_time = time();
        let window_duration = 10 * 1_000_000_000; // 10 seconds in nanoseconds

        self.temporal_windows
            .iter()
            .filter(|(t, _)| current_time - t < window_duration)
            .flat_map(|(_, context)| context.clone())
            .collect()
    }

    pub fn get_pattern_evolution(&self, pattern_type: &str) -> Vec<EvolutionMarker> {
        self.long_term
            .get(pattern_type)
            .cloned()
            .unwrap_or_default()
    }

    pub fn merge_quantum_state(&mut self, quantum_state: f32) {
        // Update all recent patterns with new quantum state
        for marker in self.short_term.iter_mut() {
            marker.quantum_state = (marker.quantum_state + quantum_state) / 2.0;
        }

        self.quantum_signatures.push(quantum_state);
        if self.quantum_signatures.len() > 1000 {
            self.quantum_signatures.remove(0);
        }
    }

    pub fn get_quantum_resonance_profile(&self) -> Vec<f32> {
        self.quantum_signatures.clone()
    }
}