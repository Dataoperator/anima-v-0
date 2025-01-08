import React, { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/hooks/useAuth';
import { PaymentVerification, PaymentVerificationService } from '@/services/payment-verification.service';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { QRCode } from '../ui/QRCode';

interface ICPPaymentPanelProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const ICPPaymentPanel: React.FC<ICPPaymentPanelProps> = ({
  onSuccess,
  onError
}) => {
  const { identity } = useAuth();
  const [paymentAddress, setPaymentAddress] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<PaymentVerification>({ status: 'pending' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generatePaymentDetails = async () => {
      if (!identity) return;

      setIsGenerating(true);
      try {
        // Generate unique payment address for this minting session
        const response = await fetch('/api/generate-payment-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            principal: identity.toString()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate payment address');
        }

        const { address, amount, memo } = await response.json();
        setPaymentAddress(address);

        // Start payment verification
        PaymentVerificationService.waitForVerification(
          identity,
          address,
          BigInt(amount),
          BigInt(memo),
          (status) => {
            setVerificationStatus(status);
            if (status.status === 'verified') {
              onSuccess();
            } else if (status.status === 'failed') {
              onError(status.error || 'Payment verification failed');
            }
          }
        );

      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to generate payment details');
      } finally {
        setIsGenerating(false);
      }
    };

    generatePaymentDetails();
  }, [identity, onSuccess, onError]);

  return (
    <Card className="p-6 bg-black/80 border border-cyan-500/20">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-cyan-500">Genesis Payment</h3>
        
        {isGenerating ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
          </div>
        ) : (
          <>
            {paymentAddress && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QRCode value={paymentAddress} size={200} />
                </div>
                
                <div className="bg-cyan-950/30 p-4 rounded-md">
                  <p className="text-sm font-mono break-all text-cyan-300">{paymentAddress}</p>
                </div>

                <div className="flex justify-between text-sm text-cyan-400">
                  <span>Amount:</span>
                  <span>1.0 ICP</span>
                </div>
              </div>
            )}

            {verificationStatus.status === 'pending' && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertDescription className="text-yellow-300">
                  Awaiting payment confirmation...
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus.status === 'verified' && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <AlertDescription className="text-green-300">
                  Payment verified successfully
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus.status === 'failed' && (
              <Alert variant="destructive">
                <AlertDescription>
                  {verificationStatus.error || 'Payment verification failed'}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        <Button
          onClick={() => window.location.reload()}
          className="w-full mt-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          disabled={isGenerating || verificationStatus.status === 'pending'}
        >
          Retry Payment
        </Button>
      </div>
    </Card>
  );
};

export default ICPPaymentPanel;