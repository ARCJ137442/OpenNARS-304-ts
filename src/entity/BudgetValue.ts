


import { java, JavaObject, type float, type long, S } from "jree";
import { Symbols } from "../io/Symbols";
import { UtilityFunctions } from "../inference/UtilityFunctions";
import { BudgetFunctions } from "../inference/BudgetFunctions";
import { Parameters } from "../main/Parameters";
import { TruthValue } from "./TruthValue";

type char = string

/**
 * A triple of priority (current), durability (decay), and quality (long-term
 * average).
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class BudgetValue implements JavaObject, java.lang.Cloneable<BudgetValue>, java.io.Serializable {

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
    private lastForgetTime: long = -1;

    private narParameters: Parameters | null;

    /**
     * Cloning constructor
     *
     * @param v Budget value to be cloned
     */
    public constructor(/* final */  v: BudgetValue | null);

    public constructor(/* final */  p: float, /* final */  d: float, /* final */  qualityFromTruth: TruthValue | null, narParameters: Parameters | null);

    /**
     * Constructor with initialization
     *
     * @param p Initial priority
     * @param d Initial durability
     * @param q Initial quality
     */
    public constructor(/* final */  p: float, /* final */  d: float, /* final */  q: float, narParameters: Parameters | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [v] = args as [BudgetValue];


                this(v.getPriority(), v.getDurability(), v.getQuality(), v.narParameters);


                break;
            }

            case 4: {
                const [p, d, qualityFromTruth, narParameters] = args as [float, float, TruthValue, Parameters];


                this(p, d, BudgetFunctions.truthToQuality(qualityFromTruth), narParameters);


                break;
            }

            case 4: {
                const [p, d, q, narParameters] = args as [float, float, float, Parameters];


                super();
                this.narParameters = narParameters;
                this.priority = p;
                this.durability = d;
                this.quality = q;

                if (d >= 1.0) {
                    this.durability = (1.0 - narParameters.TRUTH_EPSILON) as float;
                    // throw new IllegalStateException("durability value above or equal 1");
                }
                if (p > 1.0) {
                    this.priority = 1.0;
                    // throw new IllegalStateException("priority value above 1");
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Cloning method
     */
    public override  clone(): BudgetValue | null {
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
    public readonly setPriority(/* final */  v: float): void {
        if (v > 1.0) {
            throw new java.lang.IllegalStateException("Priority > 1.0: " + v);
            // v=1.0f;
        }
        this.priority = v;
    }

    /**
     * Increase priority value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incPriority(/* final */  v: float): void {
        this.setPriority(java.lang.Math.min(1.0, UtilityFunctions.or(this.priority, v)) as float);
    }

    /** AND's (multiplies) priority with another value */
    public andPriority(/* final */  v: float): void {
        this.setPriority(UtilityFunctions.and(this.priority, v) as float);
    }

    /**
     * Decrease priority value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decPriority(/* final */  v: float): void {
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
        if (d >= 1.0) {
            d = 1.0 - this.narParameters.TRUTH_EPSILON;
        }
        this.durability = d;
    }

    /**
     * Increase durability value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incDurability(/* final */  v: float): void {
        let durability2: float = UtilityFunctions.or(this.durability, v);
        if (durability2 >= 1.0) {
            durability2 = 1.0 - this.narParameters.TRUTH_EPSILON; // put into allowed range
        }
        this.durability = durability2;
    }

    /**
     * Decrease durability value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decDurability(/* final */  v: float): void {
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
    public setQuality(/* final */  v: float): void {
        this.quality = v;
    }

    /**
     * Increase quality value by a percentage of the remaining range
     *
     * @param v The increasing percent
     */
    public incQuality(/* final */  v: float): void {
        this.quality = UtilityFunctions.or(this.quality, v);
    }

    /**
     * Decrease quality value by a percentage of the remaining range
     *
     * @param v The decreasing percent
     */
    public decQuality(/* final */  v: float): void {
        this.quality = UtilityFunctions.and(this.quality, v) as float;
    }

    /**
     * Merge one BudgetValue into another
     *
     * @param that The other Budget
     */
    public merge(/* final */  that: BudgetValue | null): void {
        BudgetFunctions.merge(this, that);
    }

    /**
     * @param rhs compared truth value
     * @return if this budget is greater in all quantities than another budget,
     */
    // used to prevent a merge that would have no consequence
    public greaterThan(/* final */  rhs: BudgetValue): boolean {
        return (this.getPriority() - rhs.getPriority() > this.narParameters.BUDGET_THRESHOLD) &&
            (this.getDurability() - rhs.getDurability() > this.narParameters.BUDGET_THRESHOLD) &&
            (this.getQuality() - rhs.getQuality() > this.narParameters.BUDGET_THRESHOLD);
    }

    /**
     * To summarize a BudgetValue into a single number in [0, 1]
     *
     * @return The summary value
     */
    public summary(): float {
        return aveGeo(this.priority, this.durability, this.quality);
    }

    public equalsByPrecision(/* final */  that: java.lang.Object | null): boolean {
        if (that instanceof BudgetValue) {
            let t: BudgetValue = (that as BudgetValue);
            let dPrio: float = java.lang.Math.abs(this.getPriority() - t.getPriority());
            if (dPrio >= this.narParameters.TRUTH_EPSILON)
                return false;
            let dDura: float = java.lang.Math.abs(this.getDurability() - t.getDurability());
            if (dDura >= this.narParameters.TRUTH_EPSILON)
                return false;
            let dQual: float = java.lang.Math.abs(this.getQuality() - t.getQuality());
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
    public override  toString(): java.lang.String | null {
        return BudgetValue.MARK + Texts.n4(this.priority) + BudgetValue.SEPARATOR + Texts.n4(this.durability) + BudgetValue.SEPARATOR + Texts.n4(this.quality) + BudgetValue.MARK;
    }

    /**
     * Briefly display the BudgetValue
     *
     * @return String representation of the value with 2-digit accuracy
     */
    public toStringExternal(): java.lang.String | null {
        // return MARK + priority.toStringBrief() + SEPARATOR +
        // durability.toStringBrief() + SEPARATOR + quality.toStringBrief() + MARK;

        let priorityString: java.lang.CharSequence = Texts.n2(this.priority);
        let durabilityString: java.lang.CharSequence = Texts.n2(this.durability);
        let qualityString: java.lang.CharSequence = Texts.n2(this.quality);
        return new java.lang.StringBuilder(
            1 + priorityString.length() + 1 + durabilityString.length() + 1 + qualityString.length() + 1)
            .append(BudgetValue.MARK)
            .append(priorityString).append(BudgetValue.SEPARATOR)
            .append(durabilityString).append(BudgetValue.SEPARATOR)
            .append(qualityString)
            .append(BudgetValue.MARK)
            .toString();
    }

    /**
     * computes the period and sets the current time to the period
     *
     * @return period in time: currentTime - lastForgetTime
     */
    // TODO< split this into two methods >
    public setLastForgetTime(/* final */  currentTime: long): long {
        let period: long;
        if (this.lastForgetTime === -1)
            period = 0;
        else
            period = currentTime - this.lastForgetTime;

        this.lastForgetTime = currentTime;

        return period;
    }

    public getLastForgetTime(): long {
        return this.lastForgetTime;
    }
}
