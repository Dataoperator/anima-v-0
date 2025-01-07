import { Principal } from '@dfinity/principal';
import { transactionMonitor } from '@/analytics/TransactionMonitor';
import { alertsMonitor } from '@/analytics/AlertsMonitor';
import { cyclesMonitor } from '@/analytics/CyclesMonitor';
import { networkMonitor } from '@/analytics/NetworkMonitor';
import { systemHealthMonitor } from '@/analytics/SystemHealthMonitor';
import { LedgerService } from '@/services/ledger';
import { mockAuthContext } from '@/mocks/mockAuthContext';

describe('System Monitoring Integration', () => {
    let ledgerService: LedgerService;

    beforeEach(async () => {
        localStorage.clear();
        ledgerService = LedgerService.getInstance();
        await ledgerService.initialize(mockAuthContext.identity);

        // Reset all monitoring systems
        transactionMonitor.reset();
        alertsMonitor.clearAlerts();
        cyclesMonitor.reset();
        networkMonitor.reset();
        systemHealthMonitor.reset();
    });

    it('should track transaction metrics across system', async () => {
        // 1. Create Test Transaction
        const transfer = {
            to: 'test-account',
            amount: BigInt(1000000),
            memo: BigInt(1),
            fee: BigInt(10000)
        };

        // 2. Monitor Transaction Creation
        const txPromise = ledgerService.transfer(transfer);
        
        // 3. Verify Initial Monitoring State
        expect(transactionMonitor.getPendingTransactions().length).toBe(1);
        expect(networkMonitor.getActiveConnections()).toBe(1);
        
        // 4. Complete Transaction
        await txPromise;

        // 5. Verify Cross-System Updates
        expect(transactionMonitor.getMetrics().successRate).toBe(100);
        expect(cyclesMonitor.getMetrics().lastTransactionCost).toBeDefined();
        expect(networkMonitor.getMetrics().latency).toBeDefined();
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
    });

    it('should propagate alerts across system components', async () => {
        // 1. Setup Alert Listeners
        const alertHandler = jest.fn();
        const unsubscribe = alertsMonitor.subscribe(alertHandler);

        // 2. Trigger System Events
        systemHealthMonitor.updateStatus('degraded');
        cyclesMonitor.recordUsage(BigInt(1000000000)); // High cycles usage
        networkMonitor.recordLatency(5000); // High latency

        // 3. Verify Alert Creation
        expect(alertHandler).toHaveBeenCalledTimes(3);
        
        // 4. Verify Alert Categories
        const alerts = alertsMonitor.getAlerts();
        expect(alerts.some(a => a.type === 'system')).toBe(true);
        expect(alerts.some(a => a.type === 'performance')).toBe(true);
        expect(alerts.some(a => a.type === 'network')).toBe(true);

        // 5. Cleanup
        unsubscribe();
    });

    it('should track system health metrics comprehensively', async () => {
        // 1. Setup Health Monitoring
        const healthMetrics = {
            memory: 85,
            cpu: 90,
            storage: 75,
            canisterCycles: BigInt(100000000)
        };

        // 2. Update System Metrics
        systemHealthMonitor.updateMetrics(healthMetrics);

        // 3. Verify Alert Generation
        const alerts = alertsMonitor.getAlerts();
        expect(alerts.some(a => a.level === 'warning')).toBe(true);

        // 4. Verify Cycles Monitoring
        expect(cyclesMonitor.shouldOptimize()).toBe(true);

        // 5. Verify Network Impact
        expect(networkMonitor.getMetrics().performanceScore < 1).toBe(true);
    });

    it('should handle canister upgrades monitoring', async () => {
        // 1. Start Upgrade Process
        systemHealthMonitor.startUpgrade();

        // 2. Verify System State
        expect(transactionMonitor.isProcessingPaused()).toBe(true);
        expect(alertsMonitor.getMaintenanceMode()).toBe(true);

        // 3. Monitor Upgrade Progress
        await systemHealthMonitor.upgradeStep('backup');
        await systemHealthMonitor.upgradeStep('migrate');
        await systemHealthMonitor.upgradeStep('verify');

        // 4. Complete Upgrade
        await systemHealthMonitor.completeUpgrade();

        // 5. Verify System Recovery
        expect(transactionMonitor.isProcessingPaused()).toBe(false);
        expect(alertsMonitor.getMaintenanceMode()).toBe(false);
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
    });

    it('should track resource optimization triggers', async () => {
        // 1. Setup Resource Monitoring
        const initialCycles = cyclesMonitor.getMetrics().available;

        // 2. Simulate Heavy Usage
        for (let i = 0; i < 10; i++) {
            await cyclesMonitor.recordUsage(BigInt(1000000));
        }

        // 3. Verify Optimization Triggers
        expect(cyclesMonitor.shouldOptimize()).toBe(true);
        expect(systemHealthMonitor.getOptimizationNeeded()).toBe(true);

        // 4. Verify Alert Generation
        const alerts = alertsMonitor.getAlerts();
        expect(alerts.some(a => a.type === 'performance' && a.level === 'warning')).toBe(true);

        // 5. Verify System Response
        expect(systemHealthMonitor.getStatus()).toBe('degraded');
        expect(networkMonitor.getThrottleLevel() > 0).toBe(true);
    });

    it('should coordinate automated recovery actions', async () => {
        // 1. Trigger System Issues
        networkMonitor.recordError(new Error('Connection timeout'));
        cyclesMonitor.recordLowBalance();
        
        // 2. Verify Recovery Initiation
        expect(systemHealthMonitor.isRecoveryMode()).toBe(true);

        // 3. Monitor Recovery Steps
        const recoverySteps = await systemHealthMonitor.getRecoveryPlan();
        expect(recoverySteps.length).toBeGreaterThan(0);

        // 4. Execute Recovery
        for (const step of recoverySteps) {
            await systemHealthMonitor.executeRecoveryStep(step);
        }

        // 5. Verify System Restoration
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
        expect(networkMonitor.getMetrics().errorRate).toBe(0);
        expect(cyclesMonitor.getMetrics().balanceStatus).toBe('healthy');
    });
});