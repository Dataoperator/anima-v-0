import { Principal } from '@dfinity/principal';
import { hash } from '@dfinity/agent';

export class TransactionLogger {
  static generateTransactionId(principal, timestamp, amount) {
    const data = new TextEncoder().encode(
      `${principal.toString()}-${timestamp}-${amount}`
    );
    return hash(data);
  }

  static createTransactionRecord(principal, amount, type) {
    const timestamp = BigInt(Date.now() * 1000000); // Convert to nanoseconds
    const txId = this.generateTransactionId(principal, timestamp, amount);
    
    return {
      id: txId,
      principal: principal.toString(),
      amount: amount.toString(),
      type,
      timestamp,
      status: 'INITIATED',
      verificationSteps: [],
      retryCount: 0,
      metadata: {}
    };
  }

  static logVerificationStep(record, step, success, details = {}) {
    record.verificationSteps.push({
      step,
      success,
      timestamp: BigInt(Date.now() * 1000000),
      details
    });
    return record;
  }

  static finalizeTransaction(record, success, blockHeight, error = null) {
    record.status = success ? 'COMPLETED' : 'FAILED';
    record.completionTimestamp = BigInt(Date.now() * 1000000);
    record.blockHeight = blockHeight;
    if (error) {
      record.error = {
        message: error.message,
        code: error.code,
        details: error.details
      };
    }
    return record;
  }
}