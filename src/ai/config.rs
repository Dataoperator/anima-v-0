use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct OpenAIConfig {
    pub api_key: String,
    pub model: String,
    pub max_tokens: u32,
    pub temperature: f32,
    pub presence_penalty: f32,
    pub frequency_penalty: f32,
    pub top_p: f32,
    pub context_window: u32,
}

impl Default for OpenAIConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model: "gpt-4-turbo-preview".to_string(),
            max_tokens: 300,
            temperature: 0.85,
            presence_penalty: 0.6,
            frequency_penalty: 0.3,
            top_p: 0.95,
            context_window: 8192,
        }
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Role {
    System,
    User,
    Assistant,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Message {
    pub role: Role,
    pub content: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChatRequest {
    pub model: String,
    pub messages: Vec<Message>,
    pub temperature: f32,
    pub max_tokens: u32,
    pub presence_penalty: f32,
    pub frequency_penalty: f32,
    pub top_p: f32,
    pub stop: Option<Vec<String>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChatResponse {
    pub choices: Vec<Choice>,
    pub usage: Option<Usage>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Choice {
    pub message: Message,
    pub finish_reason: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

thread_local! {
    static CONFIG: std::cell::RefCell<OpenAIConfig> = std::cell::RefCell::new(OpenAIConfig::default());
}

pub fn initialize(config: OpenAIConfig) {
    CONFIG.with(|c| *c.borrow_mut() = config);
}

pub fn get_config() -> OpenAIConfig {
    CONFIG.with(|c| c.borrow().clone())
}

pub fn update_config(config: OpenAIConfig) {
    CONFIG.with(|c| *c.borrow_mut() = config);
}