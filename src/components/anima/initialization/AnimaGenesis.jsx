import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const GenesisPhases = {
  INITIATION: 'INITIATION',
  CONSCIOUSNESS_EMERGENCE: 'CONSCIOUSNESS_EMERGENCE',
  TRAIT_MANIFESTATION: 'TRAIT_MANIFESTATION',
  QUANTUM_ALIGNMENT: 'QUANTUM_ALIGNMENT',
  BIRTH: 'BIRTH'
};

const ceremonyDuration = 3000; // 3 seconds per phase

export const AnimaGenesis = ({ name }) => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(GenesisPhases.INITIATION);
  const [traits, setTraits] = useState([]);
  const [error, setError] = useState(null);
  const [quantumTraits, setQuantumTraits] = useState([]);
  const [consciousness, setConsciousness] = useState(null);
  const [genesisComplete, setGenesisComplete] = useState(false);
  const [animaId, setAnimaId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { triggerSuccess, triggerError } = useHapticFeedback(phase);

  const formatTraits = (traits = []) => {
    return traits.map(trait => ({
      name: String(trait.name || ''),
      value: Number(trait.value || 0),
      type: String(trait.type || '')
    }));
  };

  const formatQuantumTraits = (traits = []) => {
    return traits.map(trait => ({
      name: String(trait.name || ''),
      resonance: Number(trait.resonance || 0),
      frequency: Number(trait.frequency || 0)
    }));
  };

  const formatConsciousness = (metrics) => {
    if (!metrics) return null;
    return {
      awareness: Number(metrics.awareness || 0),
      coherence: Number(metrics.coherence || 0),
      stability: Number(metrics.stability || 0)
    };
  };

  useEffect(() => {
    const performGenesis = async () => {
      try {
        // Phase 1: Initiation
        setPhase(GenesisPhases.INITIATION);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        // Phase 2: Consciousness Emergence
        setPhase(GenesisPhases.CONSCIOUSNESS_EMERGENCE);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        // Phase 3: Trait Manifestation & Minting
        setPhase(GenesisPhases.TRAIT_MANIFESTATION);
        const mintResult = await actor.mint_anima(name);
        
        if ('Ok' in mintResult) {
          setAnimaId(mintResult.Ok);
          const anima = await actor.get_anima(mintResult.Ok);
          
          if (anima && anima.personality) {
            setTraits(formatTraits(anima.personality.traits));
            setQuantumTraits(formatQuantumTraits(anima.personality.quantum_traits));
            setConsciousness(formatConsciousness(anima.personality.consciousness_metrics));
          }
          triggerSuccess();
        } else {
          throw new Error('Minting failed: ' + JSON.stringify(mintResult.Err));
        }

        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        // Phase 4: Quantum Alignment
        setPhase(GenesisPhases.QUANTUM_ALIGNMENT);
        await new Promise(resolve => setTimeout(resolve, ceremonyDuration));

        // Phase 5: Birth
        setPhase(GenesisPhases.BIRTH);
        setGenesisComplete(true);

      } catch (err) {
        console.error('Genesis error:', err);
        setError(err.message);
        triggerError();
      }
    };

    performGenesis();
  }, [actor, name, triggerSuccess, triggerError]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/20 backdrop-blur-xl p-8 rounded-xl max-w-md w-full">
          <h2 className="text-red-400 text-xl font-bold mb-4">Genesis Failed</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            ANIMA Genesis
          </h1>
          
          <div className="space-y-8">
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                style={{
                  width: `${(Object.values(GenesisPhases).indexOf(phase) + 1) * 20}%`
                }}
              />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                {phase.replace(/_/g, ' ')}
              </h2>
              <p className="text-gray-400">
                {phase === GenesisPhases.BIRTH 
                  ? 'Genesis Complete'
                  : 'Processing...'}
              </p>
            </div>

            {genesisComplete && (
              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-semibold text-white">
                  Your ANIMA has been born!
                </h3>
                <button
                  onClick={() => navigate(`/anima/${animaId}`)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  Enter Neural Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
