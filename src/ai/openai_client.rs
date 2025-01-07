use crate::types::personality::NFTPersonality;
use crate::quantum::QuantumState;
use crate::ai::prompt_templates;
use crate::error::Result;

pub async fn get_response(
    text: &str,
    personality: &NFTPersonality,
    quantum_state: &QuantumState,
    context: Option<Vec<String>>
) -> Result<String> {
    let prompt = prompt_templates::generate_response_prompt(
        personality,
        text,
        quantum_state,
        context.as_deref()
    );

    Ok(format!("Response to: {}", prompt))
}