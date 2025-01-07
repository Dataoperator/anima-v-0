import { useCallback } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useAuth } from './useAuth';
import { canisterId, createActor } from '../declarations/anima';

export const useActor = () => {
  const { identity } = useAuth();

  const getActor = useCallback(async () => {
    if (!identity) {
      throw new Error('No identity available');
    }

    const agent = new HttpAgent({ identity });

    // Only fetch root key in development
    if (process.env.NODE_ENV !== 'production') {
      await agent.fetchRootKey();
    }

    return createActor(canisterId, {
      agent,
    });
  }, [identity]);

  return {
    getActor,
  };
};

export default useActor;