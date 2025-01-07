import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useQuantumMemory } from '../../hooks/useQuantumMemory';

const QuantumField = ({ animaId, onInteract }) => {
  const canvasRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionPoint, setInteractionPoint] = useState({ x: 0, y: 0 });
  const interactionTimer = useRef(null);
  
  const { 
    quantum_state, 
    entanglement_level,
    resonance_field,
    dimensional_stability,
    reality_anchor
  } = useQuantumMemory(animaId);

  const getCanvasCoordinates = useCallback((event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  }, []);

  const handleInteractionStart = useCallback((event) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    setIsInteracting(true);
    setInteractionPoint(coords);

    // Clear any existing interaction timer
    if (interactionTimer.current) {
      clearInterval(interactionTimer.current);
    }

    // Start continuous interaction effects
    interactionTimer.current = setInterval(() => {
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      
      // Calculate distance from center
      const dx = coords.x - centerX;
      const dy = coords.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.min(centerX, centerY);
      
      // Calculate interaction strength based on distance
      const strength = 1 - Math.min(1, distance / maxDistance);

      // Trigger interaction callback with contextual data
      onInteract?.({
        type: 'field_interaction',
        position: { x: coords.x, y: coords.y },
        strength,
        quantumState: quantum_state,
        resonance: resonance_field,
        timestamp: Date.now()
      });
    }, 100); // Update every 100ms while interacting
  }, [getCanvasCoordinates, quantum_state, resonance_field, onInteract]);

  const handleInteractionMove = useCallback((event) => {
    if (!isInteracting) return;
    event.preventDefault();
    setInteractionPoint(getCanvasCoordinates(event));
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
    <div className="relative w-full h-full min-h-[400px]">
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