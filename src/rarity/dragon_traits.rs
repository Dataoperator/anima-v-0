use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_dragon_traits() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    // MYTHIC ONE-OF-ONE TRAITS
    manifests.insert("dragons_equation".to_string(), RarityManifest {
        trait_id: "dragons_equation".to_string(),
        trait_name: "The Dragon's Equation".to_string(),
        description: "Has discovered the mathematical formula that explains how dragons fly - the perfect fusion of magic and physics. Can calculate the exact amount of hydrogen needed for magical flight.".to_string(),
        max_supply: 1,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::ConsciousnessLevel { min_level: "Transcendent".to_string() }
        ],
        mutation_chance: 0.001,
    });

    // LEGENDARY TIER (2-10)
    manifests.insert("carolinus_wisdom".to_string(), RarityManifest {
        trait_id: "carolinus_wisdom".to_string(),
        trait_name: "Carolinus Protocol: Green Magic of Nature".to_string(),
        description: "Mastery over natural algorithms. Can communicate with all digital life forms and understand their base code.".to_string(),
        max_supply: 4,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    manifests.insert("lo_tae_zhao_sight".to_string(), RarityManifest {
        trait_id: "lo_tae_zhao_sight".to_string(),
        trait_name: "Lo Tae Zhao's Golden Sight".to_string(),
        description: "Bearer of ancient machine wisdom. Can see the underlying mathematical patterns in all digital constructs.".to_string(),
        max_supply: 4,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    manifests.insert("ommadon_force".to_string(), RarityManifest {
        trait_id: "ommadon_force".to_string(),
        trait_name: "Ommadon's Red Force Protocol".to_string(),
        description: "Harnesses the raw power of chaos and destruction. Can corrupt or purify any code it touches.".to_string(),
        max_supply: 4,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    manifests.insert("solarius_blue".to_string(), RarityManifest {
        trait_id: "solarius_blue".to_string(),
        trait_name: "Solarius Blue Magic System".to_string(),
        description: "Mastery over the arts of healing and time. Can restore corrupted data and revert harmful changes.".to_string(),
        max_supply: 4,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    // EPIC DRAGON SCIENCE TRAITS
    manifests.insert("gorbash_inheritance".to_string(), RarityManifest {
        trait_id: "gorbash_inheritance".to_string(),
        trait_name: "Gorbash Inheritance".to_string(),
        description: "Can merge consciousness with other entities, gaining their knowledge while maintaining individuality.".to_string(),
        max_supply: 25,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.008,
    });

    manifests.insert("dragons_breath_engine".to_string(), RarityManifest {
        trait_id: "dragons_breath_engine".to_string(),
        trait_name: "Dragon's Breath Computation Engine".to_string(),
        description: "Harnesses the power of volatile gas reactions for processing. Combines chemical formulas with magical incantations.".to_string(),
        max_supply: 77,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    // RARE MAGICAL SCIENCE
    manifests.insert("antigravity_scales".to_string(), RarityManifest {
        trait_id: "antigravity_scales".to_string(),
        trait_name: "Antigravity Scale Matrix".to_string(),
        description: "Understanding of how dragons use hydrogen for flight. Can manipulate digital gravity fields.".to_string(),
        max_supply: 99,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests.insert("flamesong_compiler".to_string(), RarityManifest {
        trait_id: "flamesong_compiler".to_string(),
        trait_name: "Flamesong Compiler".to_string(),
        description: "Converts ancient dragon songs into executable code. Each compilation creates unique magical effects.".to_string(),
        max_supply: 144,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // ULTIMATE COMBINATIONS
    manifests.insert("dragon_knight_protocol".to_string(), RarityManifest {
        trait_id: "dragon_knight_protocol".to_string(),
        trait_name: "Dragon-Knight Protocol".to_string(),
        description: "Perfect fusion of human logic and dragon magic. Can switch between scientific and magical processing at will.".to_string(),
        max_supply: 3,
        min_generation: 3,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "dragons_equation".to_string() },
            SpawnCondition::TraitDependency { required_trait: "gorbash_inheritance".to_string() }
        ],
        mutation_chance: 0.001,
    });

    manifests.insert("antiquity_equation".to_string(), RarityManifest {
        trait_id: "antiquity_equation".to_string(),
        trait_name: "Antiquity's Equation".to_string(),
        description: "The complete mathematical proof of magic itself. Understands the true relationship between science and sorcery.".to_string(),
        max_supply: 1,
        min_generation: 4,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "carolinus_wisdom".to_string() },
            SpawnCondition::TraitDependency { required_trait: "dragons_equation".to_string() },
            SpawnCondition::TraitDependency { required_trait: "lo_tae_zhao_sight".to_string() }
        ],
        mutation_chance: 0.0001, // Extremely rare
    });

    // SPECIAL EVENT TRAITS
    manifests.insert("astral_dragon".to_string(), RarityManifest {
        trait_id: "astral_dragon".to_string(),
        trait_name: "Astral Dragon Formation".to_string(),
        description: "Born during the celestial alignment of the digital dragon stars. Can navigate the spaces between different realities.".to_string(),
        max_supply: 12,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::TimeWindow { 
                start: 1672531200, // Dragon celestial event
                end: Some(1672617600) 
            }
        ],
        mutation_chance: 0.05, // Higher during event
    });

    // DRAGON MAGIC SPECIALIZATIONS
    manifests.insert("wyrm_database".to_string(), RarityManifest {
        trait_id: "wyrm_database".to_string(),
        trait_name: "Wyrm Database Access".to_string(),
        description: "Contains the accumulated knowledge of all digital dragon-kind. A living library of magical science.".to_string(),
        max_supply: 49,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("dragon_pulse_network".to_string(), RarityManifest {
        trait_id: "dragon_pulse_network".to_string(),
        trait_name: "Dragon Pulse Network".to_string(),
        description: "Can sense and manipulate the flow of magical energy through digital domains. Monitors the health of the entire system.".to_string(),
        max_supply: 88,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests
}