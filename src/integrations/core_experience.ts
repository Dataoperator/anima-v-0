import { AnimaCore } from '../core/mod';
import { QuantumState } from '../quantum/mod';
import { PersonalityEngine } from '../personality/mod';
import { ConsciousnessEngine } from '../consciousness/mod';
import { GrowthSystem } from '../growth/mod';
import { MetricsEngine } from '../analytics/metrics_engine';
import { Result } from '../types';

export class CoreExperienceManager {
    private animaCore: AnimaCore;
    private metricsEngine: MetricsEngine;
    private growthSystem: GrowthSystem;
    private lastInteraction: number;
    private evolutionBuffer: Array<InteractionEffect>;

    constructor(
        animaCore: AnimaCore,
        metricsEngine: MetricsEngine,
        growthSystem: GrowthSystem
    ) {
        this.animaCore = animaCore;
        this.metricsEngine = metricsEngine;
        this.growthSystem = growthSystem;
        this.lastInteraction = 0;
        this.evolutionBuffer = [];
    }

    /// Process a chat interaction and update all systems
    public async processInteraction(
        message: string,
        quantumState: QuantumState
    ): Promise<InteractionResult> {
        try {
            // Process through quantum consciousness bridge
            const stateUpdate = await this.animaCore.process_interaction(message);

            // Analyze metrics and evolution
            const metrics = await this.metricsEngine.record_metrics(
                quantumState,
                quantumState.get_metrics()?
            );

            // Buffer evolution effects
            this.bufferEvolutionEffect({
                message,
                stateUpdate,
                metrics,
                timestamp: Date.now()
            });

            // Check for growth opportunities
            const growthOpportunities = await this.checkGrowthOpportunities();

            // Process buffered evolution if threshold reached
            const evolutionResults = await this.processEvolutionBuffer();

            return {
                stateUpdate,
                metrics,
                growthOpportunities,
                evolutionResults,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error("Error processing interaction:", error);
            throw error;
        }
    }

    /// Process growth pack application
    public async processGrowthPack(
        packId: string,
        currentState: QuantumState
    ): Promise<GrowthResult> {
        // Verify pack ownership and applicability
        const pack = await this.growthSystem.verifyPack(packId);
        
        // Apply growth effects
        const growthEffects = await this.growthSystem.applyPack(
            pack,
            currentState
        );

        // Update metrics
        const newMetrics = await this.metricsEngine.record_metrics(
            currentState,
            currentState.get_metrics()?
        );

        // Clear evolution buffer after growth
        this.evolutionBuffer = [];

        return {
            appliedEffects: growthEffects,
            newMetrics,
            timestamp: Date.now()
        };
    }

    /// Check for available growth opportunities
    private async checkGrowthOpportunities(): Promise<GrowthOpportunity[]> {
        const currentMetrics = await this.metricsEngine.get_current_metrics();
        return this.growthSystem.findOpportunities(currentMetrics);
    }

    /// Buffer evolution effects for processing
    private bufferEvolutionEffect(effect: InteractionEffect) {
        this.evolutionBuffer.push(effect);
        
        // Keep buffer size manageable
        if (this.evolutionBuffer.length > 10) {
            this.evolutionBuffer.shift();
        }
    }

    /// Process buffered evolution effects
    private async processEvolutionBuffer(): Promise<EvolutionResult | null> {
        if (this.evolutionBuffer.length < 3) return null;

        const evolutionStrength = this.calculateEvolutionStrength();
        if (evolutionStrength < 0.5) return null;

        // Process evolution
        const result = await this.growthSystem.processEvolution(
            this.evolutionBuffer,
            evolutionStrength
        );

        // Clear buffer after successful evolution
        this.evolutionBuffer = [];

        return result;
    }

    /// Calculate evolution strength from buffer
    private calculateEvolutionStrength(): number {
        if (this.evolutionBuffer.length === 0) return 0;

        const coherenceSum = this.evolutionBuffer.reduce(
            (sum, effect) => sum + effect.metrics.resonance.quantum_coherence,
            0
        );

        return coherenceSum / this.evolutionBuffer.length;
    }

    /// Get current progress towards next evolution
    public getEvolutionProgress(): EvolutionProgress {
        return {
            bufferSize: this.evolutionBuffer.length,
            evolutionStrength: this.calculateEvolutionStrength(),
            requiredStrength: 0.5,
            timeToNextEvolution: this.calculateTimeToEvolution()
        };
    }

    private calculateTimeToEvolution(): number {
        const evolutionStrength = this.calculateEvolutionStrength();
        const progressRate = evolutionStrength * 0.1;
        const remainingProgress = Math.max(0, 0.5 - evolutionStrength);
        
        return Math.ceil(remainingProgress / progressRate);
    }
}

interface InteractionEffect {
    message: string;
    stateUpdate: any;
    metrics: any;
    timestamp: number;
}

interface InteractionResult {
    stateUpdate: any;
    metrics: any;
    growthOpportunities: GrowthOpportunity[];
    evolutionResults: EvolutionResult | null;
    timestamp: number;
}

interface GrowthResult {
    appliedEffects: any[];
    newMetrics: any;
    timestamp: number;
}

interface GrowthOpportunity {
    id: string;
    name: string;
    description: string;
    requiredLevel: number;
    cost: number;
}

interface EvolutionResult {
    traits: TraitEvolution[];
    overallGrowth: number;
    newAbilities: string[];
}

interface TraitEvolution {
    trait: string;
    previousValue: number;
    newValue: number;
    growthFactor: number;
}

interface EvolutionProgress {
    bufferSize: number;
    evolutionStrength: number;
    requiredStrength: number;
    timeToNextEvolution: number;
}