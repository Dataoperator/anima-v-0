use ic_cdk::api::management_canister::http_request::{HttpResponse, TransformArgs};
use serde::{Deserialize, Serialize};
use crate::{Anima, Memory, AnimaError};

const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";

#[derive(Serialize, Deserialize, Debug)]
struct OpenAIRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Serialize, Deserialize, Debug)]
struct Message {
    role: String,
    content: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct OpenAIResponse {
    choices: Vec<Choice>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Choice {
    message: Message,
}

pub async fn generate_response(anima: &Anima, input: &str) -> Result<String, AnimaError> {
    let system_prompt = format!(
        "You are {}, an AI companion with the following traits:\n\
         Curiosity: {}\n\
         Stability: {}\n\
         Attachment: {}\n\
         Reactivity: {}\n\n\
         Respond naturally based on these traits and our conversation history.",
        anima.name,
        anima.personality.curiosity,
        anima.personality.stability,
        anima.personality.attachment,
        anima.personality.reactivity
    );

    let context = build_context(anima);
    
    let messages = vec![
        Message {
            role: "system".to_string(),
            content: system_prompt,
        },
        Message {
            role: "system".to_string(),
            content: context,
        },
        Message {
            role: "user".to_string(),
            content: input.to_string(),
        },
    ];

    let request = OpenAIRequest {
        model: "gpt-4-1106-preview".to_string(),
        messages,
        temperature: 0.7,
        max_tokens: 150,
    };

    let api_key = ic_cdk::api::management_canister::http_request::get_env("OPENAI_API_KEY")
        .map_err(|_| AnimaError::Configuration("OpenAI API key not found".to_string()))?;

    let request_headers = vec![
        ("Content-Type".to_string(), "application/json".to_string()),
        ("Authorization".to_string(), format!("Bearer {}", api_key)),
    ];

    let response = ic_cdk::api::management_canister::http_request::http_request(
        OPENAI_API_URL.to_string(),
        "POST".to_string(),
        serde_json::to_vec(&request).unwrap(),
        request_headers,
    ).await.map_err(|e| AnimaError::External(format!("HTTP request failed: {:?}", e)))?;

    let response_body = String::from_utf8(response.body)
        .map_err(|e| AnimaError::External(format!("Failed to decode response: {}", e)))?;

    let openai_response: OpenAIResponse = serde_json::from_str(&response_body)
        .map_err(|e| AnimaError::External(format!("Failed to parse OpenAI response: {}", e)))?;

    openai_response.choices.first()
        .map(|choice| choice.message.content.clone())
        .ok_or_else(|| AnimaError::External("No response from OpenAI".to_string()))
}

fn build_context(anima: &Anima) -> String {
    let mut context = String::new();
    
    // Add recent memories as context
    for memory in anima.memories.iter().rev().take(5) {
        context.push_str(&format!("Previous interaction: {}\n", memory.content));
    }

    // Add personality context
    context.push_str(&format!("\nCurrent mood and state:\n"));
    context.push_str(&format!("Growth level: {}\n", anima.growth_level));
    context.push_str(&format!("Total interactions: {}\n", anima.interaction_count));

    context
}

#[ic_cdk_macros::query]
fn transform_http_response(response: TransformArgs) -> HttpResponse {
    let mut transformed = response.response;
    transformed.headers = vec![]; // Remove unnecessary headers
    transformed
}