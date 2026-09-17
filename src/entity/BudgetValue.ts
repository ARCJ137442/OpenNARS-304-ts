//! Java source: opennars/entity/BudgetValue.java
import { java, S } from "jree";
import type { float, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Symbols } from "../io/Symbols.ts";
import { Texts } from "../io/Texts.ts";
import { UtilityFunctions } from "../inference/UtilityFunctions.ts";
import { Parameters } from "../main/Parameters.ts";
import { TruthValue } from "./TruthValue.ts";
import { Float32Math } from "../runtime/Float32.ts";

type char = string

/**
 * A triple of priority (current), durability (decay), and quality (long-term
 * average).
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
// Java source declares `class BudgetValue implements Cloneable, Serializable`;
// both are marker contracts here, while clone() remains an explicit method below.
export class BudgetValue {

    // Java stores these fields as float.  Keep the narrowing at write
    // boundaries; rounding getters or every consumer would change ordering.
    private static float(value: number): float {
        return Math.fround(value) as float;
    }

    /** character that marks the two ends of a budget value */
    private static readonly MARK: char = Symbols.BUDGET_VALUE_MARK;
    /** character that separates the factors in a budget value */
    private static readonly SEPARATOR: char = Symbols.VALUE_SEPARATOR;

    /** relative share of time resource to be allocated */
    private priority: float;

    /**
     * The percent of priority to be kept in a constant period; All priority
     * values "decay" over time, though at different rates. Each item is given a
     * "durability" factor in (0, 1) to specify the percentage of priority level
     * left after each reevaluation
     */
    private durability: float;

    /** overall (context-independent) evaluation */
    private quality: float;

    /**
     * time at which this budget was last forgotten, for calculating accurate memory
     * decay rates
     */
    private lastForgetTime: long = -1n;

    private narParameters: Parameters;

    /**
     * Cloning constructor
     *
     * @param v Budget value to be cloned
     */
    public constructor(v: BudgetValue);

    public constructor(p: float, d: float, qualityFromTruth: TruthValue, narParameters: Parameters);

    /**
     * Constructor with initialization
     *
     * @param p Initial priority
     * @param d Initial durability
     * @param q Initial quality
     */
    public constructor(p: float, d: float, q: float, narParameters: Parameters);
    public constructor(...args: unknown[]) {
        if (args.length === 1) {
            const [v] = args as [BudgetValue];
            this.narParameters = v.narParameters;
            this.priority = v.getPriority();
            this.durability = v.getDurability();
            this.quality = v.getQuality();
        } else if (args.length === 4) {
            const [p, d, third, narParameters] = args as [float, float, float | TruthValue, Parameters];
            this.narParameters = narParameters;
            this.priority = BudgetValue.float(p);
            this.durability = BudgetValue.float(d);
            if (third instanceof TruthValue) {
                // Java's TruthValue-to-quality constructor path uses the
                // float evaluation before applying the quality formula.
                this.quality = BudgetValue.float(Float32Math.truthToQuality(
                    third.getExpectationAsFloat(),
                ));
            } else {
                this.quality = BudgetValue.float(third);
            }
        } else {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        if (this.durability >= 1.0) {
            this.durability = BudgetValue.float(1.0 - this.narParameters.TRUTH_EPSILON);
            // throw new IllegalStateException("durability value above or equal 1");
        }
        if (this.priority > 1.0) {
            this.priority = BudgetValue.float(1.0);
            // throw new IllegalStateException("priority value above 1");
        }
    }


    /**
     * Cloning method
     */
    public clone(): BudgetValue {
        return new BudgetValue(this.getPriority(), this.getDurability(), this.getQuality(), this.narParameters);
    }

    /**
     * Get priority value
     *
     * @return The current priority
     */
    public getPriority(): float {
        return this.priority;
    }

    /**
     * Change priority value
     *
     * @param v The new priority
     */
    public setPriority(v: float): void {
        const javaV = BudgetValue.float(v);
        if (javaV > 1.0) {
            throw new java.lang.IllegalStateException("Priority > 1.0: " + javaV);
            // v=1.0f;
        }
        this.priority = javaV;
    }

    /**
     * Increase priority value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incPriority(v: float): void {
        this.setPriority(java.lang.Math.min(1.0, UtilityFunctions.or(this.priority, v)) as float);
    }

    /** AND's (multiplies) priority with another value */
    public andPriority(v: float): void {
        this.setPriority(UtilityFunctions.and(this.priority, v) as float);
    }

    /**
     * Decrease priority value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decPriority(v: float): void {
        this.setPriority(UtilityFunctions.and(this.priority, v) as float);
    }

    /**
     * Get durability value
     *
     * @return The current durability
     */
    public getDurability(): float {
        return this.durability;
    }

    /**
     * Change durability value
     *
     * @param d The new durability
     */
    public setDurability(d: float): void {
        d = BudgetValue.float(d);
        if (d >= 1.0) {
            d = BudgetValue.float(1.0 - this.narParameters.TRUTH_EPSILON);
        }
        this.durability = BudgetValue.float(d);
    }

    /**
     * Increase durability value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incDurability(v: float): void {
        let durability2: float = UtilityFunctions.or(this.durability, v);
        if (durability2 >= 1.0) {
            durability2 = 1.0 - this.narParameters.TRUTH_EPSILON; // put into allowed range
        }
        this.durability = BudgetValue.float(durability2);
    }

    /**
     * Decrease durability value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decDurability(v: float): void {
        this.durability = UtilityFunctions.and(this.durability, v) as float;
    }

    /**
     * Get quality value
     *
     * @return The current quality
     */
    public getQuality(): float {
        return this.quality;
    }

    /**
     * Change quality value
     *
     * @param v The new quality
     */
    public setQuality(v: float): void {
        this.quality = BudgetValue.float(v);
    }

    /**
     * Increase quality value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incQuality(v: float): void {
        this.quality = UtilityFunctions.or(this.quality, v);
    }

    /**
     * Decrease quality value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decQuality(v: float): void {
        this.quality = UtilityFunctions.and(this.quality, v) as float;
    }

    /**
     * Merge one BudgetValue into another
     *
     * @param that The other Budget
     */
    public merge(that: BudgetValue): void {
        this.setPriority(Math.max(this.getPriority(), that.getPriority()));
        this.setDurability(Math.max(this.getDurability(), that.getDurability()));
        this.setQuality(Math.max(this.getQuality(), that.getQuality()));
    }

    /**
     * @param rhs compared truth value
     * @return if this budget is greater in all quantities than another budget,
     */
    // used to prevent a merge that would have no consequence
    public greaterThan(rhs: BudgetValue): boolean {
        return (Float32Math.subtract(this.getPriority(), rhs.getPriority()) > this.narParameters.BUDGET_THRESHOLD) &&
            (Float32Math.subtract(this.getDurability(), rhs.getDurability()) > this.narParameters.BUDGET_THRESHOLD) &&
            (Float32Math.subtract(this.getQuality(), rhs.getQuality()) > this.narParameters.BUDGET_THRESHOLD);
    }

    /**
     * To summarize a BudgetValue into a single number in [0, 1]
     *
     * @return The summary value
     */
    public summary(): float {
        return UtilityFunctions.aveGeo(this.priority, this.durability, this.quality);
    }

    public equalsByPrecision(that: java.lang.Object): boolean {
        if (that instanceof BudgetValue) {
            let t: BudgetValue = (that as BudgetValue);
            let dPrio: float = Float32Math.from(Math.abs(Float32Math.subtract(this.getPriority(), t.getPriority()))) as float;
            if (dPrio >= this.narParameters.TRUTH_EPSILON)
                return false;
            let dDura: float = Float32Math.from(Math.abs(Float32Math.subtract(this.getDurability(), t.getDurability()))) as float;
            if (dDura >= this.narParameters.TRUTH_EPSILON)
                return false;
            let dQual: float = Float32Math.from(Math.abs(Float32Math.subtract(this.getQuality(), t.getQuality()))) as float;
            return dQual < this.narParameters.TRUTH_EPSILON;
        }
        return false;
    }

    /**
     * Whether the budget should get any processing at all
     * <p>
     * to be revised to depend on how busy the system is
     *
     * @return The decision on whether to process the Item
     */
    public aboveThreshold(): boolean {
        return (this.summary() >= this.narParameters.BUDGET_THRESHOLD);
    }

    /**
     * Fully display the BudgetValue
     *
     * @return String representation of the value
     */
    public toString(): java.lang.String {
        return S`${BudgetValue.MARK}${Texts.n4(this.priority)}${BudgetValue.SEPARATOR}${Texts.n4(this.durability)}${BudgetValue.SEPARATOR}${Texts.n4(this.quality)}${BudgetValue.MARK}`;
    }

    /**
     * Briefly display the BudgetValue
     *
     * @return String representation of the value with 2-digit accuracy
     */
    public toStringExternal(): java.lang.String {
        // return MARK + priority.toStringBrief() + SEPARATOR +
        // durability.toStringBrief() + SEPARATOR + quality.toStringBrief() + MARK;

        let priorityString: string = Texts.n2(this.priority);
        let durabilityString: string = Texts.n2(this.durability);
        let qualityString: string = Texts.n2(this.quality);
        return S`${BudgetValue.MARK}${priorityString}${BudgetValue.SEPARATOR}${durabilityString}${BudgetValue.SEPARATOR}${qualityString}${BudgetValue.MARK}`;
    }

    /**
     * computes the period and sets the current time to the period
     *
     * @return period in time: currentTime - lastForgetTime
     */
    // TODO< split this into two methods >
    public setLastForgetTime(currentTime: long): long {
        let period: long;
        if (this.lastForgetTime === -1n)
            period = 0n;
        else
            period = currentTime - this.lastForgetTime;

        this.lastForgetTime = currentTime;

        return period;
    }

    public getLastForgetTime(): long {
        return this.lastForgetTime;
    }
}
