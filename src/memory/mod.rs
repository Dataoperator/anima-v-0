use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;
use crate::error::Result;

thread_local! {
    static MEMORIES: RefCell<HashMap<String, Vec<Memory>>> = RefCell::new(HashMap::new());
}

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

    pub fn recall(anima_id: &str, resonance_threshold: f64) -> Result<Vec<Memory>> {
        MEMORIES.with(|memories| {
            let memories = memories.borrow();
            let anima_memories = memories.get(anima_id)
                .cloned()
                .unwrap_or_default();
            
            Ok(anima_memories.into_iter()
                .filter(|m| m.strength >= resonance_threshold)
                .collect())
        })
    }

    pub async fn process_patterns(anima_id: &str) -> Result<Vec<f64>> {
        MEMORIES.with(|memories| {
            let memories = memories.borrow();
            let anima_memories = memories.get(anima_id)
                .cloned()
                .unwrap_or_default();
            
            let patterns = anima_memories.iter()
                .map(|m| m.resonance_signature.first().copied().unwrap_or(0) as f64 / 255.0)
                .collect();
            
            Ok(patterns)
        })
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
        let coherence_diff = (self.quantum_state.coherence_level - current_quantum_state.coherence_level).abs();
        
        let current_stability = current_quantum_state.dimensional_state.stability;
        let past_stability = self.quantum_state.dimensional_state.stability;
        let stability_diff = (current_stability - past_stability).abs();

        let consciousness_weight = if self.quantum_state.consciousness_alignment == 
                                    current_quantum_state.consciousness_alignment {
            1.0
        } else {
            0.5
        };

        let weighted_sum = coherence_diff * 0.4 + stability_diff * 0.4 + (1.0 - consciousness_weight) * 0.2;
        1.0 - weighted_sum
    }

    pub fn update_resonance_signature(&mut self, current_quantum_state: &QuantumState) {
        let resonance = self.calculate_resonance(current_quantum_state);
        let timestamp = ic_cdk::api::time();
        
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

    pub fn store(anima_id: &str, memory: Memory) -> Result<()> {
        MEMORIES.with(|memories| {
            let mut memories = memories.borrow_mut();
            let anima_memories = memories.entry(anima_id.to_string()).or_default();
            anima_memories.push(memory);
            Ok(())
        })
    }

    pub fn cleanup_old_memories(anima_id: &str, threshold: f64) -> Result<()> {
        MEMORIES.with(|memories| {
            let mut memories = memories.borrow_mut();
            if let Some(anima_memories) = memories.get_mut(anima_id) {
                anima_memories.retain(|memory| memory.get_memory_strength(&memory.quantum_state) >= threshold);
            }
            Ok(())
        })
    }

    pub fn consolidate_memories(anima_id: &str) -> Result<()> {
        MEMORIES.with(|memories| {
            let mut memories = memories.borrow_mut();
            if let Some(anima_memories) = memories.get_mut(anima_id) {
                anima_memories.sort_by(|a, b| b.importance_score.partial_cmp(&a.importance_score).unwrap());
                
                const MAX_MEMORIES: usize = 1000;
                if anima_memories.len() > MAX_MEMORIES {
                    anima_memories.truncate(MAX_MEMORIES);
                }
            }
            Ok(())
        })
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_memory_creation() {
        let personality = NFTPersonality::default();
        let quantum_state = QuantumState::default();
        let memory = Memory::new(
            "Test memory".to_string(),
            personality,
            quantum_state,
            EventType::Interaction,
            0.5
        );

        assert_eq!(memory.content, "Test memory");
        assert_eq!(memory.strength, 1.0);
        assert_eq!(memory.emotional_impact, 0.5);
    }

    #[test]
    fn test_memory_decay() {
        let mut memory = Memory::new(
            "Test memory".to_string(),
            NFTPersonality::default(),
            QuantumState::default(),
            EventType::Interaction,
            0.5
        );

        memory.decay(0.1);
        assert!((memory.strength - 0.9).abs() < f64::EPSILON);
    }
}