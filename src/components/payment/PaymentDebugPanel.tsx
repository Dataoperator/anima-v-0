import React, { useState, useEffect } from 'react';
import { ErrorTracker, ErrorCategory } from '@/services/error-tracker';
import { usePayment } from '@/contexts/PaymentContext';

export const PaymentDebugPanel: React.FC = () => {
  const [errorReport, setErrorReport] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const { currentPayment, ledgerService } = usePayment();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    const fetchErrorReport = async () => {
      const report = await errorTracker.getErrorReport(ErrorCategory.PAYMENT);
      setErrorReport(report);
    };

    if (isVisible) {
      fetchErrorReport();
      const interval = setInterval(fetchErrorReport, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, currentPayment]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg opacity-50 hover:opacity-100"
      >
        Show Debug Panel
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 text-white p-4 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Payment Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Current Payment Status</h4>
          <div className="bg-gray-800 p-2 rounded text-sm">
            <pre className="whitespace-pre-wrap">
              {currentPayment ? JSON.stringify(currentPayment, null, 2) : 'No active payment'}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-2">Ledger Status</h4>
          <div className="bg-gray-800 p-2 rounded">
            <p className="text-sm">
              Initialized: {ledgerService?.isInitialized() ? 'Yes' : 'No'}
            </p>
            <p className="text-sm">
              Host: {ledgerService?.getHost() || 'Not connected'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-2">Recent Errors</h4>
          <div className="bg-gray-800 p-2 rounded max-h-60 overflow-y-auto">
            <pre className="text-xs text-red-400 whitespace-pre-wrap">
              {errorReport || 'No errors reported'}
            </pre>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => errorTracker.clearErrors(ErrorCategory.PAYMENT)}
            className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
          >
            Clear Errors
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-sm text-gray-400 mb-2">Debug Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                errorTracker.trackError(
                  ErrorCategory.PAYMENT,
                  new Error('Test Error'),
                  'HIGH',
                  { test: true }
                );
              }}
              className="bg-yellow-900 hover:bg-yellow-800 text-white px-3 py-1 rounded text-sm"
            >
              Trigger Test Error
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-purple-900 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm"
            >
              Reset Local Storage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};