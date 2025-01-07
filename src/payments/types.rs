use candid::Principal;

#[derive(Debug, Clone)]
pub struct QuantumPaymentMetrics {
    pub coherence_level: f64,
    pub stability_index: f64,
    pub entanglement_factor: f64,
    pub last_sync: u64,
}

#[derive(Debug, Clone)]
pub enum PaymentStrategy {
    Standard,
    QuantumEnhanced,
    Neural
}

#[derive(Debug, Clone)]
pub struct TransactionResult {
    pub success: bool,
    pub tx_id: Option<String>,
    pub quantum_metrics: QuantumPaymentMetrics,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct WalletConfig {
    pub owner: Principal,
    pub quantum_threshold: f64,
    pub stability_threshold: f64,
    pub auto_stabilize: bool,
}

impl Default for QuantumPaymentMetrics {
    fn default() -> Self {
        Self {
            coherence_level: 1.0,
            stability_index: 1.0,
            entanglement_factor: 0.0,
            last_sync: ic_cdk::api::time(),
        }
    }
}

impl Default for WalletConfig {
    fn default() -> Self {
        Self {
            owner: Principal::anonymous(),
            quantum_threshold: 0.3,
            stability_threshold: 0.5,
            auto_stabilize: true,
        }
    }
}