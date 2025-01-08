import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowRightLeft, QrCode, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useWallet } from '@/hooks/useWallet';
import { formatICP, formatANIMA } from '@/utils/formatters';

// Previous code remains unchanged until the button onClick...

            <button
              onClick={() => copyToClipboard(walletState.deposit_address)}
              className="p-2 rounded-lg bg-violet-500/20 text-violet-300
                       hover:bg-violet-500/30 transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-4 rounded-lg">
                  <QRCode 
                    value={walletState.deposit_address}
                    size={200}
                    level="H"
                    includeMargin
                    className="w-full"
                  />
                </div>
                <p className="mt-2 text-sm text-center text-violet-400/60">
                  Scan to get deposit address
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-violet-400/60 mt-4">
            Only send ICP to this address. Transactions may take a few minutes to process.
          </p>
        </motion.div>

        {/* Swap Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-6 border border-violet-500/20"
        >
          <h3 className="text-lg font-medium text-violet-300 mb-4">
            Swap ICP to ANIMA
          </h3>
          <SwapForm
            onSwap={swapICPtoANIMA}
            maxAmount={walletState.icp_balance}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-6 border border-violet-500/20"
        >
          <h3 className="text-lg font-medium text-violet-300 mb-4">
            Recent Transactions
          </h3>
          
          {walletState.transactions.length > 0 ? (
            <div className="space-y-3">
              {walletState.transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-3 
                           bg-gray-900/30 rounded-lg"
                >
                  <div>
                    <div className="text-violet-300">
                      {tx.transaction_type === 'Deposit' ? 'Received ICP' :
                       tx.transaction_type === 'Swap' ? 'Swapped ICP to ANIMA' :
                       tx.transaction_type === 'Withdrawal' ? 'Sent ICP' : 
                       'Minted ANIMA'}
                    </div>
                    <div className="text-sm text-violet-400/60">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-right text-violet-300">
                      {tx.transaction_type === 'Swap' 
                        ? `${formatICP(tx.amount)} → ${formatANIMA(tx.amount * 100)}`
                        : formatICP(tx.amount)
                      }
                    </div>
                    <div className={`text-sm text-right
                      ${tx.status === 'Completed' ? 'text-emerald-400' :
                        tx.status === 'Pending' ? 'text-amber-400' :
                        'text-red-400'}`}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-violet-400/60 py-8">
              No transactions yet
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};