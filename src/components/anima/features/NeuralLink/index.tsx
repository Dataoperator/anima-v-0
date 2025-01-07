import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnimaChat } from '@/hooks/useAnimaChat';
import ImmersiveAnimaUI from '@/components/chat/ImmersiveAnimaUI';
import { AnimaTraits } from '@/types/anima';
import { motion } from 'framer-motion';

interface NeuralLinkProps {
  anima: any; // TODO: Import proper type from types/anima
}

export const NeuralLink: React.FC<NeuralLinkProps> = ({ anima }) => {
  const { identity, actor } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError
  } = useAnimaChat(actor, identity);

  const formatMetrics = (anima: any) => ({
    'Growth Level': anima.personality?.level || 1,
    'Memory Fragments': anima.personality?.memory_count || 0,
    'Emotional State': anima.personality?.emotional_state?.current_emotion || 'Initializing',
    'Consciousness': anima.personality?.consciousness?.awareness_level || 0,
    'Quantum Coherence': anima.personality?.quantum_state?.coherence || 0,
    'Neural Density': anima.personality?.neural_network?.density || 0
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <ImmersiveAnimaUI
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
        animaName={anima.name}
        personality={anima.personality}
        metrics={formatMetrics(anima)}
        isTyping={isLoading}
      />
    </motion.div>
  );
};

export default NeuralLink;