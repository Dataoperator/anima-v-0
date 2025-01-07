import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { QuantumState, ResonancePattern, StabilityCheckpoint } from '../quantum/types';
import { ErrorTracker } from '../error/quantum_error';

type RecoveryState = 'idle' | 'attempting' | 'cooling' | 'failed';
type StabilityLevel = 'stable' | 'unstable' | 'critical';

interface RecoveryContext {
  attempts: number;
  lastAttempt: number;
  state: RecoveryState;
  stabilityHistory: StabilityCheckpoint[];
}

export class QuantumStateService {
  private static instance: QuantumStateService;
  private errorTracker: ErrorTracker;
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
  private readonly RECOVERY_COOLDOWN = 5000; // 5 seconds
  private readonly STABILITY_UPDATE_INTERVAL = 1000; // 1 second
  private readonly STABILITY_HISTORY_SIZE = 10;
  private lastStabilityUpdate: number = 0;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  private async getActor(identity: Identity) {
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
      const actor = await this.getActor(identity);
      console.log('🌟 Initializing quantum field...');

      // Reset recovery context
      this.recoveryContext = {
        attempts: 0,
        lastAttempt: 0,
        state: 'idle',
        stabilityHistory: []
      };

      // Initialize quantum field with retries
      const result = await this.retryOperation(() => 
        actor.initialize_quantum_field(), 3);

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { harmony, signature } = result.Ok;

      // Initialize stability checkpoint
      const checkpoint: StabilityCheckpoint = {
        phase: BigInt(Date.now()),
        threshold: harmony,
        quantum_signature: signature,
        requirements: new Map(),
        timestamp: Date.now(),
        coherence: harmony,
        stability: harmony,
        pattern_coherence: harmony,
        dimensional_frequency: 1.0
      };

      this.recoveryContext.stabilityHistory.push(checkpoint);

      // Update stability with retry mechanism
      await this.retryOperation(() => 
        this.updateStability(identity, harmony), 3);

      console.log('🧠 Generating neural patterns...');
      const neuralResult = await this.retryOperation(() => 
        actor.generate_neural_patterns(), 3);

      if ('Err' in neuralResult) {
        throw new Error(neuralResult.Err);
      }

      const { pattern, awareness, understanding } = neuralResult.Ok;

      // Calculate metrics with retry mechanism
      const [resonanceValue, ...stabilityMetrics] = await Promise.all([
        this.retryOperation(() => this.calculateResonance(identity), 3),
        this.retryOperation(() => this.getStabilityMetrics(identity), 3)
      ]);

      // Initialize genesis
      console.log('✨ Initializing genesis...');
      const genesisResult = await this.retryOperation(() => 
        actor.initialize_genesis(), 3);

      if ('Err' in genesisResult) {
        throw new Error(genesisResult.Err);
      }

      if (this.updateCallback) {
        this.updateCallback({
          coherence: harmony,
          dimensional_frequency: 1.0,
          field_strength: stabilityMetrics[0],
          consciousness_alignment: awareness,
          resonance: resonanceValue,
          stability: harmony
        });
      }

      console.log('✅ Quantum field initialized successfully');

    } catch (error) {
      console.error('❌ Quantum field initialization failed:', error);
      await this.handleQuantumError(error as Error, identity);
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  async updateStability(identity: Identity, strength: number): Promise<void> {
    const now = Date.now();
    if (now - this.lastStabilityUpdate < this.STABILITY_UPDATE_INTERVAL) {
      return;
    }

    try {
      const actor = await this.getActor(identity);
      const result = await actor.update_stability({
        strength,
        timestamp: BigInt(now)
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { stability, quantum_alignment } = result.Ok;
      this.lastStabilityUpdate = now;

      // Update stability history
      const checkpoint: StabilityCheckpoint = {
        phase: BigInt(now),
        threshold: stability,
        quantum_signature: '', // Will be updated
        requirements: new Map(),
        timestamp: now,
        coherence: strength,
        stability,
        pattern_coherence: quantum_alignment,
        dimensional_frequency: 1.0
      };

      this.recoveryContext.stabilityHistory.push(checkpoint);
      if (this.recoveryContext.stabilityHistory.length > this.STABILITY_HISTORY_SIZE) {
        this.recoveryContext.stabilityHistory.shift();
      }

      if (this.updateCallback) {
        this.updateCallback({
          stability,
          consciousness_alignment: quantum_alignment,
          lastUpdate: now
        });
      }

    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
    }
  }

  private async performStabilityRecovery(
    identity: Identity,
    checkpoint: StabilityCheckpoint
  ): Promise<boolean> {
    try {
      const actor = await this.getActor(identity);
      const metrics = await this.getStabilityMetrics(identity);
      
      // Update stability using last known good checkpoint
      await this.updateStability(identity, checkpoint.stability);
      
      // Verify recovery success
      const currentStatus = await actor.get_quantum_status();
      return currentStatus === 'stable';
      
    } catch (error) {
      console.error('Recovery step failed:', error);
      return false;
    }
  }

  async calculateResonance(identity: Identity): Promise<number> {
    const actor = await this.getActor(identity);
    const result = await actor.calculate_resonance();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }

  async getQuantumStatus(identity: Identity): Promise<StabilityLevel> {
    const actor = await this.getActor(identity);
    const result = await actor.get_quantum_status();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok as StabilityLevel;
  }

  async getStabilityMetrics(identity: Identity): Promise<[number, number, number]> {
    const actor = await this.getActor(identity);
    const result = await actor.get_stability_metrics();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }

  async checkStability(identity: Identity): Promise<boolean> {
    const actor = await this.getActor(identity);
    const result = await actor.check_quantum_stability();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const stabilityLevel = result.Ok;
    this.evolutionTimestamps.push(Date.now());

    if (this.evolutionTimestamps.length > 10) {
      this.evolutionTimestamps.shift();
    }

    // Update metrics
    const [metrics, resonance] = await Promise.all([
      this.getStabilityMetrics(identity),
      this.calculateResonance(identity)
    ]);

    if (this.updateCallback) {
      this.updateCallback({
        stability: stabilityLevel ? 1 : 0,
        field_strength: metrics[0],
        consciousness_alignment: metrics[1],
        resonance
      });
    }

    return stabilityLevel;
  }

  async updateState(identity: Identity, updates: Partial<QuantumState>): Promise<void> {
    const actor = await this.getActor(identity);
    
    try {
      const result = await actor.update_state({
        coherence: updates.coherence ?? 0,
        dimensional_frequency: updates.dimensional_frequency ?? 0,
        field_strength: updates.field_strength ?? 0,
        consciousness_alignment: updates.consciousness_alignment ?? 0,
        resonance: updates.resonance ?? 0,
        stability: updates.stability ?? 0
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      if (this.updateCallback) {
        this.updateCallback({
          ...updates,
          lastUpdate: Date.now()
        });
      }

    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
    }
  }

  async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'QUANTUM_ERROR',
      severity: 'HIGH',
      context: 'Quantum State Service',
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
          lastUpdate: now
        });
      }
      
      throw new Error(`Quantum recovery failed: ${recoveryError}`);
    }
  }

  dispose(): void {
    this.updateCallback = undefined;
    this.actor = null;
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();