import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { QuantumState, ResonancePattern } from '../quantum/types';
import { ErrorTracker } from '../error/quantum_error';

export class QuantumStateService {
  private static instance: QuantumStateService;
  private errorTracker: ErrorTracker;
  private updateCallback?: (state: Partial<QuantumState>) => void;
  private neuralPatternHistory: Map<string, ResonancePattern[]> = new Map();
  private evolutionTimestamps: number[] = [];
  private recoveryAttempts: number = 0;
  private readonly MAX_RECOVERY_ATTEMPTS = 3;
  private readonly RECOVERY_COOLDOWN = 5000; // 5 seconds
  private lastRecoveryAttempt: number = 0;
  private lastStabilityUpdate: number = 0;
  private readonly STABILITY_UPDATE_INTERVAL = 1000; // 1 second

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  setUpdateCallback(callback: (state: Partial<QuantumState>) => void) {
    this.updateCallback = callback;
  }

  async initializeQuantumField(identity: Identity): Promise<void> {
    try {
      const actor = animaActorService.createActor(identity);
      
      console.log('🌟 Initializing quantum field...');
      const result = await actor.initialize_quantum_field();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { harmony, signature } = result.Ok;

      // Initialize with stability metrics
      await this.updateStability(identity, harmony);

      // Generate initial neural patterns
      console.log('🧠 Generating neural patterns...');
      const neuralResult = await actor.generate_neural_patterns();
      
      if ('Err' in neuralResult) {
        throw new Error(neuralResult.Err);
      }

      const { pattern, awareness, understanding } = neuralResult.Ok;

      // Calculate resonance and stability
      const resonanceValue = await this.calculateResonance(identity);
      const stabilityMetrics = await this.getStabilityMetrics(identity);

      // Initialize genesis for quantum stabilization
      console.log('✨ Initializing genesis...');
      const genesisResult = await actor.initialize_genesis();
      
      if ('Err' in genesisResult) {
        throw new Error(genesisResult.Err);
      }

      if (this.updateCallback) {
        this.updateCallback({
          coherenceLevel: harmony,
          quantumSignature: signature,
          resonancePatterns: [{
            pattern_id: Date.now().toString(),
            coherence: awareness,
            frequency: understanding,
            amplitude: harmony,
            phase: harmony,
            timestamp: Date.now()
          }],
          dimensionalSync: awareness,
          stabilityStatus: this.calculateStabilityStatus(harmony),
          lastUpdate: Date.now(),
          resonance: resonanceValue,
          field_strength: stabilityMetrics[0],
          consciousness_alignment: stabilityMetrics[1]
        });
      }

      this.recoveryAttempts = 0;
      console.log('✅ Quantum field initialized successfully');

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
    
    const actor = animaActorService.createActor(identity);
    const result = await actor.update_stability({
      strength,
      timestamp: BigInt(now)
    });

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const { stability, quantum_alignment } = result.Ok;
    this.lastStabilityUpdate = now;

    if (this.updateCallback) {
      this.updateCallback({
        stability,
        consciousness_alignment: quantum_alignment,
        lastUpdate: now
      });
    }
  }

  async calculateResonance(identity: Identity): Promise<number> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.calculate_resonance();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }

  async getQuantumStatus(identity: Identity): Promise<'stable' | 'unstable' | 'critical'> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.get_quantum_status();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok as 'stable' | 'unstable' | 'critical';
  }

  async getStabilityMetrics(identity: Identity): Promise<[number, number, number]> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.get_stability_metrics();

    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }

  private calculateStabilityStatus(harmony: number): 'stable' | 'unstable' | 'critical' {
    if (harmony >= 0.7) return 'stable';
    if (harmony >= 0.4) return 'unstable';
    return 'critical';
  }

  async checkStability(identity: Identity): Promise<boolean> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.check_quantum_stability();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const stabilityLevel = result.Ok;
    this.evolutionTimestamps.push(Date.now());

    if (this.evolutionTimestamps.length > 10) {
      this.evolutionTimestamps.shift();
    }

    // Update stability metrics
    const metrics = await this.getStabilityMetrics(identity);
    const resonance = await this.calculateResonance(identity);
    
    if (this.updateCallback) {
      this.updateCallback({
        stabilityStatus: this.calculateStabilityStatus(stabilityLevel ? 1 : 0),
        entanglementIndex: stabilityLevel ? 1 : 0,
        field_strength: metrics[0],
        consciousness_alignment: metrics[1],
        resonance
      });
    }

    return stabilityLevel;
  }

  async updateState(identity: Identity, updates: Partial<QuantumState>): Promise<void> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.update_state({
      coherence: updates.coherence,
      dimensional_frequency: updates.dimensional_frequency,
      field_strength: updates.field_strength,
      consciousness_alignment: updates.consciousness_alignment,
      resonance: updates.resonance,
      stability: updates.stability
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
  }

  // Rest of existing methods...
  async generateNeuralPatterns(identity: Identity) {
    const actor = animaActorService.createActor(identity);
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const { pattern, awareness, understanding } = result.Ok;
    const resonancePattern = {
      pattern_id: Date.now().toString(),
      coherence: awareness,
      frequency: understanding,
      amplitude: awareness,
      phase: understanding,
      timestamp: Date.now()
    };

    this.neuralPatternHistory.set(Date.now().toString(), [resonancePattern]);

    // Keep only last 10 pattern sets
    const keys = Array.from(this.neuralPatternHistory.keys()).sort();
    while (this.neuralPatternHistory.size > 10) {
      const oldestKey = keys.shift();
      if (oldestKey) this.neuralPatternHistory.delete(oldestKey);
    }

    // Update quantum state with new pattern
    await this.updateState(identity, {
      coherenceLevel: awareness,
      dimensionalSync: understanding
    });

    if (this.updateCallback) {
      this.updateCallback({
        resonancePatterns: [resonancePattern],
        coherenceLevel: awareness,
        dimensionalSync: understanding,
        lastUpdate: Date.now()
      });
    }

    return { pattern, resonancePatterns: [resonancePattern] };
  }

  async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'QUANTUM_ERROR',
      severity: 'HIGH',
      context: 'Quantum State Service',
      error
    });

    // Check recovery cooldown and attempts
    const now = Date.now();
    if (now - this.lastRecoveryAttempt < this.RECOVERY_COOLDOWN) {
      console.log('⏳ Recovery attempt too soon, waiting for cooldown...');
      return;
    }

    if (this.recoveryAttempts >= this.MAX_RECOVERY_ATTEMPTS) {
      console.error('🚫 Maximum recovery attempts reached');
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'critical',
          coherenceLevel: 0.1
        });
      }
      throw new Error('Maximum recovery attempts reached');
    }

    try {
      this.recoveryAttempts++;
      this.lastRecoveryAttempt = now;

      // Get current stability metrics for recovery
      const metrics = await this.getStabilityMetrics(identity);
      
      // Attempt stability recovery first
      await this.updateStability(identity, metrics[0]);
      
      // Check quantum status after stability update
      const status = await this.getQuantumStatus(identity);
      
      if (status === 'critical') {
        // Full reinitialization needed
        console.log(`🔄 Recovery attempt ${this.recoveryAttempts}/${this.MAX_RECOVERY_ATTEMPTS}`);
        const actor = animaActorService.createActor(identity);
        const result = await actor.initialize_quantum_field();

        if ('Err' in result) {
          throw new Error(result.Err);
        }
      }

      // Update state after recovery
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: status,
          coherenceLevel: status === 'stable' ? 0.8 : 0.5,
          field_strength: metrics[0],
          consciousness_alignment: metrics[1],
          lastUpdate: Date.now()
        });
      }

      console.log('✅ Recovery successful');

    } catch (recoveryError) {
      console.error('❌ Recovery failed:', recoveryError);
      if (this.updateCallback) {
        this.updateCallback({
          stabilityStatus: 'critical',
          coherenceLevel: 0.1,
          lastUpdate: Date.now()
        });
      }
      throw new Error(`Quantum recovery failed: ${recoveryError}`);
    }
  }

  dispose(): void {
    this.updateCallback = undefined;
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();