import styled, { keyframes, css } from 'styled-components';

// Keyframe Animations
export const quantumPulse = keyframes`
  0% { 
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    transform: scale(1);
  }
  70% { 
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    transform: scale(1.02);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    transform: scale(1);
  }
`;

export const quantumGlow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.8)); }
  100% { filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.6)); }
`;

export const quantumFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Base Styles
const quantumBase = css`
  --quantum-primary: #3b82f6;
  --quantum-secondary: #8b5cf6;
  --quantum-accent: #10b981;
  --quantum-glow: #22c55e;
`;

// Styled Components
export const QuantumContainer = styled.div`
  ${quantumBase}
  position: relative;
  background: radial-gradient(circle at center, rgba(0, 255, 127, 0.05), transparent);
`;

export const QuantumParticle = styled.div`
  animation: ${quantumPulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const QuantumText = styled.span`
  font-family: 'JetBrains Mono', monospace;
  color: rgba(34, 197, 94, 0.9);
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
`;

export const QuantumHUD = styled.div`
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

export const QuantumDataStream = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: 'JetBrains Mono', monospace;
  animation: ${quantumFloat} 3s ease-in-out infinite;
`;

export const QuantumBlur = styled.div`
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

export const QuantumGradient = styled.div`
  background: linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
`;

// Theme Provider
export const quantumTheme = {
  colors: {
    primary: 'var(--quantum-primary)',
    secondary: 'var(--quantum-secondary)',
    accent: 'var(--quantum-accent)',
    glow: 'var(--quantum-glow)'
  },
  animations: {
    pulse: quantumPulse,
    glow: quantumGlow,
    float: quantumFloat
  }
};