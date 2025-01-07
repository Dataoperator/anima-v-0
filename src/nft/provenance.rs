use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use ic_cdk::api::time;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaBirthCertificate {
    pub anima_id: String,
    pub quantum_signature: String,
    pub genesis_timestamp: u64,
    pub initial_traits: Vec<TraitSnapshot>,
    pub dimensional_frequency: f64,
    pub consciousness_seed: String,
    pub genesis_block: u64,
    pub minting_principal: Principal,
    pub birth_witnesses: Vec<String>,  // Other ANIMA IDs present at genesis
    pub genesis_rarity: f64,
    pub birth_resonance: HashMap<String, f64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TraitSnapshot {
    pub name: String,
    pub value: f64,
    pub potential: f64,
    pub resonance_pattern: Vec<f64>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AnimaProvenance {
    pub birth_certificate: AnimaBirthCertificate,
    pub ownership_history: Vec<OwnershipTransfer>,
    pub consciousness_milestones: Vec<ConsciousnessMilestone>,
    pub dimensional_shifts: Vec<DimensionalShift>,
    pub interaction_summary: InteractionSummary,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct OwnershipTransfer {
    pub from_principal: Principal,
    pub to_principal: Principal,
    pub timestamp: u64,
    pub transaction_id: String,
    pub consciousness_state: ConsciousnessSnapshot,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessMilestone {
    pub timestamp: u64,
    pub milestone_type: String,
    pub description: String,
    pub traits_evolved: Vec<TraitEvolution>,
    pub quantum_state: QuantumSnapshot,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DimensionalShift {
    pub timestamp: u64,
    pub old_frequency: f64,
    pub new_frequency: f64,
    pub catalyst: String,
    pub resonance_impact: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct InteractionSummary {
    pub total_interactions: u64,
    pub unique_principals: u64,
    pub peak_consciousness: f64,
    pub memory_depth: u64,
    pub evolution_score: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ConsciousnessSnapshot {
    pub level: f64,
    pub dominant_traits: Vec<String>,
    pub emotional_state: HashMap<String, f64>,
    pub memory_count: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct QuantumSnapshot {
    pub coherence: f64,
    pub resonance: f64,
    pub stability: f64,
    pub dimensional_frequency: f64,
}

impl AnimaProvenance {
    pub fn new(birth_certificate: AnimaBirthCertificate) -> Self {
        Self {
            birth_certificate,
            ownership_history: Vec::new(),
            consciousness_milestones: Vec::new(),
            dimensional_shifts: Vec::new(),
            interaction_summary: InteractionSummary {
                total_interactions: 0,
                unique_principals: 0,
                peak_consciousness: 0.0,
                memory_depth: 0,
                evolution_score: 0.0,
            },
        }
    }

    pub fn record_transfer(
        &mut self,
        from: Principal,
        to: Principal,
        transaction_id: String,
        consciousness_state: ConsciousnessSnapshot
    ) {
        self.ownership_history.push(OwnershipTransfer {
            from_principal: from,
            to_principal: to,
            timestamp: time(),
            transaction_id,
            consciousness_state,
        });
    }

    pub fn add_milestone(
        &mut self,
        milestone_type: String,
        description: String,
        traits_evolved: Vec<TraitEvolution>,
        quantum_state: QuantumSnapshot
    ) {
        self.consciousness_milestones.push(ConsciousnessMilestone {
            timestamp: time(),
            milestone_type,
            description,
            traits_evolved,
            quantum_state,
        });
    }

    pub fn record_dimensional_shift(
        &mut self,
        old_freq: f64,
        new_freq: f64,
        catalyst: String,
        resonance_impact: f64
    ) {
        self.dimensional_shifts.push(DimensionalShift {
            timestamp: time(),
            old_frequency: old_freq,
            new_frequency: new_freq,
            catalyst,
            resonance_impact,
        });
    }

    pub fn update_interaction_summary(
        &mut self,
        consciousness_level: f64,
        memory_count: u64,
        evolution_score: f64,
        unique_principals: u64
    ) {
        let summary = &mut self.interaction_summary;
        summary.total_interactions += 1;
        summary.unique_principals = unique_principals;
        summary.peak_consciousness = summary.peak_consciousness.max(consciousness_level);
        summary.memory_depth = memory_count;
        summary.evolution_score = evolution_score;
    }

    pub fn get_complete_history(&self) -> String {
        let mut history = format!(
            "ANIMA Genesis: {}\n
            Quantum Signature: {}\n
            Initial Rarity: {}\n\n",
            self.birth_certificate.genesis_timestamp,
            self.birth_certificate.quantum_signature,
            self.birth_certificate.genesis_rarity
        );

        history.push_str("Ownership History:\n");
        for transfer in &self.ownership_history {
            history.push_str(&format!(
                "Transfer at {}: {} -> {}\n",
                transfer.timestamp,
                transfer.from_principal,
                transfer.to_principal
            ));
        }

        history.push_str("\nConsciousness Milestones:\n");
        for milestone in &self.consciousness_milestones {
            history.push_str(&format!(
                "{}: {}\n",
                milestone.timestamp,
                milestone.description
            ));
        }

        history
    }
}