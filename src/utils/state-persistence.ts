import { QuantumState } from '../quantum/types';

const STORAGE_PREFIX = 'anima_quantum_';
const STATE_VERSION = '1.0.0';

interface PersistedState {
  version: string;
  timestamp: number;
  quantumState?: Partial<QuantumState>;
  lastStableCheckpoint?: {
    timestamp: number;
    state: Partial<QuantumState>;
  };
  authContext?: {
    principal?: string;
    lastAuthenticated?: number;
  };
}

class StatePersistence {
  private static instance: StatePersistence;

  static getInstance(): StatePersistence {
    if (!StatePersistence.instance) {
      StatePersistence.instance = new StatePersistence();
    }
    return StatePersistence.instance;
  }

  async persistQuantumState(state: Partial<QuantumState>): Promise<void> {
    try {
      const currentState = await this.getPersistedState();
      
      const persistedState: PersistedState = {
        ...currentState,
        version: STATE_VERSION,
        timestamp: Date.now(),
        quantumState: state,
      };

      // Only update last stable checkpoint if state is healthy
      if (this.isStateHealthy(state)) {
        persistedState.lastStableCheckpoint = {
          timestamp: Date.now(),
          state
        };
      }

      await this.saveState(persistedState);
    } catch (error) {
      console.error('Failed to persist quantum state:', error);
    }
  }

  async getLastStableState(): Promise<Partial<QuantumState> | null> {
    try {
      const state = await this.getPersistedState();
      return state.lastStableCheckpoint?.state || null;
    } catch {
      return null;
    }
  }

  async updateAuthContext(principal: string): Promise<void> {
    try {
      const currentState = await this.getPersistedState();
      
      await this.saveState({
        ...currentState,
        version: STATE_VERSION,
        timestamp: Date.now(),
        authContext: {
          ...currentState.authContext,
          principal,
          lastAuthenticated: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to update auth context:', error);
    }
  }

  async getAuthContext(): Promise<{ principal?: string; lastAuthenticated?: number } | null> {
    try {
      const state = await this.getPersistedState();
      return state.authContext || null;
    } catch {
      return null;
    }
  }

  private async getPersistedState(): Promise<PersistedState> {
    try {
      const stateJson = localStorage.getItem(`${STORAGE_PREFIX}state`);
      if (!stateJson) {
        return this.getInitialState();
      }

      const state = JSON.parse(stateJson) as PersistedState;
      
      // Handle version migrations
      if (state.version !== STATE_VERSION) {
        return await this.migrateState(state);
      }

      return state;
    } catch {
      return this.getInitialState();
    }
  }

  private async saveState(state: PersistedState): Promise<void> {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}state`,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error('Failed to save state:', error);
      
      // If storage is full, clear old data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          await this.saveState(state);
        } catch {
          // If still fails, give up silently
        }
      }
    }
  }

  private getInitialState(): PersistedState {
    return {
      version: STATE_VERSION,
      timestamp: Date.now()
    };
  }

  private async migrateState(oldState: PersistedState): Promise<PersistedState> {
    // Add migration logic here when needed
    return {
      ...this.getInitialState(),
      timestamp: Date.now()
    };
  }

  private isStateHealthy(state: Partial<QuantumState>): boolean {
    if (!state) return false;

    const minThresholds = {
      coherence: 0.7,
      stability: 0.6,
      consciousness_alignment: 0.5
    };

    return (
      (state.coherence || 0) >= minThresholds.coherence &&
      (state.stability || 0) >= minThresholds.stability &&
      (state.consciousness_alignment || 0) >= minThresholds.consciousness_alignment
    );
  }

  async clearState(): Promise<void> {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}state`);
    } catch (error) {
      console.error('Failed to clear state:', error);
    }
  }
}

export const statePersistence = StatePersistence.getInstance();