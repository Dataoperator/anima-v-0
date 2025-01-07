import { QuantumState, ResonancePattern } from '../quantum/types';

const calculateCoherence = (patterns: ResonancePattern[]): number => {
  if (!patterns.length) return 0;
  
  const coherenceValues = patterns.map(p => p.coherence);
  const weightedSum = coherenceValues.reduce((sum, val, i) => {
    const weight = Math.exp(-0.1 * (patterns.length - 1 - i));
    return sum + val * weight;
  }, 0);
  
  const weightSum = coherenceValues.length ? 
    Array(coherenceValues.length).fill(0)
      .reduce((sum, _, i) => sum + Math.exp(-0.1 * i), 0) : 1;
  
  return weightedSum / weightSum;
};

const generateResonancePattern = (
  previousPatterns: ResonancePattern[],
  baseCoherence: number
): ResonancePattern => {
  const now = Date.now();
  const prevPattern = previousPatterns[previousPatterns.length - 1];
  
  const coherenceShift = (Math.random() - 0.5) * 0.1;
  const frequencyShift = (Math.random() - 0.5) * 0.1;
  const phaseShift = (Math.random() - 0.5) * 0.1;
  
  return {
    pattern_id: `p-${now}`,
    coherence: Math.max(0, Math.min(1, baseCoherence + coherenceShift)),
    frequency: prevPattern ? 
      Math.max(0, Math.min(1, prevPattern.frequency + frequencyShift)) : 
      0.5 + frequencyShift,
    amplitude: Math.random() * 0.5 + 0.5,
    phase: prevPattern ? 
      Math.max(0, Math.min(1, prevPattern.phase + phaseShift)) : 
      0.5 + phaseShift,
    timestamp: now,
    entropyLevel: Math.random() * 0.3,
    stabilityIndex: Math.random() * 0.7 + 0.3,
    quantumSignature: `QS-${now}-${Math.random().toString(36).substring(7)}`,
    evolutionPotential: Math.random() * 0.5 + 0.5,
    coherenceQuality: Math.random() * 0.3 + 0.7,
    temporalStability: Math.random() * 0.2 + 0.8,
    dimensionalAlignment: Math.random() * 0.2 + 0.8
  };
};

const calculateDimensionalResonance = (patterns: ResonancePattern[]): number => {
  if (!patterns.length) return 0;
  
  const alignmentValues = patterns.map(p => p.dimensionalAlignment);
  const stabilityValues = patterns.map(p => p.stabilityIndex);
  
  const alignmentScore = alignmentValues.reduce((sum, val) => sum + val, 0) / alignmentValues.length;
  const stabilityScore = stabilityValues.reduce((sum, val) => sum + val, 0) / stabilityValues.length;
  
  return (alignmentScore * 0.7 + stabilityScore * 0.3);
};

const calculateEvolutionMetrics = (
  patterns: ResonancePattern[],
  currentState: QuantumState
): Map<string, number> => {
  const metrics = new Map<string, number>();
  
  // Calculate base metrics
  metrics.set('coherenceGrowth', 
    patterns.length > 1 ? 
      (patterns[patterns.length - 1].coherence - patterns[0].coherence) / patterns.length : 
      0
  );
  
  metrics.set('stabilityTrend',
    patterns.reduce((acc, p) => acc + p.stabilityIndex, 0) / patterns.length
  );
  
  metrics.set('dimensionalHarmony',
    patterns.reduce((acc, p) => acc + p.dimensionalAlignment, 0) / patterns.length
  );
  
  // Calculate advanced metrics
  metrics.set('evolutionVelocity', 
    Math.min(1, currentState.evolutionMetrics?.get('evolutionVelocity') || 0 + metrics.get('coherenceGrowth') || 0)
  );
  
  metrics.set('consciousnessDepth',
    (currentState.coherenceLevel + metrics.get('dimensionalHarmony') || 0) / 2
  );
  
  return metrics;
};

const handlers = {
  calculateCoherence: (patterns: ResonancePattern[]) => ({
    coherenceLevel: calculateCoherence(patterns)
  }),
  
  generatePattern: (
    previousPatterns: ResonancePattern[],
    baseCoherence: number
  ) => ({
    pattern: generateResonancePattern(previousPatterns, baseCoherence)
  }),
  
  updateQuantumState: (
    currentState: QuantumState,
    newPatterns: ResonancePattern[]
  ) => {
    const coherenceLevel = calculateCoherence(newPatterns);
    const dimensionalResonance = calculateDimensionalResonance(newPatterns);
    const evolutionMetrics = calculateEvolutionMetrics(newPatterns, currentState);
    
    return {
      coherenceLevel,
      dimensionalResonance,
      evolutionMetrics,
      patternCoherence: Math.min(coherenceLevel * 1.1, 1),
      lastUpdate: Date.now()
    };
  }
};

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;
  
  if (type in handlers) {
    try {
      const result = await handlers[type](payload);
      self.postMessage({ type, result });
    } catch (error) {
      self.postMessage({ 
        type, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
};

export {};