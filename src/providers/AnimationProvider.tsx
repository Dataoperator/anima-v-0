import React, { Suspense } from 'react';
import { LazyMotion, domAnimation, MotionConfig, m } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4">Initializing Quantum State...</p>
    </div>
  </div>
);

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyMotion features={domAnimation} strict={false}>
        <MotionConfig reducedMotion="user" transformPagePoint={(p) => p}>
          <m.div initial={false}>
            {children}
          </m.div>
        </MotionConfig>
      </LazyMotion>
    </Suspense>
  );
};