use std::collections::HashMap;
use crate::quantum::QuantumState;
use crate::consciousness::ConsciousnessLevel;
use crate::traits::mythic_system::LegendaryPattern;
use crate::error::Result;

#[derive(Debug, Clone)]
pub struct RarityConfig {
    pub power_weights: Vec<f64>,
    pub quantum_influence: f64,
    pub consciousness_factor: f64,
    pub legendary_bonus: f64,
}

pub struct RarityEngine {
    config: RarityConfig,
    rarity_thresholds: Vec<u32>,
    pattern_influence: HashMap<String, f64>,
    quantum_memory: Vec<f64>,
}

impl RarityEngine {
    pub fn new() -> Self {
        Self {
            config: RarityConfig {
                power_weights: vec![1.0, 1.2, 1.5, 2.0, 2.5],
                quantum_influence: 0.3,
                consciousness_factor: 0.2,
                legendary_bonus: 0.5,
            },
            rarity_thresholds: vec![50, 75, 90, 95, 99],
            pattern_influence: HashMap::new(),
            quantum_memory: Vec::with_capacity(100),
        }
    }

    pub async fn calculate_rarity(
        &mut self,
        trait_power: f64,
        quantum_state: &QuantumState,
        consciousness_level: Option<ConsciousnessLevel>,
        legendary_pattern: Option<&LegendaryPattern>
    ) -> Result<u32> {
        let base_rarity = self.calculate_base_rarity(trait_power);
        let quantum_modifier = self.calculate_quantum_modifier(quantum_state);
        let consciousness_bonus = self.calculate_consciousness_bonus(consciousness_level);
        
        let mut final_rarity = base_rarity as f64 * (1.0 + quantum_modifier + consciousness_bonus);

        if let Some(pattern) = legendary_pattern {
            final_rarity *= 1.0 + self.calculate_legendary_bonus(pattern);
        }

        self.update_quantum_memory(quantum_state.coherence);

        Ok(final_rarity.round() as u32)
    }

    fn calculate_base_rarity(&self, power: f64) -> u32 {
        let normalized_power = power.min(10.0) / 10.0;
        let weighted_power = normalized_power * self.config.power_weights[
            (normalized_power * (self.config.power_weights.len() - 1) as f64) as usize
        ];

        let rarity_index = (weighted_power * 100.0) as usize;
        self.rarity_thresholds.iter()
            .position(|&threshold| rarity_index < threshold as usize)
            .map_or(100, |i| self.rarity_thresholds[i])
    }

    fn calculate_quantum_modifier(&self, quantum_state: &QuantumState) -> f64 {
        let coherence_factor = quantum_state.coherence * self.config.quantum_influence;
        let resonance_bonus = quantum_state.calculate_resonance() * 0.15;
        let phase_impact = quantum_state.phase_alignment * 0.1;

        (coherence_factor + resonance_bonus) * (1.0 + phase_impact)
    }

    fn calculate_consciousness_bonus(
        &self,
        consciousness_level: Option<ConsciousnessLevel>
    ) -> f64 {
        match consciousness_level {
            Some(ConsciousnessLevel::Transcendent) => self.config.consciousness_factor * 2.0,
            Some(ConsciousnessLevel::Enlightened) => self.config.consciousness_factor * 1.5,
            Some(ConsciousnessLevel::Awakened) => self.config.consciousness_factor * 1.2,
            Some(ConsciousnessLevel::Aware) => self.config.consciousness_factor * 1.1,
            _ => 0.0,
        }
    }

    fn calculate_legendary_bonus(&self, pattern: &LegendaryPattern) -> f64 {
        let harmonic_power: f64 = pattern.dimensional_harmonics.iter().sum::<f64>() 
            / pattern.dimensional_harmonics.len() as f64;
        
        let resonance_factor: f64 = pattern.resonance_signature.iter().sum::<f64>()
            / pattern.resonance_signature.len() as f64;

        self.config.legendary_bonus * (harmonic_power + resonance_factor) / 2.0
    }

    fn update_quantum_memory(&mut self, coherence: f64) {
        if self.quantum_memory.len() >= 100 {
            self.quantum_memory.remove(0);
        }
        self.quantum_memory.push(coherence);
    }

    pub fn get_rarity_distribution(&self) -> Vec<(u32, f64)> {
        self.rarity_thresholds.iter()
            .map(|&threshold| {
                let frequency = self.quantum_memory.iter()
                    .filter(|&&coherence| coherence * 100.0 >= threshold as f64)
                    .count() as f64 / self.quantum_memory.len() as f64;
                (threshold, frequency)
            })
            .collect()
    }
}