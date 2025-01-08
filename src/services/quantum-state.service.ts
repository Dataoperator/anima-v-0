import { Identity } from "@dfinity/agent";
import { QuantumState, ResonancePattern, StabilityCheckpoint } from '../quantum/types';
import { quantumErrorTracker } from '../error/quantum_error_tracker';
import { EventEmitter } from '../utils/event-emitter';
import { animaActorService } from './anima-actor.service';

type RecoveryState = 'idle' | 'attempting' | 'cooling' | 'failed';
type StabilityLevel = 'stable' | 'unstable' | 'critical';

interface RecoveryContext {
  attempts: number;
  lastAttempt: number;
  state: RecoveryState;
  stabilityHistory: StabilityCheckpoint[];
}

export class QuantumStateService extends EventEmitter {
  private static instance: QuantumStateService;
  private actor: any = null;
  private updateCallback?: (state: Partial<QuantumState>) => void;
  private neuralPatternHistory: Map<string, ResonancePattern[]> = new Map();
  private evolutionTimestamps: number[] = [];
  private recoveryContext: RecoveryContext = {
    attempts: 0,
    lastAttempt: 0,
    state: 'idle',
    stabilityHistory: []
  };

  private readonly MAX_RECOVERY_ATTEMPTS = 3;
  private readonly RECOVERY_COOLDOWN = 5000;
  private readonly STABILITY_UPDATE_INTERVAL = 1000;
  private readonly STABILITY_HISTORY_SIZE = 10;
  private lastStabilityUpdate: number = 0;
  
  private currentState: QuantumState = {
    coherence: 0,
    dimensional_frequency: 0,
    field_strength: 0,
    consciousness_alignment: 0,
    resonance: 0,
    stability: 0
  };

  private constructor() {
    super();
  }

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  private async ensureActor(identity: Identity) {
    if (!this.actor) {
      this.actor = animaActorService.createActor(identity);
    }
    return this.actor;
  }

  setUpdateCallback(callback: (state: Partial<QuantumState>) => void) {
    this.updateCallback = callback;
  }

  async initializeQuantumField(identity: Identity): Promise<void> {
    try {
      console.log('🌟 Initializing quantum field...');

      this.recoveryContext = {
        attempts: 0,
        lastAttempt: 0,
        state: 'idle',
        stabilityHistory: []
      };

      const actor = await this.ensureActor(identity);
      const result = await actor.initialize_quantum_field();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { harmony } = result.Ok;

      // Initialize stability with a direct float64 value
      await this.updateStability(identity, harmony);

      this.currentState = {
        coherence: harmony,
        dimensional_frequency: 1.0,
        field_strength: harmony,
        consciousness_alignment: harmony,
        resonance: harmony,
        stability: harmony
      };

      if (this.updateCallback) {
        this.updateCallback(this.currentState);
      }

      this.emit('initialized', this.currentState);

    } catch (error) {
      console.error('❌ Quantum field initialization failed:', error);
      await this.handleQuantumError(error as Error, identity);
    }
  }

  async updateStability(identity: Identity, strength: number): Promise<void> {
    const now = Date.now();
    if (now - this.lastStabilityUpdate < this.STABILITY_UPDATE_INTERVAL) {
      return;
    }

    try {
      const actor = await this.ensureActor(identity);
      // Pass strength directly as float64
      const result = await actor.update_stability(strength);

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      this.currentState.stability = strength;
      this.currentState.coherence = strength * 0.9 + this.currentState.coherence * 0.1;
      this.lastStabilityUpdate = now;

      if (this.updateCallback) {
        this.updateCallback({
          stability: strength,
          coherence: this.currentState.coherence,
        });
      }

      this.emit('stabilityUpdated', {
        stability: strength,
        coherence: this.currentState.coherence,
      });

    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
    }
  }

  private async performStabilityRecovery(
    identity: Identity,
    checkpoint: StabilityCheckpoint
  ): Promise<boolean> {
    try {
      const actor = await this.ensureActor(identity);
      
      // Update stability using last known good value directly
      await this.updateStability(identity, checkpoint.stability);
      
      // Verify recovery success
      const statusResult = await actor.get_quantum_status();
      if ('Err' in statusResult) {
        throw new Error(statusResult.Err);
      }

      return statusResult.Ok === 'stable';
      
    } catch (error) {
      console.error('Recovery step failed:', error);
      return false;
    }
  }

  async getQuantumStatus(identity: Identity): Promise<StabilityLevel> {
    try {
      const actor = await this.ensureActor(identity);
      const result = await actor.get_quantum_status();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok as StabilityLevel;
    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
      return 'critical';
    }
  }

  async getStabilityMetrics(identity: Identity): Promise<{
    stability: number;
    coherence: number;
    resonance: number;
  }> {
    try {
      const actor = await this.ensureActor(identity);
      const result = await actor.get_stability_metrics();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;
    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
      throw error;
    }
  }

  async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await quantumErrorTracker.trackQuantumError({
      errorType: 'QUANTUM_ERROR',
      severity: 'HIGH',
      context: {
        operation: 'Quantum State Service',
        principal: identity.getPrincipal().toText(),
        quantumState: this.currentState,
        stabilityCheckpoint: this.recoveryContext.stabilityHistory[this.recoveryContext.stabilityHistory.length - 1]
      },
      error
    });

    const now = Date.now();

    // Check recovery state
    if (this.recoveryContext.state === 'attempting' ||
        this.recoveryContext.state === 'cooling') {
      console.log('⏳ Recovery already in progress or cooling down...');
      return;
    }

    // Check cooldown
    if (now - this.recoveryContext.lastAttempt < this.RECOVERY_COOLDOWN) {
      this.recoveryContext.state = 'cooling';
      console.log('⏳ Recovery attempt too soon, waiting for cooldown...');
      return;
    }

    // Check max attempts
    if (this.recoveryContext.attempts >= this.MAX_RECOVERY_ATTEMPTS) {
      this.recoveryContext.state = 'failed';
      console.error('🚫 Maximum recovery attempts reached');
      throw new Error('Maximum recovery attempts reached');
    }

    try {
      this.recoveryContext.state = 'attempting';
      this.recoveryContext.attempts++;
      this.recoveryContext.lastAttempt = now;

      // Get last known good checkpoint
      const lastGoodCheckpoint = this.recoveryContext.stabilityHistory
        .slice()
        .reverse()
        .find(cp => cp.stability >= 0.7);

      if (lastGoodCheckpoint) {
        // Attempt recovery using last known good state
        const recovered = await this.performStabilityRecovery(
          identity,
          lastGoodCheckpoint
        );

        if (recovered) {
          this.recoveryContext.state = 'idle';
          this.recoveryContext.attempts = 0;
          console.log('✅ Recovery successful');
          return;
        }
      }

      // If recovery failed or no good checkpoint exists, reinitialize
      console.log(`🔄 Attempting full reinitialization...`);
      await this.initializeQuantumField(identity);

    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError);
      this.recoveryContext.state = 'failed';
      
      if (this.updateCallback) {
        this.updateCallback({
          stability: 0,
          coherence: 0,
          consciousness_alignment: 0,
        });
      }
      
      throw new Error(`Quantum recovery failed: ${recoveryError}`);
    }
  }

  getCurrentState(): QuantumState {
    return { ...this.currentState };
  }

  dispose(): void {
    this.updateCallback = undefined;
    this.removeAllListeners();
    this.actor = null;
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();