/**
 * Node/parity-only compatibility entry for translated Java runtime objects.
 *
 * The reasoning core imports project-owned contracts from `runtime`; this
 * module is the single npm-jree boundary retained while the remaining boxed
 * Java I/O and reflection shapes are migrated. Browser builds must replace
 * this entry at the host boundary.
 */
import { Class, JavaObject, java } from "jree";
import { JavaException, JavaThrowable } from "../../runtime/JavaExceptions.ts";
import { JavaRandom } from "../../runtime/JavaRandom.ts";

export { Class, JavaObject, java };
export type JavaStringInput = java.lang.String | string;

/** Convert native text only at a Node/Jree host boundary. */
export const toJavaString = (value: JavaStringInput): java.lang.String =>
    value instanceof java.lang.String ? value : new java.lang.String(value);

/** Observe both project-owned and legacy jree exceptions at the Node edge. */
export const isJavaThrowable = (value: unknown): value is JavaThrowable =>
    value instanceof JavaThrowable || value instanceof java.lang.Throwable;

export const isJavaException = (value: unknown): value is JavaException =>
    value instanceof JavaException || value instanceof java.lang.Exception;

type RandomCompat = {
    next?: (bits: number) => number;
    nextInt?: (bound?: number) => number;
    nextFloat?: () => number;
    nextDouble?: () => number;
    setSeed?: (seed: bigint | number) => void;
};

const randomPrototype = java.util.Random.prototype as unknown as RandomCompat;
const randomInstances = new WeakMap<object, JavaRandom>();
const randomInstance = (random: object): JavaRandom => {
    const existing = randomInstances.get(random);
    if (existing !== undefined) return existing;
    const created = new JavaRandom(0n);
    randomInstances.set(random, created);
    return created;
};

if (randomPrototype.next && randomPrototype.nextInt && randomPrototype.nextDouble && randomPrototype.setSeed) {
    randomPrototype.setSeed = function setSeed(seed: bigint | number): void { randomInstance(this as object).setSeed(seed); };
    randomPrototype.next = function next(bits: number): number { return randomInstance(this as object).next(bits); };
    randomPrototype.nextInt = function nextInt(bound?: number): number { return randomInstance(this as object).nextInt(bound); };
    randomPrototype.nextFloat = function nextFloat(): number { return randomInstance(this as object).nextFloat(); };
    randomPrototype.nextDouble = function nextDouble(): number { return randomInstance(this as object).nextDouble(); };
}
