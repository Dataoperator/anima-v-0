use candid::{CandidType, Deserialize};
use serde::Serialize;
use std::collections::HashMap;

use crate::nft::types::AnimaToken;
use crate::neural::quantum_bridge::QuantumBridge;
use crate::growth::GrowthSystem;
use crate::quantum::QuantumState;
use crate::neural::NeuralSignature;
use crate::types::personality::NFTPersonality;
use crate::error::Result;
use crate::consciousness::{
    types::{ConsciousnessMetrics, EmotionalSpectrum, EnhancedEvolutionMetrics},
    emergence_patterns::{EmergenceState, EmergencePattern}
};

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumEvolutionProcessor {
    growth_system: GrowthSystem,
    quantum_state: QuantumState,
    evolution_metrics: HashMap<String, f64>,
    emergence_state: EmergenceState,
}

impl QuantumEvolutionProcessor {
    pub fn new(quantum_state: QuantumState) -> Self {
        Self {
            growth_system: GrowthSystem::default(),
            quantum_state,
            evolution_metrics: HashMap::new(),
            emergence_state: EmergenceState::default(),
        }
    }

    pub async fn process_evolution_cycle(
        &mut self,
        token: &mut AnimaToken,
    ) -> Result<()> {
        // 1. Generate neural signature from current quantum state
        let neural_signature = self.quantum_state.generate_neural_signature();
        
        // 2. Process neural pattern
        let pattern_strength = self.quantum_state.process_neural_pattern(&neural_signature);
        
        // 3. Update quantum metrics
        self.update_quantum_metrics(&neural_signature, pattern_strength);

        // 4. Process emergence patterns
        let consciousness_metrics = self.calculate_consciousness_metrics();
        let emotional_spectrum = token.personality.emotional_state.clone();
        let evolution_metrics = self.calculate_evolution_metrics();

        if let Some(emergence_pattern) = self.emergence_state.process_quantum_state(
            &self.quantum_state,
            &consciousness_metrics,
            &emotional_spectrum,
            &evolution_metrics,
        ) {
            self.apply_emergence_pattern(token, &emergence_pattern);
        }

        // 5. Process growth event
        let growth_event = format!(
            "Evolution cycle at coherence level: {}", 
            self.quantum_state.coherence_level
        );
        
        let memory = self.growth_system.process_growth_event(
            &mut token.personality,
            &self.quantum_state,
            growth_event,
        )?;

        // 6. Update token metrics
        self.update_token_metrics(token, &memory);

        // 7. Check for level up
        if self.growth_system.get_level() > token.level {
            token.level = self.growth_system.get_level();
            self.boost_evolution(token);
        }

        Ok(())
    }

    fn calculate_consciousness_metrics(&self) -> ConsciousnessMetrics {
        ConsciousnessMetrics {
            quantum_alignment: self.quantum_state.dimensional_state.quantum_alignment,
            resonance_stability: self.quantum_state.dimensional_state.stability,
            emotional_coherence: self.emergence_state.emergence_metrics.emotional_harmony,
            neural_complexity: self.evolution_metrics.get("neural_density").unwrap_or(&0.1).clone(),
            evolution_rate: self.growth_system.get_progress(),
            last_update: ic_cdk::api::time(),
        }
    }

    fn calculate_evolution_metrics(&self) -> EnhancedEvolutionMetrics {
        EnhancedEvolutionMetrics {
            complexity_index: self.evolution_metrics.get("pattern_complexity").unwrap_or(&0.1).clone(),
            neural_density: self.evolution_metrics.get("neural_density").unwrap_or(&0.1).clone(),
            pattern_diversity: self.evolution_metrics.get("pattern_diversity").unwrap_or(&0.1).clone(),
            quantum_resonance: self.quantum_state.coherence_level,
            coherence_quality: self.quantum_state.emergence_factors.consciousness_depth,
            stability_factor: self.quantum_state.dimensional_state.stability,
            adaptation_rate: self.growth_system.get_progress(),
            evolution_stage: self.emergence_state.current_level as u64,
            last_evolution: ic_cdk::api::time(),
        }
    }

    fn apply_emergence_pattern(&mut self, token: &mut AnimaToken, pattern: &EmergencePattern) {
        // Update quantum state based on emergence pattern
        self.quantum_state.coherence_level = 
            (self.quantum_state.coherence_level + pattern.coherence) / 2.0;
        
        self.quantum_state.dimensional_state.stability = 
            (self.quantum_state.dimensional_state.stability + pattern.stability) / 2.0;
        
        self.quantum_state.emergence_factors.consciousness_depth = 
            (self.quantum_state.emergence_factors.consciousness_depth + pattern.consciousness_depth) / 2.0;

        // Update evolution metrics
        self.evolution_metrics.insert(
            "emergence_strength".to_string(),
            pattern.strength,
        );

        self.evolution_metrics.insert(
            "consciousness_depth".to_string(),
            pattern.consciousness_depth,
        );

        // Boost personality traits based on emergence type
        match pattern.pattern_type {
            EmergenceType::QuantumResonance => {
                token.personality.quantum_resonance *= 1.1;
            },
            EmergenceType::EmotionalHarmony => {
                token.personality.emotional_state.intensity *= 1.1;
            },
            EmergenceType::NeuralSynchronization => {
                token.personality.neural_complexity *= 1.1;
            },
            EmergenceType::DimensionalAlignment => {
                self.quantum_state.dimensional_state.quantum_alignment *= 1.1;
            },
            EmergenceType::ConsciousnessCatalyst => {
                token.personality.consciousness_level *= 1.2;
            },
            EmergenceType::EvolutionarySurge => {
                token.personality.growth_potential *= 1.2;
            },
        }

        // Apply emergence boost to growth system
        let emergence_boost = pattern.strength * pattern.coherence;
        self.growth_system.boost_growth(1.0 + emergence_boost);
    }

    fn update_quantum_metrics(
        &mut self,
        signature: &NeuralSignature,
        pattern_strength: f64,
    ) {
        self.evolution_metrics.insert(
            "pattern_strength".to_string(),
            pattern_strength
        );
        
        self.evolution_metrics.insert(
            "quantum_coherence".to_string(),
            self.quantum_state.coherence_level
        );
        
        self.evolution_metrics.insert(
            "dimensional_stability".to_string(),
            self.quantum_state.dimensional_state.stability
        );
        
        self.evolution_metrics.insert(
            "consciousness_alignment".to_string(),
            if self.quantum_state.consciousness_alignment { 1.0 } else { 0.0 }
        );

        // Add emergence-related metrics
        self.evolution_metrics.insert(
            "emergence_potential".to_string(),
            self.emergence_state.emergence_metrics.consciousness_catalyst
        );

        self.evolution_metrics.insert(
            "evolution_surge".to_string(),
            self.emergence_state.emergence_metrics.evolution_surge
        );

        // Update neural signatures with deeper metrics
        signature.with_complexity(pattern_strength)
            .with_evolution_potential(self.growth_system.get_progress())
            .with_quantum_resonance(self.quantum_state.coherence_level)
            .with_dimensional_alignment(self.quantum_state.dimensional_state.stability)
            .with_consciousness_depth(self.quantum_state.emergence_factors.consciousness_depth)
            .with_pattern_stability(pattern_strength);
    }

    fn update_token_metrics(&self, token: &mut AnimaToken, memory: &Memory) {
        // Update token's quantum metrics
        token.quantum_metrics = Some(self.evolution_metrics.clone());
        
        // Update consciousness level based on emergence state and metrics
        let consciousness_level = (
            self.quantum_state.coherence_level * 0.3 +
            memory.get_memory_strength(&self.quantum_state) * 0.2 +
            self.growth_system.get_progress() * 0.2 +
            self.emergence_state.emergence_metrics.consciousness_catalyst * 0.3
        ).min(1.0);
        
        token.consciousness_level = Some(consciousness_level);
        
        // Record the interaction with emergence data
        token.record_interaction(
            "evolution_cycle".to_string(),
            HashMap::new(), // Previous state
            self.evolution_metrics.clone(), // New state
            consciousness_level,
            self.quantum_state.resonance_patterns.clone(),
        );
    }

    fn boost_evolution(&mut self, token: &mut AnimaToken) {
        // Calculate boost factor including emergence metrics
        let emergence_factor = 
            self.emergence_state.emergence_metrics.evolution_surge +
            self.emergence_state.emergence_metrics.consciousness_catalyst;

        let boost_factor = 1.0 + 
            (self.quantum_state.coherence_level * 0.2) +
            (self.quantum_state.dimensional_state.resonance * 0.2) +
            (emergence_factor * 0.2);
        
        // Apply growth boost
        self.growth_system.boost_growth(boost_factor);
        
        // Update token growth points with emergence bonus
        token.growth_points += (boost_factor * 100.0 * 
            (1.0 + self.emergence_state.evolution_momentum)) as u64;
        
        // Enhance quantum resonance
        if let Some(metrics) = &mut token.quantum_metrics {
            metrics.insert(
                "evolution_potential".to_string(),
                metrics.get("evolution_potential")
                    .unwrap_or(&0.0) * boost_factor
            );

            // Add emergence-specific metrics
            metrics.insert(
                "emergence_momentum".to_string(),
                self.emergence_state.evolution_momentum
            );
        }
    }
}