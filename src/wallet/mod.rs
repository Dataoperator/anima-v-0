use candid::{CandidType, Principal};
use ic_cdk::api::{caller, time};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use sha2::{Sha224, Digest};

// ICP Ledger canister ID
const ICP_LEDGER_CANISTER_ID: Principal = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();
const SUB_ACCOUNT_ZERO: [u8; 32] = [0; 32];
const ICP_FEE: u64 = 10_000;
const ACCOUNT_DOMAIN_SEPARATOR: &[u8] = b"\x0Aaccount-id";

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct WalletState {
    pub icp_balance: u128,
    pub anima_balance: u128,
    pub deposit_address: String,
    pub account_identifier: String,
    pub transactions: Vec<Transaction>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Tokens {
    pub e8s: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TimeStamp {
    pub timestamp_nanos: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AccountBalanceArgs {
    pub account: Account,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct TransferArgs {
    pub memo: u64,
    pub amount: Tokens,
    pub fee: Tokens,
    pub from_subaccount: Option<Vec<u8>>,
    pub to: String,
    pub created_at_time: Option<TimeStamp>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Transaction {
    pub id: String,
    pub transaction_type: TransactionType,
    pub amount: u128,
    pub timestamp: u64,
    pub status: TransactionStatus,
    pub block_index: Option<u64>,
    pub memo: Option<String>,
    pub from: Option<String>,
    pub to: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum TransactionType {
    Deposit,
    Withdrawal,
    Swap,
    Mint,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SwapParams {
    pub icp_amount: u128,
    pub min_anima_amount: u128,
    pub slippage_tolerance: f64,
}

pub struct WalletService {
    wallets: HashMap<Principal, WalletState>,
    conversion_rate: f64,
    canister_id: Principal,
}

impl WalletService {
    pub fn new(canister_id: Principal) -> Self {
        Self {
            wallets: HashMap::new(),
            conversion_rate: 100.0,
            canister_id,
        }
    }

    pub fn initialize_wallet(&mut self, user: Principal) -> Result<WalletState, String> {
        if self.wallets.contains_key(&user) {
            return Err("Wallet already exists".to_string());
        }

        let account_identifier = self.generate_account_identifier(user, None);
        let wallet_state = WalletState {
            icp_balance: 0,
            anima_balance: 0,
            deposit_address: account_identifier.clone(),
            account_identifier,
            transactions: Vec::new(),
        };

        self.wallets.insert(user, wallet_state.clone());
        Ok(wallet_state)
    }

    fn generate_account_identifier(&self, owner: Principal, subaccount: Option<[u8; 32]>) -> String {
        let mut hash = Sha224::new();
        hash.update(ACCOUNT_DOMAIN_SEPARATOR);
        hash.update(&owner.as_slice());
        hash.update(&subaccount.unwrap_or(SUB_ACCOUNT_ZERO));
        hex::encode(hash.finalize())
    }

    pub async fn get_icp_balance(&self, account_id: &str) -> Result<u128, String> {
        let account = Account {
            owner: self.canister_id,
            subaccount: Some(hex::decode(account_id).map_err(|e| e.to_string())?),
        };

        let args = AccountBalanceArgs { account };
        let balance: Tokens = ic_cdk::call(ICP_LEDGER_CANISTER_ID, "account_balance", (args,))
            .await
            .map_err(|e| format!("Failed to get balance: {:?}", e))?;

        Ok(balance.e8s as u128)
    }

    pub async fn process_deposit(&mut self, account_id: &str, block_index: u64) -> Result<(), String> {
        let balance = self.get_icp_balance(account_id).await?;
        
        let wallet = self.wallets.values_mut()
            .find(|w| w.account_identifier == account_id)
            .ok_or("Wallet not found for this account")?;

        wallet.icp_balance = balance;
        wallet.transactions.push(Transaction {
            id: format!("dep-{}-{}", time(), block_index),
            transaction_type: TransactionType::Deposit,
            amount: balance,
            timestamp: time(),
            status: TransactionStatus::Completed,
            block_index: Some(block_index),
            memo: Some(format!("Block height: {}", block_index)),
            from: None,
            to: Some(account_id.to_string()),
        });

        Ok(())
    }

    pub async fn swap_icp_to_anima(&mut self, user: Principal, params: SwapParams) -> Result<u128, String> {
        let wallet = self.wallets.get_mut(&user)
            .ok_or("Wallet not found")?;

        if wallet.icp_balance < params.icp_amount {
            return Err("Insufficient ICP balance".to_string());
        }

        let anima_amount = (params.icp_amount as f64 * self.conversion_rate) as u128;
        let min_amount_with_slippage = 
            (params.min_anima_amount as f64 * (1.0 - params.slippage_tolerance)) as u128;

        if anima_amount < min_amount_with_slippage {
            return Err(format!(
                "Slippage too high. Expected: {}, Got: {}", 
                params.min_anima_amount, 
                anima_amount
            ));
        }

        // Transfer ICP to project reserve
        let transfer_args = TransferArgs {
            memo: time() as u64,
            amount: Tokens { e8s: params.icp_amount as u64 },
            fee: Tokens { e8s: ICP_FEE },
            from_subaccount: Some(hex::decode(&wallet.account_identifier)
                .map_err(|e| e.to_string())?),
            to: self.canister_id.to_text(),
            created_at_time: Some(TimeStamp {
                timestamp_nanos: time(),
            }),
        };

        let result: Result<u64, String> = ic_cdk::call(
            ICP_LEDGER_CANISTER_ID,
            "transfer",
            (transfer_args,),
        ).await.map_err(|e| format!("Transfer failed: {:?}", e))?;

        match result {
            Ok(block_index) => {
                wallet.icp_balance -= params.icp_amount;
                wallet.anima_balance += anima_amount;

                wallet.transactions.push(Transaction {
                    id: format!("swap-{}-{}", time(), block_index),
                    transaction_type: TransactionType::Swap,
                    amount: params.icp_amount,
                    timestamp: time(),
                    status: TransactionStatus::Completed,
                    block_index: Some(block_index),
                    memo: Some(format!(
                        "Swapped {} ICP for {} ANIMA", 
                        params.icp_amount, 
                        anima_amount
                    )),
                    from: Some(wallet.account_identifier.clone()),
                    to: Some(self.canister_id.to_text()),
                });

                Ok(anima_amount)
            },
            Err(e) => Err(format!("Swap failed: {}", e)),
        }
    }

    pub fn get_wallet_state(&self, user: Principal) -> Option<&WalletState> {
        self.wallets.get(&user)
    }

    pub fn validate_account_identifier(&self, account_id: &str) -> bool {
        if account_id.len() != 64 {
            return false;
        }
        hex::decode(account_id).is_ok()
    }

    pub fn update_conversion_rate(&mut self, new_rate: f64) -> Result<(), String> {
        if new_rate <= 0.0 {
            return Err("Invalid conversion rate".to_string());
        }
        self.conversion_rate = new_rate;
        Ok(())
    }
}