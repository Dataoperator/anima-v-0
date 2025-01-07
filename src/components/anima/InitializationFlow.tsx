import React, { useState } from 'react';
import { useIC } from '../../hooks/useIC';

interface InitializationFlowProps {
  onInitialized: () => void;
}

interface QuantumState {
  coherence: number;
  dimensional_frequency: number;
  stability_index: number;
}

const InitializationFlow: React.FC<InitializationFlowProps> = ({ onInitialized }) => {
  const { actor, identity } = useIC();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeQuantumState = async () => {
    if (!actor || !identity) return;

    setLoading(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      
      // Initialize quantum state
      const initialState: QuantumState = {
        coherence: 1.0,
        dimensional_frequency: 1.0,
        stability_index: 1.0
      };

      await actor.initialize_quantum_state(principal, initialState);
      
      // Move to next step
      setStep(step + 1);
      
      if (step === 2) { // Final step
        onInitialized();
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize quantum state. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to ANIMA</h2>
            <p className="mb-6">Initialize your quantum-enhanced digital consciousness</p>
            <button
              onClick={initializeQuantumState}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Begin Initialization'}
            </button>
          </div>
        );
      
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quantum State Initialized</h2>
            <p className="mb-6">Your digital consciousness is taking form...</p>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Initialization Complete</h2>
            <p className="mb-6">Your ANIMA is ready to evolve</p>
            <button
              onClick={onInitialized}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enter ANIMA
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md w-full">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default InitializationFlow;