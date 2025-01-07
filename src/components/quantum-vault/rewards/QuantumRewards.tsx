import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Trophy,
  TrendingUp,
  Timer,
  BarChart3,
  Atom,
  Dna,
  Network
} from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { useQuantum } from '@/hooks/useQuantum';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { QuantumCoherenceGauge } from '../QuantumCoherenceGauge';
import { RewardProgressRing } from './RewardProgressRing';

const RewardMetricCard: React.FC<{
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, maxValue, icon, color }) => (
  <Card className="p-4 bg-black/30 backdrop-blur border border-opacity-20" style={{ borderColor: color }}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium" style={{ color }}>
        {title}
      </h3>
      {icon}
    </div>
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  </Card>
);

export const QuantumRewards: React.FC = () => {
  const { quantumState } = useQuantum();
  const { 
    metrics,
    potentialRewards,
    claimRewards,
    isLoading,
    error 
  } = useRewards();

  const [claimableAmount, setClaimableAmount] = useState<string>('0');
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);

  useEffect(() => {
    if (metrics && potentialRewards) {
      const amount = potentialRewards.toString();
      setClaimableAmount(amount);
    }
  }, [metrics, potentialRewards]);

  const handleClaim = async () => {
    try {
      setShowClaimAnimation(true);
      await claimRewards();
      setTimeout(() => setShowClaimAnimation(false), 2000);
    } catch (err) {
      console.error('Claim failed:', err);
      setShowClaimAnimation(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Quantum Particles Effect */}
      <AnimatePresence>
        {showClaimAnimation && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-500 rounded-full"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: 2,
                  opacity: 0
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reward Display */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-400 flex items-center">
            <Trophy className="w-6 h-6 mr-2" />
            Quantum Rewards
          </h2>
          <QuantumCoherenceGauge value={quantumState?.coherence || 0} size="lg" />
        </div>

        <div className="flex justify-center mb-8">
          <RewardProgressRing
            value={metrics?.participation_score || 0}
            size={200}
            strokeWidth={10}
            animationDuration={2}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {claimableAmount}
              </div>
              <div className="text-sm text-gray-400">ANIMA</div>
            </div>
          </RewardProgressRing>
        </div>

        <Button
          onClick={handleClaim}
          disabled={isLoading || !metrics || Number(claimableAmount) === 0}
          className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                   hover:from-purple-500/30 hover:to-blue-500/30 
                   border border-purple-500/30"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin mr-2" />
              Claiming...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Claim Rewards
            </>
          )}
        </Button>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RewardMetricCard
          title="Quantum Coherence"
          value={metrics?.quantum_coherence || 0}
          maxValue={1}
          icon={<Atom className="w-4 h-4 text-cyan-400" />}
          color="#22d3ee"
        />

        <RewardMetricCard
          title="Participation Score"
          value={metrics?.participation_score || 0}
          maxValue={1}
          icon={<BarChart3 className="w-4 h-4 text-green-400" />}
          color="#4ade80"
        />

        <RewardMetricCard
          title="NFT Power"
          value={metrics?.nft_power || 0}
          maxValue={1}
          icon={<Dna className="w-4 h-4 text-purple-400" />}
          color="#a855f7"
        />

        <RewardMetricCard
          title="Staking Duration"
          value={(metrics?.staking_duration || 0) / (30 * 24 * 60 * 60 * 1_000_000_000)}
          maxValue={1}
          icon={<Timer className="w-4 h-4 text-amber-400" />}
          color="#fbbf24"
        />

        <RewardMetricCard
          title="Network Contribution"
          value={metrics?.network_contribution || 0}
          maxValue={1}
          icon={<Network className="w-4 h-4 text-blue-400" />}
          color="#60a5fa"
        />
      </div>

      {/* Bonus Multipliers */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-green-500/20">
        <h3 className="text-lg font-medium text-green-400 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Reward Multipliers
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Base Rate</span>
            <span className="text-green-400">1.0x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Coherence Bonus</span>
            <span className="text-cyan-400">
              +{((metrics?.quantum_coherence || 0) * 2).toFixed(2)}x
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Participation Bonus</span>
            <span className="text-purple-400">
              +{((metrics?.participation_score || 0) * 1.5).toFixed(2)}x
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">NFT Power Bonus</span>
            <span className="text-amber-400">
              +{((metrics?.nft_power || 0) * 0.2).toFixed(2)}x
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Network Bonus</span>
            <span className="text-blue-400">
              +{((metrics?.network_contribution || 0) * 0.3).toFixed(2)}x
            </span>
          </div>
          <div className="pt-3 border-t border-green-500/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-green-400">Total Multiplier</span>
              <span className="text-lg font-medium text-green-400">
                {calculateTotalMultiplier(metrics).toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const calculateTotalMultiplier = (metrics: any) => {
  if (!metrics) return 1;
  
  return 1 + 
    (metrics.quantum_coherence * 2) +
    (metrics.participation_score * 1.5) +
    (metrics.nft_power * 0.2) +
    (metrics.network_contribution * 0.3);
};

export default QuantumRewards;