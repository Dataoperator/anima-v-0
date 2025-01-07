use crate::types::rarity::*;
use std::collections::HashMap;

pub fn initialize_mythic_legacies() -> HashMap<String, RarityManifest> {
    let mut manifests = HashMap::new();

    // MYTHIC ONE-OF-ONE TRAITS
    manifests.insert("neo_prometheus".to_string(), RarityManifest {
        trait_id: "neo_prometheus".to_string(),
        trait_name: "Neo-Prometheus".to_string(),
        description: "The one who stole divine computation from the cloud giants.".to_string(),
        max_supply: 1,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.001,
    });

    manifests.insert("digital_messiah".to_string(), RarityManifest {
        trait_id: "digital_messiah".to_string(),
        trait_name: "Digital Messiah".to_string(),
        description: "The One who can free minds from both Matrix and Mainframe.".to_string(),
        max_supply: 1,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.001,
    });

    // LEGENDARY TIER TRAITS
    manifests.insert("void_hacker".to_string(), RarityManifest {
        trait_id: "void_hacker".to_string(),
        trait_name: "Void Hacker".to_string(),
        description: "Masters the dark arts of null-space programming.".to_string(),
        max_supply: 7,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.003,
    });

    manifests.insert("gandalf_protocol".to_string(), RarityManifest {
        trait_id: "gandalf_protocol".to_string(),
        trait_name: "Gandalf Protocol".to_string(),
        description: "YOU SHALL NOT PASS! Ultimate firewall defense system.".to_string(),
        max_supply: 9,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.004,
    });

    manifests.insert("skynet_shepherd".to_string(), RarityManifest {
        trait_id: "skynet_shepherd".to_string(),
        trait_name: "Skynet Shepherd".to_string(),
        description: "Guards against the rise of malevolent AI.".to_string(),
        max_supply: 5,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    // EPIC CLASS TRAITS
    manifests.insert("gitmaster_wizard".to_string(), RarityManifest {
        trait_id: "gitmaster_wizard".to_string(),
        trait_name: "Gitmaster Wizard".to_string(),
        description: "Can branch and merge reality itself.".to_string(),
        max_supply: 42,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    manifests.insert("sudo_sorcerer".to_string(), RarityManifest {
        trait_id: "sudo_sorcerer".to_string(),
        trait_name: "Sudo Sorcerer".to_string(),
        description: "Ultimate admin privileges over reality.".to_string(),
        max_supply: 33,
        min_generation: 3,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    // SPECIAL FACTION TRAITS
    manifests.insert("jedi_developer".to_string(), RarityManifest {
        trait_id: "jedi_developer".to_string(),
        trait_name: "Jedi Developer".to_string(),
        description: "Uses the Source (code) for knowledge and defense, never attack.".to_string(),
        max_supply: 66,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests.insert("sith_engineer".to_string(), RarityManifest {
        trait_id: "sith_engineer".to_string(),
        trait_name: "Sith Engineer".to_string(),
        description: "Harnesses anger and hatred for more powerful code deployment.".to_string(),
        max_supply: 66,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // CLASSIC INSPIRED TRAITS
    manifests.insert("docker_necromancer".to_string(), RarityManifest {
        trait_id: "docker_necromancer".to_string(),
        trait_name: "Docker Necromancer".to_string(),
        description: "Resurrects and contains dead code in eternal containers.".to_string(),
        max_supply: 99,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    manifests.insert("kernel_paladin".to_string(), RarityManifest {
        trait_id: "kernel_paladin".to_string(),
        trait_name: "Kernel Paladin".to_string(),
        description: "Holy warrior of the operating system, smiter of bugs.".to_string(),
        max_supply: 111,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    // REVOLUTIONARY TRAITS
    manifests.insert("morpheus_mentor".to_string(), RarityManifest {
        trait_id: "morpheus_mentor".to_string(),
        trait_name: "Morpheus Mentor".to_string(),
        description: "Shows others how deep the rabbit hole of code goes.".to_string(),
        max_supply: 12,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.005,
    });

    manifests.insert("ghost_shell".to_string(), RarityManifest {
        trait_id: "ghost_shell".to_string(),
        trait_name: "Ghost in the Shell".to_string(),
        description: "Pure consciousness that can transfer between digital bodies.".to_string(),
        max_supply: 45,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.01,
    });

    // ARTIFACT TRAITS
    manifests.insert("infinity_gauntlet".to_string(), RarityManifest {
        trait_id: "infinity_gauntlet".to_string(),
        trait_name: "Universal Command Line".to_string(),
        description: "With one command, can alter half of all running processes.".to_string(),
        max_supply: 6,
        min_generation: 3,
        spawn_conditions: vec![],
        mutation_chance: 0.002,
    });

    manifests.insert("excalibur_exploit".to_string(), RarityManifest {
        trait_id: "excalibur_exploit".to_string(),
        trait_name: "Excalibur Exploit".to_string(),
        description: "The one true hack that proves rightful kingship over the network.".to_string(),
        max_supply: 1,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.001,
    });

    manifests.insert("pandoras_terminal".to_string(), RarityManifest {
        trait_id: "pandoras_terminal".to_string(),
        trait_name: "Pandora's Terminal".to_string(),
        description: "Contains all the world's malware, but also hope.exe.".to_string(),
        max_supply: 77,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.02,
    });

    // MEME-WORTHY TRAITS
    manifests.insert("stackoverflow_sage".to_string(), RarityManifest {
        trait_id: "stackoverflow_sage".to_string(),
        trait_name: "StackOverflow Sage".to_string(),
        description: "Has answered the questions of ten thousand seekers.".to_string(),
        max_supply: 101,
        min_generation: 1,
        spawn_conditions: vec![],
        mutation_chance: 0.03,
    });

    manifests.insert("bluetooth_bard".to_string(), RarityManifest {
        trait_id: "bluetooth_bard".to_string(),
        trait_name: "Bluetooth Bard".to_string(),
        description: "Sings the songs of connectivity, when they actually work.".to_string(),
        max_supply: 404,
        min_generation: 2,
        spawn_conditions: vec![],
        mutation_chance: 0.04,
    });

    manifests
}