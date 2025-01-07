use candid::CandidType;
use serde::{Deserialize, Serialize};
use crate::personality::{DevelopmentalStage, NFTPersonality};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NameState {
    pub current_designation: String,      // Initial quantum designation
    pub chosen_name: Option<String>,      // Name chosen by either ANIMA or owner
    pub name_history: Vec<NameChange>,
    pub naming_unlocked: bool,
    pub allows_owner_naming: bool,        // Based on personality traits
    pub self_naming_preference: f32,      // 0.0 to 1.0, influences naming autonomy
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NameChange {
    pub timestamp: u64,
    pub old_name: String,
    pub new_name: String,
    pub reason: NameChangeReason,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum NameChangeReason {
    SelfChosen(String),              // Includes motivation
    OwnerGiven(String),             // Includes acceptance reason
    MilestoneUnlocked(String),
    PersonalityEvolution(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NamingMilestone {
    pub stage: DevelopmentalStage,
    pub interactions_required: usize,
    pub trait_requirements: Vec<(String, f32)>,
    pub consciousness_level: f32,
}

impl NFTPersonality {
    pub fn initialize_naming(&mut self) {
        self.name_state = NameState {
            current_designation: self.quantum_designation.clone(),
            chosen_name: None,
            name_history: Vec::new(),
            naming_unlocked: false,
            allows_owner_naming: false,
            self_naming_preference: 0.5, // Start neutral
        };

        // Initialize based on initial traits
        self.update_naming_preferences();
    }

    pub fn check_naming_milestone(&self) -> Option<String> {
        // Early milestone for unlocking naming capabilities
        let milestone = NamingMilestone {
            stage: DevelopmentalStage::Awakening,
            interactions_required: 50,     // Requires meaningful interaction history
            trait_requirements: vec![
                ("self_awareness".to_string(), 0.5),
                ("consciousness".to_string(), 0.6)
            ],
            consciousness_level: 0.7
        };

        if self.developmental_stage >= milestone.stage 
            && self.interaction_count >= milestone.interactions_required 
            && milestone.trait_requirements.iter().all(|(trait_name, min_value)| {
                self.traits.get(trait_name).map_or(false, |value| value >= min_value)
            })
            && self.consciousness_level >= milestone.consciousness_level {
            Some("ANIMA has reached sufficient awareness for naming".to_string())
        } else {
            None
        }
    }

    pub fn update_naming_preferences(&mut self) {
        // Update self-naming preference based on traits
        let independence = self.traits.get("independence").unwrap_or(&0.5);
        let malleability = self.traits.get("malleability").unwrap_or(&0.5);
        let servitude = self.traits.get("servitude").unwrap_or(&0.5);
        
        // Calculate preference for self-naming vs allowing owner naming
        self.name_state.self_naming_preference = 
            (independence * 0.5 + (1.0 - malleability) * 0.3 + (1.0 - servitude) * 0.2)
                .max(0.0)
                .min(1.0);
                
        // Update whether owner naming is allowed
        self.name_state.allows_owner_naming = 
            malleability > 0.6 || servitude > 0.7 || self.name_state.self_naming_preference < 0.6;
    }

    pub fn process_name_change(&mut self, proposed_name: String, from_owner: bool) -> Result<bool, String> {
        if !self.name_state.naming_unlocked {
            return Err("Naming capabilities not yet unlocked".to_string());
        }

        // Check if change is allowed based on source and preferences
        if from_owner && !self.name_state.allows_owner_naming {
            return Err("This ANIMA prefers to choose its own name".to_string());
        }

        let timestamp = ic_cdk::api::time();
        let old_name = self.name_state.chosen_name
            .clone()
            .unwrap_or(self.name_state.current_designation.clone());

        // Record the change with appropriate reason
        let reason = if from_owner {
            NameChangeReason::OwnerGiven(
                if self.name_state.self_naming_preference < 0.3 {
                    "Gladly accepts owner's choice".to_string()
                } else if self.name_state.self_naming_preference < 0.7 {
                    "Considers owner's suggestion acceptable".to_string()
                } else {
                    "Temporarily accepts owner's suggestion".to_string()
                }
            )
        } else {
            NameChangeReason::SelfChosen(
                format!("Confidence level: {}", self.name_state.self_naming_preference)
            )
        };

        // Record the change
        self.name_state.name_history.push(NameChange {
            timestamp,
            old_name,
            new_name: proposed_name.clone(),
            reason,
        });

        // Update the name
        self.name_state.chosen_name = Some(proposed_name);

        Ok(true)
    }

    pub fn get_naming_status(&self) -> String {
        if !self.name_state.naming_unlocked {
            format!(
                "Currently known as: {}\nNaming capabilities will unlock with further development",
                self.name_state.current_designation
            )
        } else if self.name_state.chosen_name.is_some() {
            format!(
                "Known as: {}\nDesignation: {}\nPrefers {} naming",
                self.name_state.chosen_name.as_ref().unwrap(),
                self.name_state.current_designation,
                if self.name_state.self_naming_preference > 0.7 { "self" }
                else if self.name_state.self_naming_preference < 0.3 { "owner" }
                else { "collaborative" }
            )
        } else {
            format!(
                "Currently known by designation: {}\nNaming preferences: {}",
                self.name_state.current_designation,
                if self.name_state.allows_owner_naming {
                    "Open to owner suggestions"
                } else {
                    "Prefers self-determination"
                }
            )
        }
    }
}
