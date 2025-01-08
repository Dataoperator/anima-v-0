import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MatrixLayout } from '../layout/MatrixLayout';
import { useAnima } from '@/hooks/useAnima';
import { UnifiedNeuralLink } from '../neural-link/UnifiedNeuralLink';
import { Alert } from '../ui/alert';
import { Loading } from '../ui/loading';
import { useAppFlow } from '@/contexts/AppFlow';

const AnimaPage = () => {
  const { id } = useParams();
  const { 
    loading, 
    error, 
    anima, 
    quantumState, 
    refreshAnima 
  } = useAnima(id);

  const { flowData, currentStage } = useAppFlow();

  useEffect(() => {
    // If we have flow data but no anima, refresh to load it
    if (flowData.animaId && !anima) {
      refreshAnima();
    }
  }, [flowData.animaId, anima, refreshAnima]);

  if (loading) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size={48} className="text-cyan-400" />
        </div>
      </MatrixLayout>
    );
  }

  if (error) {
    return (
      <MatrixLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="error">
            {error.message || 'Failed to load ANIMA data'}
          </Alert>
        </div>
      </MatrixLayout>
    );
  }

  return (
    <MatrixLayout>
      <div className="container mx-auto px-4 py-8">
        {currentStage === 'neural-link' ? (
          <UnifiedNeuralLink animaId={id} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {anima && (
              <>
                <div className="space-y-6">
                  <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {anima.name}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Quantum Coherence</span>
                        <span className="text-cyan-400">{quantumState?.coherenceLevel.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Neural Patterns</span>
                        <span className="text-purple-400">{anima.neuralPatterns?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Evolution Stage</span>
                        <span className="text-indigo-400">{anima.evolutionStage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Neural Interface
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Connect with your ANIMA through the neural link interface to enhance bond and accelerate evolution.
                    </p>
                    <motion.button
                      onClick={() => flowData.setStage('neural-link')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium"
                    >
                      Initialize Neural Link
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </MatrixLayout>
  );
};

export default AnimaPage;