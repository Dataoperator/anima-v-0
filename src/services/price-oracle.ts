import { Principal } from '@dfinity/principal';
import { ErrorTracker } from './error-tracker';

export class PriceOracle {
    private static instance: PriceOracle | null = null;
    private errorTracker: ErrorTracker;
    
    // Fixed rate: 1 ICP = 10000 ANIMA
    private readonly FIXED_RATE: bigint = BigInt(10000);

    private constructor() {
        this.errorTracker = ErrorTracker.getInstance();
    }

    static getInstance(): PriceOracle {
        if (!PriceOracle.instance) {
            PriceOracle.instance = new PriceOracle();
        }
        return PriceOracle.instance;
    }

    async getAnimaAmount(icpAmount: bigint): Promise<bigint> {
        return icpAmount * this.FIXED_RATE;
    }

    async getIcpAmount(animaAmount: bigint): Promise<bigint> {
        return animaAmount / this.FIXED_RATE;
    }
}