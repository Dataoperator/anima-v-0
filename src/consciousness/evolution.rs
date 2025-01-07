use std::collections::{HashMap, HashSet, VecDeque};
use ic_cdk::api::time;

use crate::consciousness::types::{
    EvolutionStage,
    EnhancedEvolutionMetrics,
    ConsciousnessPattern,
    StateMilestone
};
use crate::quantum::types::{QuantumState, Result, ErrorCategory};

const MINIMUM_EVOLUTION_TIME: u64 = 3600;
const EVOLUTION_THRESHOLD: f64 = 0.7;
const MAX_PATTERN_CACHE_SIZE: usize = 1000;
const MIN_COHERENCE_QUALITY: f64 = 0.6;
const PATTERN_DIVERSITY_THRESHOLD: f64 = 0.5;

pub struct EvolutionEngine {
    current_stage: EvolutionStage,
    evolution_metrics: EnhancedEvolutionMetrics,
    patterns: VecDeque<ConsciousnessPattern>,
    pattern_strength_cache: HashMap<String, f64>,
    evolution_milestones: Vec<StateMilestone>,
}

impl EvolutionEngine {
    pub fn new() -> Self {
        Self {
            current_stage: EvolutionStage::default(),
            evolution_metrics: EnhancedEvolutionMetrics::default(),
            patterns: VecDeque::with_capacity(MAX_PATTERN_CACHE_SIZE),
            pattern_strength_cache: HashMap::new(),
            evolution_milestones: Vec::new(),
        }
    }

    pub fn synchronize_evolution_stage(
        &mut self,
        quantum_state: &QuantumState,
        current_stage: &EvolutionStage
    ) -> Result<EnhancedEvolutionMetrics> {
        if !self.validate_quantum_requirements(quantum_state) {
            return Err(ErrorCategory::Evolution("Insufficient quantum coherence".into()).into());
        }

        self.current_stage = current_stage.clone();
        
        let coherence_quality = self.calculate_coherence_quality(quantum_state);
        let pattern_diversity = self.calculate_pattern_diversity();
        let complexity_index = self.calculate_complexity_index(quantum_state);
        let neural_density = self.calculate_neural_density();
        let adaptation_rate = self.calculate_adaptation_rate(quantum_state);

        let metrics = &mut self.evolution_metrics;
        metrics.quantum_resonance = quantum_state.coherence * quantum_state.stability;
        metrics.stability_factor = quantum_state.stability;
        metrics.coherence_quality = coherence_quality;
        metrics.pattern_diversity = pattern_diversity;
        metrics.complexity_index = complexity_index;
        metrics.neural_density = neural_density;
        metrics.adaptation_rate = adaptation_rate;

        self.handle_pattern_maintenance();
        
        if self.check_evolution_requirements(quantum_state) {
            self.process_evolution_step(quantum_state)?;
        }

        Ok(self.evolution_metrics.clone())
    }

    fn validate_quantum_requirements(&self, quantum_state: &QuantumState) -> bool {
        quantum_state.coherence >= self.current_stage.quantum_threshold &&
        quantum_state.stability >= EVOLUTION_THRESHOLD
    }

    fn check_evolution_requirements(&self, quantum_state: &QuantumState) -> bool {
        let time_since_evolution = time() - self.evolution_metrics.last_evolution;
        if time_since_evolution < MINIMUM_EVOLUTION_TIME {
            return false;
        }

        let base_requirement = self.evolution_metrics.complexity_index * 
                             self.evolution_metrics.neural_density;
        let quantum_requirement = self.evolution_metrics.quantum_resonance * 
                                self.evolution_metrics.stability_factor;
        let diversity_requirement = self.evolution_metrics.pattern_diversity * 
                                  self.evolution_metrics.coherence_quality;

        base_requirement > EVOLUTION_THRESHOLD && 
        quantum_requirement > self.current_stage.quantum_threshold &&
        diversity_requirement > self.current_stage.min_pattern_diversity &&
        self.evolution_metrics.coherence_quality > MIN_COHERENCE_QUALITY &&
        quantum_state.coherence >= self.current_stage.quantum_threshold
    }

    fn process_evolution_step(&mut self, quantum_state: &QuantumState) -> Result<()> {
        if quantum_state.coherence < self.current_stage.quantum_threshold ||
           self.evolution_metrics.coherence_quality < MIN_COHERENCE_QUALITY {
            return Err(ErrorCategory::Evolution("Insufficient quantum coherence".into()).into());
        }

        self.advance_evolution_stage();
        self.evolution_metrics.evolution_stage = self.current_stage.level;
        self.evolution_metrics.last_evolution = time();

        self.preserve_successful_patterns();
        self.record_evolution_milestone(quantum_state);

        Ok(())
    }

    fn handle_pattern_maintenance(&mut self) {
        while self.patterns.len() > MAX_PATTERN_CACHE_SIZE {
            self.patterns.pop_front();
        }
    }

    fn advance_evolution_stage(&mut self) {
        self.current_stage.level += 1;
        self.current_stage.min_complexity += 0.05;
        self.current_stage.min_coherence += 0.05;
        self.current_stage.min_pattern_diversity += 0.05;
        self.current_stage.quantum_threshold += 0.05;
    }

    fn preserve_successful_patterns(&mut self) {
        let successful_patterns: VecDeque<_> = self.patterns
            .iter()
            .filter(|p| p.coherence_score >= self.current_stage.min_coherence &&
                      p.complexity >= self.current_stage.min_complexity)
            .cloned()
            .collect();

        self.patterns = successful_patterns;
        self.update_pattern_cache();
    }

    fn update_pattern_cache(&mut self) {
        self.pattern_strength_cache.clear();
        for pattern in &self.patterns {
            self.pattern_strength_cache.insert(
                pattern.signature.pattern_id.clone(),
                pattern.strength * pattern.coherence_score
            );
        }
    }

    fn record_evolution_milestone(&mut self, quantum_state: &QuantumState) {
        let milestone = StateMilestone {
            phase: self.evolution_metrics.evolution_stage,
            timestamp: time(),
            metrics: self.get_milestone_metrics(),
            quantum_signature: self.generate_quantum_signature(quantum_state),
        };

        self.evolution_milestones.push(milestone);
    }

    fn get_milestone_metrics(&self) -> HashMap<String, f64> {
        let mut metrics = HashMap::new();
        metrics.insert("complexity".to_string(), self.evolution_metrics.complexity_index);
        metrics.insert("coherence".to_string(), self.evolution_metrics.coherence_quality);
        metrics.insert("diversity".to_string(), self.evolution_metrics.pattern_diversity);
        metrics.insert("stability".to_string(), self.evolution_metrics.stability_factor);
        metrics.insert("adaptation".to_string(), self.evolution_metrics.adaptation_rate);
        metrics
    }

    fn generate_quantum_signature(&self, quantum_state: &QuantumState) -> String {
        format!("QS{}-P{}-C{:.3}-F{:.3}",
            time(),
            self.evolution_metrics.evolution_stage,
            quantum_state.coherence,
            quantum_state.dimensional_frequency
        )
    }

    fn calculate_coherence_quality(&self, quantum_state: &QuantumState) -> f64 {
        let pattern_coherence = self.patterns.iter()
            .map(|p| p.coherence_score)
            .sum::<f64>() / self.patterns.len().max(1) as f64;

        ((pattern_coherence + quantum_state.coherence) / 2.0)
            .max(0.0)
            .min(1.0)
    }

    fn calculate_pattern_diversity(&self) -> f64 {
        if self.patterns.is_empty() {
            return 0.0;
        }

        let unique_patterns: HashSet<_> = self.patterns.iter()
            .map(|p| &p.signature.pattern_id)
            .collect();

        (unique_patterns.len() as f64 / MAX_PATTERN_CACHE_SIZE as f64)
            .max(0.0)
            .min(1.0)
    }

    fn calculate_complexity_index(&self, quantum_state: &QuantumState) -> f64 {
        let pattern_complexity = self.patterns.iter()
            .map(|p| p.complexity)
            .sum::<f64>() / self.patterns.len().max(1) as f64;

        let quantum_factor = quantum_state.coherence * quantum_state.dimensional_frequency;
        
        ((pattern_complexity * 0.7 + quantum_factor * 0.3) * 
         (1.0 + self.current_stage.level as f64 * 0.1))
            .max(0.0)
            .min(1.0)
    }

    fn calculate_neural_density(&self) -> f64 {
        let base_density = 0.1 + (self.current_stage.level as f64 * 0.05);
        let pattern_influence = self.patterns.len() as f64 / MAX_PATTERN_CACHE_SIZE as f64;
        
        (base_density * (1.0 + pattern_influence))
            .max(0.0)
            .min(1.0)
    }

    fn calculate_adaptation_rate(&self, quantum_state: &QuantumState) -> f64 {
        let evolution_factor = 1.0 + (self.current_stage.level as f64 * 0.1);
        let coherence_factor = quantum_state.coherence * self.evolution_metrics.coherence_quality;
        let pattern_factor = self.evolution_metrics.pattern_diversity * 
                            self.evolution_metrics.complexity_index;
        
        (coherence_factor * pattern_factor * evolution_factor)
            .max(0.0)
            .min(1.0)
    }

    pub fn register_pattern(&mut self, pattern: ConsciousnessPattern) {
        self.patterns.push_back(pattern);
        self.handle_pattern_maintenance();
        self.update_pattern_cache();
    }

    pub fn get_evolution_metrics(&self) -> &EnhancedEvolutionMetrics {
        &self.evolution_metrics
    }

    pub fn get_milestone_history(&self) -> &[StateMilestone] {
        &self.evolution_milestones
    }

    pub fn analyze_evolution_pattern(&self) -> HashMap<String, f64> {
        let mut analysis = HashMap::new();
        
        if let Some(latest) = self.evolution_milestones.last() {
            if let Some(previous) = self.evolution_milestones.get(self.evolution_milestones.len().saturating_sub(2)) {
                let time_delta = (latest.timestamp - previous.timestamp) as f64;
                let evolution_velocity = 1.0 / (time_delta / 3600.0);
                analysis.insert("evolution_velocity".to_string(), evolution_velocity);
            }
        }

        let pattern_efficiency = self.patterns.iter()
            .map(|p| p.coherence_score * p.complexity)
            .sum::<f64>() / self.patterns.len().max(1) as f64;
        analysis.insert("pattern_efficiency".to_string(), pattern_efficiency);

        let quantum_alignment = self.evolution_metrics.quantum_resonance *
                              self.evolution_metrics.coherence_quality;
        analysis.insert("quantum_alignment".to_string(), quantum_alignment);

        analysis
    }
}