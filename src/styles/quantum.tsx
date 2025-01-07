import styled, { keyframes } from 'styled-components';

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

export const QuantumContainer = styled.div`
  position: relative;
  background: radial-gradient(circle at center, rgba(0, 255, 127, 0.05), transparent);
`;

export const QuantumParticle = styled.div`
  animation: ${quantumPulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

// ... other styled components