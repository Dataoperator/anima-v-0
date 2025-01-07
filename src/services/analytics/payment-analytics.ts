import { Principal } from '@dfinity/principal';

export interface PaymentAnalytics {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageConfirmationTime: number;
  totalVolume: bigint;
  averageAmount: bigint;
}

export interface PaymentEvent {
  type: 'INITIATE' | 'CONFIRM' | 'FAIL' | 'EXPIRE';
  timestamp: number;
  amount?: bigint;
  error?: string;
  principal?: Principal;
  reference?: string;
  blockHeight?: string;
}

class PaymentAnalyticsService {
  private events: PaymentEvent[] = [];
  private metrics: PaymentAnalytics = {
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    averageConfirmationTime: 0,
    totalVolume: BigInt(0),
    averageAmount: BigInt(0)
  };

  recordEvent(event: PaymentEvent) {
    this.events.push(event);
    this.updateMetrics(event);
  }

  private updateMetrics(event: PaymentEvent) {
    switch (event.type) {
      case 'INITIATE':
        this.metrics.totalTransactions++;
        break;

      case 'CONFIRM':
        if (event.amount) {
          this.metrics.successfulPayments++;
          this.metrics.totalVolume += event.amount;
          this.metrics.averageAmount = this.metrics.totalVolume / BigInt(this.metrics.successfulPayments);

          // Update confirmation time
          const initEvent = this.findMatchingInitEvent(event);
          if (initEvent) {
            const confirmationTime = event.timestamp - initEvent.timestamp;
            this.metrics.averageConfirmationTime = 
              (this.metrics.averageConfirmationTime * (this.metrics.successfulPayments - 1) + confirmationTime) 
              / this.metrics.successfulPayments;
          }
        }
        break;

      case 'FAIL':
        this.metrics.failedPayments++;
        break;
    }
  }

  private findMatchingInitEvent(confirmEvent: PaymentEvent): PaymentEvent | undefined {
    return this.events.find(e => 
      e.type === 'INITIATE' && 
      e.reference === confirmEvent.reference &&
      e.principal?.toString() === confirmEvent.principal?.toString()
    );
  }

  getMetrics(): PaymentAnalytics {
    return { ...this.metrics };
  }

  getRecentEvents(count: number = 10): PaymentEvent[] {
    return [...this.events]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  getPaymentEventsByPrincipal(principal: Principal): PaymentEvent[] {
    return this.events.filter(e => 
      e.principal?.toString() === principal.toString()
    );
  }

  getSuccessRate(): number {
    if (this.metrics.totalTransactions === 0) return 0;
    return this.metrics.successfulPayments / this.metrics.totalTransactions;
  }

  getAverageConfirmationTime(): number {
    return this.metrics.averageConfirmationTime;
  }

  getVolumeTrend(days: number = 7): { date: string; volume: bigint }[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const trend = new Array(days).fill(null).map((_, i) => {
      const date = new Date(now - (days - 1 - i) * dayMs);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayVolume = this.events
        .filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate.toISOString().split('T')[0] === dateStr &&
                 e.type === 'CONFIRM' &&
                 e.amount !== undefined;
        })
        .reduce((acc, e) => acc + (e.amount || BigInt(0)), BigInt(0));

      return {
        date: dateStr,
        volume: dayVolume
      };
    });

    return trend;
  }
}

export const paymentAnalytics = new PaymentAnalyticsService();