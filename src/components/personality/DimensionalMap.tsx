import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Trail } from '@react-three/drei';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface DimensionalMapProps {
  consciousness: number;
  harmony: number;
  className?: string;
}

interface ConsciousnessNodeProps {
  position: [number, number, number];
  intensity: number;
  pulseSpeed?: number;
  connectionStrength?: number;
}

const ConsciousnessField = ({ nodes, consciousness, harmony }: {
  nodes: { position: [number, number, number]; intensity: number }[];
  consciousness: number;
  harmony: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      consciousness: { value: consciousness },
      harmony: { value: harmony }
    },
    vertexShader: `
      varying vec3 vPosition;
      varying float vIntensity;
      void main() {
        vPosition = position;
        vIntensity = distance(position, vec3(0.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float consciousness;
      uniform float harmony;
      varying vec3 vPosition;
      varying float vIntensity;
      
      void main() {
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        float intensity = smoothstep(0.0, 1.0, consciousness) * pulse;
        vec3 color = mix(
          vec3(0.545, 0.361, 0.965), // Purple
          vec3(0.388, 0.400, 0.945), // Indigo
          harmony
        );
        float alpha = (1.0 - vIntensity * 0.5) * intensity;
        gl_FragColor = vec4(color, alpha);
      }
    `
  }), [consciousness, harmony]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 * harmony;
      groupRef.current.rotation.x += 0.001 * consciousness;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <ConsciousnessNode
          key={i}
          position={node.position}
          intensity={node.intensity}
          pulseSpeed={1 + consciousness}
          connectionStrength={harmony}
        />
      ))}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <shaderMaterial ref={materialRef} {...shaderArgs} transparent />
      </mesh>
    </group>
  );
};

const ConsciousnessNode: React.FC<ConsciousnessNodeProps> = ({
  position,
  intensity,
  pulseSpeed = 1,
  connectionStrength = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [trailPositions, setTrailPositions] = useState<[number, number, number][]>([]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const offsetX = Math.sin(time * pulseSpeed) * 0.2;
      const offsetY = Math.cos(time * pulseSpeed * 1.3) * 0.2;
      const offsetZ = Math.sin(time * pulseSpeed * 0.7) * 0.2;

      meshRef.current.position.x = position[0] + offsetX;
      meshRef.current.position.y = position[1] + offsetY;
      meshRef.current.position.z = position[2] + offsetZ;

      const newPosition: [number, number, number] = [
        meshRef.current.position.x,
        meshRef.current.position.y,
        meshRef.current.position.z
      ];
      setTrailPositions(prev => [...prev.slice(-50), newPosition]);
    }
  });

  return (
    <>
      <Trail
        width={connectionStrength * 2}
        length={intensity * 10}
        color={new THREE.Color(0x6366f1)}
        attenuation={(t) => {
          return t * t;
        }}
        target={meshRef}
      />
      <Sphere ref={meshRef} position={position} args={[0.1, 16, 16]}>
        <meshPhysicalMaterial
          color={`hsl(${240 + intensity * 60}, 80%, 70%)`}
          emissive={`hsl(${240 + intensity * 60}, 80%, 40%)`}
          emissiveIntensity={intensity}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
        />
      </Sphere>
    </>
  );
};

export const DimensionalMap: React.FC<DimensionalMapProps> = ({
  consciousness,
  harmony,
  className = ''
}) => {
  const controls = useAnimation();
  const nodes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.5 + Math.sin(i) * 0.5;
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(i * 0.5) * radius,
          Math.sin(angle) * radius
        ] as [number, number, number],
        intensity: 0.5 + Math.sin(i) * 0.5
      };
    });
  }, []);

  useEffect(() => {
    controls.start({
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <motion.div
        className={`relative w-full h-[300px] ${className}`}
        animate={controls}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <ConsciousnessField
            nodes={nodes}
            consciousness={consciousness}
            harmony={harmony}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
        </Canvas>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm">
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            Consciousness Level: {(consciousness * 100).toFixed(1)}%
          </div>
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            Harmonic Resonance: {(harmony * 100).toFixed(1)}%
          </div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};