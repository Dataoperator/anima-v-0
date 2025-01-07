import { HttpAgent, Actor, Identity } from '@dfinity/agent';
import { idlFactory } from '@/declarations/anima';
import type { _SERVICE } from '@/declarations/anima/anima.did';
import type { ActorSubclass } from '@dfinity/agent';
import { CANISTER_IDS, NETWORK_CONFIG } from '@/config';

export const createAnimaActor = async (identity: Identity): Promise<ActorSubclass<_SERVICE>> => {
  const canisterId = CANISTER_IDS.anima;
  
  if (!canisterId) {
    throw new Error('Anima canister ID not found. Please check your configuration.');
  }

  const agent = new HttpAgent({
    identity,
    host: NETWORK_CONFIG.host
  });

  // Only fetch root key in local development
  if (NETWORK_CONFIG.isLocal) {
    await agent.fetchRootKey().catch(e => {
      console.warn('Failed to fetch root key (this is expected in production):', e);
    });
  }

  try {
    console.log('Creating actor with canister ID:', canisterId);
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });

    // Verify actor creation with a query method
    try {
      await actor.get_user_animas();
      console.log('Actor verification successful');
    } catch (e) {
      console.warn('Actor verification failed:', e);
    }

    return actor;
  } catch (error) {
    console.error('Failed to create actor:', error);
    throw error;
  }
};