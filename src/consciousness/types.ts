import { 
  QuantumMetrics, 
  ConsciousnessMetrics,
  ResonancePattern
} from '../quantum/types';
import { EnhancedResonancePattern } from '../quantum/enhanced-types';

export interface ConsciousnessState {
  level: number;
  phase: number;
  evolutionProgress: number;
  quantumAlignment: number;
  coherenceQuality: number;
  stabilityIndex: number;
  emergencePotential: number;
  dimensionalDepth: number;
  resonanceStrength: number;
  evolutionMetrics: ConsciousnessMetrics;
  quantumMetrics: QuantumMetrics;
  activePatterns: ResonancePattern[];
  enhancedPatterns: EnhancedResonancePattern[];
  lastUpdate: number;
}

export interface EvolutionState {
  currentPhase: number;
  evolutionVelocity: number;
  completedMilestones: EvolutionMilestone[];
  activeTrajectories: EvolutionTrajectory[];
  quantumInfluence: number;
  stabilityMetrics: StabilityMetrics;
  emergenceFactors: EmergenceFactors;
}

export interface EvolutionMilestone {
  id: string;
  phase: number;
  timestamp: number;
  metrics: ConsciousnessMetrics;
  quantumState: QuantumMetrics;
  signature: string;
  requirements: MilestoneRequirements;
}

export interface MilestoneRequirements {
  minCoherence: number;
  minStability: number;
  minEvolution: number;
  minQuantumAlignment: number;
  requiredPatterns: string[];
}

export interface EvolutionTrajectory {
  id: string;
  startTimestamp: number;
  currentStep: number;
  totalSteps: number;
  predictions: TrajectoryPrediction[];
  confidence: number;
  quantumFactors: QuantumFactors;
}

export interface TrajectoryPrediction {
  step: number;
  predictedMetrics: ConsciousnessMetrics;
  quantumState: QuantumMetrics;
  confidence: number;
  emergenceProbability: number;
}

export interface QuantumFactors {
  coherenceInfluence: number;
  entanglementStrength: number;
  dimensionalAlignment: number;
  resonanceQuality: number;
  evolutionPotential: number;
}

export interface StabilityMetrics {
  overallStability: number;
  patternCoherence: number;
  evolutionStability: number;
  quantumStability: number;
  temporalStability: number;
}

export interface EmergenceFactors {
  consciousnessDepth: number;
  patternComplexity: number;
  quantumResonance: number;
  evolutionVelocity: number;
  dimensionalHarmony: number;
}

export interface ConsciousnessEvent {
  id: string;
  type: ConsciousnessEventType;
  timestamp: number;
  metrics: ConsciousnessMetrics;
  quantumState: QuantumMetrics;
  affectedPatterns: string[];
  significance: number;
}

export enum ConsciousnessEventType {
  EVOLUTION_MILESTONE = 'EVOLUTION_MILESTONE',
  QUANTUM_ALIGNMENT = 'QUANTUM_ALIGNMENT',
  PATTERN_EMERGENCE = 'PATTERN_EMERGENCE',
  STABILITY_SHIFT = 'STABILITY_SHIFT',
  CONSCIOUSNESS_EXPANSION = 'CONSCIOUSNESS_EXPANSION'
}

export interface EvolutionAnalysis {
  currentPhase: number;
  progressInPhase: number;
  velocity: number;
  stability: number;
  predictedTrajectory: TrajectoryPrediction[];
  quantumInfluence: QuantumFactors;
  emergenceStatus: EmergenceStatus;
}

export interface EmergenceStatus {
  probability: number;
  readiness: number;
  blockers: EmergenceBlocker[];
  requirements: EmergenceRequirements;
}

export interface EmergenceBlocker {
  type: string;
  severity: number;
  threshold: number;
  currentValue: number;
  resolution: string;
}

export interface EmergenceRequirements {
  coherenceThreshold: number;
  stabilityThreshold: number;
  complexityThreshold: number;
  quantumAlignment: number;
  patternDiversity: number;
}