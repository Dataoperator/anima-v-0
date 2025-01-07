use crate::types::personality::NFTPersonality;
use crate::error::Result;
use crate::quantum::QuantumState;

pub async fn analyze_interaction(
    text: &str,
    personality: &NFTPersonality,
    quantum_state: &QuantumState,
    timestamp: u64,
) -> Result<String> {
    let context = if timestamp > 0 {
        Some(vec![format!("Previous interaction timestamp: {}", timestamp)])
    } else {
        None
    };
    openai_client::get_response(text, personality, quantum_state, context).await
}

pub mod openai_client;
pub mod prompt_templates;