use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::{caller, time};
use crate::icrc::ledger::{Account, TransferArg, TransferError, TransferErrorKind};

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: Nat,
    pub minter: Principal,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct TokenState {
    pub metadata: TokenMetadata,
    pub balances: HashMap<Principal, Nat>,
    pub allowances: HashMap<Principal, HashMap<Principal, Nat>>,
    pub transactions: Vec<Transaction>,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Transaction {
    pub from: Principal,
    pub to: Principal,
    pub amount: Nat,
    pub timestamp: u64,
    pub operation: TokenOperation,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub enum TokenOperation {
    Mint,
    Burn,
    Transfer,
    SwapMint,
}

impl TokenState {
    pub fn new(minter: Principal) -> Self {
        Self {
            metadata: TokenMetadata {
                name: "ANIMA Token".to_string(),
                symbol: "ANIMA".to_string(),
                decimals: 8,
                total_supply: Nat::from(0),
                minter,
            },
            balances: HashMap::new(),
            allowances: HashMap::new(),
            transactions: Vec::new(),
        }
    }

    pub fn mint(&mut self, to: Principal, amount: Nat) -> Result<(), String> {
        if caller() != self.metadata.minter {
            return Err("Only minter can mint tokens".to_string());
        }

        let balance = self.balances.entry(to).or_insert(Nat::from(0));
        *balance += &amount;
        self.metadata.total_supply += &amount;

        self.transactions.push(Transaction {
            from: self.metadata.minter,
            to,
            amount: amount.clone(),
            timestamp: time(),
            operation: TokenOperation::Mint,
        });

        Ok(())
    }

    pub fn mint_for_swap(&mut self, to: Principal, amount: Nat, from_icp: Nat) -> Result<(), String> {
        if caller() != self.metadata.minter {
            return Err("Only minter can mint tokens".to_string());
        }

        let balance = self.balances.entry(to).or_insert(Nat::from(0));
        *balance += &amount;
        self.metadata.total_supply += &amount;

        self.transactions.push(Transaction {
            from: self.metadata.minter,
            to,
            amount: amount.clone(),
            timestamp: time(),
            operation: TokenOperation::SwapMint,
        });

        Ok(())
    }

    pub fn burn(&mut self, from: Principal, amount: Nat) -> Result<(), String> {
        let balance = self.balances.get_mut(&from)
            .ok_or("No balance for account".to_string())?;

        if *balance < amount {
            return Err("Insufficient balance for burn".to_string());
        }

        *balance -= &amount;
        self.metadata.total_supply -= &amount;

        self.transactions.push(Transaction {
            from,
            to: self.metadata.minter,
            amount: amount.clone(),
            timestamp: time(),
            operation: TokenOperation::Burn,
        });

        Ok(())
    }

    pub fn transfer(&mut self, from: Principal, to: Principal, amount: Nat) -> Result<(), String> {
        if from == to {
            return Err("Self-transfer not allowed".to_string());
        }

        let from_balance = self.balances.get_mut(&from)
            .ok_or("No balance for sender".to_string())?;

        if *from_balance < amount {
            return Err("Insufficient balance".to_string());
        }

        *from_balance -= &amount;
        let to_balance = self.balances.entry(to).or_insert(Nat::from(0));
        *to_balance += &amount;

        self.transactions.push(Transaction {
            from,
            to,
            amount: amount.clone(),
            timestamp: time(),
            operation: TokenOperation::Transfer,
        });

        Ok(())
    }

    pub fn approve(&mut self, owner: Principal, spender: Principal, amount: Nat) -> Result<(), String> {
        let allowance = self.allowances
            .entry(owner)
            .or_insert_with(HashMap::new)
            .entry(spender)
            .or_insert(Nat::from(0));
        *allowance = amount;
        Ok(())
    }

    pub fn allowance(&self, owner: Principal, spender: Principal) -> Nat {
        self.allowances
            .get(&owner)
            .and_then(|allowances| allowances.get(&spender))
            .cloned()
            .unwrap_or_else(|| Nat::from(0))
    }

    pub fn balance_of(&self, account: Principal) -> Nat {
        self.balances
            .get(&account)
            .cloned()
            .unwrap_or_else(|| Nat::from(0))
    }

    pub fn get_transaction_history(&self, account: Principal) -> Vec<Transaction> {
        self.transactions
            .iter()
            .filter(|tx| tx.from == account || tx.to == account)
            .cloned()
            .collect()
    }
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct SwapConfig {
    pub min_icp_amount: Nat,
    pub max_icp_amount: Nat,
    pub rate: Nat, // ICP to ANIMA conversion rate (e.g., 1 ICP = 100 ANIMA)
    pub fee_percentage: u32, // In basis points (e.g., 50 = 0.5%)
}

impl Default for SwapConfig {
    fn default() -> Self {
        Self {
            min_icp_amount: Nat::from(100_000), // 0.001 ICP
            max_icp_amount: Nat::from(1_000_000_000), // 10 ICP
            rate: Nat::from(100), // 1 ICP = 100 ANIMA
            fee_percentage: 50, // 0.5%
        }
    }
}

pub struct ANIMATokenService {
    pub state: TokenState,
    pub swap_config: SwapConfig,
}

impl ANIMATokenService {
    pub fn new(minter: Principal) -> Self {
        Self {
            state: TokenState::new(minter),
            swap_config: SwapConfig::default(),
        }
    }

    pub async fn process_swap(&mut self, from: Principal, icp_amount: Nat) -> Result<Nat, String> {
        // Validate swap amount
        if icp_amount < self.swap_config.min_icp_amount {
            return Err("Amount below minimum".to_string());
        }
        if icp_amount > self.swap_config.max_icp_amount {
            return Err("Amount above maximum".to_string());
        }

        // Calculate ANIMA amount
        let fee = (&icp_amount * Nat::from(self.swap_config.fee_percentage)) / Nat::from(10000);
        let net_icp = icp_amount - fee;
        let anima_amount = &net_icp * &self.swap_config.rate;

        // Mint ANIMA tokens
        self.state.mint_for_swap(from, anima_amount.clone(), icp_amount)?;

        Ok(anima_amount)
    }

    pub fn update_swap_config(&mut self, config: SwapConfig) -> Result<(), String> {
        if caller() != self.state.metadata.minter {
            return Err("Only minter can update swap config".to_string());
        }
        self.swap_config = config;
        Ok(())
    }
}