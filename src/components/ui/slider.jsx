import * as React from "react";
import { motion } from "framer-motion";

const Slider = React.forwardRef(({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef(null);

  const handleInteraction = (event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.min(Math.max(x / rect.width, 0), 1);
    const newValue = min + Math.round((max - min) * percentage / step) * step;
    onValueChange([newValue]);
  };

  const currentPercentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <motion.div
      ref={ref}
      className={`relative h-6 w-full ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={(e) => isDragging && handleInteraction(e)}
      onClick={handleInteraction}
    >
      <div
        ref={sliderRef}
        className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full bg-white/10"
      >
        <div
          className="absolute h-full rounded-full bg-purple-600"
          style={{ width: `${currentPercentage}%` }}
        />
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-lg"
          style={{ left: `${currentPercentage}%` }}
          animate={{ x: "-50%" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>
    </motion.div>
  );
});

Slider.displayName = "Slider";

export { Slider };