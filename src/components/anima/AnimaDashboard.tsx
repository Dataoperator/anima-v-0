import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import InitializationFlow from './InitializationFlow';
import AnimaChat from '../chat/AnimaChat';
import { Principal } from '@dfinity/principal';

interface UserState {
  NotInitialized?: null;
  Initialized?: {
    quantum_state: any; // Define proper type based on your canister
    personality_traits: any; // Define proper type
  };
}

const AnimaDashboard: React.FC = () => {
  const { actor, identity, isAuthenticated, login } = useIC();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) {
        setLoading(false);
        return;
      }

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_user_state([principal]);
        setInitialized(!('NotInitialized' in state));
      } catch (err) {
        console.error('Error checking initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, [actor, identity]);

  const handleLogin = async () => {
    if (!isAuthenticated) {
      await login();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Welcome to ANIMA</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect with Internet Identity
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
          <div className="absolute inset-4 rounded-full border border-blue-400/50 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-900">
        <InitializationFlow onInitialized={() => setInitialized(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimaChat />
    </div>
  );
};

export default AnimaDashboard;