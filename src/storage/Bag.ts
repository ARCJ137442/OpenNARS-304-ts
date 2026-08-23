//! Java source: opennars/storage/Bag.java
import { java, JavaObject, type int, type float, S } from "jree";
import { Item } from "../entity/Item.ts";
import { Distributor } from "./Distributor.ts";
import { Parameters } from "../main/Parameters.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import { Float32Math } from "../runtime/Float32.ts";
import type { Memory } from "./Memory.ts";


/**
 * Original Bag implementation which distributes items into
 * discrete levels (queues) according to priority
 */
export class Bag<Type extends Item<K>, K> implements JavaObject, java.io.Serializable {

    /** priority levels */
    private readonly TOTAL_LEVEL: int;
    /** firing threshold */
    private readonly THRESHOLD: int;
    /** shared DISTRIBUTOR that produce the probability distribution */
    private readonly DISTRIBUTOR: Distributor;
    /** mapping from key to item */
    private nameTable: java.util.HashMap<K, Type>;
    /** array of lists of items, for items on different level */
    private itemTable: java.util.ArrayList<java.util.ArrayList<Type>>;
    /** defined in different bags */
    private readonly capacity: int;
    /** current sum of occupied level */
    private mass: int;
    /** index to get next level, kept in individual objects */
    private levelIndex: int;
    /** current take out level */
    private currentLevel: int;
    /** maximum number of items to be taken out at current level */
    private currentCounter: int;

    public constructor(levels: int, capacity: int, narParameters: Parameters);

    /** thresholdLevel = 0 disables "fire level completely" threshold effect */
    public constructor(levels: int, capacity: int, thresholdLevel: int);
    public constructor(...args: unknown[]) {
        if (args.length !== 3) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        const [levels, capacity, third] = args as [int, int, Parameters | int];
        const thresholdLevel = typeof third === "number"
            ? third
            : (third as Parameters).BAG_THRESHOLD * levels as int;
        this.TOTAL_LEVEL = levels;
        this.DISTRIBUTOR = new Distributor(this.TOTAL_LEVEL);
        this.THRESHOLD = thresholdLevel;
        this.capacity = capacity;
        this.clear();
    }


    public clear(): void {
        this.itemTable = new java.util.ArrayList<java.util.ArrayList<Type>>(this.TOTAL_LEVEL);
        for (let i: int = 0; i < this.TOTAL_LEVEL; i++) {
            this.itemTable.add(new java.util.ArrayList<Type>());
        }
        this.nameTable = new java.util.LinkedHashMap<K, Type>();
        this.currentLevel = this.TOTAL_LEVEL - 1;
        this.levelIndex = this.capacity % this.TOTAL_LEVEL; // so that different bags start at different point
        this.mass = 0;
        this.currentCounter = 0;
    }

    /**
     * Get the average priority of Items
     *
     * @return The average priority of Items in the bag
     */
    public getAveragePriority(): float {
        if (this.nameTable.isEmpty()) {
            return 0.01;
        }
        // Java casts mass to float before dividing by the integer denominator.
        // Narrow the numerator and the result at the same operation boundary.
        let f: float = Float32Math.divide(
            Float32Math.from(this.mass),
            this.nameTable.size() * this.TOTAL_LEVEL,
        ) as float;
        if (f > 1) {
            return 1.0;
        }
        return f;
    }

    /**
     * Check if an item is in the bag
     *
     * @param it An item
     * @return Whether the Item is in the Bag
     */
    public contains(it: Type): boolean {
        return this.nameTable.containsValue(it);
    }

    /**
     * Get an Item by key
     *
     * @param key The key of the Item
     * @return The Item with the given key
     */
    public get(key: K): Type {
        return this.nameTable.get(key);
    }

    /**
     * Add a new Item into the Bag
     *
     * @param newItem The new Item
     * @return Whether the new Item is added into the Bag
     */
    public putIn(newItem: Type): Type {
        let newKey: K = newItem.name();
        let oldItem: Type = this.nameTable.put(newKey, newItem);
        if (oldItem !== null) { // merge duplications
            this.outOfBase(oldItem);
            newItem.merge(oldItem);
        }
        let overflowItem: Type = this.intoBase(newItem); // put the (new or merged) item into itemTable
        if (overflowItem !== null) { // remove overflow
            let overflowKey: K = overflowItem.name();
            this.nameTable.remove(overflowKey);
            return overflowItem;
        } else {
            return null;
        }
    }

    /**
     * Put an item back into the itemTable
     * <p>
     * The only place where the forgetting rate is applied
     *
     * @param oldItem The Item to put back
     * @param m       related memory
     * @return the item which was removed, or null if none removed
     */
    public putBack(oldItem: Type, forgetCycles: float, m: Memory): Type {
        let relativeThreshold: float = m.narParameters.FORGET_QUALITY_RELATIVE;
        BudgetFunctions.applyForgetting(oldItem.budget, forgetCycles, relativeThreshold);
        return this.putIn(oldItem);
    }

    /**
     * Choose an Item according to priority distribution and take it out of the Bag
     *
     * @return The selected Item
     */
    public takeOut(): Type {
        if (this.nameTable.isEmpty()) { // empty bag
            return null;
        }
        if (this.emptyLevel(this.currentLevel) || (this.currentCounter === 0)) { // done with the current level
            this.currentLevel = this.DISTRIBUTOR.pick(this.levelIndex);
            this.levelIndex = this.DISTRIBUTOR.next(this.levelIndex);
            while (this.emptyLevel(this.currentLevel)) { // look for a non-empty level
                this.currentLevel = this.DISTRIBUTOR.pick(this.levelIndex);
                this.levelIndex = this.DISTRIBUTOR.next(this.levelIndex);
            }
            if (this.currentLevel < this.THRESHOLD) { // for dormant levels, take one item
                this.currentCounter = 1;
            } else { // for active levels, take all current items
                this.currentCounter = this.itemTable.get(this.currentLevel).size();
            }
        }
        let selected: Type = this.takeOutFirst(this.currentLevel); // take out the first item in the level
        let belongingLevel: int = this.getLevel(selected);
        if (this.currentLevel !== belongingLevel) {
            this.intoBase(selected);
            return this.takeOut();
        }
        this.currentCounter--;
        this.nameTable.remove(selected.name());
        return selected;
    }

    /**
     * Pick an item by key, then remove it from the bag
     *
     * @param key The given key
     * @return The Item with the key
     */
    public pickOut(key: K): Type;

    public pickOut(val: Type): Type;
    public pickOut(...args: unknown[]): Type {
        if (args.length !== 1) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        // Java overloads pickOut(K) and pickOut(Type) have the same arity.
        // The generated switch cannot distinguish them by argument count, so
        // the object overload must be selected explicitly at runtime.
        const [value] = args;
        const key = value instanceof Item
            ? (value as Type).name()
            : value as K;
        const picked: Type = this.nameTable.get(key);
        if (picked !== null) {
            this.outOfBase(picked);
            this.nameTable.remove(key);
        }
        return picked;
    }


    /**
     * Check whether a level is empty
     *
     * @param n The level index
     * @return Whether that level is empty
     */
    protected emptyLevel(n: int): boolean {
        return this.itemTable.get(n).isEmpty();
    }

    /**
     * Decide the put-in level according to priority
     *
     * @param item The Item to put in
     * @return The put-in level
     */
    private getLevel(item: Type): int {
        // Java evaluates this multiplication as float before Math.ceil. Keep
        // the write boundary here or priorities such as 0.8 would become
        // 80.000001... in JavaScript and move to the next level.
        // Java multiplies two float operands here before Math.ceil.
        let fl: float = Float32Math.multiply(item.getPriority(), this.TOTAL_LEVEL) as float;
        let level: int = java.lang.Math.ceil(fl) as int - 1;
        return (level < 0) ? 0 : level; // cannot be -1
    }

    /**
     * Insert an item into the itemTable, and return the overflow
     *
     * @param newItem The Item to put in
     * @return The overflow Item
     */
    private intoBase(newItem: Type): Type {
        let oldItem: Type = null;
        let inLevel: int = this.getLevel(newItem);
        if (this.nameTable.size() > this.capacity) { // the bag is full
            let outLevel: int = 0;
            while (this.emptyLevel(outLevel)) {
                outLevel++;
            }
            if (outLevel > inLevel) { // ignore the item and exit
                return newItem;
            } else { // remove an old item in the lowest non-empty level
                oldItem = this.takeOutFirst(outLevel);
            }
        }
        this.itemTable.get(inLevel).add(newItem); // FIFO
        this.mass += (inLevel + 1); // increase total mass
        return oldItem; // TODO return null is a bad smell
    }

    /**
     * Take out the first or last Type in a level from the itemTable
     *
     * @param level The current level
     * @return The first Item
     */
    private takeOutFirst(level: int): Type {
        let selected: Type = this.itemTable.get(level).get(0);
        this.itemTable.get(level).remove(0);
        this.mass -= (level + 1);
        return selected;
    }

    /**
     * Remove an item from itemTable, then adjust mass
     *
     * @param oldItem The Item to be removed
     */
    protected outOfBase(oldItem: Type): void {
        let level: int = this.getLevel(oldItem);
        this.itemTable.get(level).remove(oldItem);
        this.mass -= (level + 1);
    }

    /**
     * Collect Bag content into a String for display
     */
    public toString(): java.lang.String {
        let buf: java.lang.StringBuffer = new java.lang.StringBuffer(" ");
        for (let i: int = this.TOTAL_LEVEL; i >= 0; i--) {
            if (!this.emptyLevel(i - 1)) {
                buf = buf.append("\n --- Level " + i + ":\n ");
                for (let j: int = 0; j < this.itemTable.get(i - 1).size(); j++) {
                    buf = buf.append(this.itemTable.get(i - 1).get(j).toString() + "\n ");
                }
            }
        }
        return buf.toString();
    }

    /** TODO bad paste from preceding */
    public toStringLong(): java.lang.String {
        let buf: java.lang.StringBuffer = new java.lang.StringBuffer(" BAG " + this.getClass().getSimpleName());
        buf.append(" ").append(this.showSizes());
        for (let i: int = this.TOTAL_LEVEL; i >= 0; i--) {
            if (!this.emptyLevel(i - 1)) {
                buf = buf.append("\n --- LEVEL " + i + ":\n ");
                for (let j: int = 0; j < this.itemTable.get(i - 1).size(); j++) {
                    buf = buf.append(this.itemTable.get(i - 1).get(j).toStringLong() + "\n ");
                }
            }
        }
        buf.append(">>>> end of Bag").append(this.getClass().getSimpleName());
        return buf.toString();
    }

    protected showSizes(): java.lang.String {
        let buf: java.lang.StringBuilder = new java.lang.StringBuilder(" ");
        let levels: int = 0;
        for (let items of this.itemTable) {
            if ((items !== null) && !items.isEmpty()) {
                levels++;
                buf.append(items.size()).append(" ");
            }
        }
        return "Levels: " + java.lang.Integer.toString(levels) + ", sizes: " + buf;
    }

    public size(): int {
        return this.nameTable.size();
    }

    public iterator(): java.util.Iterator<Type> {
        return this.nameTable.values().iterator();
    }

    public [Symbol.iterator](): Iterator<Type> {
        const iterator = this.iterator();
        return {
            next: (): IteratorResult<Type> => iterator.hasNext()
                ? { value: iterator.next(), done: false }
                : { value: undefined as unknown as Type, done: true },
        };
    }
}
