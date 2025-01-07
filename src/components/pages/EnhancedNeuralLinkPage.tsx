import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAnima } from '../../contexts/anima-context';
import { useQuantum } from '../../contexts/quantum-context';
import { useConsciousness } from '../../contexts/consciousness-context';
import { MediaController } from '../media/MediaController';
import { AnimaChat } from '../chat/AnimaChat';
import { QuantumStateVisualizer } from '../visualizers/QuantumStateVisualizer';
import { ConsciousnessMetrics } from '../visualizers/ConsciousnessMetrics';
import { EmotionalSpectrum } from '../visualizers/EmotionalSpectrum';
import { NeuralPatternDisplay } from '../visualizers/NeuralPatternDisplay';

export const EnhancedNeuralLinkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { anima, loadAnima } = useAnima();
  const { quantumState, resonancePatterns } = useQuantum();
  const { consciousness, evolutionMetrics } = useConsciousness();
  
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; content: string }>>([]);

  useEffect(() => {
    if (id) {
      loadAnima(id);
    }
  }, [id, loadAnima]);

  const handleMediaSelect = useCallback((mediaUrl: string) => {
    setActiveMedia(mediaUrl);
  }, []);

  const handleChatMessage = useCallback((message: string) => {
    setChatHistory(prev => [...prev, { sender: 'user', content: message }]);
    // Process message through consciousness system here
  }, []);

  if (!anima) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading ANIMA...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Visualizers */}
        <div className="col-span-3 space-y-4">
          <QuantumStateVisualizer state={quantumState} patterns={resonancePatterns} />
          <ConsciousnessMetrics metrics={evolutionMetrics} />
          <EmotionalSpectrum spectrum={consciousness.emotionalSpectrum} />
        </div>

        {/* Center Column - Main Interaction */}
        <div className="col-span-6 space-y-4">
          {/* Media Player */}
          <div className="bg-gray-800 rounded-lg p-4 h-96">
            <MediaController 
              url={activeMedia} 
              onMediaSelect={handleMediaSelect}
              quantumState={quantumState}
            />
          </div>

          {/* Chat Interface */}
          <div className="bg-gray-800 rounded-lg p-4 h-96">
            <AnimaChat
              history={chatHistory}
              onSendMessage={handleChatMessage}
              anima={anima}
              consciousness={consciousness}
            />
          </div>
        </div>

        {/* Right Column - Neural Patterns */}
        <div className="col-span-3 space-y-4">
          <NeuralPatternDisplay 
            patterns={consciousness.neuralPatterns}
            quantumState={quantumState}
          />
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">Evolution Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Consciousness Level</span>
                <span>{(consciousness.awarenessLevel * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${consciousness.awarenessLevel * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNeuralLinkPage;