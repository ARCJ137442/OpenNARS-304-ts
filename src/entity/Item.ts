import { java, JavaObject, type int, type float, S } from "jree";
import {BudgetValue} from './BudgetValue'


/**
 * An item is an object that can be put into a Bag,
 * to participate in the resource competition of the system.
 * <p>
 * It has a key and a budget. Cannot be cloned
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract  class Item<K> implements JavaObject, java.io.Serializable {

    public static ItemPriorityComparator =  class ItemPriorityComparator<E extends Item<unknown>> extends JavaObject implements java.util.Comparator<java.lang.Math.E> {

        public  compare(/* final */  a: E, /* final */  b: E):  int {
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
    public readonly  budget:  BudgetValue ;

    public  constructor();

    /**
     * Constructor with initial budget
     *
     * @param budget The initial budget
     */
    protected  constructor(/* final */  budget: BudgetValue);
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
    public abstract  name():  K;

    /**
     * Get priority value
     *
     * @return Current priority value
     */
    public  getPriority():  float {
        return this.budget.getPriority();
    }

    /**
     * Set priority value
     *
     * @param v Set a new priority value
     */
    public  setPriority(/* final */  v: float):  void {
        this.budget.setPriority(v);
    }

    /**
     * Increase priority value
     *
     * @param v The amount of increase
     */
    public  incPriority(/* final */  v: float):  void {
        this.budget.incPriority(v);
    }

    /**
     * Decrease priority value
     *
     * @param v The amount of decrease
     */
    public  decPriority(/* final */  v: float):  void {
        this.budget.decPriority(v);
    }

    /**
     * Get durability value
     *
     * @return Current durability value
     */
    public  getDurability():  float {
        return this.budget.getDurability();
    }

    /**
     * Set durability value
     *
     * @param v The new durability value
     */
    public  setDurability(/* final */  v: float):  void {
        this.budget.setDurability(v);
    }

    /**
     * Increase durability value
     *
     * @param v The amount of increase
     */
    public  incDurability(/* final */  v: float):  void {
        this.budget.incDurability(v);
    }

    /**
     * Decrease durability value
     *
     * @param v The amount of decrease
     */
    public  decDurability(/* final */  v: float):  void {
        this.budget.decDurability(v);
    }

    /**
     * Get quality value
     *
     * @return The quality value
     */
    public  getQuality():  float {
        return this.budget.getQuality();
    }

    /**
     * Set quality value
     *
     * @param v The new quality value
     */
    public  setQuality(/* final */  v: float):  void {
        this.budget.setQuality(v);
    }

    /**
     * Merge with another Item with identical key
     *
     * @param that The Item to be merged
     * @return the resulting Item: this or that
     */
    public  merge(/* final */  that: Item<unknown>):  Item<unknown> {
        this.budget.merge(that.budget);
        return this;
    }

    /**
     * Return a String representation of the Item
     *
     * @return The String representation of the full content
     */
    public override  toString():  java.lang.String {
        // return budget + " " + key ;

         let  budgetStr: java.lang.String = this.budget !== null ? this.budget.toString() : "";
         let  n: java.lang.String = this.name().toString();
        return new  java.lang.StringBuilder(budgetStr.length() + n.length() + 1).append(budgetStr).append(' ').append(n)
                .toString();
    }

    /**
     * Return a String representation of the Item after simplification
     *
     * @return A simplified String representation of the content
     */
    public  toStringExternal():  java.lang.String {
         let  briefBudget: java.lang.String = this.budget.toStringExternal();
         let  n: java.lang.String = this.name().toString();
        return new  java.lang.StringBuilder(briefBudget.length() + n.length() + 1).append(briefBudget).append(' ').append(n)
                .toString();
    }

    /** similar to toStringExternal but includes budget afterward */
    public  toStringExternal2():  java.lang.String {
         let  briefBudget: java.lang.String = this.budget.toStringExternal();
         let  n: java.lang.String = this.name().toString();
        return new  java.lang.StringBuilder(briefBudget.length() + n.length() + 1).append(n).append(' ').append(briefBudget)
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
        return this.name().hashCode();
    }

    public equals(/* final */  obj: java.lang.Object):  boolean {
        if (obj === this)
            return true;
        if (obj instanceof Item) {
            return ( obj as Item<unknown>).name().equals(this.name());
        }
        return false;
    }

    public abstract static StringKeyItem =  class StringKeyItem extends Item<java.lang.CharSequence> {

        public  constructor(/* final */  budget: BudgetValue) {
            super(budget);
        }

        public  hashCode():  int {
            return $outer.name().hashCode();
        }

        public  equals(/* final */  obj: java.lang.Object):  boolean {
            if (obj === this)
                return true;
            if (obj instanceof Item) {
                return ( obj as Item<unknown>).name().equals($outer.name());
            }
            return false;
        }

    };


    public static  getPrioritySum(/* final */  c: java.lang.Iterable< Item<unknown>>):  float {
        let  totalPriority: float = 0;
        for (let i of c)
            totalPriority += i.getPriority();
        return totalPriority;
    }

    public  getBudget():  BudgetValue {
        return this.budget;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Item {
	export type ItemPriorityComparator<<E extends Item<unknown>>> = InstanceType<typeof Item.ItemPriorityComparator<E>>;
	export type StringKeyItem = InstanceType<typeof Item.StringKeyItem>;
}


