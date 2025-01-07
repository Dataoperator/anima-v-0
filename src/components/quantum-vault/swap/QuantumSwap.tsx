import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownUp, 
  RefreshCcw, 
  Settings, 
  AlertTriangle,
  Sparkles,
  Atom
} from 'lucide-react';
import { useSwap } from '@/hooks/useSwap';
import { useQuantum } from '@/hooks/useQuantum';
import { useWallet } from '@/hooks/useWallet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { QuantumCoherenceGauge } from '../QuantumCoherenceGauge';
import { SwapParticles } from './SwapParticles';

const SLIPPAGE_OPTIONS = [0.5, 1.0, 2.0];
const MIN_COHERENCE_FOR_BONUS = 0.5;

export const QuantumSwap: React.FC = () => {
  const { quantumState } = useQuantum();
  const { wallet } = useWallet();
  const { 
    swap,
    getQuote,
    swapState,
    isLoading,
    error 
  } = useSwap();

  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [swapAnimation, setSwapAnimation] = useState(false);
  const [coherenceBonus, setCoherenceBonus] = useState(0);

  useEffect(() => {
    if (quantumState) {
      const bonus = Math.max(0, (quantumState.coherence - MIN_COHERENCE_FOR_BONUS) * 2);
      setCoherenceBonus(bonus);
    }
  }, [quantumState]);

  useEffect(() => {
    if (fromAmount) {
      updateQuote(fromAmount);
    }
  }, [fromAmount, coherenceBonus]);

  const updateQuote = async (amount: string) => {
    if (!amount || isNaN(Number(amount))) return;
    
    try {
      const quote = await getQuote({
        fromAmount: BigInt(Math.floor(Number(amount) * 100000000)),
        coherenceBonus
      });
      
      setToAmount(quote.toString());
    } catch (err) {
      console.error('Failed to get quote:', err);
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return;

    try {
      setSwapAnimation(true);
      await swap({
        fromAmount: BigInt(Math.floor(Number(fromAmount) * 100000000)),
        expectedAmount: BigInt(Math.floor(Number(toAmount) * 100000000)),
        slippage,
        coherenceBonus
      });
      
      // Reset inputs after successful swap
      setFromAmount('');
      setToAmount('');
    } catch (err) {
      console.error('Swap failed:', err);
    } finally {
      setTimeout(() => setSwapAnimation(false), 2000);
    }
  };

  const getMaxAmount = () => {
    if (!wallet?.balances?.icp) return '0';
    return (Number(wallet.balances.icp) / 100000000).toString();
  };

  return (
    <div className="relative space-y-6">
      {/* Quantum Swap Card */}
      <Card className="p-6 bg-black/30 backdrop-blur border border-blue-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-400 flex items-center">
            <ArrowDownUp className="w-6 h-6 mr-2" />
            Quantum Swap
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Swap Animation */}
        <AnimatePresence>
          {swapAnimation && <SwapParticles />}
        </AnimatePresence>

        {/* From Token */}
        <div className="space-y-2 mb-2">
          <label className="text-sm text-gray-400">From (ICP)</label>
          <div className="relative">
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              min="0"
              step="0.000001"
              className="bg-black/30 border-blue-500/20 pr-24"
            />
            <Button
              onClick={() => setFromAmount(getMaxAmount())}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 
                       bg-blue-500/20 hover:bg-blue-500/30 
                       text-blue-400 text-xs"
            >
              MAX
            </Button>
          </div>
          <div className="text-sm text-gray-500 flex justify-between">
            <span>Balance: {Number(wallet?.balances?.icp || 0) / 100000000} ICP</span>
            {fromAmount && (
              <span className="text-blue-400">
                ≈ ${(Number(fromAmount) * 30).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Swap Direction Indicator */}
        <div className="relative h-8 my-4">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-blue-500/20 
                       border border-blue-500/40 flex items-center justify-center
                       cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4 text-blue-400" />
            </motion.div>
          </div>
        </div>

        {/* To Token */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-gray-400">To (ANIMA)</label>
          <Input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="bg-black/30 border-blue-500/20"
          />
          <div className="text-sm text-gray-500 flex justify-between">
            <span>Balance: {Number(wallet?.balances?.anima || 0)} ANIMA</span>
            {toAmount && (
              <span className="text-blue-400">
                Rate: 1 ICP = {(Number(toAmount) / Number(fromAmount)).toFixed(2)} ANIMA
              </span>
            )}
          </div>
        </div>

        {/* Quantum Coherence Bonus */}
        <div className="mb-6 p-4 bg-black/20 rounded-lg border border-purple-500/20">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Atom className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm text-gray-400">Quantum Bonus</span>
            </div>
            <QuantumCoherenceGauge value={quantumState?.coherence || 0} />
          </div>
          {coherenceBonus > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-400">
                +{(coherenceBonus * 100).toFixed(0)}% bonus rate
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Achieve {MIN_COHERENCE_FOR_BONUS * 100}%+ coherence for bonus rates
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-black/20 rounded-lg border border-blue-500/20">
                <h3 className="text-sm font-medium text-blue-400 mb-4">
                  Slippage Tolerance
                </h3>
                <div className="flex gap-2">
                  {SLIPPAGE_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setSlippage(option)}
                      variant={slippage === option ? 'default' : 'outline'}
                      className={`flex-1 ${
                        slippage === option 
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'border-blue-500/20'
                      }`}
                    >
                      {option}%
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={
            isLoading || 
            !fromAmount || 
            !toAmount || 
            Number(fromAmount) <= 0 ||
            Number(fromAmount) > Number(getMaxAmount())
          }
          className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                   hover:from-blue-500/30 hover:to-purple-500/30 
                   border border-blue-500/30"
        >
          {isLoading ? (
            <>
              <RefreshCcw className="w-4 h-4 animate-spin mr-2" />
              Swapping...
            </>
          ) : Number(fromAmount) > Number(getMaxAmount()) ? (
            'Insufficient Balance'
          ) : (
            'Swap'
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </Alert>
        )}
      </Card>

      {/* Exchange Rate Info */}
      <Card className="p-4 bg-black/30 backdrop-blur border border-gray-500/20">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Base Rate</span>
            <span className="text-blue-400">1 ICP = 1000 ANIMA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Quantum Bonus</span>
            <span className="text-purple-400">+{(coherenceBonus * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Effective Rate</span>
            <span className="text-green-400">
              1 ICP = {1000 * (1 + coherenceBonus)} ANIMA
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuantumSwap;