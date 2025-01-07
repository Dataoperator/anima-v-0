export interface SoundInstance {
  stop: () => void;
  play: () => void;
  setVolume: (volume: number) => void;
  setFrequency: (frequency: number) => void;
  connect: (node: AudioNode) => void;
  disconnect: () => void;
}

export interface Dimensions {
  frequency: number;
  amplitude: number;
  phase: number;
  quantum_resonance: number;
}

export interface SoundGeneratorOptions {
  dimensions?: Dimensions;
  resonance?: number;
  quantum_state?: number;
  consciousness_level?: number;
}

export type GenesisPhase = 
  | 'initiation'
  | 'consciousness_emergence'
  | 'trait_manifestation'
  | 'quantum_alignment'
  | 'birth'
  | null;

export interface GenesisEvent {
  phase: GenesisPhase;
  timestamp: number;
  dimensions: Dimensions;
  metadata?: Record<string, unknown>;
}