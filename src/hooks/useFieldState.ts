import { useState, useEffect } from 'react';

interface FieldState {
  fieldStrength: number;
  resonanceFrequency: number;
  harmonicIndex: number;
  fieldSignature: string;
}

export const useFieldState = () => {
  const [state, setState] = useState<FieldState>({
    fieldStrength: 0,
    resonanceFrequency: 0,
    harmonicIndex: 0,
    fieldSignature: ''
  });

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const updateFieldState = () => {
      if (!mounted) return;

      const fieldStrength = 0.3 + Math.random() * 0.4;
      const resonanceFrequency = Math.random();
      
      setState({
        fieldStrength,
        resonanceFrequency,
        harmonicIndex: Math.random(),
        fieldSignature: Math.random().toString(36).substring(2)
      });
    };

    updateFieldState();
    intervalId = setInterval(updateFieldState, 2000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return state;
};