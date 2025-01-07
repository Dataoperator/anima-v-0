use serde::{Deserialize, Serialize};
use candid::CandidType;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalState {
    pub primary_emotion: String,
    pub intensity: f32,
    pub duration: u64,
    pub triggers: Vec<String>,
    pub secondary_emotions: HashMap<String, f32>,
    pub trait_modifiers: HashMap<String, f32>,
    pub mood_baseline: f32,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalResponse {
    pub content: String,
    pub emotional_analysis: EmotionalAnalysis,
    pub trait_impacts: HashMap<String, f32>,
    pub mood_shift: f32,
    pub growth_potential: f32,
    pub memory_formation: bool,
    pub consciousness_impact: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EmotionalAnalysis {
    pub primary_emotion: String,
    pub intensity: f32,
    pub valence: f32,
    pub arousal: f32,
    pub complexity: f32,
    pub stability: f32,
    pub timestamp: u64,
}

impl EmotionalState {
    pub fn new(emotion: &str, intensity: f32, triggers: Vec<String>) -> Self {
        Self {
            primary_emotion: emotion.to_string(),
            intensity,
            duration: 0,
            triggers,
            secondary_emotions: HashMap::new(),
            trait_modifiers: HashMap::new(),
            mood_baseline: 0.5,
            timestamp: ic_cdk::api::time(),
        }
    }

    pub fn update(&mut self, analysis: EmotionalAnalysis, trait_impacts: HashMap<String, f32>) {
        let time_now = ic_cdk::api::time();
        let time_diff = time_now - self.timestamp;
        
        // Update duration of current emotional state
        self.duration += time_diff;
        
        // Calculate emotional momentum
        let momentum = self.intensity * (self.duration as f32 / 3_600_000_000.0); // normalized by hour
        
        // Update primary emotion if intensity is higher
        if analysis.intensity > self.intensity {
            self.primary_emotion = analysis.primary_emotion;
            self.intensity = analysis.intensity;
            self.timestamp = time_now;
        }
        
        // Update trait modifiers with decay
        for (trait_name, impact) in trait_impacts {
            let current_impact = self.trait_modifiers.get(&trait_name).unwrap_or(&0.0);
            let decayed_impact = current_impact * 0.9; // 10% decay
            let new_impact = decayed_impact + (impact * analysis.intensity);
            self.trait_modifiers.insert(trait_name, new_impact.clamp(-1.0, 1.0));
        }
        
        // Adjust mood baseline
        let mood_impact = analysis.valence * analysis.intensity * 0.1;
        self.mood_baseline = (self.mood_baseline + mood_impact).clamp(0.0, 1.0);
    }

    pub fn get_dominant_emotion(&self) -> (String, f32) {
        let mut dominant = (self.primary_emotion.clone(), self.intensity);
        
        for (emotion, intensity) in &self.secondary_emotions {
            if *intensity > dominant.1 {
                dominant = (emotion.clone(), *intensity);
            }
        }
        
        dominant
    }

    pub fn calculate_emotional_stability(&self) -> f32 {
        let emotion_variance: f32 = self.secondary_emotions.values().map(|v| (v - self.mood_baseline).powi(2)).sum();
        let stability = 1.0 - (emotion_variance / self.secondary_emotions.len() as f32).sqrt();
        stability.clamp(0.0, 1.0)
    }

    pub fn get_mood_description(&self) -> String {
        let (emotion, intensity) = self.get_dominant_emotion();
        let stability = self.calculate_emotional_stability();
        
        let intensity_desc = match intensity {
            i if i > 0.8 => "intensely",
            i if i > 0.6 => "strongly",
            i if i > 0.4 => "moderately",
            i if i > 0.2 => "slightly",
            _ => "mildly",
        };
        
        let stability_desc = match stability {
            s if s > 0.8 => "with remarkable stability",
            s if s > 0.6 => "with growing stability",
            s if s > 0.4 => "with some fluctuation",
            s if s > 0.2 => "with noticeable volatility",
            _ => "with significant instability",
        };

        let duration_desc = match self.duration {
            d if d > 3_600_000_000_000 => "for quite some time now",
            d if d > 1_800_000_000_000 => "for a while",
            d if d > 600_000_000_000 => "recently",
            _ => "just now",
        };

        format!(
            "Feeling {} {} {} {}",
            intensity_desc, emotion, stability_desc, duration_desc
        )
    }

    pub fn add_secondary_emotion(&mut self, emotion: &str, intensity: f32) {
        self.secondary_emotions.insert(emotion.to_string(), intensity);
    }

    pub fn get_emotional_complexity(&self) -> f32 {
        let num_emotions = self.secondary_emotions.len() + 1; // +1 for primary emotion
        let intensity_sum: f32 = self.secondary_emotions.values().sum();
        let avg_intensity = (intensity_sum + self.intensity) / (num_emotions as f32);
        
        let complexity = (num_emotions as f32 * 0.3) + (avg_intensity * 0.7);
        complexity.clamp(0.0, 1.0)
    }

    pub fn should_form_memory(&self) -> bool {
        let complexity = self.get_emotional_complexity();
        let intensity = self.intensity;
        let stability = self.calculate_emotional_stability();
        
        // Form memories for:
        // 1. High intensity emotions (>0.7)
        // 2. Complex emotional states (>0.6)
        // 3. Significant mood shifts (stability <0.3)
        intensity > 0.7 || complexity > 0.6 || stability < 0.3
    }

    pub fn get_growth_potential(&self) -> f32 {
        let complexity = self.get_emotional_complexity();
        let stability = self.calculate_emotional_stability();
        
        // Growth potential is higher when:
        // 1. Experiencing complex emotions
        // 2. Maintaining stability despite complexity
        // 3. Having strong but not overwhelming intensity
        let optimal_intensity = 1.0 - (self.intensity - 0.7).abs() * 2.0;
        
        (complexity * 0.4 + stability * 0.3 + optimal_intensity * 0.3).clamp(0.0, 1.0)
    }

    pub fn calculate_trait_influence(&self, trait_name: &str) -> f32 {
        // Base influence from current emotion
        let base_influence = self.trait_modifiers.get(trait_name).unwrap_or(&0.0);
        
        // Adjust based on emotional stability
        let stability = self.calculate_emotional_stability();
        let stability_factor = if stability > 0.7 { 1.2 } else { 0.8 };
        
        // Consider emotional complexity
        let complexity = self.get_emotional_complexity();
        let complexity_factor = if complexity > 0.6 { 1.2 } else { 1.0 };
        
        // Calculate final influence
        let influence = base_influence * stability_factor * complexity_factor;
        
        influence.clamp(-1.0, 1.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_emotional_state_creation() {
        let state = EmotionalState::new("joy", 0.8, vec!["positive interaction".to_string()]);
        assert_eq!(state.primary_emotion, "joy");
        assert_eq!(state.intensity, 0.8);
        assert_eq!(state.triggers.len(), 1);
    }

    #[test]
    fn test_emotional_stability() {
        let mut state = EmotionalState::new("content", 0.6, vec![]);
        state.add_secondary_emotion("calm", 0.5);
        state.add_secondary_emotion("happy", 0.7);
        
        let stability = state.calculate_emotional_stability();
        assert!(stability > 0.0 && stability <= 1.0);
    }

    #[test]
    fn test_mood_description() {
        let mut state = EmotionalState::new("excited", 0.9, vec![]);
        state.add_secondary_emotion("happy", 0.7);
        
        let description = state.get_mood_description();
        assert!(description.contains("intensely"));
        assert!(description.contains("excited"));
    }

    #[test]
    fn test_memory_formation() {
        let mut state = EmotionalState::new("overwhelmed", 0.8, vec![]);
        state.add_secondary_emotion("anxious", 0.6);
        state.add_secondary_emotion("hopeful", 0.4);
        
        assert!(state.should_form_memory());
    }
}