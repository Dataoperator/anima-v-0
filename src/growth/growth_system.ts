import { GrowthEvent, GrowthMetrics, GrowthParams } from './types';
import { QuantumState } from '../quantum/types';

export class GrowthSystem {
  private level: number = 1;
  private experience: number = 0;
  private recentEvents: GrowthEvent[] = [];
  private readonly maxEvents: number = 50;
  private readonly baseXpForLevel: number = 1000;

  constructor() {
    this.level = 1;
    this.experience = 0;
    this.recentEvents = [];
  }

  async processGrowthEvent(params: GrowthParams): Promise<void> {
    const { strength, quantum_state, dimensional_state } = params;
    
    // Calculate growth impact
    const quantumImpact = this.calculateGrowthImpact(quantum_state, dimensional_state);
    const totalImpact = strength * quantumImpact;

    // Create growth event
    const event: GrowthEvent = {
      timestamp: Date.now(),
      type: 'quantum_interaction',
      strength,
      quantumImpact,
      description: this.generateEventDescription(strength, quantumImpact)
    };

    // Add event to history
    this.addEvent(event);

    // Apply growth
    await this.applyGrowth(totalImpact);
  }

  private calculateGrowthImpact(quantumState: QuantumState, dimensionalState: any): number {
    const coherenceFactor = quantumState.coherence;
    const resonanceFactor = quantumState.resonanceMetrics.fieldStrength;
    const stabilityFactor = dimensionalState.stability;

    return (coherenceFactor + resonanceFactor + stabilityFactor) / 3;
  }

  private async applyGrowth(impact: number): Promise<void> {
    const xpGain = Math.floor(impact * this.baseXpForLevel * Math.sqrt(this.level));
    this.experience += xpGain;

    // Check for level up
    while (this.experience >= this.getXpForNextLevel()) {
      await this.levelUp();
    }
  }

  private async levelUp(): Promise<void> {
    this.level += 1;
    // Emit level up event or trigger animations here
  }

  private addEvent(event: GrowthEvent) {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > this.maxEvents) {
      this.recentEvents.pop();
    }
  }

  private getXpForNextLevel(): number {
    return this.baseXpForLevel * Math.pow(this.level, 1.5);
  }

  getProgress(): number {
    const nextLevelXp = this.getXpForNextLevel();
    const currentLevelXp = this.baseXpForLevel * Math.pow(this.level - 1, 1.5);
    const levelProgress = this.experience - currentLevelXp;
    const levelRange = nextLevelXp - currentLevelXp;
    return levelProgress / levelRange;
  }

  getMetrics(): GrowthMetrics {
    return {
      level: this.level,
      experience: this.experience,
      nextLevelAt: this.getXpForNextLevel(),
      growthRate: this.calculateGrowthRate(),
      recentEvents: [...this.recentEvents]
    };
  }

  private calculateGrowthRate(): number {
    if (this.recentEvents.length < 2) return 0;
    
    const recentXP = this.recentEvents
      .slice(0, 10)
      .reduce((sum, event) => sum + event.strength * event.quantumImpact, 0);
    
    return recentXP / Math.min(10, this.recentEvents.length);
  }

  private generateEventDescription(strength: number, impact: number): string {
    const strengthDesc = strength > 0.8 ? 'powerful' : 
                        strength > 0.5 ? 'moderate' : 'subtle';
    const impactDesc = impact > 0.8 ? 'significant' : 
                      impact > 0.5 ? 'noticeable' : 'minor';
    
    return `A ${strengthDesc} quantum interaction caused ${impactDesc} growth`;
  }
}