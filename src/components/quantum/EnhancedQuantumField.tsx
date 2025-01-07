import React, { useEffect, useRef, useState } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { interpolateColors } from '../../utils/colorUtils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  entangled?: boolean;
  entangledWith?: number;
}

interface QuantumFieldState {
  energy_density: number;
  particle_count: number;
  entanglement_factor: number;
  field_stability: number;
}

const NUM_PARTICLES = 100;

const EnhancedQuantumField: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fieldState, setFieldState] = useState<QuantumFieldState | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();

  // Initialize particles with quantum properties
  const initializeParticles = (state: QuantumFieldState) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * state.field_stability,
        vy: (Math.random() - 0.5) * state.field_stability,
        energy: Math.random() * state.energy_density,
        entangled: Math.random() < state.entanglement_factor
      });
    }

    // Create entangled pairs
    for (let i = 0; i < newParticles.length; i++) {
      if (newParticles[i].entangled && !newParticles[i].entangledWith) {
        for (let j = i + 1; j < newParticles.length; j++) {
          if (newParticles[j].entangled && !newParticles[j].entangledWith) {
            newParticles[i].entangledWith = j;
            newParticles[j].entangledWith = i;
            break;
          }
        }
      }
    }

    return newParticles;
  };

  useEffect(() => {
    const fetchQuantumField = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_quantum_field_state(principal);
        setFieldState(state);
        setParticles(initializeParticles(state));
        setError(null);
      } catch (err) {
        console.error('Error fetching quantum field:', err);
        setError('Failed to fetch quantum field state');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchQuantumField();
      const interval = setInterval(fetchQuantumField, 10000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  useEffect(() => {
    if (!canvasRef.current || !fieldState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const updateParticles = (particles: Particle[]) => {
      return particles.map(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary checks with energy preservation
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.energy *= fieldState.field_stability;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.energy *= fieldState.field_stability;
        }

        // Quantum tunneling effect at boundaries
        if (Math.random() < 0.001) {
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }

        return particle;
      });
    };

    const drawField = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles and their connections
      particles.forEach((particle, index) => {
        // Particle color based on energy
        const color = interpolateColors(
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(147, 51, 234, 0.8)',  // Purple
          particle.energy / fieldState.energy_density
        );

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2 + particle.energy * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw entanglement connections
        if (particle.entangled && particle.entangledWith !== undefined) {
          const entangledParticle = particles[particle.entangledWith];
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(entangledParticle.x, entangledParticle.y);
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.2)';
          ctx.stroke();
        }

        // Draw energy field effects
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = `${color.split(')')[0]}, 0.1)`;
        ctx.fill();
      });

      setParticles(updateParticles(particles));
      animationRef.current = requestAnimationFrame(drawField);
    };

    animationRef.current = requestAnimationFrame(drawField);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fieldState, particles]);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Connect your Internet Identity to view quantum field
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quantum Field Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <canvas 
                ref={canvasRef}
                className="w-full h-96 rounded-lg bg-background"
                style={{ width: '100%', height: '384px' }}
              />
              
              {fieldState && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Energy Density</p>
                    <p className="text-lg font-bold">
                      {(fieldState.energy_density * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Particles</p>
                    <p className="text-lg font-bold">
                      {fieldState.particle_count}
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Entanglement</p>
                    <p className="text-lg font-bold">
                      {(fieldState.entanglement_factor * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Field Stability</p>
                    <p className="text-lg font-bold">
                      {(fieldState.field_stability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedQuantumField;