import { Principal } from '@dfinity/principal';
import { LedgerService } from '@/services/ledger';
import { RealtimeService } from '@/services/RealtimeService';
import { transactionMonitor } from '@/analytics/TransactionMonitor';
import { systemHealthMonitor } from '@/analytics/SystemHealthMonitor';
import { networkMonitor } from '@/analytics/NetworkMonitor';
import { alertsMonitor } from '@/analytics/AlertsMonitor';
import { AnimaService } from '@/services/AnimaService';
import { PersonalityState } from '@/types/personality';
import { mockAuthContext } from '@/mocks/mockAuthContext';

describe('System Flow Integration', () => {
    let ledgerService: LedgerService;
    let realtimeService: RealtimeService;
    let animaService: AnimaService;

    beforeEach(async () => {
        // Initialize all services
        ledgerService = LedgerService.getInstance();
        await ledgerService.initialize(mockAuthContext.identity);
        
        realtimeService = new RealtimeService('ws://localhost:8080');
        await realtimeService.connect();

        animaService = new AnimaService(mockAuthContext.actor);

        // Reset monitoring systems
        transactionMonitor.reset();
        systemHealthMonitor.reset();
        networkMonitor.reset();
        alertsMonitor.clearAlerts();
    });

    afterEach(async () => {
        await realtimeService.disconnect();
    });

    it('should handle complete anima creation flow', async () => {
        // 1. Start Creation Process
        const creationTx = await ledgerService.transfer({
            to: 'anima-canister',
            amount: BigInt(1000000),
            memo: BigInt(1),
            fee: BigInt(10000)
        });

        // 2. Verify Transaction Monitoring
        expect(transactionMonitor.getTransaction(creationTx.id)).toBeDefined();
        expect(networkMonitor.getActiveConnections()).toBeGreaterThan(0);

        // 3. Create Anima
        const anima = await animaService.createAnima('TestAnima');
        expect(anima.id).toBeDefined();

        // 4. Verify Real-time Connection
        await realtimeService.subscribe(anima.id);
        const state = await new Promise<PersonalityState>((resolve) => {
            realtimeService.addEventListener((update) => {
                if (update.type === 'UPDATE' && update.anima_id === anima.id) {
                    resolve(update.data);
                }
            });
        });

        // 5. Verify System State
        expect(state.growth_level).toBe(1);
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
        expect(alertsMonitor.getAlerts()).toHaveLength(0);
    });

    it('should handle system stress conditions', async () => {
        // 1. Create Multiple Concurrent Operations
        const operations = Array(10).fill(0).map(async (_, i) => {
            // Simulate various system operations
            await Promise.all([
                ledgerService.transfer({
                    to: 'test-account',
                    amount: BigInt(100000 * (i + 1)),
                    memo: BigInt(i),
                    fee: BigInt(10000)
                }),
                realtimeService.connect(),
                animaService.getSystemMetrics()
            ]);
        });

        // 2. Monitor System Performance
        const initialHealth = systemHealthMonitor.getStatus();
        await Promise.all(operations);
        const finalHealth = systemHealthMonitor.getStatus();

        // 3. Verify System Response
        expect(networkMonitor.getMetrics().concurrentConnections).toBeGreaterThan(5);
        expect(alertsMonitor.getAlerts().length).toBeGreaterThan(0);

        // 4. Check Recovery
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
    });

    it('should maintain data consistency across services', async () => {
        // 1. Create Initial State
        const anima = await animaService.createAnima('ConsistencyTest');
        await realtimeService.subscribe(anima.id);

        // 2. Perform Multiple Updates
        const updates = [
            animaService.updatePersonality(anima.id, { growth_level: 2 }),
            ledgerService.transfer({
                to: 'growth-payment',
                amount: BigInt(500000),
                memo: BigInt(2),
                fee: BigInt(10000)
            }),
            animaService.addMemory(anima.id, 'Test memory')
        ];

        await Promise.all(updates);

        // 3. Verify State Consistency
        const finalState = await animaService.getAnimaState(anima.id);
        const txs = transactionMonitor.getTransactions();
        const memories = await animaService.getMemories(anima.id);

        expect(finalState.growth_level).toBe(2);
        expect(txs.length).toBe(2); // Creation + Growth
        expect(memories).toHaveLength(1);
    });

    it('should handle service interruptions gracefully', async () => {
        // 1. Setup Initial State
        const anima = await animaService.createAnima('InterruptionTest');
        
        // 2. Simulate Network Interruption
        networkMonitor.simulateDisconnection();
        await realtimeService.disconnect();

        // 3. Attempt Operations During Interruption
        const interruptedOps = Promise.all([
            animaService.updatePersonality(anima.id, { growth_level: 3 }),
            ledgerService.transfer({
                to: 'test-transfer',
                amount: BigInt(300000),
                memo: BigInt(3),
                fee: BigInt(10000)
            })
        ]);

        // 4. Verify Error Handling
        await expect(interruptedOps).rejects.toThrow();
        expect(alertsMonitor.getAlerts().some(a => a.level === 'error')).toBe(true);

        // 5. Verify Recovery
        networkMonitor.simulateReconnection();
        await realtimeService.connect();
        
        const recoveredState = await animaService.getAnimaState(anima.id);
        expect(recoveredState).toBeDefined();
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
    });

    it('should handle system upgrades with data preservation', async () => {
        // 1. Create Initial Data
        const anima = await animaService.createAnima('UpgradeTest');
        await realtimeService.subscribe(anima.id);
        
        const initialState = await animaService.getAnimaState(anima.id);

        // 2. Simulate System Upgrade
        systemHealthMonitor.startUpgrade();
        expect(alertsMonitor.getMaintenanceMode()).toBe(true);

        // 3. Perform Upgrade Steps
        await systemHealthMonitor.upgradeStep('backup');
        await systemHealthMonitor.upgradeStep('migrate');
        await systemHealthMonitor.upgradeStep('verify');

        // 4. Complete Upgrade
        await systemHealthMonitor.completeUpgrade();

        // 5. Verify Data Preservation
        const postUpgradeState = await animaService.getAnimaState(anima.id);
        expect(postUpgradeState).toEqual(initialState);
        
        // 6. Verify System Recovery
        expect(systemHealthMonitor.getStatus()).toBe('healthy');
        expect(networkMonitor.getActiveConnections()).toBeGreaterThan(0);
        expect(alertsMonitor.getMaintenanceMode()).toBe(false);
    });

    it('should maintain audit trail across system events', async () => {
        // 1. Create Auditable Events
        const anima = await animaService.createAnima('AuditTest');
        const events = [
            ledgerService.transfer({
                to: 'audit-test',
                amount: BigInt(200000),
                memo: BigInt(4),
                fee: BigInt(10000)
            }),
            animaService.updatePersonality(anima.id, { growth_level: 4 }),
            realtimeService.subscribe(anima.id)
        ];

        await Promise.all(events);

        // 2. Verify Transaction Records
        const txs = transactionMonitor.getTransactions();
        expect(txs.length).toBeGreaterThan(0);
        expect(txs[0].id).toBeDefined();

        // 3. Verify System Events
        const systemEvents = systemHealthMonitor.getEventLog();
        expect(systemEvents.length).toBeGreaterThan(0);

        // 4. Verify Network Activity
        const networkEvents = networkMonitor.getActivityLog();
        expect(networkEvents.length).toBeGreaterThan(0);

        // 5. Cross-reference Events
        const allEvents = [...txs, ...systemEvents, ...networkEvents];
        expect(allEvents.every(e => e.timestamp)).toBe(true);
    });
});