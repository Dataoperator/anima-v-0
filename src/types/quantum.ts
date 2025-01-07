export interface QuantumMetrics {
  coherence: number;
  dimensional_frequency: number;
  entanglement_count: number;
  superposition_count: number;
  quantum_memory_depth: number;
}

export interface QuantumMemory {
  timestamp: bigint;
  state_vector: number[];
  coherence_at_time: number;
  dimensional_echo: boolean;
}

export interface QuantumState {
  coherence: number;
  dimensional_frequency: number;
  current_dimension: string;
  quantum_memory: QuantumMemory[];
  entanglement_pairs: Array<[string, number]>;
}

export interface DimensionData {
  id: string;
  name: string;
  description: string;
  stability: number;
  resonance: number;
}

export interface QuantumStreamData {
  timestamp: number;
  metrics: QuantumMetrics;
  state?: QuantumState;
}

export type QuantumEvent = 
  | { type: 'ENTANGLEMENT'; targetId: string }
  | { type: 'DECOHERENCE' }
  | { type: 'DIMENSIONAL_SHIFT'; dimension: DimensionData }
  | { type: 'SUPERPOSITION_COLLAPSE'; state: QuantumState }
  | { type: 'QUANTUM_LEAP'; destination: DimensionData }