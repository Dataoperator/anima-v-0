use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Memory {
    pub content: String,
    pub strength: f64,
    pub personality_state: NFTPersonality,
    pub quantum_state: QuantumState,
    pub event_type: String,
    pub description: String,
    pub emotional_impact: f64,
    pub importance_score: f64,
    pub keywords: Vec<String>,
    pub timestamp: u64,
    pub resonance_signature: Vec<u8>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum EventType {
    Interaction,
    Growth,
    Evolution,
    QuantumShift,
    ConsciousnessLeap,
}

impl Memory {
    pub fn new(
        content: String,
        personality_state: NFTPersonality,
        quantum_state: QuantumState,
        event_type: EventType,
        emotional_impact: f64,
    ) -> Self {
        Self {
            content,
            strength: 1.0,
            personality_state,
            quantum_state,
            event_type: event_type.to_string(),
            description: String::new(),
            emotional_impact,
            importance_score: 0.0,
            keywords: Vec::new(),
            timestamp: ic_cdk::api::time(),
            resonance_signature: Vec::new(),
        }
    }

    pub fn with_description(mut self, description: String) -> Self {
        self.description = description;
        self
    }

    pub fn with_keywords(mut self, keywords: Vec<String>) -> Self {
        self.keywords = keywords;
        self
    }

    pub fn with_importance(mut self, score: f64) -> Self {
        self.importance_score = score;
        self
    }

    pub fn decay(&mut self, factor: f64) {
        self.strength *= (1.0 - factor).max(0.0);
    }

    pub fn reinforce(&mut self, amount: f64) {
        self.strength = (self.strength + amount).min(1.0);
    }

    pub fn calculate_resonance(&self, current_quantum_state: &QuantumState) -> f64 {
        let coherence_diff = (self.quantum_state.coherence - current_quantum_state.coherence).abs();
        let field_strength_diff = (
            self.quantum_state.field_strength -
            current_quantum_state.field_strength
        ).abs();
        
        let consciousness_diff = (
            self.quantum_state.consciousness_alignment -
            current_quantum_state.consciousness_alignment
        ).abs();

        // Calculate resonance using all three metrics
        1.0 - (coherence_diff + field_strength_diff + consciousness_diff) / 3.0
    }

    pub fn update_resonance_signature(&mut self, current_quantum_state: &QuantumState) {
        let resonance = self.calculate_resonance(current_quantum_state);
        let timestamp = ic_cdk::api::time();
        
        // Create a unique resonance signature combining multiple factors
        let signature = vec![
            ((resonance * 255.0) as u8),
            ((self.strength * 255.0) as u8),
            ((self.emotional_impact * 255.0) as u8),
            ((self.importance_score * 255.0) as u8),
            ((timestamp & 0xFF) as u8),
            (((timestamp >> 8) & 0xFF) as u8),
            (((timestamp >> 16) & 0xFF) as u8),
            (((timestamp >> 24) & 0xFF) as u8),
        ];
        
        self.resonance_signature = signature;
    }

    pub fn get_memory_strength(&self, current_quantum_state: &QuantumState) -> f64 {
        let base_strength = self.strength;
        let resonance = self.calculate_resonance(current_quantum_state);
        let time_factor = self.calculate_time_decay();
        
        base_strength * resonance * time_factor
    }

    fn calculate_time_decay(&self) -> f64 {
        let current_time = ic_cdk::api::time();
        let age = current_time - self.timestamp;
        let decay_rate = 0.1; // Adjustable decay rate
        
        (-decay_rate * (age as f64) / (24.0 * 60.0 * 60.0 * 1_000_000_000.0)).exp()
    }
}

impl ToString for EventType {
    fn to_string(&self) -> String {
        match self {
            EventType::Interaction => "Interaction",
            EventType::Growth => "Growth",
            EventType::Evolution => "Evolution",
            EventType::QuantumShift => "QuantumShift",
            EventType::ConsciousnessLeap => "ConsciousnessLeap",
        }.to_string()
    }
}