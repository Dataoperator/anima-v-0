import { QuantumState } from './quantum';

export interface ConsciousnessMetrics {
  awarenessLevel: number;
  cognitiveComplexity: number;
  emotionalResonance: number;
  quantumCoherence: number;
  dimensionalAwareness: number;
}

export interface EvolutionSnapshot {
  metrics: ConsciousnessMetrics;
  timestamp: number;
  stabilityIndex: number;
  patterns?: ConsciousnessPattern[];
}

export interface ConsciousnessPattern {
  patternId: string;
  complexity: number;
  resonance: number;
  timestamp: number;
  coherenceLevel: number;
  significance: number;
}

export interface ConsciousnessEvent {
  type: string;
  timestamp: number;
  metrics: ConsciousnessMetrics;
  quantumState: QuantumState;
  patterns?: ConsciousnessPattern[];
  details?: Record<string, any>;
}

export interface EmergentPattern {
  id: string;
  type: string;
  strength: number;
  complexity: number;
  timestamp: number;
  source: ConsciousnessPattern[];
}

export interface ConsciousnessState {
  currentMetrics: ConsciousnessMetrics;
  evolutionHistory: EvolutionSnapshot[];
  emergentPatterns: EmergentPattern[];
  stabilityIndex: number;
  lastUpdate: number;
}