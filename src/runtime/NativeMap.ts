import { javaValueEquals, javaValueHashCode } from "./NativeSet.ts";

/**
 * Minimal Java Map contract shared by native maps and translated Java map inputs.
 * This is deliberately a Map abstraction, not a replacement for List or Set.
 * It contains only the operations used by the inference substitution/counting
 * paths; richer live-view and iterator behavior remains on NativeMap itself.
 */
export interface MapContract<K, V> {
    clear(): void;
    containsKey(key: K): boolean;
    get(key: K): V | null;
    getOrDefault(key: K, defaultValue: V): V;
    isEmpty(): boolean;
    keySet(): Iterable<K>;
    put(key: K, value: V): V | null;
    size(): number;
}

interface NativeMapRecord<K, V> {
    key: K;
    value: V;
    /** Current position in the insertion-ordered record table. */
    index: number;
    /** Java HashMap-compatible lookup hash; null means equality-only fallback. */
    hashCode: number | null;
}

/**
 * Native insertion-ordered Map for translated Java Map contracts.
 *
 * The first migration user is Java's LinkedHashMap<Term, Integer> used by
 * Term.countTermRecursively.  Map remains an explicit abstraction here: the
 * backing table is private, lookups use Java equals semantics, replacement
 * keeps the original key and insertion position, and the collection views
 * remain live.  The ordered record table remains the source of iteration order;
 * hash buckets only narrow equality candidates for keys that expose a Java-
 * compatible hashCode.  Keys without hashCode retain the previous full
 * equality scan so Map semantics do not depend on JS identity.
 */
export class NativeMap<K, V> implements Iterable<[K, V]>, MapContract<K, V> {
    private readonly records: NativeMapRecord<K, V>[] = [];
    private readonly hashBuckets = new Map<number, NativeMapRecord<K, V>[]>();
    private readonly objectHashCache = new WeakMap<object, number>();
    private modificationCount = 0;

    public constructor(initialEntries: Iterable<readonly [K, V]> = []) {
        for (const [key, value] of initialEntries) {
            this.put(key, value);
        }
    }

    public clear(): void {
        if (this.records.length > 0) {
            this.records.length = 0;
            this.hashBuckets.clear();
            this.modificationCount += 1;
        }
    }

    public clone(): NativeMap<K, V> {
        return new NativeMap(this.records.map((record) => [record.key, record.value] as const));
    }

    public containsKey(key: K): boolean {
        return this.findIndex(key) >= 0;
    }

    public containsValue(value: V): boolean {
        return this.records.some((record) => javaValueEquals(record.value, value));
    }

    public entrySet(): NativeMapEntrySetView<K, V> {
        return new NativeMapEntrySetView(this);
    }

    public equals(other: unknown): boolean {
        if (other === this) {
            return true;
        }
        const candidate = other as {
            size?: unknown;
            containsKey?: unknown;
            get?: unknown;
        } | null;
        if (candidate === null
            || typeof candidate !== "object"
            || typeof candidate.size !== "function"
            || typeof candidate.containsKey !== "function"
            || typeof candidate.get !== "function"
            || Number(candidate.size()) !== this.size()) {
            return false;
        }
        return this.records.every((record) => {
            const containsKey = candidate.containsKey as (key: K) => boolean;
            const get = candidate.get as (key: K) => V | null;
            return containsKey.call(candidate, record.key)
                && javaValueEquals(record.value, get.call(candidate, record.key));
        });
    }

    public get(key: K): V | null {
        const index = this.findIndex(key);
        return index < 0 ? null : this.records[index].value;
    }

    public getOrDefault(key: K, defaultValue: V): V {
        const index = this.findIndex(key);
        return index < 0 ? defaultValue : this.records[index].value;
    }

    public hashCode(): number {
        return this.records.reduce(
            (sum, record) => (sum + (javaValueHashCode(record.key) ^ javaValueHashCode(record.value))) | 0,
            0,
        );
    }

    public isEmpty(): boolean {
        return this.records.length === 0;
    }

    public keySet(): NativeMapKeySetView<K, V> {
        return new NativeMapKeySetView(this);
    }

    public put(key: K, value: V): V | null {
        const index = this.findIndex(key);
        if (index < 0) {
            const record: NativeMapRecord<K, V> = {
                key,
                value,
                index: this.records.length,
                hashCode: this.keyHashCode(key),
            };
            this.records.push(record);
            this.addToHashIndex(record);
            this.modificationCount += 1;
            return null;
        }
        const previous = this.records[index].value;
        this.records[index].value = value;
        return previous;
    }

    public putAll(map: { entrySet(): Iterable<unknown> }): void {
        for (const entry of map.entrySet()) {
            const candidate = entry as {
                getKey?: () => K;
                getValue?: () => V;
            };
            if (typeof candidate.getKey !== "function" || typeof candidate.getValue !== "function") {
                throw new TypeError("NativeMap.putAll requires Java Map.Entry values");
            }
            this.put(candidate.getKey(), candidate.getValue());
        }
    }

    public remove(key: K): V | null {
        const index = this.findIndex(key);
        if (index < 0) {
            return null;
        }
        const [removed] = this.records.splice(index, 1);
        this.removeFromHashIndex(removed);
        this.reindexFrom(index);
        this.modificationCount += 1;
        return removed.value;
    }

    public size(): number {
        return this.records.length;
    }

    public values(): NativeMapValuesView<K, V> {
        return new NativeMapValuesView(this);
    }

    public [Symbol.iterator](): IterableIterator<[K, V]> {
        const iterator = this.iterator((record) => [record.key, record.value] as [K, V]);
        return new NativeMapIterableIterator(iterator);
    }

    /** Java-shaped iterator used by the live Map views. */
    public iterator<T>(project: (record: NativeMapRecord<K, V>) => T = (record) => record as unknown as T): NativeMapIterator<T, K, V> {
        return new NativeMapIterator(this, project);
    }

    /** @internal Used by NativeMapIterator and live views. */
    public get modificationVersion(): number {
        return this.modificationCount;
    }

    /** @internal Used by NativeMapIterator and entry views. */
    public recordAt(index: number): NativeMapRecord<K, V> {
        return this.records[index];
    }

    /** @internal Used by the live values view without exposing the table itself. */
    public recordsForView(): readonly NativeMapRecord<K, V>[] {
        return this.records;
    }

    /** @internal Used by NativeMapEntry.setValue. */
    public replaceRecordValue(record: NativeMapRecord<K, V>, value: V): V {
        const index = this.records.indexOf(record);
        if (index < 0) {
            throw new Error("NativeMap entry is no longer present");
        }
        const previous = this.records[index].value;
        this.records[index].value = value;
        return previous;
    }

    /** @internal Used by NativeMapIterator after a successful next(). */
    public removeRecord(record: NativeMapRecord<K, V>): void {
        const index = this.records.indexOf(record);
        if (index < 0) {
            throw new Error("NativeMap entry is no longer present");
        }
        this.removeFromHashIndex(record);
        this.records.splice(index, 1);
        this.reindexFrom(index);
        this.modificationCount += 1;
    }

    private findIndex(key: K): number {
        const hashCode = this.keyHashCode(key);
        if (hashCode === null) {
            return this.records.findIndex((record) => record.key === key || javaValueEquals(record.key, key));
        }
        const bucket = this.hashBuckets.get(hashCode);
        if (bucket === undefined) {
            return -1;
        }
        const record = bucket.find((candidate) => candidate.key === key || javaValueEquals(candidate.key, key));
        return record?.index ?? -1;
    }

    private keyHashCode(key: K): number | null {
        if (key === null || key === undefined) {
            return javaValueHashCode(key);
        }
        const type = typeof key;
        if (type !== "object" && type !== "function") {
            return javaValueHashCode(key);
        }
        const hashCode = (key as unknown as { hashCode?: unknown }).hashCode;
        if (typeof hashCode !== "function") return null;
        const cached = this.objectHashCache.get(key as object);
        if (cached !== undefined) return cached;
        const computed = Number(hashCode.call(key));
        this.objectHashCache.set(key as object, computed);
        return computed;
    }

    private addToHashIndex(record: NativeMapRecord<K, V>): void {
        if (record.hashCode === null) {
            return;
        }
        const bucket = this.hashBuckets.get(record.hashCode);
        if (bucket === undefined) {
            this.hashBuckets.set(record.hashCode, [record]);
        } else {
            bucket.push(record);
        }
    }

    private removeFromHashIndex(record: NativeMapRecord<K, V>): void {
        if (record.hashCode === null) {
            return;
        }
        const bucket = this.hashBuckets.get(record.hashCode);
        if (bucket === undefined) {
            return;
        }
        const index = bucket.indexOf(record);
        if (index >= 0) {
            bucket.splice(index, 1);
        }
        if (bucket.length === 0) {
            this.hashBuckets.delete(record.hashCode);
        }
    }

    private reindexFrom(start: number): void {
        for (let index = start; index < this.records.length; index += 1) {
            this.records[index].index = index;
        }
    }
}

export class NativeMapEntry<K, V> {
    public constructor(
        private readonly owner: NativeMap<K, V>,
        private readonly record: NativeMapRecord<K, V>,
    ) {}

    public equals(other: unknown): boolean {
        const candidate = other as {
            getKey?: () => unknown;
            getValue?: () => unknown;
        } | null;
        return candidate !== null
            && typeof candidate === "object"
            && typeof candidate.getKey === "function"
            && typeof candidate.getValue === "function"
            && javaValueEquals(this.record.key, candidate.getKey())
            && javaValueEquals(this.record.value, candidate.getValue());
    }

    public getKey(): K {
        return this.record.key;
    }

    public getValue(): V {
        return this.record.value;
    }

    public hashCode(): number {
        return javaValueHashCode(this.record.key) ^ javaValueHashCode(this.record.value);
    }

    public setValue(value: V): V {
        return this.owner.replaceRecordValue(this.record, value);
    }
}

export class NativeMapEntrySetView<K, V> implements Iterable<NativeMapEntry<K, V>> {
    public constructor(private readonly owner: NativeMap<K, V>) {}

    public clear(): void {
        this.owner.clear();
    }

    public contains(entry: unknown): boolean {
        const candidate = entry as {
            getKey?: () => K;
            getValue?: () => V;
        } | null;
        if (candidate === null || typeof candidate !== "object"
            || typeof candidate.getKey !== "function" || typeof candidate.getValue !== "function") {
            return false;
        }
        const key = candidate.getKey();
        const value = this.owner.get(key);
        return this.owner.containsKey(key) && javaValueEquals(value, candidate.getValue());
    }

    public isEmpty(): boolean {
        return this.owner.isEmpty();
    }

    public iterator(): NativeMapIterator<NativeMapEntry<K, V>, K, V> {
        return this.owner.iterator((record) => new NativeMapEntry(this.owner, record));
    }

    public remove(entry: unknown): boolean {
        const candidate = entry as {
            getKey?: () => K;
            getValue?: () => V;
        } | null;
        if (candidate === null || typeof candidate !== "object"
            || typeof candidate.getKey !== "function" || typeof candidate.getValue !== "function"
            || !this.contains(candidate)) {
            return false;
        }
        const key = candidate.getKey();
        const present = this.owner.containsKey(key);
        this.owner.remove(key);
        return present;
    }

    public size(): number {
        return this.owner.size();
    }

    public toArray(): NativeMapEntry<K, V>[] {
        return Array.from(this);
    }

    public [Symbol.iterator](): IterableIterator<NativeMapEntry<K, V>> {
        return new NativeMapIterableIterator(this.iterator());
    }
}

export class NativeMapKeySetView<K, V> implements Iterable<K> {
    public constructor(private readonly owner: NativeMap<K, V>) {}

    public clear(): void {
        this.owner.clear();
    }

    public contains(key: K): boolean {
        return this.owner.containsKey(key);
    }

    public isEmpty(): boolean {
        return this.owner.isEmpty();
    }

    public iterator(): NativeMapIterator<K, K, V> {
        return this.owner.iterator((record) => record.key);
    }

    public remove(key: K): boolean {
        const present = this.owner.containsKey(key);
        this.owner.remove(key);
        return present;
    }

    public size(): number {
        return this.owner.size();
    }

    public toArray(): K[] {
        return Array.from(this);
    }

    public [Symbol.iterator](): IterableIterator<K> {
        return new NativeMapIterableIterator(this.iterator());
    }
}

export class NativeMapValuesView<K, V> implements Iterable<V> {
    public constructor(private readonly owner: NativeMap<K, V>) {}

    public clear(): void {
        this.owner.clear();
    }

    public contains(value: V): boolean {
        return this.owner.containsValue(value);
    }

    public isEmpty(): boolean {
        return this.owner.isEmpty();
    }

    public iterator(): NativeMapIterator<V, K, V> {
        return this.owner.iterator((record) => record.value);
    }

    public remove(value: V): boolean {
        for (const record of this.owner.recordsForView()) {
            if (javaValueEquals(record.value, value)) {
                this.owner.removeRecord(record);
                return true;
            }
        }
        return false;
    }

    public size(): number {
        return this.owner.size();
    }

    public toArray(): V[] {
        return Array.from(this);
    }

    public [Symbol.iterator](): IterableIterator<V> {
        return new NativeMapIterableIterator(this.iterator());
    }
}

export class NativeMapIterator<T, K, V> {
    private cursor = 0;
    private lastRecord: NativeMapRecord<K, V> | null = null;
    private expectedModificationVersion: number;

    public constructor(
        private readonly owner: NativeMap<K, V>,
        private readonly project: (record: NativeMapRecord<K, V>) => T,
    ) {
        this.expectedModificationVersion = owner.modificationVersion;
    }

    public hasNext(): boolean {
        this.checkForExternalMutation();
        return this.cursor < this.owner.size();
    }

    public next(): T {
        this.checkForExternalMutation();
        if (!this.hasNext()) {
            throw new Error("NativeMap iterator is exhausted");
        }
        this.lastRecord = this.owner.recordAt(this.cursor);
        this.cursor += 1;
        return this.project(this.lastRecord);
    }

    public remove(): void {
        this.checkForExternalMutation();
        if (this.lastRecord === null) {
            throw new Error("NativeMap iterator has no removable entry");
        }
        this.owner.removeRecord(this.lastRecord);
        this.cursor -= 1;
        this.lastRecord = null;
        this.expectedModificationVersion = this.owner.modificationVersion;
    }

    private checkForExternalMutation(): void {
        if (this.expectedModificationVersion !== this.owner.modificationVersion) {
            throw new Error("NativeMap was modified outside its iterator");
        }
    }
}

class NativeMapIterableIterator<T, K, V> implements IterableIterator<T> {
    public constructor(private readonly iterator: NativeMapIterator<T, K, V>) {}

    public [Symbol.iterator](): IterableIterator<T> {
        return this;
    }

    public next(): IteratorResult<T> {
        if (!this.iterator.hasNext()) {
            return { done: true, value: undefined as never };
        }
        return { done: false, value: this.iterator.next() };
    }
}
