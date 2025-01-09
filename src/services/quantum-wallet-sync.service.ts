import { Principal } from '@dfinity/principal';
import { QuantumState } from '../types/quantum';
import { WalletState } from '../types/wallet';
import { ErrorTracker, ErrorSeverity } from '../error/quantum_error';
import { quantumStateService } from './quantum-state.service';
import { walletService } from './wallet.service';
import { EventEmitter } from '../utils/event-emitter';

interface SyncStatus {
  lastSync: number;
  quantumState: QuantumState;
  walletState: WalletState;
  coherenceLevel: number;
  stabilityIndex: number;
}

export class QuantumWalletSyncService extends EventEmitter {
  private static instance: QuantumWalletSyncService;
  private syncStatus: SyncStatus | null = null;
  private errorTracker: ErrorTracker;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 5000; // 5 seconds
  private readonly STABILITY_THRESHOLD = 0.7;
  private readonly COHERENCE_THRESHOLD = 0.5;

  private constructor() {
    super();
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): QuantumWalletSyncService {
    if (!this.instance) {
      this.instance = new QuantumWalletSyncService();
    }
    return this.instance;
  }

  async startSync(principal: Principal): Promise<void> {
    try {
      // Initial sync
      await this.performSync(principal);

      // Start periodic sync
      if (!this.syncInterval) {
        this.syncInterval = setInterval(
          () => this.performSync(principal),
          this.SYNC_INTERVAL
        );
      }
    } catch (error) {
      await this.handleSyncError(error as Error);
    }
  }

  async performSync(principal: Principal): Promise<void> {
    try {
      const [quantumState, walletState] = await Promise.all([
        quantumStateService.getQuantumStatus(),
        walletService.getState()
      ]);

      // Calculate stability metrics
      const stabilityIndex = this.calculateStabilityIndex(quantumState);
      const coherenceLevel = this.calculateCoherenceLevel(quantumState, walletState);

      this.syncStatus = {
        lastSync: Date.now(),
        quantumState,
        walletState,
        coherenceLevel,
        stabilityIndex
      };

      // Emit sync update
      this.emit('sync_update', this.syncStatus);

      // Check for quantum-wallet anomalies
      await this.checkAnomalies();

      // Update quantum state with wallet influence
      if (walletState.balance > 0) {
        await this.applyWalletInfluence(quantumState, walletState);
      }

    } catch (error) {
      await this.handleSyncError(error as Error);
    }
  }

  private async applyWalletInfluence(
    quantumState: QuantumState,
    walletState: WalletState
  ): Promise<void> {
    // Calculate wallet influence on quantum state
    const balanceInfluence = Math.min(walletState.balance / 100, 0.2);
    const animaBalanceInfluence = Math.min(walletState.animaBalance / 1000, 0.3);

    // Enhance quantum coherence based on wallet state
    const enhancedCoherence = Math.min(
      1.0,
      quantumState.coherence + (balanceInfluence * 0.1) + (animaBalanceInfluence * 0.15)
    );

    // Update quantum state with enhanced values
    await quantumStateService.updateQuantumState({
      ...quantumState,
      coherence: enhancedCoherence,
      field_strength: Math.min(1.0, quantumState.field_strength + balanceInfluence)
    });
  }

  private calculateStabilityIndex(quantumState: QuantumState): number {
    const baseStability = quantumState.coherence * 0.4;
    const fieldStability = (quantumState.field_strength || 0.5) * 0.3;
    const resonanceStability = (quantumState.resonance_pattern.reduce(
      (acc, val) => acc + val, 0) / quantumState.resonance_pattern.length) * 0.3;

    return Math.min(1.0, baseStability + fieldStability + resonanceStability);
  }

  private calculateCoherenceLevel(
    quantumState: QuantumState,
    walletState: WalletState
  ): number {
    const quantumCoherence = quantumState.coherence * 0.6;
    const walletInfluence = Math.min(
      walletState.balance / 100,
      0.2
    ) + Math.min(walletState.animaBalance / 1000, 0.2);

    return Math.min(1.0, quantumCoherence + walletInfluence);
  }

  private async checkAnomalies(): Promise<void> {
    if (!this.syncStatus) return;

    const {
      quantumState,
      walletState,
      coherenceLevel,
      stabilityIndex
    } = this.syncStatus;

    // Check for critical conditions
    if (coherenceLevel < this.COHERENCE_THRESHOLD) {
      await this.errorTracker.trackError({
        errorType: 'QUANTUM_COHERENCE_LOW',
        severity: ErrorSeverity.HIGH,
        context: {
          coherenceLevel,
          quantumState,
          walletState
        },
        error: new Error('Low quantum coherence detected')
      });

      this.emit('coherence_warning', {
        level: coherenceLevel,
        threshold: this.COHERENCE_THRESHOLD
      });
    }

    if (stabilityIndex < this.STABILITY_THRESHOLD) {
      await this.errorTracker.trackError({
        errorType: 'QUANTUM_STABILITY_LOW',
        severity: ErrorSeverity.MEDIUM,
        context: {
          stabilityIndex,
          quantumState,
          walletState
        },
        error: new Error('Low stability index detected')
      });

      this.emit('stability_warning', {
        level: stabilityIndex,
        threshold: this.STABILITY_THRESHOLD
      });
    }

    // Check for wallet-quantum desync
    const expectedBalance = walletState.balance * quantumState.coherence;
    const actualBalance = walletState.animaBalance;
    const balanceDiscrepancy = Math.abs(expectedBalance - actualBalance) / expectedBalance;

    if (balanceDiscrepancy > 0.1) { // 10% threshold
      await this.errorTracker.trackError({
        errorType: 'WALLET_QUANTUM_DESYNC',
        severity: ErrorSeverity.HIGH,
        context: {
          expectedBalance,
          actualBalance,
          discrepancy: balanceDiscrepancy
        },
        error: new Error('Wallet-Quantum state desynchronization detected')
      });

      this.emit('desync_warning', {
        discrepancy: balanceDiscrepancy,
        expected: expectedBalance,
        actual: actualBalance
      });
    }
  }

  private async handleSyncError(error: Error): Promise<void> {
    await this.errorTracker.trackError({
      errorType: 'SYNC_ERROR',
      severity: ErrorSeverity.HIGH,
      context: {
        lastSync: this.syncStatus?.lastSync,
        syncStatus: this.syncStatus
      },
      error
    });

    this.emit('sync_error', {
      error,
      timestamp: Date.now(),
      recoverable: true
    });
  }

  async stopSync(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  getSyncStatus(): SyncStatus | null {
    return this.syncStatus;
  }

  isSyncing(): boolean {
    return this.syncInterval !== null;
  }
}

export const quantumWalletSyncService = QuantumWalletSyncService.getInstance();