import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import ImmersiveAnimaUI from './ImmersiveAnimaUI';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Personality {
  traits: [string, number][];
}

interface Metrics {
  [key: string]: string | number;
}

const AnimaChat: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({});

  useEffect(() => {
    if (actor && identity) {
      loadChatHistory();
      loadMetrics();
    }
  }, [actor, identity]);

  const loadChatHistory = async () => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const history = await actor.get_chat_history(principal);
      setMessages(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history');
    }
  };

  const loadMetrics = async () => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const userMetrics = await actor.get_user_metrics(principal);
      setMetrics({
        'Total Interactions': userMetrics.total_interactions,
        'Response Time': `${userMetrics.avg_response_time.toFixed(2)}s`,
        'Engagement Score': `${(userMetrics.engagement_score * 100).toFixed(1)}%`,
        'Learning Rate': `${(userMetrics.learning_rate * 100).toFixed(1)}%`
      });
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!actor || !identity) return;

    setIsLoading(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      const response = await actor.process_message({
        principal,
        content,
        timestamp: BigInt(Date.now())
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newMessage]);
      await loadMetrics(); // Refresh metrics after interaction
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Default personality traits
  const personality: Personality = {
    traits: [
      ['Curiosity', 0.8],
      ['Empathy', 0.7],
      ['Creativity', 0.9],
      ['Logic', 0.85],
      ['Humor', 0.6],
    ]
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Please connect your Internet Identity to continue</p>
      </div>
    );
  }

  return (
    <ImmersiveAnimaUI
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
      animaName="Living NFT ✨"
      personality={personality}
      metrics={metrics}
      isTyping={isLoading}
    />
  );
};

export default AnimaChat;