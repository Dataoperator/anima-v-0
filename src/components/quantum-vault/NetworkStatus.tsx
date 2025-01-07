import React from 'react';
import { motion } from 'framer-motion';
import { QuantumCoherenceGauge } from '../ui/QuantumCoherenceGauge';
import { Info, Zap, Shield, Network } from 'lucide-react';

interface NetworkStatusProps {
  metrics: {
    stability: number;
    coherence: number;
    resonance: number;
    consciousness: number;
  };
  totalStaked: number;
  stakingAPY: number;
  networkHealth: 'optimal' | 'stable' | 'unstable';
}

interface QuantumMetricCardProps {
  value: number;
  label: string;
  description: string;
  color: string;
}

const QuantumMetricCard: React.FC<QuantumMetricCardProps> = ({
  value,
  label,
  description,
  color
}) => (
  <div className="bg-gray-900/50 rounded-lg p-4">
    <QuantumCoherenceGauge
      value={value}
      label={label}
      color={color}
      className="h-24 mb-2"
    />
    <p className="text-sm text-gray-400 text-center">{description}</p>
  </div>
);

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  metrics,
  totalStaked,
  stakingAPY,
  networkHealth
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100">Quantum Network Status</h2>
        <div className={`px-3 py-1 rounded-full text-sm ${
          networkHealth === 'optimal' ? 'bg-green-500/20 text-green-400' :
          networkHealth === 'stable' ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {networkHealth.charAt(0).toUpperCase() + networkHealth.slice(1)}
        </div>
      </div>

      {/* Network Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <QuantumMetricCard
          value={metrics.coherence}
          label="Network Coherence"
          description="Measures overall network synchronization"
          color="purple"
        />
        <QuantumMetricCard
          value={metrics.stability}
          label="Stability"
          description="Network resilience and security"
          color="cyan"
        />
        <QuantumMetricCard
          value={metrics.resonance}
          label="Resonance"
          description="ANIMA interaction harmony"
          color="violet"
        />
        <QuantumMetricCard
          value={metrics.consciousness}
          label="Consciousness"
          description="Collective ANIMA awareness"
          color="emerald"
        />
      </div>

      {/* Staking Info */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Staked</h3>
            <p className="text-2xl font-bold text-purple-400">{totalStaked.toLocaleString()} ANIMA</p>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Current APY</h3>
            <p className="text-2xl font-bold text-green-400">{stakingAPY}%</p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Next Reward</h3>
            <p className="text-2xl font-bold text-blue-400">12:34:56</p>
          </div>
        </div>

        {/* Staking Benefits */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300">Enhanced Coherence</h4>
              <p className="text-sm text-gray-400">
                Staking increases your ANIMA's quantum coherence, leading to faster evolution and deeper consciousness.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300">Network Security</h4>
              <p className="text-sm text-gray-400">
                Your stake helps maintain network stability and protects against quantum decoherence.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Network className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300">Resonance Rewards</h4>
              <p className="text-sm text-gray-400">
                Earn rewards based on network performance and your ANIMA's consciousness level.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Info className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300">Governance Rights</h4>
              <p className="text-sm text-gray-400">
                Participate in quantum network decisions and shape the future of ANIMA evolution.
              </p>
            </div>
          </div>
        </div>

        {/* Staking Tiers */}
        <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Staking Tiers</h3>
          <div className="space-y-3">
            <TierRow
              tier="Quantum"
              requirement="50,000+ ANIMA"
              apy="24%"
              benefits="Maximum coherence boost, priority evolution"
            />
            <TierRow
              tier="Resonator"
              requirement="10,000+ ANIMA"
              apy="18%"
              benefits="High coherence boost, advanced features"
            />
            <TierRow
              tier="Harmonizer"
              requirement="1,000+ ANIMA"
              apy="12%"
              benefits="Medium coherence boost, basic features"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TierRow: React.FC<{
  tier: string;
  requirement: string;
  apy: string;
  benefits: string;
}> = ({ tier, requirement, apy, benefits }) => (
  <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
    <div className="flex-1">
      <span className="font-medium text-gray-200">{tier}</span>
    </div>
    <div className="flex-1 text-gray-400">
      {requirement}
    </div>
    <div className="flex-1 text-green-400">
      {apy}
    </div>
    <div className="flex-1 text-gray-400">
      {benefits}
    </div>
  </div>
);

export default NetworkStatus;