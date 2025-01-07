import React from 'react';
import { TransactionMonitor, Transaction } from '@/services/transaction-monitor';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onRetry?: (transactionId: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions,
  onRetry
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50';
      case 'FAILED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatAmount = (amount: bigint): string => {
    return `${Number(amount) / 100_000_000} ICP`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusColor(transaction.status.status)
                    }`}>
                      {transaction.status.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {transaction.status.status === 'FAILED' && onRetry && (
                      <button
                        onClick={() => onRetry(transaction.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Retry
                      </button>
                    )}
                    {transaction.status.error && (
                      <span className="text-red-500 text-xs ml-2">
                        {transaction.status.error}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};