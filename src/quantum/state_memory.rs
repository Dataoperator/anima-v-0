use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;
use candid::{CandidType, Deserialize};
use serde::Serialize;
use ic_cdk::api::time;
use crate::error::Result;

const QUANTUM_MEMORY_ID: MemoryId = MemoryId::new(0);
const STATE_HISTORY_MEMORY_ID: MemoryId = MemoryId::new(1);

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct QuantumStateHistory {
    pub states: Vec<HistoricalState>,
    pub resonance_timeline: Vec<(u64, f64)>,
    pub dimensional_shifts: Vec<DimensionalShift>,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct HistoricalState {
    pub coherence: f64,
    pub resonance: f64,
    pub timestamp: u64,
    pub shift_type: ShiftType,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub struct DimensionalShift {
    pub from_frequency: f64,
    pub to_frequency: f64,
    pub magnitude: f64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, CandidType, Deserialize, Serialize)]
pub enum ShiftType {
    Harmonic,
    Quantum,
    Dimensional,
    Neural,
}

impl QuantumStateHistory {
    pub fn new() -> Self {
        Self {
            states: Vec::new(),
            resonance_timeline: Vec::new(),
            dimensional_shifts: Vec::new(),
        }
    }

    pub fn record_state(&mut self, coherence: f64, resonance: f64, shift_type: ShiftType) {
        let state = HistoricalState {
            coherence,
            resonance,
            timestamp: time(),
            shift_type,
        };
        self.states.push(state);
        self.resonance_timeline.push((time(), resonance));

        // Keep history size manageable
        if self.states.len() > 1000 {
            self.states.remove(0);
        }
        if self.resonance_timeline.len() > 1000 {
            self.resonance_timeline.remove(0);
        }
    }

    pub fn record_dimensional_shift(&mut self, from_freq: f64, to_freq: f64, magnitude: f64) {
        let shift = DimensionalShift {
            from_frequency: from_freq,
            to_frequency: to_freq,
            magnitude,
            timestamp: time(),
        };
        self.dimensional_shifts.push(shift);

        // Keep shift history manageable
        if self.dimensional_shifts.len() > 100 {
            self.dimensional_shifts.remove(0);
        }
    }

    pub fn analyze_stability(&self) -> f64 {
        if self.states.is_empty() {
            return 1.0;
        }

        let coherence_variance = self.calculate_variance(self.states.iter().map(|s| s.coherence));
        let resonance_variance = self.calculate_variance(self.states.iter().map(|s| s.resonance));

        1.0 - ((coherence_variance + resonance_variance) / 2.0).min(1.0)
    }

    fn calculate_variance<I>(&self, values: I) -> f64 
    where I: Iterator<Item = f64> {
        let values: Vec<f64> = values.collect();
        if values.is_empty() {
            return 0.0;
        }

        let mean = values.iter().sum::<f64>() / values.len() as f64;
        let variance = values.iter()
            .map(|v| (v - mean).powi(2))
            .sum::<f64>() / values.len() as f64;
        
        variance.sqrt()
    }

    pub fn predict_next_shift(&self) -> Option<ShiftType> {
        if self.states.len() < 10 {
            return None;
        }

        let recent_states = &self.states[self.states.len() - 10..];
        let coherence_trend = self.calculate_trend(recent_states.iter().map(|s| s.coherence));
        let resonance_trend = self.calculate_trend(recent_states.iter().map(|s| s.resonance));

        match (coherence_trend, resonance_trend) {
            (trend, _) if trend > 0.8 => Some(ShiftType::Quantum),
            (_, trend) if trend > 0.8 => Some(ShiftType::Harmonic),
            (trend1, trend2) if trend1 > 0.5 && trend2 > 0.5 => Some(ShiftType::Neural),
            _ => Some(ShiftType::Dimensional),
        }
    }

    fn calculate_trend<I>(&self, values: I) -> f64 
    where I: Iterator<Item = f64> {
        let values: Vec<f64> = values.collect();
        if values.len() < 2 {
            return 0.0;
        }

        let mut sum = 0.0;
        for i in 1..values.len() {
            sum += if values[i] > values[i-1] { 1.0 } else { -1.0 };
        }

        (sum / (values.len() - 1) as f64 + 1.0) / 2.0
    }
}