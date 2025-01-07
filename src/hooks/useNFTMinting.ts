import { useState } from 'react';
import { useWallet } from './useWallet';
import { useQuantum } from './useQuantum';

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
  const { wallet, animaActor } = useWallet();
  const { quantumState } = useQuantum();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftInfo, setNftInfo] = useState<NFTInfo | null>(null);

  const mint = async (params: MintParams) => {
    if (!wallet?.principal || !animaActor) {
      throw new Error('Wallet not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Transfer ANIMA tokens to minting contract
      const transferResult = await animaActor.icrc1_transfer({
        from: { owner: wallet.principal, subaccount: [] },
        to: { owner: Principal.fromText(process.env.NFT_MINTING_ADDRESS || ''), subaccount: [] },
        amount: params.cost,
        fee: [],
        memo: [],
        created_at_time: []
      });

      if ('Err' in transferResult) {
        throw new Error('Token transfer failed');
      }

      // Generate NFT traits based on quantum coherence
      const traits = generateTraits(params.coherence, params.estimatedPower);

      // Mint NFT with quantum properties
      const result = await animaActor.mint_nft({
        owner: wallet.principal,
        quantum_coherence: params.coherence,
        power: params.estimatedPower,
        traits
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
    if (!wallet?.principal || !animaActor || !quantumState) {
      throw new Error('Wallet or quantum state not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate evolution cost based on current power
      const nft = await animaActor.get_nft(tokenId);
      if ('Err' in nft) {
        throw new Error('NFT not found');
      }

      const evolutionCost = calculateEvolutionCost(nft.Ok.power);

      // Transfer ANIMA tokens
      await animaActor.icrc1_transfer({
        from: { owner: wallet.principal, subaccount: [] },
        to: { owner: Principal.fromText(process.env.NFT_EVOLUTION_ADDRESS || ''), subaccount: [] },
        amount: evolutionCost,
        fee: [],
        memo: [],
        created_at_time: []
      });

      // Evolve NFT with quantum boost
      const result = await animaActor.evolve_nft({
        token_id: tokenId,
        quantum_coherence: quantumState.coherence
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
    if (!wallet?.principal || !animaActor || !quantumState) {
      throw new Error('Wallet or quantum state not initialized');
    }

    if (tokenIds.length !== 2) {
      throw new Error('Merging requires exactly 2 NFTs');
    }

    setIsLoading(true);
    setError(null);

    try {
      const mergeCost = calculateMergeCost();

      // Transfer ANIMA tokens
      await animaActor.icrc1_transfer({
        from: { owner: wallet.principal, subaccount: [] },
        to: { owner: Principal.fromText(process.env.NFT_MERGE_ADDRESS || ''), subaccount: [] },
        amount: mergeCost,
        fee: [],
        memo: [],
        created_at_time: []
      });

      // Merge NFTs with quantum enhancement
      const result = await animaActor.merge_nfts({
        token_ids: tokenIds,
        quantum_coherence: quantumState.coherence
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
    if (!wallet?.principal || !animaActor || !quantumState) {
      throw new Error('Wallet or quantum state not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const splitCost = calculateSplitCost();

      // Transfer ANIMA tokens
      await animaActor.icrc1_transfer({
        from: { owner: wallet.principal, subaccount: [] },
        to: { owner: Principal.fromText(process.env.NFT_SPLIT_ADDRESS || ''), subaccount: [] },
        amount: splitCost,
        fee: [],
        memo: [],
        created_at_time: []
      });

      // Split NFT with quantum-based trait distribution
      const result = await animaActor.split_nft({
        token_id: tokenId,
        quantum_coherence: quantumState.coherence
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
    return 2000n; // Base merge cost
  };

  const calculateSplitCost = (): bigint => {
    return 1500n; // Base split cost
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
    isLoading,
    error
  };
};

export default useNFTMinting;