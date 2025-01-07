import { motion } from 'framer-motion';

// Quantum animation variants
export const quantum = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Default transition for quantum effects
export const defaultTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  duration: 0.3
};

// Export motion components for consistent use
export const Motion = {
  div: motion.div,
  button: motion.button,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  img: motion.img,
  svg: motion.svg,
  path: motion.path
};