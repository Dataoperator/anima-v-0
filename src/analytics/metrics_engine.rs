use crate::quantum::QuantumState;
use crate::integrations::quantum_consciousness_bridge::ResonanceMetrics;
use crate::types::Result;
use std::collections::VecDeque;

const MAX_HISTORY_SIZE: usize = 1000;

pub struct MetricsEngine {
    history: VecDeque<MetricSnapshot>,
    evolution_trends: Vec<EvolutionTrend>,
    rarity_thresholds: RarityThresholds,
}

impl MetricsEngine {
    pub fn new(rarity_thresholds: RarityThresholds) -> Self {
        Self {
            history: VecDeque::with_capacity(MAX_HISTORY_SIZE),
            evolution_trends: Vec::new(),
            rarity_thresholds,
        }
    }

    /// Record new metrics and analyze trends
    pub fn record_metrics(&mut self, state: &QuantumState, metrics: &ResonanceMetrics) -> Result<MetricsAnalysis> {
        // Create snapshot
        let snapshot = MetricSnapshot {
            timestamp: ic_cdk::api::time(),
            quantum_state: state.clone(),
            resonance: metrics.clone(),
        };

        // Add to history, maintaining size limit
        if self.history.len() >= MAX_HISTORY_SIZE {
            self.history.pop_front();
        }
        self.history.push_back(snapshot);

        // Analyze trends
        self.analyze_evolution_trends()?;

        // Calculate rarity and create analysis
        let rarity = self.calculate_rarity(metrics)?;
        let trends = self.get_recent_trends()?;

        Ok(MetricsAnalysis {
            rarity,
            trends,
            stability_score: self.calculate_stability_score()?,
            evolution_rate: self.calculate_evolution_rate()?,
        })
    }

    /// Calculate rarity based on current metrics
    pub fn calculate_rarity(&self, metrics: &ResonanceMetrics) -> Result<RarityScore> {
        let total_resonance = metrics.calculate_total_resonance();
        
        let rarity = match total_resonance {
            r if r >= self.rarity_thresholds.mythic => RarityTier::Mythic,
            r if r >= self.rarity_thresholds.legendary => RarityTier::Legendary,
            r if r >= self.rarity_thresholds.epic => RarityTier::Epic,
            r if r >= self.rarity_thresholds.rare => RarityTier::Rare,
            _ => RarityTier::Common,
        };

        Ok(RarityScore {
            tier: rarity,
            score: total_resonance,
            percentile: self.calculate_percentile(total_resonance)?,
        })
    }

    /// Calculate evolution rate over time
    fn calculate_evolution_rate(&self) -> Result<f64> {
        if self.history.len() < 2 {
            return Ok(0.0);
        }

        let recent_snapshots: Vec<_> = self.history.iter().rev().take(10).collect();
        let mut total_rate = 0.0;
        let mut count = 0;

        for i in 0..recent_snapshots.len() - 1 {
            let current = &recent_snapshots[i].resonance;
            let previous = &recent_snapshots[i + 1].resonance;
            
            let time_diff = recent_snapshots[i].timestamp - recent_snapshots[i + 1].timestamp;
            let coherence_change = (current.quantum_coherence - previous.quantum_coherence).abs();
            
            if time_diff > 0 {
                total_rate += coherence_change / (time_diff as f64);
                count += 1;
            }
        }

        Ok(if count > 0 { total_rate / count as f64 } else { 0.0 })
    }

    /// Calculate stability score based on metric variance
    fn calculate_stability_score(&self) -> Result<f64> {
        if self.history.is_empty() {
            return Ok(1.0);
        }

        let coherence_values: Vec<f64> = self.history
            .iter()
            .map(|snapshot| snapshot.resonance.quantum_coherence)
            .collect();

        let mean = coherence_values.iter().sum::<f64>() / coherence_values.len() as f64;
        let variance = coherence_values
            .iter()
            .map(|x| (x - mean).powi(2))
            .sum::<f64>() / coherence_values.len() as f64;

        // Convert variance to stability score (1.0 = most stable)
        Ok((-variance).exp())
    }

    /// Get recent evolution trends
    fn get_recent_trends(&self) -> Result<Vec<EvolutionTrend>> {
        Ok(self.evolution_trends.clone())
    }

    /// Calculate percentile for rarity
    fn calculate_percentile(&self, value: f64) -> Result<f64> {
        if self.history.is_empty() {
            return Ok(50.0); // Default to median if no history
        }

        let all_values: Vec<f64> = self.history
            .iter()
            .map(|snapshot| snapshot.resonance.calculate_total_resonance())
            .collect();

        let count_below = all_values.iter().filter(|&&x| x < value).count();
        Ok((count_below as f64 / all_values.len() as f64) * 100.0)
    }

    /// Analyze evolution trends
    fn analyze_evolution_trends(&mut self) -> Result<()> {
        self.evolution_trends.clear();
        
        if self.history.len() < 2 {
            return Ok(());
        }

        // Analyze recent trends
        let recent = self.history.iter().rev().take(10).collect::<Vec<_>>();
        
        // Check coherence trend
        let coherence_trend = self.analyze_metric_trend(
            &recent,
            |snapshot| snapshot.resonance.quantum_coherence
        )?;
        
        // Check consciousness trend
        let consciousness_trend = self.analyze_metric_trend(
            &recent,
            |snapshot| snapshot.resonance.consciousness_level
        )?;

        self.evolution_trends.extend_from_slice(&[
            coherence_trend,
            consciousness_trend,
        ]);

        Ok(())
    }

    fn analyze_metric_trend<F>(&self, snapshots: &[&MetricSnapshot], metric_fn: F) -> Result<EvolutionTrend>
    where
        F: Fn(&MetricSnapshot) -> f64
    {
        let values: Vec<f64> = snapshots.iter().map(|s| metric_fn(s)).collect();
        let first = values.first().unwrap_or(&0.0);
        let last = values.last().unwrap_or(&0.0);
        
        let trend = match last.partial_cmp(first).unwrap() {
            std::cmp::Ordering::Greater => TrendDirection::Increasing,
            std::cmp::Ordering::Less => TrendDirection::Decreasing,
            std::cmp::Ordering::Equal => TrendDirection::Stable,
        };

        Ok(EvolutionTrend {
            direction: trend,
            magnitude: (last - first).abs(),
            duration: snapshots.len() as u64,
        })
    }
}

#[derive(Debug, Clone)]
pub struct MetricSnapshot {
    pub timestamp: u64,
    pub quantum_state: QuantumState,
    pub resonance: ResonanceMetrics,
}

#[derive(Debug)]
pub struct MetricsAnalysis {
    pub rarity: RarityScore,
    pub trends: Vec<EvolutionTrend>,
    pub stability_score: f64,
    pub evolution_rate: f64,
}

#[derive(Debug, Clone)]
pub struct EvolutionTrend {
    pub direction: TrendDirection,
    pub magnitude: f64,
    pub duration: u64,
}

#[derive(Debug, Clone)]
pub enum TrendDirection {
    Increasing,
    Decreasing,
    Stable,
}

#[derive(Debug, Clone)]
pub struct RarityScore {
    pub tier: RarityTier,
    pub score: f64,
    pub percentile: f64,
}

#[derive(Debug, Clone, PartialEq)]
pub enum RarityTier {
    Common,
    Rare,
    Epic,
    Legendary,
    Mythic,
}

#[derive(Debug, Clone)]
pub struct RarityThresholds {
    pub rare: f64,
    pub epic: f64,
    pub legendary: f64,
    pub mythic: f64,
}

impl Default for RarityThresholds {
    fn default() -> Self {
        Self {
            rare: 0.6,
            epic: 0.75,
            legendary: 0.9,
            mythic: 0.98,
        }
    }
}