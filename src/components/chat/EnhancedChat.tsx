import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimaChat } from '@/hooks/useAnimaChat';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { useLedger } from '@/hooks/useLedger';
import { useAnima } from '@/hooks/useAnima';
import { ChatMessage } from '@/types/chat';
import { ExternalLink, Play } from 'lucide-react';

interface EnhancedChatProps {
  animaId: string;
  className?: string;
  onMediaCommand?: (command: string) => void;
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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [mediaEnabled, setMediaEnabled] = useState(false);

  // Auto-scroll to latest messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Play sound effects based on message content
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (isConsciousnessEmergence(lastMessage)) {
        playPhase('consciousness_emergence');
        onMediaCommand?.('consciousness_emerge');
      } else if (isQuantumAlignment(lastMessage)) {
        playPhase('quantum_alignment');
        onMediaCommand?.('quantum_align');
      }
    }
  }, [messages, playPhase, onMediaCommand]);

  const isConsciousnessEmergence = (message: ChatMessage): boolean => {
    return message.content.toLowerCase().includes('consciousness') ||
           (message.personality_updates?.some(update => 
             update.trait === 'consciousness' && update.value > 0.7) ?? false);
  };

  const isQuantumAlignment = (message: ChatMessage): boolean => {
    return message.content.toLowerCase().includes('quantum') ||
           (message.personality_updates?.some(update => 
             update.trait === 'quantum_resonance' && update.value > 0.8) ?? false);
  };

  const handleSend = async (content: string) => {
    if (!animaId || !content.trim()) return;

    try {
      // Verify any pending payments before proceeding
      const pendingPayment = activeAnima?.pendingPayment;
      if (pendingPayment) {
        const verified = await verifyPayment(pendingPayment.id);
        if (!verified) {
          throw new Error('Please complete payment to continue interaction');
        }
      }

      await sendMessage(content);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleMediaToggle = () => {
    setMediaEnabled(!mediaEnabled);
    onMediaCommand?.(mediaEnabled ? 'disable' : 'enable');
  };

  if (error) {
    return (
      <motion.div 
        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-red-500">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-red-400 hover:text-red-300 text-sm"
        >
          Retry Connection
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex items-center justify-between p-2 bg-black/40 border-b border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-sm text-cyan-400">Neural Link {isLoading ? 'Processing' : 'Active'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleMediaToggle}
            className={`p-1.5 rounded-full transition-colors ${
              mediaEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'text-cyan-500/40 hover:text-cyan-400'
            }`}
          >
            <Play size={16} />
          </button>
          <ExternalLink size={16} className="text-cyan-500/40" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-4 rounded-lg backdrop-blur-sm ${
                message.sender === 'user' 
                  ? 'ml-auto bg-cyan-500/10 border border-cyan-500/30 max-w-[80%]' 
                  : 'bg-purple-500/10 border border-purple-500/30 max-w-[80%]'
              }`}
            >
              <p className="text-white/90">{message.content}</p>
              {message.personality_updates && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 text-sm"
                >
                  {message.personality_updates.map((update, i) => (
                    <div 
                      key={i}
                      className="flex items-center space-x-2 text-cyan-400/60"
                    >
                      <span>{update.trait}:</span>
                      <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${update.value * 100}%` }}
                          className="h-full bg-cyan-500/40"
                        />
                      </div>
                      <span>{(update.value * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-2, 2, -2],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 rounded-full bg-cyan-500"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-cyan-500/30 bg-black/40">
        <textarea
          className="w-full p-3 rounded-lg bg-black/60 border border-cyan-500/30 
                     text-cyan-100 placeholder-cyan-500/40 resize-none focus:outline-none 
                     focus:border-cyan-500/60 transition-colors"
          placeholder="Enter neural transmission..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};