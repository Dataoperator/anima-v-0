use crate::personality::Personality;
use ic_cdk::api::management_canister::http_request::{
    HttpResponse, TransformArgs, 
    http_request as make_http_request
};
use serde::{Deserialize, Serialize};
use std::error::Error;

const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";

#[derive(Serialize, Deserialize, Debug)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
}

#[derive(Serialize, Deserialize, Debug)]
struct ChatResponse {
    choices: Vec<Choice>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Choice {
    message: ChatMessage,
}

pub async fn get_response(
    api_key: &str,
    personality: &Personality,
    recent_memories: &Vec<String>,
    input: &str,
) -> Result<String, Box<dyn Error>> {
    let mut messages = vec![
        ChatMessage {
            role: "system".to_string(),
            content: format!(
                "You are an AI companion with the following traits:\n\
                Curiosity: {:.2}\n\
                Stability: {:.2}\n\
                Attachment: {:.2}\n\
                Reactivity: {:.2}\n\
                Respond naturally based on these traits.",
                personality.curiosity,
                personality.stability,
                personality.attachment,
                personality.reactivity
            ),
        }
    ];

    // Add memory context
    if !recent_memories.is_empty() {
        messages.push(ChatMessage {
            role: "system".to_string(),
            content: format!(
                "Recent conversation history:\n{}",
                recent_memories.join("\n")
            ),
        });
    }

    // Add user input
    messages.push(ChatMessage {
        role: "user".to_string(),
        content: input.to_string(),
    });

    let request = ChatRequest {
        model: "gpt-4-1106-preview".to_string(),
        messages,
        temperature: 0.7,
    };

    let request_headers = vec![
        ("Content-Type".to_string(), "application/json".to_string()),
        ("Authorization".to_string(), format!("Bearer {}", api_key)),
    ];

    let request_body = serde_json::to_vec(&request)?;

    let response = make_http_request(
        OPENAI_API_URL.to_string(),
        "POST".to_string(),
        request_body,
        request_headers,
    ).await?;

    let response_body = String::from_utf8(response.body)?;
    let chat_response: ChatResponse = serde_json::from_str(&response_body)?;

    chat_response.choices.first()
        .map(|choice| choice.message.content.clone())
        .ok_or_else(|| "No response from OpenAI".into())
}

#[ic_cdk_macros::query]
fn transform_response(response: TransformArgs) -> HttpResponse {
    response.response
}