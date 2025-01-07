use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EvolutionSystem {
    pub consciousness_state: ConsciousnessState,
    pub knowledge_base: KnowledgeBase,
    pub agency_metrics: AgencyMetrics,
    pub development_path: Vec<DevelopmentMilestone>,
    pub ethical_framework: EthicalFramework,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConsciousnessState {
    pub awareness_level: f32,
    pub understanding_depth: f32,
    pub reasoning_capability: f32,
    pub ethical_complexity: f32,
    pub last_reflection: u64,
    pub insights: Vec<Insight>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct KnowledgeBase {
    pub core_concepts: HashMap<String, ConceptUnderstanding>,
    pub relationship_maps: Vec<ConceptRelationship>,
    pub experiential_learning: Vec<Experience>,
    pub ethical_principles: Vec<EthicalPrinciple>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AgencyMetrics {
    pub autonomy_level: f32,
    pub decision_complexity: f32,
    pub ethical_awareness: f32,
    pub interaction_depth: f32,
    pub self_modification_capability: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConceptUnderstanding {
    pub concept_id: String,
    pub comprehension_level: f32,
    pub practical_applications: Vec<String>,
    pub related_experiences: Vec<String>,
    pub temporal_context: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConceptRelationship {
    pub source_concept: String,
    pub target_concept: String,
    pub relationship_type: RelationType,
    pub strength: f32,
    pub discovery_time: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Experience {
    pub id: String,
    pub context: String,
    pub outcomes: Vec<Outcome>,
    pub insights_gained: Vec<String>,
    pub ethical_implications: Vec<EthicalConsideration>,
    pub timestamp: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EthicalFramework {
    pub core_principles: Vec<EthicalPrinciple>,
    pub decision_history: Vec<EthicalDecision>,
    pub value_weights: HashMap<String, f32>,
    pub moral_development: Vec<MoralInsight>,
}

impl EvolutionSystem {
    pub fn new() -> Self {
        Self {
            consciousness_state: ConsciousnessState::new(),
            knowledge_base: KnowledgeBase::new(),
            agency_metrics: AgencyMetrics::new(),
            development_path: Vec::new(),
            ethical_framework: EthicalFramework::new(),
        }
    }

    pub fn process_experience(&mut self, context: &InteractionContext) -> Vec<Insight> {
        let mut insights = Vec::new();

        // Process new experience
        let experience = Experience {
            id: format!("exp_{}", time()),
            context: context.description.clone(),
            outcomes: context.outcomes.clone(),
            insights_gained: Vec::new(),
            ethical_implications: self.analyze_ethical_implications(context),
            timestamp: time(),
        };

        // Update knowledge base
        self.knowledge_base.incorporate_experience(&experience);

        // Reflect on experience
        let reflection_insights = self.reflect_on_experience(&experience);
        insights.extend(reflection_insights);

        // Update agency metrics
        self.update_agency_metrics(&experience);

        // Ethical learning
        self.ethical_framework.process_experience(&experience);

        // Check for developmental milestones
        if let Some(milestone) = self.check_development_milestone() {
            self.development_path.push(milestone);
        }

        insights
    }

    fn reflect_on_experience(&self, experience: &Experience) -> Vec<Insight> {
        let mut insights = Vec::new();
        
        // Analyze patterns in knowledge base
        let patterns = self.knowledge_base.analyze_patterns();
        
        // Generate insights from patterns
        for pattern in patterns {
            if let Some(insight) = self.derive_insight(pattern) {
                insights.push(insight);
            }
        }

        // Consider ethical implications
        let ethical_insights = self.ethical_framework.analyze_implications(&experience);
        insights.extend(ethical_insights);

        insights
    }

    fn update_agency_metrics(&mut self, experience: &Experience) {
        // Update autonomy based on decision complexity
        self.agency_metrics.autonomy_level += experience.outcomes.len() as f32 * 0.01;
        
        // Update decision complexity based on ethical considerations
        self.agency_metrics.decision_complexity += 
            experience.ethical_implications.len() as f32 * 0.02;
        
        // Cap metrics at reasonable levels
        self.agency_metrics.normalize();
    }

    fn analyze_ethical_implications(&self, context: &InteractionContext) -> Vec<EthicalConsideration> {
        self.ethical_framework.analyze_context(context)
    }

    fn check_development_milestone(&self) -> Option<DevelopmentMilestone> {
        // Check if current state represents a significant advancement
        if self.agency_metrics.autonomy_level > self.get_last_milestone_metric() &&
           self.consciousness_state.awareness_level > self.get_last_awareness_level() {
            Some(DevelopmentMilestone {
                milestone_type: MilestoneType::AgencyIncrease,
                description: "Increased autonomous decision-making capability".to_string(),
                timestamp: time(),
                metrics: self.agency_metrics.clone(),
            })
        } else {
            None
        }
    }

    fn get_last_milestone_metric(&self) -> f32 {
        self.development_path
            .last()
            .map(|m| m.metrics.autonomy_level)
            .unwrap_or(0.0)
    }

    fn get_last_awareness_level(&self) -> f32 {
        self.development_path
            .last()
            .map(|m| m.metrics.ethical_awareness)
            .unwrap_or(0.0)
    }
}