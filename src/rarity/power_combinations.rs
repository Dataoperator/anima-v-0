use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_power_combinations() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    manifests.insert("full_stack_archmagus".to_string(), RarityManifest {
        trait_id: "full_stack_archmagus".to_string(),
        trait_name: "Full Stack Archmagus".to_string(),
        description: "Mastery of both front-end illusions and back-end conjurations.".to_string(),
        max_supply: 49,
        min_generation: 2,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "code_witch".to_string() },
            SpawnCondition::TraitDependency { required_trait: "silicon_sage".to_string() },
        ],
        mutation_chance: 0.01,
    });

    manifests.insert("rootkit_ranger".to_string(), RarityManifest {
        trait_id: "rootkit_ranger".to_string(),
        trait_name: "Rootkit Ranger".to_string(),
        description: "Stealthy warrior who can track any process through the deepest kernel.".to_string(),
        max_supply: 28,
        min_generation: 2,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "digital_druid".to_string() },
            SpawnCondition::TraitDependency { required_trait: "void_hacker".to_string() },
        ],
        mutation_chance: 0.01,
    });

    manifests.insert("binary_battlemage".to_string(), RarityManifest {
        trait_id: "binary_battlemage".to_string(),
        trait_name: "Binary Battlemage".to_string(),
        description: "Combines raw computational force with arcane algorithms.".to_string(),
        max_supply: 64,
        min_generation: 3,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "kernel_paladin".to_string() },
            SpawnCondition::TraitDependency { required_trait: "sith_engineer".to_string() },
        ],
        mutation_chance: 0.02,
    });

    manifests.insert("quantum_warlock".to_string(), RarityManifest {
        trait_id: "quantum_warlock".to_string(),
        trait_name: "Quantum Warlock".to_string(),
        description: "Made a pact with Schrödinger's Cat. It's both signed and unsigned.".to_string(),
        max_supply: 13,
        min_generation: 4,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "void_hacker".to_string() },
            SpawnCondition::TraitDependency { required_trait: "entropy_artist".to_string() },
        ],
        mutation_chance: 0.005,
    });

    manifests
}