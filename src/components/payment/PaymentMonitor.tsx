import React, { useEffect, useState } from 'react';
import { useErrorLogging } from '@/hooks/useErrorLogging';
import { ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { PaymentDetails } from '@/contexts/PaymentContext';

interface PaymentMonitorProps {
  payment: PaymentDetails;
  onStatusChange?: (status: PaymentDetails['status']) => void;
}

export const PaymentMonitor: React.FC<PaymentMonitorProps> = ({
  payment,
  onStatusChange
}) => {
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const { logError } = useErrorLogging(ErrorCategory.PAYMENT);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          logError(
            new Error('Payment timeout'),
            ErrorSeverity.MEDIUM,
            { paymentDetails: payment }
          );
          onStatusChange?.('EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [payment, onStatusChange, logError]);

  const getStatusColor = () => {
    switch (payment.status) {
      case 'CONFIRMING':
        return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50';
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Payment Status</h4>
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor()}`}>
          {payment.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">{payment.amount} ICP</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reference:</span>
          <span className="font-mono bg-gray-100 px-2 rounded">
            {payment.reference}
          </span>
        </div>

        {payment.status === 'PENDING' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 300) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Time remaining: {formatTime(countdown)}
            </p>
          </div>
        )}
      </div>

      {(payment.status === 'ERROR' || payment.status === 'EXPIRED') && (
        <div className={`mt-4 p-3 rounded ${
          payment.status === 'ERROR' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
        }`}>
          <p className="text-sm">
            {payment.status === 'ERROR' 
              ? 'An error occurred while processing your payment. Please try again.'
              : 'This payment has expired. Please initiate a new payment.'}
          </p>
        </div>
      )}
    </div>
  );
};