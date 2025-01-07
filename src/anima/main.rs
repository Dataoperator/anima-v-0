use candid::{CandidType, Principal};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::borrow::Cow;

// Import from sibling modules
use super::personality::Personality;
use super::types::{Memory as MemoryRecord, InteractionResponse};
use super::error::AnimaError;

// Type alias for memory
type Memory = VirtualMemory<DefaultMemoryImpl>;
type Result<T> = std::result::Result<T, AnimaError>;

// Custom wrapper for Principal to implement BoundedStorable
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct StorablePrincipal(Principal);

impl Storable for StorablePrincipal {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(self.0.as_slice().to_vec())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Self(Principal::from_slice(&bytes))
    }
}

impl BoundedStorable for StorablePrincipal {
    const MAX_SIZE: u32 = 29;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static STORAGE: RefCell<StableBTreeMap<StorablePrincipal, Anima, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Anima {
    pub owner: Principal,
    pub name: String,
    pub creation_time: u64,
    pub personality: Personality,
    pub memories: Vec<MemoryRecord>,
    pub interaction_count: u64,
    pub growth_level: u32,
    pub last_interaction: u64,
}

impl Storable for Anima {
    fn to_bytes(&self) -> Cow<[u8]> {
        let mut bytes = vec![];
        ciborium::ser::into_writer(&self, &mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::de::from_reader(bytes.as_ref()).unwrap()
    }
}

impl BoundedStorable for Anima {
    const MAX_SIZE: u32 = 64 * 1024; // 64KB max size
    const IS_FIXED_SIZE: bool = false;
}

#[ic_cdk_macros::update]
pub async fn create(name: String) -> Result<Principal> {
    let caller = ic_cdk::caller();
    let anima = Anima {
        owner: caller,
        name,
        creation_time: ic_cdk::api::time(),
        personality: Personality::generate_initial(),
        memories: Vec::new(),
        interaction_count: 0,
        growth_level: 1,
        last_interaction: ic_cdk::api::time(),
    };

    let id = ic_cdk::id();
    STORAGE.with(|storage| {
        storage.borrow_mut().insert(StorablePrincipal(id), anima)
    });

    Ok(id)
}

#[ic_cdk_macros::query]
pub fn get(id: Principal) -> Result<Anima> {
    STORAGE.with(|storage| {
        storage.borrow().get(&StorablePrincipal(id))
            .ok_or(AnimaError::NotFound)
    })
}

#[ic_cdk_macros::update]
pub async fn interact(id: Principal, input: String) -> Result<InteractionResponse> {
    let caller = ic_cdk::caller();
    
    let mut anima = get(id)?;
    if anima.owner != caller {
        return Err(AnimaError::NotAuthorized);
    }

    let response = process_interaction(&mut anima, &input).await?;
    
    STORAGE.with(|storage| {
        storage.borrow_mut().insert(StorablePrincipal(id), anima)
    });

    Ok(response)
}

async fn process_interaction(anima: &mut Anima, input: &str) -> Result<InteractionResponse> {
    anima.interaction_count += 1;
    anima.last_interaction = ic_cdk::api::time();

    Ok(InteractionResponse {
        message: format!("Interaction processed! Count: {}", anima.interaction_count),
        personality_changes: Vec::new(),
        new_memories: Vec::new(),
    })
}