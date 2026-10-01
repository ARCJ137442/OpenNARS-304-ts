import type { NativeJavaString } from "./native-java-runtime.js";
import type { JavaThrowable, JavaException, JavaRuntimeException } from "./legacy-exceptions.js";

declare global {
    namespace java {
        namespace lang {
            type Object = any;
            type Class<T> = any;
            type Comparable<T> = any;
            type String = any;
            type CharSequence = any;
            type Number = any;
            type Boolean = any;
            type Throwable = JavaThrowable;
            type Error = JavaThrowable;
            type Exception = JavaException;
            type RuntimeException = JavaRuntimeException;
            type IllegalArgumentException = any;
            type IllegalStateException = any;
            type NumberFormatException = any;
            type NullPointerException = any;
            type StringBuilder = any;
            type Integer = any;
            type Long = any;
            type Float = any;
            type Double = any;
        }

        namespace util {
            interface List<T> extends Iterable<T> { size(): number; get(index: number): T; add(value: T): boolean; addAll(values: Collection<T>): boolean; remove(index: number): T; contains(value: T): boolean; clear(): void; toArray(): T[]; }
            interface Collection<T> extends Iterable<T> { size(): number; add(value: T): boolean; addAll(values: Collection<T>): boolean; contains(value: T): boolean; clear(): void; }
            interface Set<T> extends Collection<T> { contains(value: T): boolean; }
            interface Map<K, V> { size(): number; isEmpty(): boolean; clear(): void; get(key: K): V | null; getOrDefault(key: K, fallback: V): V; put(key: K, value: V): V | null; remove(key: K): V | null; containsKey(key: K): boolean; keySet(): Set<K>; values(): Collection<V>; entrySet(): Set<Map.Entry<K, V>>; }
            namespace Map { interface Entry<K, V> { getKey(): K; getValue(): V; setValue(value: V): V; } }
            interface Iterator<T> { hasNext(): boolean; next(): T; remove(): void; }
            interface Random { next(bits: number): number; nextInt(bound?: number): number; nextFloat(): number; nextDouble(): number; setSeed(seed: bigint | number): void; }
            interface LinkedHashSet<T> extends Set<T> { toArray(): T[]; remove(value: T): boolean; }
            const List: { new<T>(...args: any[]): List<T> };
            const ArrayList: { new<T>(...args: any[]): List<T> };
            const LinkedList: { new<T>(...args: any[]): List<T> };
            const Set: { new<T>(...args: any[]): Set<T> };
            const HashSet: { new<T>(...args: any[]): Set<T> };
            const LinkedHashSet: { new<T>(...args: any[]): Set<T> };
            const HashMap: { new<K, V>(...args: any[]): Map<K, V> };
            const LinkedHashMap: { new<K, V>(...args: any[]): Map<K, V> };
            const Random: { new(seed?: bigint | number): Random };
            const Arrays: { hashCode(values: unknown[]): number };
            const NoSuchElementException: any;
            const UnsupportedOperationException: any;
            namespace concurrent { namespace atomic { class AtomicBoolean { constructor(value?: boolean); set(value: boolean): void; get(): boolean; } } }
        }

        namespace io {
            type PrintWriter = any;
            type PrintStream = any;
            type StringWriter = any;
            type FileWriter = any;
            type FileOutputStream = any;
            type FileInputStream = any;
            type IOException = JavaException;
            type InputStream = any;
            type InputStreamReader = any;
            type BufferedReader = any;
            type ByteArrayOutputStream = any;
            type ObjectOutputStream = any;
            type ObjectInputStream = any;
            type File = any;
        }

        namespace net {
            type InetAddress = any;
            type DatagramSocket = any;
            type DatagramPacket = any;
        }

        namespace nio.charset {
            type Charset = any;
            type StandardCharsets = any;
        }

    }
}

export {};
