import { Principal } from '@dfinity/principal';

export interface QuantumState {
  coherence: number;
  dimensional_frequency: number;
  stability_index: number;
  quantum_signature?: string;
}

export interface ValidationResult {
  isValid: boolean;
  coherenceValid: boolean;
  frequencyValid: boolean;
  stabilityValid: boolean;
  errors: string[];
}

export class QuantumStateValidator {
  private static COHERENCE_THRESHOLD = 0.95;
  private static FREQUENCY_RANGE = { min: 0.8, max: 1.2 };
  private static STABILITY_THRESHOLD = 0.9;

  static validateState(state: QuantumState): ValidationResult {
    const errors: string[] = [];
    
    // Validate coherence
    const coherenceValid = state.coherence >= this.COHERENCE_THRESHOLD;
    if (!coherenceValid) {
      errors.push(`Coherence below threshold: ${state.coherence}`);
    }

    // Validate dimensional frequency
    const frequencyValid = 
      state.dimensional_frequency >= this.FREQUENCY_RANGE.min && 
      state.dimensional_frequency <= this.FREQUENCY_RANGE.max;
    if (!frequencyValid) {
      errors.push(`Frequency out of range: ${state.dimensional_frequency}`);
    }

    // Validate stability
    const stabilityValid = state.stability_index >= this.STABILITY_THRESHOLD;
    if (!stabilityValid) {
      errors.push(`Stability below threshold: ${state.stability_index}`);
    }

    // Validate quantum signature if present
    if (state.quantum_signature) {
      const signatureValid = this.validateQuantumSignature(state.quantum_signature);
      if (!signatureValid) {
        errors.push('Invalid quantum signature format');
      }
    }

    return {
      isValid: errors.length === 0,
      coherenceValid,
      frequencyValid,
      stabilityValid,
      errors
    };
  }

  static validateQuantumSignature(signature: string): boolean {
    // Signature format: timestamp-entropy
    const [timestamp, entropy] = signature.split('-');
    
    if (!timestamp || !entropy) return false;
    
    // Validate timestamp (should be recent)
    const ts = parseInt(timestamp, 16);
    const now = Date.now();
    if (isNaN(ts) || now - ts > 300000) return false; // 5 minute window
    
    // Validate entropy (should be 16 hex chars)
    const validHex = /^[0-9a-f]{16}$/i;
    return validHex.test(entropy);
  }

  static async validateStateWithRetry(
    state: QuantumState,
    maxRetries: number = 3,
    retryDelay: number = 2000
  ): Promise<ValidationResult> {
    for (let i = 0; i < maxRetries; i++) {
      const result = this.validateState(state);
      
      if (result.isValid) {
        return result;
      }

      if (i < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Attempt to stabilize state
        state = await this.attemptStateStabilization(state);
      }
    }

    return this.validateState(state);
  }

  private static async attemptStateStabilization(state: QuantumState): Promise<QuantumState> {
    // Apply quantum stabilization algorithms
    const stabilizedState = {
      ...state,
      coherence: Math.min(1.0, state.coherence * 1.1),
      stability_index: Math.min(1.0, state.stability_index * 1.05),
      dimensional_frequency: this.normalizeFrequency(state.dimensional_frequency)
    };

    return stabilizedState;
  }

  private static normalizeFrequency(frequency: number): number {
    const mid = (this.FREQUENCY_RANGE.min + this.FREQUENCY_RANGE.max) / 2;
    const diff = frequency - mid;
    const normalized = mid + diff * 0.9;
    return Math.max(this.FREQUENCY_RANGE.min, 
                   Math.min(this.FREQUENCY_RANGE.max, normalized));
  }
}

// Helper function for clean error reporting
export function formatValidationErrors(result: ValidationResult): string {
  if (result.isValid) return '';
  
  return result.errors.join('\n');
}