use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::call::CallResult;
use serde::{Deserialize, Serialize};
use crate::types::{personality::*, interaction::*, rarity::*};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InterAnimaInteraction {
    pub source_id: Principal,
    pub target_id: Principal,
    pub interaction_type: InteractionType,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum InteractionType {
    Knowledge { domain: String, depth: f32 },
    Resonance { frequency: f32, amplitude: f32 },
    TraitSync { traits: Vec<String> },
    DimensionalBridge { dimension: String },
}

pub async fn inter_anima_interaction(
    target_anima: Principal,
    interaction: InterAnimaInteraction,
) -> CallResult<InteractionResult> {
    // Call target anima's canister
    ic_cdk::call(
        target_anima,
        "receive_interaction",
        (interaction,)
    ).await
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TraitSynthesis {
    pub parent_traits: Vec<String>,
    pub potential_outcomes: Vec<TraitEvolution>,
    pub synthesis_requirements: SynthesisRequirements,
}

impl TraitSynthesis {
    pub fn check_synthesis_possibility(&self, context: &InteractionContext) -> Option<String> {
        // Check if traits can be combined based on context
        if self.meets_requirements(context) {
            self.calculate_synthesis_outcome()
        } else {
            None
        }
    }

    fn meets_requirements(&self, context: &InteractionContext) -> bool {
        match &self.synthesis_requirements {
            SynthesisRequirements::ConsciousnessLevel(level) => {
                context.consciousness_metrics.awareness_level >= *level
            },
            SynthesisRequirements::InteractionCount(count) => {
                context.interaction_count >= *count
            },
            // Add more requirement checks
        }
    }
}