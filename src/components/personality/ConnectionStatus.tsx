import React from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';

export type ConnectionMode = 'active' | 'polling' | 'inactive';

interface ConnectionStatusProps {
    mode: ConnectionMode;
}

const getStatusDetails = (mode: ConnectionMode) => {
    switch (mode) {
        case 'active':
            return {
                icon: Wifi,
                text: 'Realtime',
                color: 'text-green-500'
            };
        case 'polling':
            return {
                icon: Signal,
                text: 'Polling',
                color: 'text-yellow-500'
            };
        case 'inactive':
            return {
                icon: WifiOff,
                text: 'Disconnected',
                color: 'text-red-500'
            };
    }
};

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ mode }) => {
    const { icon: Icon, text, color } = getStatusDetails(mode);

    return (
        <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className={`text-sm ${color}`}>{text}</span>
        </div>
    );
};