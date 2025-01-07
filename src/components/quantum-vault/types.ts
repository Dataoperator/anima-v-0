export interface QuantumState {
  energy: number;
  coherence: number;
  toString(): string;
}

export interface WaveDataPoint {
  time: number;
  amplitude: number;
  phase: number;
}

export interface QuantumStateVisualizerProps {
  quantumState: QuantumState;
  entanglementLevel: number;
  evolutionStage: number;
}

export interface QuantumParticleProps {
  position: [number, number, number];
  color: string;
}