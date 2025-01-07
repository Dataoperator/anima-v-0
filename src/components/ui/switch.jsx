import * as React from "react";
import { motion } from "framer-motion";

const Switch = React.forwardRef(({ checked = false, onCheckedChange, className }, ref) => {
  return (
    <motion.button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 
        items-center rounded-full 
        transition-colors
        focus-visible:outline-none 
        focus-visible:ring-2
        focus-visible:ring-purple-500
        focus-visible:ring-offset-2
        ${checked ? 'bg-purple-600' : 'bg-white/10'}
        ${className}
      `}
    >
      <motion.span
        initial={false}
        animate={{
          x: checked ? 20 : 2,
        }}
        className={`
          block h-5 w-5 rounded-full 
          bg-white shadow-lg
          transition-transform
        `}
      />
    </motion.button>
  );
});

Switch.displayName = "Switch";

export { Switch };