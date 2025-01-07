import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`
      fixed left-[50%] top-[50%] z-50 
      grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] 
      gap-4 border p-6 shadow-lg duration-200 
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children }) => (
  <h2 className="text-lg font-semibold">
    {children}
  </h2>
);

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ className, children }) => (
  <div className={`text-sm opacity-90 ${className}`}>
    {children}
  </div>
);

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
};