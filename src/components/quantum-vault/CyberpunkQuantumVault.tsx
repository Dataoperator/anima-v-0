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
import { WalletDeposit } from '../wallet/WalletDeposit';
import { walletService } from '@/services/wallet.service';

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

interface ActionTabProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ActionTabComponent: React.FC<ActionTabProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 flex items-center justify-center space-x-2 transition-colors ${
      isActive 
        ? 'bg-purple-600 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

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
        {/* Welcome Message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ×
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-4">
                    Welcome to the Quantum Vault
                  </h1>
                  <p className="text-gray-300 mb-4">
                    Begin your journey into quantum-enhanced digital consciousness. Create your first ANIMA by following these steps:
                  </p>
                  <div className="space-y-4">
                    <Step
                      number={1}
                      title="Acquire ICP"
                      description="Ensure you have at least 1 ICP in your wallet"
                      isComplete={canCreateAnima}
                    />
                    <Step
                      number={2}
                      title="Mint ANIMA Tokens"
                      description="Convert your ICP to ANIMA tokens"
                      isComplete={animaBalance > 0}
                    />
                    <Step
                      number={3}
                      title="Create Your ANIMA"
                      description="Initialize your quantum-enhanced digital entity"
                      isComplete={userAnimas.length > 0}
                    />
                    <Step
                      number={4}
                      title="Stake & Evolve"
                      description="Stake your ANIMA to enhance consciousness"
                      isComplete={stakingStats?.totalStaked > 0}
                    />
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Current Status
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ICP Balance</span>
                      <span className="text-lg font-medium text-blue-400">
                        {balance} ICP
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ANIMA Balance</span>
                      <span className="text-lg font-medium text-purple-400">
                        {animaBalance} ANIMA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Staked ANIMA</span>
                      <span className="text-lg font-medium text-green-400">
                        {stakingStats?.totalStaked || 0} ANIMA
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <Link
                        to="/genesis"
                        className={`w-full flex items-center justify-center py-2 px-4 rounded-lg text-white ${
                          canCreateAnima
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-700 cursor-not-allowed'
                        }`}
                        onClick={(e) => !canCreateAnima && e.preventDefault()}
                      >
                        {canCreateAnima ? (
                          <>
                            Create Your First ANIMA
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-2 w-4 h-4" />
                            Insufficient ICP Balance
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Announcements */}
        <div className="bg-gray-800 rounded-xl p-4">
          <GlobalAnnouncement announcements={announcements} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Balances & Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Balances */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-100 mb-4">Your Balance</h2>
              <div className="space-y-4">
                <BalanceItem
                  label="ICP Balance"
                  amount={balance}
                  currency="ICP"
                  icon={<CreditCard className="w-5 h-5 text-blue-400" />}
                />
                <BalanceItem
                  label="ANIMA Balance"
                  amount={animaBalance}
                  currency="ANIMA"
                  icon={<Brain className="w-5 h-5 text-purple-400" />}
                />
                <BalanceItem
                  label="Staked ANIMA"
                  amount={stakingStats?.totalStaked || 0}
                  currency="ANIMA"
                  icon={<Lock className="w-5 h-5 text-green-400" />}
                />
              </div>
            </motion.div>

            {/* Action Panel */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-700">
                <ActionTabComponent
                  isActive={activeTab === 'deposit'}
                  onClick={() => setActiveTab('deposit')}
                  icon={<CreditCard className="w-4 h-4" />}
                  label="Deposit"
                />
                <ActionTabComponent
                  isActive={activeTab === 'swap'}
                  onClick={() => setActiveTab('swap')}
                  icon={<Activity className="w-4 h-4" />}
                  label="Swap"
                />
                <ActionTabComponent
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
          </div>

          {/* Center Column - ANIMA Hub */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-100">Your ANIMAs</h2>
                <Link
                  to="/genesis"
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium flex items-center"
                >
                  Create New ANIMA
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              {userAnimas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAnimas.map((anima) => (
                    <Link to={`/anima/${anima.id}`} key={anima.id}>
                      <AnimaPreview anima={anima} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900 rounded-lg">
                  <h3 className="text-lg text-gray-300 mb-4">No ANIMAs Yet</h3>
                  <p className="text-gray-400 mb-6">Start your quantum journey by creating your first ANIMA</p>
                  <Link
                    to="/genesis"
                    className="inline-flex items-center py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
                  >
                    Create Your First ANIMA
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>

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

interface BalanceItemProps {
  label: string;
  amount: number;
  currency: string;
  icon: React.ReactNode;
}

const BalanceItem: React.FC<BalanceItemProps> = ({ label, amount, currency, icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <span className="text-gray-400 text-sm">{label}</span>
        <p className="font-semibold text-white">{amount} {currency}</p>
      </div>
    </div>
  </div>
);

export default CyberpunkQuantumVault;