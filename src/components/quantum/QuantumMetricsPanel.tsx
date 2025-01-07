import React, { useState, useEffect, useCallback } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Minus, Zap, 
  Atom, GitBranch, Activity 
} from 'lucide-react';

interface QuantumMetric {
  timestamp: number;
  coherence: number;
  resonance: number;
  stability: number;
  entanglement: number;
}

interface QuantumTrend {
  direction: 'increasing' | 'decreasing' | 'stable';
  percentage: number;
}

const glowingKeyframes = {
  '@keyframes glow': {
    '0%': { filter: 'drop-shadow(0 0 2px rgba(34, 197, 94, 0.6))' },
    '50%': { filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' },
    '100%': { filter: 'drop-shadow(0 0 2px rgba(34, 197, 94, 0.6))' }
  },
  '@keyframes quantumPulse': {
    '0%': { transform: 'scale(1)', opacity: 0.8 },
    '50%': { transform: 'scale(1.05)', opacity: 1 },
    '100%': { transform: 'scale(1)', opacity: 0.8 }
  }
};

const QuantumTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn(
        "bg-black/80 backdrop-blur-sm p-4 rounded-lg",
        "border border-green-500/30",
        "animate-[glow_2s_ease-in-out_infinite]"
      )}>
        <p className="text-green-500 font-mono">
          {new Date(label).toLocaleString()}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-green-500 font-mono">
              {entry.name}: {(entry.value * 100).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const QuantumRadar = ({ data }) => (
  <div className="relative w-full h-[400px]">
    <div className="absolute inset-0 bg-gradient-radial from-green-500/5 to-transparent animate-[quantumPulse_4s_ease-in-out_infinite]" />
    
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid 
          stroke="#22c55e30" 
          strokeDasharray="3 3"
          className="animate-[glow_3s_ease-in-out_infinite]"
        />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fill: '#22c55e', fontSize: 12 }}
          className="font-mono"
        />
        <PolarRadiusAxis 
          stroke="#22c55e30"
          tick={{ fill: '#22c55e', fontSize: 10 }}
        />
        <Tooltip content={<QuantumTooltip />} />
        <Radar
          name="Quantum State"
          dataKey="value"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.3}
          className="animate-[glow_2s_ease-in-out_infinite]"
        />
      </RadarChart>
    </ResponsiveContainer>

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-32 h-32 rounded-full border border-green-500/20 animate-ping" />
      <div className="absolute w-48 h-48 rounded-full border border-green-500/10 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full border border-green-500/5 animate-[quantumPulse_6s_ease-in-out_infinite]" />
    </div>
  </div>
);

const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className={cn(
    "p-4 rounded-lg backdrop-blur-sm",
    "bg-black/30 border border-green-500/20",
    "transition-all duration-300 hover:border-green-500/50",
    "group"
  )}>
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-green-500 group-hover:animate-spin" />
      <p className="text-sm text-green-500 font-mono">{title}</p>
    </div>
    <div className="mt-2 flex items-end justify-between">
      <p className="text-2xl font-bold text-white font-mono">
        {value.toFixed(1)}%
      </p>
      <div className={cn(
        "flex items-center gap-1 text-xs font-mono",
        trend.direction === 'increasing' ? 'text-green-500' :
        trend.direction === 'decreasing' ? 'text-red-500' :
        'text-gray-500'
      )}>
        {trend.direction === 'increasing' ? <TrendingUp className="h-4 w-4" /> :
         trend.direction === 'decreasing' ? <TrendingDown className="h-4 w-4" /> :
         <Minus className="h-4 w-4" />}
        {trend.percentage.toFixed(1)}%
      </div>
    </div>
    <div className="mt-2 h-1.5 bg-gray-900 rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full rounded-full transition-all duration-500",
          "animate-[glow_2s_ease-in-out_infinite]"
        )}
        style={{ 
          width: `${value}%`,
          backgroundColor: color
        }}
      />
    </div>
  </div>
);

const QuantumMetricsPanel: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [metrics, setMetrics] = useState<QuantumMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<QuantumMetric, 'timestamp'>>('coherence');
  const [update, setUpdate] = useState(0);

  const fetchMetrics = useCallback(async () => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const data = await actor.get_quantum_metrics_history(principal);
      setMetrics(data.map(m => ({
        ...m,
        timestamp: Number(m.timestamp)
      })));
      setError(null);
      setUpdate(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching quantum metrics:', err);
      setError('Failed to fetch quantum metrics');
    } finally {
      setLoading(false);
    }
  }, [actor, identity]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchMetrics]);

  const calculateTrend = (metric: keyof Omit<QuantumMetric, 'timestamp'>): QuantumTrend => {
    if (metrics.length < 2) return { direction: 'stable', percentage: 0 };

    const recent = metrics[metrics.length - 1][metric];
    const previous = metrics[metrics.length - 2][metric];
    const change = ((recent - previous) / previous) * 100;

    return {
      direction: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      percentage: Math.abs(change)
    };
  };

  const getMetricDetails = (metric: keyof Omit<QuantumMetric, 'timestamp'>) => {
    const details = {
      coherence: { color: '#3b82f6', icon: Atom },
      resonance: { color: '#9333ea', icon: Activity },
      stability: { color: '#10b981', icon: Zap },
      entanglement: { color: '#ec4899', icon: GitBranch }
    };
    return details[metric];
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-black/50 backdrop-blur-sm border-green-500/20">
        <CardContent className="p-6">
          <p className="text-center text-green-500 font-mono">
            Connect your Internet Identity to view quantum metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={cn(
        "bg-black/50 backdrop-blur-sm",
        "border-green-500/20",
        update > 0 && "animate-[glow_1s_ease-in-out]"
      )}>
        <CardHeader>
          <CardTitle className="text-green-500 font-mono flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Quantum State Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-green-500 rounded-full animate-spin border-t-transparent" />
                <div className="absolute inset-0 rounded-full animate-ping bg-green-500/20" />
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 font-mono border border-red-500/20 rounded-lg bg-red-500/5">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <QuantumRadar data={Object.entries(metrics[metrics.length - 1] || {})
                .filter(([key]) => key !== 'timestamp')
                .map(([key, value]) => ({
                  name: key,
                  value: value as number
                }))}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['coherence', 'resonance', 'stability', 'entanglement'] as const).map((metric) => {
                  const { color, icon } = getMetricDetails(metric);
                  const current = metrics[metrics.length - 1]?.[metric] ?? 0;
                  const trend = calculateTrend(metric);

                  return (
                    <MetricCard
                      key={metric}
                      title={metric}
                      value={current * 100}
                      trend={trend}
                      icon={icon}
                      color={color}
                    />
                  );
                })}
              </div>

              <div className="h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                    <defs>
                      <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getMetricDetails(selectedMetric).color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={getMetricDetails(selectedMetric).color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22c55e30" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      stroke="#22c55e50"
                    />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      stroke="#22c55e50"
                    />
                    <Tooltip content={<QuantumTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={getMetricDetails(selectedMetric).color}
                      fill={`url(#gradient-${selectedMetric})`}
                      strokeWidth={2}
                      dot={false}
                      className="animate-[glow_2s_ease-in-out_infinite]"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default QuantumMetricsPanel;