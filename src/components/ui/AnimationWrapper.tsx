import React, { useEffect, useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface AnimationWrapperProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  className?: string;
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  initial,
  animate,
  transition,
  className
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};