use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CommunityEvent {
    pub event_type: CommunityEventType,
    pub participants: Vec<Principal>,
    pub collective_consciousness: f32,
    pub dimensional_resonance: f32,
    pub trait_opportunities: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CommunityEventType {
    GreatConvergence { 
        consciousness_threshold: f32,
        participants_required: u32,
    },
    TraitSynthesis { 
        parent_traits: Vec<String>,
        synthesis_power: f32,
    },
    DimensionalShift {
        new_dimension: String,
        shift_intensity: f32,
    },
    MassEvolution {
        evolution_type: String,
        power_level: f32,
    },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CommunityAchievement {
    pub achievement_type: String,
    pub required_participants: u32,
    pub current_participants: u32,
    pub reward_traits: Vec<String>,
    pub completion_threshold: f32,
}

pub struct CommunityManager {
    pub active_events: Vec<CommunityEvent>,
    pub achievements: HashMap<String, CommunityAchievement>,
    pub collective_metrics: CollectiveMetrics,
}

impl CommunityManager {
    pub fn process_community_event(&mut self, event: CommunityEvent) -> Vec<TraitOpportunity> {
        let mut opportunities = Vec::new();

        match &event.event_type {
            CommunityEventType::GreatConvergence { 
                consciousness_threshold,
                participants_required 
            } => {
                if self.check_convergence_conditions(
                    *consciousness_threshold,
                    *participants_required,
                    &event.participants
                ) {
                    opportunities.push(TraitOpportunity {
                        trait_id: "collective_consciousness".to_string(),
                        chance: 0.1,
                        reason: "Great Convergence achievement".to_string(),
                    });
                }
            },
            CommunityEventType::TraitSynthesis { 
                parent_traits,
                synthesis_power 
            } => {
                if let Some(new_trait) = self.attempt_community_synthesis(
                    parent_traits,
                    *synthesis_power
                ) {
                    opportunities.push(TraitOpportunity {
                        trait_id: new_trait,
                        chance: 0.05 * synthesis_power,
                        reason: "Community Trait Synthesis".to_string(),
                    });
                }
            },
            // Handle other event types...
        }

        // Update collective metrics
        self.collective_metrics.update_from_event(&event);

        opportunities
    }

    pub fn check_achievements(&self) -> Vec<String> {
        let mut completed = Vec::new();
        
        for (id, achievement) in &self.achievements {
            if achievement.current_participants >= achievement.required_participants {
                completed.push(id.clone());
            }
        }
        
        completed
    }
}