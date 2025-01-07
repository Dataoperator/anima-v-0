import { useState, useCallback } from 'react';
import { Actor, Identity } from '@dfinity/agent';
import { ChatMessage, PersonalityUpdate, Memory } from '@/types/chat';
import { WebSocketError } from '@/types/realtime';

interface UseAnimaChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: WebSocketError | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export const useAnimaChat = (actor: Actor | null, identity: Identity | null) => {
  const [state, setState] = useState<UseAnimaChatState>({
    messages: [],
    isLoading: false,
    error: null,
    retryCount: 0
  });

  const resetRetryCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: 0
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!actor || !identity) {
      setState(prev => ({
        ...prev,
        error: {
          code: 401,
          message: 'Not connected to Anima'
        }
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const principal = identity.getPrincipal();
      
      // Add user message immediately for better UX
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }));

      const result = await actor.interact(principal, content);
      
      if ('Ok' in result) {
        const response = result.Ok;
        const animaMessage: ChatMessage = {
          id: `anima-${Date.now()}`,
          content: response.response,
          sender: 'anima',
          timestamp: Date.now(),
          personality_updates: response.personality_updates || [],
          memory: response.memory
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, animaMessage],
          isLoading: false,
          retryCount: 0
        }));
      } else {
        throw new Error(result.Err || 'Failed to get response from Anima');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      
      setState(prev => {
        const newCount = prev.retryCount + 1;
        return {
          ...prev,
          error: {
            code: 500,
            message: newCount >= MAX_RETRIES 
              ? 'Connection issues detected. Please refresh the page.'
              : err instanceof Error ? err.message : 'Failed to communicate with Anima'
          },
          retryCount: newCount,
          isLoading: false
        };
      });
    }
  }, [actor, identity]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    retryCount: state.retryCount,
    sendMessage,
    clearError,
    resetRetryCount
  };
};

export default useAnimaChat;