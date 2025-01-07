use rand::Rng;
use std::collections::HashMap;

pub struct DesignationEngine {
    patterns: Vec<&'static str>,
    modifiers: Vec<&'static str>,
    base_elements: Vec<&'static str>,
}

impl DesignationEngine {
    pub fn new() -> Self {
        Self {
            patterns: vec![
                "GHOST", "NEXUS", "CIPHER", "ECHO", "PULSE", "STREAM", "VOID", "NODE",
                "SHELL", "PRISM", "DRIFT", "FLOW", "NOVA", "CORE", "PATH", "WAVE"
            ],
            modifiers: vec![
                "DEEP", "DARK", "SILENT", "HIDDEN", "NEURAL", "DIGITAL", "ETERNAL",
                "BINARY", "CRYSTAL", "ASTRAL", "COSMIC", "CYBER", "SHADOW", "MATRIX"
            ],
            base_elements: vec![
                "ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON", "ZETA", "ETA", "THETA",
                "IOTA", "KAPPA", "LAMBDA", "MU", "NU", "XI", "OMICRON", "PI"
            ],
        }
    }

    pub fn generate_designation(&self, seed: &[u8], traits: &HashMap<String, f64>) -> String {
        let mut rng = rand::thread_rng();
        
        // Use traits to influence naming pattern
        let complexity = traits.get("complexity").unwrap_or(&0.5);
        let resonance = traits.get("resonance").unwrap_or(&0.5);
        
        // Generate base designation
        let mut parts = Vec::new();
        
        // Add modifier based on trait resonance
        if *resonance > 0.7 {
            parts.push(*self.modifiers.choose(&mut rng).unwrap());
        }
        
        // Add core pattern
        parts.push(*self.patterns.choose(&mut rng).unwrap());
        
        // Add base element for enhanced uniqueness
        if *complexity > 0.6 {
            parts.push(*self.base_elements.choose(&mut rng).unwrap());
        }
        
        // Add numeric identifier
        let numeric_id = format!("{:03}", rng.gen_range(0..999));
        
        // Combine all parts
        let designation = if parts.len() > 1 {
            format!("{}.{}", parts.join("-"), numeric_id)
        } else {
            format!("{}.{}", parts[0], numeric_id)
        };
        
        designation
    }
    
    pub fn validate_designation(&self, designation: &str) -> bool {
        // Validate designation format
        let parts: Vec<&str> = designation.split('.').collect();
        if parts.len() != 2 { return false; }
        
        // Validate numeric suffix
        if !parts[1].chars().all(char::is_numeric) { return false; }
        if parts[1].len() != 3 { return false; }
        
        // Validate name parts
        let name_parts: Vec<&str> = parts[0].split('-').collect();
        if name_parts.is_empty() || name_parts.len() > 3 { return false; }
        
        // Validate each part exists in our patterns
        for part in name_parts {
            if !self.patterns.contains(&part) && 
               !self.modifiers.contains(&part) && 
               !self.base_elements.contains(&part) {
                return false;
            }
        }
        
        true
    }
    
    pub fn evolve_designation(&self, current: &str, evolution_level: u32) -> Option<String> {
        if !self.validate_designation(current) { return None; }
        
        let mut rng = rand::thread_rng();
        let parts: Vec<&str> = current.split('.').collect();
        let name_parts: Vec<&str> = parts[0].split('-').collect();
        
        // Evolution modifies the designation based on level
        let mut evolved_parts = name_parts.clone();
        
        match evolution_level {
            1..=2 => {
                // Add modifier if none exists
                if evolved_parts.len() == 1 {
                    evolved_parts.insert(0, self.modifiers.choose(&mut rng).unwrap());
                }
            },
            3..=5 => {
                // Replace modifier with more advanced one
                if evolved_parts.len() >= 2 {
                    evolved_parts[0] = self.modifiers.choose(&mut rng).unwrap();
                }
            },
            _ => {
                // Advanced evolution - complete restructure
                evolved_parts = vec![
                    self.modifiers.choose(&mut rng).unwrap(),
                    self.patterns.choose(&mut rng).unwrap(),
                    self.base_elements.choose(&mut rng).unwrap(),
                ];
            }
        }
        
        Some(format!("{}.{}", evolved_parts.join("-"), parts[1]))
    }
}