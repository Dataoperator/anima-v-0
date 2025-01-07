import { QuantumState } from '../quantum/types';
import { DimensionalState } from '../quantum/types';

export interface GrowthEvent {
  timestamp: number;
  type: string;
  strength: number;
  quantumImpact: number;
  description: string;
}

export interface GrowthMetrics {
  level: number;
  experience: number;
  nextLevelAt: number;
  growthRate: number;
  recentEvents: GrowthEvent[];
}

export interface GrowthParams {
  strength: number;
  quantum_state: QuantumState;
  dimensional_state: DimensionalState;
}