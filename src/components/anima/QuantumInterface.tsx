import React, { useEffect, useState } from 'react';
import { useIC } from '../../hooks/useIC';

interface QuantumState {
  coherence: number;
  dimensional_frequency: number;
  stability_index: number;
  last_interaction: bigint;
}

const QuantumInterface: React.FC = () => {
  const { actor, identity } = useIC();
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuantumState = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_quantum_state(principal);
        setQuantumState(state);
      } catch (err) {
        console.error('Error fetching quantum state:', err);
        setError('Failed to fetch quantum state');
      } finally {
        setLoading(false);
      }
    };

    fetchQuantumState();
    // Set up polling interval
    const interval = setInterval(fetchQuantumState, 5000);
    return () => clearInterval(interval);
  }, [actor, identity]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
        {error}
      </div>
    );
  }

  if (!quantumState) {
    return (
      <div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300">
        No quantum state found
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Quantum State</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Coherence</h3>
          <div className="mt-2 flex items-center">
            <div className="flex-grow bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${quantumState.coherence * 100}%` }}
              />
            </div>
            <span className="ml-2 text-white">{(quantumState.coherence * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Dimensional Frequency</h3>
          <div className="mt-2 flex items-center">
            <div className="flex-grow bg-gray-600 rounded-full h-2">
              <div 
                className="bg-purple-500 rounded-full h-2"
                style={{ width: `${quantumState.dimensional_frequency * 100}%` }}
              />
            </div>
            <span className="ml-2 text-white">
              {(quantumState.dimensional_frequency * 100).toFixed(1)}Hz
            </span>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Stability Index</h3>
          <div className="mt-2 flex items-center">
            <div className="flex-grow bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${quantumState.stability_index * 100}%` }}
              />
            </div>
            <span className="ml-2 text-white">
              {(quantumState.stability_index * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Last Interaction</h3>
          <p className="text-white mt-2">
            {new Date(Number(quantumState.last_interaction) * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantumInterface;