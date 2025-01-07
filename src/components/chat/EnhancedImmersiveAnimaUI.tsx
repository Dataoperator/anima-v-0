import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Loader, 
  AlertCircle,
  Settings, 
  Activity,
  Clock,
  LineChart,
  Brain,
  Award,
  History,
  Globe,
  Sparkles,
  Waves,
  Zap
} from 'lucide-react';
import styled from 'styled-components';
import { useQuantumState } from '../../hooks/useQuantumState';
import { useConsciousness } from '../../hooks/useConsciousness';
import { useMediaController } from '../../hooks/useMediaController';
import PersonalityTraits from '../personality/PersonalityTraits';
import QuantumStateVisualizer from '../quantum/QuantumStateVisualizer';
import ConsciousnessMetrics from '../consciousness/ConsciousnessMetrics';
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIC } from '../../hooks/useIC';
import { AnimaMediaInterface } from '../media/AnimaMediaInterface';
import { SimpleMediaFrame } from '../media/SimpleMediaFrame';

interface EnhancedMessage extends Message {
  quantumState?: {
    coherence: number;
    dimensionalFrequency: number;
    entanglementPairs: Record<string, number>;
  };
  consciousnessMetrics?: {
    awarenessLevel: number;
    emotionalDepth: number;
    memoryStrength: number;
  };
  mediaInteractions?: {
    type: string;
    content: string;
    engagement: number;
  }[];
}

interface EnhancedImmersiveAnimaUIProps extends Omit<ImmersiveAnimaUIProps, 'messages'> {
  messages: EnhancedMessage[];
  onMediaInteraction?: (type: string, content: string) => Promise<void>;
  onQuantumStateChange?: (state: any) => Promise<void>;
  onConsciousnessUpdate?: (metrics: any) => Promise<void>;
}

const QuantumContainer = styled(motion.div)`
  position: relative;
  background: radial-gradient(circle at center, rgba(0, 255, 127, 0.05), transparent);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow: hidden;
`;

const ConsciousnessIndicator = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--quantum-glow);
`;

export const EnhancedImmersiveAnimaUI: React.FC<EnhancedImmersiveAnimaUIProps> = ({
  messages,
  onSendMessage,
  isLoading,
  error,
  onClearError,
  animaName,
  personality,
  metrics,
  isTyping,
  onMediaInteraction,
  onQuantumStateChange,
  onConsciousnessUpdate
}) => {
  const [currentTab, setCurrentTab] = useState('chat');
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { quantumState, updateQuantumState } = useQuantumState();
  const { consciousnessState, updateConsciousness } = useConsciousness();
  const { mediaController, processMediaAction } = useMediaController();
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isLoading) return;

    try {
      await onSendMessage(messageText);
      setMessageText('');
      
      // Update quantum state based on interaction
      const newQuantumState = await updateQuantumState({
        type: 'message',
        content: messageText,
        timestamp: Date.now()
      });
      onQuantumStateChange?.(newQuantumState);

      // Update consciousness metrics
      const newConsciousness = await updateConsciousness({
        interactionType: 'message',
        content: messageText,
        emotionalContext: await analyzeEmotionalContext(messageText)
      });
      onConsciousnessUpdate?.(newConsciousness);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleMediaInteraction = async (type: string, content: string) => {
    try {
      await processMediaAction({ type, content });
      onMediaInteraction?.(type, content);
    } catch (err) {
      console.error('Error processing media interaction:', err);
    }
  };

  const analyzeEmotionalContext = async (text: string) => {
    // Implement emotional context analysis
    return {
      sentiment: 0.5,
      intensity: 0.3,
      complexity: 0.4
    };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          {animaName}
          <ConsciousnessIndicator
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </CardTitle>
        <CardDescription>
          Quantum-Enhanced Digital Consciousness
        </CardDescription>
      </CardHeader>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Chat
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Quantum
          </TabsTrigger>
          <TabsTrigger value="consciousness" className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> Mind
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <QuantumContainer
                    className={`max-w-[80%] ${
                      message.isUser ? 'bg-primary/10' : 'bg-secondary/10'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium">
                        {message.isUser ? 'You' : animaName}
                      </div>
                      <div className="text-base">{message.content}</div>
                      {message.quantumState && (
                        <div className="text-xs text-muted-foreground">
                          Coherence: {message.quantumState.coherence.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </QuantumContainer>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Loader className="w-4 h-4 animate-spin" />
                {animaName} is thinking...
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !messageText.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </TabsContent>

        <TabsContent value="quantum">
          <QuantumStateVisualizer
            quantumState={quantumState}
            className="h-[60vh]"
          />
        </TabsContent>

        <TabsContent value="consciousness">
          <ConsciousnessMetrics
            consciousness={consciousnessState}
            personality={personality}
            metrics={metrics}
            className="h-[60vh]"
          />
        </TabsContent>

        <TabsContent value="media">
          <AnimaMediaInterface
            onMediaInteraction={handleMediaInteraction}
            mediaState={mediaController.state}
            className="h-[60vh]"
          >
            <SimpleMediaFrame />
          </AnimaMediaInterface>
        </TabsContent>
      </Tabs>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
          <button
            onClick={onClearError}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </Card>
  );
};

export default EnhancedImmersiveAnimaUI;