use candid::{CandidType, Decode, Encode};
use ic_stable_structures::{Storable, Memory};
use std::{borrow::Cow, collections::HashMap};
use super::*;

impl Storable for AnimaState {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for AnimaToken {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for TokenMetadata {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for InteractionRecord {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl Storable for InteractionResponse {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Helper function for stable memory serialization
pub fn serialize_stable<T: CandidType>(value: &T) -> Vec<u8> {
    Encode!(value).unwrap()
}

// Helper function for stable memory deserialization
pub fn deserialize_stable<T: CandidType + for<'a> Deserialize<'a>>(bytes: &[u8]) -> T {
    Decode!(bytes, T).unwrap()
}

// Helper trait for memory operations
pub trait StableMemory {
    fn store<T: Storable>(&mut self, key: &str, value: &T);
    fn load<T: Storable>(&self, key: &str) -> Option<T>;
}