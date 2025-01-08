import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useAnimaContext } from '@/contexts/AnimaContext';
import { useQuantumState } from '@/hooks/useQuantumState';
import { MediaActionSystem } from '@/autonomous/MediaActions';
import { EnhancedChat } from '../chat/EnhancedChat';
import { AnimaMediaInterface } from '../media/AnimaMediaInterface';
import { MatrixRain } from '../ui/MatrixRain';
import { useGenesisSound } from '@/hooks/useGenesisSound';

interface UnifiedNeuralLinkProps {
  animaId: string;
}

export const UnifiedNeuralLink: React.FC<UnifiedNeuralLinkProps> = ({ animaId }) => {
  const { quantumState } = useQuantumState();
  const { anima, messages } = useAnimaContext();
  const { playPhase } = useGenesisSound();
  const [mediaSystem] = useState(() => new MediaActionSystem());
  const [showMedia, setShowMedia] = useState(false);
  const visualizationRef = useRef<THREE.Group>(null);

  // Quantum state animations
  const quantumSpring = useSpring({
    scale: quantumState?.coherence_level || 0,
    rotation: (quantumState?.dimensional_frequency || 0) * Math.PI,
    config: { tension: 170, friction: 26 }
  });

  const handleMediaCommand = async (command: string) => {
    if (command.toLowerCase().includes('play') || command.toLowerCase().includes('watch')) {
      const urls = await mediaSystem.searchMedia(command);
      if (urls.length > 0) {
        mediaSystem.processAction({
          type: 'play',
          source: 'youtube',
          payload: { url: urls[0] }
        });
        setShowMedia(true);
        playPhase('media_start');
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <MatrixRain className="opacity-20" />
      </div>

      {/* 3D Visualization Layer */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <EffectComposer>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.3}
            />
          </EffectComposer>

          <animated.group 
            ref={visualizationRef}
            scale={quantumSpring.scale}
            rotation-y={quantumSpring.rotation}
          >
            {/* Quantum Field Visualization */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshPhongMaterial 
                color="#00ffff"
                opacity={0.5}
                transparent
                wireframe
              />
            </mesh>
          </animated.group>
        </Canvas>
      </div>

      {/* Neural Interface Layer */}
      <div className="absolute inset-0 z-20 grid grid-cols-12 gap-4 p-4">
        {/* Chat Interface */}
        <div className="col-span-8 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30">
          <EnhancedChat 
            animaId={animaId}
            onMediaCommand={handleMediaCommand}
          />
        </div>

        {/* Stats & Controls */}
        <div className="col-span-4 space-y-4">
          {/* Quantum Metrics */}
          <div className="p-4 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30">
            <h3 className="text-cyan-400 mb-2">Quantum Resonance</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-300">Coherence</span>
                <span className="text-cyan-400">{(quantumState?.coherence_level || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cyan-300">Resonance</span>
                <span className="text-cyan-400">{(quantumState?.dimensional_frequency || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Media Player */}
          {showMedia && (
            <div className="relative">
              <AnimaMediaInterface 
                animaId={animaId}
                onClose={() => setShowMedia(false)}
                className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedNeuralLink;