import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { LoadingStates } from '../ui/LoadingStates';

const EnhancedGenesis = React.lazy(() => import('./EnhancedGenesis'));
const GenesisRitual = React.lazy(() => import('./GenesisRitual'));
const InitialDesignation = React.lazy(() => import('./InitialDesignation'));
const DesignationGenerator = React.lazy(() => import('./DesignationGenerator'));

const GenesisFlow: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black text-cyan-50"
        >
            <Suspense fallback={<LoadingStates />}>
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        <EnhancedGenesis />
                        <GenesisRitual />
                        <InitialDesignation />
                        <DesignationGenerator />
                    </div>
                </div>
            </Suspense>
        </motion.div>
    );
};

export default GenesisFlow;