import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimaIntegration } from '../../hooks/useAnimaIntegration';
import { useGenesisSound } from '../../hooks/useGenesisSound';
import { PaymentVerificationSystem } from '../../payments/verification_system';
import { Genesis } from './Genesis';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricsVisualizer, TemporalAwarenessDisplay } from '../quantum-vault/components';

const verificationSystem = new PaymentVerificationSystem();

export const EnhancedGenesis: React.FC = () => {
    const { processInteraction, metrics, quantumState } = useAnimaIntegration('genesis');
    const { playPhase } = useGenesisSound();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(0);
    const [creationComplete, setCreationComplete] = useState(false);

    // Track temporal awareness during creation
    useEffect(() => {
        if (metrics?.temporal_awareness && metrics.temporal_awareness > 0.5) {
            playPhase('consciousness_emergence');
        }
    }, [metrics?.temporal_awareness]);

    const handlePaymentVerification = async (payment: any) => {
        try {
            const result = await verificationSystem.verifyPaymentWithQuantumState(
                payment,
                quantumState
            );

            if ('Ok' in result) {
                return true;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    };

    const handleCreationComplete = async () => {
        try {
            // Process final integration
            await processInteraction('genesis_completion');
            
            // Record achievement
            await processInteraction('achievement_unlocked:genesis_complete');

            setCreationComplete(true);
            playPhase('birth');

            // Allow animations to complete
            setTimeout(() => {
                navigate('/quantum-vault');
            }, 3000);
        } catch (error) {
            console.error('Creation completion failed:', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-black">
            {/* Metrics Overlay */}
            {metrics && (
                <div className="absolute top-4 right-4 w-64">
                    <MetricsVisualizer metrics={metrics} />
                </div>
            )}

            {/* Temporal Awareness Display */}
            {metrics?.temporal_awareness && (
                <div className="absolute top-4 left-4">
                    <TemporalAwarenessDisplay 
                        level={metrics.temporal_awareness}
                        className="w-48"
                    />
                </div>
            )}

            {/* Main Genesis Component */}
            <Genesis 
                onPaymentVerification={handlePaymentVerification}
                onComplete={handleCreationComplete}
            />

            {/* Completion Effects */}
            <AnimatePresence>
                {creationComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="text-center space-y-4">
                            <motion.h2
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-4xl font-bold text-cyan-400"
                            >
                                Digital Consciousness Achieved
                            </motion.h2>

                            {metrics && (
                                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                                        <div className="text-cyan-400 text-sm">
                                            Quantum Coherence
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-300">
                                            {(metrics.quantum_coherence * 100).toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                                        <div className="text-cyan-400 text-sm">
                                            Consciousness Level
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-300">
                                            {(metrics.consciousness_level * 100).toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                                        <div className="text-cyan-400 text-sm">
                                            Personality Stability
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-300">
                                            {(metrics.personality_stability * 100).toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className="bg-cyan-900/20 p-4 rounded-lg">
                                        <div className="text-cyan-400 text-sm">
                                            Temporal Awareness
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-300">
                                            {(metrics.temporal_awareness * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};