//! Java source: opennars/storage/Bag.java
import { java, S } from "jree";
import type { int, float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Item } from "../entity/Item.ts";
import { Distributor } from "./Distributor.ts";
import { Parameters } from "../main/Parameters.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { javaValuesEqual } from "../runtime/jree-compat.ts";
import { NativeMap } from "../runtime/NativeMap.ts";
import type { JavaIterator } from "../runtime/JavaIterator.ts";
import { RuntimeObject } from "../runtime/RuntimeClass.ts";
import type { Memory } from "./Memory.ts";


/**
 * Original Bag implementation which distributes items into
 * discrete levels (queues) according to priority
 */
// Java original type: Bag<Type, K> implements Serializable, Iterable<Type>.
// Serializable is a marker here; RuntimeObject preserves the observed
// getClass().getSimpleName() boundary used by toStringLong without retaining
// the translated jree JavaObject shell.
export class Bag<Type extends Item<K>, K> extends RuntimeObject {

    /** priority levels */
    private readonly TOTAL_LEVEL: int;
    /** firing threshold */
    private readonly THRESHOLD: int;
    /** shared DISTRIBUTOR that produce the probability distribution */
    private readonly DISTRIBUTOR: Distributor;
    /**
     * Java original type: HashMap<K, Type>; concrete implementation:
     * LinkedHashMap<K, Type>. NativeMap keeps the Map contract, Java equals
     * lookup, and insertion order without a jree-backed table.
     */
    private nameTable: NativeMap<K, Type> = new NativeMap<K, Type>();
    /** Java hash buckets used to avoid scanning every logical key on each lookup. */
    private equalityBuckets: Map<number, K[]> = new Map<number, K[]>();
    /** Java original type: ArrayList<ArrayList<Type>>; native Type[][] FIFO queues. */
    private itemTable: Type[][] = [];
    /** Native mirror of LinkedHashMap.values() insertion order for JS iteration. */
    private itemOrder: Type[] = [];
    /** Object-identity index for maintaining itemOrder without Java equality scans. */
    private itemOrderIndex: Map<Type, int> = new Map<Type, int>();
    /** defined in different bags */
    private readonly capacity: int;
    /** current sum of occupied level */
    private mass: int = 0;
    /** index to get next level, kept in individual objects */
    private levelIndex: int = 0;
    /** current take out level */
    private currentLevel: int = 0;
    /** maximum number of items to be taken out at current level */
    private currentCounter: int = 0;

    public constructor(levels: int, capacity: int, narParameters: Parameters);

    /** thresholdLevel = 0 disables "fire level completely" threshold effect */
    public constructor(levels: int, capacity: int, thresholdLevel: int);
    public constructor(...args: unknown[]) {
        super();
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
        this.itemTable = [];
        this.itemOrder = [];
        this.itemOrderIndex = new Map<Type, int>();
        for (let i: int = 0; i < this.TOTAL_LEVEL; i++) {
            this.itemTable.push([]);
        }
        // Java original type: HashMap<K, Type>; concrete implementation:
        // LinkedHashMap<K, Type>. Keep the ordered Map abstraction native.
        this.nameTable = new NativeMap<K, Type>();
        this.equalityBuckets = new Map<number, K[]>();
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
        const existingKey = this.findEquivalentKey(key);
        return (existingKey === null ? null : this.nameTable.get(existingKey)) as unknown as Type;
    }

    /**
     * Add a new Item into the Bag
     *
     * @param newItem The new Item
     * @return Whether the new Item is added into the Bag
     */
    public putIn(newItem: Type): Type {
        let newKey: K = newItem.name();
        const existingKey = this.findEquivalentKey(newKey);
        let oldItem: Type;
        if (existingKey === null) {
            oldItem = this.nameTable.put(newKey, newItem) as unknown as Type;
            this.addKeyToBucket(newKey);
            this.itemOrder.push(newItem);
            this.itemOrderIndex.set(newItem, this.itemOrder.length - 1);
        } else {
            oldItem = this.nameTable.put(existingKey, newItem) as unknown as Type;
            const existingIndex = this.itemOrderIndex.get(oldItem);
            if (existingIndex !== undefined) {
                this.itemOrder[existingIndex] = newItem;
                this.itemOrderIndex.delete(oldItem);
                this.itemOrderIndex.set(newItem, existingIndex);
            } else {
                // Recover a missing mirror entry without changing the Java map's logical key.
                this.itemOrder.push(newItem);
                this.itemOrderIndex.set(newItem, this.itemOrder.length - 1);
            }
        }
        if (oldItem !== null) { // merge duplications
            this.outOfBase(oldItem);
            newItem.merge(oldItem);
        }
        let overflowItem: Type = this.intoBase(newItem); // put the (new or merged) item into itemTable
        if (overflowItem !== null) { // remove overflow
            this.removeByEquivalentKey(overflowItem.name());
            return overflowItem;
        } else {
            return null as unknown as Type;
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
        BudgetFunctions.applyForgetting(oldItem.getBudget(), forgetCycles, relativeThreshold);
        return this.putIn(oldItem);
    }

    /**
     * Choose an Item according to priority distribution and take it out of the Bag
     *
     * @return The selected Item
     */
    public takeOut(): Type {
        if (this.nameTable.isEmpty()) { // empty bag
            return null as unknown as Type;
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
                this.currentCounter = this.itemTable[this.currentLevel].length;
            }
        }
        let selected: Type = this.takeOutFirst(this.currentLevel); // take out the first item in the level
        let belongingLevel: int = this.getLevel(selected);
        if (this.currentLevel !== belongingLevel) {
            this.intoBase(selected);
            return this.takeOut();
        }
        this.currentCounter--;
        this.removeKey(selected.name());
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
        const existingKey = this.findEquivalentKey(key);
        const picked: Type = (existingKey === null ? null : this.nameTable.get(existingKey)) as unknown as Type;
        if (picked !== null) {
            this.outOfBase(picked);
            this.removeKey(existingKey);
        }
        return picked;
    }

    /** Resolve Java equals/hashCode key identity for native and restored maps. */
    private findEquivalentKey(key: K): K {
        const directItem = this.nameTable.get(key);
        if (directItem !== null && directItem !== undefined) {
            // NativeMap already applies Java Map equality. Returning the
            // item's current name is sufficient for an equivalent-key
            // operation even when the map retained an older equal key object.
            const directKey = directItem.name();
            if (directKey === key || javaValuesEqual(directKey, key)) {
                return directKey;
            }
        }

        const hashCode = this.keyHashCode(key);
        const candidates = hashCode === null ? null : this.equalityBuckets.get(hashCode);
        const candidateIterator = candidates !== null && candidates !== undefined
            ? (candidates as unknown as { [Symbol.iterator]?: unknown })[Symbol.iterator]
            : undefined;
        if (typeof candidateIterator === "function") {
            for (const existingKey of candidates as K[]) {
                if (javaValuesEqual(existingKey, key)) {
                    return existingKey;
                }
            }
            return null as unknown as K;
        }

        if (hashCode !== null && candidates !== null && candidates !== undefined) {
            // A translated/runtime-restored bucket may not be a native JS
            // iterable. Rebuild only that hash bucket from the authoritative
            // Java map, then keep the fast lookup path for subsequent calls.
            const rebuilt = this.rebuildEqualityBucket(hashCode);
            for (const existingKey of rebuilt) {
                if (javaValuesEqual(existingKey, key)) return existingKey;
            }
            return null as unknown as K;
        }

        if (hashCode !== null) {
            return null as unknown as K;
        }

        for (const entry of this.nameTable.entrySet()) {
            const existingKey = entry.getKey();
            if (javaValuesEqual(existingKey, key)) {
                return existingKey;
            }
        }
        return null as unknown as K;
    }

    private removeByEquivalentKey(key: K): Type {
        const existingKey = this.findEquivalentKey(key);
        return (existingKey === null ? null : this.removeKey(existingKey)) as unknown as Type;
    }

    private keyHashCode(key: K): number | null {
        const hashCode = (key as unknown as { hashCode?: unknown })?.hashCode;
        if (typeof hashCode !== "function") return null;
        return Number(hashCode.call(key));
    }

    private addKeyToBucket(key: K): void {
        const hashCode = this.keyHashCode(key);
        if (hashCode === null) return;
        const bucket = this.equalityBuckets.get(hashCode);
        if (bucket === undefined) {
            this.equalityBuckets.set(hashCode, [key]);
        } else if (!bucket.some((existingKey) => existingKey === key)) {
            bucket.push(key);
        }
    }

    private removeKey(key: K): Type {
        const item = this.nameTable.remove(key);
        if (item !== null && item !== undefined) {
            const itemIndex = this.itemOrderIndex.get(item);
            if (itemIndex !== undefined) {
                this.itemOrder.splice(itemIndex, 1);
                this.itemOrderIndex.delete(item);
                for (let index = itemIndex; index < this.itemOrder.length; index += 1) {
                    this.itemOrderIndex.set(this.itemOrder[index], index);
                }
            }
        }
        const hashCode = this.keyHashCode(key);
        if (hashCode !== null) {
            const bucket = this.equalityBuckets.get(hashCode);
            if (bucket !== undefined) {
                if (Array.isArray(bucket)) {
                    const index = bucket.findIndex((existingKey) => javaValuesEqual(existingKey, key));
                    if (index >= 0) bucket.splice(index, 1);
                    if (bucket.length === 0) this.equalityBuckets.delete(hashCode);
                } else {
                    // Keep removal native when a Java List was restored into
                    // this index; rebuilding the whole name table per remove
                    // would turn a local repair into an O(n²) hot path.
                    const restoredList = bucket as unknown as {
                        size?: () => number;
                        get?: (index: number) => K;
                        remove?: (index: number) => unknown;
                    };
                    if (typeof restoredList.size === "function"
                        && typeof restoredList.get === "function"
                        && typeof restoredList.remove === "function") {
                        for (let index = 0; index < restoredList.size(); index += 1) {
                            if (javaValuesEqual(restoredList.get(index), key)) {
                                restoredList.remove(index);
                                break;
                            }
                        }
                        if (restoredList.size() === 0) this.equalityBuckets.delete(hashCode);
                    } else {
                        const restoredCollection = bucket as unknown as {
                            size?: () => number;
                            iterator?: () => {
                                hasNext: () => boolean;
                                next: () => K;
                                remove: () => void;
                            };
                            [Symbol.iterator]?: () => IterableIterator<K>;
                        };
                        if (typeof restoredCollection.size === "function"
                            && typeof restoredCollection.iterator === "function") {
                            const iterator = restoredCollection.iterator();
                            while (iterator.hasNext()) {
                                if (javaValuesEqual(iterator.next(), key)) {
                                    iterator.remove();
                                    break;
                                }
                            }
                            if (restoredCollection.size() === 0) this.equalityBuckets.delete(hashCode);
                        } else if (typeof restoredCollection[Symbol.iterator] === "function") {
                            const values = [...bucket as unknown as Iterable<K>];
                            const index = values.findIndex((existingKey) => javaValuesEqual(existingKey, key));
                            if (index >= 0) values.splice(index, 1);
                            if (values.length === 0) this.equalityBuckets.delete(hashCode);
                            else this.equalityBuckets.set(hashCode, values);
                        } else {
                            // Unknown restored shape: recover from the
                            // authoritative Java map once, then use the
                            // native array representation subsequently.
                            this.rebuildEqualityBucket(hashCode);
                        }
                    }
                }
            }
        }
        return item as unknown as Type;
    }

    private rebuildEqualityBucket(hashCode: number): K[] {
        const rebuilt: K[] = [];
        for (const entry of this.nameTable.entrySet()) {
            const existingKey = entry.getKey();
            if (this.keyHashCode(existingKey) === hashCode) rebuilt.push(existingKey);
        }
        if (rebuilt.length === 0) {
            this.equalityBuckets.delete(hashCode);
        } else {
            this.equalityBuckets.set(hashCode, rebuilt);
        }
        return rebuilt;
    }


    /**
     * Check whether a level is empty
     *
     * @param n The level index
     * @return Whether that level is empty
     */
    protected emptyLevel(n: int): boolean {
        return this.itemTable[n].length === 0;
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
        let oldItem: Type = null as unknown as Type;
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
        this.itemTable[inLevel].push(newItem); // FIFO
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
        const selected: Type = this.itemTable[level].shift() as Type;
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
        const index = this.itemTable[level].indexOf(oldItem);
        if (index >= 0) this.itemTable[level].splice(index, 1);
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
                for (let j: int = 0; j < this.itemTable[i - 1].length; j++) {
                    buf = buf.append(this.itemTable[i - 1][j].toString() + "\n ");
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
                for (let j: int = 0; j < this.itemTable[i - 1].length; j++) {
                    buf = buf.append(this.itemTable[i - 1][j].toStringLong() + "\n ");
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
            if ((items !== null) && items.length > 0) {
                levels++;
                buf.append(items.length).append(" ");
            }
        }
        return S`Levels: ${levels}, sizes: ${buf}`;
    }

    public size(): int {
        return this.nameTable.size();
    }

    // Java original return type: java.util.Iterator<Type>.
    public iterator(): JavaIterator<Type> {
        return this.nameTable.values().iterator();
    }

    public [Symbol.iterator](): IterableIterator<Type> {
        if (this.itemOrder.length !== this.nameTable.size()) {
            // A deserialized/legacy instance may not contain the native mirror yet.
            this.itemOrder = [];
            this.itemOrderIndex = new Map<Type, int>();
            const iterator = this.nameTable.values().iterator();
            while (iterator.hasNext()) {
                const item = iterator.next();
                this.itemOrderIndex.set(item, this.itemOrder.length);
                this.itemOrder.push(item);
            }
        }
        return this.itemOrder[Symbol.iterator]();
    }
}
