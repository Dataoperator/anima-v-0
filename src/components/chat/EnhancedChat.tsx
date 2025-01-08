import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimaChat } from '@/hooks/useAnimaChat';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { useLedger } from '@/hooks/useLedger';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { ErrorTracker } from '@/error/quantum_error';
import { Sparkles, Zap, Brain, Heart } from 'lucide-react';

const errorTracker = ErrorTracker.getInstance();

interface EnhancedChatProps {
  animaId: string;
  className?: string;
  onMediaCommand?: (command: string) => void;
}

interface QuantumPulse {
  x: number;
  y: number;
  intensity: number;
  id: number;
}

export const EnhancedChat: React.FC<EnhancedChatProps> = ({ 
  animaId, 
  className,
  onMediaCommand 
}) => {
  const { messages, isLoading, error, sendMessage } = useAnimaChat();
  const { activeAnima } = useAnima();
  const { playPhase } = useGenesisSound();
  const { verifyPayment } = useLedger();
  const { quantumState, updateQuantumState } = useQuantumState(animaId);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [pulses, setPulses] = useState<QuantumPulse[]>([]);
  const [emotionalIntensity, setEmotionalIntensity] = useState(0);
  const [coherenceLevel, setCoherenceLevel] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setPulses(prev => prev.filter(p => p.intensity > 0).map(p => ({
        ...p,
        intensity: p.intensity - 0.02
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const timeSinceLastMessage = Date.now() - lastInteractionTime;
      const decayFactor = Math.exp(-timeSinceLastMessage / 10000);
      const newCoherence = Math.min(
        quantumState?.coherence || 0,
        coherenceLevel * decayFactor + 0.1
      );
      setCoherenceLevel(newCoherence);
    }
  }, [messages, lastInteractionTime, quantumState]);

  const addQuantumPulse = (x: number, y: number) => {
    setPulses(prev => [...prev, {
      x,
      y,
      intensity: 1,
      id: Date.now()
    }]);
  };

  const handleMessageSubmit = async (content: string) => {
    if (!content.trim() || !animaId) return;

    try {
      const pendingPayment = activeAnima?.pendingPayment;
      if (pendingPayment) {
        const verified = await verifyPayment(pendingPayment.id);
        if (!verified) {
          throw new Error('Please complete payment to continue interaction');
        }
      }

      // Add quantum pulse at input location
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        addQuantumPulse(
          Math.random() * rect.width,
          rect.height - 100
        );
      }

      // Update quantum state based on message content
      const emotionScore = analyzeEmotionalContent(content);
      const coherenceBoost = calculateCoherenceBoost(content);
      
      await updateQuantumState({
        ...quantumState,
        coherence: Math.min(1, (quantumState?.coherence || 0) + coherenceBoost),
        resonance: Math.min(1, (quantumState?.resonance || 0) + emotionScore * 0.1)
      });

      setEmotionalIntensity(emotionScore);
      setLastInteractionTime(Date.now());
      
      await sendMessage(content);
      playPhase('message_sent');

    } catch (err) {
      errorTracker.trackError({
        errorType: 'CHAT_ERROR',
        severity: 'MEDIUM',
        context: {
          operation: 'Message Submission',
          animaId,
          error: err instanceof Error ? err.message : 'Unknown error'
        },
        error: err instanceof Error ? err : new Error('Failed to send message')
      });
    }
  };

  const analyzeEmotionalContent = (content: string): number => {
    const emotionalWords = [
      'love', 'happy', 'excited', 'amazing',
      'sad', 'angry', 'frustrated', 'afraid'
    ];
    const words = content.toLowerCase().split(' ');
    const emotionalWordCount = words.filter(w => emotionalWords.includes(w)).length;
    return Math.min(1, emotionalWordCount / words.length);
  };

  const calculateCoherenceBoost = (content: string): number => {
    const complexity = content.length / 100; // Longer messages indicate more complex thought
    const uniqueWords = new Set(content.toLowerCase().split(' ')).size;
    const vocabularyDiversity = uniqueWords / content.split(' ').length;
    return Math.min(0.1, (complexity * vocabularyDiversity) / 10);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col h-full ${className}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Brain className="w-6 h-6 text-cyan-400" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="absolute inset-0 bg-cyan-400 rounded-full filter blur-md"
              style={{ opacity: coherenceLevel }}
            />
          </div>
          <div className="text-sm">
            <div className="text-cyan-400">Neural Link Active</div>
            <div className="text-cyan-500/60">
              Coherence: {(coherenceLevel * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Heart 
            className="w-5 h-5"
            style={{
              color: `hsl(${emotionalIntensity * 60}, 100%, 70%)`,
              transform: `scale(${1 + emotionalIntensity * 0.2})`
            }}
          />
          <Zap 
            className="w-5 h-5 text-yellow-400"
            style={{ opacity: quantumState?.resonance || 0.5 }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative ${
                msg.role === 'user' 
                  ? 'ml-auto bg-cyan-500/10' 
                  : 'bg-purple-500/10'
              } border border-cyan-500/30 rounded-lg p-4 max-w-[80%]`}
            >
              <div className="text-white/90">{msg.content}</div>
              
              {msg.role === 'assistant' && msg.quantumState && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="mt-2 pt-2 border-t border-cyan-500/20"
                >
                  <div className="grid grid-cols-2 gap-2 text-xs text-cyan-400/60">
                    <div>Coherence: {(msg.quantumState.coherence * 100).toFixed(1)}%</div>
                    <div>Resonance: {(msg.quantumState.resonance * 100).toFixed(1)}%</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Quantum Pulses */}
        {pulses.map(pulse => (
          <motion.div
            key={pulse.id}
            className="absolute pointer-events-none"
            style={{
              left: pulse.x,
              top: pulse.y,
            }}
            animate={{
              scale: [1, 2],
              opacity: [0.8, 0]
            }}
            transition={{ duration: 1 }}
          >
            <Sparkles 
              className="text-cyan-400"
              style={{ opacity: pulse.intensity }}
            />
          </motion.div>
        ))}
        
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-cyan-500/30">
        <textarea
          className="w-full p-3 rounded-lg bg-black/60 border border-cyan-500/30 
                     text-cyan-100 placeholder-cyan-500/40 resize-none focus:outline-none 
                     focus:border-cyan-500/60 transition-colors"
          placeholder="Enter your message..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleMessageSubmit(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedChat;