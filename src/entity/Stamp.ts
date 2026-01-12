//! Java source: opennars/entity/Stamp.java
import { java, JavaObject, type int, type long, type float, S } from "jree";



/**
 * Stamps are used to keep track of done derivations
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Stamp extends JavaObject implements java.lang.Cloneable, java.io.Serializable {
    /**
     * serial numbers. not to be modified after Stamp constructor has initialized it
     */
    public evidentialBase: Stamp.BaseEntry[];

    /** the length of @see evidentialBase */
    public baseLength: int;

    /** creation time of the stamp */
    private creationTime: long;

    /** estimated occurrence time of the event */
    private occurrenceTime: long;

    /**
     * default for atemporal events means "always" in Judgment/Question, but
     * "current" in Goal/Quest
     */
    public static readonly ETERNAL: long = java.lang.Integer.MIN_VALUE;

    /**
     * caches evidentialBase as a set for comparisons and hashcode, stores the
     * unique Long's in-order for efficiency
     */
    private evidentialSet: Stamp.BaseEntry[] = null;

    /** Tense of the item */
    private tense: Tense;

    /** is it a neg confirmation task that was already checked */
    public alreadyAnticipatedNegConfirmation: boolean = false;

    /** caches */
    protected name: java.lang.CharSequence = null;

    /**
     * derivation chain containing the used premises and conclusions which made
     * deriving the conclusion c possible
     * Uses LinkedHashSet for optimal contains/indexOf performance.
     * TODO use thread-safety for this
     */

    /** cache of hashcode of evidential base */
    private evidentialHash: int;

    public before(s: Stamp, duration: int): boolean {
        if (this.isEternal() || s.isEternal())
            return false;
        return java.nio.ByteBuffer.order(s.occurrenceTime, this.occurrenceTime, duration) === TemporalRules.ORDER_BACKWARD;
    }

    public after(s: Stamp, duration: int): boolean {
        if (this.isEternal() || s.isEternal())
            return false;
        return java.nio.ByteBuffer.order(s.occurrenceTime, this.occurrenceTime, duration) === TemporalRules.ORDER_FORWARD;
    }

    public getOriginality(): float {
        return 1.0 / (this.evidentialBase.length + 1);
    }

    /**
     * Generate a new stamp identical with a given one
     *
     * @param old The stamp to be cloned
     */
    private constructor(old: Stamp);

    /**
     * used for when the ocrrence time will be set later; so should not be called
     * from externally but through another Stamp constructor
     */
    protected constructor(tense: Tense, serial: Stamp.BaseEntry);

    /**
     * Generate a new stamp from an existing one, with the same evidentialBase
     * but different creation time
     * <p>
     * For single-premise rules
     *
     * @param old          The stamp of the single premise
     * @param creationTime The current time
     */
    public constructor(old: Stamp, creationTime: long);

    /** creates a stamp with default Present tense */
    public constructor(time: Timable, memory: Memory);

    public constructor(old: Stamp, creationTime: long, useEvidentialBase: Stamp);

    public constructor(time: Timable, memory: Memory, tense: Tense);

    /**
     * Generate a new stamp, with a new serial number, for a new Task
     *
     * @param time Creation time of the stamp
     */
    public constructor(time: long, tense: Tense, serial: Stamp.BaseEntry, duration: int);

    /**
     * Generate a new stamp for derived sentence by merging the two from parents
     * the first one is no shorter than the second
     *
     * @param first  The first Stamp
     * @param second The second Stamp
     */
    public constructor(first: Stamp, second: Stamp, time: long, narParameters: Parameters);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [old] = args as [Stamp];


                this(old, old.creationTime);


                break;
            }

            case 2: {
                const [tense, serial] = args as [Tense, Stamp.BaseEntry];


                super();
                this.baseLength = 1;
                this.evidentialBase = new Array<Stamp.BaseEntry>(this.baseLength);
                this.evidentialBase[0] = serial;
                this.tense = tense;
                this.creationTime = -1;


                break;
            }

            case 2: {
                const [old, creationTime] = args as [Stamp, long];


                this(old, creationTime, old);


                break;
            }

            case 2: {
                const [time, memory] = args as [Timable, Memory];


                this(time, memory, Tense.Present);


                break;
            }

            case 3: {
                const [old, creationTime, useEvidentialBase] = args as [Stamp, long, Stamp];


                super();
                this.evidentialBase = useEvidentialBase.evidentialBase;
                this.baseLength = useEvidentialBase.baseLength;
                this.creationTime = creationTime;

                this.occurrenceTime = old.getOccurrenceTime();


                break;
            }

            case 3: {
                const [time, memory, tense] = args as [Timable, Memory, Tense];


                this(time.time(), tense, memory.newStampSerial(), memory.narParameters.DURATION);


                break;
            }

            case 4: {
                const [time, tense, serial, duration] = args as [long, Tense, Stamp.BaseEntry, int];


                this(tense, serial);
                this.setCreationTime(time, duration);


                break;
            }

            case 4: {
                const [first, second, time, narParameters] = args as [Stamp, Stamp, long, Parameters];


                // TODO use iterators instead of repeated first and second .get's?

                super();
                let i1: int;
                let i2: int;
                let j: int;
                i1 = i2 = j = 0;
                this.baseLength = java.lang.Math.min(first.baseLength + second.baseLength, narParameters.MAXIMUM_EVIDENTAL_BASE_LENGTH);
                this.evidentialBase = new Array<Stamp.BaseEntry>(this.baseLength);

                let firstBase: Stamp.BaseEntry[] = first.evidentialBase;
                let secondBase: Stamp.BaseEntry[] = second.evidentialBase;
                let firstLength: int = firstBase.length;
                let secondLength: int = secondBase.length;

                this.creationTime = time;
                this.occurrenceTime = first.getOccurrenceTime(); // use the occurrence of task

                // https://code.google.com/p/open-nars/source/browse/trunk/nars_core_java/nars/entity/Stamp.java#143
                while (j < this.baseLength) {
                    if (i2 < secondLength) {
                        this.evidentialBase[j++] = secondBase[i2++];
                    }
                    if (i1 < firstLength) {
                        this.evidentialBase[j++] = firstBase[i1++];
                    }
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /** Detects evidental base overlaps **/
    public static baseOverlap(a: Stamp, b: Stamp): boolean {
        let base1: Stamp.BaseEntry[] = a.evidentialBase;
        let base2: Stamp.BaseEntry[] = b.evidentialBase;

        let task_base: java.util.Set<Stamp.BaseEntry> = new java.util.LinkedHashSet(base1.length + base2.length);
        for (let aBase1 of base1) {
            if (task_base.contains(aBase1)) { // can have an overlap in itself already
                return true;
            }
            task_base.add(aBase1);
        }
        for (let aBase2 of base2) {
            if (task_base.contains(aBase2)) {
                return true;
            }
            task_base.add(aBase2); // also add to detect collision with itself
        }
        return false;
    }

    public evidenceIsCyclic(): boolean {
        let task_base: java.util.Set<Stamp.BaseEntry> = new java.util.LinkedHashSet(this.evidentialBase.length);
        for (let anEvidentialBase of this.evidentialBase) {
            if (task_base.contains(anEvidentialBase)) { // can have an overlap in itself already
                return true;
            }
            task_base.add(anEvidentialBase);
        }
        return false;
    }

    public isEternal(): boolean {
        let eternalOccurrence: boolean = this.occurrenceTime === Stamp.ETERNAL;

        if (Debug.DETAILED) {
            if (eternalOccurrence && this.tense !== Tense.Eternal) {
                throw new java.lang.IllegalStateException(
                    "Stamp has inconsistent tense and eternal ocurrenceTime: tense=" + this.tense);
            }
        }

        return eternalOccurrence;
    }

    /**
     * sets the creation time; used to set input tasks with the actual time they
     * enter Memory
     */
    public setCreationTime(time: long, duration: int): void {
        this.creationTime = time;

        if (this.tense === null) {
            this.occurrenceTime = Stamp.ETERNAL;
        } else if (this.tense === Past) {
            this.occurrenceTime = time - duration;
        } else if (this.tense === java.util.concurrent.Future) {
            this.occurrenceTime = time + duration;
        } else if (this.tense === Present) {
            this.occurrenceTime = time;
        } else {
            this.occurrenceTime = time;
        }

    }

    /**
     * Clone a stamp
     *
     * @return The cloned stamp
     */
    public override  clone(): Stamp {
        return new Stamp(this);
    }

    public static toSetArray(x: Stamp.BaseEntry[]): Stamp.BaseEntry[] {
        let set: Stamp.BaseEntry[] = x.clone();

        if (x.length < 2)
            return set;

        // 1. copy evidentialBse
        // 2. sort
        // 3. count duplicates
        // 4. create new array

        java.util.Arrays.sort(set);
        let lastValue: Stamp.BaseEntry = null;
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
    private toSet(): Stamp.BaseEntry[] {
        if (this.evidentialSet === null) {
            this.evidentialSet = Stamp.toSetArray(this.evidentialBase);
            this.evidentialHash = java.util.Arrays.hashCode(this.evidentialSet);
        }

        return this.evidentialSet;
    }

    public override  equals(that: java.lang.Object): boolean;

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
                const [that] = args as [java.lang.Object];


                throw new java.lang.IllegalStateException("Use other equals() method");


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
                    return java.util.Arrays.equals(this.toSet(), s.toSet());
                }

                return true;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
        return this.evidentialHash;
    }

    public cloneWithNewOccurrenceTime(newOcurrenceTime: long): Stamp {
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

    public appendOcurrenceTime(sb: java.lang.StringBuilder): java.lang.StringBuilder {
        if (this.occurrenceTime !== Stamp.ETERNAL) {
            let estTimeLength: int = 8; /* # digits */
            sb.ensureCapacity(estTimeLength + 1 + 1);
            sb.append('[').append(this.occurrenceTime).append(']').toString();
        }
        return sb;
    }

    /**
     * Get the occurrenceTime of the truth-value
     *
     * @return occurrence time
     */
    public getOccurrenceTimeString(): java.lang.String {
        if (this.isEternal()) {
            return "";
        } else {
            return this.appendOcurrenceTime(new java.lang.StringBuilder()).toString();
        }
    }

    public getTense(currentTime: long, duration: int): java.lang.String {

        if (this.isEternal()) {
            return "";
        }
        switch (TemporalRules.order(currentTime, this.occurrenceTime, duration)) {
            case ORDER_FORWARD:
                return Symbols.TENSE_FUTURE;
            case ORDER_BACKWARD:
                return Symbols.TENSE_PAST;
            default:
                return Symbols.TENSE_PRESENT;
        }
    }

    public setOccurrenceTime(time: long): void {
        if (this.occurrenceTime !== time) {
            this.occurrenceTime = time;

            if (time === Stamp.ETERNAL)
                this.tense = Tense.Eternal;

            this.name = null;
        }
    }

    public name(): java.lang.CharSequence {
        if (this.name === null) {

            let estimatedInitialSize: int = 10 * this.baseLength;

            let buffer: java.lang.StringBuilder = new java.lang.StringBuilder(estimatedInitialSize);
            buffer.append(Symbols.STAMP_OPENER).append(this.getCreationTime());
            if (!this.isEternal()) {
                buffer.append('|').append(this.occurrenceTime);
            }
            buffer.append(' ').append(Symbols.STAMP_STARTER).append(' ');
            for (let i: int = 0; i < this.baseLength; i++) {
                buffer.append(this.evidentialBase[i].toString());
                if (i < (this.baseLength - 1)) {
                    buffer.append(Symbols.STAMP_SEPARATOR);
                }
            }
            buffer.append(Symbols.STAMP_CLOSER).append(' ');

            // this is for estimating an initial size of the stringbuffer
            // System.out.println(baseLength + " " + derivationChain.size() + " " +
            // buffer.baseLength());
            this.name = buffer;
        }
        return this.name;
    }

    public override  toString(): java.lang.String {
        return this.name().toString();
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
    public static BaseEntry = class BaseEntry extends JavaObject implements java.lang.Comparable<BaseEntry>, java.io.Serializable {
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
        public constructor(narId: long, inputId: long) {
            super();
            this.narId = narId;
            this.inputId = inputId;
        }

        public override  toString(): java.lang.String {
            return "(" + this.narId + "," + this.inputId + ")";
        }

        public override  equals(other: java.lang.Object): boolean {
            if (other === this) {
                return true;
            }
            if (!(other instanceof BaseEntry)) {
                return false;
            }
            let other_: BaseEntry = other as BaseEntry;
            return other_.inputId === this.inputId && other_.narId === this.narId;
        }

        public override  hashCode(): int {
            let prime: int = 31;
            let result: int = 1;
            result = prime * result + java.lang.Long.hashCode(this.narId);
            result = prime * result + java.lang.Long.hashCode(this.inputId);
            return result;
        }

        public compareTo(o: BaseEntry): int {
            return java.util.Comparator.comparing(BaseEntry.getNarId)
                .thenComparing(BaseEntry.getInputId)
                .compare(this, o);
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Stamp {
    export type BaseEntry = InstanceType<typeof Stamp.BaseEntry>;
}


