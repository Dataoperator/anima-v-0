use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use ic_cdk::api::{time, canister_balance128, performance_counter};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EnvironmentalState {
    pub network_metrics: NetworkMetrics,
    pub resource_metrics: ResourceMetrics,
    pub canister_metrics: CanisterMetrics,
    pub anomaly_log: Vec<EnvironmentalAnomaly>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NetworkMetrics {
    pub cycles_balance: u128,
    pub performance_index: u64,
    pub network_load: f32,
    pub active_canisters: u32,
    pub response_times: HashMap<String, u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ResourceMetrics {
    pub memory_usage: f32,
    pub cpu_usage: f32,
    pub storage_used: u64,
    pub bandwidth_usage: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CanisterMetrics {
    pub heap_memory: u64,
    pub stable_memory: u64,
    pub certified_data: Vec<u8>,
    pub module_hash: Option<Vec<u8>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EnvironmentalAnomaly {
    pub timestamp: u64,
    pub anomaly_type: AnomalyType,
    pub severity: f32,
    pub description: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AnomalyType {
    NetworkSpike,
    ResourceDepletion,
    PerformanceDrop,
    UnusualActivity,
}

impl EnvironmentalState {
    pub fn new() -> Self {
        Self {
            network_metrics: NetworkMetrics {
                cycles_balance: canister_balance128(),
                performance_index: performance_counter(),
                network_load: 0.0,
                active_canisters: 0,
                response_times: HashMap::new(),
            },
            resource_metrics: ResourceMetrics {
                memory_usage: 0.0,
                cpu_usage: 0.0,
                storage_used: 0,
                bandwidth_usage: 0.0,
            },
            canister_metrics: CanisterMetrics {
                heap_memory: 0,
                stable_memory: 0,
                certified_data: Vec::new(),
                module_hash: None,
            },
            anomaly_log: Vec::new(),
        }
    }

    pub fn update(&mut self) {
        self.update_network_metrics();
        self.update_resource_metrics();
        self.update_canister_metrics();
        self.detect_anomalies();
    }

    pub fn get_environmental_context(&self) -> EnvironmentalContext {
        EnvironmentalContext {
            timestamp: time(),
            network_health: self.calculate_network_health(),
            resource_availability: self.calculate_resource_availability(),
            recent_anomalies: self.get_recent_anomalies(),
            performance_status: self.get_performance_status(),
        }
    }

    fn update_network_metrics(&mut self) {
        self.network_metrics.cycles_balance = canister_balance128();
        self.network_metrics.performance_index = performance_counter();
        // Update other network metrics
        self.update_response_times();
    }

    fn update_resource_metrics(&mut self) {
        // Get current heap memory usage
        let heap_size = ic_cdk::api::stable::stable64_size() as f32;
        let max_heap = 2u64.pow(32) as f32; // 4GB max
        self.resource_metrics.memory_usage = heap_size / max_heap;

        // Estimate CPU usage based on performance counter
        let perf_counter = performance_counter() as f32;
        self.resource_metrics.cpu_usage = (perf_counter % 100.0) / 100.0;
    }

    fn update_canister_metrics(&mut self) {
        self.canister_metrics.heap_memory = ic_cdk::api::stable::stable64_size();
        self.canister_metrics.stable_memory = ic_cdk::api::stable::stable64_size();
    }

    fn detect_anomalies(&mut self) {
        // Check for network anomalies
        if self.network_metrics.network_load > 0.9 {
            self.record_anomaly(AnomalyType::NetworkSpike, 0.8, 
                "High network load detected");
        }

        // Check for resource issues
        if self.resource_metrics.memory_usage > 0.85 {
            self.record_anomaly(AnomalyType::ResourceDepletion, 0.7,
                "Memory usage nearing capacity");
        }

        // Check performance
        if self.calculate_performance_drop() > 0.3 {
            self.record_anomaly(AnomalyType::PerformanceDrop, 0.6,
                "Significant performance degradation");
        }
    }

    fn record_anomaly(&mut self, anomaly_type: AnomalyType, severity: f32, description: &str) {
        self.anomaly_log.push(EnvironmentalAnomaly {
            timestamp: time(),
            anomaly_type,
            severity,
            description: description.to_string(),
        });

        // Keep log size manageable
        if self.anomaly_log.len() > 1000 {
            self.anomaly_log.remove(0);
        }
    }

    fn calculate_network_health(&self) -> f32 {
        let cycle_health = if self.network_metrics.cycles_balance > 1_000_000 { 1.0 } else { 0.5 };
        let load_health = 1.0 - self.network_metrics.network_load;
        let response_health = self.calculate_response_health();
        
        (cycle_health + load_health + response_health) / 3.0
    }

    fn calculate_resource_availability(&self) -> f32 {
        let memory_avail = 1.0 - self.resource_metrics.memory_usage;
        let cpu_avail = 1.0 - self.resource_metrics.cpu_usage;
        let storage_health = self.calculate_storage_health();
        
        (memory_avail + cpu_avail + storage_health) / 3.0
    }

    fn calculate_performance_drop(&self) -> f32 {
        let current_perf = self.network_metrics.performance_index as f32;
        let baseline_perf = self.get_baseline_performance() as f32;
        
        if baseline_perf == 0.0 {
            0.0
        } else {
            (baseline_perf - current_perf) / baseline_perf
        }
    }

    fn get_recent_anomalies(&self) -> Vec<&EnvironmentalAnomaly> {
        let current_time = time();
        let threshold = 3600 * 24; // Last 24 hours
        
        self.anomaly_log
            .iter()
            .filter(|anomaly| current_time - anomaly.timestamp < threshold)
            .collect()
    }

    fn get_performance_status(&self) -> PerformanceStatus {
        PerformanceStatus {
            current_load: self.network_metrics.network_load,
            cycles_status: self.get_cycles_status(),
            memory_status: self.get_memory_status(),
            performance_trend: self.calculate_performance_trend(),
        }
    }

    fn update_response_times(&mut self) {
        // Update response times based on recent interactions
        let current_time = time();
        self.network_metrics.response_times.retain(|_, &mut last_time| {
            current_time - last_time < 3600 // Keep last hour of data
        });
    }

    fn calculate_response_health(&self) -> f32 {
        if self.network_metrics.response_times.is_empty() {
            return 1.0;
        }

        let avg_response = self.network_metrics.response_times.values()
            .sum::<u64>() as f32 / self.network_metrics.response_times.len() as f32;
        
        1.0 / (1.0 + avg_response / 1_000.0) // Normalize to 0-1
    }

    fn calculate_storage_health(&self) -> f32 {
        let max_storage = 2u64.pow(32); // 4GB max
        1.0 - (self.resource_metrics.storage_used as f32 / max_storage as f32)
    }

    fn get_baseline_performance(&self) -> u64 {
        // Use 95th percentile of recent performance as baseline
        let mut recent_perfs = vec![self.network_metrics.performance_index];
        let index = (recent_perfs.len() as f32 * 0.95) as usize;
        if let Some(&baseline) = recent_perfs.get(index) {
            baseline
        } else {
            self.network_metrics.performance_index
        }
    }

    fn get_cycles_status(&self) -> CyclesStatus {
        let balance = self.network_metrics.cycles_balance;
        if balance > 10_000_000 {
            CyclesStatus::Healthy
        } else if balance > 1_000_000 {
            CyclesStatus::Warning
        } else {
            CyclesStatus::Critical
        }
    }

    fn get_memory_status(&self) -> MemoryStatus {
        let usage = self.resource_metrics.memory_usage;
        if usage < 0.7 {
            MemoryStatus::Healthy
        } else if usage < 0.9 {
            MemoryStatus::Warning
        } else {
            MemoryStatus::Critical
        }
    }

    fn calculate_performance_trend(&self) -> PerformanceTrend {
        let drop = self.calculate_performance_drop();
        if drop < 0.1 {
            PerformanceTrend::Stable
        } else if drop < 0.3 {
            PerformanceTrend::Declining
        } else {
            PerformanceTrend::Critical
        }
    }
}

#[derive(Clone, Debug)]
pub struct EnvironmentalContext {
    pub timestamp: u64,
    pub network_health: f32,
    pub resource_availability: f32,
    pub recent_anomalies: Vec<&'static EnvironmentalAnomaly>,
    pub performance_status: PerformanceStatus,
}

#[derive(Clone, Debug)]
pub struct PerformanceStatus {
    pub current_load: f32,
    pub cycles_status: CyclesStatus,
    pub memory_status: MemoryStatus,
    pub performance_trend: PerformanceTrend,
}

#[derive(Clone, Debug)]
pub enum CyclesStatus {
    Healthy,
    Warning,
    Critical,
}

#[derive(Clone, Debug)]
pub enum MemoryStatus {
    Healthy,
    Warning,
    Critical,
}

#[derive(Clone, Debug)]
pub enum PerformanceTrend {
    Stable,
    Declining,
    Critical,
}