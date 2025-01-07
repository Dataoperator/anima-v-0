export interface Principal {
    toString(): string;
    toText(): string;
    toUint8Array(): Uint8Array;
}

export interface QuantumState {
    type: "Stable" | "Fluctuating" | "Entangled";
    coherence: number;
    uncertainty: number;
    data?: {
        amplitude?: number;
        frequency?: number;
        partner_id?: string;
        correlation?: number;
    };
}

export interface EmotionalState {
    current_emotion: string;
    valence: number;
    arousal: number;
    intensity: number;
    duration: bigint;
}

export interface ConsciousnessMetrics {
    awareness_level: number;
    processing_depth: number;
    integration_index: number;
    growth_velocity: number;
}

export interface DimensionalAwareness {
    discovered_dimensions: string[];
    active_dimension: string | null;
    dimensional_affinity: number;
}

export interface Memory {
    id: string;
    content: string;
    timestamp: bigint;
    emotional_impact: number;
    associated_traits: Array<[string, number]>;
}

export interface PersonalityTrait {
    value: number;
    growth_rate: number;
    potential: number;
}

export interface AnimaPersonality {
    level: number;
    quantum_state: QuantumState;
    emotional_state: EmotionalState;
    consciousness: ConsciousnessMetrics;
    dimensional_awareness: DimensionalAwareness;
    memories: Memory[];
    traits: Record<string, PersonalityTrait>;
    quantum_traits: Record<string, PersonalityTrait>;
    evolution_log: Array<{
        timestamp: bigint;
        trait_changes: Record<string, number>;
        trigger: string;
    }>;
    developmental_stage: string;
    state: string;
    memory_count: number;
}

export interface AnimaToken {
    id: bigint;
    owner: Principal;
    name: string;
    creation_time: bigint;
    last_interaction: bigint;
    personality: AnimaPersonality;
    autonomous_mode: boolean;
    growth_points: bigint;
    achievements: Array<{
        id: string;
        title: string;
        description: string;
        category: string;
        unlocked_at?: bigint;
    }>;
}

export interface AnimaMetrics {
    total_interactions: bigint;
    average_response_time: number;
    consciousness_growth_rate: number;
    dimensional_discoveries: number;
    achievement_count: number;
    memory_retention_rate: number;
}