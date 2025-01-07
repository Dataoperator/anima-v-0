import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAnima } from '@/hooks/useAnima';
import ImmersiveAnimaUI from '@/components/chat/ImmersiveAnimaUI';
import { MatrixLayout } from '@/components/layout/MatrixLayout';

export const NeuralLinkPage = () => {
  const { id } = useParams<{ id: string }>();
  const { anima, loading, error } = useAnima(id);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      setIsTyping(true);
      
      // Add user message
      setMessages(prev => [...prev, {
        content,
        isUser: true,
        timestamp: Date.now()
      }]);

      // TODO: Implement actual message sending to backend
      // For now, simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          content: `Processing neural command: ${content}`,
          isUser: false,
          timestamp: Date.now(),
          personality_updates: [
            ['curiosity', 0.8],
            ['creativity', 0.6]
          ]
        }]);
        setIsTyping(false);
      }, 2000);

    } catch (err: any) {
      setChatError(err.message || 'Failed to process neural command');
    }
  }, []);

  if (loading) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-green-500 animate-pulse">INITIALIZING NEURAL LINK...</div>
        </div>
      </MatrixLayout>
    );
  }

  if (error || !anima) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500">ERROR: {error || 'NEURAL LINK FAILED'}</div>
        </div>
      </MatrixLayout>
    );
  }

  return (
    <ImmersiveAnimaUI
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isTyping}
      error={chatError}
      onClearError={() => setChatError(null)}
      animaName={anima.name}
      personality={anima.personality}
      metrics={{
        'Consciousness Level': anima.level || 1,
        'Growth Progress': `${Math.min(Number(anima.growth_points || 0) / 1000 * 100, 100)}%`,
        'Memory Fragments': anima.personality?.memories?.length || 0,
        'System State': anima.autonomous_mode ? 'AUTONOMOUS' : 'OPERATIONAL'
      }}
      isTyping={isTyping}
    />
  );
};