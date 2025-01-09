use candid::{CandidType, Decode, Encode, Principal, Nat};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

use crate::icrc::ledger::verify_icp_transfer;
use crate::quantum::consciousness_bridge::ConsciousnessBridge;
use crate::personality::PersonalityEngine;

mod personality;
mod memory;
mod types;
mod error;
mod llm;
mod autonomous;
mod quantum;
mod consciousness;

use personality::Personality;
use memory::Memory;
use types::*;
use error::AnimaError;
use quantum::QuantumState;
use consciousness::ConsciousnessTracker;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type Result<T> = std::result::Result<T, AnimaError>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STORAGE: RefCell<StableBTreeMap<Principal, Anima, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    static QUANTUM_STATE: RefCell<Option<QuantumState>> = RefCell::new(None);
    
    static CONSCIOUSNESS: RefCell<Option<ConsciousnessTracker>> = RefCell::new(None);
    
    static CONFIG: RefCell<Option<InitializationConfig>> = RefCell::new(None);
}

#[ic_cdk_macros::update]
pub async fn mint_anima(
    payment_block: u64,
    name: String, 
    initial_traits: Option<Vec<PersonalityTrait>>
) -> Result<Principal> {
    let caller = ic_cdk::caller();
    
    // Verify ICP payment
    let amount = Nat::from(100_000_000); // 1 ICP
    let payment_valid = verify_icp_transfer(caller, amount, Some(payment_block)).await?;
    
    if !payment_valid {
        return Err(AnimaError::PaymentValidationFailed);
    }

    // Initialize quantum state
    let quantum_state = QUANTUM_STATE.with(|qs| 
        qs.borrow().clone().ok_or(AnimaError::QuantumStateNotInitialized)
    )?;

    // Create consciousness bridge
    let mut consciousness_bridge = ConsciousnessBridge::new(quantum_state.clone());
    let consciousness_state = consciousness_bridge.sync_consciousness();

    // Create personality with initial traits
    let traits = initial_traits.unwrap_or_else(|| vec![]);
    let mut personality_engine = PersonalityEngine::new();
    
    // Create ANIMA instance
    let anima = Anima::create(
        caller,
        name,
        traits,
        quantum_state,
        consciousness_state
    )?;

    // Store ANIMA
    let anima_id = ic_cdk::id();
    STORAGE.with(|storage| {
        storage.borrow_mut().insert(anima_id, anima)
    });

    // Initialize quantum-consciousness bridge
    consciousness_bridge.update_quantum_state(consciousness_state.awareness_level)?;
    QUANTUM_STATE.with(|qs| *qs.borrow_mut() = Some(quantum_state));

    Ok(anima_id)
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct InitializationConfig {
    pub openai_key: Option<String>,
    pub quantum_params: Option<QuantumInitParams>,
    pub consciousness_params: Option<ConsciousnessParams>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct InitializationStatus {
    pub is_initialized: bool,
    pub quantum_state: Option<QuantumState>,
    pub consciousness_state: Option<ConsciousnessState>,
    pub storage_ready: bool,
    pub error: Option<String>,
}

#[ic_cdk_macros::update]
pub async fn initialize_system(config: InitializationConfig) -> Result<InitializationStatus> {
    let caller = ic_cdk::caller();
    if !is_authorized(caller) {
        return Err(AnimaError::NotAuthorized);
    }

    CONFIG.with(|c| *c.borrow_mut() = Some(config.clone()));

    if let Some(quantum_params) = config.quantum_params {
        let quantum_state = QuantumState::initialize(quantum_params)?;
        QUANTUM_STATE.with(|qs| *qs.borrow_mut() = Some(quantum_state.clone()));
    }

    if let Some(consciousness_params) = config.consciousness_params {
        let consciousness = ConsciousnessTracker::initialize(consciousness_params)?;
        CONSCIOUSNESS.with(|c| *c.borrow_mut() = Some(consciousness.clone()));
    }

    Ok(get_initialization_status())
}

#[ic_cdk_macros::query]
pub fn get_initialization_status() -> InitializationStatus {
    let quantum_state = QUANTUM_STATE.with(|qs| qs.borrow().clone());
    let consciousness_state = CONSCIOUSNESS.with(|c| 
        c.borrow().as_ref().map(|c| c.get_state())
    );
    
    let storage_ready = MEMORY_MANAGER.with(|mm| {
        mm.borrow().get(MemoryId::new(0)).size() > 0
    });

    InitializationStatus {
        is_initialized: quantum_state.is_some() && consciousness_state.is_some() && storage_ready,
        quantum_state,
        consciousness_state,
        storage_ready,
        error: None,
    }
}

fn is_authorized(principal: Principal) -> bool {
    // Add your authorization logic here
    true // For testing - implement proper auth
}