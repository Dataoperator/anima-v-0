use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;
use ic_stable_structures::Storable;

use crate::nft::types::TokenIdentifier;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Listing {
    pub token_id: TokenIdentifier,
    pub seller: Principal,
    pub price: u64,
    pub created_at: u64,
    pub expires_at: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Offer {
    pub token_id: TokenIdentifier,
    pub buyer: Principal,
    pub price: u64,
    pub created_at: u64,
    pub expires_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Default)]
pub struct MarketplaceState {
    pub listings: Vec<Listing>,
    pub offers: Vec<Offer>,
    pub sales_volume: u64,
    pub transaction_count: u64,
}

impl Storable for MarketplaceState {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        let bytes = candid::encode_one(self).unwrap();
        std::borrow::Cow::Owned(bytes)
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

impl MarketplaceState {
    pub fn list_token(
        &mut self,
        token_id: TokenIdentifier,
        seller: Principal,
        price: u64,
        expires_at: Option<u64>,
    ) -> Result<(), String> {
        // Add listing
        let listing = Listing {
            token_id,
            seller,
            price,
            created_at: time(),
            expires_at,
        };

        self.listings.push(listing);
        Ok(())
    }

    pub fn cancel_listing(
        &mut self,
        token_id: TokenIdentifier,
        seller: Principal,
    ) -> Result<(), String> {
        let listing_idx = self.listings
            .iter()
            .position(|l| l.token_id == token_id && l.seller == seller)
            .ok_or("Listing not found")?;

        self.listings.remove(listing_idx);
        Ok(())
    }

    pub fn make_offer(
        &mut self,
        token_id: TokenIdentifier,
        buyer: Principal,
        price: u64,
        expires_at: u64,
    ) -> Result<(), String> {
        if expires_at <= time() {
            return Err("Invalid expiry time".to_string());
        }

        let offer = Offer {
            token_id,
            buyer,
            price,
            created_at: time(),
            expires_at,
        };

        self.offers.push(offer);
        Ok(())
    }

    pub fn accept_offer(
        &mut self,
        token_id: TokenIdentifier,
        _seller: Principal,
        buyer: Principal,
    ) -> Result<(), String> {
        let offer_idx = self.offers
            .iter()
            .position(|o| o.token_id == token_id && o.buyer == buyer)
            .ok_or("Offer not found")?;

        let offer = self.offers.remove(offer_idx);
        
        self.sales_volume += offer.price;
        self.transaction_count += 1;

        Ok(())
    }

    pub fn clean_expired(&mut self) {
        let now = time();
        self.listings.retain(|l| l.expires_at.map(|exp| exp > now).unwrap_or(true));
        self.offers.retain(|o| o.expires_at > now);
    }
}

// Public API for marketplace operations
pub trait MarketplaceOperations {
    fn verify_token_ownership(&self, token_id: &TokenIdentifier, owner: &Principal) -> bool;
    fn transfer_token(&mut self, token_id: &TokenIdentifier, from: &Principal, to: &Principal) -> Result<(), String>;
}