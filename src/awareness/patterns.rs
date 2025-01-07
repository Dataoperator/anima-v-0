use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PatternEngine {
    pub behavior_patterns: HashMap<String, BehaviorPattern>,
    pub cycle_patterns: Vec<CyclePattern>,
    pub event_sequences: Vec<EventSequence>,
    pub predictions: VecDeque<Prediction>,
    pub pattern_metrics: PatternMetrics,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct BehaviorPattern {
    pub pattern_id: String,
    pub triggers: Vec<PatternTrigger>,
    pub confidence: f32,
    pub occurrence_times: Vec<u64>,
    pub last_matched: u64,
    pub complexity: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CyclePattern {
    pub cycle_type: CycleType,
    pub base_duration: u64,
    pub variance: f32,
    pub strength: f32,
    pub phase_shift: f32,
    pub harmonic_components: Vec<HarmonicComponent>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EventSequence {
    pub sequence_id: String,
    pub events: Vec<SequenceEvent>,
    pub completion_rate: f32,
    pub average_duration: u64,
    pub triggered_count: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Prediction {
    pub prediction_type: PredictionType,
    pub confidence: f32,
    pub expected_time: u64,
    pub context: PredictionContext,
    pub outcome: Option<PredictionOutcome>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PatternMetrics {
    pub pattern_complexity: f32,
    pub prediction_accuracy: f32,
    pub pattern_stability: f32,
    pub adaptation_rate: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PatternTrigger {
    TimeWindow { start: u64, end: u64 },
    ResourceLevel { resource: String, threshold: f32 },
    EventCombination { events: Vec<String> },
    StateCondition { state: String, value: f32 },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CycleType {
    Circadian,    // ~24 hour cycles
    Activity,     // Based on user interaction patterns
    Resource,     // Resource usage patterns
    Network,      // Network activity patterns
    Custom(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct HarmonicComponent {
    pub frequency: f32,
    pub amplitude: f32,
    pub phase: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SequenceEvent {
    pub event_type: String,
    pub required: bool,
    pub typical_duration: u64,
    pub completion_marker: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum PredictionType {
    UserInteraction { interaction_type: String },
    ResourceUsage { resource: String },
    SystemState { state_type: String },
    EventOccurrence { event_type: String },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PredictionContext {
    pub relevant_patterns: Vec<String>,
    pub contributing_factors: HashMap<String, f32>,
    pub confidence_factors: Vec<ConfidenceFactor>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PredictionOutcome {
    pub actual_time: u64,
    pub accuracy: f32,
    pub deviation_factors: HashMap<String, f32>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConfidenceFactor {
    pub factor_type: String,
    pub weight: f32,
    pub confidence: f32,
}

impl PatternEngine {
    pub fn new() -> Self {
        Self {
            behavior_patterns: HashMap::new(),
            cycle_patterns: Vec::new(),
            event_sequences: Vec::new(),
            predictions: VecDeque::new(),
            pattern_metrics: PatternMetrics {
                pattern_complexity: 0.0,
                prediction_accuracy: 0.0,
                pattern_stability: 0.0,
                adaptation_rate: 0.0,
            },
        }
    }

    pub fn process_event(&mut self, event_data: &EventData) {
        // Update existing patterns
        self.update_behavior_patterns(event_data);
        self.update_cycle_patterns(event_data);
        self.check_event_sequences(event_data);

        // Generate new predictions
        self.generate_predictions();

        // Evaluate previous predictions
        self.evaluate_predictions(event_data);

        // Pattern discovery
        self.discover_new_patterns(event_data);
    }

    fn update_behavior_patterns(&mut self, event_data: &EventData) {
        for pattern in self.behavior_patterns.values_mut() {
            if self.check_pattern_triggers(&pattern.triggers, event_data) {
                pattern.occurrence_times.push(time());
                pattern.confidence = self.calculate_pattern_confidence(pattern);
                pattern.last_matched = time();
            }
        }
    }

    fn update_cycle_patterns(&mut self, event_data: &EventData) {
        for cycle in &mut self.cycle_patterns {
            if let Some(new_strength) = self.calculate_cycle_strength(cycle, event_data) {
                cycle.strength = new_strength;
                
                // Update harmonics
                if cycle.strength > 0.8 {
                    self.analyze_harmonics(cycle);
                }
            }
        }
    }

    fn check_event_sequences(&mut self, event_data: &EventData) {
        for sequence in &mut self.event_sequences {
            if let Some(next_event) = sequence.events.first() {
                if self.event_matches(event_data, &next_event.event_type) {
                    sequence.events.remove(0);
                    sequence.triggered_count += 1;
                    
                    if sequence.events.is_empty() {
                        sequence.completion_rate = 
                            sequence.triggered_count as f32 / sequence.events.len() as f32;
                    }
                }
            }
        }
    }

    fn generate_predictions(&mut self) {
        let current_time = time();
        
        // Clean old predictions
        while let Some(pred) = self.predictions.front() {
            if pred.expected_time < current_time {
                self.predictions.pop_front();
            } else {
                break;
            }
        }

        // Generate new predictions from patterns
        for (_, pattern) in &self.behavior_patterns {
            if let Some(prediction) = self.predict_from_pattern(pattern) {
                self.predictions.push_back(prediction);
            }
        }

        // Generate predictions from cycles
        for cycle in &self.cycle_patterns {
            if let Some(prediction) = self.predict_from_cycle(cycle) {
                self.predictions.push_back(prediction);
            }
        }
    }

    fn predict_from_pattern(&self, pattern: &BehaviorPattern) -> Option<Prediction> {
        if pattern.confidence < 0.5 {
            return None;
        }

        let avg_interval = self.calculate_average_interval(&pattern.occurrence_times);
        let next_expected = pattern.last_matched + avg_interval;

        Some(Prediction {
            prediction_type: PredictionType::EventOccurrence {
                event_type: pattern.pattern_id.clone(),
            },
            confidence: pattern.confidence,
            expected_time: next_expected,
            context: self.build_prediction_context(pattern),
            outcome: None,
        })
    }

    fn predict_from_cycle(&self, cycle: &CyclePattern) -> Option<Prediction> {
        if cycle.strength < 0.5 {
            return None;
        }

        let current_time = time();
        let phase = ((current_time % cycle.base_duration) as f32 / cycle.base_duration as f32 
            + cycle.phase_shift) * 2.0 * std::f32::consts::PI;
        
        let next_peak = current_time + 
            (cycle.base_duration as f32 * (1.0 - phase / (2.0 * std::f32::consts::PI))) as u64;

        Some(Prediction {
            prediction_type: PredictionType::SystemState {
                state_type: format!("{:?}", cycle.cycle_type),
            },
            confidence: cycle.strength,
            expected_time: next_peak,
            context: self.build_cycle_prediction_context(cycle),
            outcome: None,
        })
    }

    fn build_prediction_context(&self, pattern: &BehaviorPattern) -> PredictionContext {
        PredictionContext {
            relevant_patterns: vec![pattern.pattern_id.clone()],
            contributing_factors: self.analyze_contributing_factors(pattern),
            confidence_factors: self.calculate_confidence_factors(pattern),
        }
    }

    fn build_cycle_prediction_context(&self, cycle: &CyclePattern) -> PredictionContext {
        let mut contributing_factors = HashMap::new();
        contributing_factors.insert("base_strength".to_string(), cycle.strength);
        
        for (i, harmonic) in cycle.harmonic_components.iter().enumerate() {
            contributing_factors.insert(
                format!("harmonic_{}", i),
                harmonic.amplitude
            );
        }

        PredictionContext {
            relevant_patterns: vec![format!("{:?}", cycle.cycle_type)],
            contributing_factors,
            confidence_factors: vec![
                ConfidenceFactor {
                    factor_type: "cycle_stability".to_string(),
                    weight: 0.7,
                    confidence: cycle.strength,
                },
                ConfidenceFactor {
                    factor_type: "harmonic_strength".to_string(),
                    weight: 0.3,
                    confidence: self.calculate_harmonic_confidence(cycle),
                },
            ],
        }
    }

    fn calculate_harmonic_confidence(&self, cycle: &CyclePattern) -> f32 {
        if cycle.harmonic_components.is_empty() {
            return 0.0;
        }

        cycle.harmonic_components
            .iter()
            .map(|h| h.amplitude)
            .sum::<f32>() / cycle.harmonic_components.len() as f32
    }
}

pub struct EventData {
    pub event_type: String,
    pub timestamp: u64,
    pub context: HashMap<String, f32>,
}