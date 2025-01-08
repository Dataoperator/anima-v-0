import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { EventEmitter } from '../utils/event-emitter';
import { quantumStateService } from '../services/quantum-state.service';
import { icpLedgerService } from '../services/icp-ledger';
import { walletService } from '../services/wallet.service';
import { animaActorService } from '../services/anima-actor.service';
import { quantumErrorTracker } from '../error/quantum_error_tracker';
import { ErrorCategory } from '../types/error';

export enum InitializationStage {
  NotStarted = 'NOT_STARTED',
  ActorCreation = 'ACTOR_CREATION',
  LedgerConnection = 'LEDGER_CONNECTION',
  WalletSetup = 'WALLET_SETUP',
  QuantumInitialization = 'QUANTUM_INITIALIZATION',
  Complete = 'COMPLETE',
  Failed = 'FAILED'
}

interface InitializationState {
  stage: InitializationStage;
  error?: Error;
  retryCount: number;
  lastAttempt: number;
}

export class InitializationManager extends EventEmitter {
  private static instance: InitializationManager;
  private state: InitializationState = {
    stage: InitializationStage.NotStarted,
    retryCount: 0,
    lastAttempt: 0
  };
  
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    super();
  }

  static getInstance(): InitializationManager {
    if (!InitializationManager.instance) {
      InitializationManager.instance = new InitializationManager();
    }
    return InitializationManager.instance;
  }

  async initialize(identity: Identity): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization(identity);
    return this.initPromise;
  }

  private async performInitialization(identity: Identity): Promise<void> {
    try {
      await this.updateStage(InitializationStage.ActorCreation);
      const actor = await this.initializeActor(identity);

      await this.updateStage(InitializationStage.LedgerConnection);
      await this.initializeLedger();

      await this.updateStage(InitializationStage.WalletSetup);
      await this.initializeWallet(identity.getPrincipal());

      await this.updateStage(InitializationStage.QuantumInitialization);
      await this.initializeQuantumState(identity);

      await this.updateStage(InitializationStage.Complete);
      this.emit('initialized');

    } catch (error) {
      await this.handleInitializationError(error as Error);
      throw error;
    } finally {
      this.initPromise = null;
    }
  }

  private async initializeActor(identity: Identity): Promise<void> {
    try {
      console.log('🔧 Creating actor...');
      const actor = animaActorService.createActor(identity);
      
      // Verify actor functionality
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
    } catch (error) {
      throw new Error(`Actor initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async initializeLedger(): Promise<void> {
    try {
      console.log('💰 Initializing ICP ledger...');
      await icpLedgerService.initialize();
      
      // Verify ledger connection
      const fee = await icpLedgerService.getTransactionFee();
      if (fee <= BigInt(0)) {
        throw new Error('Invalid transaction fee');
      }
    } catch (error) {
      throw new Error(`Ledger initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async initializeWallet(principal: Principal): Promise<void> {
    try {
      console.log('👛 Initializing wallet...');
      await walletService.initialize(principal);
      
      // Verify wallet setup
      const state = walletService.getState();
      if (!state.depositAddress) {
        throw new Error('Deposit address not generated');
      }
    } catch (error) {
      throw new Error(`Wallet initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async initializeQuantumState(identity: Identity): Promise<void> {
    try {
      console.log('🌟 Initializing quantum state...');
      await quantumStateService.initializeQuantumField(identity);
      
      // Verify quantum state
      const status = await quantumStateService.getQuantumStatus(identity);
      if (status === 'critical') {
        throw new Error('Critical quantum state after initialization');
      }
    } catch (error) {
      throw new Error(`Quantum state initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async updateStage(stage: InitializationStage): Promise<void> {
    this.state.stage = stage;
    this.emit('stageUpdate', stage);
    console.log(`📍 Initialization stage: ${stage}`);
  }

  private async handleInitializationError(error: Error): Promise<void> {
    this.state.error = error;

    await quantumErrorTracker.trackQuantumError({
      errorType: 'INITIALIZATION_ERROR',
      severity: 'CRITICAL',
      context: {
        operation: 'system_initialization',
        stage: this.state.stage
      },
      error
    });

    // Check if we should retry
    if (this.state.retryCount < this.MAX_RETRIES) {
      this.state.retryCount++;
      this.state.lastAttempt = Date.now();
      
      console.log(`🔄 Retry attempt ${this.state.retryCount}/${this.MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
      
      // Retry from the current stage
      await this.performInitialization(
        (window as any).ic?.identity || null
      );
    } else {
      this.state.stage = InitializationStage.Failed;
      this.emit('failed', error);
      throw error;
    }
  }

  getCurrentStage(): InitializationStage {
    return this.state.stage;
  }

  getError(): Error | undefined {
    return this.state.error;
  }

  reset(): void {
    this.state = {
      stage: InitializationStage.NotStarted,
      retryCount: 0,
      lastAttempt: 0
    };
    this.initPromise = null;
    this.emit('reset');
  }
}

export const initializationManager = InitializationManager.getInstance();