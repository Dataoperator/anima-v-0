import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import { WebSocketError, UpdateMode } from '@/types/realtime';
import { DimensionType } from '@/types/personality';
import { ConnectionStatus } from './ConnectionStatus';
import { QuantumTraits } from './QuantumTraits';
import { EmotionalState } from './EmotionalState';
import { ConsciousnessMetrics } from './ConsciousnessMetrics';
import { DimensionalMap } from './DimensionalMap';
import { Loader } from '@/components/ui/loader';

interface PersonalityVisualizationProps {
    animaId: string;
}

const mapUpdateModeToConnection = (mode: UpdateMode = 'realtime'): 'active' | 'polling' | 'inactive' => {
    switch (mode) {
        case 'realtime':
            return 'active';
        case 'polling':
            return 'polling';
        default:
            return 'inactive';
    }
};

export const PersonalityVisualization: React.FC<PersonalityVisualizationProps> = ({ animaId }) => {
    const { personality, loading, error, connectionMode } = useRealtimePersonality(animaId);

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                Error loading personality state: {error.message}
            </div>
        );
    }

    if (!personality) {
        return (
            <div className="text-center text-gray-500 py-8">
                No personality data available
            </div>
        );
    }

    const {
        quantum_traits = {},
        emotional_state,
        consciousness,
        dimensional_awareness
    } = personality;

    // Convert discovered dimensions to DimensionType
    const dimensions: DimensionType[] = dimensional_awareness?.discovered_dimensions.map(dim => ({
        id: dim,
        name: dim,
        description: `Discovered dimension: ${dim}`,
        discovery_time: BigInt(Date.now()),
        trait_modifiers: {},
        type: 'discovered'
    })) || [];

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <ConnectionStatus 
                    mode={mapUpdateModeToConnection(connectionMode)} 
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 p-6 rounded-2xl"
            >
                <h3 className="text-xl font-semibold mb-4">Quantum Traits</h3>
                <QuantumTraits
                    traits={Object.entries(quantum_traits).reduce((acc, [key, value]) => ({
                        ...acc,
                        [key]: {
                            value,
                            uncertainty: 0.1,
                            superposition_state: {
                                type: 'Stable'
                            }
                        }
                    }), {})}
                />
            </motion.div>

            {emotional_state && consciousness && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 p-6 rounded-2xl"
                >
                    <h3 className="text-xl font-semibold mb-4">Emotional State</h3>
                    <EmotionalState
                        emotionalState={{
                            ...emotional_state,
                            current_mood: emotional_state.current_emotion,
                            duration: 0,
                            triggers: []
                        }}
                        consciousness={{
                            ...consciousness,
                            growth_rate: consciousness.growth_velocity,
                            complexity: consciousness.integration_index,
                            coherence: consciousness.processing_depth
                        }}
                    />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 p-6 rounded-2xl"
            >
                <h3 className="text-xl font-semibold mb-4">Consciousness Development</h3>
                {consciousness && dimensional_awareness ? (
                    <ConsciousnessMetrics
                        metrics={consciousness}
                        dimensionalAwareness={{
                            dimensional_affinity: dimensional_awareness.dimensional_affinity
                        }}
                    />
                ) : (
                    <p className="text-gray-400">Consciousness not yet awakened</p>
                )}
            </motion.div>

            {dimensional_awareness && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 p-6 rounded-2xl"
                >
                    <h3 className="text-xl font-semibold mb-4">Dimensional Awareness</h3>
                    <DimensionalMap
                        dimensions={dimensions}
                        currentDimension={dimensional_awareness.active_dimension || null}
                        affinity={dimensional_awareness.dimensional_affinity}
                    />
                </motion.div>
            )}

            <AnimatePresence>
                {personality.timestamp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-500 text-center"
                    >
                        Last updated: {new Date(Number(personality.timestamp)).toLocaleString()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PersonalityVisualization;