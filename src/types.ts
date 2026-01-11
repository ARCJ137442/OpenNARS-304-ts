/**
 * Adapt the original code to TypeScript from Java.
 *
 * The only semantic distinction we preserve is integer vs. floating numbers.
 * Everything else maps directly to native TypeScript types.
 *
 * For other types:
 * - String: string
 * - boolean: boolean
 * - Object: object (avoid any unless required)
 * - void: void (no return value)
 * - null: null
 * - Array<T>: T[]
 * - HashMap<K, V>: Map<K, V>
 * - HashSet<T>: Set<T>
 * - LinkedList<T>: T[] (treat as list semantics)
 * - Queue<T>: T[] (treat as queue semantics with push/shift)
 * - enum: enum { ... } or const object + as const
 */
export type int = number;
