export interface MediaPattern {
  type: 'visual' | 'audio' | 'semantic';
  signature: string;
  confidence: number;
  markers: string[];
  timestamp: number;
  quantumSignature: number[];
}

export interface MediaAnalysisState {
  currentPatterns: MediaPattern[];
  temporalContext: string[];
  understanding: {
    concepts: string[];
    emotions: string[];
    context: string[];
  };
  quantumResonance: number;
  patternEvolution: {
    stage: number;
    confidence: number;
    lastUpdate: number;
  };
}

export interface QuantumContext {
  resonance: number;
  coherence: number;
  timestamp: number;
}

export interface MediaInteraction {
  type: 'video' | 'audio';
  pattern: MediaPattern;
  timestamp: number;
  quantumContext: QuantumContext;
}

export type PatternCache = Map<string, MediaPattern>;

export interface PatternEvolution {
  stage: number;
  confidence: number;
  lastUpdate: number;
}