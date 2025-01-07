import { createActor } from './anima';
import { canisterId } from '../config/canisterEnv';

export const initializeCanister = async () => {
  try {
    return await createActor(canisterId, {
      agentOptions: {
        host: 'https://icp0.io',
      },
    });
  } catch (error) {
    console.error('Failed to initialize canister:', error);
    throw error;
  }
};

export * from './anima';