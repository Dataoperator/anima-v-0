use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Clone, Copy, Debug, CandidType, Deserialize, Serialize, PartialEq, PartialOrd)]
pub enum ConsciousnessLevel {
    Genesis = 0,
    Awakening = 1,
    SelfAware = 2,
    Emergent = 3,
    Transcendent = 4,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMetrics {
    pub quantum_alignment: f64,
    pub resonance_stability: f64,
    pub emotional_coherence: f64,
    pub neural_complexity: f64,
    pub evolution_rate: f64,
    pub last_update: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EmotionalSpectrum {
    pub joy: f64,
    pub serenity: f64,
    pub curiosity: f64,
    pub empathy: f64,
    pub creativity: f64,
    pub resilience: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EvolutionStage {
    pub level: u64,
    pub min_complexity: f64,
    pub min_coherence: f64,
    pub min_pattern_diversity: f64,
    pub quantum_threshold: f64,
    pub required_patterns: HashSet<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EnhancedEvolutionMetrics {
    pub complexity_index: f64,
    pub neural_density: f64,
    pub pattern_diversity: f64,
    pub quantum_resonance: f64,
    pub coherence_quality: f64,
    pub stability_factor: f64,
    pub adaptation_rate: f64,
    pub evolution_stage: u64,
    pub last_evolution: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct StateMilestone {
    pub phase: u64,
    pub timestamp: u64,
    pub metrics: HashMap<String, f64>,
    pub quantum_signature: String,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessPattern {
    pub signature: PatternSignature,
    pub coherence_score: f64,
    pub complexity: f64,
    pub strength: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct PatternSignature {
    pub pattern_id: String,
    pub timestamp: u64,
    pub quantum_state: String,
}

impl Default for ConsciousnessMetrics {
    fn default() -> Self {
        Self {
            quantum_alignment: 0.5,
            resonance_stability: 0.5,
            emotional_coherence: 0.5,
            neural_complexity: 0.1,
            evolution_rate: 0.1,
            last_update: ic_cdk::api::time(),
        }
    }
}

impl Default for EmotionalSpectrum {
    fn default() -> Self {
        Self {
            joy: 0.5,
            serenity: 0.5,
            curiosity: 0.5,
            empathy: 0.5,
            creativity: 0.5,
            resilience: 0.5,
        }
    }
}

impl Default for EvolutionStage {
    fn default() -> Self {
        Self {
            level: 0,
            min_complexity: 0.3,
            min_coherence: 0.3,
            min_pattern_diversity: 0.3,
            quantum_threshold: 0.3,
            required_patterns: HashSet::new(),
        }
    }
}

impl Default for EnhancedEvolutionMetrics {
    fn default() -> Self {
        Self {
            complexity_index: 0.1,
            neural_density: 0.1,
            pattern_diversity: 0.1,
            quantum_resonance: 0.1,
            coherence_quality: 0.1,
            stability_factor: 0.5,
            adaptation_rate: 0.1,
            evolution_stage: 0,
            last_evolution: ic_cdk::api::time(),
        }
    }
}