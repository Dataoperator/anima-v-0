import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { canisterId, createActor, idlFactory } from '@/declarations/anima';
import type { _SERVICE as AnimaService } from '@/declarations/anima/anima.did';
import { walletService } from './wallet.service';
import { quantumStateService } from './quantum-state.service';

// Store actor with its identity for validation
let actorCache: {
  actor: AnimaService | null;
  identity: Identity | null;
} = {
  actor: null,
  identity: null
};

export interface MintOptions {
  name?: string;
  metadata?: Record<string, any>;
  quantumConfig?: {
    coherenceThreshold?: number;
    stabilityRequired?: boolean;
  };
}

export interface MintResult {
  tokenId: bigint;
  transactionId: string;
  quantumSignature: string;
  metadata: {
    name: string;
    quantumState: {
      coherence: number;
      resonance: number;
      stability: number;
    };
  };
}

export const getAnimaActor = async (identity?: Identity | null): Promise<AnimaService> => {
  if (!identity) {
    console.error('No identity provided to getAnimaActor');
    throw new Error('Authentication required');
  }

  // Check if we need to invalidate cached actor
  const shouldCreateNewActor = !actorCache.actor || 
    !actorCache.identity ||
    actorCache.identity.getPrincipal().toText() !== identity.getPrincipal().toText();

  if (shouldCreateNewActor) {
    try {
      console.log('Creating new actor with:', {
        canisterId,
        principal: identity.getPrincipal().toText(),
        network: process.env.DFX_NETWORK
      });

      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
          host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : undefined
        }
      });

      // Test actor connection
      try {
        const principal = identity.getPrincipal();
        console.log('Testing actor connection with principal:', principal.toText());
        const testResult = await actor.get_user_animas(principal);
        console.log('Actor test successful, found animas:', testResult);
      } catch (testError) {
        console.error('Actor test failed:', testError);
        throw new Error('Actor validation failed');
      }

      // Cache the working actor
      actorCache = {
        actor,
        identity
      };

      console.log('New actor created and cached successfully');
    } catch (error) {
      console.error('Failed to create actor:', error);
      throw new Error('Failed to initialize connection');
    }
  } else {
    console.log('Using cached actor for principal:', identity.getPrincipal().toText());
  }

  return actorCache.actor!;
};

export const mintAnima = async (
  identity: Identity,
  options: MintOptions = {}
): Promise<MintResult> => {
  try {
    // 1. Verify quantum state and wallet balance
    const quantumMetrics = await quantumStateService.getQuantumMetrics();
    const coherenceThreshold = options.quantumConfig?.coherenceThreshold ?? 0.7;
    
    if (quantumMetrics.coherenceLevel < coherenceThreshold) {
      throw new Error(`Quantum coherence too low (${quantumMetrics.coherenceLevel.toFixed(2)}). Required: ${coherenceThreshold}`);
    }

    if (options.quantumConfig?.stabilityRequired && !await quantumStateService.checkStability(identity)) {
      throw new Error('Quantum state must be stable for minting');
    }

    // 2. Check wallet balance and process payment
    const mintCost = walletService.getMintCost();
    if (!walletService.hasEnoughForMint()) {
      throw new Error(`Insufficient balance. Required: ${Number(mintCost) / 100_000_000} ICP`);
    }

    // 3. Process the minting transaction
    const transaction = await walletService.executeTransaction(
      identity,
      mintCost,
      'mint'
    );

    // 4. Get the Anima actor
    const actor = await getAnimaActor(identity);

    // 5. Generate quantum-enhanced metadata
    const patterns = await quantumStateService.generateNeuralPatterns(identity);
    const metadata = {
      name: options.name || `ANIMA #${Date.now()}`,
      created_at: Date.now(),
      quantum_state: {
        coherence: quantumMetrics.coherenceLevel,
        resonance: patterns.resonance,
        stability: patterns.stability,
      },
      ...options.metadata
    };

    // 6. Call the actor to mint the NFT
    console.log('Minting ANIMA with metadata:', metadata);
    const mintResult = await actor.mint_anima({
      metadata: metadata,
      quantum_signature: transaction.quantum_signature!,
      transaction_id: transaction.id
    });

    console.log('Mint successful:', mintResult);

    // 7. Return the result
    return {
      tokenId: mintResult.token_id,
      transactionId: transaction.id,
      quantumSignature: transaction.quantum_signature!,
      metadata: {
        name: metadata.name,
        quantumState: metadata.quantum_state
      }
    };

  } catch (error) {
    console.error('Minting failed:', error);
    // Attempt to rollback transaction if possible
    throw error instanceof Error ? error : new Error('Minting failed');
  }
};

export const getUserAnimas = async (identity: Identity) => {
  const actor = await getAnimaActor(identity);
  const principal = identity.getPrincipal();
  return actor.get_user_animas(principal);
};

export const getAnimaDetails = async (identity: Identity, tokenId: bigint) => {
  const actor = await getAnimaActor(identity);
  return actor.get_anima_details(tokenId);
};