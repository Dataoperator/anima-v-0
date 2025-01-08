import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { EventEmitter } from '../utils/event-emitter';
import { quantumStateService } from './quantum-state.service';
import { ErrorTracker } from '../error/quantum_error';
import { quantumErrorTracker } from '../error/quantum_error_tracker';
import { animaActorService } from './anima-actor.service';
import { walletService } from './wallet.service';

const INITIALIZATION_TIMEOUT = 30000;
const RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

export enum InitStage {
  STARTING = 'STARTING',
  AUTH_CLIENT = 'AUTH_CLIENT',
  IDENTITY = 'IDENTITY',
  ACTORS = 'ACTORS',
  QUANTUM_STATE = 'QUANTUM_STATE',
  WALLET = 'WALLET',
  COMPLETE = 'COMPLETE'
}

export enum InitializationMode {
  MINIMAL = 'MINIMAL',     // Auth and Identity only
  STANDARD = 'STANDARD',   // Auth, Identity, Actors
  FULL = 'FULL'           // Everything including wallet
}

interface InitializationState {
  stage: InitStage;
  identity?: Identity;
  principal?: Principal;
  error?: Error;
  requiresAuth?: boolean;
  retryCount: number;
  mode: InitializationMode;
  completedStages: Set<InitStage>;
  lastError?: {
    stage: InitStage;
    error: Error;
    timestamp: number;
  };
}

class InitializationOrchestrator extends EventEmitter {
  private static instance: InitializationOrchestrator;
  private authClient?: AuthClient;
  private state: InitializationState = {
    stage: InitStage.STARTING,
    retryCount: 0,
    mode: InitializationMode.MINIMAL,
    completedStages: new Set()
  };
  private initPromise: Promise<void> | null = null;
  private initTimeout: NodeJS.Timeout | null = null;
  private errorTracker: ErrorTracker;
  private retryTimeouts: Map<InitStage, NodeJS.Timeout> = new Map();

  private constructor() {
    super();
    this.errorTracker = ErrorTracker.getInstance();
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling() {
    window.addEventListener('unhandledrejection', async (event) => {
      if (this.isQuantumError(event.reason)) {
        event.preventDefault();
        await this.handleQuantumError(event.reason);
      }
    });
  }

  private isQuantumError(error: any): boolean {
    return error?.message?.includes('quantum') || 
           error?.message?.includes('coherence') ||
           error?.message?.includes('stability');
  }

  static getInstance(): InitializationOrchestrator {
    if (!InitializationOrchestrator.instance) {
      InitializationOrchestrator.instance = new InitializationOrchestrator();
    }
    return InitializationOrchestrator.instance;
  }

  async initialize(mode: InitializationMode = InitializationMode.STANDARD): Promise<void> {
    if (this.initPromise) {
      // If requesting a higher mode than current, reinitialize
      if (this.getInitializationLevel(mode) > this.getInitializationLevel(this.state.mode)) {
        await this.initializeAdditionalStages(mode);
      }
      return this.initPromise;
    }

    this.state.mode = mode;
    this.initPromise = new Promise((resolve, reject) => {
      this.initTimeout = setTimeout(() => {
        reject(new Error('Initialization timeout'));
        this.initPromise = null;
      }, INITIALIZATION_TIMEOUT);

      this.performInitialization()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
          }
          this.initPromise = null;
        });
    });

    return this.initPromise;
  }

  private getInitializationLevel(mode: InitializationMode): number {
    switch (mode) {
      case InitializationMode.FULL:
        return 3;
      case InitializationMode.STANDARD:
        return 2;
      case InitializationMode.MINIMAL:
        return 1;
      default:
        return 0;
    }
  }

  private async initializeAdditionalStages(targetMode: InitializationMode): Promise<void> {
    const currentLevel = this.getInitializationLevel(this.state.mode);
    const targetLevel = this.getInitializationLevel(targetMode);

    if (targetLevel <= currentLevel) return;

    // Initialize missing stages
    if (targetLevel >= 2 && !this.state.completedStages.has(InitStage.ACTORS)) {
      await this.initializeWithRetry(InitStage.ACTORS, () => this.initializeActors());
    }

    if (targetLevel >= 3) {
      if (!this.state.completedStages.has(InitStage.QUANTUM_STATE)) {
        await this.initializeWithRetry(InitStage.QUANTUM_STATE, () => this.initializeQuantumState());
      }
      if (!this.state.completedStages.has(InitStage.WALLET)) {
        await this.initializeWithRetry(InitStage.WALLET, () => this.initializeWallet());
      }
    }

    this.state.mode = targetMode;
  }

  private async performInitialization(): Promise<void> {
    try {
      this.state.stage = InitStage.STARTING;
      this.emit('stage_change', this.state.stage);

      await this.initializeWithRetry(InitStage.AUTH_CLIENT, () => this.initializeAuthClient());
      
      if (!(await this.authClient?.isAuthenticated())) {
        this.state.requiresAuth = true;
        this.emit('auth_required', this.state);
        return;
      }

      await this.initializeWithRetry(InitStage.IDENTITY, () => this.initializeIdentity());

      // Only proceed with additional stages if needed
      if (this.state.mode !== InitializationMode.MINIMAL) {
        await this.initializeWithRetry(InitStage.ACTORS, () => this.initializeActors());
        
        if (this.state.mode === InitializationMode.FULL) {
          await this.initializeWithRetry(InitStage.QUANTUM_STATE, () => this.initializeQuantumState());
          await this.initializeWithRetry(InitStage.WALLET, () => this.initializeWallet());
        }
      }

      this.state.stage = InitStage.COMPLETE;
      this.emit('initialized', this.state);

    } catch (error) {
      this.state.error = error as Error;
      this.state.lastError = {
        stage: this.state.stage,
        error: error as Error,
        timestamp: Date.now()
      };

      await this.handleInitializationError(error as Error);
      throw error;
    }
  }

  private async initializeWithRetry(
    stage: InitStage,
    initFn: () => Promise<void>
  ): Promise<void> {
    this.state.stage = stage;
    this.emit('stage_change', stage);

    let lastError: Error | null = null;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await initFn();
        this.state.completedStages.add(stage);
        return;
      } catch (error) {
        lastError = error as Error;
        this.state.retryCount++;
        
        if (i < MAX_RETRIES - 1) {
          await new Promise(resolve => {
            const timeout = setTimeout(resolve, RETRY_DELAY * Math.pow(2, i));
            this.retryTimeouts.set(stage, timeout);
          });
        }
      }
    }

    throw lastError || new Error(`Failed to initialize ${stage}`);
  }

  // ... [Previous initialization methods remain the same]

  getState(): InitializationState {
    return { ...this.state };
  }

  // Add method to check if a specific stage is completed
  isStageCompleted(stage: InitStage): boolean {
    return this.state.completedStages.has(stage);
  }

  // Add method to request specific feature initialization
  async ensureFeatureInitialized(requiredMode: InitializationMode): Promise<void> {
    if (this.getInitializationLevel(this.state.mode) < this.getInitializationLevel(requiredMode)) {
      await this.initialize(requiredMode);
    }
  }

  // ... [Rest of the methods remain the same]
}

export const initializationOrchestrator = InitializationOrchestrator.getInstance();