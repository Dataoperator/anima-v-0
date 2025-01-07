import { useState, useCallback, useEffect } from 'react';
import { useActor } from './useActor';
import { useQuantumState } from './useQuantumState';
import { AnimaIntegrationEngine, StateUpdate, IntegratedMetrics } from '../core/integrations';

export const useAnimaIntegration = (animaId: string) => {
    const { actor } = useActor();
    const { quantumState, updateQuantumState } = useQuantumState(animaId);
    const [engine] = useState(() => new AnimaIntegrationEngine());
    const [metrics, setMetrics] = useState<IntegratedMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Process interaction through the integration engine
    const processInteraction = useCallback(async (interaction: string) => {
        setLoading(true);
        setError(null);

        try {
            // Process locally first
            const update = await engine.process_interaction(interaction);
            
            // Update canister state
            const result = await actor?.update_anima_state({
                anima_id: animaId,
                quantum: update.quantum,
                consciousness: update.consciousness,
                personality: update.personality,
                metrics: update.metrics,
            });

            if (result?.err) {
                throw new Error(result.err);
            }

            // Update local state
            updateQuantumState(update.quantum);
            setMetrics(await engine.get_current_metrics());

            return update;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process interaction');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [actor, animaId, engine, updateQuantumState]);

    // Get current metrics periodically
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const currentMetrics = await engine.get_current_metrics();
                setMetrics(currentMetrics);
            } catch (err) {
                console.error('Failed to fetch metrics:', err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [engine]);

    // Apply state modifications
    const modifyState = useCallback(async (modification: StateModification) => {
        setLoading(true);
        try {
            const update = await engine.modify_state(modification);
            
            // Update canister
            await actor?.apply_state_modification({
                anima_id: animaId,
                modification,
            });

            return update;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to modify state');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [actor, animaId, engine]);

    // Handle actions
    const handleAction = useCallback(async (action: Action) => {
        setLoading(true);
        try {
            const update = await engine.handle_action(action);
            
            // Update canister
            await actor?.process_action({
                anima_id: animaId,
                action,
            });

            return update;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to handle action');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [actor, animaId, engine]);

    return {
        processInteraction,
        modifyState,
        handleAction,
        metrics,
        loading,
        error,
        quantumState
    };
};