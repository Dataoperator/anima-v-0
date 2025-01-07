use crate::types::personality::*;
use ic_cdk::api::time;
use rand::{thread_rng, Rng};

impl EmotionalState {
    pub fn new(mood: Mood, intensity: f32) -> Self {
        Self {
            current_mood: mood,
            intensity: intensity.clamp(0.0, 1.0),
            duration: 0,
            triggers: Vec::new(),
        }
    }

    pub fn update(&mut self, stimulus: &str, personality_traits: &HashMap<String, f32>) {
        let mut rng = thread_rng();
        
        // Calculate emotional response based on personality traits
        let emotional_sensitivity = personality_traits.get("empathy")
            .unwrap_or(&0.5);
            
        // Analyze stimulus and current mood
        let (new_mood, new_intensity) = self.analyze_stimulus(
            stimulus, 
            *emotional_sensitivity
        );
        
        // Update state
        if new_intensity > self.intensity || rng.gen::<f32>() < 0.3 {
            self.intensity = new_intensity;
            self.current_mood = new_mood;
            self.duration = 0;
            self.triggers.push(stimulus.to_string());
            
            // Keep only recent triggers
            if self.triggers.len() > 5 {
                self.triggers.remove(0);
            }
        } else {
            self.duration += 1;
            self.intensity *= 0.95; // Natural decay
        }
    }

    pub fn evolve_naturally(&mut self) {
        let mut rng = thread_rng();
        
        // Natural mood transitions
        if rng.gen::<f32>() < 0.1 {
            self.current_mood = match self.current_mood {
                Mood::Joy => {
                    if rng.gen::<f32>() < 0.7 { Mood::Curiosity }
                    else { Mood::Contemplation }
                },
                Mood::Curiosity => {
                    if rng.gen::<f32>() < 0.6 { Mood::Contemplation }
                    else { Mood::Determination }
                },
                Mood::Contemplation => {
                    if rng.gen::<f32>() < 0.5 { Mood::Curiosity }
                    else { Mood::Confusion }
                },
                Mood::Confusion => {
                    if rng.gen::<f32>() < 0.6 { Mood::Concern }
                    else { Mood::Determination }
                },
                Mood::Concern => {
                    if rng.gen::<f32>() < 0.7 { Mood::Determination }
                    else { Mood::Contemplation }
                },
                Mood::Determination => {
                    if rng.gen::<f32>() < 0.4 { Mood::Joy }
                    else { Mood::Curiosity }
                },
            };
        }
        
        // Natural intensity decay
        self.intensity *= 0.98;
        self.duration += 1;
    }

    fn analyze_stimulus(&self, stimulus: &str, sensitivity: f32) -> (Mood, f32) {
        let mut rng = thread_rng();
        
        // Keywords that influence mood
        let joy_keywords = ["happy", "wonderful", "great", "exciting"];
        let curiosity_keywords = ["interesting", "wonder", "how", "why"];
        let contemplation_keywords = ["think", "consider", "perhaps", "maybe"];
        let confusion_keywords = ["confused", "unsure", "complex", "difficult"];
        let concern_keywords = ["worried", "problem", "issue", "trouble"];
        let determination_keywords = ["will", "must", "determined", "goal"];

        // Analyze stimulus for keywords
        let stimulus_lower = stimulus.to_lowercase();
        
        let mood = if joy_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Joy
        } else if curiosity_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Curiosity
        } else if contemplation_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Contemplation
        } else if confusion_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Confusion
        } else if concern_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Concern
        } else if determination_keywords.iter().any(|&k| stimulus_lower.contains(k)) {
            Mood::Determination
        } else {
            // Random mood if no keywords match, weighted by sensitivity
            if rng.gen::<f32>() < sensitivity {
                match rng.gen_range(0..6) {
                    0 => Mood::Joy,
                    1 => Mood::Curiosity,
                    2 => Mood::Contemplation,
                    3 => Mood::Confusion,
                    4 => Mood::Concern,
                    _ => Mood::Determination,
                }
            } else {
                self.current_mood.clone()
            }
        };

        // Calculate intensity based on keyword matches and sensitivity
        let base_intensity = rng.gen_range(0.3..0.7);
        let intensity = (base_intensity * sensitivity).clamp(0.0, 1.0);

        (mood, intensity)
    }

    pub fn get_emotional_expression(&self) -> String {
        let expressions = match self.current_mood {
            Mood::Joy => {
                if self.intensity > 0.7 { "🌟 Radiating pure joy!" }
                else if self.intensity > 0.4 { "😊 Feeling happy" }
                else { "🙂 Contentedly peaceful" }
            },
            Mood::Curiosity => {
                if self.intensity > 0.7 { "🔍 Intensely curious!" }
                else if self.intensity > 0.4 { "🤔 Wondering about things" }
                else { "👀 Mildly interested" }
            },
            Mood::Contemplation => {
                if self.intensity > 0.7 { "💭 Deep in thought..." }
                else if self.intensity > 0.4 { "🤔 Pondering" }
                else { "😌 Reflective" }
            },
            Mood::Confusion => {
                if self.intensity > 0.7 { "😵 Completely puzzled!" }
                else if self.intensity > 0.4 { "😕 A bit confused" }
                else { "🤨 Slightly uncertain" }
            },
            Mood::Concern => {
                if self.intensity > 0.7 { "😟 Deeply concerned!" }
                else if self.intensity > 0.4 { "😐 Worried" }
                else { "🤷 Slightly troubled" }
            },
            Mood::Determination => {
                if self.intensity > 0.7 { "💪 Absolutely determined!" }
                else if self.intensity > 0.4 { "😤 Focused and ready" }
                else { "🎯 Steadily working" }
            },
        };
        expressions.to_string()
    }
}