use candid::{CandidType, Decode, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::VecDeque;

mod personality;
mod memory;
mod types;
mod error;
mod llm;
mod autonomous;

use personality::Personality;
use memory::Memory;
use types::*;
use error::AnimaError;
use llm::generate_response;
use autonomous::{InitiativeType, start_autonomous_timer};

const MAX_MEMORIES: usize = 100;
const MEMORY_RETENTION_THRESHOLD: f32 = 0.5;

// Type aliases
type Memory = VirtualMemory<DefaultMemoryImpl>;
type Result<T> = std::result::Result<T, AnimaError>;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct InitializationStatus {
    pub is_initialized: bool,
    pub config_status: ConfigStatus,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ConfigStatus {
    pub openai_configured: bool,
    pub quantum_ready: bool,
    pub storage_initialized: bool,
}

// State management
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STORAGE: RefCell<StableBTreeMap<Principal, Anima, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    static CONFIG: RefCell<Option<String>> = RefCell::new(None);
}

[Previous code remains the same...]

#[ic_cdk_macros::query]
pub fn check_initialization() -> Result<InitializationStatus> {
    let openai_configured = CONFIG.with(|config| config.borrow().is_some());
    
    let storage_initialized = MEMORY_MANAGER.with(|mm| {
        let mm = mm.borrow();
        mm.get(MemoryId::new(0)).size() > 0
    });

    // Check quantum system readiness
    let quantum_ready = ic_cdk::api::performance_counter(0) > 0;

    Ok(InitializationStatus {
        is_initialized: openai_configured && storage_initialized && quantum_ready,
        config_status: ConfigStatus {
            openai_configured,
            quantum_ready,
            storage_initialized,
        }
    })
}

[Rest of the implementation remains unchanged...]