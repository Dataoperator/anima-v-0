import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface TransactionReceiptProps {
  transaction: {
    blockHeight: string;
    timestamp: string;
    from: string;
    to: string;
    amount: string;
    fee: string;
    memo: string;
  };
  onClose?: () => void;
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  onClose
}) => {
  const formatAddress = (address: string) => 
    `${address.slice(0, 8)}...${address.slice(-8)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const getExplorerUrl = (blockHeight: string) => 
    `https://dashboard.internetcomputer.org/transaction/${blockHeight}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto p-6 bg-black/20 rounded-lg border border-green-500/30 space-y-6"
    >
      <header className="text-center space-y-2">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-500">GENESIS PAYMENT CONFIRMED</h2>
        <p className="text-green-400/60">Quantum signature verified successfully</p>
      </header>

      <div className="grid gap-4">
        <div className="p-4 bg-black/40 rounded space-y-1">
          <div className="text-sm text-green-400">Quantum Transfer Amount</div>
          <div className="font-mono text-lg">
            {(Number(transaction.amount) / 100_000_000).toFixed(8)} ICP
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-black/40 rounded space-y-1">
            <div className="text-sm text-green-400">Block Height</div>
            <div className="font-mono flex items-center gap-2">
              {transaction.blockHeight}
              <button
                onClick={() => window.open(getExplorerUrl(transaction.blockHeight))}
                className="p-1 hover:bg-white/10 rounded"
                aria-label="View on Explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded space-y-1">
            <div className="text-sm text-green-400">Network Fee</div>
            <div className="font-mono">
              {(Number(transaction.fee) / 100_000_000).toFixed(8)} ICP
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/40 rounded space-y-1">
          <div className="text-sm text-green-400">Origin Principal</div>
          <div className="font-mono flex items-center justify-between">
            <span>{formatAddress(transaction.from)}</span>
            <button
              onClick={() => copyToClipboard(transaction.from)}
              className="p-1 hover:bg-white/10 rounded"
              aria-label="Copy Address"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/40 rounded space-y-1">
          <div className="text-sm text-green-400">Destination Principal</div>
          <div className="font-mono flex items-center justify-between">
            <span>{formatAddress(transaction.to)}</span>
            <button
              onClick={() => copyToClipboard(transaction.to)}
              className="p-1 hover:bg-white/10 rounded"
              aria-label="Copy Address"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/40 rounded space-y-1">
          <div className="text-sm text-green-400">Quantum Timestamp</div>
          <div className="font-mono">
            {formatTimestamp(transaction.timestamp)}
          </div>
        </div>

        <div className="p-4 bg-black/40 rounded space-y-1">
          <div className="text-sm text-green-400">Reference Signature</div>
          <div className="font-mono flex items-center justify-between">
            <span>{transaction.memo}</span>
            <button
              onClick={() => copyToClipboard(transaction.memo)}
              className="p-1 hover:bg-white/10 rounded"
              aria-label="Copy Reference"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onClose}
          className="px-6 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono"
        >
          INITIATE GENESIS
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TransactionReceipt;