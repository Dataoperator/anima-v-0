import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, ArrowUpRight, Clock } from 'lucide-react';

interface WalletPanelProps {
  tokenId: string;
}

export const WalletPanel: React.FC<WalletPanelProps> = ({ tokenId }) => {
  return (
    <div className="bg-gray-900/50 rounded-xl p-6 mt-6 backdrop-blur-sm border border-violet-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-violet-400" />
          <h2 className="text-lg font-semibold text-violet-300">Quantum Wallet</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-violet-600 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Top Up</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Token ID</h3>
            <ArrowUpRight className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-lg font-mono text-violet-300">{tokenId}</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm text-gray-400">Last Transaction</h3>
          </div>
          <p className="text-lg font-mono text-violet-300">2 hours ago</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Balance</h3>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
          </div>
          <p className="text-lg font-mono text-violet-300">1,234.56 ICP</p>
        </div>
      </div>
    </div>
  );
};
