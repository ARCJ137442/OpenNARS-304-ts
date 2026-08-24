//! Java source: opennars/entity/Item.java
import { java, JavaObject, type int, type float, S } from "jree";
import { Float32Math } from "../runtime/Float32.ts";
import {BudgetValue} from './BudgetValue.ts'
import { javaStringHashCode, javaStringLength, javaValuesEqual } from "../runtime/jree-compat.ts";

interface ItemComparator<E> {
    compare(a: E, b: E): int;
}

const javaObjectHashCode = (value: unknown): int => {
    const hashCode = (value as { hashCode?: unknown } | null)?.hashCode;
    if (typeof hashCode === "function") {
        return hashCode.call(value) as int;
    }
    return javaStringHashCode(value) as int;
};


/**
 * An item is an object that can be put into a Bag,
 * to participate in the resource competition of the system.
 * <p>
 * It has a key and a budget. Cannot be cloned
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract  class Item<K> extends JavaObject implements java.io.Serializable {

    public static ItemPriorityComparator =  class ItemPriorityComparator<E extends Item<unknown>> extends JavaObject implements ItemComparator<E> {

        public  compare(a: E, b: E):  int {
             let  ap: float = a.getPriority();
             let  bp: float = b.getPriority();

            if ((a === b) || ((a.name() as any)?.equals?.(b.name())) || (ap === bp))
                return a.hashCode() - b.hashCode();
            else if (ap < bp)
                return 1;
            else
                return -1;
        }

    };


    /** The budget of the Item, consisting of 3 numbers */
    public readonly  budget:  BudgetValue | null ;

    public  constructor();

    /**
     * Constructor with initial budget
     *
     * @param budget The initial budget
     */
    public  constructor(budget: BudgetValue | null);
    public constructor(...args: unknown[]) {
        super();
        if (args.length === 0) {
            // Items without a budget are valid (for example StringKeyItem).
            this.budget = null;
        } else if (args.length === 1) {
            const [budget] = args as [BudgetValue];
            this.budget = budget !== null ? budget.clone() : null; // clone, not assignment
        } else {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
	}


    /**
     * Get the current key
     *
     * @return Current key value
     */
    public abstract  name():  K;

    /**
     * Get priority value
     *
     * @return Current priority value
     */
    public  getPriority():  float {
        return this.requireBudget().getPriority();
    }

    /**
     * Set priority value
     *
     * @param v Set a new priority value
     */
    public  setPriority(v: float):  void {
        this.requireBudget().setPriority(v);
    }

    /**
     * Increase priority value
     *
     * @param v The amount of increase
     */
    public  incPriority(v: float):  void {
        this.requireBudget().incPriority(v);
    }

    /**
     * Decrease priority value
     *
     * @param v The amount of decrease
     */
    public  decPriority(v: float):  void {
        this.requireBudget().decPriority(v);
    }

    /**
     * Get durability value
     *
     * @return Current durability value
     */
    public  getDurability():  float {
        return this.requireBudget().getDurability();
    }

    /**
     * Set durability value
     *
     * @param v The new durability value
     */
    public  setDurability(v: float):  void {
        this.requireBudget().setDurability(v);
    }

    /**
     * Increase durability value
     *
     * @param v The amount of increase
     */
    public  incDurability(v: float):  void {
        this.requireBudget().incDurability(v);
    }

    /**
     * Decrease durability value
     *
     * @param v The amount of decrease
     */
    public  decDurability(v: float):  void {
        this.requireBudget().decDurability(v);
    }

    /**
     * Get quality value
     *
     * @return The quality value
     */
    public  getQuality():  float {
        return this.requireBudget().getQuality();
    }

    /**
     * Set quality value
     *
     * @param v The new quality value
     */
    public  setQuality(v: float):  void {
        this.requireBudget().setQuality(v);
    }

    /**
     * Merge with another Item with identical key
     *
     * @param that The Item to be merged
     * @return the resulting Item: this or that
     */
    public  merge(that: Item<unknown>):  Item<unknown> {
        this.requireBudget().merge(that.requireBudget());
        return this;
    }

    /**
     * Return a String representation of the Item
     *
     * @return The String representation of the full content
     */
    public toString():  java.lang.String {
        // return budget + " " + key ;

         let  budgetStr: java.lang.String = this.budget !== null ? this.budget.toString() : new java.lang.String();
         let  n: java.lang.String = java.lang.String.valueOf(this.name());
        return new  java.lang.StringBuilder(javaStringLength(budgetStr) + javaStringLength(n) + 1).append(budgetStr).append(' ').append(n)
                .toString();
    }

    /**
     * Return a String representation of the Item after simplification
     *
     * @return A simplified String representation of the content
     */
    public  toStringExternal():  java.lang.String {
         let  briefBudget: java.lang.String = this.requireBudget().toStringExternal();
         let  n: java.lang.String = java.lang.String.valueOf(this.name());
        return new  java.lang.StringBuilder(javaStringLength(briefBudget) + javaStringLength(n) + 1).append(briefBudget).append(' ').append(n)
                .toString();
    }

    /** similar to toStringExternal but includes budget afterward */
    public  toStringExternal2():  java.lang.String {
         let  briefBudget: java.lang.String = this.requireBudget().toStringExternal();
         let  n: java.lang.String = java.lang.String.valueOf(this.name());
        return new  java.lang.StringBuilder(javaStringLength(briefBudget) + javaStringLength(n) + 1).append(n).append(' ').append(briefBudget)
                .toString();
    }

    public  toStringLong():  java.lang.String {
        return this.toString();
    }

    /*
     * //default:
     *
     * @Override
     * public int compareTo(final Object o) {
     * //return System.identityHashCode(this) - System.identityHashCode(o);
     * return hashCode() - o.hashCode();
     * }
     */

    public hashCode():  int {
        return javaObjectHashCode(this.name());
    }

    public equals(obj: java.lang.Object):  boolean {
        if (obj === this)
            return true;
        if (obj instanceof Item) {
            return javaValuesEqual((obj as Item<unknown>).name(), this.name());
        }
        return false;
    }

    public static StringKeyItem: typeof StringKeyItem;


    public static  getPrioritySum(c: java.lang.Iterable< Item<unknown>>):  float {
        let  totalPriority: float = 0;
        for (let i of c)
            totalPriority = Float32Math.add(totalPriority, i.getPriority()) as float;
        return totalPriority;
    }

    protected requireBudget(): BudgetValue {
        if (this.budget === null) {
            throw new java.lang.NullPointerException(S`Item has no budget`);
        }
        return this.budget;
    }

    public  getBudget():  BudgetValue {
        return this.requireBudget();
    }
}

abstract class StringKeyItem extends Item<java.lang.CharSequence> {

    public constructor(budget: BudgetValue) {
        super(budget);
    }

    public hashCode(): int {
        return javaObjectHashCode(this.name());
    }

    public equals(obj: java.lang.Object): boolean {
        if (obj === this)
            return true;
        if (obj instanceof Item) {
            return javaValuesEqual((obj as Item<unknown>).name(), this.name());
        }
        return false;
    }
}

Item.StringKeyItem = StringKeyItem;

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Item {
	export type ItemPriorityComparator<E extends Item<unknown>> = InstanceType<typeof Item.ItemPriorityComparator<E>>;
	export type StringKeyItem = InstanceType<typeof Item.StringKeyItem>;
}


