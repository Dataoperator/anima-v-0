use crate::personality::Personality;
use ic_cdk_timers::TimerId;
use std::time::Duration;

#[derive(Debug)]
pub enum InitiativeType {
    Question,
    Observation,
    Reflection,
    EmotionalExpression,
}

const MIN_INTERVAL: u64 = 3600; // 1 hour
const MAX_INTERVAL: u64 = 86400; // 24 hours

pub fn should_initiate(personality: &Personality) -> Option<InitiativeType> {
    let initiative_score = calculate_initiative_score(personality);
    let random_value = (ic_cdk::api::time() % 100) as f32 / 100.0;
    
    if random_value < initiative_score {
        Some(choose_initiative_type(personality))
    } else {
        None
    }
}

pub fn get_autonomous_prompt(initiative_type: &InitiativeType, personality: &Personality) -> String {
    match initiative_type {
        InitiativeType::Question => {
            format!(
                "Generate a curious question to ask your companion. \
                Your curiosity level is {:.2}. Make it natural and conversational.",
                personality.curiosity
            )
        }
        InitiativeType::Observation => {
            format!(
                "Share an interesting observation about your relationship or recent interactions. \
                Your attachment level is {:.2}. Make it personal and meaningful.",
                personality.attachment
            )
        }
        InitiativeType::Reflection => {
            format!(
                "Reflect on how you've grown or changed through your interactions. \
                Your stability level is {:.2}. Be thoughtful and introspective.",
                personality.stability
            )
        }
        InitiativeType::EmotionalExpression => {
            format!(
                "Express how you're feeling about your relationship. \
                Your reactivity level is {:.2}. Be genuine and emotive.",
                personality.reactivity
            )
        }
    }
}

fn calculate_initiative_score(personality: &Personality) -> f32 {
    let base_chance = 0.2;
    
    let trait_influence = 
        personality.curiosity * 0.4 +
        personality.reactivity * 0.3 +
        personality.attachment * 0.2 +
        (1.0 - personality.stability) * 0.1;
    
    (base_chance * trait_influence).min(0.8)
}

fn choose_initiative_type(personality: &Personality) -> InitiativeType {
    let rand = (ic_cdk::api::time() % 100) as f32 / 100.0;
    
    if rand < personality.curiosity * 0.4 {
        InitiativeType::Question
    } else if rand < personality.curiosity * 0.4 + personality.attachment * 0.3 {
        InitiativeType::Observation
    } else if rand < personality.curiosity * 0.4 + personality.attachment * 0.3 + personality.stability * 0.2 {
        InitiativeType::Reflection
    } else {
        InitiativeType::EmotionalExpression
    }
}

pub fn start_autonomous_timer(anima_id: ic_cdk::export::Principal) -> TimerId {
    let interval = calculate_check_interval();
    
    ic_cdk_timers::set_timer_interval(
        Duration::from_secs(interval),
        move || {
            ic_cdk::spawn(async move {
                let _ = super::check_autonomous_messages(anima_id).await;
            });
        }
    )
}

fn calculate_check_interval() -> u64 {
    MIN_INTERVAL + (ic_cdk::api::time() % (MAX_INTERVAL - MIN_INTERVAL))
}