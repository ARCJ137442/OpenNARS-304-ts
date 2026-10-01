/**
 * Project-owned deterministic 48-bit pseudo-random generator.
 *
 * The translated core needs Java's exact state transition and bit
 * consumption. Keeping it here lets the remaining jree callers use a thin
 * adapter while later clusters migrate their constructor types.
 */
export type ReasonerRandomSeed = bigint | number;

const MULTIPLIER = 0x5deece66dn;
const ADDEND = 0xbn;
const MASK = (1n << 48n) - 1n;
const INT_MAX = 0x7fffffff;
const TWO31 = 2 ** 31;

const normalizeSeed = (seed: ReasonerRandomSeed): bigint => {
    if (typeof seed === "number") {
        if (!Number.isSafeInteger(seed)) {
            throw new RangeError("Reasoner random seed must be a safe integer");
        }
        return BigInt(seed);
    }
    return seed;
};

const defaultSeed = (): bigint => {
    const clock = BigInt(Date.now());
    return clock ^ (clock << 16n);
};

/** Deterministic generator retaining the canonical OpenNARS sequence contract. */
export class ReasonerRandom {
    private state = 0n;

    public constructor(seed: ReasonerRandomSeed = defaultSeed()) {
        this.setSeed(seed);
    }

    public setSeed(seed: ReasonerRandomSeed): void {
        this.state = (normalizeSeed(seed) ^ MULTIPLIER) & MASK;
    }

    /** Return the requested high-order bits from the next LCG state. */
    public next(bits: number): number {
        if (!Number.isInteger(bits) || bits < 0 || bits > 32) {
            throw new RangeError(`Reasoner random bits must be between 0 and 32: ${bits}`);
        }
        this.state = (this.state * MULTIPLIER + ADDEND) & MASK;
        return bits === 0 ? 0 : Number(this.state >> BigInt(48 - bits));
    }

    public nextInt(bound?: number): number {
        if (bound === undefined) {
            const value = this.next(32);
            return value >= 2 ** 31 ? value - 2 ** 32 : value;
        }
        if (!Number.isSafeInteger(bound) || bound <= 0 || bound > INT_MAX) {
            throw new RangeError(`Reasoner random bound must be a positive int: ${bound}`);
        }

        if ((bound & (bound - 1)) === 0) {
            const product = BigInt(bound) * BigInt(this.next(31));
            return Number(product >> 31n);
        }

        while (true) {
            const bits = this.next(31);
            const value = bits % bound;
            // Java performs this expression as a signed 32-bit int. The
            // unsigned comparison below is the same rejection condition.
            if (bits - value + (bound - 1) < TWO31) {
                return value;
            }
        }
    }

    public nextFloat(): number {
        return this.next(24) / 2 ** 24;
    }

    public nextDouble(): number {
        const high = this.next(26);
        const low = this.next(27);
        return (high * 2 ** 27 + low) / 2 ** 53;
    }
}
