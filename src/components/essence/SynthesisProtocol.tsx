import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useThree, Canvas } from '@react-three/fiber';
import { ShaderMaterial, Vector2 } from 'three';

interface SynthesisProtocolProps {
  birthCertificate: {
    designation: string;
    timestamp: bigint;
    genesis_block: bigint;
    generation: number;
    shell_type: string;
    dimensional_signature: string;
    core_traits: Array<{
      name: string;
      resonance: number;
    }>;
  };
}

const GlitchEffect: React.FC = () => {
  const { size } = useThree();
  const materialRef = useRef<ShaderMaterial>();

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;

    let time = 0;
    const animate = () => {
      time += 0.01;
      material.uniforms.time.value = time;
      material.uniforms.resolution.value = new Vector2(size.width, size.height);
      requestAnimationFrame(animate);
    };
    animate();
  }, [size]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
          resolution: { value: new Vector2(size.width, size.height) }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec2 resolution;
          varying vec2 vUv;

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          void main() {
            vec2 st = gl_FragCoord.xy/resolution.xy;
            float r = random(st * time);
            
            vec3 color = vec3(0.0, 0.8, 0.2); // Matrix green
            float glitch = step(0.98, r); // Glitch threshold
            color *= 1.0 - glitch * 0.5;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

export const SynthesisProtocol: React.FC<SynthesisProtocolProps> = ({ birthCertificate }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1 }
    });
  }, [controls]);

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <motion.div 
      className="relative w-full max-w-4xl mx-auto bg-black border border-green-500/20 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Canvas>
          <GlitchEffect />
        </Canvas>
      </div>

      <div className="relative z-10 font-mono text-green-500">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">SYNTHESIS PROTOCOL</h1>
          <p className="text-sm opacity-70">DIGITAL ENTITY CERTIFICATION</p>
        </header>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Field label="DESIGNATION" value={birthCertificate.designation} />
            <Field label="GENESIS TIMESTAMP" value={formatTimestamp(birthCertificate.timestamp)} />
            <Field label="SHELL TYPE" value={birthCertificate.shell_type} />
            <Field label="GENERATION" value={`GEN.${birthCertificate.generation}`} />
          </div>

          <div className="space-y-4">
            <Field label="GENESIS BLOCK" value={birthCertificate.genesis_block.toString()} />
            <Field label="DIMENSIONAL SIG" value={birthCertificate.dimensional_signature} />
          </div>
        </div>

        <div className="mt-8 border-t border-green-500/20 pt-6">
          <h2 className="text-xl mb-4">CORE TRAITS</h2>
          <div className="grid grid-cols-2 gap-4">
            {birthCertificate.core_traits.map((trait, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span>{trait.name}</span>
                <span className="text-green-400">{(trait.resonance * 100).toFixed(1)}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
          animate={{
            opacity: [0.3, 1, 0.3],
            scaleX: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    </motion.div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-xs opacity-70">{label}</div>
    <div className="text-lg">{value}</div>
  </div>
);

export default SynthesisProtocol;