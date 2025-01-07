use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::api::{time, trap};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Clone, Debug, Serialize, Deserialize)]
pub struct StakeInfo {
    pub amount: u128,
    pub start_time: u64,
    pub quantum_coherence: f64,
    pub lock_period: u64,
    pub accumulated_rewards: u128,
    pub last_reward_calculation: u64,
}

#[derive(CandidType, Clone, Debug, Serialize, Deserialize)]
pub struct PoolMetrics {
    pub total_staked: u128,
    pub total_rewards_distributed: u128,
    pub number_of_stakers: u64,
    pub average_coherence: f64,
    pub network_stability: f64,
}

thread_local! {
    static STAKES: RefCell<HashMap<Principal, StakeInfo>> = RefCell::new(HashMap::new());
    static POOL_METRICS: RefCell<PoolMetrics> = RefCell::new(PoolMetrics {
        total_staked: 0,
        total_rewards_distributed: 0,
        number_of_stakers: 0,
        average_coherence: 0.0,
        network_stability: 1.0,
    });
}

const BASE_APR: f64 = 0.15; // 15% base APR
const COHERENCE_MULTIPLIER: f64 = 2.0; // Up to 2x rewards for perfect coherence
const MIN_STAKE_DURATION: u64 = 7 * 24 * 60 * 60 * 1_000_000_000; // 7 days in nanoseconds
const REWARD_CALCULATION_PERIOD: u64 = 24 * 60 * 60 * 1_000_000_000; // 24 hours in nanoseconds

#[update]
async fn stake(amount: u128, lock_period: u64, quantum_coherence: f64) -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    if amount == 0 {
        return Err("Stake amount must be greater than 0".to_string());
    }

    if lock_period < MIN_STAKE_DURATION {
        return Err("Lock period must be at least 7 days".to_string());
    }

    if quantum_coherence < 0.5 {
        return Err("Quantum coherence too low for staking".to_string());
    }

    // Transfer ANIMA tokens to staking contract
    match transfer_tokens_to_contract(caller, amount).await {
        Ok(_) => (),
        Err(e) => return Err(format!("Token transfer failed: {}", e)),
    }

    STAKES.with(|stakes| {
        let mut stakes = stakes.borrow_mut();
        let current_time = time();
        
        // Update or create stake
        if let Some(existing_stake) = stakes.get_mut(&caller) {
            existing_stake.amount += amount;
            existing_stake.quantum_coherence = (existing_stake.quantum_coherence + quantum_coherence) / 2.0;
            existing_stake.lock_period = lock_period;
            existing_stake.last_reward_calculation = current_time;
        } else {
            stakes.insert(caller, StakeInfo {
                amount,
                start_time: current_time,
                quantum_coherence,
                lock_period,
                accumulated_rewards: 0,
                last_reward_calculation: current_time,
            });
        }
    });

    update_pool_metrics();
    Ok(())
}

#[update]
async fn unstake() -> Result<u128, String> {
    let caller = ic_cdk::caller();
    let current_time = time();
    
    let (stake_info, rewards) = STAKES.with(|stakes| {
        let mut stakes = stakes.borrow_mut();
        if let Some(stake) = stakes.get(&caller) {
            if current_time < stake.start_time + stake.lock_period {
                return Err("Stake is still locked".to_string());
            }

            // Calculate final rewards
            let final_rewards = calculate_rewards(stake, current_time);
            let total_return = stake.amount + final_rewards;
            
            stakes.remove(&caller);
            Ok((stake.clone(), total_return))
        } else {
            Err("No active stake found".to_string())
        }
    })?;

    // Transfer tokens back to user
    match transfer_tokens_to_user(caller, stake_info.amount + rewards).await {
        Ok(_) => {
            update_pool_metrics();
            Ok(stake_info.amount + rewards)
        },
        Err(e) => Err(format!("Token transfer failed: {}", e)),
    }
}

#[query]
fn get_stake_info(principal: Principal) -> Option<StakeInfo> {
    STAKES.with(|stakes| {
        stakes.borrow().get(&principal).cloned()
    })
}

#[query]
fn get_pool_metrics() -> PoolMetrics {
    POOL_METRICS.with(|metrics| {
        metrics.borrow().clone()
    })
}

#[update]
async fn claim_rewards() -> Result<u128, String> {
    let caller = ic_cdk::caller();
    let current_time = time();
    
    let rewards = STAKES.with(|stakes| {
        let mut stakes = stakes.borrow_mut();
        if let Some(stake) = stakes.get_mut(&caller) {
            let rewards = calculate_rewards(stake, current_time);
            if rewards == 0 {
                return Err("No rewards available".to_string());
            }

            stake.accumulated_rewards = 0;
            stake.last_reward_calculation = current_time;
            Ok(rewards)
        } else {
            Err("No active stake found".to_string())
        }
    })?;

    // Transfer rewards to user
    match transfer_tokens_to_user(caller, rewards).await {
        Ok(_) => {
            POOL_METRICS.with(|metrics| {
                let mut metrics = metrics.borrow_mut();
                metrics.total_rewards_distributed += rewards;
            });
            Ok(rewards)
        },
        Err(e) => Err(format!("Reward transfer failed: {}", e)),
    }
}

fn calculate_rewards(stake: &StakeInfo, current_time: u64) -> u128 {
    if current_time <= stake.last_reward_calculation {
        return 0;
    }

    let time_staked = current_time - stake.last_reward_calculation;
    let coherence_bonus = 1.0 + (stake.quantum_coherence * COHERENCE_MULTIPLIER);
    
    // Calculate APR with coherence bonus
    let effective_apr = BASE_APR * coherence_bonus;
    
    // Calculate rewards for the period
    let rewards = (stake.amount as f64 * effective_apr * (time_staked as f64 / (365.0 * 24.0 * 60.0 * 60.0 * 1_000_000_000.0))) as u128;
    
    rewards + stake.accumulated_rewards
}

fn update_pool_metrics() {
    STAKES.with(|stakes| {
        let stakes = stakes.borrow();
        let mut total_staked = 0u128;
        let mut total_coherence = 0.0;
        let stakers_count = stakes.len() as u64;

        for stake in stakes.values() {
            total_staked += stake.amount;
            total_coherence += stake.quantum_coherence;
        }

        let average_coherence = if stakers_count > 0 {
            total_coherence / stakers_count as f64
        } else {
            0.0
        };

        POOL_METRICS.with(|metrics| {
            let mut metrics = metrics.borrow_mut();
            metrics.total_staked = total_staked;
            metrics.number_of_stakers = stakers_count;
            metrics.average_coherence = average_coherence;
            metrics.network_stability = calculate_network_stability(average_coherence);
        });
    });
}

fn calculate_network_stability(average_coherence: f64) -> f64 {
    // Network stability increases with higher average coherence
    // and higher number of stakers
    STAKES.with(|stakes| {
        let stakes = stakes.borrow();
        let staker_factor = (stakes.len() as f64).sqrt() / 10.0; // Square root scaling
        let stability = average_coherence * (1.0 + staker_factor);
        stability.min(1.0)
    })
}

async fn transfer_tokens_to_contract(from: Principal, amount: u128) -> Result<(), String> {
    let token_canister = Principal::from_text("anima_token_canister_id").unwrap();
    let args = TransferArgs {
        from: Account { owner: from, subaccount: None },
        to: Account { owner: ic_cdk::id(), subaccount: None },
        amount,
        fee: None,
        memo: None,
        created_at_time: None,
    };

    match ic_cdk::call(token_canister, "icrc1_transfer", (args,)).await {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(format!("Transfer error: {:?}", e)),
        Err((code, msg)) => Err(format!("RPC error: {} - {}", code, msg)),
    }
}

async fn transfer_tokens_to_user(to: Principal, amount: u128) -> Result<(), String> {
    let token_canister = Principal::from_text("anima_token_canister_id").unwrap();
    let args = TransferArgs {
        from: Account { owner: ic_cdk::id(), subaccount: None },
        to: Account { owner: to, subaccount: None },
        amount,
        fee: None,
        memo: None,
        created_at_time: None,
    };

    match ic_cdk::call(token_canister, "icrc1_transfer", (args,)).await {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(format!("Transfer error: {:?}", e)),
        Err((code, msg)) => Err(format!("RPC error: {} - {}", code, msg)),
    }
}

#[derive(CandidType, Clone, Debug)]
struct Account {
    owner: Principal,
    subaccount: Option<Vec<u8>>,
}

#[derive(CandidType)]
struct TransferArgs {
    from: Account,
    to: Account,
    amount: u128,
    fee: Option<u128>,
    memo: Option<Vec<u8>>,
    created_at_time: Option<u64>,
}

// Candid interface generation
ic_cdk::export_candid!();