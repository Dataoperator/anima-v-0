import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Effects, Text } from '@react-three/drei';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { extend } from '@react-three/fiber';

// Extend Three.js with post-processing effects
extend({ UnrealBloomPass });

const HexagonGrid = () => {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(time.current) * 0.1;
    }
  });

  const geometry = new THREE.CircleGeometry(1, 6);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material}>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[geometry]} />
        <lineBasicMaterial attach="material" color={0x00ffff} />
      </lineSegments>
    </mesh>
  );
};

const FloatingText = ({ text, position }) => {
  const textRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(time.current) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      color="#00ffff"
      fontSize={0.2}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const CyberHUD = ({ className = '' }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={controls}
      className={`relative ${className}`}
    >
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          {/* Hexagon Grid Background */}
          <group position={[0, 0, -5]}>
            {Array.from({ length: 5 }).map((_, i) => (
              <HexagonGrid key={i} position={[i * 2 - 4, 0, 0]} />
            ))}
          </group>

          {/* Floating Text Elements */}
          <FloatingText text="NEURAL SYNC" position={[0, 2, 0]} />
          <FloatingText text="QUANTUM STATE" position={[-2, 1, 0]} />
          <FloatingText text="DIMENSIONAL FLUX" position={[2, 1, 0]} />

          {/* Post-processing Effects */}
          <Effects>
            <unrealBloomPass
              threshold={0.1}
              strength={0.5}
              radius={1}
              exposure={1}
            />
          </Effects>
        </Canvas>
      </div>

      {/* HUD Overlay */}
      <motion.div
        className="relative z-10 p-6 text-cyan-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            <span className="font-mono text-sm">SYSTEM ACTIVE</span>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-60">TIME SYNC</div>
            <div className="font-mono">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Side Elements */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-32">
          <motion.div
            className="w-full h-full bg-cyan-500/20"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Corner Decorations */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8"
            style={{
              top: i < 2 ? 0 : 'auto',
              bottom: i >= 2 ? 0 : 'auto',
              left: i % 2 === 0 ? 0 : 'auto',
              right: i % 2 === 1 ? 0 : 'auto',
            }}
          >
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path
                d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z"
                fill="none"
                stroke="rgba(0, 255, 255, 0.5)"
                strokeWidth="1"
                transform={`rotate(${i * 90} 16 16)`}
              />
            </svg>
          </div>
        ))}

        {/* Content Slots */}
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-black/20 border border-cyan-500/20 rounded p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-xs opacity-60">SLOT {i + 1}</div>
              <div className="h-24 flex items-center justify-center">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" />
                  <motion.div
                    className="absolute inset-0 border-t-2 border-cyan-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CyberHUD;