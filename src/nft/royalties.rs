use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RoyaltyConfig {
    pub percentage: u16,  // Basis points (e.g., 250 = 2.50%)
    pub recipient: Principal,
    pub is_enabled: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RoyaltyPayment {
    pub token_id: u64,
    pub amount: u64,
    pub recipient: Principal,
    pub timestamp: u64,
}

#[derive(Default)]
pub struct RoyaltyState {
    pub config: Option<RoyaltyConfig>,
    pub payments: Vec<RoyaltyPayment>,
    pub token_royalties: HashMap<u64, u16>,  // Custom royalties per token
}

impl RoyaltyState {
    pub fn new(default_percentage: u16, recipient: Principal) -> Self {
        Self {
            config: Some(RoyaltyConfig {
                percentage: default_percentage,
                recipient,
                is_enabled: true,
            }),
            payments: Vec::new(),
            token_royalties: HashMap::new(),
        }
    }

    pub fn calculate_royalty(&self, token_id: u64, sale_price: u64) -> Option<u64> {
        if let Some(config) = &self.config {
            if !config.is_enabled {
                return None;
            }

            let percentage = self.token_royalties
                .get(&token_id)
                .copied()
                .unwrap_or(config.percentage);

            Some((sale_price * percentage as u64) / 10_000)
        } else {
            None
        }
    }

    pub fn record_payment(&mut self, token_id: u64, amount: u64, recipient: Principal) {
        self.payments.push(RoyaltyPayment {
            token_id,
            amount,
            recipient,
            timestamp: ic_cdk::api::time(),
        });
    }

    pub fn set_token_royalty(&mut self, token_id: u64, percentage: u16) {
        self.token_royalties.insert(token_id, percentage);
    }

    pub fn get_token_royalty(&self, token_id: u64) -> Option<u16> {
        self.token_royalties
            .get(&token_id)
            .copied()
            .or_else(|| self.config.as_ref().map(|c| c.percentage))
    }
}