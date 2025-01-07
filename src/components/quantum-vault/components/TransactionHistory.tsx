import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowDownRight, Flame, Sparkles } from 'lucide-react';
import type { Transaction } from '@/services/transaction-history.service';

interface Props {
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-400" />;
      case 'mint':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />;
      case 'burn':
        return <Flame className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatAmount = (amount: bigint) => {
    return (Number(amount) / 100_000_000).toFixed(8);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-800 rounded-lg">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-semibold capitalize">
              {transaction.type}
            </span>
            <span className="font-mono text-cyan-300">
              {formatAmount(transaction.amount)} ICP
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-500">
              {formatDate(transaction.timestamp)}
            </span>
            <span className={`text-sm ${getStatusColor()} capitalize`}>
              {transaction.status}
            </span>
          </div>
          {transaction.quantum_signature && (
            <div className="mt-2 text-xs font-mono text-gray-600 break-all">
              {transaction.quantum_signature}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const TransactionHistory: React.FC<Props> = ({ transactions, isOpen, onClose }) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Transaction['type'] | 'all'>('all');

  useEffect(() => {
    setFilteredTransactions(
      filter === 'all'
        ? transactions
        : transactions.filter(tx => tx.type === filter)
    );
  }, [transactions, filter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Transaction History
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as Transaction['type'] | 'all')}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-300"
                >
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="mint">Mints</option>
                  <option value="transfer">Transfers</option>
                  <option value="burn">Burns</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px] pr-2">
              {filteredTransactions.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No transactions found
                </div>
              ) : (
                filteredTransactions.map(transaction => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};