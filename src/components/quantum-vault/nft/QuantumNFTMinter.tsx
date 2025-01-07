import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Dna,
  Atom,
  Waves,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useQuantum } from '@/hooks/useQuantum';
import { useWallet } from '@/hooks/useWallet';
import { useNFTMinting } from '@/hooks/useNFTMinting';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QuantumCoherenceGauge } from '../QuantumCoherenceGauge';
import { DataStream } from '@/components/ui/DataStream';

const MINT_BASE_COST = 1000n;
const MIN_COHERENCE = 0.5;

export const QuantumNFTMinter: React.FC = () => {
  const { quantumState } = useQuantum();
  const { wallet } = useWallet();
  const { 
    mint,
    evolve,
    merge,
    split,
    nftInfo,
    isLoading,
    error 
  } = useNFTMinting();

  const [coherenceBoost, setCoherenceBoost] = useState(0);
  const [estimatedPower, setEstimatedPower] = useState(0);
  const [mintCost, setMintCost] = useState(MINT_BASE_COST);

  useEffect(() => {
    if (quantumState) {
      const boost = Math.max(0, quantumState.coherence - MIN_COHERENCE) * 2;
      setCoherenceBoost(boost);
      setEstimatedPower(calculateNFTPower(quantumState.coherence));
      setMintCost(calculateMintCost(quantumState.coherence));
    }
  }, [quantumState]);

  const calculateNFTPower = (coherence: number): number => {
    const baseRarity = Math.random();
    const coherenceBonus = Math.max(0, coherence - MIN_COHERENCE) * 2;
    return Math.min(1, baseRarity * (1 + coherenceBonus));
  };

  const calculateMintCost = (coherence: number): bigint => {
    const coherenceDiscount = Math.max(0, 1 - (coherence - MIN_COHERENCE));
    return MINT_BASE_COST + BigInt(Math.floor(Number(MINT_BASE_COST) * coherenceDiscount));
  };

  const handleMint = async () => {
    if (!quantumState || quantumState.coherence < MIN_COHERENCE) {
      return;
    }

    try {
      await mint({
        coherence: quantumState.coherence,
        cost: mintCost,
        estimatedPower
      });
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  return (
    <div className="relative space-y-6">
      <DataStream className="absolute inset-0 opacity-5" />

      {/* Quantum Requirements */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-cyan-500/20">
        <h3 className="text-lg font-medium text-cyan-400 mb-4 flex items-center">
          <Atom className="w-5 h-5 mr-2" />
          Quantum State Requirements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Coherence</span>
              <QuantumCoherenceGauge value={quantumState?.coherence || 0} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Minimum Required</span>
              <QuantumCoherenceGauge value={MIN_COHERENCE} />
            </div>
            {quantumState?.coherence < MIN_COHERENCE && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Insufficient Coherence</AlertTitle>
                <AlertDescription>
                  Quantum coherence must be at least {(MIN_COHERENCE * 100).toFixed(0)}% to mint NFTs.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Coherence Boost</span>
              <span className="text-cyan-400">+{(coherenceBoost * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Power</span>
              <span className="text-purple-400">{(estimatedPower * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mint Cost</span>
              <span className="text-green-400">{mintCost.toString()} ANIMA</span>
            </div>
          </div>
        </div>
      </Card>

      {/* NFT Preview */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-purple-500/20">
        <h3 className="text-lg font-medium text-purple-400 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          NFT Preview
        </h3>

        <div className="relative aspect-square w-full max-w-md mx-auto border-2 border-purple-500/30 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Dna className="w-20 h-20 text-purple-400 animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">Quantum Power</div>
              <div className="flex items-center">
                <Waves className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-purple-400">{(estimatedPower * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Minting Controls */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-green-500/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-green-400 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Mint Quantum NFT
          </h3>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">{mintCost.toString()} ANIMA</span>
          </div>
        </div>

        <Button
          onClick={handleMint}
          disabled={
            isLoading || 
            !quantumState || 
            quantumState.coherence < MIN_COHERENCE ||
            !wallet?.balances?.anima || 
            wallet.balances.anima < mintCost
          }
          className="w-full bg-gradient-to-r from-green-500/20 to-blue-500/20 
                     hover:from-green-500/30 hover:to-blue-500/30 
                     border border-green-500/30"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin mr-2" />
              Minting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Mint NFT
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default QuantumNFTMinter;