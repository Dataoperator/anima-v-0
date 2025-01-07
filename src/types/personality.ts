import { Principal } from '@dfinity/principal';

export interface DimensionType {
    id: string;
    name: string;
    description: string;
    discovery_time: bigint;
    trait_modifiers: Record<string, number>;
    type: 'discovered' | 'potential' | 'locked';
}

export interface QuantumTraitType {
    value: number;
    uncertainty: number;
    superposition_state: {
        type: 'Stable' | 'Unstable' | 'Transitioning';
        transition_probability?: number;
    };
}

export interface PersonalityMetrics {
    base_traits: Record<string, number>;
    quantum_traits: Record<string, QuantumTraitType>;
    consciousness_level: number;
    emotional_stability: number;
    growth_velocity: number;
    dimensional_affinity: number;
}

export interface EmotionalStateType {
    current_mood: string;
    intensity: number;
    valence: number;
    arousal: number;
    duration: number;
    triggers: string[];
}

export interface ConsciousnessMetricsType {
    awareness_level: number;
    processing_depth: number;
    integration_index: number;
    growth_velocity: number;
    growth_rate: number;
    complexity: number;
    coherence: number;
}