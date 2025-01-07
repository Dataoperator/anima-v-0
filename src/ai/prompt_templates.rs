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
    let quantum_factor = metrics.coherence * 0.7 + metrics.dimensional_frequency * 0.3;
    base_weight * quantum_factor
}

pub fn generate_response_prompt(
    personality: &NFTPersonality,
    text: &str,
    quantum_state: &QuantumState,
    context: Option<&[String]>
) -> String {
    let metrics = QuantumMetrics {
        coherence: quantum_state.coherence,
        dimensional_frequency: quantum_state.dimensional_frequency,
        field_strength: quantum_state.field_strength,
        resonance: quantum_state.resonance,
        stability: quantum_state.stability,
    };
    
    let temporal_context = process_temporal_context(context, &metrics);
    
    // Get active traits and format them
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
        quantum_state.coherence,
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