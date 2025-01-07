use crate::quantum::QuantumState;
use candid::{CandidType, Deserialize};
use serde::Serialize;
use sha2::{Sha256, Digest};

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct QuantumMemory {
    pub resonance_value: f64,
    pub coherence_level: f64,
    pub stability_index: f64,
    pub timestamp: u64,
    pub context_hash: String,
}

fn hash_bytes(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    let result = hasher.finalize();
    hex::encode(result)
}

impl QuantumMemory {
    pub fn process_state(
        state: &QuantumState,
        context: &str,
    ) -> Self {
        let current_time = ic_cdk::api::time();
        let context_hash = hash_bytes(context.as_bytes());
        
        Self {
            resonance_value: state.dimensional_frequency,
            coherence_level: state.coherence,
            stability_index: state.stability_index,
            timestamp: current_time,
            context_hash,
        }
    }
    
    pub fn analyze_pattern(
        &self,
        resonance_pattern: &[f64],
    ) -> f64 {
        let base_resonance = resonance_pattern.iter().sum::<f64>() / resonance_pattern.len() as f64;
        let coherence_weight = 0.4;
        let stability_weight = 0.3;
        let resonance_weight = 0.3;
        
        (self.coherence_level * coherence_weight) +
        (self.stability_index * stability_weight) +
        (base_resonance * resonance_weight)
    }
    
    pub fn merge_memories(
        memories: &[QuantumMemory]
    ) -> Option<Self> {
        if memories.is_empty() {
            return None;
        }

        let total = memories.len() as f64;
        let avg_resonance = memories.iter().map(|m| m.resonance_value).sum::<f64>() / total;
        let avg_coherence = memories.iter().map(|m| m.coherence_level).sum::<f64>() / total;
        let avg_stability = memories.iter().map(|m| m.stability_index).sum::<f64>() / total;
        let latest_timestamp = memories.iter().map(|m| m.timestamp).max().unwrap_or_default();

        // Merge context hashes
        let combined = memories.iter()
            .map(|m| m.context_hash.as_bytes())
            .fold(Vec::new(), |mut acc, bytes| {
                acc.extend(bytes);
                acc
            });
        let merged_hash = hash_bytes(&combined);

        Some(Self {
            resonance_value: avg_resonance,
            coherence_level: avg_coherence,
            stability_index: avg_stability,
            timestamp: latest_timestamp,
            context_hash: merged_hash,
        })
    }
}