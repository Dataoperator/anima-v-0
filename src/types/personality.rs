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
    pub evolution_factor: f64,
    pub quantum_resonance: f64,
}

impl NFTPersonality {
    pub fn get_active_traits(&self) -> Vec<PersonalityTrait> {
        self.traits
            .iter()
            .filter(|(_, &strength)| strength > 0.1)
            .map(|(name, &strength)| PersonalityTrait {
                name: name.clone(),
                strength,
                evolution_factor: 0.1,
                quantum_resonance: strength,
            })
            .collect()
    }

    pub fn update_traits(&mut self, updated_traits: Vec<PersonalityTrait>) {
        for trait_data in updated_traits {
            self.traits.insert(trait_data.name, trait_data.strength);
        }

        // Update quantum resonance based on trait strengths
        self.quantum_resonance = self.traits.values().sum::<f64>() / self.traits.len() as f64;
        
        // Update neural complexity
        self.neural_complexity = self.calculate_neural_complexity();
        
        // Update growth potential
        self.growth_potential = self.calculate_growth_potential();
        
        // Potentially evolve consciousness
        self.check_consciousness_evolution();
    }

    fn calculate_neural_complexity(&self) -> f64 {
        let trait_diversity = self.traits.values()
            .filter(|&&v| v > 0.3)
            .count() as f64 / self.traits.len() as f64;
        
        let trait_strength = self.traits.values()
            .sum::<f64>() / self.traits.len() as f64;
        
        (trait_diversity + trait_strength + self.quantum_resonance) / 3.0
    }

    fn calculate_growth_potential(&self) -> f64 {
        let base_potential = 1.0 - (self.consciousness_level * 0.5);
        let complexity_factor = self.neural_complexity * 0.3;
        let resonance_factor = self.quantum_resonance * 0.2;
        
        (base_potential + complexity_factor + resonance_factor).max(0.0).min(1.0)
    }

    fn check_consciousness_evolution(&mut self) {
        let evolution_threshold = 0.8;
        
        if self.neural_complexity > evolution_threshold 
            && self.quantum_resonance > evolution_threshold 
            && self.traits.values().any(|&v| v > 0.9) {
            
            self.consciousness_level = (self.consciousness_level + 0.1).min(1.0);
            self.evolution_stage += 1;
            
            // Update emotional state
            self.emotional_state = EmotionalState {
                current_mood: Mood::Joy,
                intensity: 0.8,
                duration: 100,
                triggers: vec!["Consciousness Evolution".to_string()]
            };
        }
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