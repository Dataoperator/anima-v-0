use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::TokenIdentifier;
use crate::quantum::QuantumState;
use crate::nft::AnimaNFT;
use std::ops::{Deref, DerefMut};

#[derive(Clone)]
pub struct State {
    pub nfts: HashMap<TokenIdentifier, AnimaNFT>,
    pub quantum_states: HashMap<TokenIdentifier, QuantumState>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

impl Default for State {
    fn default() -> Self {
        Self {
            nfts: HashMap::new(),
            quantum_states: HashMap::new(),
        }
    }
}

impl State {
    pub fn get_nft(&self, token_id: TokenIdentifier) -> Option<&AnimaNFT> {
        self.nfts.get(&token_id)
    }

    pub fn get_nft_mut(&mut self, token_id: TokenIdentifier) -> Option<&mut AnimaNFT> {
        self.nfts.get_mut(&token_id)
    }

    pub fn get_quantum_state(&self, token_id: TokenIdentifier) -> Option<&QuantumState> {
        self.quantum_states.get(&token_id)
    }

    pub fn update_quantum_state(&mut self, token_id: TokenIdentifier, state: QuantumState) {
        self.quantum_states.insert(token_id, state);
    }
}

pub struct StateGuard(State);
pub struct StateGuardMut(State);

impl Deref for StateGuard {
    type Target = State;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Deref for StateGuardMut {
    type Target = State;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for StateGuardMut {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

pub fn get_state() -> StateGuard {
    STATE.with(|s| StateGuard(s.borrow().clone()))
}

pub fn get_state_mut() -> StateGuardMut {
    STATE.with(|s| StateGuardMut(s.borrow().clone()))
}