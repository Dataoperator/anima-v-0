import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as AnimaService } from '../declarations/anima/anima.did';
import { AnimaConfig, MintingResult } from '../types/anima';
import { QuantumState } from '../quantum/types';
import { createActor } from '../utils/createActor';

export interface MintingOptions {
  name: string;
  quantumConfig: {
    coherenceThreshold: number;
    stabilityRequired: boolean;
    dimensionalSync: boolean;
    patternResonance: boolean;
  };
  genesisConfig: {
    ritualCompleted: boolean;
    designationSource: string;
    neuralPathways: boolean;
    ghostIntegration: boolean;
  };
}

export class AnimaClient {
  private actor: ActorSubclass<AnimaService> | null = null;

  async initialize(identity: Principal) {
    this.actor = await createActor<AnimaService>('anima', identity);
  }

  async mintAnima(identity: Principal, options: MintingOptions): Promise<MintingResult> {
    if (!this.actor) {
      await this.initialize(identity);
    }

    try {
      // Initialize and validate quantum state
      const quantumState = await this.initializeQuantumState(options.quantumConfig);
      if (!quantumState) {
        throw new Error('Failed to initialize quantum state');
      }

      // Verify payment requirements
      const { paymentRequired, fee } = await this.actor!.getMintingRequirements();
      if (paymentRequired) {
        await this.verifyPayment(identity, fee);
      }

      // Execute minting with retry logic
      const result = await this.executeWithRetry(async () => {
        return await this.actor!.mintAnima({
          owner: identity,
          name: options.name,
          quantumState: quantumState,
          config: {
            ...options.genesisConfig,
            timestamp: BigInt(Date.now()),
            dimensionalAlignment: true,
          }
        });
      }, 3);

      // Verify minting success
      if (!result.ok) {
        throw new Error(result.err);
      }

      // Initialize neural pathways
      await this.initializeNeuralPathways(result.ok.tokenId, options.genesisConfig);

      return result.ok;

    } catch (error) {
      console.error('Minting failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown minting error');
    }
  }

  private async initializeQuantumState(config: MintingOptions['quantumConfig']): Promise<QuantumState> {
    if (!this.actor) throw new Error('Actor not initialized');

    const state = await this.actor.initializeQuantumState({
      coherenceThreshold: config.coherenceThreshold,
      requireStability: config.stabilityRequired,
      dimensionalSyncEnabled: config.dimensionalSync,
      resonanceRequired: config.patternResonance
    });

    if (!state.ok) {
      throw new Error(`Quantum state initialization failed: ${state.err}`);
    }

    return state.ok;
  }

  private async verifyPayment(identity: Principal, amount: bigint): Promise<void> {
    if (!this.actor) throw new Error('Actor not initialized');

    const verified = await this.actor.verifyPayment(identity, amount);
    if (!verified) {
      throw new Error('Payment verification failed');
    }
  }

  private async initializeNeuralPathways(tokenId: bigint, config: MintingOptions['genesisConfig']): Promise<void> {
    if (!this.actor) throw new Error('Actor not initialized');

    await this.actor.initializeNeuralPathways({
      tokenId,
      pathwaysEnabled: config.neuralPathways,
      ghostIntegration: config.ghostIntegration
    });
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }
}

export const createAnimaClient = async (identity: Principal): Promise<AnimaClient> => {
  const client = new AnimaClient();
  await client.initialize(identity);
  return client;
};

export const mintAnima = async (
  identity: Principal,
  options: MintingOptions
): Promise<MintingResult> => {
  const client = await createAnimaClient(identity);
  return await client.mintAnima(identity, options);
};