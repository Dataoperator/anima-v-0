import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  TrendingUp,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useQuantum } from '@/hooks/useQuantum';
import { useStaking } from '@/hooks/useStaking';
import { useWallet } from '@/hooks/useWallet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QuantumCoherenceGauge } from '@/components/ui/QuantumCoherenceGauge';
import { DataStream } from '@/components/ui/DataStream';

const MIN_STAKE = 100n;
const LOCK_PERIODS = [
  { days: 7, bonus: 0.0 },
  { days: 30, bonus: 0.1 },
  { days: 90, bonus: 0.25 },
  { days: 180, bonus: 0.5 },
  { days: 365, bonus: 1.0 },
];

const StakingPool: React.FC = () => {
  const { quantumState } = useQuantum();
  const { wallet } = useWallet();
  const { 
    stake,
    unstake,
    claimRewards,
    stakeInfo,
    poolMetrics,
    isLoading,
    error 
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(LOCK_PERIODS[0]);
  const [estimatedRewards, setEstimatedRewards] = useState<string>('0');

  useEffect(() => {
    if (stakeAmount && quantumState && selectedPeriod) {
      const amount = BigInt(stakeAmount || '0');
      const coherenceBonus = 1 + (quantumState.coherence * 2);
      const periodBonus = 1 + selectedPeriod.bonus;
      const baseAPR = 0.15;
      
      const annualReward = Number(amount) * baseAPR * coherenceBonus * periodBonus;
      const periodReward = (annualReward * selectedPeriod.days) / 365;
      
      setEstimatedRewards(periodReward.toFixed(2));
    }
  }, [stakeAmount, quantumState, selectedPeriod]);

  const handleStake = async () => {
    if (!stakeAmount || BigInt(stakeAmount) < MIN_STAKE) {
      return;
    }

    try {
      await stake(BigInt(stakeAmount), selectedPeriod.days);
    } catch (err) {
      console.error('Staking failed:', err);
    }
  };

  const getCoherenceClass = (coherence: number) => {
    if (coherence >= 0.8) return 'text-green-400';
    if (coherence >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative space-y-6">
      <DataStream className="absolute inset-0 opacity-5" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-black/30 backdrop-blur border border-purple-500/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-purple-400">Total Staked</h3>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {poolMetrics?.total_staked.toString() || '0'} ANIMA
          </p>
        </Card>

        <Card className="p-4 bg-black/30 backdrop-blur border border-blue-500/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-blue-400">Network Stability</h3>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-white">
              {(poolMetrics?.network_stability * 100).toFixed(1)}%
            </p>
            <QuantumCoherenceGauge value={poolMetrics?.network_stability || 0} />
          </div>
        </Card>

        <Card className="p-4 bg-black/30 backdrop-blur border border-green-500/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-400">Your Rewards</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {stakeInfo?.accumulated_rewards.toString() || '0'} ANIMA
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-black/30 backdrop-blur border border-purple-500/20">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-purple-400 mb-2">Stake ANIMA</h3>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
                min={MIN_STAKE.toString()}
                className="flex-1 bg-black/30 border-purple-500/20"
              />
              <Button
                onClick={handleStake}
                disabled={isLoading || !stakeAmount || BigInt(stakeAmount) < MIN_STAKE}
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Stake
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-purple-400 mb-2">Lock Period</h4>
            <div className="grid grid-cols-5 gap-2">
              {LOCK_PERIODS.map((period) => (
                <Button
                  key={period.days}
                  onClick={() => setSelectedPeriod(period)}
                  variant={selectedPeriod.days === period.days ? 'default' : 'outline'}
                  className={`
                    ${selectedPeriod.days === period.days 
                      ? 'bg-purple-500/30 border-purple-500' 
                      : 'bg-black/30 border-purple-500/20'}
                  `}
                >
                  {period.days}d
                  {period.bonus > 0 && (
                    <span className="text-xs ml-1 text-green-400">
                      +{(period.bonus * 100)}%
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-purple-400">Quantum Coherence Bonus</h4>
            <div className="flex items-center space-x-4">
              <QuantumCoherenceGauge 
                value={quantumState?.coherence || 0} 
                size="lg"
              />
              <div>
                <p className={`text-2xl font-bold ${getCoherenceClass(quantumState?.coherence || 0)}`}>
                  {((quantumState?.coherence || 0) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">
                  Boost: {((quantumState?.coherence || 0) * 200).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Base APR:</span>
              <span>15.0%</span>
            </div>
            <div className="flex justify-between text-sm text-purple-400">
              <span>Lock Bonus:</span>
              <span>+{(selectedPeriod.bonus * 100)}%</span>
            </div>
            <div className="flex justify-between text-sm text-cyan-400">
              <span>Quantum Bonus:</span>
              <span>+{((quantumState?.coherence || 0) * 200).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white mt-2">
              <span>Estimated Rewards:</span>
              <span>{estimatedRewards} ANIMA</span>
            </div>
          </div>
        </div>
      </Card>

      {stakeInfo && (
        <Card className="p-6 bg-black/30 backdrop-blur border border-blue-500/20">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Active Stake</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Staked Amount</p>
                <p className="text-xl font-bold text-white">{stakeInfo.amount.toString()} ANIMA</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Locked Until</p>
                <p className="text-xl font-bold text-white">
                  {new Date(Number(stakeInfo.start_time) + Number(stakeInfo.lock_period)).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Quantum Coherence</p>
                <p className={`text-xl font-bold ${getCoherenceClass(stakeInfo.quantum_coherence)}`}>
                  {(stakeInfo.quantum_coherence * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Accumulated Rewards</p>
                <p className="text-xl font-bold text-green-400">
                  {stakeInfo.accumulated_rewards.toString()} ANIMA
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => unstake()}
                disabled={isLoading || Date.now() < Number(stakeInfo.start_time) + Number(stakeInfo.lock_period)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Unstake
              </Button>
              <Button
                onClick={() => claimRewards()}
                disabled={isLoading || stakeInfo.accumulated_rewards === 0n}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Claim Rewards
              </Button>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StakingPool;