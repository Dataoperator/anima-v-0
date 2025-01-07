import React, { useState, useEffect } from 'react';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { useAuth } from '@/contexts/auth-context';

interface ErrorSummary {
  category: ErrorCategory;
  count: number;
  lastError?: {
    message: string;
    timestamp: number;
  };
  criticalCount: number;
}

const ErrorDashboard: React.FC = () => {
  const [summaries, setSummaries] = useState<Record<ErrorCategory, ErrorSummary>>({} as any);
  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory | null>(null);
  const [detailedReport, setDetailedReport] = useState<string>('');
  const { isAdmin } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    const updateSummaries = async () => {
      const newSummaries: Record<ErrorCategory, ErrorSummary> = {} as any;
      
      for (const category of Object.values(ErrorCategory)) {
        const report = await errorTracker.getErrorReport(category);
        const errors = JSON.parse(report);
        
        newSummaries[category] = {
          category,
          count: errors.length,
          lastError: errors[0] ? {
            message: errors[0].message,
            timestamp: errors[0].timestamp
          } : undefined,
          criticalCount: errors.filter((e: any) => e.severity === ErrorSeverity.CRITICAL).length
        };
      }
      
      setSummaries(newSummaries);
    };

    if (isAdmin) {
      updateSummaries();
      const interval = setInterval(updateSummaries, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleCategorySelect = async (category: ErrorCategory) => {
    setSelectedCategory(category);
    const report = await errorTracker.getErrorReport(category);
    setDetailedReport(report);
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  const renderSeverityBadge = (severity: ErrorSeverity) => {
    const colors = {
      [ErrorSeverity.LOW]: 'bg-gray-100 text-gray-800',
      [ErrorSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [ErrorSeverity.HIGH]: 'bg-orange-100 text-orange-800',
      [ErrorSeverity.CRITICAL]: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Error Monitoring Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.values(summaries).map((summary) => (
          <button
            key={summary.category}
            onClick={() => handleCategorySelect(summary.category)}
            className={`p-4 rounded-lg border transition-all ${
              selectedCategory === summary.category
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{summary.category}</h3>
              <span className={`rounded-full px-2 py-1 text-sm ${
                summary.count > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {summary.count} errors
              </span>
            </div>
            
            {summary.lastError && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="truncate">Last error: {summary.lastError.message}</p>
                <p className="text-xs">
                  {new Date(summary.lastError.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            {summary.criticalCount > 0 && (
              <div className="mt-2">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {summary.criticalCount} critical
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{selectedCategory} Detailed Report</h3>
            <button
              onClick={() => errorTracker.clearErrors(selectedCategory)}
              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Clear Errors
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {detailedReport || 'No errors found'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDashboard;