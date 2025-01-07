import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { WalletDeposit } from '../wallet/WalletDeposit';

export const SwapPanel: React.FC = () => {
  const { 
    swapTokens, 
    getSwapRate, 
    balance, 
    animaBalance, 
    depositAddress,
    refreshBalance
  } = useWallet();
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'icpToAnima' | 'animaToIcp'>('icpToAnima');
  const [rate, setRate] = useState(0);
  const [expectedOutput, setExpectedOutput] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const currentRate = await getSwapRate(direction);
        setRate(currentRate);
      } catch (err) {
        console.error('Failed to fetch swap rate:', err);
      }
    };
    fetchRate();
  }, [direction, getSwapRate]);

  useEffect(() => {
    if (amount && rate) {
      const output = (parseFloat(amount) * rate).toFixed(4);
      setExpectedOutput(output);
    } else {
      setExpectedOutput('0');
    }
  }, [amount, rate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSwap = async () => {
    if (!amount || isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await swapTokens({
        amount: parseFloat(amount),
        direction,
        expectedOutput: parseFloat(expectedOutput)
      });

      if (!response.success) {
        setError(response.error || 'Swap failed. Please try again.');
      }
    } catch (err) {
      setError('Transaction failed. Please check your balance and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'icpToAnima' ? 'animaToIcp' : 'icpToAnima');
    setAmount('');
    setExpectedOutput('0');
  };

  return (
    <div className="space-y-6">
      <WalletDeposit 
        depositAddress={depositAddress || ''}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {direction === 'icpToAnima' ? 'ICP Amount' : 'ANIMA Amount'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-900 rounded-lg py-2 px-4 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{direction === 'icpToAnima' ? 'ICP' : 'ANIMA'}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Available: {direction === 'icpToAnima' ? balance : animaBalance} {direction === 'icpToAnima' ? 'ICP' : 'ANIMA'}
          </p>
        </div>

        <button
          onClick={toggleDirection}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6 transform rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Output
          </label>
          <div className="bg-gray-900 rounded-lg py-2 px-4 text-white border border-gray-700">
            {expectedOutput} {direction === 'icpToAnima' ? 'ANIMA' : 'ICP'}
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Rate: 1 {direction === 'icpToAnima' ? 'ICP' : 'ANIMA'} = {rate} {direction === 'icpToAnima' ? 'ANIMA' : 'ICP'}
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm py-2">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSwap}
          disabled={isLoading || !amount}
          className={`w-full py-3 rounded-lg font-medium ${
            isLoading || !amount
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Swap Tokens'}
        </motion.button>

        <p className="text-sm text-gray-400 text-center">
          Swap between ICP and ANIMA tokens instantly with quantum-enhanced liquidity pools.
        </p>
      </div>
    </div>
  );
};