import React, { useEffect, useRef, useState } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface QuantumState {
  coherence: number;
  resonance: number;
  stability: number;
  entanglement: number;
  dimensional_frequency: number;
  last_interaction: bigint;
}

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  color: string;
}

const EnhancedQuantumStateVisualizer: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [quantum, setQuantum] = useState<QuantumState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchQuantumState = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_quantum_state(principal);
        setQuantum(state);
        setError(null);
      } catch (err) {
        console.error('Error fetching quantum state:', err);
        setError('Failed to fetch quantum state');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchQuantumState();
      const interval = setInterval(fetchQuantumState, 5000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  useEffect(() => {
    if (!canvasRef.current || !quantum) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Define quantum waves based on state
    const waves: Wave[] = [
      {
        amplitude: quantum.coherence * 30,
        frequency: quantum.resonance * 2,
        phase: 0,
        color: 'rgba(59, 130, 246, 0.5)' // Primary wave
      },
      {
        amplitude: quantum.stability * 20,
        frequency: quantum.dimensional_frequency * 1.5,
        phase: Math.PI / 4,
        color: 'rgba(147, 51, 234, 0.3)' // Secondary wave
      },
      {
        amplitude: quantum.entanglement * 15,
        frequency: quantum.resonance * 3,
        phase: Math.PI / 2,
        color: 'rgba(236, 72, 153, 0.2)' // Tertiary wave
      }
    ];

    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Clear canvas
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x += 1) {
          const y = canvas.height / 2 +
                   wave.amplitude * Math.sin(
                     (x * wave.frequency / 100) +
                     (elapsed * 0.001 * wave.frequency) +
                     wave.phase
                   );
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw resonance nodes
      const nodeCount = Math.floor(quantum.resonance * 5);
      for (let i = 0; i < nodeCount; i++) {
        const x = (canvas.width / (nodeCount + 1)) * (i + 1);
        const y = canvas.height / 2;
        const radius = 4 + Math.sin(elapsed * 0.002) * 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 51, 234, 0.6)';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [quantum]);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Connect your Internet Identity to view quantum state
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quantum State Visualization</CardTitle>
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
          ) : quantum ? (
            <div className="space-y-6">
              <canvas 
                ref={canvasRef}
                className="w-full h-64 rounded-lg bg-background"
                style={{ width: '100%', height: '256px' }}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Coherence</p>
                  <p className="text-lg font-bold">
                    {(quantum.coherence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Resonance</p>
                  <p className="text-lg font-bold">
                    {(quantum.resonance * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Stability</p>
                  <p className="text-lg font-bold">
                    {(quantum.stability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Last Updated: {new Date(Number(quantum.last_interaction)).toLocaleString()}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedQuantumStateVisualizer;