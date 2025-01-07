import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useICPLedger } from '@/hooks/useICPLedger';
import { QRCodeCanvas } from '@/components/ui/QRCode';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const GENESIS_FEE = "1.00";
const WALLET_ADDRESS = "ryjl3-tyaaa-aaaaa-aaaba-cai"; // Treasury wallet

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const { ledger } = useICPLedger();
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      setError('Failed to copy address');
    }
  };

  const verifyPayment = async () => {
    if (!ledger) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      const balance = await ledger.getBalance();
      const icpBalance = Number(balance) / 100_000_000;
      
      if (icpBalance >= 1) {
        onSuccess();
      } else {
        setError('Payment not yet received. Please ensure you have sent at least 1 ICP.');
      }
    } catch (err) {
      setError('Failed to verify payment. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <div className="bg-gray-900 rounded-lg border border-purple-500/20 p-6 max-w-md w-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-purple-400 mb-6">Add ICP</h2>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeCanvas
                    value={WALLET_ADDRESS}
                    size={200}
                    level="H"
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Treasury Wallet</div>
                <div className="flex items-center justify-between">
                  <code className="text-purple-300 break-all mr-2">{WALLET_ADDRESS}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {copying ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Required Amount</div>
                <div className="text-2xl font-bold text-purple-300">{GENESIS_FEE} ICP</div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Verify Button */}
              <Button
                onClick={verifyPayment}
                disabled={verifying}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {verifying ? 'Verifying Payment...' : 'I have sent the ICP'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;