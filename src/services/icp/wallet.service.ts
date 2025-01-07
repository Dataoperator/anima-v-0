import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Actor } from '@dfinity/agent';
import { idlFactory } from './ledger.did';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { LEDGER_CONFIG } from './ledger';

export type WalletQuantumMetrics = {
    coherenceLevel: number;
    stabilityIndex: number;
    entanglementFactor: number;
    stabilityStatus: 'stable' | 'unstable' | 'critical';
};

export type WalletTransaction = {
    id: string;
    type: 'withdrawal' | 'spend' | 'mint';
    amount: bigint;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    memo?: string;
    quantumMetrics: WalletQuantumMetrics;
    retryCount: number;
};

export class WalletService {
    private static instance: WalletService | null = null;
    private initialized = false;
    private syncInterval: NodeJS.Timeout | null = null;
    private retryInterval: NodeJS.Timeout | null = null;
    private errorTracker: ErrorTracker;
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_INTERVAL = 30000; // 30 seconds
    private readonly STABILITY_THRESHOLD = 0.7;
    private readonly CREATION_COST = BigInt(1_00_000_000); // 1 ICP in e8s
    private ledgerActor: any;

    private state: {
        address: string;
        balance: bigint;
        isLocked: boolean;
        transactions: WalletTransaction[];
        quantumMetrics: WalletQuantumMetrics;
        pendingTransactions: Map<string, WalletTransaction>;
    } | null = null;

    private constructor() {
        this.errorTracker = ErrorTracker.getInstance();
        this.setupRetryMechanism();
    }

    public static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    private setupRetryMechanism(): void {
        this.retryInterval = setInterval(() => {
            this.retryFailedTransactions();
        }, this.RETRY_INTERVAL);
    }

    public getUserAccountIdentifier(userPrincipal: Principal): string {
        return AccountIdentifier.fromPrincipal({
            principal: userPrincipal,
            subAccount: undefined
        }).toHex();
    }

    private verifyAccountIdentifier(principal: string, accountId: string): boolean {
        try {
            const computedAccountId = AccountIdentifier.fromPrincipal({
                principal: Principal.fromText(principal),
                subAccount: undefined
            }).toHex();

            const isValid = computedAccountId === accountId;
            
            console.log('Account Identifier Verification:', {
                principal,
                providedAccountId: accountId,
                computedAccountId,
                isValid,
                timestamp: new Date().toISOString()
            });

            return isValid;
        } catch (error) {
            this.errorTracker.trackError(
                ErrorCategory.PAYMENT,
                error instanceof Error ? error : new Error('Account identifier verification failed'),
                ErrorSeverity.HIGH,
                { principal, accountId }
            );
            return false;
        }
    }

    public async processAnimaCreationPayment(userPrincipal: Principal): Promise<boolean> {
        if (!this.state) throw new Error('Wallet not initialized');
        
        const userAccountId = this.getUserAccountIdentifier(userPrincipal);
        
        // Verify treasury account
        const isValidTreasury = this.verifyAccountIdentifier(
            LEDGER_CONFIG.TREASURY_PRINCIPAL,
            LEDGER_CONFIG.TREASURY_ACCOUNT_ID
        );

        if (!isValidTreasury) {
            throw new Error('Treasury configuration error');
        }

        // Check user's balance
        const balance = await this.ledgerActor.account_balance({
            account: userAccountId
        });

        if (balance.e8s < this.CREATION_COST) {
            throw new Error(`Insufficient balance. Required: ${Number(this.CREATION_COST) / 100_000_000} ICP`);
        }

        console.log('Processing ANIMA Creation Payment:', {
            userAccountId,
            treasuryAccount: LEDGER_CONFIG.TREASURY_ACCOUNT_ID,
            amount: this.CREATION_COST.toString(),
            timestamp: new Date().toISOString()
        });

        const transaction: WalletTransaction = {
            id: crypto.randomUUID(),
            type: 'mint',
            amount: this.CREATION_COST,
            timestamp: Date.now(),
            status: 'pending',
            memo: `ANIMA_CREATION_${Date.now()}`,
            quantumMetrics: this.state.quantumMetrics,
            retryCount: 0
        };

        try {
            // Log pre-transfer state
            console.log('Pre-transfer state:', {
                transactionId: transaction.id,
                userBalance: balance.e8s.toString(),
                quantumMetrics: this.state.quantumMetrics
            });

            // Execute transfer from user's account to treasury
            await this.ledgerActor.transfer({
                to: LEDGER_CONFIG.TREASURY_ACCOUNT_ID,
                amount: { e8s: this.CREATION_COST },
                fee: { e8s: LEDGER_CONFIG.DEFAULT_FEE },
                memo: BigInt(Date.now()),
                from_subaccount: [],
                created_at_time: []
            });

            // Log successful transfer
            console.log('Transfer successful:', {
                transactionId: transaction.id,
                status: 'completed',
                timestamp: new Date().toISOString()
            });

            transaction.status = 'completed';
            this.state.transactions.push(transaction);
            
            // Update local balance
            await this.refreshBalance();
            
            return true;
        } catch (error) {
            // Log transfer failure
            console.error('Transfer failed:', {
                transactionId: transaction.id,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });

            transaction.status = 'failed';
            this.state.transactions.push(transaction);

            this.errorTracker.trackError(
                ErrorCategory.PAYMENT,
                error instanceof Error ? error : new Error('Transfer failed'),
                ErrorSeverity.HIGH,
                { transaction }
            );

            throw error;
        }
    }

    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.ledgerActor = await Actor.createActor(idlFactory, {
                agent: window.ic?.agent,
                canisterId: LEDGER_CONFIG.MAINNET_CANISTER_ID
            });

            this.state = {
                address: await this.generateAddress(),
                balance: BigInt(0),
                isLocked: false,
                transactions: [],
                quantumMetrics: {
                    coherenceLevel: 1.0,
                    stabilityIndex: 1.0,
                    entanglementFactor: 0.0,
                    stabilityStatus: 'stable'
                },
                pendingTransactions: new Map()
            };

            await this.refreshBalance();
            this.startSync();
            this.initialized = true;
        } catch (error) {
            this.errorTracker.trackError({
                type: 'InitializationFailed',
                category: ErrorCategory.System,
                severity: ErrorSeverity.Critical,
                message: error instanceof Error ? error.message : 'Wallet initialization failed',
                timestamp: new Date()
            });
            throw error;
        }
    }

    private async generateAddress(): Promise<string> {
        // For now, we're using a placeholder. In production, this would generate a proper address
        return "sample_address";
    }

    private async retryFailedTransactions(): Promise<void> {
        if (!this.state) return;

        for (const [id, tx] of this.state.pendingTransactions.entries()) {
            if (tx.status === 'failed' && tx.retryCount < this.MAX_RETRIES) {
                try {
                    const userAccountId = this.getUserAccountIdentifier(Principal.fromText(tx.memo?.split('_')[2] || ''));
                    
                    await this.ledgerActor.transfer({
                        to: LEDGER_CONFIG.TREASURY_ACCOUNT_ID,
                        amount: { e8s: tx.amount },
                        fee: { e8s: LEDGER_CONFIG.DEFAULT_FEE },
                        memo: BigInt(tx.timestamp),
                        from_subaccount: [],
                        created_at_time: []
                    });

                    tx.status = 'completed';
                    tx.retryCount++;
                } catch (error) {
                    tx.retryCount++;
                    this.errorTracker.trackError(
                        ErrorCategory.PAYMENT,
                        error instanceof Error ? error : new Error('Retry failed'),
                        ErrorSeverity.HIGH,
                        { transaction: tx }
                    );
                }
            }

            if (tx.retryCount >= this.MAX_RETRIES) {
                this.state.pendingTransactions.delete(id);
                tx.status = 'failed';
            }
        }
    }

    private startSync(): void {
        if (this.syncInterval) return;
        
        this.syncInterval = setInterval(async () => {
            try {
                await this.refreshBalance();
                await this.updateQuantumMetrics();
            } catch (error) {
                console.error('Sync failed:', error);
            }
        }, 30000);
    }

    private async refreshBalance(): Promise<void> {
        if (!this.state || !this.ledgerActor) return;
        
        try {
            const response = await this.ledgerActor.account_balance({
                account: this.state.address
            });
            this.state.balance = response.e8s;
        } catch (error) {
            console.error('Balance refresh failed:', error);
        }
    }

    private async updateQuantumMetrics(): Promise<void> {
        if (!this.state) return;

        const recentTransactions = this.state.transactions.slice(-10);
        const successRate = recentTransactions.filter(tx => tx.status === 'completed').length / recentTransactions.length;

        this.state.quantumMetrics = {
            coherenceLevel: Math.max(0.1, Math.min(1.0, this.state.quantumMetrics.coherenceLevel * (1 + (successRate - 0.5)))),
            stabilityIndex: successRate,
            entanglementFactor: Math.min(1.0, this.state.quantumMetrics.entanglementFactor + 0.1),
            stabilityStatus: this.getStabilityStatus(successRate)
        };
    }

    private getStabilityStatus(stabilityIndex: number): 'stable' | 'unstable' | 'critical' {
        if (stabilityIndex >= this.STABILITY_THRESHOLD) return 'stable';
        if (stabilityIndex >= this.STABILITY_THRESHOLD / 2) return 'unstable';
        return 'critical';
    }

    public getBalance(): bigint {
        if (!this.state) throw new Error('Wallet not initialized');
        return this.state.balance;
    }

    public getQuantumMetrics(): WalletQuantumMetrics {
        if (!this.state) throw new Error('Wallet not initialized');
        return this.state.quantumMetrics;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public dispose(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        if (this.retryInterval) {
            clearInterval(this.retryInterval);
        }
        WalletService.instance = null;
    }

    public formatICP(e8s: bigint): string {
        return `${Number(e8s) / 100_000_000} ICP`;
    }
}

export const walletService = WalletService.getInstance();