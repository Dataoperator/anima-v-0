use crate::consciousness::types::{
    EvolutionStage,
    EnhancedEvolutionMetrics,
    ConsciousnessPattern,
    StateMilestone
};
use std::collections::HashMap;
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
        // Update active patterns
        self.active_patterns = patterns;

        // Calculate new metrics
        self.calculate_metrics();

        // Check for stage advancement
        self.check_stage_advancement();

        // Record milestone if significant change
        if self.is_milestone_worthy() {
            self.record_milestone();
        }

        Ok(())
    }

    fn calculate_metrics(&mut self) {
        let pattern_metrics = self.calculate_pattern_metrics();
        let quantum_metrics = self.calculate_quantum_metrics();

        self.metrics = EnhancedEvolutionMetrics {
            complexity_index: pattern_metrics.get("complexity").unwrap_or(&0.0).clone(),
            neural_density: pattern_metrics.get("density").unwrap_or(&0.0).clone(),
            pattern_diversity: pattern_metrics.get("diversity").unwrap_or(&0.0).clone(),
            quantum_resonance: quantum_metrics.get("resonance").unwrap_or(&0.0).clone(),
            coherence_quality: quantum_metrics.get("coherence").unwrap_or(&0.0).clone(),
            stability_factor: quantum_metrics.get("stability").unwrap_or(&0.0).clone(),
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

        // Calculate complexity
        let avg_complexity = self.active_patterns.iter()
            .map(|p| p.complexity)
            .sum::<f64>() / self.active_patterns.len() as f64;
        metrics.insert("complexity".to_string(), avg_complexity);

        // Calculate neural density based on pattern strength
        let avg_strength = self.active_patterns.iter()
            .map(|p| p.strength)
            .sum::<f64>() / self.active_patterns.len() as f64;
        metrics.insert("density".to_string(), avg_strength);

        // Calculate pattern diversity
        let coherence_variance = self.calculate_coherence_variance();
        metrics.insert("diversity".to_string(), coherence_variance);

        metrics
    }

    fn calculate_quantum_metrics(&self) -> HashMap<String, f64> {
        let mut metrics = HashMap::new();

        // Calculate quantum resonance
        let resonance = self.quantum_state.dimensional_state.resonance;
        metrics.insert("resonance".to_string(), resonance);

        // Calculate coherence quality
        let coherence = self.quantum_state.coherence_level;
        metrics.insert("coherence".to_string(), coherence);

        // Calculate stability factor
        let stability = self.quantum_state.dimensional_state.stability;
        metrics.insert("stability".to_string(), stability);

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
            
            // Check if all required patterns are present
            let current_patterns: std::collections::HashSet<_> = self.active_patterns.iter()
                .map(|p| p.signature.pattern_id.clone())
                .collect();

            if self.current_stage.required_patterns.is_subset(&current_patterns) {
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
        
        // Record the advancement as a milestone
        self.record_milestone();
    }

    fn is_milestone_worthy(&self) -> bool {
        if self.milestones.is_empty() {
            return true;
        }

        let last_milestone = self.milestones.last().unwrap();
        let metrics_change = self.calculate_metrics_change(last_milestone);
        
        // Consider it milestone worthy if any metric changed significantly
        metrics_change.values().any(|&change| change > 0.1)
    }

    fn calculate_metrics_change(&self, milestone: &StateMilestone) -> HashMap<String, f64> {
        let mut changes = HashMap::new();
        
        // Compare current metrics with milestone metrics
        changes.insert("complexity".to_string(), 
            (self.metrics.complexity_index - milestone.metrics["complexity"].clone()).abs());
        
        changes.insert("coherence".to_string(),
            (self.metrics.coherence_quality - milestone.metrics["coherence"].clone()).abs());
        
        changes.insert("quantum_resonance".to_string(),
            (self.metrics.quantum_resonance - milestone.metrics["quantum_resonance"].clone()).abs());
        
        changes.insert("neural_density".to_string(),
            (self.metrics.neural_density - milestone.metrics["neural_density"].clone()).abs());
        
        changes
    }

    fn record_milestone(&mut self) {
        let mut metrics = HashMap::new();
        metrics.insert("complexity".to_string(), self.metrics.complexity_index);
        metrics.insert("coherence".to_string(), self.metrics.coherence_quality);
        metrics.insert("quantum_resonance".to_string(), self.metrics.quantum_resonance);
        metrics.insert("neural_density".to_string(), self.metrics.neural_density);
        
        let milestone = StateMilestone {
            phase: self.current_stage.level,
            timestamp: ic_cdk::api::time(),
            metrics,
            quantum_signature: self.quantum_state.quantum_signature.clone(),
        };
        
        self.milestones.push(milestone);
        
        // Keep only the most recent 100 milestones
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_milestone_recording() {
        let quantum_state = QuantumState::new();
        let mut evolution = ConsciousnessEvolution::new(quantum_state);
        
        evolution.record_milestone();
        assert_eq!(evolution.milestones.len(), 1);
        
        let milestone = &evolution.milestones[0];
        assert_eq!(milestone.phase, 0);
        assert!(milestone.metrics.contains_key("complexity"));
        assert!(milestone.metrics.contains_key("coherence"));
    }

    #[test]
    fn test_metrics_calculation() {
        let quantum_state = QuantumState::new();
        let mut evolution = ConsciousnessEvolution::new(quantum_state);
        
        evolution.calculate_metrics();
        let metrics = evolution.get_evolution_metrics();
        
        assert!(metrics.complexity_index >= 0.0 && metrics.complexity_index <= 1.0);
        assert!(metrics.coherence_quality >= 0.0 && metrics.coherence_quality <= 1.0);
        assert!(metrics.quantum_resonance >= 0.0 && metrics.quantum_resonance <= 1.0);
    }
}