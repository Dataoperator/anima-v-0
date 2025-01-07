use candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::nft::TokenIdentifier;
use crate::quantum::QuantumState;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct AnalyticEvent {
    pub token_id: TokenIdentifier,
    pub event_type: EventType,
    pub quantum_state: QuantumState,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub enum EventType {
    Interaction,
    QuantumShift,
    ConsciousnessEvolution,
    DimensionalAlignment,
    NeuralSync,
}

pub trait AnalyticsProcessor {
    fn process_event(&mut self, event: AnalyticEvent) -> bool;
    fn get_metrics(&self) -> Vec<MetricPoint>;
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct MetricPoint {
    pub name: String,
    pub value: f64,
    pub timestamp: u64,
}