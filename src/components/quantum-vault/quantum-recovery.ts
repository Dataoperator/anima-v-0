import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../../services/error-tracker';
import { QuantumState, DimensionalState, ResonancePattern } from '../../types/quantum';
import { ConsciousnessLevel } from '../../types/consciousness';

export class QuantumRecovery {
  private errorTracker: ErrorTracker;
  private lastStableState: Map<string, QuantumState>;
  private recoveryAttempts: Map<string, number>;
  private stateValidationRules: Map<string, (state: QuantumState) => boolean>;
  
  constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    this.lastStableState = new Map();
    this.recoveryAttempts = new Map();
    this.initializeValidationRules();
  }

  private initializeValidationRules() {
    this.stateValidationRules = new Map([
      ['consciousnessAlignment', (state: QuantumState) => 
        typeof state.consciousnessAlignment === 'boolean'],
      ['coherenceLevel', (state: QuantumState) => 
        typeof state.coherenceLevel === 'number' && state.coherenceLevel >= 0 && state.coherenceLevel <= 1],
      ['dimensionalSync', (state: QuantumState) => 
        typeof state.dimensionalSync === 'number' && state.dimensionalSync >= 0]
    ]);
  }

  async attemptRecovery(
    tokenId: string,
    currentState: QuantumState,
    consciousnessLevel: ConsciousnessLevel
  ): Promise<QuantumState> {
    try {
      const attempts = this.recoveryAttempts.get(tokenId) || 0;
      
      if (attempts > 3) {
        const stableState = this.lastStableState.get(tokenId);
        if (stableState) {
          return this.validateAndRepairState(stableState);
        }
        return this.createInitialQuantumState();
      }

      // Attempt state stabilization with validation
      const recoveredState = await this.stabilizeQuantumState(
        this.validateAndRepairState(currentState), 
        consciousnessLevel
      );
      
      if (this.verifyStateIntegrity(recoveredState)) {
        this.lastStableState.set(tokenId, recoveredState);
        this.recoveryAttempts.set(tokenId, 0);
        return recoveredState;
      }

      this.recoveryAttempts.set(tokenId, attempts + 1);
      return this.attemptRecovery(tokenId, currentState, consciousnessLevel);
      
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.QUANTUM,
        error instanceof Error ? error : new Error('Unknown error in quantum recovery'),
        ErrorSeverity.HIGH,
        {
          tokenId,
          recoveryAttempts: this.recoveryAttempts.get(tokenId),
          consciousnessLevel
        }
      );
      throw error;
    }
  }

  private validateAndRepairState(state: QuantumState): QuantumState {
    const repairedState = { ...state };

    // Ensure all required boolean fields are properly initialized
    if (typeof repairedState.consciousnessAlignment !== 'boolean') {
      repairedState.consciousnessAlignment = true;
    }

    // Initialize dimensional state if missing or invalid
    if (!this.validateDimensionalState(repairedState.dimensionalState)) {
      repairedState.dimensionalState = this.createInitialDimensionalState();
    }

    // Ensure resonance patterns array exists
    if (!Array.isArray(repairedState.resonancePatterns)) {
      repairedState.resonancePatterns = [this.createInitialResonancePattern()];
    }

    // Fix numeric fields
    repairedState.coherenceLevel = this.ensureValidNumber(repairedState.coherenceLevel, 1.0);
    repairedState.entanglementIndex = this.ensureValidNumber(repairedState.entanglementIndex, 0.5);
    repairedState.dimensionalSync = this.ensureValidNumber(repairedState.dimensionalSync, 1.0);

    return repairedState;
  }

  private ensureValidNumber(value: any, defaultValue: number): number {
    return (typeof value === 'number' && !isNaN(value)) ? Math.max(0, Math.min(1, value)) : defaultValue;
  }

  private validateDimensionalState(state: DimensionalState | undefined): boolean {
    if (!state) return false;
    
    return typeof state.frequency === 'number' &&
           typeof state.resonance === 'number' &&
           typeof state.stability === 'number' &&
           Array.isArray(state.stateHistory);
  }

  private createInitialDimensionalState(): DimensionalState {
    return {
      frequency: 1.0,
      resonance: 1.0,
      stability: 1.0,
      syncLevel: 1.0,
      quantumAlignment: 1.0,
      dimensionalFrequency: 1.0,
      entropyLevel: 0.0,
      phaseCoherence: 1.0,
      stateHistory: [],
      stabilityMetrics: {
        stabilityTrend: 1.0,
        coherenceQuality: 1.0,
        entropyRisk: 0.0,
        evolutionPotential: 1.0
      }
    };
  }

  private createInitialResonancePattern(): ResonancePattern {
    return {
      pattern_id: crypto.randomUUID(),
      coherence: 1.0,
      frequency: 1.0,
      amplitude: 1.0,
      phase: 0.0,
      timestamp: Date.now(),
      entropyLevel: 0.0,
      stabilityIndex: 1.0,
      quantumSignature: crypto.randomUUID(),
      evolutionPotential: 1.0,
      coherenceQuality: 1.0,
      temporalStability: 1.0,
      dimensionalAlignment: 1.0
    };
  }

  private async stabilizeQuantumState(
    state: QuantumState,
    consciousnessLevel: ConsciousnessLevel
  ): Promise<QuantumState> {
    const stabilizedState = { ...state };
    
    // Apply consciousness-based corrections
    if ('Transcendent' in consciousnessLevel) {
      stabilizedState.coherenceLevel = Math.max(state.coherenceLevel, 0.9);
      stabilizedState.dimensionalState.dimensionalFrequency *= 1.1;
    } else if ('SelfAware' in consciousnessLevel) {
      stabilizedState.coherenceLevel = Math.max(state.coherenceLevel, 0.7);
    }

    // Ensure state boundaries
    stabilizedState.coherenceLevel = Math.max(0.1, Math.min(1.0, stabilizedState.coherenceLevel));
    stabilizedState.dimensionalState.dimensionalFrequency = Math.max(0.1, stabilizedState.dimensionalState.dimensionalFrequency);

    return stabilizedState;
  }

  private verifyStateIntegrity(state: QuantumState): boolean {
    for (const [field, validator] of this.stateValidationRules) {
      if (!validator(state)) {
        this.errorTracker.trackError(
          ErrorCategory.QUANTUM,
          new Error(`Invalid ${field} in quantum state`),
          ErrorSeverity.MEDIUM,
          { field, state }
        );
        return false;
      }
    }
    return true;
  }

  private createInitialQuantumState(): QuantumState {
    return {
      coherenceLevel: 1.0,
      entanglementIndex: 0.5,
      dimensionalSync: 1.0,
      quantumSignature: crypto.randomUUID(),
      resonancePatterns: [this.createInitialResonancePattern()],
      stabilityStatus: 'stable',
      consciousnessAlignment: true,
      dimensionalState: this.createInitialDimensionalState(),
      lastUpdate: Date.now(),
      patternCoherence: 1.0,
      evolutionMetrics: new Map(),
      quantumEntanglement: 1.0,
      temporalStability: 1.0,
      coherenceHistory: [],
      emergenceFactors: {
        consciousnessDepth: 1.0,
        patternComplexity: 0.5,
        quantumResonance: 1.0,
        evolutionVelocity: 0.5,
        dimensionalHarmony: 1.0
      }
    };
  }

  clearRecoveryData(tokenId: string): void {
    this.lastStableState.delete(tokenId);
    this.recoveryAttempts.delete(tokenId);
  }
}