use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Personality {
    pub curiosity: f32,    // Drives learning and question-asking behavior
    pub stability: f32,    // Influences consistency in responses and emotional regulation
    pub attachment: f32,   // Affects bond formation and relationship depth
    pub reactivity: f32,   // Controls emotional response intensity
}

impl Personality {
    pub fn generate_initial() -> Self {
        Self {
            curiosity: 0.7,     // Start fairly curious
            stability: 0.5,     // Moderate emotional stability
            attachment: 0.3,    // Start with low attachment (needs to be earned)
            reactivity: 0.6,    // Moderately reactive to interactions
        }
    }

    pub fn update_trait(&mut self, trait_name: &str, change: f32) {
        let trait_value = match trait_name {
            "curiosity" => &mut self.curiosity,
            "stability" => &mut self.stability,
            "attachment" => &mut self.attachment,
            "reactivity" => &mut self.reactivity,
            _ => return,
        };

        *trait_value = (*trait_value + change).clamp(0.0, 1.0);
    }

    pub fn calculate_mood(&self) -> (&'static str, f32) {
        let stability_weight = 0.4;
        let reactivity_weight = 0.3;
        let attachment_weight = 0.3;

        let mood_value = 
            self.stability * stability_weight +
            (1.0 - self.reactivity) * reactivity_weight +
            self.attachment * attachment_weight;

        match mood_value {
            x if x >= 0.8 => ("Content", x),
            x if x >= 0.6 => ("Balanced", x),
            x if x >= 0.4 => ("Neutral", x),
            x if x >= 0.2 => ("Uneasy", x),
            _ => ("Anxious", mood_value),
        }
    }
}