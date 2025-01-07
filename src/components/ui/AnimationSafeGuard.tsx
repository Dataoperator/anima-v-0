import React, { useEffect, useState } from 'react';
import { domAnimation, LazyMotion } from 'framer-motion';

interface AnimationSafeGuardProps {
  children: React.ReactNode;
}

export const AnimationSafeGuard: React.FC<AnimationSafeGuardProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before animations
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
};