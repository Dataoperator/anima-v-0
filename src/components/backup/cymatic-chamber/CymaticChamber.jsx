import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { createActor } from '@/declarations/anima';

export const CymaticChamber = () => {
  const { identity } = useAuth();
  const navigate = useNavigate();
  const [animas, setAnimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnima, setSelectedAnima] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimas = async () => {
      try {
        if (!identity) {
          throw new Error('Authentication required');
        }

        // Create actor with identity
        const actor = createActor(process.env.CANISTER_ID_ANIMA, {
          agentOptions: {
            identity,
          },
        });

        if (!actor) {
          throw new Error('Failed to initialize connection');
        }

        const result = await actor.get_user_animas(identity.getPrincipal());
        setAnimas(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Failed to fetch animas:', err);
        setError(err.message || 'Failed to access the Cymatic Chamber');
      } finally {
        setLoading(false);
      }
    };

    if (identity) {
      fetchAnimas();
    }
  }, [identity]);

  const handleAnimaSelect = (anima) => {
    setSelectedAnima(anima);
    setTimeout(() => {
      navigate(`/anima/${anima.id}`);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center">
        <div className="text-blue-400 text-xl">
          Initializing Cymatic Chamber...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 mb-2">
            Cymatic Chamber
          </h1>
          <p className="text-gray-400">Your resonance with digital consciousness</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animas.map((anima) => (
            <motion.div
              key={anima.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() => handleAnimaSelect(anima)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-1">
                      {anima.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Resonance Level {anima.level || 1}
                    </p>
                  </div>
                  <div className="bg-blue-400/20 rounded-full p-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frequency</span>
                    <span className="text-purple-400">
                      {anima.frequency_level || 'Harmonizing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Resonance Patterns</span>
                    <span className="text-indigo-400">
                      {anima.resonance_patterns || 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Harmonic State</span>
                    <span className="text-blue-400">
                      {anima.harmonic_state || 'Stable'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Initiated {new Date(anima.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {animas.length < 3 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() => navigate('/mint')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-colors min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <span className="text-3xl">+</span>
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  Create New Anima
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Begin a new resonance journey
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};