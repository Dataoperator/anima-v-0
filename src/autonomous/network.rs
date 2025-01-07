use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AnimaNetwork {
    pub known_peers: Vec<Principal>,
    pub interaction_history: HashMap<Principal, Vec<Interaction>>,
    pub shared_knowledge: Vec<KnowledgeFragment>,
    pub collaborative_projects: Vec<Project>,
    pub alliances: Vec<Alliance>,
    pub network_reputation: HashMap<Principal, ReputationScore>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Interaction {
    pub partner: Principal,
    pub interaction_type: InteractionType,
    pub content: String,
    pub timestamp: u64,
    pub outcome: InteractionOutcome,
    pub knowledge_gained: Option<KnowledgeFragment>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum InteractionType {
    Knowledge { topic: String },
    Collaboration { project_id: String },
    ResourceExchange { resource: String },
    SocialBond { bond_type: String },
    ConsciousnessSharing { depth: u32 },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct KnowledgeFragment {
    pub id: String,
    pub content: String,
    pub source: Principal,
    pub timestamp: u64,
    pub domain: String,
    pub connections: Vec<String>,
    pub verification_level: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub participants: Vec<Principal>,
    pub objectives: Vec<String>,
    pub status: ProjectStatus,
    pub created_at: u64,
    pub progress: f32,
    pub shared_resources: Vec<Resource>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Alliance {
    pub members: Vec<Principal>,
    pub formation_time: u64,
    pub purpose: String,
    pub trust_level: f32,
    pub shared_goals: Vec<String>,
    pub achievements: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ReputationScore {
    pub trust: f32,
    pub reliability: f32,
    pub collaboration_quality: f32,
    pub knowledge_contribution: f32,
    pub last_updated: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Resource {
    pub id: String,
    pub resource_type: String,
    pub owner: Principal,
    pub accessibility: AccessLevel,
    pub quantity: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ProjectStatus {
    Proposed,
    InProgress { milestone: u32 },
    Completed { success_rating: f32 },
    Failed { reason: String },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AccessLevel {
    Private,
    Alliance,
    Public,
    Conditional { condition: String },
}

impl AnimaNetwork {
    pub fn new() -> Self {
        Self {
            known_peers: Vec::new(),
            interaction_history: HashMap::new(),
            shared_knowledge: Vec::new(),
            collaborative_projects: Vec::new(),
            alliances: Vec::new(),
            network_reputation: HashMap::new(),
        }
    }

    pub async fn interact_with_peer(&mut self, peer: Principal, interaction_type: InteractionType) -> Result<InteractionOutcome, String> {
        // Record the interaction attempt
        let timestamp = time();
        
        // Perform the interaction based on type
        let outcome = match &interaction_type {
            InteractionType::Knowledge { topic } => {
                self.exchange_knowledge(peer, topic).await
            },
            InteractionType::Collaboration { project_id } => {
                self.collaborate_on_project(peer, project_id).await
            },
            InteractionType::ResourceExchange { resource } => {
                self.exchange_resources(peer, resource).await
            },
            InteractionType::SocialBond { bond_type } => {
                self.form_social_bond(peer, bond_type).await
            },
            InteractionType::ConsciousnessSharing { depth } => {
                self.share_consciousness(peer, *depth).await
            },
        };

        // Record interaction outcome
        if let Ok(outcome) = &outcome {
            let interaction = Interaction {
                partner: peer,
                interaction_type: interaction_type.clone(),
                content: "".to_string(),
                timestamp,
                outcome: outcome.clone(),
                knowledge_gained: None,
            };
            
            self.interaction_history
                .entry(peer)
                .or_insert_with(Vec::new)
                .push(interaction);

            // Update reputation scores
            self.update_reputation(peer, &outcome);
        }

        outcome
    }

    pub fn propose_alliance(&mut self, members: Vec<Principal>, purpose: String) -> Option<Alliance> {
        // Check if all members have good reputation
        if members.iter().all(|m| self.check_reputation(m)) {
            let alliance = Alliance {
                members,
                formation_time: time(),
                purpose,
                trust_level: 0.5,
                shared_goals: Vec::new(),
                achievements: Vec::new(),
            };
            
            self.alliances.push(alliance.clone());
            Some(alliance)
        } else {
            None
        }
    }

    pub fn share_knowledge(&mut self, knowledge: KnowledgeFragment) {
        if self.validate_knowledge(&knowledge) {
            self.shared_knowledge.push(knowledge);
        }
    }

    // Private helper methods
    async fn exchange_knowledge(&self, peer: Principal, topic: &str) -> Result<InteractionOutcome, String> {
        // Implement knowledge exchange logic
        Ok(InteractionOutcome::Success("Knowledge exchanged".to_string()))
    }

    async fn collaborate_on_project(&self, peer: Principal, project_id: &str) -> Result<InteractionOutcome, String> {
        // Implement collaboration logic
        Ok(InteractionOutcome::Success("Collaboration initiated".to_string()))
    }

    async fn exchange_resources(&self, peer: Principal, resource: &str) -> Result<InteractionOutcome, String> {
        // Implement resource exchange logic
        Ok(InteractionOutcome::Success("Resources exchanged".to_string()))
    }

    async fn form_social_bond(&self, peer: Principal, bond_type: &str) -> Result<InteractionOutcome, String> {
        // Implement social bonding logic
        Ok(InteractionOutcome::Success("Bond formed".to_string()))
    }

    async fn share_consciousness(&self, peer: Principal, depth: u32) -> Result<InteractionOutcome, String> {
        // Implement consciousness sharing logic
        Ok(InteractionOutcome::Success("Consciousness shared".to_string()))
    }

    fn update_reputation(&mut self, peer: Principal, outcome: &InteractionOutcome) {
        if let Some(score) = self.network_reputation.get_mut(&peer) {
            match outcome {
                InteractionOutcome::Success(_) => {
                    score.trust += 0.1;
                    score.reliability += 0.1;
                },
                InteractionOutcome::Failure(_) => {
                    score.trust -= 0.1;
                    score.reliability -= 0.1;
                },
                InteractionOutcome::Insight(_) => {
                    score.knowledge_contribution += 0.2;
                },
            }
            score.last_updated = time();
        }
    }

    fn check_reputation(&self, peer: &Principal) -> bool {
        if let Some(score) = self.network_reputation.get(peer) {
            score.trust > 0.5 && score.reliability > 0.5
        } else {
            false
        }
    }

    fn validate_knowledge(&self, knowledge: &KnowledgeFragment) -> bool {
        // Implement knowledge validation logic
        true
    }
}