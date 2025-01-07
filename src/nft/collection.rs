use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct CollectionMetadata {
    pub name: String,
    pub symbol: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub supply_cap: Option<u64>,
    pub creator: Option<Principal>,
    pub website: Option<String>,
    pub royalties: Option<u16>, // basis points (0-10000)
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct CollectionStats {
    pub total_supply: u64,
    pub unique_holders: u64,
    pub floor_price: Option<u64>,
    pub volume_24h: u64,
    pub royalties_earned: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct CollectionState {
    pub metadata: CollectionMetadata,
    pub stats: CollectionStats,
}

impl CollectionState {
    pub fn new(metadata: CollectionMetadata) -> Self {
        Self {
            metadata,
            stats: CollectionStats::default(),
        }
    }

    pub fn update_stats(&mut self, supply: u64, holders: u64, floor_price: Option<u64>, volume: u64) {
        self.stats.total_supply = supply;
        self.stats.unique_holders = holders;
        self.stats.floor_price = floor_price;
        self.stats.volume_24h = volume;
    }

    pub fn add_royalties(&mut self, amount: u64) {
        self.stats.royalties_earned += amount;
    }
}

pub struct CollectionConfig {
    pub name: String,
    pub symbol: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub supply_cap: Option<u64>,
    pub royalties: Option<u16>,
    pub website: Option<String>,
}