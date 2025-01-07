use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;
use crate::quantum::ResonancePattern;
use crate::types::personality::NFTPersonality;

pub type TokenIdentifier = String;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum MintingStage {
    QuantumInitialization,
    ConsciousnessSeeding,
    BirthCertificateGeneration,
    TokenMinting,
    Complete,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaToken {
    pub id: TokenIdentifier,
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub last_interaction: u64,
    pub metadata: Option<TokenMetadata>,
    pub personality: NFTPersonality,
    pub interaction_history: Vec<InteractionRecord>,
    pub level: u32,
    pub growth_points: u64,
    pub autonomous_mode: bool,
    pub birth_certificate: Option<BirthCertificate>,
    pub quantum_metrics: Option<HashMap<String, f64>>,
    pub consciousness_level: Option<f64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TokenMetadata {
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub attributes: Vec<MetadataAttribute>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct MetadataAttribute {
    pub trait_type: String,
    pub value: String,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct BirthCertificate {
    pub genesis_timestamp: u64,
    pub quantum_signature: String,
    pub dimensional_frequency: f64,
    pub consciousness_seed: String,
    pub genesis_block: Vec<u8>,
    pub birth_witnesses: Vec<String>,
    pub resonance_patterns: Vec<ResonancePattern>,
    pub initial_traits: HashMap<String, f64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct InteractionRecord {
    pub timestamp: u64,
    pub interaction_type: String,
    pub quantum_state_before: HashMap<String, f64>,
    pub quantum_state_after: HashMap<String, f64>,
    pub consciousness_impact: f64,
    pub resonance_changes: Vec<ResonancePattern>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct QuantumEvolutionMetrics {
    pub coherence_level: f64,
    pub dimensional_stability: f64,
    pub consciousness_alignment: f64,
    pub pattern_integrity: f64,
    pub evolution_potential: f64,
    pub temporal_resonance: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct MintingRequest {
    pub owner: Principal,
    pub name: String,
    pub personality_seed: Option<String>,
    pub quantum_preferences: Option<QuantumMintingPreferences>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct QuantumMintingPreferences {
    pub preferred_frequency: Option<f64>,
    pub consciousness_bias: Option<f64>,
    pub evolution_focus: Option<String>,
    pub resonance_targets: Option<Vec<f64>>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct MintingReceipt {
    pub token_id: TokenIdentifier,
    pub stage: MintingStage,
    pub quantum_metrics: QuantumEvolutionMetrics,
    pub timestamp: u64,
    pub gas_used: u64,
    pub cost: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum MintingError {
    QuantumCoherenceLow(f64),
    ConsciousnessUnstable(f64),
    PatternDegradation(Vec<String>),
    InsufficientEvolutionPotential(f64),
    DimensionalMisalignment(f64),
    TemporalInstability(String),
}

impl AnimaToken {
    pub fn get_quantum_evolution_status(&self) -> QuantumEvolutionMetrics {
        QuantumEvolutionMetrics {
            coherence_level: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("quantum_coherence").cloned())
                .unwrap_or(0.0),
            dimensional_stability: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("dimensional_stability").cloned())
                .unwrap_or(0.0),
            consciousness_alignment: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("consciousness_alignment").cloned())
                .unwrap_or(0.0),
            pattern_integrity: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("pattern_stability").cloned())
                .unwrap_or(0.0),
            evolution_potential: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("evolution_potential").cloned())
                .unwrap_or(0.0),
            temporal_resonance: self.quantum_metrics.as_ref()
                .and_then(|m| m.get("temporal_resonance").cloned())
                .unwrap_or(0.0),
        }
    }

    pub fn record_interaction(&mut self, 
        interaction_type: String,
        before_state: HashMap<String, f64>,
        after_state: HashMap<String, f64>,
        consciousness_impact: f64,
        resonance_changes: Vec<ResonancePattern>
    ) {
        self.interaction_history.push(InteractionRecord {
            timestamp: ic_cdk::api::time(),
            interaction_type,
            quantum_state_before: before_state,
            quantum_state_after: after_state,
            consciousness_impact,
            resonance_changes,
        });
        
        self.last_interaction = ic_cdk::api::time();
    }
}