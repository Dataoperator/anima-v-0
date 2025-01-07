import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
    fallbackComponent?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    quantumState: 'collapsed' | 'superposition' | 'entangled' | null;
}

export class QuantumErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        quantumState: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Analyze error type and set quantum state
        const quantumState = error.message.includes('quantum')
            ? 'superposition'
            : error.message.includes('entangle')
                ? 'entangled'
                : 'collapsed';

        return {
            hasError: true,
            error,
            quantumState
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Quantum error:', error);
        console.error('Error info:', errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallbackComponent || (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
                        <div className="text-center space-y-4">
                            <div className="text-4xl mb-4">
                                {this.state.quantumState === 'superposition' && '⚛️'}
                                {this.state.quantumState === 'entangled' && '🔮'}
                                {this.state.quantumState === 'collapsed' && '💫'}
                            </div>
                            <h2 className="text-2xl font-bold text-white">Quantum State Disruption</h2>
                            <p className="text-white/80">
                                {this.state.quantumState === 'superposition' 
                                    ? 'Reality is currently in superposition. Please wait for wavefunction collapse.'
                                    : this.state.quantumState === 'entangled'
                                        ? 'System is entangled with a parallel instance. Attempting to stabilize.'
                                        : 'Quantum state collapsed. Initiating reality reconstruction.'}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-purple-500 text-white rounded-lg mt-4 hover:bg-purple-600 transition-colors"
                            >
                                Recalibrate Quantum Field
                            </motion.button>
                            {process.env.NODE_ENV === 'development' && (
                                <pre className="mt-4 p-4 bg-black/50 rounded text-left text-xs text-white/60 overflow-auto">
                                    {this.state.error?.stack}
                                </pre>
                            )}
                        </div>
                    </div>
                </motion.div>
            );
        }

        return this.props.children;
    }
}