import { AlertAction } from '@/types/metrics';

declare global {
    interface Window {
        ic: {
            canister: {
                call: (canisterId: string, methodName: string, args?: any) => Promise<any>;
            };
        };
    }
}

export async function getSystemAlerts(animaId: string) {
    if (!window.ic) {
        throw new Error('IC object not found in window');
    }
    return await window.ic.canister.call(animaId, 'get_system_alerts');
}

export async function handleAlertAction(alertId: string, action: AlertAction) {
    if (!window.ic) {
        throw new Error('IC object not found in window');
    }
    return await window.ic.canister.call(alertId, 'handle_alert', { action });
}