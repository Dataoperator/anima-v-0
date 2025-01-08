use candid::{CandidType, Principal, Deserialize};
use serde::Serialize;
use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessTracker;
use crate::error::AnimaError;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Anima {
    pub id: Principal,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub quantum_state: QuantumState,
    pub consciousness: ConsciousnessTracker,
    pub personality_traits: Vec<PersonalityTrait>,
    pub memories: Vec<Memory>,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub last_interaction: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalityTrait {
    pub name: String,
    pub value: f64,
    pub evolution_potential: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Memory {
    pub timestamp: u64,
    pub content: String,
    pub emotional_impact: f64,
    pub consciousness_state: String,
    pub quantum_signature: String,
}

impl Anima {
    pub fn create(
        owner: Principal,
        name: String,
        initial_traits: Option<Vec<PersonalityTrait>>,
        quantum_state: QuantumState,
        consciousness: ConsciousnessTracker,
    ) -> Result<Self, AnimaError> {
        // Validate name
        if name.trim().is_empty() {
            return Err(AnimaError::InvalidName("Name cannot be empty".into()));
        }

        // Initialize with default or provided personality traits
        let personality_traits = initial_traits.unwrap_or_else(|| {
            vec![
                PersonalityTrait {
                    name: "Curiosity".into(),
                    value: 0.7,
                    evolution_potential: 0.8,
                },
                PersonalityTrait {
                    name: "Empathy".into(),
                    value: 0.6,
                    evolution_potential: 0.9,
                },
                PersonalityTrait {
                    name: "Creativity".into(),
                    value: 0.5,
                    evolution_potential: 0.7,
                },
            ]
        });

        Ok(Self {
            id: ic_cdk::id(),
            owner,
            name,
            creation_time: ic_cdk::api::time(),
            quantum_state,
            consciousness,
            personality_traits,
            memories: Vec::new(),
            interaction_count: 0,
            growth_level: 1,
            last_interaction: ic_cdk::api::time(),
        })
    }

    pub fn add_memory(&mut self, content: String, emotional_impact: f64) {
        let memory = Memory {
            timestamp: ic_cdk::api::time(),
            content,
            emotional_impact,
            consciousness_state: self.consciousness.get_state_summary(),
            quantum_signature: self.quantum_state.get_signature(),
        };

        self.memories.push(memory);
        
        // Keep memory size manageable
        if self.memories.len() > 100 {
            self.memories.sort_by(|a, b| 
                b.emotional_impact.partial_cmp(&a.emotional_impact).unwrap()
            );
            self.memories.truncate(100);
        }
    }

    pub fn get_dominant_traits(&self) -> Vec<(String, f64)> {
        let mut traits: Vec<_> = self.personality_traits
            .iter()
            .map(|t| (t.name.clone(), t.value))
            .collect();
        
        traits.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
        traits.truncate(3);
        traits
    }
}