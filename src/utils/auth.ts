import { AuthClient } from '@dfinity/auth-client';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { II_CONFIG, II_URL } from '../ii-config';
import { canisterId, idlFactory } from '../declarations/anima';

// Initialize authentication client
export const initAuth = async (): Promise<AuthClient> => {
  try {
    const client = await AuthClient.create({
      idleOptions: II_CONFIG.idleOptions
    });
    return client;
  } catch (err) {
    console.error('Auth initialization failed:', err);
    throw new Error('Failed to initialize authentication');
  }
};

// Handle login
export const login = async (authClient: AuthClient): Promise<boolean> => {
  return new Promise((resolve) => {
    authClient.login({
      identityProvider: II_URL,
      onSuccess: () => resolve(true),
      onError: () => resolve(false)
    });
  });
};

// Get authenticated identity
export const getAuthenticatedIdentity = (authClient: AuthClient) => {
  if (!authClient.isAuthenticated()) {
    throw new Error('Not authenticated');
  }
  return authClient.getIdentity();
};

// Create actor with authentication
export const createActor = async <T>(canisterName: string, identity: Principal): Promise<ActorSubclass<T>> => {
  const agent = new HttpAgent({ identity });
  
  // Only fetch root key in development
  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  try {
    return Actor.createActor<T>(idlFactory, {
      agent,
      canisterId: canisterId
    });
  } catch (error) {
    console.error(`Failed to create ${canisterName} actor:`, error);
    throw new Error(`Actor creation failed for ${canisterName}`);
  }
};