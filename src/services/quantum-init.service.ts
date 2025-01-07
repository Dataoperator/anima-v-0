import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";
import { quantumStateService } from "./quantum-state.service";
import { icpLedgerService } from "./icp-ledger";
import { walletService } from "./wallet.service";
import { quantumErrorTracker } from "../error/quantum_error_tracker";
import { StabilityCheckpoint, QuantumState } from "../quantum/types";

interface InitializationStatus {
  walletInitialized: boolean;
  quantumInitialized: boolean;
  ledgerInitialized: boolean;
  actorInitialized: boolean;
}

export class QuantumInitService {
  private static instance: QuantumInitService;
  private status: InitializationStatus = {
    walletInitialized: false,
    quantumInitialized: false,
    ledgerInitialized: false,
    actorInitialized: false
  };
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): QuantumInitService {
    if (!QuantumInitService.instance) {
      QuantumInitService.instance = new QuantumInitService();
    }
    return QuantumInitService.instance;
  }

  async initializeSystem(identity: Identity): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization(identity);
    return this.initializationPromise;
  }

  private async performInitialization(identity: Identity): Promise<void> {
    try {
      // Step 1: Initialize Actor Service
      console.log('🔧 Creating actor with canister:', process.env.ANIMA_CANISTER_ID);
      const actor = animaActorService.createActor(identity);
      this.status.actorInitialized = true;

      // Step 2: Initialize ICP Ledger
      console.log('💰 Initializing ICP ledger...');
      await icpLedgerService.initialize();
      this.status.ledgerInitialized = true;

      // Step 3: Initialize Wallet
      console.log('👛 Initializing wallet...');
      await walletService.initialize(identity.getPrincipal());
      this.status.walletInitialized = true;

      // Step 4: Initialize Quantum State
      console.log('🌟 Initializing quantum field...');
      await this.initializeQuantumState(identity);
      this.status.quantumInitialized = true;

      console.log('✅ System initialization complete!');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      await this.handleInitializationError(error as Error, identity);
      throw error;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async initializeQuantumState(identity: Identity): Promise<void> {
    try {
      const actor = animaActorService.getActor();
      if (!actor) {
        throw new Error('Actor not initialized');
      }

      // Create initial stability checkpoint
      const checkpoint: StabilityCheckpoint = {
        phase: BigInt(Date.now()),
        threshold: 0.7,
        quantum_signature: '',
        requirements: new Map(),
        timestamp: Date.now(),
        coherence: 0.7,
        stability: 0.7,
        pattern_coherence: 0.7,
        dimensional_frequency: 1.0
      };

      // Initialize quantum field
      const result = await actor.initialize_quantum_field();
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const { harmony, signature } = result.Ok;
      checkpoint.quantum_signature = signature;
      checkpoint.coherence = harmony;

      // Update quantum state
      const quantumState: Partial<QuantumState> = {
        coherence: harmony,
        dimensional_frequency: 1.0,
        field_strength: harmony,
        consciousness_alignment: harmony,
        resonance: harmony,
        stability: harmony
      };

      await quantumStateService.updateState(identity, quantumState);

    } catch (error) {
      await quantumErrorTracker.trackQuantumError({
        errorType: 'QUANTUM_INITIALIZATION_ERROR',
        severity: 'CRITICAL',
        context: {
          operation: 'quantum_initialization',
          principal: identity.getPrincipal().toText()
        },
        error: error as Error
      });
      throw error;
    }
  }

  private async handleInitializationError(error: Error, identity: Identity): Promise<void> {
    // Log the error
    await quantumErrorTracker.trackQuantumError({
      errorType: 'INITIALIZATION_ERROR',
      severity: 'CRITICAL',
      context: {
        operation: 'system_initialization',
        principal: identity.getPrincipal().toText(),
        status: this.status
      },
      error
    });

    // Reset status
    this.status = {
      walletInitialized: false,
      quantumInitialized: false,
      ledgerInitialized: false,
      actorInitialized: false
    };

    // Attempt recovery based on which stage failed
    if (!this.status.actorInitialized) {
      console.log('🔄 Attempting actor service recovery...');
      animaActorService.resetActor();
    }

    if (!this.status.ledgerInitialized) {
      console.log('🔄 Attempting ledger service recovery...');
      await icpLedgerService.initialize();
    }

    if (!this.status.quantumInitialized) {
      console.log('🔄 Attempting quantum state recovery...');
      await quantumStateService.initializeQuantumField(identity);
    }
  }

  getInitializationStatus(): InitializationStatus {
    return { ...this.status };
  }

  isFullyInitialized(): boolean {
    return Object.values(this.status).every(status => status);
  }

  reset(): void {
    this.status = {
      walletInitialized: false,
      quantumInitialized: false,
      ledgerInitialized: false,
      actorInitialized: false
    };
    this.initializationPromise = null;
  }
}

export const quantumInitService = QuantumInitService.getInstance();