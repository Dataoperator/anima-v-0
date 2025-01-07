import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
};

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
        </div>
    );
};

export default Loader;