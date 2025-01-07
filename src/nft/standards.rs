use candid::Principal;
use crate::nft::types::TokenIdentifier;

pub trait NFTStandard {
    fn owner_of(&self, token_id: &TokenIdentifier) -> Option<Principal>;
    fn transfer(&mut self, from: Principal, to: Principal, token_id: TokenIdentifier) -> Result<(), String>;
    fn balance_of(&self, owner: Principal) -> u64;
}

pub trait Mintable {
    fn mint(&mut self, to: Principal) -> Result<TokenIdentifier, String>;
}