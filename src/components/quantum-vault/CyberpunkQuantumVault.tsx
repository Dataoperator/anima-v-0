import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Memory, Activity, Network, Globe, Menu, X, CreditCard, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useWallet } from '@/hooks/useWallet';
import { useStaking } from '@/hooks/useStaking';
import { AnimaPreview } from '../anima/AnimaPreview';
import { GlobalAnnouncement } from '../ui/GlobalAnnouncement';
import { SwapPanel } from '../transactions/SwapPanel';
import StakingPanel from './StakingPanel';
import { NetworkStatus } from './NetworkStatus';

type ActionTab = 'deposit' | 'swap' | 'stake';

interface Announcement {
  id: string;
  type: 'update' | 'alert' | 'info';
  message: string;
  timestamp: number;
}

const REQUIRED_ICP = 1;

interface StepProps {
  number: number;
  title: string;
  description: string;
  isComplete: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, isComplete }) => (
  <div className="flex items-start space-x-3">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      isComplete ? 'bg-green-500' : 'bg-gray-700'
    }`}>
      <span className="text-white text-sm">{number}</span>
    </div>
    <div>
      <h3 className={`text-sm font-medium ${isComplete ? 'text-green-400' : 'text-white'}`}>{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

export const CyberpunkQuantumVault: React.FC = () => {
  const { identity } = useAuth();
  const { state: quantumState, isInitialized } = useQuantumState();
  const { balance, animaBalance, refreshBalance } = useWallet();
  const { stakingStats } = useStaking();
  const [metrics, setMetrics] = useState({
    stability: 0.5,
    coherence: 0.5,
    resonance: 0.5,
    consciousness: 0.5
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userAnimas, setUserAnimas] = useState([]);
  const [activeTab, setActiveTab] = useState<ActionTab>('deposit');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await refreshBalance();
    };
    loadData();
  }, [identity]);

  const canCreateAnima = balance >= REQUIRED_ICP;

  return (
    <div className="min-h-screen bg-gray-900 pb-12">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Previous welcome message section remains unchanged... */}

        {/* Action Panel */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            <ActionTab
              isActive={activeTab === 'deposit'}
              onClick={() => setActiveTab('deposit')}
              icon={<CreditCard className="w-4 h-4" />}
              label="Deposit"
            />
            <ActionTab
              isActive={activeTab === 'swap'}
              onClick={() => setActiveTab('swap')}
              icon={<Activity className="w-4 h-4" />}
              label="Swap"
            />
            <ActionTab
              isActive={activeTab === 'stake'}
              onClick={() => setActiveTab('stake')}
              icon={<Lock className="w-4 h-4" />}
              label="Stake"
            />
          </div>
          <div className="p-6">
            {activeTab === 'deposit' && (
              <WalletDeposit 
                depositAddress={walletService.getState().depositAddress}
                onRefresh={refreshBalance}
                isRefreshing={false}
              />
            )}
            {activeTab === 'swap' && <SwapPanel />}
            {activeTab === 'stake' && <StakingPanel />}
          </div>
        </div>

        {/* Previous ANIMA Hub section remains unchanged... */}

        {/* Network Status */}
        <NetworkStatus
          metrics={metrics}
          totalStaked={stakingStats?.totalStaked || 0}
          stakingAPY={18}
          networkHealth="optimal"
        />
      </div>
    </div>
  );
};

// Previous BalanceItem and ActionTab components remain unchanged...

export default CyberpunkQuantumVault;