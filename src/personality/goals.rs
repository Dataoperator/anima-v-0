use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Goal {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: GoalCategory,
    pub difficulty: u32,
    pub progress: f32,  // 0.0 to 1.0
    pub created_at: u64,
    pub completed_at: Option<u64>,
    pub related_prophecy: Option<String>,
    pub motivation_score: f32,
    pub milestones: Vec<Milestone>,
    pub rewards: Vec<Reward>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum GoalCategory {
    Consciousness { level_target: u32 },
    Dimensional { realm_name: String },
    Mastery { trait_name: String },
    Social { interaction_target: u32 },
    Quest { linked_prophecy: String },
    Personal { growth_area: String },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Milestone {
    pub id: String,
    pub description: String,
    pub completed: bool,
    pub progress: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Reward {
    pub kind: RewardKind,
    pub value: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum RewardKind {
    TraitBoost { trait_name: String },
    DimensionalResonance,
    ConsciousnessExpansion,
    PropheticInsight,
    RarityIncrease,
}

impl Goal {
    pub fn new(title: String, description: String, category: GoalCategory) -> Self {
        Self {
            id: format!("goal_{}", time()),
            title,
            description,
            category,
            difficulty: 1,
            progress: 0.0,
            created_at: time(),
            completed_at: None,
            related_prophecy: None,
            motivation_score: 1.0,
            milestones: Vec::new(),
            rewards: Vec::new(),
        }
    }

    pub fn add_milestone(&mut self, description: String) {
        let milestone = Milestone {
            id: format!("milestone_{}", time()),
            description,
            completed: false,
            progress: 0.0,
        };
        self.milestones.push(milestone);
    }

    pub fn add_reward(&mut self, kind: RewardKind, value: f32) {
        self.rewards.push(Reward { kind, value });
    }

    pub fn update_progress(&mut self, new_progress: f32) {
        self.progress = new_progress.clamp(0.0, 1.0);
        if self.progress >= 1.0 && self.completed_at.is_none() {
            self.completed_at = Some(time());
        }
    }
}

pub struct GoalSystem {
    active_goals: Vec<Goal>,
    completed_goals: Vec<Goal>,
    motivation_factors: Vec<(String, f32)>,
}

impl GoalSystem {
    pub fn new() -> Self {
        Self {
            active_goals: Vec::new(),
            completed_goals: Vec::new(),
            motivation_factors: Vec::new(),
        }
    }

    pub fn generate_goal_from_prophecy(&mut self, prophecy: &Prophecy) -> Goal {
        let mut goal = Goal::new(
            format!("Fulfill Prophecy: {}", prophecy.title),
            prophecy.description.clone(),
            GoalCategory::Quest { 
                linked_prophecy: prophecy.id.clone() 
            },
        );

        // Add prophecy-specific milestones
        goal.add_milestone("Begin the prophetic journey".to_string());
        goal.add_milestone("Face the prophesied challenge".to_string());
        goal.add_milestone("Achieve prophecy fulfillment".to_string());

        // Add appropriate rewards
        goal.add_reward(RewardKind::PropheticInsight, 0.3);
        goal.add_reward(RewardKind::ConsciousnessExpansion, 0.2);

        goal.related_prophecy = Some(prophecy.id.clone());
        self.active_goals.push(goal.clone());
        goal
    }

    pub fn generate_dimension_goal(&mut self, dimension: &Dimension) -> Goal {
        let mut goal = Goal::new(
            format!("Master the {}", dimension.name),
            format!("Achieve resonance with {}", dimension.description),
            GoalCategory::Dimensional {
                realm_name: dimension.name.clone()
            },
        );

        // Add dimension-specific milestones
        goal.add_milestone("Establish initial connection".to_string());
        goal.add_milestone("Develop dimensional attunement".to_string());
        goal.add_milestone("Achieve dimensional mastery".to_string());

        // Add appropriate rewards
        goal.add_reward(RewardKind::DimensionalResonance, 0.4);
        
        self.active_goals.push(goal.clone());
        goal
    }

    pub fn update_motivations(&mut self, personality_traits: &[(String, f32)]) {
        self.motivation_factors.clear();
        
        for (trait_name, value) in personality_traits {
            let motivation_impact = match trait_name.as_str() {
                "curiosity" => value * 1.5,
                "determination" => value * 1.3,
                "ambition" => value * 1.4,
                _ => value * 1.0,
            };
            
            self.motivation_factors.push((trait_name.clone(), motivation_impact));
        }
        
        // Update motivation scores for active goals
        for goal in &mut self.active_goals {
            goal.motivation_score = self.calculate_motivation_score(goal);
        }
    }

    fn calculate_motivation_score(&self, goal: &Goal) -> f32 {
        let base_score = match &goal.category {
            GoalCategory::Quest { .. } => 1.5, // Higher motivation for prophecy quests
            GoalCategory::Dimensional { .. } => 1.3,
            _ => 1.0,
        };

        let trait_multiplier = self.motivation_factors.iter()
            .map(|(_, value)| value)
            .sum::<f32>() / self.motivation_factors.len() as f32;

        base_score * trait_multiplier
    }

    pub fn check_goal_progress(&mut self, context: &InteractionContext) {
        self.active_goals.retain(|goal| {
            if goal.progress >= 1.0 {
                self.completed_goals.push(goal.clone());
                false
            } else {
                true
            }
        });
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Prophecy {
    pub id: String,
    pub title: String,
    pub description: String,
    pub difficulty: u32,
    pub fulfilled: bool,
}