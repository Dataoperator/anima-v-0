#!/bin/bash

echo "🧹 Cleaning up unused code..."

# Remove unused types
sed -i '/pub type TokenIdentifier/d' src/types/mod.rs
sed -i '/pub type AccountIdentifier/d' src/types/mod.rs
sed -i '/pub struct AnimaState/,/}/d' src/types/mod.rs
sed -i '/pub enum AnimaStatus/,/}/d' src/types/mod.rs

# Remove unused constants in actions
sed -i '/const MIN_NAME_LENGTH/d' src/actions/user.rs
sed -i '/const MAX_NAME_LENGTH/d' src/actions/user.rs

# Remove unused traits
rm -f src/actions/traits.rs

# Remove unused AI/OpenAI implementation
rm -f src/ai/openai_client.rs
rm -f src/ai/prompt_templates.rs

# Remove empty/unused structures
rm -f src/personality/mod.rs

# Remove unused metrics code
sed -i '/const PERF_COUNTER_INSTRUCTIONS/d' src/admin/metrics.rs
sed -i '/const MAX_HISTORY_SIZE/d' src/admin/metrics.rs
sed -i '/pub fn record_metrics/,/}/d' src/admin/metrics.rs

# Remove unused quantum code
sed -i '/pub fn calculate_resonance/,/}/d' src/quantum/dimensional_state.rs
sed -i '/pub fn update_stability/,/}/d' src/quantum/dimensional_state.rs
sed -i '/pub fn get_stability_metrics/,/}/d' src/quantum/dimensional_state.rs

# Remove unused payment processor
rm -f src/payments/quantum_payment_processor.rs

echo "✅ Cleanup complete! Please review changes before committing."