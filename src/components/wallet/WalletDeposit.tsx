import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyIcon, QrCodeIcon, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from '@/components/ui/use-toast';
import { QRCodeCanvas } from '../ui/QRCode';

interface WalletDepositProps {
  depositAddress: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WalletDeposit: React.FC<WalletDepositProps> = ({
  depositAddress,
  onRefresh,
  isRefreshing
}) => {
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      toast({
        title: 'Address Copied',
        description: 'Deposit address has been copied to clipboard',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy address to clipboard',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="p-6 bg-black/30 backdrop-blur border border-purple-500/20">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-purple-400">Your ICP Deposit Address</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-purple-400 hover:text-purple-300"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-black/20 rounded-lg p-3 font-mono text-sm text-white break-all">
            {depositAddress}
          </div>
          <Button
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
            onClick={copyToClipboard}
          >
            <CopyIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCodeIcon className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center py-4"
            >
              <QRCodeCanvas
                value={depositAddress}
                size={200}
                className="bg-white p-2 rounded-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-sm text-gray-400 space-y-2">
          <p>• Send ICP to this address to deposit into your wallet</p>
          <p>• Only send ICP - other tokens will be lost</p>
          <p>• Deposits are typically confirmed within 2 minutes</p>
          <p>• You can swap ICP for ANIMA tokens once deposited</p>
        </div>
      </div>
    </Card>
  );
};

export default WalletDeposit;