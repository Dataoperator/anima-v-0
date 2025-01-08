import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useSpring, animated } from '@react-spring/three';

interface QuantumNodeProps {
  coherence: number;
  resonance: number;
  position: [number, number, number];
  intensity: number;
}

const QuantumNode: React.FC<QuantumNodeProps> = ({ 
  coherence, 
  resonance, 
  position, 
  intensity 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const vec = new Vector3();

  useFrame((state) => {
    if (!meshRef.current) return;
    vec.copy(meshRef.current.position);
    vec.y += Math.sin(state.clock.elapsedTime * resonance) * 0.05;
    meshRef.current.position.copy(vec);
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
  });

  const pulseScale = useSpring({
    scale: [coherence, coherence, coherence],
    config: { mass: 1, tension: 100, friction: 10 }
  });

  return (
    <animated.mesh ref={meshRef} position={position} scale={pulseScale.scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhongMaterial
        color={`hsl(${180 + intensity * 40}, 100%, 70%)`}
        emissive={`hsl(${180 + intensity * 40}, 100%, 40%)`}
        transparent
        opacity={0.8}
        wireframe
      />
    </animated.mesh>
  );
};

interface ResonanceLineProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  intensity: number;
}

const ResonanceLine: React.FC<ResonanceLineProps> = ({ startPos, endPos, intensity }) => {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new Vector3(...startPos),
      new Vector3(
        (startPos[0] + endPos[0]) / 2,
        (startPos[1] + endPos[1]) / 2 + 0.5,
        (startPos[2] + endPos[2]) / 2
      ),
      new Vector3(...endPos)
    ]);
    return curve.getPoints(50);
  }, [startPos, endPos]);

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={`hsl(${180 + intensity * 40}, 100%, 70%)`} />
    </line>
  );
};

interface QuantumFieldProps {
  animaId: string;
  quantum_state: {
    coherence: number;
    resonance: number;
    stability: number;
    evolution_rate: number;
  };
}

export const QuantumCore: React.FC<QuantumFieldProps> = ({ 
  quantum_state,
  animaId 
}) => {
  const nodePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle * 2) * 0.5;
      const z = Math.sin(angle) * 2;
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} />

        <group>
          {nodePositions.map((pos, i) => (
            <React.Fragment key={i}>
              <QuantumNode
                position={pos}
                coherence={quantum_state.coherence}
                resonance={quantum_state.resonance}
                intensity={quantum_state.stability}
              />
              {i < nodePositions.length - 1 && (
                <ResonanceLine
                  startPos={pos}
                  endPos={nodePositions[(i + 1) % nodePositions.length]}
                  intensity={quantum_state.evolution_rate}
                />
              )}
            </React.Fragment>
          ))}
        </group>

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default QuantumCore;