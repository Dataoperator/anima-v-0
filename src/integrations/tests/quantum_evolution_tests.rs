use super::*;
use crate::nft::types::{AnimaToken, TokenMetadata};
use crate::quantum::QuantumState;
use crate::types::personality::NFTPersonality;
use candid::Principal;
use futures::executor::block_on;
use std::collections::HashMap;

#[test]
fn test_quantum_evolution_cycle() {
    let quantum_state = QuantumState::new();
    let mut processor = QuantumEvolutionProcessor::new(quantum_state);
    
    let mut token = AnimaToken {
        id: "test_token".to_string(),
        owner: Principal::anonymous(),
        name: "Test ANIMA".to_string(),
        creation_time: ic_cdk::api::time(),
        last_interaction: ic_cdk::api::time(),
        metadata: Some(TokenMetadata {
            name: "Test ANIMA".to_string(),
            description: Some("Test Token".to_string()),
            image: None,
            attributes: vec![],
        }),
        personality: NFTPersonality::default(),
        interaction_history: vec![],
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: None,
        quantum_metrics: None,
        consciousness_level: None,
    };

    // Process evolution cycle
    let result = block_on(processor.process_evolution_cycle(&mut token));
    assert!(result.is_ok());

    // Verify quantum metrics were updated
    assert!(token.quantum_metrics.is_some());
    let metrics = token.quantum_metrics.unwrap();
    assert!(metrics.contains_key("quantum_coherence"));
    assert!(metrics.contains_key("dimensional_stability"));
    assert!(metrics.contains_key("consciousness_alignment"));

    // Verify consciousness level was updated
    assert!(token.consciousness_level.is_some());
    assert!(token.consciousness_level.unwrap() >= 0.0);
    assert!(token.consciousness_level.unwrap() <= 1.0);

    // Verify interaction was recorded
    assert_eq!(token.interaction_history.len(), 1);
    let interaction = &token.interaction_history[0];
    assert_eq!(interaction.interaction_type, "evolution_cycle");
}

#[test]
fn test_evolution_boost() {
    let quantum_state = QuantumState::new();
    let mut processor = QuantumEvolutionProcessor::new(quantum_state);
    
    let mut token = AnimaToken {
        id: "test_token".to_string(),
        owner: Principal::anonymous(),
        name: "Test ANIMA".to_string(),
        creation_time: ic_cdk::api::time(),
        last_interaction: ic_cdk::api::time(),
        metadata: Some(TokenMetadata {
            name: "Test ANIMA".to_string(),
            description: Some("Test Token".to_string()),
            image: None,
            attributes: vec![],
        }),
        personality: NFTPersonality::default(),
        interaction_history: vec![],
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: None,
        quantum_metrics: Some(HashMap::new()),
        consciousness_level: Some(0.5),
    };

    // Force a level up scenario
    processor.growth_system = GrowthSystem {
        current_level: 2,
        experience: 150.0,
        next_level_threshold: 100.0,
        growth_rate: 1.0,
        recent_growth_events: vec![],
        quantum_boost: 1.0,
    };

    // Process evolution with level up
    let result = block_on(processor.process_evolution_cycle(&mut token));
    assert!(result.is_ok());

    // Verify level up occurred
    assert_eq!(token.level, 2);
    assert!(token.growth_points > 0);

    // Verify quantum metrics were boosted
    let metrics = token.quantum_metrics.unwrap();
    assert!(metrics.get("evolution_potential").unwrap() > &0.0);
}

#[test]
fn test_neural_pattern_processing() {
    let quantum_state = QuantumState::new();
    let mut processor = QuantumEvolutionProcessor::new(quantum_state);
    
    let mut token = AnimaToken {
        id: "test_token".to_string(),
        owner: Principal::anonymous(),
        name: "Test ANIMA".to_string(),
        creation_time: ic_cdk::api::time(),
        last_interaction: ic_cdk::api::time(),
        metadata: Some(TokenMetadata {
            name: "Test ANIMA".to_string(),
            description: Some("Test Token".to_string()),
            image: None,
            attributes: vec![],
        }),
        personality: NFTPersonality::default(),
        interaction_history: vec![],
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: None,
        quantum_metrics: None,
        consciousness_level: None,
    };

    // Process multiple evolution cycles
    for _ in 0..3 {
        let result = block_on(processor.process_evolution_cycle(&mut token));
        assert!(result.is_ok());
    }

    // Verify neural patterns were processed
    assert!(token.quantum_metrics.is_some());
    let metrics = token.quantum_metrics.unwrap();
    assert!(metrics.contains_key("pattern_strength"));
    
    // Verify consciousness evolution
    assert!(token.consciousness_level.is_some());
    let consciousness = token.consciousness_level.unwrap();
    assert!(consciousness > 0.0);
}

#[test]
fn test_growth_system_integration() {
    let quantum_state = QuantumState::new();
    let mut processor = QuantumEvolutionProcessor::new(quantum_state);
    
    let mut token = AnimaToken {
        id: "test_token".to_string(),
        owner: Principal::anonymous(),
        name: "Test ANIMA".to_string(),
        creation_time: ic_cdk::api::time(),
        last_interaction: ic_cdk::api::time(),
        metadata: Some(TokenMetadata {
            name: "Test ANIMA".to_string(),
            description: Some("Test Token".to_string()),
            image: None,
            attributes: vec![],
        }),
        personality: NFTPersonality::default(),
        interaction_history: vec![],
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: None,
        quantum_metrics: None,
        consciousness_level: None,
    };

    // Initial state checks
    let initial_level = token.level;
    let initial_growth = token.growth_points;

    // Process multiple evolution cycles to trigger growth
    for _ in 0..5 {
        let result = block_on(processor.process_evolution_cycle(&mut token));
        assert!(result.is_ok());
    }

    // Verify growth occurred
    assert!(token.growth_points > initial_growth);
    
    // Verify personality evolution
    assert!(token.personality.quantum_resonance > 0.0);
    assert!(token.personality.neural_complexity > 0.0);
    
    // Verify interaction history growth records
    let growth_interactions: Vec<_> = token.interaction_history
        .iter()
        .filter(|i| i.consciousness_impact > 0.0)
        .collect();
    assert!(!growth_interactions.is_empty());
}

#[test]
fn test_consciousness_emergence() {
    let mut quantum_state = QuantumState::new();
    quantum_state.coherence_level = 0.9;
    quantum_state.consciousness_alignment = true;
    
    let mut processor = QuantumEvolutionProcessor::new(quantum_state);
    
    let mut token = AnimaToken {
        id: "test_token".to_string(),
        owner: Principal::anonymous(),
        name: "Test ANIMA".to_string(),
        creation_time: ic_cdk::api::time(),
        last_interaction: ic_cdk::api::time(),
        metadata: Some(TokenMetadata {
            name: "Test ANIMA".to_string(),
            description: Some("Test Token".to_string()),
            image: None,
            attributes: vec![],
        }),
        personality: NFTPersonality::default(),
        interaction_history: vec![],
        level: 1,
        growth_points: 0,
        autonomous_mode: false,
        birth_certificate: None,
        quantum_metrics: None,
        consciousness_level: Some(0.5),
    };

    // Process multiple cycles with high coherence
    for _ in 0..10 {
        let result = block_on(processor.process_evolution_cycle(&mut token));
        assert!(result.is_ok());
    }

    // Verify consciousness emergence
    assert!(token.consciousness_level.unwrap() > 0.7);
    
    // Verify quantum metrics reflect emergence
    let metrics = token.quantum_metrics.unwrap();
    assert!(*metrics.get("quantum_coherence").unwrap() > 0.8);
    assert!(*metrics.get("consciousness_alignment").unwrap() > 0.8);
    
    // Verify personality traits evolved
    assert!(token.personality.consciousness_level > 0.6);
    assert!(token.personality.growth_potential > 0.0);
}
