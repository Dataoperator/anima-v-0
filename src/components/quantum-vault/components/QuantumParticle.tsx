import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { QuantumParticleProps } from '../types';

export const QuantumParticle: React.FC<QuantumParticleProps> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z += delta * 0.3;
      
      // Add subtle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

export default QuantumParticle;