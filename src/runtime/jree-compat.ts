import { Class, JavaObject, java } from "jree";

// jree 1.3.0 uses Java's 48-bit LCG but applies JavaScript bitwise operators
// to the 48-bit state.  That truncates next(>16) to 32 bits, and its
// nextDouble additionally performs integer BigInt division.  OpenNARS uses
// java.util.Random for both probabilistic plugins and randomized unification;
// keep the Java-compatible state at this runtime boundary instead of
// changing translated logic.
type RandomCompat = {
    next?: (bits: number) => number;
    nextInt?: (bound?: number) => number;
    nextFloat?: () => number;
    nextDouble?: () => number;
    setSeed?: (seed: bigint | number) => void;
};

const randomPrototype = java.util.Random.prototype as unknown as RandomCompat;
const randomState = new WeakMap<object, bigint>();
const RANDOM_MULTIPLIER = 0x5deece66dn;
const RANDOM_ADDEND = 0xbn;
const RANDOM_MASK = (1n << 48n) - 1n;

const nextRandomBits = (random: object, bits: number): number => {
    const state = ((randomState.get(random) ?? 0n) * RANDOM_MULTIPLIER + RANDOM_ADDEND) & RANDOM_MASK;
    randomState.set(random, state);
    return Number(state >> BigInt(48 - bits));
};

if (randomPrototype.next && randomPrototype.nextInt && randomPrototype.nextDouble && randomPrototype.setSeed) {
    randomPrototype.setSeed = function setSeed(seed: bigint | number): void {
        randomState.set(this as unknown as object, (BigInt(seed) ^ RANDOM_MULTIPLIER) & RANDOM_MASK);
    };
    randomPrototype.next = function next(bits: number): number {
        return nextRandomBits(this as unknown as object, bits);
    };
    randomPrototype.nextInt = function nextInt(bound?: number): number {
        if (bound === undefined) {
            const value = nextRandomBits(this as unknown as object, 32);
            return value >= 2 ** 31 ? value - 2 ** 32 : value;
        }
        if (bound <= 0) {
            throw new Error("bound must be positive");
        }
        if ((bound & -bound) === bound) {
            return Math.floor((bound * nextRandomBits(this as unknown as object, 31)) / 2 ** 31);
        }
        let bits: number;
        let value: number;
        do {
            bits = nextRandomBits(this as unknown as object, 31);
            value = bits % bound;
        } while (((bits - value + (bound - 1)) | 0) < 0);
        return value;
    };
    randomPrototype.nextFloat = function nextFloat(): number {
        return nextRandomBits(this as unknown as object, 24) / 2 ** 24;
    };
    randomPrototype.nextDouble = function nextDouble(): number {
        return (nextRandomBits(this as unknown as object, 26) * 2 ** 27
            + nextRandomBits(this as unknown as object, 27)) / 2 ** 53;
    };
}

// jree 1.3.0's published JavaObject.class getter passes Function instead of
// the receiver class to Class.fromConstructor(). That collapses every
// translated Java class literal to one token and breaks event dispatch.
const descriptor = Object.getOwnPropertyDescriptor(JavaObject, "class");
if (descriptor?.configurable && descriptor.get) {
    const javaObjectClass = Class.fromConstructor(JavaObject);
    if (JavaObject.class !== javaObjectClass) {
        Object.defineProperty(JavaObject, "class", {
            configurable: true,
            get(this: typeof JavaObject) {
                return Class.fromConstructor(this);
            },
        });
    }
}
