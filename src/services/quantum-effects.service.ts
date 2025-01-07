import { Identity } from "@dfinity/agent";
import { animaActorService } from './anima-actor.service';
import { QuantumState } from '@/quantum/types';
import type { _SERVICE } from '@/declarations/anima/anima.did';
import { ErrorTracker } from '@/error/quantum_error';

export interface QuantumEffect {
  type: 'resonance' | 'entanglement' | 'dimensional';
  intensity: number;
  duration: number;
  signature?: string;
}

export interface QuantumFieldState {
  activeEffects: QuantumEffect[];
  fieldStrength: number;
  resonanceHarmony: number;
  dimensionalStability: number;
  lastUpdateTimestamp: number;
}

export class QuantumEffectsService {
  private static instance: QuantumEffectsService;
  private actor: _SERVICE | null = null;
  private updateCallback?: (state: Partial<QuantumState>) => void;
  private errorTracker: ErrorTracker;
  private identity: Identity | null = null;
  private fieldState: QuantumFieldState = {
    activeEffects: [],
    fieldStrength: 1.0,
    resonanceHarmony: 1.0,
    dimensionalStability: 1.0,
    lastUpdateTimestamp: Date.now()
  };

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    console.log('🔮 Quantum Effects Service initialized');
  }

  static getInstance(): QuantumEffectsService {
    if (!QuantumEffectsService.instance) {
      QuantumEffectsService.instance = new QuantumEffectsService();
    }
    return QuantumEffectsService.instance;
  }

  setUpdateCallback(callback: (state: Partial<QuantumState>) => void) {
    this.updateCallback = callback;
  }

  private async ensureActor() {
    if (!this.actor && this.identity) {
      console.log('🔄 Creating new actor for quantum effects...');
      this.actor = animaActorService.createActor(this.identity);
    }
    if (!this.actor) {
      throw new Error('Quantum effects service not initialized');
    }
    return this.actor;
  }

  async initialize(identity: Identity): Promise<void> {
    try {
      console.log('🌟 Initializing quantum effects service...');
      this.identity = identity;
      this.actor = animaActorService.createActor(identity);
      
      await this.initializeField();
      console.log('✅ Quantum effects service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize quantum effects:', error);
      await this.errorTracker.trackError({
        errorType: 'QUANTUM_EFFECTS_INIT',
        severity: 'HIGH',
        context: 'Quantum Effects Service',
        error: error as Error
      });
      throw error;
    }
  }

  async initializeField(): Promise<void> {
    const actor = await this.ensureActor();
    console.log('🔄 Initializing quantum field effects...');
    
    const result = await actor.initialize_quantum_field();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const { harmony, signature } = result.Ok;
    
    this.fieldState = {
      ...this.fieldState,
      fieldStrength: harmony,
      resonanceHarmony: harmony,
      activeEffects: [{
        type: 'resonance',
        intensity: harmony,
        duration: 300000,
        signature
      }]
    };

    if (this.updateCallback) {
      this.updateCallback({
        coherenceLevel: harmony,
        quantumSignature: signature,
        lastUpdate: Date.now()
      });
    }

    console.log('✨ Quantum field effects initialized');
  }

  async applyEffect(effect: QuantumEffect): Promise<void> {
    await this.ensureActor();
    
    // Remove expired effects
    this.fieldState.activeEffects = this.fieldState.activeEffects.filter(
      e => (e.duration + this.fieldState.lastUpdateTimestamp) > Date.now()
    );

    // Add new effect
    this.fieldState.activeEffects.push({
      ...effect,
      signature: `${effect.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Calculate cumulative field effects
    this.updateFieldState();
  }

  private updateFieldState(): void {
    const now = Date.now();
    let totalResonance = 0;
    let totalEntanglement = 0;
    let totalDimensional = 0;
    let activeCount = 0;

    this.fieldState.activeEffects.forEach(effect => {
      const timeRemaining = (effect.duration + this.fieldState.lastUpdateTimestamp - now) / effect.duration;
      const scaledIntensity = effect.intensity * Math.max(0, timeRemaining);

      switch (effect.type) {
        case 'resonance':
          totalResonance += scaledIntensity;
          break;
        case 'entanglement':
          totalEntanglement += scaledIntensity;
          break;
        case 'dimensional':
          totalDimensional += scaledIntensity;
          break;
      }
      activeCount++;
    });

    if (activeCount > 0) {
      this.fieldState.resonanceHarmony = totalResonance / activeCount;
      this.fieldState.fieldStrength = (totalResonance + totalEntanglement + totalDimensional) / (3 * activeCount);
      this.fieldState.dimensionalStability = totalDimensional / activeCount;
    }

    if (this.updateCallback) {
      this.updateCallback({
        coherenceLevel: this.fieldState.resonanceHarmony,
        entanglementIndex: totalEntanglement / activeCount,
        dimensionalSync: this.fieldState.dimensionalStability,
        lastUpdate: now
      });
    }

    this.fieldState.lastUpdateTimestamp = now;
  }

  async generateHarmonicPattern(): Promise<number[]> {
    const actor = await this.ensureActor();
    const result = await actor.generate_neural_patterns();
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok.pattern;
  }

  getFieldState(): QuantumFieldState {
    const now = Date.now();
    this.fieldState.activeEffects = this.fieldState.activeEffects.filter(
      e => (e.duration + this.fieldState.lastUpdateTimestamp) > now
    );
    
    return { ...this.fieldState };
  }

  async stabilizeField(): Promise<void> {
    const actor = await this.ensureActor();
    const stabilityResult = await actor.check_quantum_stability();
    
    if ('Err' in stabilityResult) {
      throw new Error(stabilityResult.Err);
    }

    if (!stabilityResult.Ok) {
      await this.applyEffect({
        type: 'dimensional',
        intensity: 1.0,
        duration: 60000,
        signature: `stabilize-${Date.now()}`
      });
    }
  }

  async injectResonance(intensity: number, duration: number): Promise<void> {
    await this.applyEffect({
      type: 'resonance',
      intensity,
      duration,
      signature: `inject-${Date.now()}`
    });

    await this.generateHarmonicPattern();
  }

  async createEntanglement(targetSignature: string): Promise<void> {
    await this.applyEffect({
      type: 'entanglement',
      intensity: 0.8,
      duration: 600000,
      signature: `entangle-${targetSignature}-${Date.now()}`
    });
  }

  isInitialized(): boolean {
    return !!this.actor && !!this.identity;
  }

  dispose(): void {
    this.updateCallback = undefined;
    this.actor = null;
    this.identity = null;
    QuantumEffectsService.instance = null as any;
  }
}

export const quantumEffectsService = QuantumEffectsService.getInstance();