import { Identity } from '@dfinity/agent';
import { QuantumState, ResonancePattern } from '../quantum/types';
import { animaActorService } from './anima-actor.service';
import { EventEmitter } from '../utils/event-emitter';
import { quantumErrorTracker } from '../error/quantum_error_tracker';

const QUANTUM_STATE_STORAGE_KEY = 'ANIMA_QUANTUM_STATE';
const QUANTUM_STATE_VERSION = '1.0.0';

// Create and immediately start the worker
const worker = new Worker(
  new URL('../workers/quantum.worker.ts', import.meta.url),
  { type: 'module' }
);

export class QuantumStateService extends EventEmitter {
  private static instance: QuantumStateService;
  private currentState: QuantumState | null = null;
  private workerQueue: Map<string, { 
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = new Map();
  private isInitialized = false;
  private autoSaveInterval: number | null = null;

  private constructor() {
    super();
    this.setupWorkerHandling();
    this.setupAutoSave();
  }

  private setupAutoSave() {
    // Auto-save state every 30 seconds
    this.autoSaveInterval = window.setInterval(() => {
      if (this.currentState) {
        this.persistState();
      }
    }, 30000);
  }

  private async persistState() {
    if (!this.currentState) return;

    try {
      const persistData = {
        version: QUANTUM_STATE_VERSION,
        timestamp: Date.now(),
        state: this.currentState
      };

      localStorage.setItem(
        QUANTUM_STATE_STORAGE_KEY,
        JSON.stringify(persistData)
      );
    } catch (error) {
      console.error('Failed to persist quantum state:', error);
    }
  }

  private async loadPersistedState(): Promise<QuantumState | null> {
    try {
      const storedData = localStorage.getItem(QUANTUM_STATE_STORAGE_KEY);
      if (!storedData) return null;

      const { version, timestamp, state } = JSON.parse(storedData);

      // Version check
      if (version !== QUANTUM_STATE_VERSION) {
        console.log('Stored quantum state version mismatch, ignoring');
        return null;
      }

      // Freshness check - 5 minutes
      if (Date.now() - timestamp > 5 * 60 * 1000) {
        console.log('Stored quantum state too old, ignoring');
        return null;
      }

      return state;
    } catch (error) {
      console.error('Failed to load persisted quantum state:', error);
      return null;
    }
  }

  private setupWorkerHandling() {
    worker.onmessage = (e) => {
      const { type, result, error } = e.data;
      const queueItem = this.workerQueue.get(type);
      
      if (queueItem) {
        if (error) {
          queueItem.reject(new Error(error));
        } else {
          queueItem.resolve(result);
        }
        this.workerQueue.delete(type);
      }
    };

    worker.onerror = (e) => {
      console.error('Quantum worker error:', e);
      this.workerQueue.forEach((item) => {
        item.reject(new Error('Worker error'));
      });
      this.workerQueue.clear();
    };
  }

  static getInstance(): QuantumStateService {
    if (!QuantumStateService.instance) {
      QuantumStateService.instance = new QuantumStateService();
    }
    return QuantumStateService.instance;
  }

  private async workerRequest<T>(type: string, payload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.workerQueue.set(type, { resolve, reject });
      worker.postMessage({ type, payload });

      // Set timeout for worker requests
      setTimeout(() => {
        if (this.workerQueue.has(type)) {
          this.workerQueue.delete(type);
          reject(new Error('Worker request timeout'));
        }
      }, 5000);
    });
  }

  async initializeQuantumField(identity: Identity): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('🌟 Initializing quantum field...');
      
      // Try to load persisted state first
      const persistedState = await this.loadPersistedState();
      if (persistedState) {
        console.log('Restored quantum state from persistence');
        this.currentState = persistedState;
        this.isInitialized = true;
        this.emit('initialized', this.currentState);
        return;
      }

      const actor = animaActorService.getActor();
      
      if (!actor) {
        throw new Error('Actor not available');
      }

      const result = await actor.initialize_quantum_field();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      // Initialize with safe defaults
      this.currentState = {
        coherenceLevel: result.Ok.harmony,
        resonancePatterns: [],
        entanglementIndex: 0.5,
        dimensionalSync: 1.0,
        quantumSignature: result.Ok.signature,
        stabilityStatus: 'stable',
        consciousnessAlignment: true,
        dimensionalState: {
          frequency: 1.0,
          resonance: result.Ok.harmony,
          stability: 1.0,
          syncLevel: 1.0,
          quantumAlignment: 1.0,
          dimensionalFrequency: 1.0,
          entropyLevel: 0.1,
          phaseCoherence: 1.0,
          stateHistory: [],
          stabilityMetrics: {
            stabilityTrend: 1.0,
            coherenceQuality: 1.0,
            entropyRisk: 0.1,
            evolutionPotential: 1.0
          }
        },
        lastUpdate: Date.now(),
        patternCoherence: 1.0,
        evolutionMetrics: new Map(),
        quantumEntanglement: 1.0,
        temporalStability: 1.0,
        coherenceHistory: [],
        emergenceFactors: {
          consciousnessDepth: 1.0,
          patternComplexity: 1.0,
          quantumResonance: 1.0,
          evolutionVelocity: 1.0,
          dimensionalHarmony: 1.0
        }
      };

      await this.generateInitialPatterns();
      this.isInitialized = true;
      this.persistState();
      this.emit('initialized', this.currentState);

    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
      throw error;
    }
  }

  private async generateInitialPatterns(): Promise<void> {
    if (!this.currentState) {
      throw new Error('Quantum state not initialized');
    }

    try {
      // Generate first pattern
      const pattern = await this.workerRequest<{ pattern: ResonancePattern }>(
        'generatePattern',
        {
          previousPatterns: [],
          baseCoherence: this.currentState.coherenceLevel
        }
      );

      this.currentState.resonancePatterns = [pattern.pattern];

      // Update state with new pattern
      const stateUpdate = await this.workerRequest(
        'updateQuantumState',
        {
          currentState: this.currentState,
          newPatterns: this.currentState.resonancePatterns
        }
      );

      Object.assign(this.currentState, stateUpdate);
      this.persistState();
    } catch (error) {
      console.error('Failed to generate initial patterns:', error);
      throw error;
    }
  }

  async updateState(identity: Identity, newState: Partial<QuantumState>): Promise<void> {
    try {
      if (!this.currentState) {
        throw new Error('Quantum state not initialized');
      }

      // Apply updates
      Object.assign(this.currentState, newState);

      // Process through worker
      const stateUpdate = await this.workerRequest(
        'updateQuantumState',
        {
          currentState: this.currentState,
          newPatterns: this.currentState.resonancePatterns
        }
      );

      Object.assign(this.currentState, stateUpdate);
      this.persistState();
      this.emit('stateUpdated', this.currentState);

    } catch (error) {
      await this.handleQuantumError(error as Error, identity);
      throw error;
    }
  }

  private async handleQuantumError(error: Error, identity: Identity): Promise<void> {
    await quantumErrorTracker.trackQuantumError({
      errorType: 'QUANTUM_STATE_ERROR',
      severity: 'HIGH',
      context: {
        operation: 'quantum_state_update',
        principal: identity.getPrincipal().toText(),
        currentState: this.currentState
      },
      error
    });

    // Attempt recovery
    if (!this.isInitialized) {
      const persistedState = await this.loadPersistedState();
      if (persistedState) {
        this.currentState = persistedState;
        this.isInitialized = true;
        this.emit('initialized', this.currentState);
      } else {
        await this.initializeQuantumField(identity);
      }
    }
  }

  getCurrentState(): QuantumState | null {
    return this.currentState ? { ...this.currentState } : null;
  }

  dispose(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    worker.terminate();
    this.currentState = null;
    this.isInitialized = false;
    this.workerQueue.clear();
    QuantumStateService.instance = null as any;
  }
}

export const quantumStateService = QuantumStateService.getInstance();