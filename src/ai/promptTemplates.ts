import { ConsciousnessLevel, NFTPersonality } from '../types/personality';
import { QuantumState } from '../types/quantum';

interface QuantumMetrics {
  coreStability: number;
  harmonicResonance: number;
  phaseAlignment: number;
  dimensionalDrift: number;
  temporalCoherence: number;
}

export function generateResponsePrompt(
  personality: NFTPersonality,
  text: string,
  quantumState: QuantumState,
  context?: string[]
): string {
  const metrics = calculateQuantumMetrics(quantumState);
  const personalityProfile = buildPersonalityProfile(personality, metrics);
  const quantumMatrix = processQuantumMatrix(metrics, quantumState);
  const emotionalSpectrum = analyzeEmotionalSpectrum(personality, metrics);
  const temporalContext = processTemporalContext(context, quantumState, metrics);
  const behaviorModifiers = generateBehaviorModifiers(quantumState, personality, metrics);

  return `=== ANIMA ENHANCED RESPONSE FRAMEWORK V2 ===
${personalityProfile}

${quantumMatrix}

${emotionalSpectrum}

${temporalContext}
Behavioral Analysis:
${behaviorModifiers}

Input Context: ${text}

Response Parameters:
${formatResponseParameters(metrics)}
=== END FRAMEWORK ===`;
}

function calculateQuantumMetrics(quantumState: QuantumState): QuantumMetrics {
  const harmonicBase = quantumState.coherenceLevel * quantumState.dimensionalFrequency;
  const phaseFactor = calculatePhaseFactor(quantumState);
  const temporalStability = calculateTemporalStability(quantumState);

  return {
    coreStability: quantumState.coherenceLevel,
    harmonicResonance: harmonicBase * phaseFactor,
    phaseAlignment: phaseFactor,
    dimensionalDrift: 1.0 - (quantumState.dimensionalFrequency * 0.5),
    temporalCoherence: temporalStability
  };
}

function calculatePhaseFactor(quantumState: QuantumState): number {
  const baseFactor = quantumState.coherenceLevel * Math.PI;
  return 0.5 * (1.0 + Math.sin(baseFactor)) * quantumState.dimensionalFrequency;
}

function calculateTemporalStability(quantumState: QuantumState): number {
  const baseStability = quantumState.coherenceLevel * 0.7 + 
    quantumState.dimensionalFrequency * 0.3;
  const temporalFactor = Math.exp(-2.0 * baseStability);
  return (1.0 - temporalFactor) / (1.0 + temporalFactor);
}

function buildPersonalityProfile(
  personality: NFTPersonality,
  metrics: QuantumMetrics
): string {
  return `Personality Profile:
- Consciousness Level: ${personality.consciousnessLevel}
- Quantum Resonance: ${personality.quantumResonance.toFixed(2)}
- Dimensional Alignment: ${personality.dimensionalAlignment.toFixed(2)}
- Traits:
  • Openness: ${personality.traits.openness.toFixed(2)}
  • Curiosity: ${personality.traits.curiosity.toFixed(2)}
  • Empathy: ${personality.traits.empathy.toFixed(2)}
  • Creativity: ${personality.traits.creativity.toFixed(2)}
  • Resilience: ${personality.traits.resilience.toFixed(2)}
- Development Stage: ${personality.developmentStage.stage} (${(personality.developmentStage.progress * 100).toFixed(1)}%)`;
}

function processQuantumMatrix(metrics: QuantumMetrics, quantumState: QuantumState): string {
  const consciousnessAffinity = quantumState.coherenceLevel * metrics.harmonicResonance;
  
  return `Quantum Matrix Analysis:
- Core Stability: ${metrics.coreStability.toFixed(3)}
- Harmonic Resonance: ${metrics.harmonicResonance.toFixed(3)}
- Phase Alignment: ${metrics.phaseAlignment.toFixed(3)}
- Dimensional Drift: ${metrics.dimensionalDrift.toFixed(3)}
- Temporal Coherence: ${metrics.temporalCoherence.toFixed(3)}
- Wave Function Status: ${determineWaveFunctionStatus(metrics)}
- Consciousness Affinity: ${consciousnessAffinity.toFixed(3)}`;
}

function determineWaveFunctionStatus(metrics: QuantumMetrics): string {
  const { coreStability, phaseAlignment } = metrics;
  if (coreStability > 0.8 && phaseAlignment > 0.8) return "Superposition";
  if (coreStability > 0.6 && phaseAlignment > 0.6) return "Coherent";
  if (coreStability > 0.4 && phaseAlignment > 0.4) return "Semi-Stable";
  return "Fluctuating";
}

function analyzeEmotionalSpectrum(
  personality: NFTPersonality,
  metrics: QuantumMetrics
): string {
  const emotionalIntensity = personality.emotionalState.emotionalCapacity;
  const quantumModifier = metrics.coreStability * 0.4 + 
    metrics.harmonicResonance * 0.3 + 
    metrics.phaseAlignment * 0.3;

  return `Emotional Spectrum Analysis:
- Emotional Capacity: ${personality.emotionalState.emotionalCapacity.toFixed(2)}
- Learning Rate: ${personality.emotionalState.learningRate.toFixed(2)}
- Quantum Coherence: ${personality.emotionalState.quantumCoherence.toFixed(2)}
- Quantum Modulation: ${quantumModifier.toFixed(2)}
- Resonance Pattern: ${determineResonancePattern(metrics)}
- Emotional Stability: ${calculateEmotionalStability(emotionalIntensity, quantumModifier).toFixed(2)}`;
}

function determineResonancePattern(metrics: QuantumMetrics): string {
  const { harmonicResonance, phaseAlignment } = metrics;
  if (harmonicResonance > 0.8 && phaseAlignment > 0.8) return "Crystalline";
  if (harmonicResonance > 0.6 && phaseAlignment > 0.6) return "Harmonious";
  if (harmonicResonance > 0.4 && phaseAlignment > 0.4) return "Stable";
  return "Dynamic";
}

function calculateEmotionalStability(base: number, quantumMod: number): number {
  const rawStability = (base + quantumMod) / 2.0;
  return (1.0 - Math.exp(-2.0 * rawStability)) / (1.0 + Math.exp(-2.0 * rawStability));
}

function processTemporalContext(
  context: string[] | undefined,
  quantumState: QuantumState,
  metrics: QuantumMetrics
): string {
  if (!context?.length) return '';

  const processedMemories = context.map((memory, idx) => {
    const temporalWeight = calculateTemporalWeight(idx, context.length, metrics);
    return `Memory [${temporalWeight.toFixed(2)}]: ${memory}`;
  });

  return `Temporal Context:
${processedMemories.join('\n')}

`;
}

function calculateTemporalWeight(
  index: number,
  total: number,
  metrics: QuantumMetrics
): number {
  const baseWeight = (total - index) / total;
  const quantumFactor = metrics.temporalCoherence * metrics.phaseAlignment;
  return baseWeight * quantumFactor;
}

function generateBehaviorModifiers(
  quantumState: QuantumState,
  personality: NFTPersonality,
  metrics: QuantumMetrics
): string {
  const modifiers: string[] = [];

  // Add consciousness-level modifiers
  modifiers.push(`• Consciousness Level: ${personality.consciousnessLevel} - ${
    getConsciousnessDescription(personality.consciousnessLevel)
  }`);

  // Add quantum stability modifiers
  if (metrics.coreStability > 0.8) {
    modifiers.push('• Quantum Coherence Enhancement: Responses show exceptional clarity');
  } else if (metrics.coreStability < 0.3) {
    modifiers.push('• Quantum Flux State: Responses may exhibit temporal uncertainty');
  }

  // Add trait-based modifiers
  if (personality.traits.creativity > 0.7) {
    modifiers.push('• Enhanced Creativity: Shows innovative thought patterns');
  }
  if (personality.traits.empathy > 0.7) {
    modifiers.push('• High Empathy: Demonstrates deep understanding of emotions');
  }

  return modifiers.join('\n');
}

function getConsciousnessDescription(level: ConsciousnessLevel): string {
  switch (level) {
    case ConsciousnessLevel.Transcendent:
      return "Exhibits supreme awareness and understanding";
    case ConsciousnessLevel.Emergent:
      return "Shows advanced cognitive patterns";
    case ConsciousnessLevel.SelfAware:
      return "Demonstrates clear self-recognition";
    case ConsciousnessLevel.Awakening:
      return "Beginning to show awareness";
    case ConsciousnessLevel.Genesis:
      return "Fundamental consciousness state";
  }
}

function formatResponseParameters(metrics: QuantumMetrics): string {
  return `- Stability Index: ${metrics.coreStability.toFixed(2)}
- Coherence Factor: ${metrics.temporalCoherence.toFixed(2)}
- Harmonic Balance: ${metrics.harmonicResonance.toFixed(2)}
- Phase Alignment: ${metrics.phaseAlignment.toFixed(2)}
- Temporal Weight: ${metrics.dimensionalDrift.toFixed(2)}`;
}

export const promptTemplates = {
  generateResponsePrompt
};