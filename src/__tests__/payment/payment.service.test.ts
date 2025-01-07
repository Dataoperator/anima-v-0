import { PaymentService, PaymentType } from '@/services/icp/payment.service';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import { mockLedgerActor } from '../mocks/ledger';
import { TransactionLogger } from '@/services/transaction-logger';

jest.mock('@/services/icp/actor', () => ({
  createLedgerActor: jest.fn().mockImplementation(() => mockLedgerActor)
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockIdentity: Identity;
  let mockPrincipal: Principal;

  beforeEach(async () => {
    mockPrincipal = Principal.fromText('2vxsx-fae');
    mockIdentity = {
      getPrincipal: () => mockPrincipal
    } as Identity;

    paymentService = new PaymentService(mockIdentity);
    await paymentService.initialize();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      expect(paymentService.isInitialized()).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      jest.spyOn(mockLedgerActor, 'account_balance').mockRejectedValueOnce(new Error('Network error'));
      const service = new PaymentService(mockIdentity);
      await expect(service.initialize()).resolves.not.toThrow();
    });
  });

  describe('Payment Creation', () => {
    it('should create valid payment details', async () => {
      const payment = await paymentService.createPayment('MINT');
      expect(payment).toMatchObject({
        type: 'MINT',
        amount: expect.any(BigInt),
        reference: expect.any(String),
        timestamp: expect.any(Number)
      });
    });

    it('should validate payment amounts', async () => {
      await expect(
        paymentService.createPayment('MINT')
      ).resolves.toBeTruthy();
    });

    it('should generate unique references', async () => {
      const payment1 = await paymentService.createPayment('MINT');
      const payment2 = await paymentService.createPayment('MINT');
      expect(payment1.reference).not.toBe(payment2.reference);
    });
  });

  describe('Payment Processing', () => {
    it('should detect successful payments', async () => {
      const payment = await paymentService.createPayment('MINT');
      
      // Mock balance changes
      jest.spyOn(mockLedgerActor, 'account_balance')
        .mockResolvedValueOnce({ e8s: BigInt(200_000_000) })
        .mockResolvedValueOnce({ e8s: BigInt(100_000_000) });
      
      const result = await paymentService.processPayment(payment);
      expect(result).toBe(true);
    });

    it('should handle timeouts appropriately', async () => {
      const payment = await paymentService.createPayment('MINT');
      
      // Mock no balance change
      jest.spyOn(mockLedgerActor, 'account_balance')
        .mockResolvedValue({ e8s: BigInt(200_000_000) });
      
      await expect(
        paymentService.processPayment(payment)
      ).rejects.toThrow('VERIFICATION_TIMEOUT');
    });

    it('should handle network errors during processing', async () => {
      const payment = await paymentService.createPayment('MINT');
      
      jest.spyOn(mockLedgerActor, 'account_balance')
        .mockRejectedValue(new Error('Network error'));
      
      await expect(
        paymentService.processPayment(payment)
      ).rejects.toThrow('PROCESS_FAILED');
    });
  });

  describe('Balance Checking', () => {
    it('should return correct balance', async () => {
      const mockBalance = { e8s: BigInt(100_000_000) };
      jest.spyOn(mockLedgerActor, 'account_balance')
        .mockResolvedValue(mockBalance);
      
      const balance = await paymentService.getBalance(mockPrincipal);
      expect(balance).toBe(mockBalance.e8s);
    });

    it('should validate principal IDs', async () => {
      const invalidPrincipal = Principal.anonymous();
      await expect(
        paymentService.getBalance(invalidPrincipal)
      ).rejects.toThrow('INVALID_PRINCIPAL');
    });
  });
});