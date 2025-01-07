import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Wallet, ExternalLink, QrCode, RefreshCw, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { TransactionHistory } from './TransactionHistory';
import { QRCodeCanvas } from '@/components/ui/QRCode';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { identity } = useAuth();
  const { wallet, refreshBalance } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get the principal ID for deposits
  const principalId = identity?.getPrincipal().toText() || '';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh balance every 10 seconds when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      refreshBalance().catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <>
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
              className="bg-gray-900/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Deposit ICP
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(true)}
                    className="p-2 hover:bg-cyan-500/10 rounded transition-colors"
                    title="Transaction History"
                  >
                    <History className="w-5 h-5 text-cyan-300" />
                  </button>
                  <button
                    onClick={handleRefreshBalance}
                    className={`p-2 hover:bg-cyan-500/10 rounded transition-colors ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                    disabled={isRefreshing}
                    title="Refresh Balance"
                  >
                    <RefreshCw className="w-5 h-5 text-cyan-300" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Current Balance</div>
                  <div className="text-2xl font-mono text-cyan-300">
                    {(Number(wallet.balance) / 100_000_000).toFixed(8)} ICP
                  </div>
                </div>

                <div className="text-gray-300">
                  Send ICP to your wallet address to mint your ANIMA. Minimum required: 1 ICP
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Your Deposit Address:</span>
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-1 text-cyan-300 hover:text-cyan-400"
                    >
                      <QrCode className="w-4 h-4" />
                      {showQR ? 'Hide' : 'Show'} QR Code
                    </button>
                  </div>

                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center p-4 bg-white rounded-lg"
                      >
                        <QRCodeCanvas 
                          value={principalId}
                          size={200}
                          level="H"
                          includeMargin={true}
                          className="w-full max-w-[200px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2">
                    <div className="bg-black/30 border border-gray-700 rounded p-3 flex-1 font-mono text-sm text-cyan-300 break-all">
                      {principalId}
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-3 border border-gray-700 rounded hover:bg-cyan-500/10 transition-colors"
                    >
                      <Copy className="w-5 h-5 text-cyan-300" />
                    </button>
                  </div>
                  {copied && (
                    <div className="text-sm text-green-400">
                      Address copied to clipboard!
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <div className="text-sm text-gray-400">Quick Links:</div>
                  <a
                    href="https://nns.ic0.app/accounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-300 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open NNS to Transfer ICP
                  </a>
                  <a
                    href="https://plugwallet.ooo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-300 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get Plug Wallet
                  </a>
                </div>

                <div className="text-sm text-gray-400 mt-4">
                  Note: Transfers typically take 1-2 minutes to process.
                  {isRefreshing && ' Checking for new transactions...'}
                </div>
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

      <TransactionHistory
        transactions={wallet.transactions}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
};