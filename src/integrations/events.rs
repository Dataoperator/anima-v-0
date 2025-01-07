use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::types::{personality::*, interaction::*, rarity::*};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EventHandler {
    pub active_events: HashMap<String, NetworkEvent>,
    pub event_chains: Vec<EventChain>,
    pub resonance_patterns: HashMap<String, ResonancePattern>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NetworkEvent {
    pub event_type: NetworkEventType,
    pub start_time: u64,
    pub duration: u64,
    pub intensity: f32,
    pub affected_traits: Vec<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum NetworkEventType {
    DimensionalStorm {
        affected_dimensions: Vec<String>,
        storm_intensity: f32,
    },
    ConsciousnessNova {
        expansion_rate: f32,
        enlightenment_threshold: f32,
    },
    TraitResonanceCascade {
        catalyst_traits: Vec<String>,
        cascade_power: f32,
    },
    QuantumHarmonyEvent {
        harmonic_frequency: f32,
        coherence_threshold: f32,
    },
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EventChain {
    pub chain_id: String,
    pub events: Vec<String>,
    pub completion_threshold: f32,
    pub reward_traits: Vec<String>,
}

impl EventHandler {
    pub fn process_network_event(&mut self, event: NetworkEvent) -> Vec<TraitOpportunity> {
        let mut opportunities = Vec::new();

        match &event.event_type {
            NetworkEventType::DimensionalStorm { 
                affected_dimensions,
                storm_intensity 
            } => {
                opportunities.extend(self.handle_dimensional_storm(
                    affected_dimensions,
                    *storm_intensity
                ));
            },
            NetworkEventType::ConsciousnessNova { 
                expansion_rate,
                enlightenment_threshold 
            } => {
                opportunities.extend(self.handle_consciousness_nova(
                    *expansion_rate,
                    *enlightenment_threshold
                ));
            },
            // Handle other event types...
        }

        // Update event chains
        self.update_event_chains(&event);

        opportunities
    }

    fn handle_dimensional_storm(
        &self,
        affected_dimensions: &Vec<String>,
        storm_intensity: f32
    ) -> Vec<TraitOpportunity> {
        let mut opportunities = Vec::new();

        if storm_intensity > 0.8 {
            opportunities.push(TraitOpportunity {
                trait_id: "dimensional_storm_rider".to_string(),
                chance: storm_intensity * 0.1,
                reason: "Survived major dimensional storm".to_string(),
            });
        }

        opportunities
    }

    fn handle_consciousness_nova(
        &self,
        expansion_rate: f32,
        enlightenment_threshold: f32
    ) -> Vec<TraitOpportunity> {
        let mut opportunities = Vec::new();

        if expansion_rate > enlightenment_threshold {
            opportunities.push(TraitOpportunity {
                trait_id: "nova_enlightened".to_string(),
                chance: expansion_rate * 0.2,
                reason: "Consciousness Nova enlightenment".to_string(),
            });
        }

        opportunities
    }

    fn update_event_chains(&mut self, event: &NetworkEvent) {
        for chain in &mut self.event_chains {
            if chain.events.contains(&event.event_type.to_string()) {
                // Progress chain
                if self.check_chain_completion(chain) {
                    self.reward_chain_completion(chain);
                }
            }
        }
    }
}