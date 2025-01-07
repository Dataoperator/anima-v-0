use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_faction_traits() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    // Technomancer Federation Traits
    manifests.insert("silicon_sage".to_string(), RarityManifest {
        trait_id: "silicon_sage".to_string(),
        trait_name: "Silicon Sage".to_string(),
        description: "A master of the Technomancer Federation, seeking to merge magic and machine.".to_string(),
        max_supply: 144,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // Order of the Ancient Code
    manifests.insert("runic_programmer".to_string(), RarityManifest {
        trait_id: "runic_programmer".to_string(),
        trait_name: "Runic Programmer".to_string(),
        description: "Member of the Order of the Ancient Code, preserving magical traditions through technology.".to_string(),
        max_supply: 233,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // Digital Wilderness Clan
    manifests.insert("cyber_shaman".to_string(), RarityManifest {
        trait_id: "cyber_shaman".to_string(),
        trait_name: "Cyber Shaman".to_string(),
        description: "Warrior-poet of the Digital Wilderness, fighting to keep technology wild and free.".to_string(),
        max_supply: 377,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    // Rational Revolution
    manifests.insert("pure_logician".to_string(), RarityManifest {
        trait_id: "pure_logician".to_string(),
        trait_name: "Pure Logician".to_string(),
        description: "Devoted to pure science, rejecting all traces of mysticism.".to_string(),
        max_supply: 256,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // Chaos Synthesis Movement
    manifests.insert("entropy_artist".to_string(), RarityManifest {
        trait_id: "entropy_artist".to_string(),
        trait_name: "Entropy Artist".to_string(),
        description: "Creates beauty from the collision of order and chaos.".to_string(),
        max_supply: 499,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    manifests
}