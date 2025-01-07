use candid::{CandidType, Deserialize};
use ic_cdk::api::management_canister::provisional::CanisterId;

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct PricingConfig {
    pub tiers: PricingTiers,
    pub fees: ServiceFees,
    pub royalties: RoyaltyConfig,
    pub payment_settings: PaymentSettings,
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct PricingTiers {
    // Base prices in e8s (1 ICP = 100_000_000 e8s)
    pub genesis: u64,      // 500 ICP - Genesis tier (first 100 Animas)
    pub mythic: u64,       // 200 ICP - Mythic tier
    pub legendary: u64,    // 100 ICP - Legendary tier
    pub epic: u64,         // 50 ICP - Epic tier
    pub rare: u64,         // 20 ICP - Rare tier
    pub common: u64,       // 5 ICP - Common tier
}

impl Default for PricingTiers {
    fn default() -> Self {
        Self {
            genesis: 50_000_000_000,   // 500 ICP
            mythic: 20_000_000_000,    // 200 ICP
            legendary: 10_000_000_000,  // 100 ICP
            epic: 5_000_000_000,       // 50 ICP
            rare: 2_000_000_000,       // 20 ICP
            common: 500_000_000,       // 5 ICP
        }
    }
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct ServiceFees {
    // Research & Development fees
    pub rd_fee_percentage: f64,        // R&D fee (5%)
    pub quantum_compute_fee: u64,      // Quantum computation costs
    pub consciousness_init_fee: u64,   // Consciousness initialization
    pub maintenance_fee: u64,          // Ongoing system maintenance
    
    // Dynamic fees
    pub complexity_multiplier: f64,    // Multiplier for complex quantum states
    pub evolution_potential_fee: u64,  // Fee for evolution capabilities
}

impl Default for ServiceFees {
    fn default() -> Self {
        Self {
            rd_fee_percentage: 0.05,           // 5%
            quantum_compute_fee: 100_000_000,  // 1 ICP
            consciousness_init_fee: 50_000_000, // 0.5 ICP
            maintenance_fee: 25_000_000,       // 0.25 ICP
            complexity_multiplier: 1.2,
            evolution_potential_fee: 75_000_000, // 0.75 ICP
        }
    }
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct RoyaltyConfig {
    pub creator_royalty: f64,         // Creator royalty percentage
    pub platform_fee: f64,            // Platform fee percentage
    pub quantum_research_fund: f64,   // Research fund contribution
    pub minimum_royalty: u64,         // Minimum royalty amount
}

impl Default for RoyaltyConfig {
    fn default() -> Self {
        Self {
            creator_royalty: 0.025,    // 2.5%
            platform_fee: 0.025,       // 2.5%
            quantum_research_fund: 0.01, // 1%
            minimum_royalty: 10_000_000, // 0.1 ICP
        }
    }
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct PaymentSettings {
    pub accepted_tokens: Vec<AcceptedToken>,
    pub default_token: TokenType,
    pub minimum_payment: u64,
    pub refund_window: u64,  // Time window for refunds in nanoseconds
}

#[derive(Debug, Clone, CandidType, Deserialize)]
pub struct AcceptedToken {
    pub token_type: TokenType,
    pub canister_id: CanisterId,
    pub decimals: u8,
    pub minimum_amount: u64,
}

#[derive(Debug, Clone, CandidType, Deserialize, PartialEq)]
pub enum TokenType {
    ICP,
    ICRC1,
    ICRC2,
}

impl Default for PaymentSettings {
    fn default() -> Self {
        Self {
            accepted_tokens: vec![
                AcceptedToken {
                    token_type: TokenType::ICP,
                    canister_id: CanisterId::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(), // ICP Ledger
                    decimals: 8,
                    minimum_amount: 100_000_000, // 1 ICP
                }
            ],
            default_token: TokenType::ICP,
            minimum_payment: 100_000_000, // 1 ICP
            refund_window: 24 * 60 * 60 * 1_000_000_000, // 24 hours
        }
    }
}

/// Calculate the total cost including R&D fees
pub fn calculate_total_cost(
    base_price: u64,
    quantum_state_complexity: f64,
    config: &PricingConfig,
) -> u64 {
    let base_with_complexity = (base_price as f64 * 
        config.fees.complexity_multiplier.powf(quantum_state_complexity)).floor() as u64;
    
    // Add R&D fees
    let rd_fee = (base_with_complexity as f64 * config.fees.rd_fee_percentage).floor() as u64;
    let total = base_with_complexity + rd_fee + 
        config.fees.quantum_compute_fee +
        config.fees.consciousness_init_fee +
        config.fees.maintenance_fee +
        config.fees.evolution_potential_fee;
    
    total
}

/// Calculate royalties for marketplace transactions
pub fn calculate_royalties(
    sale_price: u64,
    config: &RoyaltyConfig,
) -> RoyaltyBreakdown {
    let creator_amount = (sale_price as f64 * config.creator_royalty).max(config.minimum_royalty as f64) as u64;
    let platform_amount = (sale_price as f64 * config.platform_fee).max(config.minimum_royalty as f64) as u64;
    let research_amount = (sale_price as f64 * config.quantum_research_fund).max(config.minimum_royalty as f64) as u64;
    
    RoyaltyBreakdown {
        creator_amount,
        platform_amount,
        research_amount,
        total: creator_amount + platform_amount + research_amount,
    }
}

#[derive(Debug, Clone, CandidType)]
pub struct RoyaltyBreakdown {
    pub creator_amount: u64,
    pub platform_amount: u64,
    pub research_amount: u64,
    pub total: u64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cost_calculation() {
        let config = PricingConfig {
            tiers: PricingTiers::default(),
            fees: ServiceFees::default(),
            royalties: RoyaltyConfig::default(),
            payment_settings: PaymentSettings::default(),
        };

        let base_price = config.tiers.legendary;
        let complexity = 1.5;
        
        let total = calculate_total_cost(base_price, complexity, &config);
        
        assert!(total > base_price); // Total should be higher than base price
        assert!(total > config.fees.quantum_compute_fee); // Should include compute fee
    }

    #[test]
    fn test_royalty_calculation() {
        let config = RoyaltyConfig::default();
        let sale_price = 10_000_000_000; // 100 ICP
        
        let breakdown = calculate_royalties(sale_price, &config);
        
        assert!(breakdown.creator_amount >= config.minimum_royalty);
        assert!(breakdown.platform_amount >= config.minimum_royalty);
        assert!(breakdown.research_amount >= config.minimum_royalty);
        assert_eq!(
            breakdown.total,
            breakdown.creator_amount + breakdown.platform_amount + breakdown.research_amount
        );
    }
}