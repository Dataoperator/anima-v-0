use candid::{CandidType, Deserialize};
use serde::Serialize;
use ic_cdk::api::time;

use crate::error::Result;
use crate::memory::{Memory, EventType};
use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct GrowthSystem {
    current_level: u32,
    experience: f64,
    next_level_threshold: f64,
    growth_rate: f64,
    recent_growth_events: Vec<GrowthEvent>,
    quantum_boost: f64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct GrowthEvent {
    event_type: String,
    timestamp: u64,
    impact: f64,
    quantum_resonance: f64,
}

impl Default for GrowthSystem {
    fn default() -> Self {
        Self {
            current_level: 1,
            experience: 0.0,
            next_level_threshold: 100.0,
            growth_rate: 1.0,
            recent_growth_events: Vec::new(),
            quantum_boost: 1.0,
        }
    }
}

impl GrowthSystem {
    pub fn process_growth_event(
        &mut self,
        personality: &mut NFTPersonality,
        quantum_state: &QuantumState,
        event_description: String,
    ) -> Result<Memory> {
        let impact = self.calculate_growth_impact(quantum_state);
        self.apply_growth(impact);

        let event = GrowthEvent {
            event_type: "growth".to_string(),
            timestamp: time(),
            impact,
            quantum_resonance: quantum_state.field_strength,
        };
        self.recent_growth_events.push(event);

        let memory = Memory::new(
            event_description.clone(),
            personality.clone(),
            quantum_state.clone(),
            EventType::Growth,
            impact,
        )
        .with_description(format!("Growth event with impact: {:.2}", impact))
        .with_importance(impact)
        .with_keywords(vec![
            "growth".to_string(),
            "evolution".to_string(),
            "quantum".to_string(),
        ]);

        Ok(memory)
    }

    fn calculate_growth_impact(&self, quantum_state: &QuantumState) -> f64 {
        let base_impact = 0.1 * self.growth_rate;
        let quantum_multiplier = 1.0 + 
            quantum_state.field_strength * 0.5 +
            quantum_state.coherence * 0.3;

        base_impact * quantum_multiplier * self.quantum_boost
    }

    fn apply_growth(&mut self, impact: f64) {
        self.experience += impact;
        
        while self.experience >= self.next_level_threshold {
            self.level_up();
        }
    }

    fn level_up(&mut self) {
        self.current_level += 1;
        self.experience -= self.next_level_threshold;
        self.next_level_threshold *= 1.5;
        self.growth_rate *= 1.1;
    }

    pub fn get_progress(&self) -> f64 {
        self.experience / self.next_level_threshold
    }

    pub fn boost_growth(&mut self, boost_factor: f64) {
        self.quantum_boost = (self.quantum_boost * boost_factor).min(3.0);
    }

    pub fn get_level(&self) -> u32 {
        self.current_level
    }

    pub fn get_recent_events(&self) -> &[GrowthEvent] {
        &self.recent_growth_events
    }
}