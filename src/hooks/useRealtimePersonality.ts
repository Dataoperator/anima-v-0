import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { RealtimeService } from '@/services/realtime';
import {
    UpdateType,
    RealtimeHookState,
    PersonalityUpdate,
    WebSocketError,
} from '@/types/realtime';

export const useRealtimePersonality = (animaId: string | undefined) => {
    const { actor } = useAuth();
    const [realtimeService, setRealtimeService] = useState<RealtimeService | null>(null);
    const [state, setState] = useState<RealtimeHookState>({
        personality: {
            timestamp: BigInt(0),
            growth_level: 0,
            quantum_traits: {},
            base_traits: {},
        },
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!actor || !animaId) return;

        const service = new RealtimeService(actor);
        setRealtimeService(service);

        const handleUpdate = (update: PersonalityUpdate) => {
            switch (update.type) {
                case UpdateType.UPDATE:
                    if (update.data) {
                        setState((prev) => ({
                            ...prev,
                            personality: update.data,
                            loading: false,
                            error: null,
                        }));
                    }
                    break;

                case UpdateType.ERROR:
                    setState((prev) => ({
                        ...prev,
                        error: update.error || { 
                            code: 500, 
                            message: 'Unknown error' 
                        },
                        loading: false,
                    }));
                    break;

                case UpdateType.CONNECTED:
                    console.log('Connected to realtime updates');
                    break;

                case UpdateType.DISCONNECTED:
                    console.log('Disconnected from realtime updates');
                    break;
            }
        };

        const initializePersonality = async () => {
            try {
                await service.subscribe(animaId, handleUpdate);
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    error: {
                        code: 500,
                        message: error instanceof Error ? error.message : 'Failed to initialize personality',
                    },
                    loading: false,
                }));
            }
        };

        initializePersonality();

        return () => {
            if (service) {
                service.unsubscribe(animaId);
            }
        };
    }, [actor, animaId]);

    return state;
};

export default useRealtimePersonality;