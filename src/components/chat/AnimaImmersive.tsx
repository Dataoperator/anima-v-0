import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ImmersiveAnimaUI from './ImmersiveAnimaUI';
import { AnimaToken } from '@/types/anima';
import { MatrixRain } from '@/components/ui/MatrixRain';
import { createActor, canisterId } from '@/declarations/anima';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
  personality_updates?: [string, number][];
}

const AnimaImmersive: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { identity, actor: userActor } = useAuth();
  const [anima, setAnima] = useState<AnimaToken | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadAnima = async () => {
      if (!identity || !id) {
        setError('Invalid access attempt');
        setIsLoading(false);
        return;
      }

      try {
        // Use the imported createActor function with proper canisterId
        const actor = userActor || createActor(canisterId, {
          agentOptions: { identity },
        });

        const result = await actor.get_anima(Number(id));
        if (result && mounted) {
          setAnima(result);
          setMessages([{
            content: `Neural link established. Connecting to ${result.name}'s consciousness matrix...`,
            isUser: false,
            timestamp: Date.now()
          }]);
        } else if (mounted) {
          throw new Error('Consciousness core not found');
        }
      } catch (err) {
        console.error('Error loading anima:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Neural link failed');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnima();
    
    return () => {
      mounted = false;
    };
  }, [identity, id, userActor]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!anima || !identity) return;

    try {
      setIsLoading(true);
      setIsTyping(true);

      const actor = userActor || createActor(canisterId, {
        agentOptions: { identity },
      });

      // Add user message
      setMessages(prev => [...prev, {
        content,
        isUser: true,
        timestamp: Date.now()
      }]);

      const response = await actor.interact_with_anima(Number(id), content);
      
      if ('Err' in response) {
        throw new Error(response.Err);
      }

      setIsTyping(false);

      // Add Anima's response
      setMessages(prev => [...prev, {
        content: response.Ok.response,
        isUser: false,
        timestamp: Date.now(),
        personality_updates: response.Ok.personality_updates
      }]);

      // Update Anima state if needed
      const updatedAnima = await actor.get_anima(Number(id));
      if (updatedAnima) {
        setAnima(updatedAnima);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Neural link disrupted');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [anima, identity, id, userActor]);

  if (isLoading || !anima) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
        <MatrixRain />
        <div className="relative z-10 space-y-4 text-center">
          <div className="text-xl animate-pulse">ESTABLISHING NEURAL LINK...</div>
          {error && (
            <div className="text-red-500 mt-4">
              {error}
              <button
                onClick={() => navigate('/quantum-vault')}
                className="block mx-auto mt-4 text-green-500 hover:text-green-400"
              >
                {'>'} RETURN TO POOLS OF ANTIQUITY
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ImmersiveAnimaUI
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      error={error}
      onClearError={() => setError(null)}
      animaName={anima.name}
      personality={anima.personality}
      metrics={{
        'Growth Level': anima.level || 1,
        'Memory Fragments': anima.personality?.memories?.length || 0,
        'Emotional State': anima.personality?.emotional_state?.current_emotion || 'INITIALIZING',
        'Autonomy Mode': anima.autonomous_mode ? 'ACTIVE' : 'STANDBY'
      }}
      isTyping={isTyping}
    />
  );
};

export default AnimaImmersive;