import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory, canisterId } from '../declarations/anima';

export async function createActor<T>(canisterName: string, identity: Principal): Promise<ActorSubclass<T>> {
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
}