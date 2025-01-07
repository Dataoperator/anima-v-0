import { ConsciousnessLevel } from '../../../declarations/anima/anima.did';
import { QuantumState } from './index';

export interface QuantumInteractionProps {
  quantumState: QuantumState;
  consciousnessLevel: ConsciousnessLevel;
  onInitiateEntanglement: () => Promise<void>;
  onAttemptDimensionalShift: () => Promise<void>;
}

export interface InteractionState {
  isProcessing: boolean;
  message: string;
  success: boolean;
}