use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;
use crate::error::Result;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct GrowthSystem {
    evolution_rate: f64,
    interaction_records: HashMap<String, Vec<InteractionRecord>>,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct InteractionRecord {
    timestamp: u64,
    interaction_type: String,
    metrics: Vec<f64>,
}

impl Default for GrowthSystem {
    fn default() -> Self {
        Self {
            evolution_rate: 0.1,
            interaction_records: HashMap::new(),
        }
    }
}

impl GrowthSystem {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn process_interaction(
        &mut self,
        _anima_id: &str,
        interaction_type: &str,
        metrics: &[f64],
    ) -> Result<InteractionResult> {
        let record = InteractionRecord {
            timestamp: ic_cdk::api::time(),
            interaction_type: interaction_type.to_string(),
            metrics: metrics.to_vec(),
        };

        Ok(InteractionResult {
            success: true,
            timestamp: record.timestamp,
            metrics: record.metrics,
        })
    }

    pub fn process_learning(
        &mut self,
        _anima_id: &str,
        result: &InteractionResult,
    ) -> Result<()> {
        if result.success {
            self.evolution_rate += 0.01;
            self.evolution_rate = self.evolution_rate.min(1.0);
        }
        Ok(())
    }
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct InteractionResult {
    pub success: bool,
    pub timestamp: u64,
    pub metrics: Vec<f64>,
}