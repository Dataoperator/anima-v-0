import React, { useEffect, useRef, useState } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface DimensionalState {
  resonance: number;
  frequency: number;
  stability: number;
  phase_shift: number;
  interference_pattern: number[];
}

interface Dimension {
  id: number;
  resonance: number;
  frequency: number;
  phase: number;
  connections: number[];
}

const EnhancedDimensionalView: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [dimensionalState, setDimensionalState] = useState<DimensionalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchDimensionalState = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_dimensional_state(principal);
        setDimensionalState(state);
        
        // Generate connected dimensions based on interference pattern
        const dimensionCount = state.interference_pattern.length;
        const newDimensions: Dimension[] = Array.from({ length: dimensionCount }, (_, i) => ({
          id: i,
          resonance: state.resonance * (1 + Math.sin(i / dimensionCount * Math.PI * 2) * 0.2),
          frequency: state.frequency * (1 + Math.cos(i / dimensionCount * Math.PI * 2) * 0.2),
          phase: state.phase_shift * i,
          connections: []
        }));

        // Create dimensional connections based on resonance patterns
        for (let i = 0; i < dimensionCount; i++) {
          for (let j = i + 1; j < dimensionCount; j++) {
            if (Math.abs(state.interference_pattern[i] - state.interference_pattern[j]) < 0.2) {
              newDimensions[i].connections.push(j);
              newDimensions[j].connections.push(i);
            }
          }
        }

        setDimensions(newDimensions);
        setError(null);
      } catch (err) {
        console.error('Error fetching dimensional state:', err);
        setError('Failed to fetch dimensional state');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDimensionalState();
      const interval = setInterval(fetchDimensionalState, 5000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  useEffect(() => {
    if (!canvasRef.current || !dimensionalState || dimensions.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    const drawDimensions = (timestamp: number) => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw dimensional connections
      dimensions.forEach(dimension => {
        dimension.connections.forEach(connectedId => {
          const angle1 = (dimension.id / dimensions.length) * Math.PI * 2;
          const angle2 = (connectedId / dimensions.length) * Math.PI * 2;
          const x1 = centerX + Math.cos(angle1 + timestamp * 0.001) * radius;
          const y1 = centerY + Math.sin(angle1 + timestamp * 0.001) * radius;
          const x2 = centerX + Math.cos(angle2 + timestamp * 0.001) * radius;
          const y2 = centerY + Math.sin(angle2 + timestamp * 0.001) * radius;

          // Draw quantum entanglement lines
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          const controlX = (x1 + x2) / 2 + Math.sin(timestamp * 0.002) * 50;
          const controlY = (y1 + y2) / 2 + Math.cos(timestamp * 0.002) * 50;
          ctx.quadraticCurveTo(controlX, controlY, x2, y2);
          ctx.strokeStyle = `rgba(147, 51, 234, ${dimension.resonance * 0.2})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw resonance nodes at intersection points
          ctx.beginPath();
          ctx.arc(controlX, controlY, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236, 72, 153, ${dimension.resonance * 0.5})`;
          ctx.fill();
        });
      });

      // Draw dimensions
      dimensions.forEach(dimension => {
        const angle = (dimension.id / dimensions.length) * Math.PI * 2 + timestamp * 0.001;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw dimension node
        ctx.beginPath();
        ctx.arc(x, y, 8 + dimension.resonance * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.5 + dimension.resonance * 0.5})`;
        ctx.fill();

        // Draw frequency waves
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const waveRadius = 15 + i * 3;
          const waveIntensity = Math.sin(timestamp * 0.003 * dimension.frequency + i * 0.5);
          ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0, waveIntensity * 0.1)})`;
          ctx.stroke();
        }

        // Draw phase indicator
        const phaseX = x + Math.cos(dimension.phase + timestamp * 0.002) * 15;
        const phaseY = y + Math.sin(dimension.phase + timestamp * 0.002) * 15;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(phaseX, phaseY);
        ctx.strokeStyle = `rgba(16, 185, 129, ${dimension.resonance})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw central quantum core
      const coreRadius = 20 + Math.sin(timestamp * 0.002) * 5;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius
      );
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(drawDimensions);
    };

    animationRef.current = requestAnimationFrame(drawDimensions);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, dimensionalState]);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Connect your Internet Identity to view dimensional state
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quantum Dimensional Analysis</CardTitle>
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
              
              {dimensionalState && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Resonance</p>
                    <p className="text-lg font-bold">
                      {(dimensionalState.resonance * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="text-lg font-bold">
                      {(dimensionalState.frequency * 100).toFixed(1)} Hz
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Stability</p>
                    <p className="text-lg font-bold">
                      {(dimensionalState.stability * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Phase Shift</p>
                    <p className="text-lg font-bold">
                      {(dimensionalState.phase_shift * 180 / Math.PI).toFixed(1)}°
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

export default EnhancedDimensionalView;