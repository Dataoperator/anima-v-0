import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuantum } from './useQuantum';
import { useSecureSwap } from './useSecureSwap';
import { animaActorService } from '../services/anima-actor.service';

export interface MintParams {
  coherence: number;
  cost: bigint;
  estimatedPower: number;
}

export interface NFTInfo {
  id: string;
  power: number;
  coherence: number;
  mintTime: Date;
  traits: {
    quantum: number;
    neural: number;
    consciousness: number;
    dimensional: number;
  };
}

export const useNFTMinting = () => {
  const { principal } = useAuth();
  const { quantumState } = useQuantum();
  const { swapICPForANIMA, state: paymentState } = useSecureSwap();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftInfo, setNftInfo] = useState<NFTInfo | null>(null);

  const mint = async (params: MintParams) => {
    if (!principal) {
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Process ICP payment and get ANIMA tokens
      const swapResult = await swapICPForANIMA(Number(params.cost) / 100_000_000);
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Payment failed');
      }

      // Step 2: Get actor interface
      const actor = await animaActorService.createActor();

      // Step 3: Generate NFT traits based on quantum coherence
      const traits = generateTraits(params.coherence, params.estimatedPower);

      // Step 4: Mint NFT with quantum properties and payment verification
      const result = await actor.mint_nft({
        owner: principal,
        quantum_coherence: params.coherence,
        power: params.estimatedPower,
        traits,
        payment_verification: {
          payment_id: swapResult.paymentId,
          transaction_hash: swapResult.txId
        }
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      const newNFT: NFTInfo = {
        id: result.Ok.token_id,
        power: params.estimatedPower,
        coherence: params.coherence,
        mintTime: new Date(),
        traits
      };

      setNftInfo(newNFT);
      return newNFT;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const evolve = async (tokenId: string) => {
    if (!principal || !quantumState) {
      throw new Error('System not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const actor = await animaActorService.createActor();
      
      // Get NFT info
      const nft = await actor.get_nft(tokenId);
      if ('Err' in nft) {
        throw new Error('NFT not found');
      }

      // Calculate evolution cost
      const evolutionCost = calculateEvolutionCost(nft.Ok.power);

      // Process payment
      const swapResult = await swapICPForANIMA(Number(evolutionCost) / 100_000_000);
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Payment failed');
      }

      // Evolve NFT with payment verification
      const result = await actor.evolve_nft({
        token_id: tokenId,
        quantum_coherence: quantumState.coherence,
        payment_verification: {
          payment_id: swapResult.paymentId,
          transaction_hash: swapResult.txId
        }
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evolution failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const merge = async (tokenIds: string[]) => {
    if (!principal || !quantumState) {
      throw new Error('System not initialized');
    }

    if (tokenIds.length !== 2) {
      throw new Error('Merging requires exactly 2 NFTs');
    }

    setIsLoading(true);
    setError(null);

    try {
      const mergeCost = calculateMergeCost();
      const actor = await animaActorService.createActor();

      // Process payment
      const swapResult = await swapICPForANIMA(Number(mergeCost) / 100_000_000);
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Payment failed');
      }

      // Merge NFTs with payment verification
      const result = await actor.merge_nfts({
        token_ids: tokenIds,
        quantum_coherence: quantumState.coherence,
        payment_verification: {
          payment_id: swapResult.paymentId,
          transaction_hash: swapResult.txId
        }
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Merge failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const split = async (tokenId: string) => {
    if (!principal || !quantumState) {
      throw new Error('System not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const splitCost = calculateSplitCost();
      const actor = await animaActorService.createActor();

      // Process payment
      const swapResult = await swapICPForANIMA(Number(splitCost) / 100_000_000);
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Payment failed');
      }

      // Split NFT with payment verification
      const result = await actor.split_nft({
        token_id: tokenId,
        quantum_coherence: quantumState.coherence,
        payment_verification: {
          payment_id: swapResult.paymentId,
          transaction_hash: swapResult.txId
        }
      });

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      return result.Ok;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions remain the same
  const generateTraits = (coherence: number, power: number) => {
    const quantumBoost = Math.max(0, coherence - 0.5) * 2;
    const baseTraitValue = () => Math.random() * (1 + quantumBoost);

    return {
      quantum: Math.min(1, baseTraitValue() * (1 + coherence)),
      neural: Math.min(1, baseTraitValue() * (1 + power)),
      consciousness: Math.min(1, baseTraitValue() * (1 + (coherence + power) / 2)),
      dimensional: Math.min(1, baseTraitValue() * (1 + Math.max(coherence, power)))
    };
  };

  const calculateEvolutionCost = (currentPower: number): bigint => {
    const baseCost = 500n;
    const powerMultiplier = BigInt(Math.floor(currentPower * 1000));
    return baseCost + (baseCost * powerMultiplier) / 1000n;
  };

  const calculateMergeCost = (): bigint => {
    return 2000n;
  };

  const calculateSplitCost = (): bigint => {
    return 1500n;
  };

  const getTraitName = (value: number): string => {
    if (value >= 0.9) return 'Legendary';
    if (value >= 0.7) return 'Epic';
    if (value >= 0.5) return 'Rare';
    if (value >= 0.3) return 'Uncommon';
    return 'Common';
  };

  const getTraitColor = (value: number): string => {
    if (value >= 0.9) return 'text-yellow-400';
    if (value >= 0.7) return 'text-purple-400';
    if (value >= 0.5) return 'text-blue-400';
    if (value >= 0.3) return 'text-green-400';
    return 'text-gray-400';
  };

  return {
    mint,
    evolve,
    merge,
    split,
    generateTraits,
    getTraitName,
    getTraitColor,
    nftInfo,
    isLoading: isLoading || paymentState.status !== 'idle',
    error: error || paymentState.error
  };
};

export default useNFTMinting;