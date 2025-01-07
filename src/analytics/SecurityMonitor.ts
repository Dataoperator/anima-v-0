import { Principal } from '@dfinity/principal';

export interface SecurityEvent {
  type: 'Warning' | 'Critical' | 'Info';
  timestamp: Date;
  description: string;
  sourceIP?: string;
  principal?: Principal;
  action?: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  warningEvents: number;
  lastUpdated: Date;
  topThreats: string[];
  activeDefenses: string[];
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private rateLimits = new Map<string, RateLimitConfig>();
  private requestCounts = new Map<string, number[]>();
  private knownPrincipals = new Set<string>();
  private suspiciousActivities = new Map<string, number>();

  public trackEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(securityEvent);
    this.analyzeEvent(securityEvent);
  }

  public getMetrics(): SecurityMetrics {
    const criticalEvents = this.events.filter(e => e.type === 'Critical').length;
    const warningEvents = this.events.filter(e => e.type === 'Warning').length;

    return {
      totalEvents: this.events.length,
      criticalEvents,
      warningEvents,
      lastUpdated: new Date(),
      topThreats: this.getTopThreats(),
      activeDefenses: this.getActiveDefenses()
    };
  }

  public setRateLimit(endpoint: string, config: RateLimitConfig): void {
    this.rateLimits.set(endpoint, config);
  }

  public async checkRateLimit(endpoint: string, principal: Principal): Promise<boolean> {
    const config = this.rateLimits.get(endpoint);
    if (!config) return true;

    const key = `${endpoint}:${principal.toText()}`;
    const now = Date.now();
    const requests = this.requestCounts.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < config.windowMs
    );

    if (validRequests.length >= config.maxRequests) {
      this.trackEvent({
        type: 'Warning',
        description: `Rate limit exceeded for ${endpoint}`,
        principal
      });
      return false;
    }

    validRequests.push(now);
    this.requestCounts.set(key, validRequests);
    return true;
  }

  public isKnownPrincipal(principal: Principal): boolean {
    return this.knownPrincipals.has(principal.toText());
  }

  public addKnownPrincipal(principal: Principal): void {
    this.knownPrincipals.add(principal.toText());
  }

  public async validateTransaction(
    from: Principal,
    to: Principal,
    amount: bigint
  ): Promise<{
    valid: boolean;
    risk: 'Low' | 'Medium' | 'High';
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let risk: 'Low' | 'Medium' | 'High' = 'Low';

    // Check if it's a known principal
    if (!this.isKnownPrincipal(from)) {
      reasons.push('Unknown sender principal');
      risk = 'Medium';
    }

    // Check for suspicious activity patterns
    const senderSuspiciousCount = this.suspiciousActivities.get(from.toText()) || 0;
    if (senderSuspiciousCount > 5) {
      reasons.push('Multiple suspicious activities detected');
      risk = 'High';
    }

    // Check for unusual transaction patterns
    const recentEvents = this.events
      .filter(e => e.principal?.toText() === from.toText())
      .filter(e => Date.now() - e.timestamp.getTime() < 3600000); // Last hour

    if (recentEvents.length > 10) {
      reasons.push('High frequency of transactions');
      risk = Math.max(risk === 'High' ? 2 : risk === 'Medium' ? 1 : 0,
                     1) === 2 ? 'High' : 'Medium';
    }

    // Amount-based validation
    if (amount > BigInt(1000000000)) { // 10 ICP
      reasons.push('Large transaction amount');
      risk = 'High';
    }

    // Validate the receiving principal
    if (!this.isKnownPrincipal(to)) {
      reasons.push('Unknown recipient principal');
      risk = Math.max(risk === 'High' ? 2 : risk === 'Medium' ? 1 : 0,
                     1) === 2 ? 'High' : 'Medium';
    }

    const valid = risk !== 'High';

    if (!valid) {
      this.trackEvent({
        type: 'Critical',
        description: 'High-risk transaction blocked',
        principal: from,
        action: 'block'
      });
    }

    return {
      valid,
      risk,
      reasons
    };
  }

  private analyzeEvent(event: SecurityEvent): void {
    if (event.type === 'Critical') {
      if (event.principal) {
        const currentCount = this.suspiciousActivities.get(event.principal.toText()) || 0;
        this.suspiciousActivities.set(event.principal.toText(), currentCount + 1);
      }

      // Trigger immediate notification for critical events
      this.notifyCriticalEvent(event);
    }

    // Clean up old events (keep last 24 hours)
    this.cleanupOldEvents();
  }

  private cleanupOldEvents(): void {
    const oneDayAgo = Date.now() - 86400000;
    this.events = this.events.filter(event => 
      event.timestamp.getTime() > oneDayAgo
    );
  }

  private getTopThreats(): string[] {
    const threatCounts = new Map<string, number>();
    
    this.events
      .filter(e => e.type === 'Critical')
      .forEach(event => {
        const threat = event.description;
        threatCounts.set(threat, (threatCounts.get(threat) || 0) + 1);
      });

    return Array.from(threatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([threat]) => threat);
  }

  private getActiveDefenses(): string[] {
    const defenses = [
      'Rate Limiting',
      'Principal Validation',
      'Transaction Analysis',
      'Behavioral Monitoring'
    ];

    if (this.events.some(e => e.type === 'Critical')) {
      defenses.push('Enhanced Monitoring');
    }

    return defenses;
  }

  private async notifyCriticalEvent(event: SecurityEvent): Promise<void> {
    // Implement your notification logic here
    console.error('Critical security event:', {
      type: event.type,
      description: event.description,
      timestamp: event.timestamp,
      principal: event.principal?.toText()
    });
  }
}

export const securityMonitor = new SecurityMonitor();