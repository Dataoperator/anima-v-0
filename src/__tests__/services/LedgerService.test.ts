import { Principal } from '@dfinity/principal';
import { LedgerService } from '@/services/ledger';
import { ActorSubclass, HttpAgent } from '@dfinity/agent';
import { LedgerActor } from '@/types/ledger';

// Mock the HttpAgent and Actor
jest.mock('@dfinity/agent');

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key],
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            store = {};
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LedgerService', () => {
    let ledgerService: LedgerService;
    let mockActor: jest.Mocked<ActorSubclass<LedgerActor>>;
    let mockAgent: jest.Mocked<HttpAgent>;

    const mockIdentity = {
        getPrincipal: () => Principal.fromText('2vxsx-fae')
    };

    const mockTransferArgs = {
        to: 'account-id',
        amount: BigInt(1000000),
        memo: BigInt(1),
        fee: BigInt(10000)
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();

        mockActor = {
            icrc1_transfer: jest.fn(),
            icrc1_balance_of: jest.fn(),
            icrc1_transfer_from: jest.fn(),
            transfer: jest.fn(),
            account_balance: jest.fn()
        } as any;

        mockAgent = {
            fetchRootKey: jest.fn().mockResolvedValue(undefined)
        } as any;

        (HttpAgent as jest.Mock).mockImplementation(() => mockAgent);
        (ActorSubclass.createActor as jest.Mock).mockResolvedValue(mockActor);

        ledgerService = LedgerService.getInstance();
        process.env.LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
    });

    describe('Transfer Operations', () => {
        beforeEach(async () => {
            await ledgerService.initialize(mockIdentity);
        });

        it('should handle ICRC-1 transfer successfully', async () => {
            const blockIndex = BigInt(123);
            mockActor.icrc1_transfer.mockResolvedValue({ Ok: blockIndex });

            const result = await ledgerService.transfer(mockTransferArgs);
            expect(result).toEqual({ Ok: blockIndex });

            const tx = await ledgerService.getTransaction(blockIndex);
            expect(tx).toBeTruthy();
            expect(tx?.status).toBe('pending');
            expect(tx?.amount).toBe(mockTransferArgs.amount);
        });

        it('should handle insufficient funds correctly', async () => {
            const error = { InsufficientFunds: { balance: BigInt(500000) } };
            mockActor.icrc1_transfer.mockResolvedValue({ Err: error });

            const result = await ledgerService.transfer(mockTransferArgs);
            expect(result).toEqual({ Err: error });

            const transactions = await ledgerService.getPendingTransactions();
            const failedTx = transactions.find(tx => tx.status === 'failed');
            expect(failedTx).toBeTruthy();
            expect(failedTx?.error).toContain('Insufficient funds');
        });

        it('should handle bad fee errors', async () => {
            const error = { BadFee: { expected_fee: BigInt(20000) } };
            mockActor.icrc1_transfer.mockResolvedValue({ Err: error });

            const result = await ledgerService.transfer(mockTransferArgs);
            expect(result).toEqual({ Err: error });

            const transactions = await ledgerService.getPendingTransactions();
            const failedTx = transactions.find(tx => tx.status === 'failed');
            expect(failedTx?.error).toContain('Incorrect fee');
        });

        it('should handle transaction confirmation timeouts', async () => {
            jest.useFakeTimers();
            const blockIndex = BigInt(123);
            mockActor.icrc1_transfer.mockResolvedValue({ Ok: blockIndex });
            mockActor.icrc1_transfer_from.mockResolvedValue(null);

            await ledgerService.transfer(mockTransferArgs);
            jest.advanceTimersByTime(61000);

            const tx = await ledgerService.getTransaction(blockIndex);
            expect(tx?.status).toBe('failed');
            expect(tx?.error).toContain('Transaction timeout');

            jest.useRealTimers();
        });

        it('should confirm successful transactions', async () => {
            jest.useFakeTimers();
            const blockIndex = BigInt(123);
            mockActor.icrc1_transfer.mockResolvedValue({ Ok: blockIndex });
            mockActor.icrc1_transfer_from.mockResolvedValue({
                amount: mockTransferArgs.amount,
                fee: mockTransferArgs.fee,
                memo: mockTransferArgs.memo
            });

            await ledgerService.transfer(mockTransferArgs);
            jest.advanceTimersByTime(61000);

            const tx = await ledgerService.getTransaction(blockIndex);
            expect(tx?.status).toBe('confirmed');

            jest.useRealTimers();
        });
    });

    describe('Balance Operations', () => {
        beforeEach(async () => {
            await ledgerService.initialize(mockIdentity);
        });

        it('should fetch ICRC-1 balance successfully', async () => {
            const expectedBalance = BigInt(1000000);
            mockActor.icrc1_balance_of.mockResolvedValue(expectedBalance);

            const balance = await ledgerService.getBalance('test-account');
            expect(balance).toBe(expectedBalance);
        });

        it('should handle balance fetch errors gracefully', async () => {
            mockActor.icrc1_balance_of.mockRejectedValue(new Error('Network error'));
            await expect(ledgerService.getBalance('test-account')).rejects.toThrow('Network error');
        });

        it('should handle zero balances correctly', async () => {
            mockActor.icrc1_balance_of.mockResolvedValue(BigInt(0));
            const balance = await ledgerService.getBalance('test-account');
            expect(balance).toBe(BigInt(0));
        });
    });

    describe('Transaction History', () => {
        beforeEach(async () => {
            await ledgerService.initialize(mockIdentity);
        });

        it('should maintain persistent transaction history', async () => {
            const blockIndex = BigInt(123);
            mockActor.icrc1_transfer.mockResolvedValue({ Ok: blockIndex });

            await ledgerService.transfer(mockTransferArgs);
            
            // Simulate service restart
            const newService = LedgerService.getInstance();
            await newService.initialize(mockIdentity);

            const tx = await newService.getTransaction(blockIndex);
            expect(tx).toBeTruthy();
            expect(tx?.amount).toBe(mockTransferArgs.amount);
            expect(tx?.memo).toBe(mockTransferArgs.memo);
        });

        it('should handle corrupt transaction history gracefully', () => {
            localStorage.setItem('ledger_transactions', 'invalid json');
            
            const newService = LedgerService.getInstance();
            expect(() => newService.initialize(mockIdentity)).not.toThrow();
        });

        it('should manage pending transactions correctly', async () => {
            // Create multiple test transactions
            for (let i = 0; i < 5; i++) {
                mockActor.icrc1_transfer.mockResolvedValue({ Ok: BigInt(i) });
                await ledgerService.transfer({
                    ...mockTransferArgs,
                    amount: BigInt(1000000 + i)
                });
            }

            const pending = await ledgerService.getPendingTransactions();
            expect(pending.length).toBe(5);
            expect(pending.every(tx => tx.status === 'pending')).toBe(true);
        });
    });

    describe('Resource Management', () => {
        beforeEach(async () => {
            await ledgerService.initialize(mockIdentity);
        });

        it('should clean up resources on destroy', async () => {
            const blockIndex = BigInt(123);
            mockActor.icrc1_transfer.mockResolvedValue({ Ok: blockIndex });

            await ledgerService.transfer(mockTransferArgs);
            ledgerService.destroy();

            expect(ledgerService.isInitialized()).toBe(false);
            expect(await ledgerService.getPendingTransactions()).toHaveLength(0);
        });

        it('should handle concurrent transactions', async () => {
            const transfers = Array(5).fill(0).map((_, i) => ({
                ...mockTransferArgs,
                amount: BigInt(1000000 + i)
            }));

            mockActor.icrc1_transfer.mockImplementation(async (args) => ({
                Ok: BigInt(Math.floor(Math.random() * 1000))
            }));

            await Promise.all(transfers.map(t => ledgerService.transfer(t)));
            const pending = await ledgerService.getPendingTransactions();
            expect(pending).toHaveLength(5);
        });
    });

    describe('Error Handling', () => {
        beforeEach(async () => {
            await ledgerService.initialize(mockIdentity);
        });

        it('should handle network errors gracefully', async () => {
            mockActor.icrc1_transfer.mockRejectedValue(new Error('Network failure'));

            await expect(ledgerService.transfer(mockTransferArgs)).rejects.toThrow('Network failure');
            const transactions = await ledgerService.getPendingTransactions();
            const failedTx = transactions.find(tx => tx.status === 'failed');
            expect(failedTx?.error).toBe('Network failure');
        });

        it('should handle timeouts properly', async () => {
            jest.useFakeTimers();
            
            const networkDelay = new Promise((resolve) => setTimeout(resolve, 70000));
            mockActor.icrc1_transfer.mockImplementation(() => networkDelay);

            const transferPromise = ledgerService.transfer(mockTransferArgs);
            jest.advanceTimersByTime(61000);

            await expect(transferPromise).rejects.toThrow();
            
            jest.useRealTimers();
        });
    });
});