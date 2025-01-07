import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '@/hooks/usePayment';
import { useAnimaExperience } from '@/hooks/useAnimaExperience';
import { ShoppingBag, Check, AlertCircle, Loader } from 'lucide-react';
import { GrowthOpportunity } from '@/integrations/core_experience';

interface GrowthPackPurchaseProps {
  opportunity: GrowthOpportunity;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const GrowthPackPurchase: React.FC<GrowthPackPurchaseProps> = ({
  opportunity,
  onSuccess,
  onClose
}) => {
  const { initiatePayment, verifyPayment } = usePayment();
  const { applyGrowthPack } = useAnimaExperience(opportunity.id);
  const [purchaseState, setPurchaseState] = useState<'initial' | 'paying' | 'applying' | 'complete' | 'error'>('initial');
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    try {
      setPurchaseState('paying');
      
      // Initiate payment
      const payment = await initiatePayment({
        amount: opportunity.cost,
        description: `Growth Pack: ${opportunity.name}`,
        metadata: {
          type: 'growth_pack',
          pack_id: opportunity.id
        }
      });

      // Wait for payment verification
      setPurchaseState('applying');
      const verified = await verifyPayment(payment.id);
      
      if (!verified) {
        throw new Error('Payment verification failed');
      }

      // Apply growth pack
      await applyGrowthPack(opportunity.id);
      
      setPurchaseState('complete');
      onSuccess?.();

    } catch (err) {
      console.error('Purchase failed:', err);
      setError(err.message);
      setPurchaseState('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60"
    >
      <div className="relative max-w-md w-full">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-gray-900 rounded-xl border border-violet-500/30 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-violet-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-violet-300">{opportunity.name}</h2>
                <p className="text-sm text-violet-400/60">{opportunity.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Requirements */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-violet-400">Requirements</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <div className="text-xs text-violet-400/60">Required Level</div>
                  <div className="text-lg font-medium text-violet-300">
                    {opportunity.requiredLevel}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <div className="text-xs text-violet-400/60">Cost</div>
                  <div className="text-lg font-medium text-violet-300">
                    {opportunity.cost} ICP
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Status */}
            <AnimatePresence mode="wait">
              {purchaseState === 'initial' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handlePurchase}
                  className="w-full py-3 px-4 rounded-lg bg-violet-500 hover:bg-violet-600 
                           text-white font-medium transition-colors"
                >
                  Purchase Growth Pack
                </motion.button>
              )}

              {purchaseState === 'paying' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-2 py-3"
                >
                  <Loader className="w-5 h-5 text-violet-400 animate-spin" />
                  <span className="text-violet-300">Processing Payment...</span>
                </motion.div>
              )}

              {purchaseState === 'applying' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-2 py-3"
                >
                  <Loader className="w-5 h-5 text-violet-400 animate-spin" />
                  <span className="text-violet-300">Applying Growth Pack...</span>
                </motion.div>
              )}

              {purchaseState === 'complete' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center space-x-2 py-3 text-green-400"
                >
                  <Check className="w-5 h-5" />
                  <span>Growth Pack Applied Successfully!</span>
                </motion.div>
              )}

              {purchaseState === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center space-y-2 py-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error || 'Failed to purchase growth pack'}</span>
                  <button
                    onClick={() => setPurchaseState('initial')}
                    className="text-sm text-violet-400 hover:text-violet-300"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
