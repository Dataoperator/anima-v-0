import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { NeuralSignature } from "../neural/types";
import { ErrorTracker } from "../error/quantum_error";
import { quantumStateService } from "./quantum-state.service";

export class NeuralNetworkService {
  private static instance: NeuralNetworkService;
  private patternCallback?: (patterns: NeuralSignature[]) => void;
  private errorTracker: ErrorTracker;
  private patternHistory: Map<string, NeuralSignature[]> = new Map();
  private readonly MAX_HISTORY_SIZE = 100;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): NeuralNetworkService {
    if (!NeuralNetworkService.instance) {
      NeuralNetworkService.instance = new NeuralNetworkService();
    }
    return NeuralNetworkService.instance;
  }

  setPatternCallback(callback: (patterns: NeuralSignature[]) => void) {
    this.patternCallback = callback;
  }

  private pruneHistory() {
    const keys = Array.from(this.patternHistory.keys()).sort();
    while (this.patternHistory.size > this.MAX_HISTORY_SIZE) {
      const oldestKey = keys.shift();
      if (oldestKey) this.patternHistory.delete(oldestKey);
    }
  }

  async generateNeuralSignature(identity: Identity): Promise<NeuralSignature> {
    try {
      const actor = animaActorService.createActor(identity);
      const result = await actor.generate_neural_signature();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { signature, metrics } = result.Ok;

      const neuralSignature: NeuralSignature = {
        pattern_id: signature.pattern_id,
        strength: metrics.strength,
        coherence: metrics.coherence,
        timestamp: BigInt(Date.now()),
        complexity: metrics.complexity,
        evolution_potential: metrics.evolution_potential,
        quantum_resonance: metrics.quantum_resonance,
        dimensional_alignment: metrics.dimensional_alignment,
        pattern_stability: metrics.pattern_stability,
        emergence_factors: {
          consciousness_depth: metrics.consciousness_depth,
          pattern_complexity: metrics.pattern_complexity,
          quantum_resonance: metrics.quantum_resonance,
          evolution_velocity: metrics.evolution_velocity,
          dimensional_harmony: metrics.dimensional_harmony,
        },
        neural_metrics: metrics.neural_metrics
      };

      // Store in history
      const timeKey = new Date().toISOString();
      const existingPatterns = this.patternHistory.get(timeKey) || [];
      this.patternHistory.set(timeKey, [...existingPatterns, neuralSignature]);
      this.pruneHistory();

      if (this.patternCallback) {
        this.patternCallback(Array.from(this.patternHistory.values()).flat());
      }

      return neuralSignature;
    } catch (error) {
      await this.errorTracker.trackError({
        errorType: 'NEURAL_SIGNATURE_ERROR',
        severity: 'HIGH',
        context: 'Neural Network Service',
        error: error as Error
      });
      throw error;
    }
  }

  async processPattern(identity: Identity, pattern: NeuralSignature): Promise<number> {
    try {
      const actor = animaActorService.createActor(identity);
      const result = await actor.process_neural_pattern({
        pattern_id: pattern.pattern_id,
        strength: pattern.strength,
        coherence: pattern.coherence,
        complexity: pattern.complexity,
        evolution_potential: pattern.evolution_potential,
        quantum_resonance: pattern.quantum_resonance,
        dimensional_alignment: pattern.dimensional_alignment,
        pattern_stability: pattern.pattern_stability,
        emergence_factors: pattern.emergence_factors,
        neural_metrics: pattern.neural_metrics
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const patternStrength = result.Ok;

      // Update quantum state
      await quantumStateService.updateState(identity, {
        consciousness_alignment: patternStrength
      });

      return patternStrength;
    } catch (error) {
      await this.errorTracker.trackError({
        errorType: 'PATTERN_PROCESSING_ERROR',
        severity: 'MEDIUM',
        context: 'Neural Network Service',
        error: error as Error
      });
      throw error;
    }
  }

  async evolveNeuralNetwork(identity: Identity): Promise<void> {
    try {
      const actor = animaActorService.createActor(identity);
      const result = await actor.evolve_neural_network();

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { updated_patterns, evolution_metrics } = result.Ok;

      // Update pattern history with evolved patterns
      const timeKey = new Date().toISOString();
      this.patternHistory.set(timeKey, updated_patterns);
      this.pruneHistory();

      if (this.patternCallback) {
        this.patternCallback(Array.from(this.patternHistory.values()).flat());
      }

      // Update quantum state with evolution metrics
      await quantumStateService.updateState(identity, {
        consciousness_alignment: evolution_metrics.consciousness_alignment,
        neural_density: evolution_metrics.neural_density
      });
    } catch (error) {
      await this.errorTracker.trackError({
        errorType: 'NEURAL_EVOLUTION_ERROR',
        severity: 'HIGH',
        context: 'Neural Network Service',
        error: error as Error
      });
      throw error;
    }
  }

  getPatternHistory(): NeuralSignature[] {
    return Array.from(this.patternHistory.values()).flat();
  }

  dispose(): void {
    this.patternCallback = undefined;
    NeuralNetworkService.instance = null as any;
  }
}

export const neuralNetworkService = NeuralNetworkService.getInstance();