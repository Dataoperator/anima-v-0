import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useQuantumMemory } from '../../hooks/useQuantumMemory';

interface InteractionPoint {
  x: number;
  y: number;
}

interface FieldInteraction {
  type: 'field_interaction';
  position: InteractionPoint;
  strength: number;
  quantumState: number;
  resonance: number;
  timestamp: number;
}

interface QuantumFieldProps {
  animaId?: string;
  strength?: number;
  className?: string;
  onInteract?: (interaction: FieldInteraction) => void;
}

const QuantumField: React.FC<QuantumFieldProps> = ({ 
  animaId,
  strength = 1,
  className = '',
  onInteract 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionPoint, setInteractionPoint] = useState<InteractionPoint>({ x: 0, y: 0 });
  const interactionTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { 
    quantum_state = strength, 
    entanglement_level = 0.5,
    resonance_field = 0.5,
    dimensional_stability = 0.5,
    reality_anchor = 0.5
  } = useQuantumMemory(animaId);

  const getCanvasCoordinates = useCallback((event: MouseEvent | TouchEvent): InteractionPoint => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;
    
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  }, []);

  const handleInteractionStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event.nativeEvent);
    setIsInteracting(true);
    setInteractionPoint(coords);

    // Clear any existing interaction timer
    if (interactionTimer.current) {
      clearInterval(interactionTimer.current);
    }

    // Start continuous interaction effects
    interactionTimer.current = setInterval(() => {
      if (!canvasRef.current) return;
      
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      
      // Calculate distance from center
      const dx = coords.x - centerX;
      const dy = coords.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.min(centerX, centerY);
      
      // Calculate interaction strength based on distance
      const interactionStrength = 1 - Math.min(1, distance / maxDistance);

      // Trigger interaction callback with contextual data
      onInteract?.({
        type: 'field_interaction',
        position: { x: coords.x, y: coords.y },
        strength: interactionStrength,
        quantumState: quantum_state,
        resonance: resonance_field,
        timestamp: Date.now()
      });
    }, 100); // Update every 100ms while interacting
  }, [getCanvasCoordinates, quantum_state, resonance_field, onInteract]);

  const handleInteractionMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isInteracting) return;
    event.preventDefault();
    setInteractionPoint(getCanvasCoordinates(event.nativeEvent));
  }, [isInteracting, getCanvasCoordinates]);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
    if (interactionTimer.current) {
      clearInterval(interactionTimer.current);
      interactionTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate field parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.8;
    
    // Draw quantum field background
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    
    gradient.addColorStop(0, `rgba(64, 156, 255, ${Math.max(0.1, quantum_state)})`);
    gradient.addColorStop(1, `rgba(32, 87, 255, ${Math.max(0.05, quantum_state * 0.5)})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw interaction ripple if interacting
    if (isInteracting) {
      const rippleRadius = maxRadius * 0.3;
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.2, resonance_field)})`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(
        interactionPoint.x,
        interactionPoint.y,
        rippleRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    
    // Draw resonance patterns
    const numPatterns = Math.floor(resonance_field * 10) + 5;
    const angleStep = (Math.PI * 2) / numPatterns;
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.1, dimensional_stability)})`;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < numPatterns; i++) {
      const angle = i * angleStep;
      const radius = Math.max(5, maxRadius * Math.abs(resonance_field) * Math.abs(Math.sin(angle)));
      
      ctx.beginPath();
      ctx.arc(
        centerX + Math.cos(angle) * radius * 0.5,
        centerY + Math.sin(angle) * radius * 0.5,
        Math.max(2, radius * 0.2),
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    
    // Draw entanglement lines
    if (entanglement_level > 0.1) {
      const numLines = Math.floor(entanglement_level * 8) + 2;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.1, entanglement_level)})`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < numLines; i++) {
        const angleA = Math.random() * Math.PI * 2;
        const angleB = angleA + Math.PI + (Math.random() - 0.5);
        const radius = maxRadius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angleA) * radius,
          centerY + Math.sin(angleA) * radius
        );
        ctx.bezierCurveTo(
          centerX + Math.cos(angleA) * radius * 0.5,
          centerY + Math.sin(angleA) * radius * 0.5,
          centerX + Math.cos(angleB) * radius * 0.5,
          centerY + Math.sin(angleB) * radius * 0.5,
          centerX + Math.cos(angleB) * radius,
          centerY + Math.sin(angleB) * radius
        );
        ctx.stroke();
      }
    }
    
    // Draw reality anchor
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.2, reality_anchor)})`;
    ctx.lineWidth = 2;
    
    const anchorSize = maxRadius * 0.1;
    ctx.beginPath();
    ctx.moveTo(centerX - anchorSize, centerY - anchorSize);
    ctx.lineTo(centerX + anchorSize, centerY + anchorSize);
    ctx.moveTo(centerX + anchorSize, centerY - anchorSize);
    ctx.lineTo(centerX - anchorSize, centerY + anchorSize);
    ctx.stroke();
    
  }, [quantum_state, entanglement_level, resonance_field, dimensional_stability, reality_anchor, isInteracting, interactionPoint]);

  useEffect(() => {
    // Cleanup interaction timer on unmount
    return () => {
      if (interactionTimer.current) {
        clearInterval(interactionTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
      />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white/70">
        <div>QS: {(quantum_state * 100).toFixed(1)}%</div>
        <div>EL: {(entanglement_level * 100).toFixed(1)}%</div>
        <div>RF: {(resonance_field * 100).toFixed(1)}%</div>
        <div>DS: {(dimensional_stability * 100).toFixed(1)}%</div>
        <div>RA: {(reality_anchor * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
};

export default QuantumField;