import { UpdateType, RealtimeMessage, WebSocketError } from '@/types/realtime';

export class WebSocketService {
    private ws: WebSocket | null = null;
    private messageHandler: ((ev: MessageEvent) => void) | null = null;
    private retryCount = 0;
    private maxRetries = 5;
    private retryTimeout: NodeJS.Timeout | null = null;

    constructor() {
        this.connect();
    }

    private connect(): void {
        const canisterId = process.env.CANISTER_ID_ANIMA;
        const wsUrl = `wss://${canisterId}.icp0.io/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.retryCount = 0;
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.retryConnection();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleError({
                code: 1006,
                message: 'Connection error',
            });
        };

        this.ws.onmessage = (event) => {
            if (this.messageHandler) {
                this.messageHandler(event);
            }
        };
    }

    private retryConnection(): void {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 30000);
            
            this.retryTimeout = setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            this.handleError({
                code: 1000,
                message: 'Maximum retry attempts reached',
            });
        }
    }

    onMessage(handler: (ev: MessageEvent) => void): void {
        this.messageHandler = handler;
    }

    private handleError(error: WebSocketError): void {
        if (this.messageHandler) {
            const errorMessage: RealtimeMessage = {
                type: UpdateType.ERROR,
                anima_id: '',
                error,
                message: error.message
            };
            this.messageHandler(new MessageEvent('message', { 
                data: JSON.stringify(errorMessage) 
            }));
        }
    }

    async subscribe(animaId: string): Promise<void> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }

        const message: RealtimeMessage = {
            type: UpdateType.SUBSCRIBE,
            anima_id: animaId,
            message: `Subscribing to updates for ${animaId}`
        };

        this.ws.send(JSON.stringify(message));
    }

    async unsubscribe(animaId: string): Promise<void> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }

        const message: RealtimeMessage = {
            type: UpdateType.UNSUBSCRIBE,
            anima_id: animaId,
            message: `Unsubscribing from updates for ${animaId}`
        };

        this.ws.send(JSON.stringify(message));
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
        this.messageHandler = null;
    }
}