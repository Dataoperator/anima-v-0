use candid::{CandidType, Principal};
use ic_cdk::{api::time, caller};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use crate::error::{Error, Result};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AdminConfig {
    pub admins: HashSet<Principal>,
    pub pending_admins: HashMap<Principal, u64>,
    pub metrics_config: MetricsConfig,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MetricsConfig {
    pub collection_interval: u64,
    pub alert_thresholds: AlertThresholds,
    pub retention_period: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AlertThresholds {
    pub memory_usage_percent: f64,
    pub cycles_balance_min: u128,
    pub error_rate_max: f64,
}

impl Default for AdminConfig {
    fn default() -> Self {
        Self {
            admins: HashSet::new(),
            pending_admins: HashMap::new(),
            metrics_config: MetricsConfig::default(),
        }
    }
}

impl Default for MetricsConfig {
    fn default() -> Self {
        Self {
            collection_interval: 300, // 5 minutes
            alert_thresholds: AlertThresholds::default(),
            retention_period: 30 * 24 * 60 * 60, // 30 days
        }
    }
}

impl Default for AlertThresholds {
    fn default() -> Self {
        Self {
            memory_usage_percent: 90.0,
            cycles_balance_min: 1_000_000_000_000, // 1T cycles
            error_rate_max: 0.01, // 1%
        }
    }
}

pub fn is_admin(principal: &Principal) -> bool {
    crate::STATE.with(|state| {
        let state = state.borrow();
        state.admin_config.admins.contains(principal)
    })
}

pub fn require_admin() -> Result<()> {
    if !is_admin(&caller()) {
        Err(Error::NotAuthorized)
    } else {
        Ok(())
    }
}

pub fn add_admin(admin: Principal) -> Result<()> {
    require_admin()?;
    
    crate::STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.admin_config.admins.insert(admin);
        Ok(())
    })
}

pub fn remove_admin(admin: Principal) -> Result<()> {
    require_admin()?;
    
    // Prevent removing the last admin
    crate::STATE.with(|state| {
        let state = state.borrow();
        if state.admin_config.admins.len() <= 1 {
            return Err(Error::LastAdmin);
        }
        Ok(())
    })?;

    crate::STATE.with(|state| {
        let mut state = state.borrow_mut();
        if !state.admin_config.admins.remove(&admin) {
            return Err(Error::AdminNotFound);
        }
        Ok(())
    })
}

pub fn update_metrics_config(config: MetricsConfig) -> Result<()> {
    require_admin()?;
    
    crate::STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.admin_config.metrics_config = config;
        Ok(())
    })
}

pub fn verify_admin_access() -> Result<()> {
    if !is_admin(&caller()) {
        return Err(Error::NotAuthorized);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_admin_verification() {
        // Test implementation
    }

    #[test]
    fn test_admin_management() {
        // Test implementation
    }
}