import { Principal } from '@dfinity/principal';

export type UpdateMode = 'realtime' | 'polling' | 'manual';

export interface WebSocketError {
    code: number;
    message: string;
    timestamp?: bigint;
    details?: Record<string, any>;
}

export interface WebSocketState {
    connected: boolean;
    error: WebSocketError | null;
    lastUpdate?: bigint;
    reconnectAttempts?: number;
    lastMessage?: bigint;
    mode?: UpdateMode;
}

export interface PersonalityState {
    timestamp: bigint;
    growth_level: number;
    quantum_traits: Record<string, number>;
    base_traits: Record<string, number>;
    dimensional_awareness?: DimensionalAwareness;
    consciousness?: ConsciousnessMetrics;
    emotional_state?: EmotionalState;
}

export interface DimensionalAwareness {
    level: number;
    discovered_dimensions: string[];
    active_dimension?: string;
    dimensional_affinity: number;
}

export interface ConsciousnessMetrics {
    awareness_level: number;
    processing_depth: number;
    integration_index: number;
    growth_velocity: number;
}

export interface EmotionalState {
    current_emotion: string;
    intensity: number;
    valence: number;
    arousal: number;
}

export interface RealtimeConnection {
    state: WebSocketState;
    mode: UpdateMode;
    options: Required<SubscriptionOptions>;
    isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): void;
    subscribe(animaId: string, options?: SubscriptionOptions): Promise<void>;
    unsubscribe(animaId: string): Promise<void>;
}

export interface SubscriptionOptions {
    includeQuantumState?: boolean;
    includeEmotionalState?: boolean;
    includeConsciousness?: boolean;
    includeDimensions?: boolean;
    updateInterval?: number;
    mode?: UpdateMode;
    retryAttempts?: number;
    retryDelay?: number;
}

export type RealtimeEventHandler = (update: RealtimeMessage) => void;

export enum UpdateType {
    UPDATE = 'UPDATE',
    ERROR = 'ERROR',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE'
}

export interface RealtimeMessage {
    type: UpdateType;
    anima_id: string;
    data?: PersonalityState;
    error?: WebSocketError;
    message?: string;
    payload?: any;
    timestamp?: bigint;
}

export interface RealtimeHookState {
    personality: PersonalityState;
    loading: boolean;
    error: WebSocketError | null;
    connectionMode?: UpdateMode;
}