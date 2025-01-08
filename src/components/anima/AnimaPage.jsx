import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MatrixLayout } from '../layout/MatrixLayout';
import { useAnima } from '@/hooks/useAnima';
import { QuantumStateVisualizer } from '../quantum-vault/components/QuantumStateVisualizer';
import { AnimaNeuralLink } from '../neural-link/AnimaNeuralLink';
import { Alert } from '../ui/alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';
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

  // ... rest of component remains the same ...

  return (
    <MatrixLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Render appropriate stage based on flow */}
        {currentStage === 'neural-link' ? (
          <AnimaNeuralLink />
        ) : (
          // Regular ANIMA dashboard content
          <>
            {/* ... existing dashboard content ... */}
          </>
        )}
      </div>
    </MatrixLayout>
  );
};