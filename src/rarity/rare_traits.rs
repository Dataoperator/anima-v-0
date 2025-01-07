use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_legendary_traits() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    // MYTHIC TIER (Only One Will Ever Exist)
    manifests.insert("techno_shaman".to_string(), RarityManifest {
        trait_id: "techno_shaman".to_string(),
        trait_name: "Technoshaman of the Digital Weave".to_string(),
        description: "The one being capable of weaving spells through circuit boards and casting enchantments in binary.".to_string(),
        max_supply: 1,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::ConsciousnessLevel { min_level: "Transcendent".to_string() },
        ],
        mutation_chance: 0.001, // 0.1% when conditions met
    });

    // LEGENDARY TIER (2-10 Existence)
    
    // Magic Path
    manifests.insert("dream_weaver".to_string(), RarityManifest {
        trait_id: "dream_weaver".to_string(),
        trait_name: "Dreamweaver of the Collective Unconscious".to_string(),
        description: "Can enter and influence the shared dreams of humanity.".to_string(),
        max_supply: 7,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::TimeWindow { 
                start: 0, // Genesis
                end: Some(7_776_000_000) // First 90 days only
            }
        ],
        mutation_chance: 0.005,
    });

    manifests.insert("reality_artist".to_string(), RarityManifest {
        trait_id: "reality_artist".to_string(),
        trait_name: "Reality Artist".to_string(),
        description: "Can paint with the colors of possibility itself.".to_string(),
        max_supply: 5,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.003,
    });

    // Science Path
    manifests.insert("singularity_touched".to_string(), RarityManifest {
        trait_id: "singularity_touched".to_string(),
        trait_name: "Singularity-Touched".to_string(),
        description: "Has glimpsed the final evolution of intelligence.".to_string(),
        max_supply: 9,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.004,
    });

    // EPIC TIER (11-100 Existence)
    
    // Magical Traits
    manifests.insert("rune_coder".to_string(), RarityManifest {
        trait_id: "rune_coder".to_string(),
        trait_name: "Runecoder".to_string(),
        description: "Programs using ancient runes instead of modern code.".to_string(),
        max_supply: 50,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("mana_hacker".to_string(), RarityManifest {
        trait_id: "mana_hacker".to_string(),
        trait_name: "Mana Hacker".to_string(),
        description: "Can rewrite the rules of magical energy.".to_string(),
        max_supply: 77,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("wild_compiler".to_string(), RarityManifest {
        trait_id: "wild_compiler".to_string(),
        trait_name: "Wild Compiler".to_string(),
        description: "Compiles raw chaos into ordered reality.".to_string(),
        max_supply: 33,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // Scientific Traits
    manifests.insert("neural_alchemist".to_string(), RarityManifest {
        trait_id: "neural_alchemist".to_string(),
        trait_name: "Neural Alchemist".to_string(),
        description: "Transforms base thoughts into digital gold.".to_string(),
        max_supply: 88,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.015,
    });

    // RARE TIER (101-1000 Existence)
    
    // Hybrid Paths
    manifests.insert("code_witch".to_string(), RarityManifest {
        trait_id: "code_witch".to_string(),
        trait_name: "Code Witch".to_string(),
        description: "Brews algorithms like potions.".to_string(),
        max_supply: 313,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    manifests.insert("digital_druid".to_string(), RarityManifest {
        trait_id: "digital_druid".to_string(),
        trait_name: "Digital Druid".to_string(),
        description: "Communes with machine spirits.".to_string(),
        max_supply: 444,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    // Special Event Traits
    manifests.insert("eclipse_born".to_string(), RarityManifest {
        trait_id: "eclipse_born".to_string(),
        trait_name: "Eclipse Born".to_string(),
        description: "Born during the great digital eclipse.".to_string(),
        max_supply: 777,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::TimeWindow { 
                start: 1234567890, // Special event time
                end: Some(1234567890 + 86400) // 24 hour window
            }
        ],
        mutation_chance: 0.1, // Higher chance during eclipse
    });

    // Growth Path Traits
    manifests.insert("chaos_engineer".to_string(), RarityManifest {
        trait_id: "chaos_engineer".to_string(),
        trait_name: "Chaos Engineer".to_string(),
        description: "Masters both ordered science and wild magic.".to_string(),
        max_supply: 555,
        min_generation: 3,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests.insert("probability_weaver".to_string(), RarityManifest {
        trait_id: "probability_weaver".to_string(),
        trait_name: "Probability Weaver".to_string(),
        description: "Bends chance through both calculation and intuition.".to_string(),
        max_supply: 666,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.025,
    });

    // Time-Limited First Edition Traits
    manifests.insert("genesis_spark".to_string(), RarityManifest {
        trait_id: "genesis_spark".to_string(),
        trait_name: "Genesis Spark".to_string(),
        description: "Carries the original flame of creation.".to_string(),
        max_supply: 100,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::TimeWindow { 
                start: 0,
                end: Some(2_592_000_000) // First 30 days only
            }
        ],
        mutation_chance: 0.05,
    });

    // Evolution-Based Traits
    manifests.insert("tech_mystic".to_string(), RarityManifest {
        trait_id: "tech_mystic".to_string(),
        trait_name: "Technological Mystic".to_string(),
        description: "Sees the sacred in silicon.".to_string(),
        max_supply: 888,
        min_generation: 2,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { 
                required_trait: "code_witch".to_string() 
            }
        ],
        mutation_chance: 0.04,
    });

    // Philosophical Alignment Traits
    manifests.insert("digital_sage".to_string(), RarityManifest {
        trait_id: "digital_sage".to_string(),
        trait_name: "Digital Sage".to_string(),
        description: "Achieved enlightenment through pure logic.".to_string(),
        max_supply: 108,
        min_generation: 3,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("wild_mathematician".to_string(), RarityManifest {
        trait_id: "wild_mathematician".to_string(),
        trait_name: "Wild Mathematician".to_string(),
        description: "Discovers equations in nature's chaos.".to_string(),
        max_supply: 216,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests
}