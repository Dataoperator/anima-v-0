import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const CONVERSION_RATE = 100; // 1 ICP = 100 ANIMA
const GENESIS_FEE = 1; // 1 ICP fixed fee

export const MintPanel: React.FC = () => {
  const navigate = useNavigate();
  const { mintAnima, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const animaAmount = parseFloat(amount) ? parseFloat(amount) * CONVERSION_RATE : 0;
  const totalICPNeeded = parseFloat(amount) ? parseFloat(amount) + GENESIS_FEE : 0;

  const handleMint = async () => {
    if (!amount || isLoading) return;
    setIsLoading(true);
    setError('');
    setCurrentStep(1);

    try {
      // Process Genesis Fee
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mint ANIMA Tokens
      setCurrentStep(3);
      const response = await mintAnima(totalICPNeeded);
      
      if (response.success) {
        setCurrentStep(4);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/genesis');
      } else {
        setError(response.error || 'Mint failed. Please try again.');
        setCurrentStep(0);
      }
    } catch (err) {
      setError('Transaction failed. Please check your balance and try again.');
      setCurrentStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Token Economics Info */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-purple-400">Token Economics</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-white"
          >
            <Info size={16} />
          </button>
        </div>
        
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-400 space-y-2"
            >
              <p>• Conversion Rate: 1 ICP = {CONVERSION_RATE} ANIMA</p>
              <p>• Genesis Fee: {GENESIS_FEE} ICP (fixed)</p>
              <p>• Staking rewards start after 30 days</p>
              <p>• Higher quantum coherence = better rewards</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount to Mint (ICP)
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
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">ICP</span>
          </div>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-gray-400">Available: {balance} ICP</span>
          <span className="text-purple-400">You'll receive: {animaAmount} ANIMA</span>
        </div>
      </div>

      {/* Transaction Summary */}
      {amount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-2">Transaction Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ANIMA Token Cost</span>
              <span className="text-white">{amount} ICP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Genesis Fee</span>
              <span className="text-white">{GENESIS_FEE} ICP</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
              <span className="text-gray-300">Total Cost</span>
              <span className="text-purple-400">{totalICPNeeded} ICP</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction Steps */}
      {currentStep > 0 && (
        <div className="space-y-2">
          <Step
            step={1}
            currentStep={currentStep}
            label="Initializing Transaction"
          />
          <Step
            step={2}
            currentStep={currentStep}
            label="Processing Genesis Fee"
          />
          <Step
            step={3}
            currentStep={currentStep}
            label="Minting ANIMA Tokens"
          />
          <Step
            step={4}
            currentStep={currentStep}
            label="Preparing Quantum Genesis"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm py-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMint}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-lg font-medium ${
          isLoading || !amount || parseFloat(amount) <= 0
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Mint ANIMA'}
      </motion.button>

      <p className="text-sm text-gray-400 text-center">
        Begin your quantum journey with ANIMA tokens. Each token represents a quantum-enhanced digital entity ready for evolution.
      </p>
    </div>
  );
};

const Step: React.FC<{
  step: number;
  currentStep: number;
  label: string;
}> = ({ step, currentStep, label }) => (
  <div className="flex items-center space-x-3">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center ${
        currentStep > step
          ? 'bg-green-500'
          : currentStep === step
          ? 'bg-purple-500 animate-pulse'
          : 'bg-gray-700'
      }`}
    >
      {currentStep > step ? (
        <CheckCircle size={14} className="text-white" />
      ) : (
        <span className="text-xs text-white">{step}</span>
      )}
    </div>
    <span
      className={`text-sm ${
        currentStep > step
          ? 'text-green-400'
          : currentStep === step
          ? 'text-purple-400'
          : 'text-gray-400'
      }`}
    >
      {label}
    </span>
  </div>
);