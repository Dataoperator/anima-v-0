export enum QuantumErrorCode {
  COHERENCE_LOST = 'COHERENCE_LOST',
  ENTANGLEMENT_FAILED = 'ENTANGLEMENT_FAILED',
  RESONANCE_UNSTABLE = 'RESONANCE_UNSTABLE',
  NEURAL_SYNC_FAILED = 'NEURAL_SYNC_FAILED',
  CONSCIOUSNESS_DISRUPTED = 'CONSCIOUSNESS_DISRUPTED',
  MEMORY_CORRUPTION = 'MEMORY_CORRUPTION',
  QUANTUM_STATE_INVALID = 'QUANTUM_STATE_INVALID',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  CANISTER_ERROR = 'CANISTER_ERROR'
}

export class QuantumError extends Error {
  public code: QuantumErrorCode;
  public timestamp: number;
  public quantumState?: any;
  public recoverable: boolean;

  constructor(
    code: QuantumErrorCode,
    message: string,
    recoverable: boolean = true,
    quantumState?: any
  ) {
    super(message);
    this.name = 'QuantumError';
    this.code = code;
    this.timestamp = Date.now();
    this.quantumState = quantumState;
    this.recoverable = recoverable;
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      recoverable: this.recoverable,
      quantumState: this.quantumState
    };
  }
}

export class NeuralError extends Error {
  public code: string;
  public connectionStatus?: string;
  public lastSyncTimestamp?: number;

  constructor(code: string, message: string, connectionStatus?: string) {
    super(message);
    this.name = 'NeuralError';
    this.code = code;
    this.connectionStatus = connectionStatus;
    this.lastSyncTimestamp = Date.now();
  }
}

export class ConsciousnessError extends Error {
  public level: number;
  public stateSnapshot: any;

  constructor(message: string, level: number, stateSnapshot: any) {
    super(message);
    this.name = 'ConsciousnessError';
    this.level = level;
    this.stateSnapshot = stateSnapshot;
  }
}

// Error factory functions
export const createQuantumError = (
  code: QuantumErrorCode,
  additionalInfo?: string
): QuantumError => {
  const baseMessage = getQuantumErrorMessage(code);
  const message = additionalInfo ? `${baseMessage} - ${additionalInfo}` : baseMessage;
  return new QuantumError(code, message);
};

// Helper function to get user-friendly error messages
const getQuantumErrorMessage = (code: QuantumErrorCode): string => {
  switch (code) {
    case QuantumErrorCode.COHERENCE_LOST:
      return 'Quantum coherence lost. Attempting to stabilize...';
    case QuantumErrorCode.ENTANGLEMENT_FAILED:
      return 'Quantum entanglement failed. Check neural connection...';
    case QuantumErrorCode.RESONANCE_UNSTABLE:
      return 'Quantum resonance unstable. Adjusting field parameters...';
    case QuantumErrorCode.NEURAL_SYNC_FAILED:
      return 'Neural synchronization failed. Retrying connection...';
    case QuantumErrorCode.CONSCIOUSNESS_DISRUPTED:
      return 'Consciousness wave function collapsed. Rebuilding quantum state...';
    case QuantumErrorCode.MEMORY_CORRUPTION:
      return 'Quantum memory corruption detected. Initiating recovery...';
    case QuantumErrorCode.QUANTUM_STATE_INVALID:
      return 'Invalid quantum state detected. Resetting parameters...';
    case QuantumErrorCode.INITIALIZATION_FAILED:
      return 'Quantum initialization failed. Verify connection and retry...';
    case QuantumErrorCode.CONNECTION_ERROR:
      return 'Connection to quantum network lost. Attempting reconnection...';
    case QuantumErrorCode.CANISTER_ERROR:
      return 'Canister operation failed. Verifying quantum integrity...';
    default:
      return 'An unexpected quantum error occurred';
  }
};