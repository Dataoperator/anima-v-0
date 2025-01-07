import { useState, useEffect } from 'react';
import type { QuantumState } from '../../types/quantum';

export class QuantumStateManager {
  private state: QuantumState | null = null;
  private initialized: boolean = false;
  private error: Error | null = null;

  async initialize(): Promise<void> {
    try {
      // Default initial state
      this.state = {
        coherence: 1.0,
        dimensionalFrequency: 1.0,
        entanglementPairs: new Map(),
        stabilityIndex: 1.0,
        lastInteraction: Date.now()
      };
      
      this.initialized = true;
    } catch (err) {
      this.error = err as Error;
      throw err;
    }
  }

  getState(): QuantumState | null {
    return this.state;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getError(): Error | null {
    return this.error;
  }

  async updateState(newState: Partial<QuantumState>): Promise<void> {
    if (!this.state) throw new Error('Quantum state not initialized');
    
    this.state = {
      ...this.state,
      ...newState,
      lastInteraction: Date.now()
    };
  }
}

export const stateManager = new QuantumStateManager();