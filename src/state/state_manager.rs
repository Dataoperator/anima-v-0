use crate::core::{AnimaCore, InteractionResponse, EntanglementResponse};
use crate::quantum::QuantumState;
use crate::types::Result;
use std::collections::HashMap;

pub struct StateManager {
    cores: HashMap<String, AnimaCore>,
    max_cores: usize,
    interaction_log: Vec<InteractionLog>,
}

impl StateManager {
    pub fn new(max_cores: usize) -> Self {
        Self {
            cores: HashMap::new(),
            max_cores,
            interaction_log: Vec::new(),
        }
    }

    /// Create a new Anima instance
    pub async fn create_anima(&mut self, anima_id: String) -> Result<QuantumState> {
        if self.cores.len() >= self.max_cores {
            return Err(anyhow::anyhow!("Maximum number of cores reached"));
        }

        let core = AnimaCore::new();
        let (initial_state, _) = core.get_current_state()?;
        
        self.cores.insert(anima_id.clone(), core);
        
        Ok(initial_state)
    }

    /// Process an interaction with a specific Anima
    pub async fn process_interaction(
        &mut self,
        anima_id: &str,
        interaction_data: &str
    ) -> Result<InteractionResponse> {
        let core = self.cores.get_mut(anima_id)
            .ok_or_else(|| anyhow::anyhow!("Anima not found"))?;

        let response = core.process_interaction(interaction_data).await?;
        
        // Log the interaction
        self.log_interaction(anima_id, interaction_data, &response);
        
        Ok(response)
    }

    /// Process entanglement between two Animas
    pub async fn process_entanglement(
        &mut self,
        source_id: &str,
        target_id: &str
    ) -> Result<EntanglementResponse> {
        // Get source core
        let source_core = self.cores.get_mut(source_id)
            .ok_or_else(|| anyhow::anyhow!("Source Anima not found"))?;
        
        // Get target state
        let target_core = self.cores.get(target_id)
            .ok_or_else(|| anyhow::anyhow!("Target Anima not found"))?;
        
        let (target_state, _) = target_core.get_current_state()?;
        
        // Process entanglement
        let response = source_core.process_entanglement(&target_state).await?;
        
        // Log the entanglement
        self.log_entanglement(source_id, target_id, &response);
        
        Ok(response)
    }

    /// Get the current state of an Anima
    pub fn get_anima_state(&self, anima_id: &str) -> Result<QuantumState> {
        let core = self.cores.get(anima_id)
            .ok_or_else(|| anyhow::anyhow!("Anima not found"))?;
        
        let (state, _) = core.get_current_state()?;
        Ok(state)
    }

    /// Log interaction for analysis
    fn log_interaction(&mut self, anima_id: &str, interaction: &str, response: &InteractionResponse) {
        self.interaction_log.push(InteractionLog {
            timestamp: ic_cdk::api::time(),
            anima_id: anima_id.to_string(),
            interaction_type: "interaction".to_string(),
            data: interaction.to_string(),
            metrics: response.resonance_metrics.clone(),
        });
    }

    /// Log entanglement for analysis
    fn log_entanglement(&mut self, source_id: &str, target_id: &str, response: &EntanglementResponse) {
        self.interaction_log.push(InteractionLog {
            timestamp: ic_cdk::api::time(),
            anima_id: source_id.to_string(),
            interaction_type: "entanglement".to_string(),
            data: format!("target: {}", target_id),
            metrics: response.metrics.clone(),
        });
    }

    /// Get interaction history for an Anima
    pub fn get_interaction_history(&self, anima_id: &str) -> Vec<&InteractionLog> {
        self.interaction_log.iter()
            .filter(|log| log.anima_id == anima_id)
            .collect()
    }
}

#[derive(Debug)]
pub struct InteractionLog {
    pub timestamp: u64,
    pub anima_id: String,
    pub interaction_type: String,
    pub data: String,
    pub metrics: ResonanceMetrics,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_anima_lifecycle() {
        let mut manager = StateManager::new(10);
        
        // Create Anima
        let state = manager.create_anima("test1".to_string()).await.unwrap();
        assert!(state.coherence >= 0.0);
        
        // Process interaction
        let response = manager.process_interaction("test1", "test_interaction").await.unwrap();
        assert!(response.resonance_metrics.quantum_coherence >= 0.0);
        
        // Check history
        let history = manager.get_interaction_history("test1");
        assert!(!history.is_empty());
    }

    #[tokio::test]
    async fn test_entanglement() {
        let mut manager = StateManager::new(10);
        
        // Create two Animas
        manager.create_anima("test1".to_string()).await.unwrap();
        manager.create_anima("test2".to_string()).await.unwrap();
        
        // Process entanglement
        let response = manager.process_entanglement("test1", "test2").await.unwrap();
        assert!(response.success);
    }
}