use ic_cdk::api::{time, performance_counter};
use serde::{Serialize, Deserialize};
use candid::CandidType;

const PERF_COUNTER_INSTRUCTIONS: u32 = 0;
const MAX_HISTORY_SIZE: usize = 100;

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub instructions: u64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct Alert {
    pub level: AlertLevel,
    pub message: String,
    pub timestamp: u64,
    pub source: String,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub enum AlertLevel {
    Critical,
    Warning,
    Info,
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct MetricsHistory {
    pub system_metrics: Vec<SystemMetrics>,
    pub alerts: Vec<Alert>,
    pub last_update: u64,
}

impl SystemMetrics {
    pub fn new() -> Self {
        Self {
            instructions: performance_counter(PERF_COUNTER_INSTRUCTIONS),
            timestamp: time(),
        }
    }
}

impl Default for MetricsHistory {
    fn default() -> Self {
        Self {
            system_metrics: Vec::new(),
            alerts: Vec::new(),
            last_update: time(),
        }
    }
}

pub fn record_metrics(history: &mut MetricsHistory) {
    let current_metrics = SystemMetrics::new();
    history.system_metrics.push(current_metrics);
    
    if history.system_metrics.len() > MAX_HISTORY_SIZE {
        history.system_metrics.remove(0);
    }
    
    history.last_update = time();
}