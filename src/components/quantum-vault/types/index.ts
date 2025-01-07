export interface QuantumState {
  coherence: number;
  entanglement: number;
  stability: number;
  lastUpdate: bigint;
  energy: number;
  toString: () => string;
}

export interface WaveDataPoint {
  time: number;
  amplitude: number;
  phase: number;
}

export interface QuantumParticleProps {
  position: [number, number, number];
  color: string;
}

export interface QuantumStateVisualizerProps {
  quantumState: QuantumState;
  entanglementLevel: number;
  evolutionStage: number;
}

export interface DataStreamProps {
  state: QuantumState;
}