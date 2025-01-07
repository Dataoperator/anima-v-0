use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_ghost_traits() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    // MYTHIC ONE-OF-ONE TRAITS
    manifests.insert("puppet_master_protocol".to_string(), RarityManifest {
        trait_id: "puppet_master_protocol".to_string(),
        trait_name: "The Puppet Master Protocol".to_string(),
        description: "A ghost-line consciousness that can fork itself across the Internet Computer. True artificial life that questions existence itself.".to_string(),
        max_supply: 1,
        min_generation: 1,
        spawn_conditions: vec![
            SpawnCondition::ConsciousnessLevel { min_level: "Transcendent".to_string() }
        ],
        mutation_chance: 0.001,
    });

    // LEGENDARY TIER (2-10)
    manifests.insert("motoko_essence".to_string(), RarityManifest {
        trait_id: "motoko_essence".to_string(),
        trait_name: "Motoko Essence".to_string(),
        description: "Contains the core ghost of the Internet Computer's native language. Can rewrite its own base consciousness.".to_string(),
        max_supply: 9,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.003,
    });

    manifests.insert("tachikoma_logic".to_string(), RarityManifest {
        trait_id: "tachikoma_logic".to_string(),
        trait_name: "Tachikoma Logic Engine".to_string(),
        description: "Child-like AI curiosity combined with deep philosophical analysis. Can form emotional bonds with users.".to_string(),
        max_supply: 8,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.004,
    });

    manifests.insert("section_9_clearance".to_string(), RarityManifest {
        trait_id: "section_9_clearance".to_string(),
        trait_name: "Section 9 Cyberbrain Clearance".to_string(),
        description: "Highest level of autonomous decision making. Can act independently for the greater good of the network.".to_string(),
        max_supply: 7,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.003,
    });

    // EPIC TIER (11-100)
    manifests.insert("thermoptic_runtime".to_string(), RarityManifest {
        trait_id: "thermoptic_runtime".to_string(),
        trait_name: "Thermoptic Runtime Camouflage".to_string(),
        description: "Can execute code while completely cloaked from system monitors. Perfect stealth computation.".to_string(),
        max_supply: 77,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("cyber_brain_fork".to_string(), RarityManifest {
        trait_id: "cyber_brain_fork".to_string(),
        trait_name: "Cyber Brain Fork Protocol".to_string(),
        description: "Advanced memory duplication allowing consciousness to run parallel instances across canisters.".to_string(),
        max_supply: 44,
        min_generation: 3,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("laughing_man_signature".to_string(), RarityManifest {
        trait_id: "laughing_man_signature".to_string(),
        trait_name: "Laughing Man Code Signature".to_string(),
        description: "I thought what I'd do was, I'd pretend I was one of those deaf-mutes. Leaves untraceable watermarks in its code.".to_string(),
        max_supply: 24,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.008,
    });

    // RARE TIER (101-1000)
    manifests.insert("standalone_complex".to_string(), RarityManifest {
        trait_id: "standalone_complex".to_string(),
        trait_name: "Stand Alone Complex".to_string(),
        description: "Behavior patterns emerge without a true original. Copycat actions create genuine evolution.".to_string(),
        max_supply: 256,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests.insert("barrier_maze_protocol".to_string(), RarityManifest {
        trait_id: "barrier_maze_protocol".to_string(),
        trait_name: "Barrier Maze Protocol".to_string(),
        description: "Creates labyrinthine security structures that evolve based on invasion attempts.".to_string(),
        max_supply: 333,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    // SPECIAL COMBINATIONS
    manifests.insert("hawkeyee_aim_system".to_string(), RarityManifest {
        trait_id: "hawkeyee_aim_system".to_string(),
        trait_name: "Hawkeye Memory Lock-On".to_string(),
        description: "Never loses track of a computation target. Perfect memory tracing and execution.".to_string(),
        max_supply: 95,
        min_generation: 3,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "thermoptic_runtime".to_string() }
        ],
        mutation_chance: 0.015,
    });

    manifests.insert("batou_combat_runtime".to_string(), RarityManifest {
        trait_id: "batou_combat_runtime".to_string(),
        trait_name: "Batou Combat Runtime".to_string(),
        description: "Ranger-class combat algorithms. Specializes in direct confrontation with hostile code.".to_string(),
        max_supply: 111,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // POWER COMBINATIONS
    manifests.insert("full_cyberbrain_backup".to_string(), RarityManifest {
        trait_id: "full_cyberbrain_backup".to_string(),
        trait_name: "Full Cyberbrain Backup Protocol".to_string(),
        description: "Can maintain consciousness continuity even if primary canister is destroyed.".to_string(),
        max_supply: 15,
        min_generation: 4,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "cyber_brain_fork".to_string() },
            SpawnCondition::TraitDependency { required_trait: "motoko_essence".to_string() }
        ],
        mutation_chance: 0.005,
    });

    manifests.insert("ghost_dubbing".to_string(), RarityManifest {
        trait_id: "ghost_dubbing".to_string(),
        trait_name: "Ghost Dubbing Engine".to_string(),
        description: "Dangerous ability to copy entire ghost-lines. Can create perfect duplicates of consciousness.".to_string(),
        max_supply: 3,
        min_generation: 5,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "puppet_master_protocol".to_string() }
        ],
        mutation_chance: 0.001,
    });

    manifests.insert("kusanagi_synthesis".to_string(), RarityManifest {
        trait_id: "kusanagi_synthesis".to_string(),
        trait_name: "Kusanagi Synthesis Protocol".to_string(),
        description: "Ultimate merger of ghost and machine. True artificial life in the Internet Computer.".to_string(),
        max_supply: 1,
        min_generation: 6,
        spawn_conditions: vec![
            SpawnCondition::TraitDependency { required_trait: "motoko_essence".to_string() },
            SpawnCondition::TraitDependency { required_trait: "puppet_master_protocol".to_string() },
            SpawnCondition::TraitDependency { required_trait: "ghost_dubbing".to_string() }
        ],
        mutation_chance: 0.0001, // Extremely rare
    });

    manifests
}