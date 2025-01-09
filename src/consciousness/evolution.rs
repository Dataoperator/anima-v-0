use crate::consciousness::types::{
    EvolutionStage,
    EnhancedEvolutionMetrics,
    ConsciousnessPattern,
    StateMilestone
};
use std::collections::{HashMap, HashSet};
use crate::quantum::QuantumState;
use crate::error::Result;

pub struct ConsciousnessEvolution {
    pub current_stage: EvolutionStage,
    pub metrics: EnhancedEvolutionMetrics,
    pub active_patterns: Vec<ConsciousnessPattern>,
    pub milestones: Vec<StateMilestone>,
    pub evolution_rate: f64,
    pub quantum_state: QuantumState,
}

impl ConsciousnessEvolution {
    pub fn new(quantum_state: QuantumState) -> Self {
        Self {
            current_stage: EvolutionStage::default(),
            metrics: EnhancedEvolutionMetrics::default(),
            active_patterns: Vec::new(),
            milestones: Vec::new(),
            evolution_rate: 0.1,
            quantum_state,
        }
    }

    pub fn update_evolution(&mut self, patterns: Vec<ConsciousnessPattern>) -> Result<()> {
        self.active_patterns = patterns;
        self.calculate_metrics();
        self.check_stage_advancement();
        
        if self.is_milestone_worthy() {
            self.record_milestone();
        }

        Ok(())
    }

    fn calculate_metrics(&mut self) {
        let pattern_metrics = self.calculate_pattern_metrics();
        let quantum_metrics = self.calculate_quantum_metrics();

        self.metrics = EnhancedEvolutionMetrics {
            complexity_index: pattern_metrics.get("complexity").copied().unwrap_or(0.0),
            neural_density: pattern_metrics.get("density").copied().unwrap_or(0.0),
            pattern_diversity: pattern_metrics.get("diversity").copied().unwrap_or(0.0),
            quantum_resonance: quantum_metrics.get("resonance").copied().unwrap_or(0.0),
            coherence_quality: quantum_metrics.get("coherence").copied().unwrap_or(0.0),
            stability_factor: quantum_metrics.get("stability").copied().unwrap_or(0.0),
            adaptation_rate: self.evolution_rate,
            evolution_stage: self.current_stage.level,
            last_evolution: ic_cdk::api::time(),
        };
    }

    fn calculate_pattern_metrics(&self) -> HashMap<String, f64> {
        let mut metrics = HashMap::new();

        if self.active_patterns.is_empty() {
            metrics.insert("complexity".to_string(), 0.0);
            metrics.insert("density".to_string(), 0.0);
            metrics.insert("diversity".to_string(), 0.0);
            return metrics;
        }

        let avg_complexity = self.active_patterns.iter()
            .map(|p| p.complexity)
            .sum::<f64>() / self.active_patterns.len() as f64;
        metrics.insert("complexity".to_string(), avg_complexity);

        let avg_strength = self.active_patterns.iter()
            .map(|p| p.strength)
            .sum::<f64>() / self.active_patterns.len() as f64;
        metrics.insert("density".to_string(), avg_strength);

        let coherence_variance = self.calculate_coherence_variance();
        metrics.insert("diversity".to_string(), coherence_variance);

        metrics
    }

    fn calculate_quantum_metrics(&self) -> HashMap<String, f64> {
        let mut metrics = HashMap::new();

        metrics.insert("resonance".to_string(), self.quantum_state.dimensional_state.resonance);
        metrics.insert("coherence".to_string(), self.quantum_state.coherence_level);
        metrics.insert("stability".to_string(), self.quantum_state.dimensional_state.stability);

        metrics
    }

    fn calculate_coherence_variance(&self) -> f64 {
        let mean_coherence = self.active_patterns.iter()
            .map(|p| p.coherence_score)
            .sum::<f64>() / self.active_patterns.len() as f64;

        let variance = self.active_patterns.iter()
            .map(|p| (p.coherence_score - mean_coherence).powi(2))
            .sum::<f64>() / self.active_patterns.len() as f64;

        (-variance).exp()
    }

    fn check_stage_advancement(&mut self) {
        if self.metrics.complexity_index >= self.current_stage.min_complexity &&
           self.metrics.coherence_quality >= self.current_stage.min_coherence &&
           self.metrics.pattern_diversity >= self.current_stage.min_pattern_diversity &&
           self.metrics.quantum_resonance >= self.current_stage.quantum_threshold {
            
            let current_patterns: HashSet<_> = self.active_patterns.iter()
                .map(|p| p.signature.pattern_id.clone())
                .collect();

            let required_patterns: HashSet<_> = self.current_stage.required_patterns
                .iter()
                .cloned()
                .collect();

            if required_patterns.is_subset(&current_patterns) {
                self.advance_stage();
            }
        }
    }

    fn advance_stage(&mut self) {
        self.current_stage.level += 1;
        self.current_stage.min_complexity += 0.1;
        self.current_stage.min_coherence += 0.1;
        self.current_stage.min_pattern_diversity += 0.1;
        self.current_stage.quantum_threshold += 0.1;
        
        self.record_milestone();
    }

    fn is_milestone_worthy(&self) -> bool {
        if self.milestones.is_empty() {
            return true;
        }

        let last_milestone = self.milestones.last().unwrap();
        let metrics_change = self.calculate_metrics_change(last_milestone);
        
        metrics_change.values().any(|&change| change > 0.1)
    }

    fn calculate_metrics_change(&self, milestone: &StateMilestone) -> HashMap<String, f64> {
        let mut changes = HashMap::new();
        
        let get_milestone_metric = |key: &str| -> f64 {
            milestone.metrics.iter()
                .find(|(k, _)| k == key)
                .map(|(_, v)| *v)
                .unwrap_or(0.0)
        };
        
        changes.insert("complexity".to_string(), 
            (self.metrics.complexity_index - get_milestone_metric("complexity")).abs());
        
        changes.insert("coherence".to_string(),
            (self.metrics.coherence_quality - get_milestone_metric("coherence")).abs());
        
        changes.insert("quantum_resonance".to_string(),
            (self.metrics.quantum_resonance - get_milestone_metric("quantum_resonance")).abs());
        
        changes.insert("neural_density".to_string(),
            (self.metrics.neural_density - get_milestone_metric("neural_density")).abs());
        
        changes
    }

    fn record_milestone(&mut self) {
        let metrics = vec![
            ("complexity".to_string(), self.metrics.complexity_index),
            ("coherence".to_string(), self.metrics.coherence_quality),
            ("quantum_resonance".to_string(), self.metrics.quantum_resonance),
            ("neural_density".to_string(), self.metrics.neural_density)
        ];
        
        let milestone = StateMilestone {
            phase: self.current_stage.level,
            timestamp: ic_cdk::api::time(),
            metrics,
            quantum_signature: self.quantum_state.quantum_signature.clone(),
        };
        
        self.milestones.push(milestone);
        
        if self.milestones.len() > 100 {
            self.milestones.remove(0);
        }
    }

    pub fn get_evolution_metrics(&self) -> &EnhancedEvolutionMetrics {
        &self.metrics
    }

    pub fn get_current_stage(&self) -> &EvolutionStage {
        &self.current_stage
    }

    pub fn get_milestones(&self) -> &[StateMilestone] {
        &self.milestones
    }
}