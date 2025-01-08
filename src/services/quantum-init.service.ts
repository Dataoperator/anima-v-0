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

interface ServiceDependencies {
  actor: boolean;
  ledger: boolean;
  wallet: boolean;
  quantum: boolean;
}

export class QuantumInitService {
  private static instance: QuantumInitService;
  private status: InitializationStatus = {
    walletInitialized: false,
    quantumInitialized: false,
    ledgerInitialized: false,
    actorInitialized: false
  };
  private dependencies: ServiceDependencies = {
    actor: false,
    ledger: false,
    wallet: false,
    quantum: false
  };
  private initializationPromise: Promise<void> | null = null;
  private initializationQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  private constructor() {
    this.setupDependencyHandling();
  }

  private setupDependencyHandling() {
    // Handle dependency resolution
    const processDependencyQueue = async () => {
      if (this.isProcessingQueue) return;
      this.isProcessingQueue = true;

      try {
        while (this.initializationQueue.length > 0) {
          const nextInit = this.initializationQueue[0];
          await nextInit();
          this.initializationQueue.shift();
        }
      } catch (error) {
        console.error('Dependency initialization failed:', error);
      } finally {
        this.isProcessingQueue = false;
      }
    };

    // Watch for dependency changes
    const dependencyHandler = {
      set: (target: ServiceDependencies, prop: keyof ServiceDependencies, value: boolean) => {
        target[prop] = value;
        if (value) {
          processDependencyQueue();
        }
        return true;
      }
    };

    this.dependencies = new Proxy(this.dependencies, dependencyHandler);
  }

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
      // Reset dependencies
      Object.keys(this.dependencies).forEach(key => {
        this.dependencies[key as keyof ServiceDependencies] = false;
      });

      // Step 1: Initialize Actor Service
      console.log('🔧 Creating actor with canister:', process.env.ANIMA_CANISTER_ID);
      const actor = await this.initializeWithDependencyCheck(
        () => animaActorService.createActor(identity),
        'actor'
      );
      this.status.actorInitialized = true;

      // Step 2: Initialize ICP Ledger (depends on actor)
      console.log('💰 Initializing ICP ledger...');
      await this.initializeWithDependencyCheck(
        () => icpLedgerService.initialize(),
        'ledger',
        ['actor']
      );
      this.status.ledgerInitialized = true;

      // Step 3: Initialize Wallet (depends on ledger)
      console.log('👛 Initializing wallet...');
      await this.initializeWithDependencyCheck(
        () => walletService.initialize(identity.getPrincipal()),
        'wallet',
        ['ledger']
      );
      this.status.walletInitialized = true;

      // Step 4: Initialize Quantum State (depends on actor and wallet)
      console.log('🌟 Initializing quantum field...');
      await this.initializeWithDependencyCheck(
        () => this.initializeQuantumState(identity),
        'quantum',
        ['actor', 'wallet']
      );
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

  private async initializeWithDependencyCheck<T>(
    initFn: () => Promise<T>,
    service: keyof ServiceDependencies,
    dependencies: Array<keyof ServiceDependencies> = []
  ): Promise<T> {
    // Check if dependencies are satisfied
    const missingDeps = dependencies.filter(dep => !this.dependencies[dep]);
    if (missingDeps.length > 0) {
      // Queue initialization for later
      return new Promise((resolve, reject) => {
        this.initializationQueue.push(async () => {
          try {
            const result = await initFn();
            this.dependencies[service] = true;
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // All dependencies satisfied, proceed with initialization
    const result = await initFn();
    this.dependencies[service] = true;
    return result;
  }

  private async initializeQuantumState(identity: Identity): Promise<void> {
    try {
      const actor = animaActorService.getActor();
      if (!actor) {
        throw new Error('Actor not initialized');
      }

      // Create initial stability checkpoint with minimal default values
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

      // Update quantum state with safe defaults
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
    await quantumErrorTracker.trackQuantumError({
      errorType: 'INITIALIZATION_ERROR',
      severity: 'CRITICAL',
      context: {
        operation: 'system_initialization',
        principal: identity.getPrincipal().toText(),
        status: this.status,
        dependencies: this.dependencies
      },
      error
    });

    // Reset status and dependencies
    this.reset();

    // Attempt recovery for specific services
    if (!this.status.actorInitialized) {
      console.log('🔄 Attempting actor service recovery...');
      animaActorService.resetActor();
    }
    if (!this.status.ledgerInitialized) {
      console.log('🔄 Attempting ledger service recovery...');
      await icpLedgerService.initialize();
    }
    if (!this.status.quantumInitialized && this.status.actorInitialized) {
      console.log('🔄 Attempting quantum state recovery...');
      await quantumStateService.initializeQuantumField(identity);
    }
  }

  getInitializationStatus(): InitializationStatus {
    return { ...this.status };
  }

  getDependencyStatus(): ServiceDependencies {
    return { ...this.dependencies };
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
    Object.keys(this.dependencies).forEach(key => {
      this.dependencies[key as keyof ServiceDependencies] = false;
    });
    this.initializationPromise = null;
    this.initializationQueue = [];
    this.isProcessingQueue = false;
  }
}

export const quantumInitService = QuantumInitService.getInstance();