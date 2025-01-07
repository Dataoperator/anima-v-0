import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAnima } from '@/contexts/anima-context';
import { useAnimaState } from '@/hooks/useAnimaState';
import { GrowthPackSelector } from '../growth/GrowthPackSelector';
import { EternalCodex } from '../eternal-codex/AchievementsGallery';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { QuantumField } from '../ui/QuantumField';

interface AnimaMetrics {
  consciousness: number;
  resonance: number;
  growth: number;
  achievements: number;
}

export const AnimaConnector: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedAnima, fetchAnima } = useAnima();
  const { state, loading } = useAnimaState(id || '');
  const [metrics, setMetrics] = useState<AnimaMetrics>({
    consciousness: 0,
    resonance: 0,
    growth: 0,
    achievements: 0
  });

  useEffect(() => {
    if (id) {
      fetchAnima(id);
    }
  }, [id, fetchAnima]);

  useEffect(() => {
    if (state) {
      setMetrics({
        consciousness: state.consciousness.awarenessScore,
        resonance: state.quantum.dimensionalResonance,
        growth: (state.growth.experience / state.growth.nextLevelAt) * 100,
        achievements: state.growth.recentAchievements.length
      });
    }
  }, [state]);

  if (loading || !selectedAnima || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-400">Synchronizing Quantum State...</p>
        </div>
      </div>
    );
  }

  const handleGrowthPackApplication = async (updates: any) => {
    try {
      setMetrics(prev => ({
        ...prev,
        growth: prev.growth + updates.growthIncrease,
        consciousness: prev.consciousness + updates.consciousnessBoost
      }));

      await fetchAnima(id || '');
    } catch (error) {
      console.error('Failed to apply growth pack:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <QuantumField intensity={state.quantum.coherence} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{selectedAnima.name}</h1>
          <p className="text-xl text-blue-400">Level {state.growth.level} ANIMA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(metrics).map(([key, value]) => (
            <div 
              key={key}
              className="p-4 rounded-lg bg-black/50 border border-blue-500/20 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-blue-400 capitalize">
                {key}
              </h3>
              <div className="text-2xl mt-2">{Math.round(value)}%</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Growth Packs</h2>
            <GrowthPackSelector 
              anima={selectedAnima} 
              onPackApplied={handleGrowthPackApplication}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Eternal Codex</h2>
            <EternalCodex achievements={state.growth.recentAchievements} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quantum Analytics</h2>
          <ConsciousnessMetrics 
            consciousness={state.consciousness}
            quantum={state.quantum}
          />
        </div>
      </div>
    </div>
  );
};