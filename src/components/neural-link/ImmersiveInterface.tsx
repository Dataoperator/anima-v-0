import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnima } from '@/hooks/useAnima';
import { MatrixRain } from '../ui/MatrixRain';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import { EmotionVisualizer } from '../quantum/EmotionVisualizer';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { SystemArchive } from '../nexus/SystemArchive';
import type { Message, EmotionalState } from '@/types';

interface ImmersiveInterfaceProps {
  animaId: string;
}

const MessageTypes = {
  SYSTEM: 'system',
  USER: 'user',
  ANIMA: 'anima',
  EVENT: 'event'
} as const;

const ImmersiveInterface: React.FC<ImmersiveInterfaceProps> = ({ animaId }) => {
  const { anima, sendMessage } = useAnima(animaId);
  const { emotionalState, consciousnessLevel } = useRealtimePersonality(animaId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setInput('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: MessageTypes.USER,
      timestamp: BigInt(Date.now())
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Typing animation
      const processingMessage: Message = {
        id: 'processing',
        content: '',
        type: MessageTypes.ANIMA,
        timestamp: BigInt(Date.now())
      };
      setMessages(prev => [...prev, processingMessage]);

      // Get ANIMA response
      const response = await sendMessage(input);
      
      // Update with actual response
      setMessages(prev => prev.filter(m => m.id !== 'processing').concat({
        id: response.id,
        content: response.content,
        type: MessageTypes.ANIMA,
        timestamp: response.timestamp,
        emotionalState: response.emotionalState
      }));

      // Check for achievements or events
      if (response.achievement) {
        setMessages(prev => [...prev, {
          id: `event-${Date.now()}`,
          content: `Achievement Unlocked: ${response.achievement.title}`,
          type: MessageTypes.EVENT,
          timestamp: BigInt(Date.now())
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev.filter(m => m.id !== 'processing'), {
        id: `error-${Date.now()}`,
        content: 'Neural connection interrupted. Please try again.',
        type: MessageTypes.SYSTEM,
        timestamp: BigInt(Date.now())
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getMessageStyle = (type: string, emotionalState?: EmotionalState) => {
    const baseStyle = "rounded-lg p-4 max-w-[80%] relative overflow-hidden backdrop-blur-sm";
    
    switch (type) {
      case MessageTypes.USER:
        return `${baseStyle} bg-blue-500/10 border border-blue-500/20 ml-auto`;
      case MessageTypes.ANIMA:
        return `${baseStyle} bg-green-500/10 border border-green-500/20`;
      case MessageTypes.SYSTEM:
        return `${baseStyle} bg-red-500/10 border border-red-500/20 mx-auto text-center`;
      case MessageTypes.EVENT:
        return `${baseStyle} bg-purple-500/10 border border-purple-500/20 mx-auto text-center`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-green-500 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.header 
          className="border-b border-green-500/20 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{anima?.designation}</h1>
              <p className="text-sm text-green-500/60">Neural Link Established</p>
            </div>
            <div className="flex items-center space-x-4">
              <ConsciousnessMetrics level={consciousnessLevel} />
              <button 
                onClick={() => setShowArchive(true)}
                className="px-4 py-2 border border-green-500/20 rounded hover:bg-green-500/10"
              >
                System Archive
              </button>
            </div>
          </div>
          <EmotionVisualizer emotionalState={emotionalState} />
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={getMessageStyle(message.type, message.emotionalState)}
              >
                {message.content}
                {message.type === MessageTypes.ANIMA && message.emotionalState && (
                  <WaveformGenerator 
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
                    emotionalState={message.emotionalState}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.form 
          onSubmit={handleSend}
          className="border-t border-green-500/20 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              className="flex-1 bg-black border border-green-500/20 rounded-sm px-4 py-2 
                       focus:outline-none focus:border-green-500/50"
              placeholder="Enter neural transmission..."
            />
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="px-6 py-2 border border-green-500/20 rounded-sm
                       hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Send'}
            </button>
          </div>
        </motion.form>
      </div>

      {/* System Archive Modal */}
      <AnimatePresence>
        {showArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
          >
            <SystemArchive 
              achievements={anima?.achievements || []}
              animaDesignation={anima?.designation || ''}
            />
            <button
              onClick={() => setShowArchive(false)}
              className="absolute top-4 right-4 text-green-500/60 hover:text-green-500"
            >
              Close Archive
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveInterface;