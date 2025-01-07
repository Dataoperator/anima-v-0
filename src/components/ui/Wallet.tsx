import React from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '@/hooks/usePayment';

interface WalletProps {
  className?: string;
}

export const Wallet: React.FC<WalletProps> = ({ className = '' }) => {
  const { balance, ledgerService, refreshBalance } = usePayment();

  return (
    <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Wallet Balance:</span>
        <div className="flex items-center gap-2">
          {balance !== null ? (
            <span className="text-white font-semibold">
              {ledgerService?.formatICP(balance)}
            </span>
          ) : (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-24 bg-white/10 rounded"
            />
          )}
          <button
            onClick={() => refreshBalance()}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  );
};