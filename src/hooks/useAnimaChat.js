import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

export const useAnimaChat = (actor, identity) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const sendMessage = useCallback(async (content) => {
    if (!actor || !identity) {
      setError('Not connected to Anima');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      
      // Add user message immediately for better UX
      const userMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, userMessage]);

      const result = await actor.interact(principal, content);
      
      if ('Ok' in result) {
        const response = result.Ok;
        const animaMessage = {
          id: `anima-${Date.now()}`,
          content: response.response,
          sender: 'anima',
          timestamp: Date.now(),
          personality_updates: response.personality_updates || [],
          memory: response.memory
        };

        setMessages(prev => [...prev, animaMessage]);
        setRetryCount(0);
      } else {
        throw new Error(result.Err || 'Failed to get response from Anima');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [actor, identity]);

  return {
    messages,
    isLoading,
    error,
    retryCount,
    sendMessage,
  };
};

export default useAnimaChat;