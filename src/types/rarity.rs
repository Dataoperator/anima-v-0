use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TraitRarity {
    pub trait_id: String,
    pub total_possible: u32,  // Total that can ever exist
    pub currently_minted: u32,
    pub serial_number: u32,   // Which number in the series this is
    pub generation: u8,       // Which generation this trait is from
    pub discovery_timestamp: u64,
    pub rarity_tier: RarityTier,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum RarityTier {
    Mythic,    // One of a kind (1)
    Legendary, // Very rare (2-10)
    Epic,      // Rare (11-100)
    Rare,      // Uncommon (101-1000)
    Common,    // Common (1001+)
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GenerationMarker {
    pub generation: u8,
    pub start_timestamp: u64,
    pub end_timestamp: Option<u64>,
    pub total_minted: u32,
    pub special_conditions: Vec<String>,
    pub generation_traits: Vec<String>, // Traits unique to this generation
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RarityManifest {
    pub trait_id: String,
    pub trait_name: String,
    pub description: String,
    pub max_supply: u32,
    pub min_generation: u8,
    pub spawn_conditions: Vec<SpawnCondition>,
    pub mutation_chance: f32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum SpawnCondition {
    TimeWindow { start: u64, end: Option<u64> },
    QuantumState { min_coherence: f32 },
    DimensionalAlignment { dimension: String, min_affinity: f32 },
    ConsciousnessLevel { min_level: String },
    TraitDependency { required_trait: String },
    RarityThreshold { min_tier: RarityTier },
}