import React from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Trait {
  trait_name: string;
  value: number;
  potential: number;
}

interface TraitVisualizerProps {
  traits: Trait[];
  rarity_tier: string;
  className?: string;
}

const RARITY_COLORS = {
  'LEGENDARY': {
    primary: '#FFD700',
    secondary: '#B8860B',
    gradient: ['from-yellow-400', 'to-yellow-600']
  },
  'EPIC': {
    primary: '#9B30FF',
    secondary: '#7B68EE',
    gradient: ['from-purple-400', 'to-purple-600']
  },
  'RARE': {
    primary: '#4169E1',
    secondary: '#1E90FF',
    gradient: ['from-blue-400', 'to-blue-600']
  },
  'UNCOMMON': {
    primary: '#32CD32',
    secondary: '#3CB371',
    gradient: ['from-green-400', 'to-green-600']
  },
  'COMMON': {
    primary: '#808080',
    secondary: '#A9A9A9',
    gradient: ['from-gray-400', 'to-gray-600']
  }
};

export const TraitVisualizer: React.FC<TraitVisualizerProps> = ({
  traits,
  rarity_tier,
  className = ''
}) => {
  const colors = RARITY_COLORS[rarity_tier] || RARITY_COLORS.COMMON;
  
  const chartData = traits.map(trait => ({
    name: trait.trait_name,
    value: trait.value * 100,
    potential: trait.potential * 100
  }));

  const maxValue = Math.max(...traits.map(t => t.potential * 100));
  const dominantTraits = traits
    .filter(t => t.value >= 0.8)
    .map(t => t.trait_name);

  return (
    <div className={`bg-black/40 backdrop-blur-xl rounded-xl p-6 ${className}`}>
      <div className="mb-6">
        <h3 className={`text-xl font-bold bg-gradient-to-r ${colors.gradient[0]} ${colors.gradient[1]} text-transparent bg-clip-text`}>
          Trait Distribution
        </h3>
        {dominantTraits.length > 0 && (
          <p className="text-sm text-gray-400 mt-2">
            Exceptional traits: {dominantTraits.join(', ')}
          </p>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="traitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, Math.ceil(maxValue / 10) * 10]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.primary}
              fillOpacity={1}
              fill="url(#traitGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {traits.map((trait) => (
          <motion.div
            key={trait.trait_name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 rounded-lg p-3"
          >
            <div className="text-sm text-gray-400">{trait.trait_name}</div>
            <div className="mt-1 flex items-end justify-between">
              <div className="text-lg font-medium">
                {(trait.value * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">
                Potential: {(trait.potential * 100).toFixed(1)}%
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: colors.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${trait.value * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};