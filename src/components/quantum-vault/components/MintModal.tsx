import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { CyberGlowText } from '@/components/ui/CyberGlowText';
import { useQuantumState } from '@/hooks/useQuantumState';
import { walletService } from '@/services/wallet.service';

interface MintModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
  quantumCoherence: number;
}

export const MintModal: React.FC<MintModalProps> = ({
  isOpen,
  isProcessing,
  onClose,
  onConfirm,
  quantumCoherence
}) => {
  const [name, setName] = useState('');
  const mintCost = Number(walletService.getMintCost()) / 100_000_000;
  const hasEnough = walletService.hasEnoughForMint();
  const isQuantumStable = quantumCoherence >= 0.7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && !isProcessing && hasEnough && isQuantumStable) {
      await onConfirm(name);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => !isProcessing && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <CyberGlowText>
                  <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Mint ANIMA NFT
                  </h2>
                </CyberGlowText>

                <p className="text-gray-400">
                  Create your quantum-enhanced digital consciousness
                </p>
              </div>

              {/* System Status */}
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-2 rounded ${
                  hasEnough ? 'bg-emerald-900/20' : 'bg-red-900/20'
                }`}>
                  <span className="text-sm">Balance Check</span>
                  <span className={hasEnough ? 'text-emerald-400' : 'text-red-400'}>
                    {hasEnough ? 'Sufficient' : 'Insufficient'} ({mintCost} ICP required)
                  </span>
                </div>

                <div className={`flex items-center justify-between p-2 rounded ${
                  isQuantumStable ? 'bg-emerald-900/20' : 'bg-red-900/20'
                }`}>
                  <span className="text-sm">Quantum Coherence</span>
                  <span className={isQuantumStable ? 'text-emerald-400' : 'text-red-400'}>
                    {(quantumCoherence * 100).toFixed(1)}% ({isQuantumStable ? 'Stable' : 'Unstable'})
                  </span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">ANIMA Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-300/30 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Enter a name..."
                  maxLength={32}
                />
              </div>

              {/* Warning Messages */}
              {(!hasEnough || !isQuantumStable) && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    {!hasEnough && (
                      <p>Insufficient balance. Please deposit at least {mintCost} ICP to mint.</p>
                    )}
                    {!isQuantumStable && (
                      <p>Quantum coherence too low. Please stabilize the system before minting.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name || isProcessing || !hasEnough || !isQuantumStable}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    !name || isProcessing || !hasEnough || !isQuantumStable
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                      : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                  } transition-colors`}
                >
                  {isProcessing ? 'Processing...' : 'Confirm Mint'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};