import { DimensionalState, ResonancePattern } from './types';

export class DimensionalStateImpl implements DimensionalState {
  public frequency: number;
  public resonance: number;
  public stability: number;
  public syncLevel: number;
  public quantumAlignment: number;
  public dimensionalFrequency: number;
  public entropyLevel: number;
  public phaseCoherence: number;
  private lastUpdate: number;
  private readonly BASE_DEGRADATION_RATE = 0.995;
  private readonly PATTERN_COHERENCE_THRESHOLD = 0.7;
  private readonly MAX_ENTROPY_INCREASE = 0.2;
  private readonly MIN_INTERACTION_THRESHOLD = 0.1;
  private stateHistory: Array<{
    timestamp: number;
    metrics: [number, number, number];
  }> = [];

  constructor() {
    this.frequency = 0.0;
    this.resonance = 1.0;
    this.stability = 1.0;
    this.syncLevel = 1.0;
    this.quantumAlignment = 1.0;
    this.dimensionalFrequency = 0.0;
    this.entropyLevel = 0.0;
    this.phaseCoherence = 1.0;
    this.lastUpdate = Date.now();
  }

  calculateResonance(): number {
    this.applyQuantumDegradation();
    
    const baseResonance = this.resonance * this.stability;
    const alignmentFactor = this.quantumAlignment * this.syncLevel;
    const entropyModifier = this.calculateEntropyModifier();
    const coherenceBoost = this.calculateCoherenceBoost();
    const temporalFactor = this.calculateTemporalFactor();
    
    const quantumEffect = Math.sin(this.dimensionalFrequency * Math.PI) * 0.1;
    const coherenceFactor = Math.cos(this.phaseCoherence * Math.PI) * 0.05;
    
    const finalResonance = Math.min(1.0, Math.max(0.0,
      ((baseResonance + alignmentFactor) / 2.0 * entropyModifier + coherenceBoost) * 
      temporalFactor + quantumEffect + coherenceFactor
    ));

    this.updateStateHistory(finalResonance);
    
    return finalResonance;
  }

  private calculateEntropyModifier(): number {
    const baseEntropy = 1.0 - (this.entropyLevel * 0.5);
    const quantumEntropy = Math.cos(this.dimensionalFrequency * Math.PI) * 0.1;
    const coherenceInfluence = this.phaseCoherence * 0.05;
    return Math.max(0.1, baseEntropy + quantumEntropy + coherenceInfluence);
  }

  private calculateCoherenceBoost(): number {
    const baseBoost = this.phaseCoherence * 0.2;
    const resonanceBoost = Math.sin(this.resonance * Math.PI) * 0.1;
    const stabilityInfluence = this.stability * 0.05;
    return baseBoost + resonanceBoost + stabilityInfluence;
  }

  private calculateTemporalFactor(): number {
    const timeDelta = this.getTimeSinceLastUpdate();
    const dilationFactor = 1 + (this.dimensionalFrequency * 0.1);
    const entropyInfluence = 1 - (this.entropyLevel * 0.05);
    return Math.exp(-timeDelta / (10000 * dilationFactor)) * entropyInfluence;
  }

  private updateStateHistory(resonance: number): void {
    const currentMetrics: [number, number, number] = [
      this.stability,
      this.quantumAlignment,
      this.phaseCoherence
    ];
    
    this.stateHistory.push({
      timestamp: Date.now(),
      metrics: currentMetrics
    });
    
    if (this.stateHistory.length > 100) {
      this.stateHistory.shift();
    }
  }

  updateStability(interactionStrength: number): void {
    this.applyQuantumDegradation();

    const timeBonus = Math.max(0, 1 - this.getTimeSinceLastUpdate() / 5000);
    const effectiveStrength = interactionStrength * timeBonus;
    const historyBoost = this.calculateHistoryBoost();

    this.stability = Math.min(1.0, Math.max(0.0, 
      this.stability + effectiveStrength * (1 + this.dimensionalFrequency * 0.1) + historyBoost
    ));
    
    this.quantumAlignment = Math.min(1.0,
      this.quantumAlignment + effectiveStrength * 0.5 * (1 - this.entropyLevel * 0.2)
    );
    
    this.syncLevel = Math.min(1.0,
      this.syncLevel + effectiveStrength * 0.3 * (1 + this.phaseCoherence * 0.1)
    );
    
    this.dimensionalFrequency = Math.min(1.0,
      this.dimensionalFrequency + effectiveStrength * 0.2
    );
    
    this.entropyLevel = Math.max(0.0,
      this.entropyLevel - effectiveStrength * 0.1 * (1 + this.quantumAlignment * 0.1)
    );
    
    this.phaseCoherence = Math.min(1.0,
      this.phaseCoherence + effectiveStrength * 0.4 * (1 - this.entropyLevel * 0.1)
    );

    this.lastUpdate = Date.now();
  }

  private calculateHistoryBoost(): number {
    if (this.stateHistory.length < 2) return 0;
    
    const recentStates = this.stateHistory.slice(-5);
    const stabilityTrend = recentStates.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return 0;
      return acc + (curr.metrics[0] - arr[idx - 1].metrics[0]);
    }, 0) / (recentStates.length - 1);
    
    return stabilityTrend > 0 ? stabilityTrend * 0.1 : 0;
  }

  private applyQuantumDegradation(): void {
    const timePassed = this.getTimeSinceLastUpdate();
    if (timePassed > 1000) {
      const degradationFactor = this.calculateDegradationFactor(timePassed);
      
      this.stability *= degradationFactor;
      this.quantumAlignment *= degradationFactor * (1 + this.dimensionalFrequency * 0.1);
      this.syncLevel *= degradationFactor * (1 - this.entropyLevel * 0.1);
      this.phaseCoherence *= degradationFactor * (1 + this.resonance * 0.1);
      
      this.evolveEntropy(degradationFactor);
      this.lastUpdate = Date.now();
    }
  }

  private calculateDegradationFactor(timePassed: number): number {
    const baseDegradation = Math.pow(this.BASE_DEGRADATION_RATE, timePassed / 1000);
    const quantumFactor = 1 + (Math.sin(this.dimensionalFrequency * Math.PI) * 0.05);
    const coherenceFactor = 1 + (this.phaseCoherence * 0.02);
    return baseDegradation * quantumFactor * coherenceFactor;
  }

  private evolveEntropy(degradationFactor: number): void {
    const entropyIncrease = (1 - degradationFactor) * this.MAX_ENTROPY_INCREASE;
    const quantumEntropy = Math.sin(this.dimensionalFrequency * Math.PI) * 0.05;
    const coherenceInfluence = this.phaseCoherence * 0.02;
    
    this.entropyLevel = Math.min(1.0,
      this.entropyLevel + entropyIncrease + quantumEntropy - coherenceInfluence
    );
  }

  getStabilityMetrics(): [number, number, number] {
    this.applyQuantumDegradation();
    
    const baseMetrics = [this.stability, this.quantumAlignment, this.phaseCoherence];
    const quantumInfluence = Math.sin(this.dimensionalFrequency * Math.PI) * 0.1;
    const coherenceBoost = this.phaseCoherence * 0.05;
    
    return baseMetrics.map(metric => 
      Math.min(1.0, Math.max(0.0, metric + quantumInfluence + coherenceBoost))
    ) as [number, number, number];
  }

  private getTimeSinceLastUpdate(): number {
    return Date.now() - this.lastUpdate;
  }

  async stabilizeQuantumState(): Promise<boolean> {
    const currentStatus = this.getQuantumStatus();
    if (currentStatus === 'critical') {
      const recoveryStrength = 0.05 * (1 - this.entropyLevel);
      
      this.stability = Math.min(1.0, this.stability + recoveryStrength);
      this.quantumAlignment = Math.min(1.0, this.quantumAlignment + recoveryStrength * 0.8);
      this.syncLevel = Math.min(1.0, this.syncLevel + recoveryStrength * 0.6);
      
      this.entropyLevel = Math.max(0.0, 
        this.entropyLevel - 0.15 * recoveryStrength
      );
      
      return this.getQuantumStatus() !== 'critical';
    }
    return true;
  }

  getQuantumStatus(): 'stable' | 'unstable' | 'critical' {
    const metrics = this.getStabilityMetrics();
    const avgMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const entropyFactor = 1 - this.entropyLevel;
    const coherenceFactor = this.phaseCoherence;
    const effectiveMetric = avgMetric * entropyFactor * coherenceFactor;
    
    if (effectiveMetric > 0.7) return 'stable';
    if (effectiveMetric > 0.3) return 'unstable';
    return 'critical';
  }

  checkPatternResonance(pattern: ResonancePattern): boolean {
    const timeDecay = Math.exp(-(Date.now() - pattern.timestamp) / 10000);
    const coherenceCheck = pattern.coherence * timeDecay > this.PATTERN_COHERENCE_THRESHOLD;
    const frequencyMatch = Math.abs(pattern.frequency - this.dimensionalFrequency) < 0.2;
    const phaseAlignment = Math.abs(Math.sin(this.phaseCoherence * Math.PI)) > 0.7;
    
    return coherenceCheck && frequencyMatch && phaseAlignment;
  }

  analyzeStatePatterns(): { 
    stabilityTrend: number;
    coherenceQuality: number;
    entropyRisk: number;
  } {
    if (this.stateHistory.length < 10) {
      return {
        stabilityTrend: 0,
        coherenceQuality: 0,
        entropyRisk: 0
      };
    }

    const recentStates = this.stateHistory.slice(-10);
    
    const stabilityTrend = recentStates.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return 0;
      return acc + (curr.metrics[0] - arr[idx - 1].metrics[0]);
    }, 0) / (recentStates.length - 1);
    
    const coherenceQuality = recentStates.reduce((acc, curr) => 
      acc + curr.metrics[1], 0) / recentStates.length;
    
    const entropyRisk = this.entropyLevel * (1 - this.stability) * 
                       (1 - this.phaseCoherence);
    
    return {
      stabilityTrend,
      coherenceQuality,
      entropyRisk
    };
  }
}