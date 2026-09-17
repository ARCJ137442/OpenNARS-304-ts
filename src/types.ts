/**
 * Adapt the original code to TypeScript from Java.
 *
 * These aliases are project-owned compile-time migration contracts. They used
 * to come from jree, but moving their definitions here must not be mistaken
 * for implementing Java's numeric runtime semantics: float32/int32/long
 * narrowing remains an explicit follow-up contract at each operation boundary.
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
export type char = number;
export type short = number;
export type long = bigint;
export type float = number;
export type double = number;
