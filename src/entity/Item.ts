import { java, JavaObject, type int, type float, S } from "jree";
import { BudgetValue } from "./BudgetValue";

export namespace Item {

    export abstract class Item<T> {
        public readonly priority: float = 0.0;

        public readonly budget: BudgetValue;

        public constructor();
        protected constructor(budget: BudgetValue);
        public constructor(...args: unknown[]) {
            if (args.length === 0) {
                this.budget = new BudgetValue(0, 0, 0);
            } else if (args.length === 1 && args[0] instanceof BudgetValue) {
                this.budget = args[0];
            }
        }

        public getPriority(): float {
            return this.priority;
        }

        public setPriority(pri: float) {
            this.priority = pri;
        }

        public abstract getKey(): T;

        public equals(obj: java.lang.Object): boolean {
            return obj instanceof Item && this.getKey().equals(obj.getKey());
        }

        public abstract static StringKeyItem = class StringKeyItem extends Item<java.lang.CharSequence> {
            private readonly key: java.lang.CharSequence;

            public constructor(key: java.lang.CharSequence) {
                super();
                this.key = key;
            }

            public getKey(): java.lang.CharSequence {
                return this.key;
            }
        };

        public static getPrioritySum(c: java.lang.Iterable<Item<unknown>>): float {
            let s: float = 0;
            for (const i of c) {
                s += i.getPriority();
            }
            return s;
        }

        public getBudget(): BudgetValue {
            return this.budget;
        }
    }

    export class ItemPriorityComparator<E extends Item<unknown>> extends java.util.Comparator<E> {
        constructor() {
            super();
        }

        public compare(a: E, b: E): number {
            let d: number = a.getPriority() - b.getPriority();
            if (d > 0) {
                return -1;
            } else if (d < 0) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

export type ItemPriorityComparator<E extends Item<unknown>> = InstanceType<typeof Item.ItemPriorityComparator<E>>;


/**
 * An item is an object that can be put into a Bag,
 * to participate in the resource competition of the system.
 * <p>
 * It has a key and a budget. Cannot be cloned
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract class Item<K> implements JavaObject, java.io.Serializable {

    public static ItemPriorityComparator = class ItemPriorityComparator<E extends Item<unknown>> extends java.util.Comparator<E> {
        constructor() {
            super();
        }

        public compare(a: E, b: E): number {
            let d: number = a.getPriority() - b.getPriority();
            if (d > 0) {
                return -1;
            } else if (d < 0) {
                return 1;
            } else {
                return 0;
            }
        }
    };

    /** The budget of the Item, consisting of 3 numbers */
    public readonly budget: BudgetValue;

    public constructor();

    /**
     * Constructor with initial budget
     *
     * @param budget The initial budget
     */
    protected constructor(budget: BudgetValue);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                // items that do not need budget
                super();
                this.budget = null;
                break;
            }

            case 1: {
                const [budget] = args as [BudgetValue];

                super();
                if (budget !== null)
                    this.budget = budget.clone(); // clone, not assignment
                else
                    this.budget = null;
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Get the current key
     *
     * @return Current key value
     */
    public abstract name(): K;

    /**
     * Get priority value
     *
     * @return Current priority value
     */
    public getPriority(): float {
        return this.budget.getPriority();
    }

    /**
     * Set priority value
     *
     * @param v Set a new priority value
     */
    public setPriority(v: float): void {
        this.budget.setPriority(v);
    }

    /**
     * Increase priority value
     *
     * @param v The amount of increase
     */
    public incPriority(v: float): void {
        this.budget.incPriority(v);
    }

    /**
     * Decrease priority value
     *
     * @param v The amount of decrease
     */
    public decPriority(v: float): void {
        this.budget.decPriority(v);
    }

    /**
     * Get durability value
     *
     * @return Current durability value
     */
    public getDurability(): float {
        return this.budget.getDurability();
    }

    /**
     * Set durability value
     *
     * @param v The new durability value
     */
    public setDurability(v: float): void {
        this.budget.setDurability(v);
    }

    /**
     * Increase durability value
     *
     * @param v The amount of increase
     */
    public incDurability(v: float): void {
        this.budget.incDurability(v);
    }

    /**
     * Decrease durability value
     *
     * @param v The amount of decrease
     */
    public decDurability(v: float): void {
        this.budget.decDurability(v);
    }

    /**
     * Get quality value
     *
     * @return The quality value
     */
    public getQuality(): float {
        return this.budget.getQuality();
    }

    /**
     * Set quality value
     *
     * @param v The new quality value
     */
    public setQuality(v: float): void {
        this.budget.setQuality(v);
    }

    /**
     * Merge with another Item with identical key
     *
     * @param that The Item to be merged
     * @return the resulting Item: this or that
     */
    public merge(that: Item<unknown>): Item<unknown> {
        this.budget.merge(that.budget);
        return this;
    }

    /**
     * Return a String representation of the Item
     *
     * @return The String representation of the full content
     */
    public override toString(): java.lang.String {
        // return budget + " " + key ;

        let budgetStr: java.lang.String = this.budget !== null ? this.budget.toString() : "";
        let n: java.lang.String = this.name().toString();
        return new java.lang.StringBuilder(budgetStr.length() + n.length() + 1).append(budgetStr).append(' ').append(n)
            .toString();
    }

    /**
     * Return a String representation of the Item after simplification
     *
     * @return A simplified String representation of the content
     */
    public toStringExternal(): java.lang.String {
        let briefBudget: java.lang.String = this.budget.toStringExternal();
        let n: java.lang.String = this.name().toString();
        return new java.lang.StringBuilder(briefBudget.length() + n.length() + 1).append(briefBudget).append(' ').append(n)
            .toString();
    }

    /** similar to toStringExternal but includes budget afterward */
    public toStringExternal2(): java.lang.String {
        let briefBudget: java.lang.String = this.budget.toStringExternal();
        let n: java.lang.String = this.name().toString();
        return new java.lang.StringBuilder(briefBudget.length() + n.length() + 1).append(n).append(' ').append(briefBudget)
            .toString();
    }

    public toStringLong(): java.lang.String {
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

    public hashCode(): int {
        return this.name().hashCode();
    }

    public equals(obj: java.lang.Object): boolean {
        if (obj === this)
            return true;
        if (obj instanceof Item) {
            return (obj as Item<unknown>).name().equals(this.name());
        }
        return false;
    }

    public abstract static StringKeyItem = class StringKeyItem extends Item<java.lang.CharSequence> {

        public constructor(budget: BudgetValue) {
            super(budget);
        }

        public hashCode(): int {
            return $outer.name().hashCode();
        }

        public equals(obj: java.lang.Object): boolean {
            if (obj === this)
                return true;
            if (obj instanceof Item) {
                return (obj as Item<unknown>).name().equals($outer.name());
            }
            return false;
        }

    };


    public static getPrioritySum(c: java.lang.Iterable<Item<unknown>>): float {
        let totalPriority: float = 0;
        for (let i of c)
            totalPriority += i.getPriority();
        return totalPriority;
    }

    public getBudget(): BudgetValue {
        return this.budget;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Item {
    export type ItemPriorityComparator<E extends Item<unknown>> = InstanceType<typeof Item.ItemPriorityComparator<E>>;
    export type StringKeyItem = InstanceType<typeof Item.StringKeyItem>;
}


