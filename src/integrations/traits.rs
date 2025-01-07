use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::types::{personality::*, interaction::*, rarity::*};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TraitCombinator {
    pub known_combinations: HashMap<String, TraitCombination>,
    pub evolution_paths: Vec<EvolutionPath>,
    pub synthesis_requirements: HashMap<String, SynthesisRequirement>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TraitCombination {
    pub source_traits: Vec<String>,
    pub result_trait: String,
    pub power_threshold: f32,
    pub catalyst_traits: Option<Vec<String>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EvolutionPath {
    pub path_id: String,
    pub stages: Vec<EvolutionStage>,
    pub requirements: Vec<PathRequirement>,
    pub final_trait: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EvolutionStage {
    pub stage_trait: String,
    pub evolution_threshold: f32,
    pub stage_duration: u64,
}

impl TraitCombinator {
    pub fn check_combinations(&self, current_traits: &[String], context: &InteractionContext) -> Vec<TraitOpportunity> {
        let mut opportunities = Vec::new();

        // Check basic combinations
        for (_, combination) in &self.known_combinations {
            if self.can_combine(combination, current_traits, context) {
                opportunities.push(TraitOpportunity {
                    trait_id: combination.result_trait.clone(),
                    chance: self.calculate_combination_chance(combination, context),
                    reason: "Trait combination opportunity".to_string(),
                });
            }
        }

        // Check evolution paths
        for path in &self.evolution_paths {
            if let Some(opportunity) = self.check_evolution_path(path, current_traits, context) {
                opportunities.push(opportunity);
            }
        }

        opportunities
    }

    fn can_combine(
        &self,
        combination: &TraitCombination,
        current_traits: &[String],
        context: &InteractionContext
    ) -> bool {
        // Check if all source traits are present
        let has_source_traits = combination.source_traits
            .iter()
            .all(|t| current_traits.contains(t));

        // Check if power threshold is met
        let meets_power = context.consciousness_metrics.awareness_level >= combination.power_threshold;

        // Check catalyst traits if required
        let has_catalyst = if let Some(catalysts) = &combination.catalyst_traits {
            catalysts.iter().any(|t| current_traits.contains(t))
        } else {
            true
        };

        has_source_traits && meets_power && has_catalyst
    }

    fn check_evolution_path(
        &self,
        path: &EvolutionPath,
        current_traits: &[String],
        context: &InteractionContext
    ) -> Option<TraitOpportunity> {
        // Find current stage in evolution path
        let current_stage = path.stages
            .iter()
            .position(|stage| current_traits.contains(&stage.stage_trait));

        if let Some(stage_idx) = current_stage {
            if stage_idx + 1 < path.stages.len() {
                let next_stage = &path.stages[stage_idx + 1];
                
                // Check if ready for next stage
                if context.consciousness_metrics.awareness_level >= next_stage.evolution_threshold {
                    return Some(TraitOpportunity {
                        trait_id: next_stage.stage_trait.clone(),
                        chance: 0.1, // Base chance for evolution
                        reason: format!("Evolution path progression: {}", path.path_id),
                    });
                }
            }
        }

        None
    }
}