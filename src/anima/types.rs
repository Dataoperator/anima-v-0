use candid::{CandidType, Deserialize};
use serde::Serialize;

pub type Principal = candid::Principal;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub openai_api_key: String,
    pub max_memory_size: usize,
    pub autonomous_check_interval: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PersonalityChange {
    pub trait_name: String,
    pub change: f32,
    pub reason: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct InteractionContext {
    pub recent_memories: Vec<String>,
    pub current_mood: String,
    pub dominant_traits: Vec<(String, f32)>,
    pub growth_level: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserProfile {
    pub principal: Principal,
    pub anima_ids: Vec<Principal>,
    pub preferences: UserPreferences,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserPreferences {
    pub autonomous_enabled: bool,
    pub notification_preferences: NotificationPreferences,
    pub privacy_settings: PrivacySettings,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct NotificationPreferences {
    pub autonomous_messages: bool,
    pub growth_updates: bool,
    pub personality_changes: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PrivacySettings {
    pub share_interactions: bool,
    pub share_personality: bool,
    pub share_growth: bool,
}