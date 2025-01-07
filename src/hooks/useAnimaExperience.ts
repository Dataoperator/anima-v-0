import { useState, useCallback, useEffect } from 'react';
import { useAnima } from './useAnima';
import { useQuantumState } from './useQuantumState';
import { CoreExperienceManager } from '../integrations/core_experience';
import { GrowthSystem } from '../growth/mod';
import { MetricsEngine } from '../analytics/metrics_engine';
import { AnimaCore } from '../core/mod';

export const useAnimaExperience = (animaId: string) => {
    const { activeAnima, updateAnima } = useAnima();
    const { quantumState, updateQuantumState } = useQuantumState(animaId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [evolutionProgress, setEvolutionProgress] = useState<EvolutionProgress | null>(null);
    const [growthOpportunities, setGrowthOpportunities] = useState<GrowthOpportunity[]>([]);

    // Initialize core experience manager
    const [experienceManager] = useState(() => {
        const core = new AnimaCore();
        const metrics = new MetricsEngine(MetricsEngine.default());
        const growth = new GrowthSystem();
        
        return new CoreExperienceManager(core, metrics, growth);
    });

    // Process chat interaction
    const processInteraction = useCallback(async (message: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await experienceManager.processInteraction(
                message,
                quantumState
            );

            // Update states
            updateQuantumState(result.stateUpdate);
            if (result.evolutionResults) {
                updateAnima({
                    ...activeAnima,
                    traits: result.evolutionResults.traits,
                    abilities: [...activeAnima.abilities, ...result.evolutionResults.newAbilities]
                });
            }

            // Update opportunities
            setGrowthOpportunities(result.growthOpportunities);
            
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [experienceManager, quantumState, activeAnima]);

    // Apply growth pack
    const applyGrowthPack = useCallback(async (packId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await experienceManager.processGrowthPack(
                packId,
                quantumState
            );

            updateQuantumState(result.newMetrics);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [experienceManager, quantumState]);

    // Track evolution progress
    useEffect(() => {
        const interval = setInterval(() => {
            const progress = experienceManager.getEvolutionProgress();
            setEvolutionProgress(progress);
        }, 1000);

        return () => clearInterval(interval);
    }, [experienceManager]);

    // Growth opportunities check
    useEffect(() => {
        const checkOpportunities = async () => {
            try {
                const opportunities = await experienceManager.checkGrowthOpportunities();
                setGrowthOpportunities(opportunities);
            } catch (err) {
                console.error("Error checking growth opportunities:", err);
            }
        };

        checkOpportunities();
        const interval = setInterval(checkOpportunities, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, [experienceManager]);

    return {
        processInteraction,
        applyGrowthPack,
        evolutionProgress,
        growthOpportunities,
        isLoading,
        error,
        quantumState,
        activeAnima
    };
};

export type {
    EvolutionProgress,
    GrowthOpportunity,
    InteractionResult,
    GrowthResult
} from '../integrations/core_experience';