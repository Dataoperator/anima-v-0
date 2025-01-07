use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use crate::types::{NFTPersonality, Memory, AnimaState};
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ExternalIntegration {
    pub id: String,
    pub integration_type: IntegrationType,
    pub status: IntegrationStatus,
    pub last_sync: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum IntegrationType {
    OpenAI,
    ICRC,
    Entrepot,
    Custom(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum IntegrationStatus {
    Active,
    Inactive,
    Failed,
    Pending,
}

impl ExternalIntegration {
    pub fn new(id: String, integration_type: IntegrationType) -> Self {
        Self {
            id,
            integration_type,
            status: IntegrationStatus::Pending,
            last_sync: time(),
        }
    }

    pub fn update_status(&mut self, status: IntegrationStatus) {
        self.status = status;
        self.last_sync = time();
    }
}