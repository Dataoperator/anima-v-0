use candid::{CandidType, Decode, Encode};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ic_cdk::api::time;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PredictionEngine {
    pub active_predictions: Vec<ActivePrediction>,
    pub prediction_history: Vec<EvaluatedPrediction>,
    pub confidence_metrics: ConfidenceMetrics,
    pub adaptation_factors: AdaptationFactors,
}

impl PredictionEngine {
    pub fn new() -> Self {
        Self {
            active_predictions: Vec::new(),
            prediction_history: Vec::new(),
            confidence_metrics: ConfidenceMetrics {
                overall_accuracy: 0.5,
                type_specific_accuracy: HashMap::new(),
                confidence_correlation: 0.0,
                learning_rate: 0.1,
            },
            adaptation_factors: AdaptationFactors {
                learning_weights: HashMap::new(),
                confidence_adjustments: Vec::new(),
                pattern_adaptations: Vec::new(),
            },
        }
    }

    pub fn make_prediction(&mut self, prediction_type: PredictionType, factors: Vec<PredictionFactor>) -> ActivePrediction {
        let prediction_id = format!("pred_{}", time());
        let confidence = self.calculate_initial_confidence(&factors);
        let predicted_time = self.estimate_occurrence_time(&prediction_type, &factors);

        let prediction = ActivePrediction {
            prediction_id,
            prediction_type,
            predicted_time,
            confidence,
            factors,
            status: PredictionStatus::Active,
        };

        self.active_predictions.push(prediction.clone());
        prediction
    }

    pub fn evaluate_prediction(&mut self, prediction_id: &str, actual_time: Option<u64>) {
        if let Some(pos) = self.active_predictions.iter().position(|p| p.prediction_id == prediction_id) {
            let prediction = self.active_predictions.remove(pos);
            
            let accuracy = match actual_time {
                Some(time) => self.calculate_accuracy(&prediction, time),
                None => 0.0,
            };

            let contributing_factors = self.analyze_contributing_factors(&prediction);
            let learning_points = self.generate_learning_points(&prediction, accuracy);

            let evaluated = EvaluatedPrediction {
                prediction: prediction.clone(),
                actual_time,
                accuracy,
                contributing_factors,
                learning_points: learning_points.clone(),
            };

            // Update metrics
            self.update_confidence_metrics(&evaluated);
            self.apply_learning_points(learning_points);

            self.prediction_history.push(evaluated);
        }
    }

    fn calculate_initial_confidence(&self, factors: &[PredictionFactor]) -> f32 {
        let weighted_sum: f32 = factors.iter()
            .map(|f| f.weight * f.confidence)
            .sum();

        let total_weight: f32 = factors.iter()
            .map(|f| f.weight)
            .sum();

        if total_weight > 0.0 {
            weighted_sum / total_weight
        } else {
            0.5 // Default confidence
        }
    }

    fn estimate_occurrence_time(&self, prediction_type: &PredictionType, factors: &[PredictionFactor]) -> u64 {
        let current_time = time();
        
        match prediction_type {
            PredictionType::UserInteraction { .. } => {
                // Estimate based on user patterns
                current_time + self.estimate_interaction_delay(factors)
            },
            PredictionType::ResourceUsage { .. } => {
                // Estimate based on resource patterns
                current_time + self.estimate_resource_cycle(factors)
            },
            PredictionType::SystemState { .. } => {
                // Estimate based on system patterns
                current_time + self.estimate_state_change(factors)
            },
            PredictionType::EventOccurrence { .. } => {
                // Estimate based on event patterns
                current_time + self.estimate_event_occurrence(factors)
            },
        }
    }

    fn calculate_accuracy(&self, prediction: &ActivePrediction, actual_time: u64) -> f32 {
        let time_diff = if actual_time > prediction.predicted_time {
            actual_time - prediction.predicted_time
        } else {
            prediction.predicted_time - actual_time
        };

        // Calculate base accuracy using an exponential decay
        let base_accuracy = (-time_diff as f32 / 3600.0).exp();

        // Adjust based on prediction confidence
        let confidence_factor = 1.0 + (prediction.confidence - 0.5) * 0.2;

        (base_accuracy * confidence_factor).clamp(0.0, 1.0)
    }

    fn analyze_contributing_factors(&self, prediction: &ActivePrediction) -> HashMap<String, f32> {
        let mut factors = HashMap::new();
        
        for factor in &prediction.factors {
            let impact = factor.weight * factor.confidence;
            factors.insert(factor.factor_type.clone(), impact);
        }

        // Add meta-factors
        factors.insert("prediction_confidence".to_string(), prediction.confidence);
        factors.insert("historical_accuracy".to_string(), 
            self.get_historical_accuracy(&prediction.prediction_type));

        factors
    }

    fn generate_learning_points(&self, prediction: &ActivePrediction, accuracy: f32) -> Vec<LearningPoint> {
        let mut points = Vec::new();

        // Analyze each prediction factor
        for factor in &prediction.factors {
            let expected_impact = factor.weight * factor.confidence;
            let actual_impact = expected_impact * accuracy;
            
            points.push(LearningPoint {
                aspect: factor.factor_type.clone(),
                correction: actual_impact - expected_impact,
                importance: factor.weight,
            });
        }

        // Add general learning points
        points.push(LearningPoint {
            aspect: "confidence_calibration".to_string(),
            correction: accuracy - prediction.confidence,
            importance: 1.0,
        });

        points
    }

    fn update_confidence_metrics(&mut self, evaluated: &EvaluatedPrediction) {
        // Update overall accuracy
        self.confidence_metrics.overall_accuracy = 
            self.confidence_metrics.overall_accuracy * 0.95 + evaluated.accuracy * 0.05;

        // Update type-specific accuracy
        let type_key = format!("{:?}", evaluated.prediction.prediction_type);
        let current = self.confidence_metrics.type_specific_accuracy
            .entry(type_key)
            .or_insert(0.5);
        *current = *current * 0.95 + evaluated.accuracy * 0.05;

        // Update confidence correlation
        let confidence_error = (evaluated.prediction.confidence - evaluated.accuracy).abs();
        self.confidence_metrics.confidence_correlation = 
            self.confidence_metrics.confidence_correlation * 0.95 + 
            (1.0 - confidence_error) * 0.05;

        // Adjust learning rate based on performance
        self.adapt_learning_rate(evaluated);
    }

    fn adapt_learning_rate(&mut self, evaluated: &EvaluatedPrediction) {
        let accuracy_trend = self.calculate_accuracy_trend();
        
        if accuracy_trend > 0.8 {
            // Good performance - reduce learning rate
            self.confidence_metrics.learning_rate *= 0.95;
        } else if accuracy_trend < 0.5 {
            // Poor performance - increase learning rate
            self.confidence_metrics.learning_rate *= 1.05;
        }

        // Keep learning rate in reasonable bounds
        self.confidence_metrics.learning_rate = self.confidence_metrics.learning_rate.clamp(0.01, 0.5);
    }

    fn calculate_accuracy_trend(&self) -> f32 {
        if self.prediction_history.is_empty() {
            return 0.5;
        }

        let recent_predictions: Vec<_> = self.prediction_history
            .iter()
            .rev()
            .take(10)
            .collect();

        let accuracy_sum: f32 = recent_predictions
            .iter()
            .map(|p| p.accuracy)
            .sum();

        accuracy_sum / recent_predictions.len() as f32
    }

    fn get_historical_accuracy(&self, prediction_type: &PredictionType) -> f32 {
        let type_key = format!("{:?}", prediction_type);
        *self.confidence_metrics.type_specific_accuracy
            .get(&type_key)
            .unwrap_or(&0.5)
    }

    // Time estimation helpers
    fn estimate_interaction_delay(&self, factors: &[PredictionFactor]) -> u64 {
        // Base delay of 1 hour
        let base_delay = 3600;
        
        let modifier = factors.iter()
            .map(|f| f.weight * f.confidence)
            .sum::<f32>();

        (base_delay as f32 * modifier) as u64
    }

    fn estimate_resource_cycle(&self, factors: &[PredictionFactor]) -> u64 {
        // Base cycle of 4 hours
        let base_cycle = 14400;
        
        let cycle_modifier = factors.iter()
            .filter(|f| f.factor_type.contains("cycle"))
            .map(|f| f.weight * f.confidence)
            .sum::<f32>();

        (base_cycle as f32 * cycle_modifier) as u64
    }

    fn estimate_state_change(&self, factors: &[PredictionFactor]) -> u64 {
        // Base time of 30 minutes
        let base_time = 1800;
        
        let state_modifier = factors.iter()
            .filter(|f| f.factor_type.contains("state"))
            .map(|f| f.weight * f.confidence)
            .sum::<f32>();

        (base_time as f32 * state_modifier) as u64
    }

    fn estimate_event_occurrence(&self, factors: &[PredictionFactor]) -> u64 {
        // Base time of 2 hours
        let base_time = 7200;
        
        let event_modifier = factors.iter()
            .filter(|f| f.factor_type.contains("event"))
            .map(|f| f.weight * f.confidence)
            .sum::<f32>();

        (base_time as f32 * event_modifier) as u64
    }
}