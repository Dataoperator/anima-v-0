import { Principal } from '@dfinity/principal';

export interface UserActivity {
  userId: Principal;
  action: 'mint' | 'interact' | 'grow' | 'trade' | 'resurrect';
  timestamp: Date;
  details: Record<string, any>;
}

export interface UserMetrics {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
  averageSessionLength: number;
  retentionRate: number;
  newUsersToday: number;
  totalInteractions: number;
}

export interface UserBehaviorPattern {
  mostActiveHours: number[];
  popularFeatures: { feature: string; usage: number }[];
  averageGrowthRate: number;
  churnRisk: 'Low' | 'Medium' | 'High';
}

class UserAnalyticsMonitor {
  private activities: UserActivity[] = [];
  private userSessions = new Map<string, Date>();
  private firstTimeUsers = new Set<string>();
  
  public trackActivity(activity: UserActivity): void {
    this.activities.push(activity);
    this.updateSessions(activity);
    
    if (activity.action === 'mint') {
      this.firstTimeUsers.add(activity.userId.toText());
    }
  }

  public getMetrics(): UserMetrics {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const uniqueUsers = new Set(this.activities.map(a => a.userId.toText()));
    const activeToday = new Set(
      this.activities
        .filter(a => a.timestamp >= dayAgo)
        .map(a => a.userId.toText())
    );
    const activeThisWeek = new Set(
      this.activities
        .filter(a => a.timestamp >= weekAgo)
        .map(a => a.userId.toText())
    );
    const activeThisMonth = new Set(
      this.activities
        .filter(a => a.timestamp >= monthAgo)
        .map(a => a.userId.toText())
    );

    const newUsersToday = Array.from(this.firstTimeUsers)
      .filter(id => {
        const firstActivity = this.activities.find(a => 
          a.userId.toText() === id && a.action === 'mint'
        );
        return firstActivity && firstActivity.timestamp >= dayAgo;
      }).length;

    const retentionRate = this.calculateRetentionRate();

    return {
      totalUsers: uniqueUsers.size,
      activeToday: activeToday.size,
      activeThisWeek: activeThisWeek.size,
      activeThisMonth: activeThisMonth.size,
      averageSessionLength: this.calculateAverageSessionLength(),
      retentionRate,
      newUsersToday,
      totalInteractions: this.activities.length
    };
  }

  public getBehaviorPattern(userId: Principal): UserBehaviorPattern {
    const userActivities = this.activities
      .filter(a => a.userId.toText() === userId.toText());

    const hours = userActivities
      .map(a => a.timestamp.getHours());
    
    const mostActiveHours = this.getMostFrequent(hours, 3);

    const features = userActivities
      .map(a => a.action);
    
    const popularFeatures = Array.from(
      features.reduce((acc, curr) => {
        acc.set(curr, (acc.get(curr) || 0) + 1);
        return acc;
      }, new Map<string, number>())
    ).map(([feature, usage]) => ({ feature, usage }))
     .sort((a, b) => b.usage - a.usage);

    const growthRate = this.calculateGrowthRate(userActivities);
    const churnRisk = this.assessChurnRisk(userActivities);

    return {
      mostActiveHours,
      popularFeatures,
      averageGrowthRate: growthRate,
      churnRisk
    };
  }

  private updateSessions(activity: UserActivity): void {
    const userId = activity.userId.toText();
    const lastActivity = this.userSessions.get(userId);
    
    if (!lastActivity || 
        activity.timestamp.getTime() - lastActivity.getTime() > 30 * 60 * 1000) {
      // Start new session if no previous activity or gap > 30 minutes
      this.userSessions.set(userId, activity.timestamp);
    }
  }

  private calculateAverageSessionLength(): number {
    const sessions: number[] = [];
    let currentSession: { start: Date; end: Date } | null = null;
    
    // Sort activities by user and time
    const sortedActivities = [...this.activities].sort((a, b) => {
      const userCompare = a.userId.toText().localeCompare(b.userId.toText());
      if (userCompare !== 0) return userCompare;
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    for (let i = 0; i < sortedActivities.length; i++) {
      const activity = sortedActivities[i];
      const nextActivity = sortedActivities[i + 1];

      if (!currentSession) {
        currentSession = { start: activity.timestamp, end: activity.timestamp };
      } else if (
        !nextActivity || 
        nextActivity.userId.toText() !== activity.userId.toText() ||
        nextActivity.timestamp.getTime() - activity.timestamp.getTime() > 30 * 60 * 1000
      ) {
        // End session
        currentSession.end = activity.timestamp;
        sessions.push(
          (currentSession.end.getTime() - currentSession.start.getTime()) / 1000 / 60
        );
        currentSession = null;
      }
    }

    return sessions.length ? 
      sessions.reduce((sum, length) => sum + length, 0) / sessions.length : 
      0;
  }

  private calculateRetentionRate(): number {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newLastWeek = Array.from(this.firstTimeUsers)
      .filter(id => {
        const firstActivity = this.activities.find(a => 
          a.userId.toText() === id && a.action === 'mint'
        );
        return firstActivity && 
          firstActivity.timestamp >= weekAgo &&
          firstActivity.timestamp < dayAgo;
      });

    const returnedUsers = newLastWeek.filter(id => 
      this.activities.some(a => 
        a.userId.toText() === id && 
        a.timestamp >= dayAgo
      )
    );

    return newLastWeek.length ? 
      (returnedUsers.length / newLastWeek.length) * 100 : 
      100;
  }

  private calculateGrowthRate(activities: UserActivity[]): number {
    if (activities.length < 2) return 0;

    const sortedActivities = [...activities]
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const firstActivity = sortedActivities[0];
    const lastActivity = sortedActivities[sortedActivities.length - 1];
    const daysDiff = (lastActivity.timestamp.getTime() - firstActivity.timestamp.getTime()) / 
                    (1000 * 60 * 60 * 24);

    return activities.length / (daysDiff || 1);
  }

  private assessChurnRisk(activities: UserActivity[]): UserBehaviorPattern['churnRisk'] {
    if (activities.length === 0) return 'High';

    const lastActivity = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    const daysSinceLastActivity = 
      (new Date().getTime() - lastActivity.timestamp.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastActivity > 7) return 'High';
    if (daysSinceLastActivity > 3) return 'Medium';
    return 'Low';
  }

  private getMostFrequent(arr: number[], n: number): number[] {
    const frequency = arr.reduce((acc, curr) => {
      acc.set(curr, (acc.get(curr) || 0) + 1);
      return acc;
    }, new Map<number, number>());

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([hour]) => hour);
  }
}

export const userAnalyticsMonitor = new UserAnalyticsMonitor();