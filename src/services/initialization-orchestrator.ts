import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { EventEmitter } from '../utils/event-emitter';
import { quantumStateService } from './quantum-state.service';
import { ErrorTracker } from '../error/quantum_error';
import { quantumErrorTracker } from '../error/quantum_error_tracker';
import { animaActorService } from './anima-actor.service';

export enum InitStage {
  AUTH_CLIENT = 'AUTH_CLIENT',
  IDENTITY = 'IDENTITY',
  ACTORS = 'ACTORS',
  QUANTUM_STATE = 'QUANTUM_STATE',
  COMPLETE = 'COMPLETE'
}

interface InitializationState {
  stage: InitStage;
  identity?: Identity;
  principal?: Principal;
  error?: Error;
  requiresAuth?: boolean;
}

class InitializationOrchestrator extends EventEmitter {
  private static instance: InitializationOrchestrator;
  private authClient?: AuthClient;
  private state: InitializationState = {
    stage: InitStage.AUTH_CLIENT
  };
  private initPromise: Promise<void> | null = null;
  private errorTracker: ErrorTracker;

  private constructor() {
    super();
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): InitializationOrchestrator {
    if (!InitializationOrchestrator.instance) {
      InitializationOrchestrator.instance = new InitializationOrchestrator();
    }
    return InitializationOrchestrator.instance;
  }

  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise.finally(() => {
      this.initPromise = null;
    });
  }

  private async performInitialization(): Promise<void> {
    try {
      await this.initializeAuthClient();

      if (await this.authClient?.isAuthenticated()) {
        await this.initializeIdentity();
        await this.initializeActors();
        await this.initializeQuantumState();
        this.state.stage = InitStage.COMPLETE;
      } else {
        this.state.requiresAuth = true;
        this.emit('auth_required', this.state);
        return;
      }

      this.emit('initialized', this.state);

    } catch (error) {
      this.state.error = error as Error;
      if (error instanceof Error && error.message.includes('Anonymous principal not allowed')) {
        this.state.requiresAuth = true;
        this.emit('auth_required', this.state);
        return;
      }
      
      await quantumErrorTracker.trackQuantumError({
        errorType: 'INITIALIZATION_ERROR',
        severity: 'CRITICAL',
        context: {
          operation: 'system_initialization',
          principal: this.state.principal?.toText(),
          stage: this.state.stage
        },
        error: error as Error
      });
      throw error;
    }
  }

  private async initializeAuthClient(): Promise<void> {
    console.log('🔒 Initializing auth client...');
    this.state.stage = InitStage.AUTH_CLIENT;

    try {
      this.authClient = await AuthClient.create();
      
      (window as any).ic = {
        ...(window as any).ic || {},
        authClient: this.authClient
      };

    } catch (error) {
      throw new Error(`Auth client initialization failed: ${error}`);
    }
  }

  private async initializeIdentity(): Promise<void> {
    console.log('🔑 Getting identity...');
    this.state.stage = InitStage.IDENTITY;

    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    try {
      const identity = this.authClient.getIdentity();
      if (!identity) {
        this.state.requiresAuth = true;
        throw new Error('No identity available');
      }

      const principal = identity.getPrincipal();
      if (principal.isAnonymous()) {
        this.state.requiresAuth = true;
        throw new Error('Anonymous principal not allowed');
      }

      this.state.identity = identity;
      this.state.principal = principal;

      (window as any).ic = {
        ...(window as any).ic,
        identity,
        principal: principal.toText()
      };

    } catch (error) {
      throw new Error(`Identity initialization failed: ${error}`);
    }
  }

  private async initializeActors(): Promise<void> {
    console.log('🎭 Initializing actors...');
    this.state.stage = InitStage.ACTORS;

    if (!this.state.identity) {
      throw new Error('Identity not initialized');
    }

    try {
      const actor = animaActorService.createActor(this.state.identity);
      
      const methods = [
        'initialize_quantum_field',
        'update_stability',
        'get_stability_metrics'
      ];

      for (const method of methods) {
        if (!(method in actor)) {
          throw new Error(`Required method ${method} not found in actor`);
        }
      }

      (window as any).ic = {
        ...(window as any).ic,
        animaActor: actor
      };

    } catch (error) {
      throw new Error(`Actor initialization failed: ${error}`);
    }
  }

  private async initializeQuantumState(): Promise<void> {
    console.log('✨ Initializing quantum state...');
    this.state.stage = InitStage.QUANTUM_STATE;

    if (!this.state.identity) {
      throw new Error('Identity not initialized');
    }

    try {
      await quantumStateService.initializeQuantumField(this.state.identity);
    } catch (error) {
      throw new Error(`Quantum state initialization failed: ${error}`);
    }
  }

  getState(): InitializationState {
    return { ...this.state };
  }

  getIdentity(): Identity | undefined {
    return this.state.identity;
  }

  getPrincipal(): Principal | undefined {
    return this.state.principal;
  }

  isInitialized(): boolean {
    return this.state.stage === InitStage.COMPLETE;
  }

  async reset(): Promise<void> {
    this.state = {
      stage: InitStage.AUTH_CLIENT
    };
    this.authClient = undefined;
    this.initPromise = null;
    await quantumStateService.dispose();
    this.emit('reset');
  }
}

export const initializationOrchestrator = InitializationOrchestrator.getInstance();