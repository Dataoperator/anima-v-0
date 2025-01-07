use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::api::{time, trap};
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Clone, Debug, Serialize, Deserialize)]
pub struct RewardMetrics {
    quantum_coherence: f64,
    participation_score: f64,
    nft_power: f64,
    staking_duration: u64,
    network_contribution: f64
}

#[derive(CandidType, Clone, Debug, Serialize, Deserialize)]
pub struct RewardConfig {
    base_rate: f64,
    coherence_multiplier: f64,
    participation_multiplier: f64,
    nft_bonus_rate: f64,
    staking_bonus_rate: f64,
    network_bonus_rate: f64
}

#[derive(CandidType, Clone, Debug, Serialize, Deserialize)]
pub struct RewardPool {
    total_rewards: u128,
    distributed_rewards: u128,
    last_distribution: u64,
    distribution_interval: u64
}

thread_local! {
    static REWARD_METRICS: RefCell<HashMap<Principal, RewardMetrics>> = RefCell::new(HashMap::new());
    static REWARD_CONFIG: RefCell<RewardConfig> = RefCell::new(RewardConfig {
        base_rate: 0.01,
        coherence_multiplier: 2.0,
        participation_multiplier: 1.5,
        nft_bonus_rate: 0.2,
        staking_bonus_rate: 0.1,
        network_bonus_rate: 0.3
    });
    static REWARD_POOL: RefCell<RewardPool> = RefCell::new(RewardPool {
        total_rewards: 0,
        distributed_rewards: 0,
        last_distribution: 0,
        distribution_interval: 24 * 60 * 60 * 1_000_000_000 // 24 hours
    });
}

#[update]
async fn distribute_rewards(principal: Principal) -> Result<u128, String> {
    let current_time = time();
    let metrics = REWARD_METRICS.with(|metrics| {
        metrics.borrow().get(&principal).cloned()
    }).ok_or("No reward metrics found")?;

    let config = REWARD_CONFIG.with(|config| config.borrow().clone());
    let mut pool = REWARD_POOL.with(|pool| pool.borrow_mut());

    if current_time - pool.last_distribution < pool.distribution_interval {
        return Err("Distribution interval not met".into());
    }

    // Calculate reward components
    let coherence_bonus = metrics.quantum_coherence * config.coherence_multiplier;
    let participation_bonus = metrics.participation_score * config.participation_multiplier;
    let nft_bonus = metrics.nft_power * config.nft_bonus_rate;
    let staking_bonus = (metrics.staking_duration as f64 / (30 * 24 * 60 * 60 * 1_000_000_000) as f64) * config.staking_bonus_rate;
    let network_bonus = metrics.network_contribution * config.network_bonus_rate;

    // Calculate total reward
    let total_multiplier = 1.0 + coherence_bonus + participation_bonus + nft_bonus + staking_bonus + network_bonus;
    let base_reward = (pool.total_rewards as f64 * config.base_rate) as u128;
    let reward = (base_reward as f64 * total_multiplier) as u128;

    // Update pool
    pool.distributed_rewards += reward;
    pool.last_distribution = current_time;

    // Transfer rewards
    match transfer_rewards(principal, reward).await {
        Ok(_) => Ok(reward),
        Err(e) => Err(format!("Reward transfer failed: {}", e))
    }
}

#[update]
async fn update_metrics(principal: Principal, metrics: RewardMetrics) -> Result<(), String> {
    REWARD_METRICS.with(|reward_metrics| {
        reward_metrics.borrow_mut().insert(principal, metrics);
    });
    Ok(())
}

#[query]
fn get_metrics(principal: Principal) -> Option<RewardMetrics> {
    REWARD_METRICS.with(|metrics| {
        metrics.borrow().get(&principal).cloned()
    })
}

#[query]
fn calculate_potential_rewards(metrics: RewardMetrics) -> u128 {
    let config = REWARD_CONFIG.with(|config| config.borrow().clone());
    let pool = REWARD_POOL.with(|pool| pool.borrow().clone());

    let coherence_bonus = metrics.quantum_coherence * config.coherence_multiplier;
    let participation_bonus = metrics.participation_score * config.participation_multiplier;
    let nft_bonus = metrics.nft_power * config.nft_bonus_rate;
    let staking_bonus = (metrics.staking_duration as f64 / (30 * 24 * 60 * 60 * 1_000_000_000) as f64) * config.staking_bonus_rate;
    let network_bonus = metrics.network_contribution * config.network_bonus_rate;

    let total_multiplier = 1.0 + coherence_bonus + participation_bonus + nft_bonus + staking_bonus + network_bonus;
    let base_reward = (pool.total_rewards as f64 * config.base_rate) as u128;
    (base_reward as f64 * total_multiplier) as u128
}

async fn transfer_rewards(to: Principal, amount: u128) -> Result<(), String> {
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
        Err((code, msg)) => Err(format!("RPC error: {} - {}", code, msg))
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

ic_cdk::export_candid!();