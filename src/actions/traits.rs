use crate::error::Result;

pub trait ActionHandler {
    fn handle_action(&mut self, action: &str, params: Vec<u8>) -> Result<()>;
    fn can_handle(&self, action: &str) -> bool;
    fn get_supported_actions(&self) -> Vec<String>;
}

pub trait StateModifier {
    fn modify_state(&mut self, state: &mut crate::types::personality::NFTPersonality) -> Result<()>;
    fn validate_modification(&self, state: &crate::types::personality::NFTPersonality) -> Result<()>;
    fn get_modification_type(&self) -> String;
}