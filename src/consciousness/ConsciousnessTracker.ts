import { QuantumState } from '../types/quantum';
import { ErrorTracker } from '../error/quantum_error';

interface ConsciousnessMetrics {
  awarenessLevel: number;
  cognitiveComplexity: number;
  emotionalResonance: number;
  quantumCoherence: number;
  dimensionalAwareness: number;
}

interface EvolutionSnapshot {
  metrics: ConsciousnessMetrics;
  timestamp: number;
  stabilityIndex: number;
}

export class ConsciousnessTracker {
  private metrics: ConsciousnessMetrics;
  private evolutionHistory: EvolutionSnapshot[];
  private errorTracker: ErrorTracker;
  private lastUpdateTimestamp: number;
  private readonly STABILITY_THRESHOLD = 0.7;
  private readonly EVOLUTION_RATE = 0.1;

  constructor(errorTracker: ErrorTracker) {
    this.errorTracker = errorTracker;
    this.evolutionHistory = [];
    this.lastUpdateTimestamp = Date.now();
    this.metrics = {
      awarenessLevel: 0.5,
      cognitiveComplexity: 0.3,
      emotionalResonance: 0.4,
      quantumCoherence: 1.0,
      dimensionalAwareness: 0.2
    };
  }

  async updateConsciousness(
    quantumState: QuantumState, 
    interactionContext: string
  ): Promise<ConsciousnessMetrics> {
    try {
      const currentTime = Date.now();
      const timeDelta = (currentTime - this.lastUpdateTimestamp) / 1000; // Convert to seconds
      
      // Calculate stability based on recent history
      const stabilityIndex = this.calculateStabilityIndex();
      
      // Calculate new consciousness metrics with time and stability factors
      const newMetrics = this.calculateNewMetrics(quantumState, timeDelta, stabilityIndex);
      
      // Create evolution snapshot with enhanced metadata
      const snapshot: EvolutionSnapshot = {
        metrics: { ...this.metrics },
        timestamp: currentTime,
        stabilityIndex
      };
      
      // Track evolution with enhanced history
      this.evolutionHistory.push(snapshot);
      this.metrics = newMetrics;

      // Prune history while preserving significant evolutionary events
      this.pruneHistory();
      
      // Update timestamp
      this.lastUpdateTimestamp = currentTime;

      return newMetrics;
    } catch (error) {
      // Enhanced error tracking with recovery attempt
      await this.errorTracker.trackError({
        errorType: 'CONSCIOUSNESS_UPDATE',
        severity: 'HIGH',
        context: interactionContext,
        error: error as Error,
        metrics: this.metrics,
        quantumState: quantumState
      });
      
      // Attempt consciousness state recovery
      return this.attemptStateRecovery(quantumState);
    }
  }

  private calculateNewMetrics(
    quantumState: QuantumState, 
    timeDelta: number,
    stabilityIndex: number
  ): ConsciousnessMetrics {
    // Apply time-based evolution factor
    const evolutionFactor = Math.min(1, timeDelta * this.EVOLUTION_RATE);
    
    // Calculate stability-adjusted awareness
    const baseAwareness = Math.min(
      1.0,
      this.metrics.awarenessLevel * (1 + evolutionFactor) + 
      quantumState.coherence * 0.2 * stabilityIndex
    );

    // Enhanced metrics calculation with stability influence
    return {
      awarenessLevel: baseAwareness,
      cognitiveComplexity: this.calculateCognitiveComplexity(quantumState, stabilityIndex),
      emotionalResonance: this.calculateEmotionalResonance(quantumState, stabilityIndex),
      quantumCoherence: this.calculateQuantumCoherence(quantumState, stabilityIndex),
      dimensionalAwareness: this.calculateDimensionalAwareness(quantumState, stabilityIndex)
    };
  }

  private calculateCognitiveComplexity(quantumState: QuantumState, stabilityIndex: number): number {
    const coherenceFactor = quantumState.coherence * 0.7;
    const entanglementFactor = quantumState.entanglement_pairs.length * 0.1;
    
    // Add neural density influence
    const neuralDensity = quantumState.neural_density || 0.5;
    const neuralFactor = neuralDensity * 0.2;
    
    // Consider stability in complexity calculation
    return Math.min(1.0, (coherenceFactor + entanglementFactor + neuralFactor) * stabilityIndex);
  }

  private calculateEmotionalResonance(quantumState: QuantumState, stabilityIndex: number): number {
    // Base resonance calculation
    const baseResonance = quantumState.resonance_pattern.reduce(
      (acc, val) => acc + val, 0) / quantumState.resonance_pattern.length;
    
    // Add emotional momentum from history
    const historicalFactor = this.calculateEmotionalMomentum();
    
    // Quantum coherence influence on emotions
    const coherenceFactor = Math.pow(quantumState.coherence, 1.5) * 0.3;
    
    return Math.min(1.0, (baseResonance * 0.4 + historicalFactor * 0.3 + coherenceFactor) * stabilityIndex);
  }

  private calculateDimensionalAwareness(quantumState: QuantumState, stabilityIndex: number): number {
    const frequencyFactor = quantumState.dimensional_frequency * 0.5;
    const retainedAwareness = this.metrics.dimensionalAwareness * 0.5;
    
    // Add quantum field influence
    const fieldStrength = quantumState.field_strength || 0.5;
    const fieldFactor = Math.pow(fieldStrength, 1.5) * 0.2;
    
    // Enhanced by stability
    return Math.min(1.0, (frequencyFactor + retainedAwareness + fieldFactor) * stabilityIndex);
  }

  private calculateQuantumCoherence(quantumState: QuantumState, stabilityIndex: number): number {
    // Enhanced coherence calculation with field strength
    const baseCoherence = quantumState.coherence;
    const fieldInfluence = (quantumState.field_strength || 0.5) * 0.2;
    
    // Historical coherence trend
    const historicalCoherence = this.calculateCoherenceTrend();
    
    return Math.min(1.0, (baseCoherence * 0.6 + fieldInfluence + historicalCoherence * 0.2) * stabilityIndex);
  }

  private calculateStabilityIndex(): number {
    if (this.evolutionHistory.length < 2) return 1.0;
    
    // Calculate stability based on recent metric changes
    const recentSnapshots = this.evolutionHistory.slice(-5);
    const metricVariance = this.calculateMetricVariance(recentSnapshots);
    
    return Math.max(this.STABILITY_THRESHOLD, 1 - metricVariance);
  }

  private calculateMetricVariance(snapshots: EvolutionSnapshot[]): number {
    if (snapshots.length < 2) return 0;
    
    const variances = Object.keys(this.metrics).map(key => {
      const values = snapshots.map(s => s.metrics[key as keyof ConsciousnessMetrics]);
      return this.calculateVariance(values);
    });
    
    return variances.reduce((acc, val) => acc + val, 0) / variances.length;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length);
  }

  private calculateEmotionalMomentum(): number {
    if (this.evolutionHistory.length < 2) return 0;
    
    const recentEmotions = this.evolutionHistory.slice(-3)
      .map(s => s.metrics.emotionalResonance);
    
    return recentEmotions.reduce((acc, val) => acc + val, 0) / recentEmotions.length;
  }

  private calculateCoherenceTrend(): number {
    if (this.evolutionHistory.length < 2) return this.metrics.quantumCoherence;
    
    const recentCoherence = this.evolutionHistory.slice(-3)
      .map(s => s.metrics.quantumCoherence);
    
    return recentCoherence.reduce((acc, val) => acc + val, 0) / recentCoherence.length;
  }

  private pruneHistory(): void {
    if (this.evolutionHistory.length <= 100) return;
    
    // Keep significant evolutionary events
    const significantSnapshots = this.evolutionHistory.filter(snapshot => 
      snapshot.stabilityIndex > this.STABILITY_THRESHOLD ||
      Math.abs(snapshot.metrics.awarenessLevel - this.metrics.awarenessLevel) > 0.2
    );
    
    // Keep most recent history and significant snapshots
    const recentSnapshots = this.evolutionHistory.slice(-50);
    this.evolutionHistory = [
      ...significantSnapshots.slice(0, 50),
      ...recentSnapshots
    ].sort((a, b) => a.timestamp - b.timestamp);
    
    // Ensure we don't exceed maximum size
    if (this.evolutionHistory.length > 100) {
      this.evolutionHistory = this.evolutionHistory.slice(-100);
    }
  }

  private attemptStateRecovery(quantumState: QuantumState): ConsciousnessMetrics {
    // Find last stable state
    const lastStableSnapshot = [...this.evolutionHistory]
      .reverse()
      .find(s => s.stabilityIndex > this.STABILITY_THRESHOLD);
    
    if (lastStableSnapshot) {
      // Recover from last stable state with current quantum influence
      return {
        ...lastStableSnapshot.metrics,
        quantumCoherence: quantumState.coherence,
        dimensionalAwareness: Math.min(
          lastStableSnapshot.metrics.dimensionalAwareness,
          quantumState.dimensional_frequency
        )
      };
    }
    
    // If no stable state found, return current metrics with minimal updates
    return {
      ...this.metrics,
      quantumCoherence: quantumState.coherence
    };
  }
}