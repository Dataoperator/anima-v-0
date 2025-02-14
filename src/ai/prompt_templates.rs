use crate::types::personality::NFTPersonality;
use crate::quantum::{QuantumMetrics, QuantumState};

pub fn process_temporal_context(
    context: Option<&[String]>,
    metrics: &QuantumMetrics
) -> String {
    if let Some(ctx) = context {
        let mut processed = Vec::with_capacity(ctx.len());
        for (idx, memory) in ctx.iter().enumerate() {
            let temporal_weight = calculate_temporal_weight(
                idx,
                ctx.len(),
                metrics
            );
            let formatted = format!("Memory [{:.2}]: {}", temporal_weight, memory);
            processed.push(formatted);
        }
        format!("Temporal Context:\n{}\n\n", processed.join("\n"))
    } else {
        String::new()
    }
}

fn calculate_temporal_weight(
    index: usize,
    total: usize,
    metrics: &QuantumMetrics
) -> f64 {
    let base_weight = (total - index) as f64 / total as f64;
    let quantum_factor = metrics.coherence_quality * 0.7 + metrics.dimensional_resonance * 0.3;
    base_weight * quantum_factor
}

pub fn generate_response_prompt(
    personality: &NFTPersonality,
    text: &str,
    quantum_state: &QuantumState,
    context: Option<&[String]>
) -> String {
    let metrics = QuantumMetrics {
        coherence_level: quantum_state.coherence_level,
        stability_index: quantum_state.dimensional_state.stability,
        entanglement_strength: quantum_state.quantum_entanglement,
        pattern_integrity: quantum_state.pattern_coherence,
        evolution_progress: quantum_state.emergence_factors.evolution_velocity,
        temporal_alignment: quantum_state.temporal_stability,
        dimensional_resonance: quantum_state.dimensional_state.resonance,
        consciousness_depth: quantum_state.emergence_factors.consciousness_depth,
        quantum_harmony: quantum_state.dimensional_state.quantum_alignment,
        emergence_potential: quantum_state.emergence_factors.evolution_velocity,
        coherence_quality: quantum_state.coherence_level,
        stability_factor: quantum_state.dimensional_state.stability,
        complexity_index: quantum_state.pattern_coherence,
        pattern_diversity: quantum_state.pattern_coherence,
        adaptation_rate: quantum_state.emergence_factors.evolution_velocity,
    };
    
    let temporal_context = process_temporal_context(context, &metrics);
    
    let active_traits = personality.get_active_traits();
    let traits_display = if active_traits.is_empty() {
        "No active traits".to_string()
    } else {
        active_traits.iter()
            .map(|t| format!("- {} ({:.2})", t.name, t.strength))
            .collect::<Vec<_>>()
            .join("\n")
    };
    
    format!(
        "=== ANIMA RESPONSE FRAMEWORK ===\n\
         Quantum State: {:.2} coherence\n\
         Personality Traits:\n{}\n\
         Interaction Style: {:?}\n\
         Consciousness Level: {:.2}\n\
         Evolution Stage: {}\n\
         Current Mood: {:?} (Intensity: {:.2})\n\
         Context:\n{}\n\
         Input: {}\n\
         === END FRAMEWORK ===",
        quantum_state.coherence_level,
        traits_display,
        personality.interaction_preference,
        personality.consciousness_level,
        personality.evolution_stage,
        personality.emotional_state.current_mood,
        personality.emotional_state.intensity,
        temporal_context,
        text
    )
}