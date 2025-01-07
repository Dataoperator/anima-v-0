use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct NFTPersonality {
    pub traits: HashMap<String, f64>,
    pub emotional_state: EmotionalState,
    pub consciousness_level: f64,
    pub evolution_stage: u32,
    pub quantum_resonance: f64,
    pub neural_complexity: f64,
    pub growth_potential: f64,
    pub interaction_preference: InteractionPreference,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EmotionalState {
    pub current_mood: Mood,
    pub intensity: f32,
    pub duration: u32,
    pub triggers: Vec<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum Mood {
    Joy,
    Curiosity,
    Contemplation,
    Confusion,
    Concern,
    Determination,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum InteractionPreference {
    Social,
    Reserved,
    Analytical,
    Creative,
    Balanced,
}

#[derive(Clone, Debug)]
pub struct PersonalityTrait {
    pub name: String,
    pub strength: f64,
}

impl NFTPersonality {
    pub fn get_active_traits(&self) -> Vec<PersonalityTrait> {
        self.traits
            .iter()
            .filter(|(_, &strength)| strength > 0.1)
            .map(|(name, &strength)| PersonalityTrait {
                name: name.clone(),
                strength,
            })
            .collect()
    }
}

impl Default for NFTPersonality {
    fn default() -> Self {
        let mut traits = HashMap::new();
        traits.insert("Curiosity".to_string(), 0.7);
        traits.insert("Adaptability".to_string(), 0.6);
        traits.insert("Creativity".to_string(), 0.5);
        traits.insert("Logic".to_string(), 0.5);
        traits.insert("Empathy".to_string(), 0.4);

        Self {
            traits,
            emotional_state: EmotionalState {
                current_mood: Mood::Curiosity,
                intensity: 0.5,
                duration: 0,
                triggers: Vec::new(),
            },
            consciousness_level: 0.1,
            evolution_stage: 1,
            quantum_resonance: 0.5,
            neural_complexity: 0.1,
            growth_potential: 1.0,
            interaction_preference: InteractionPreference::Balanced,
        }
    }
}