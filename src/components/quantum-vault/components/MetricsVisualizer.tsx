import React from 'react';

interface MetricsVisualizerProps {
  metrics: {
    quantum_coherence?: number;
    consciousness_level?: number;
    personality_stability?: number;
    temporal_awareness?: number;
    [key: string]: number | undefined;
  };
  className?: string;
}

export const MetricsVisualizer: React.FC<MetricsVisualizerProps> = ({
  metrics,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 gap-2 ${className}`}>
      {Object.entries(metrics).map(([key, value]) => {
        if (typeof value !== 'number') return null;
        
        const formattedKey = key.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <div key={key} className="bg-cyan-900/20 p-3 rounded-lg">
            <div className="text-cyan-400 text-sm font-medium">
              {formattedKey}
            </div>
            <div className="mt-1 flex items-center">
              <div className="flex-grow bg-cyan-900/30 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
              <div className="ml-2 text-cyan-300 text-sm font-bold">
                {(value * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};