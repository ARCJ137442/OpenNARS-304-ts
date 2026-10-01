//! Java source: opennars/entity/Stamp.java
import type { int, long, float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Tense } from "../language/Tense.ts";
import { Symbols } from "../io/Symbols.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Debug } from "../main/Debug.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { NativeSet } from "../runtime/NativeSet.ts";
import { ReasonerObject } from "../runtime/ClassIdentity.ts";
import {
    addRuntimeLong,
    subtractRuntimeLong,
    toRuntimeLong,
    type RuntimeLongInput,
} from "../runtime/runtime-numbers.ts";
import { ReasonerInputError, ReasonerStateError } from "../runtime/ReasonerErrors.ts";
import { asText } from "../runtime/Text.ts";
import type { TextString } from "../runtime/Text.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Parameters } from "../main/Parameters.ts";

const hashLong = (value: long): int => {
    const numeric = Number(value);
    return (numeric ^ Math.trunc(numeric / 0x100000000)) | 0;
};

/** jree types Java long as bigint, while this translated 3.0.4 runtime keeps time values as numbers. */
const runtimeLong = (value: number): long => value as unknown as long;



/**
 * Stamps are used to keep track of done derivations
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
// Java 原始声明：public class Stamp implements Cloneable, Serializable。
// 两个接口在本项目只是 marker；ReasonerObject 仅保留项目已观测的类身份合同。
export class Stamp extends ReasonerObject {
    /**
     * serial numbers. not to be modified after Stamp constructor has initialized it
     */
    public evidentialBase!: Stamp.BaseEntry[];

    /** the length of @see evidentialBase */
    public baseLength!: int;

    /** creation time of the stamp */
    private creationTime!: long;

    /** estimated occurrence time of the event */
    private occurrenceTime!: long;

    /**
     * default for atemporal events means "always" in Judgment/Question, but
     * "current" in Goal/Quest
     */
    public static readonly ETERNAL: long = runtimeLong(-2147483648);

    /**
     * caches evidentialBase as a set for comparisons and hashcode, stores the
     * unique Long's in-order for efficiency
     */
    private evidentialSet: Stamp.BaseEntry[] | null = null;

    /** Tense of the item */
    private tense!: Tense;

    /** is it a neg confirmation task that was already checked */
    public alreadyAnticipatedNegConfirmation: boolean = false;

    /** caches */
    // Keep the cache separate from name(); otherwise the Java-to-TypeScript
    // translation creates an instance field that shadows the method.
    protected nameCache: TextString | null = null;

    /**
     * derivation chain containing the used premises and conclusions which made
     * deriving the conclusion c possible
     * Uses LinkedHashSet for optimal contains/indexOf performance.
     * TODO use thread-safety for this
     */

    /** cache of hashcode of evidential base */
    // Keep the field distinct from evidentialHash(); otherwise the translated
    // instance field shadows the method at runtime.
    private evidentialHashValue!: int;

    public before(s: Stamp, duration: int): boolean {
        if (this.isEternal() || s.isEternal())
            return false;
        return TemporalRules.order(s.occurrenceTime, this.occurrenceTime, duration) === TemporalRules.ORDER_BACKWARD;
    }

    public after(s: Stamp, duration: int): boolean {
        if (this.isEternal() || s.isEternal())
            return false;
        return TemporalRules.order(s.occurrenceTime, this.occurrenceTime, duration) === TemporalRules.ORDER_FORWARD;
    }

    public getOriginality(): float {
        return Float32Math.divide(1.0, this.evidentialBase.length + 1) as float;
    }

    /**
     * Generate a new stamp identical with a given one
     *
     * @param old The stamp to be cloned
     */
    // TypeScript overload sets expose the accessibility of every declared
    // signature when resolving `new Stamp(...)`.  Keeping this Java-private
    // copy overload private therefore makes the unrelated public overloads
    // inaccessible to callers.  The implementation still handles the copy
    // form internally through `clone()`; expose the signature here so the
    // public constructor overloads retain their Java-facing type contract.
    public constructor(old: Stamp);

    /**
     * used for when the ocrrence time will be set later; so should not be called
     * from externally but through another Stamp constructor
     */
    public constructor(tense: Tense, serial: Stamp.BaseEntry);

    /**
     * Generate a new stamp from an existing one, with the same evidentialBase
     * but different creation time
     * <p>
     * For single-premise rules
     *
     * @param old          The stamp of the single premise
     * @param creationTime The current time
     */
    public constructor(old: Stamp, creationTime: RuntimeLongInput);

    /** creates a stamp with default Present tense */
    public constructor(time: Timable, memory: Memory);

    public constructor(old: Stamp, creationTime: RuntimeLongInput, useEvidentialBase: Stamp);

    public constructor(time: Timable, memory: Memory, tense: Tense);

    /**
     * Generate a new stamp, with a new serial number, for a new Task
     *
     * @param time Creation time of the stamp
     */
    public constructor(time: RuntimeLongInput, tense: Tense, serial: Stamp.BaseEntry, duration: int);

    /**
     * Generate a new stamp for derived sentence by merging the two from parents
     * the first one is no shorter than the second
     *
     * @param first  The first Stamp
     * @param second The second Stamp
     */
    public constructor(first: Stamp, second: Stamp, time: RuntimeLongInput, narParameters: Parameters);
    public constructor(...args: unknown[]) {
        // Java constructor delegation (`this(...)`) is not legal in TypeScript.
        // Resolve the overload first, then call `super()` exactly once.
        super();
        if (args.length === 1) {
            const [old] = args as [Stamp];
            this.evidentialBase = old.evidentialBase;
            this.baseLength = old.baseLength;
            this.creationTime = old.creationTime;
            this.occurrenceTime = old.occurrenceTime;
            this.tense = old.tense;
            return;
        }

        if (args.length === 2 && args[0] instanceof Stamp) {
            const [old, creationTime] = args as [Stamp, RuntimeLongInput];
            this.evidentialBase = old.evidentialBase;
            this.baseLength = old.baseLength;
            this.creationTime = toRuntimeLong(creationTime);
            this.occurrenceTime = old.getOccurrenceTime();
            this.tense = old.tense;
            return;
        }

        if (args.length === 2 && typeof (args[0] as { time?: unknown })?.time === "function") {
            const [time, memory] = args as [Timable, Memory];
            this.initializeInputStamp(time.time(), Tense.Present, memory);
            return;
        }

        if (args.length === 2) {
            const [tense, serial] = args as [Tense, Stamp.BaseEntry];
            this.baseLength = 1;
            this.evidentialBase = [serial];
            this.tense = tense;
            this.creationTime = runtimeLong(-1);
            return;
        }

        if (args.length === 3 && args[0] instanceof Stamp) {
            const [old, creationTime, useEvidentialBase] = args as [Stamp, RuntimeLongInput, Stamp];
            this.evidentialBase = useEvidentialBase.evidentialBase;
            this.baseLength = useEvidentialBase.baseLength;
            this.creationTime = toRuntimeLong(creationTime);
            this.occurrenceTime = old.getOccurrenceTime();
            this.tense = old.tense;
            return;
        }

        if (args.length === 3) {
            const [time, memory, tense] = args as [Timable, Memory, Tense];
            this.initializeInputStamp(time.time(), tense, memory);
            return;
        }

        if (args.length === 4 && args[0] instanceof Stamp) {
            const [first, second, time, narParameters] = args as [Stamp, Stamp, RuntimeLongInput, Parameters];
            let i1 = 0;
            let i2 = 0;
            let j = 0;
            this.baseLength = Math.min(first.baseLength + second.baseLength, narParameters.MAXIMUM_EVIDENTAL_BASE_LENGTH);
            this.evidentialBase = new Array<Stamp.BaseEntry>(this.baseLength);
            this.creationTime = toRuntimeLong(time);
            this.occurrenceTime = first.getOccurrenceTime();
            while (j < this.baseLength) {
                if (i2 < second.baseLength) this.evidentialBase[j++] = second.evidentialBase[i2++];
                if (i1 < first.baseLength && j < this.baseLength) this.evidentialBase[j++] = first.evidentialBase[i1++];
            }
            this.tense = first.tense;
            return;
        }

        if (args.length === 4) {
            const [time, tense, serial, duration] = args as [RuntimeLongInput, Tense, Stamp.BaseEntry, int];
            this.baseLength = 1;
            this.evidentialBase = [serial];
            this.tense = tense;
            this.setCreationTime(time, duration);
            return;
        }

        throw new ReasonerInputError("Invalid number of arguments");
    }

    private initializeInputStamp(time: long, tense: Tense, memory: Memory): void {
        this.baseLength = 1;
        this.evidentialBase = [memory.newStampSerial()];
        this.tense = tense;
        this.setCreationTime(time, memory.narParameters.DURATION);
    }


    /** Detects evidental base overlaps **/
    public static baseOverlap(a: Stamp, b: Stamp): boolean {
        let base1: Stamp.BaseEntry[] = a.evidentialBase;
        let base2: Stamp.BaseEntry[] = b.evidentialBase;

        // Java source: Set<BaseEntry> task_base = new LinkedHashSet<>(...);
        // Set uniqueness is part of this algorithm; NativeSet keeps that
        // contract explicit while using a native implementation.
        const taskBase = new NativeSet<Stamp.BaseEntry>();
        for (let aBase1 of base1) {
            if (taskBase.contains(aBase1)) { // can have an overlap in itself already
                return true;
            }
            taskBase.add(aBase1);
        }
        for (let aBase2 of base2) {
            if (taskBase.contains(aBase2)) {
                return true;
            }
            taskBase.add(aBase2); // also add to detect collision with itself
        }
        return false;
    }

    public evidenceIsCyclic(): boolean {
        // Java source: Set<BaseEntry> task_base = new LinkedHashSet(...);
        const taskBase = new NativeSet<Stamp.BaseEntry>();
        for (let anEvidentialBase of this.evidentialBase) {
            if (taskBase.contains(anEvidentialBase)) { // can have an overlap in itself already
                return true;
            }
            taskBase.add(anEvidentialBase);
        }
        return false;
    }

    public isEternal(): boolean {
        let eternalOccurrence: boolean = this.occurrenceTime === Stamp.ETERNAL;

        if (Debug.DETAILED) {
            if (eternalOccurrence && this.tense !== Tense.Eternal) {
                throw new ReasonerStateError(
                    `Stamp has inconsistent tense and eternal occurrenceTime: tense=${this.tense}`);
            }
        }

        return eternalOccurrence;
    }

    /**
     * sets the creation time; used to set input tasks with the actual time they
     * enter Memory
     */
    public setCreationTime(time: RuntimeLongInput, duration: int): void {
        const runtimeTime = toRuntimeLong(time);
        this.creationTime = runtimeTime;

        if (this.tense === null) {
            this.occurrenceTime = Stamp.ETERNAL;
        } else if (this.tense === Tense.Past) {
            this.occurrenceTime = subtractRuntimeLong(time, duration);
        } else if (this.tense === Tense.Future) {
            this.occurrenceTime = addRuntimeLong(time, duration);
        } else if (this.tense === Tense.Present) {
            this.occurrenceTime = runtimeTime;
        } else {
            this.occurrenceTime = runtimeTime;
        }

    }

    /**
     * Clone a stamp
     *
     * @return The cloned stamp
     */
    public clone(): Stamp {
        return new Stamp(this);
    }

    public static toSetArray(x: Stamp.BaseEntry[]): Stamp.BaseEntry[] {
        let set: Stamp.BaseEntry[] = x.slice();

        if (x.length < 2)
            return set;

        // 1. copy evidentialBse
        // 2. sort
        // 3. count duplicates
        // 4. create new array

        // Java source uses Arrays.sort(set) with BaseEntry's natural ordering.
        // The ordering contract is kept explicitly while the value class no
        // longer inherits jree's reflection-bearing Comparable interface.
        set.sort((a, b) => a.compareTo(b));
        let lastValue: Stamp.BaseEntry | null = null;
        let j: int = 0; // # of unique items
        for (let v of set) {
            if (lastValue === null || !lastValue.equals(v)) {
                j++;
            }
            lastValue = v;
        }
        lastValue = null;
        let sorted: Stamp.BaseEntry[] = new Array<Stamp.BaseEntry>(j);
        j = 0;
        for (let v of set) {
            if (lastValue === null || !lastValue.equals(v)) {
                sorted[j++] = v;
            }
            lastValue = v;
        }
        return sorted;
    }

    /**
     * Convert the evidentialBase into a set
     *
     * @return The NavigableSet representation of the evidential base
     */
    private static hashCode(values: Stamp.BaseEntry[]): int {
        let hash = 1;
        for (const value of values) {
            hash = (Math.imul(31, hash) + value.hashCode()) | 0;
        }
        return hash;
    }

    private static arraysEqual(left: Stamp.BaseEntry[], right: Stamp.BaseEntry[]): boolean {
        if (left.length !== right.length) return false;
        for (let index = 0; index < left.length; index++) {
            if (!left[index].equals(right[index])) return false;
        }
        return true;
    }

    private toSet(): Stamp.BaseEntry[] {
        if (this.evidentialSet === null) {
            this.evidentialSet = Stamp.toSetArray(this.evidentialBase);
            this.evidentialHashValue = Stamp.hashCode(this.evidentialSet);
        }

        return this.evidentialSet;
    }

    public override  equals(that: unknown): boolean;

    /**
     * Check if two stamps contains the same types of content
     *
     * @param s The Stamp to be compared
     * @return Whether the two have contain the same evidential base
     */
    public override  equals(s: Stamp, creationTime: boolean, ocurrenceTime: boolean,
        evidentialBase: boolean): boolean;
    public override equals(...args: unknown[]): boolean {
        switch (args.length) {
            case 1: {
                const [that] = args as [unknown];


                throw new ReasonerStateError("Use other equals() method");


                break;
            }

            case 4: {
                const [s, creationTime, ocurrenceTime, evidentialBase] = args as [Stamp, boolean, boolean, boolean];


                if (this === s)
                    return true;

                if (creationTime)
                    if (this.getCreationTime() !== s.getCreationTime())
                        return false;
                if (ocurrenceTime)
                    if (this.getOccurrenceTime() !== s.getOccurrenceTime())
                        return false;
                if (evidentialBase) {
                    if (this.evidentialHash() !== s.evidentialHash())
                        return false;
                    return Stamp.arraysEqual(this.toSet(), s.toSet());
                }

                return true;


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * hash code of Stamp
     *
     * @return hash code
     */
    public evidentialHash(): int {
        if (this.evidentialSet === null)
            this.toSet();
        return this.evidentialHashValue;
    }

    public cloneWithNewOccurrenceTime(newOcurrenceTime: RuntimeLongInput): Stamp {
        let s: Stamp = this.clone();
        if (newOcurrenceTime === Stamp.ETERNAL)
            s.tense = Tense.Eternal;
        s.setOccurrenceTime(newOcurrenceTime);
        return s;
    }

    /**
     * Get the occurrenceTime of the truth-value
     *
     * @return occurrence time
     */
    public getOccurrenceTime(): long {
        return this.occurrenceTime;
    }

    /**
     *
     */
    public setEternal(): void {
        this.occurrenceTime = Stamp.ETERNAL;
    }

    public appendOcurrenceTime<T>(sb: T): T {
        if (this.occurrenceTime !== Stamp.ETERNAL) {
            // Java source type: StringBuilder.  Keep only the observed
            // append-and-return contract at this boundary; capacity is an
            // implementation detail and has no semantic effect here.
            const append = (sb as unknown as { append: (value: unknown) => unknown }).append;
            append.call(sb, `[${String(this.occurrenceTime)}]`);
        }
        return sb;
    }

    /**
     * Get the occurrenceTime of the truth-value
     *
     * @return occurrence time
     */
    public getOccurrenceTimeString(): TextString {
        return asText(this.isEternal() ? "" : `[${String(this.occurrenceTime)}]`);
    }

    public getTense(currentTime: RuntimeLongInput, duration: int): TextString {

        if (this.isEternal()) {
            return asText("");
        }
        switch (TemporalRules.order(toRuntimeLong(currentTime), this.occurrenceTime, duration)) {
            case TemporalRules.ORDER_FORWARD:
                return asText(String(Symbols.TENSE_FUTURE));
            case TemporalRules.ORDER_BACKWARD:
                return asText(String(Symbols.TENSE_PAST));
            default:
                return asText(String(Symbols.TENSE_PRESENT));
        }
    }

    public setOccurrenceTime(time: RuntimeLongInput): void {
        const runtimeTime = toRuntimeLong(time);
        if (this.occurrenceTime !== runtimeTime) {
            this.occurrenceTime = runtimeTime;

            if (runtimeTime === Stamp.ETERNAL)
                this.tense = Tense.Eternal;

            this.nameCache = null;
        }
    }

    public name(): TextString {
        if (this.nameCache === null) {
            const parts: string[] = [String(Symbols.STAMP_OPENER), String(this.getCreationTime())];
            if (!this.isEternal()) {
                parts.push("|", String(this.occurrenceTime));
            }
            parts.push(" ", String(Symbols.STAMP_STARTER), " ");
            for (let i: int = 0; i < this.baseLength; i++) {
                parts.push(String(this.evidentialBase[i].toString()));
                if (i < (this.baseLength - 1)) {
                    parts.push(String(Symbols.STAMP_SEPARATOR));
                }
            }
            parts.push(String(Symbols.STAMP_CLOSER), " ");
            this.nameCache = asText(parts.join(""));
        }
        return this.nameCache!;
    }

    public override toString(): string {
        return String(this.name().toString());
    }

    /**
     * @return time of creation
     */
    public getCreationTime(): long {
        return this.creationTime;
    }

    /**
     * Element of the evidential base of stamp
     */
    // Java source: public static class BaseEntry implements Comparable<BaseEntry>, Serializable.
    // Keep value equality, Java hashCode and ordering; Serializable is marker-only here.
    public static BaseEntry = class BaseEntry {
        public readonly narId: long; // the NAR in which the input evidence was added

        public getNarId(): long {
            return this.narId;
        }

        public readonly inputId: long;

        public getInputId(): long {
            return this.inputId;
        }

        /**
         * The evidential base entry
         *
         * @param narId   The id of the NAR the input evidence was obtained from
         * @param inputId The nar-specific input id of the input
         */
        public constructor(narId: RuntimeLongInput, inputId: RuntimeLongInput) {
            this.narId = toRuntimeLong(narId);
            this.inputId = toRuntimeLong(inputId);
        }

        public toString(): string {
            return `(${this.narId},${this.inputId})`;
        }

        public equals(other: unknown): boolean {
            if (other === this) {
                return true;
            }
            if (!(other instanceof BaseEntry)) {
                return false;
            }
            let other_: BaseEntry = other as BaseEntry;
            return other_.inputId === this.inputId && other_.narId === this.narId;
        }

        public hashCode(): int {
            let prime: int = 31;
            let result: int = 1;
            result = prime * result + hashLong(this.narId);
            result = prime * result + hashLong(this.inputId);
            return result;
        }

        public compareTo(o: BaseEntry): int {
            if (this.narId < o.narId) return -1;
            if (this.narId > o.narId) return 1;
            if (this.inputId < o.inputId) return -1;
            if (this.inputId > o.inputId) return 1;
            return 0;
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Stamp {
    export type BaseEntry = InstanceType<typeof Stamp.BaseEntry>;
}


