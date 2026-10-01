/**
 * 项目自有的运行时类身份边界。
 *
 * Java 原始类型：java.lang.Class 与隐式 Object.getClass()。
 * 当前实现只承载 OpenNARS 已实际使用的类名、精确身份和实例判断；
 * JavaObject 的 hashCode、monitor 与序列化行为不属于这个边界。
 */
export interface ClassTokenLike {
    getName(): string;
    getSimpleName(): string;
    equals(other: unknown): boolean;
}

export type RuntimeConstructor<T> = (new (...args: never[]) => T) & {
    name: string;
    prototype: T;
};

/** Stable identity token for one TypeScript constructor. */
export class RuntimeClassToken<T> implements ClassTokenLike {
    private static readonly tokens = new WeakMap<Function, RuntimeClassToken<unknown>>();

    private constructor(private readonly owner: RuntimeConstructor<T>) {}

    public static fromConstructor<T>(owner: RuntimeConstructor<T>): RuntimeClassToken<T> {
        const existing = RuntimeClassToken.tokens.get(owner);
        if (existing !== undefined) {
            return existing as RuntimeClassToken<T>;
        }

        const token = new RuntimeClassToken(owner);
        RuntimeClassToken.tokens.set(owner, token as RuntimeClassToken<unknown>);
        return token;
    }

    public getName(): string {
        return this.owner.name;
    }

    public getSimpleName(): string {
        return this.owner.name;
    }

    public equals(other: unknown): boolean {
        return this === other;
    }

    public isInstance(value: unknown): value is T {
        return value instanceof this.owner;
    }

    public newInstance(): T {
        return new this.owner();
    }
}

/**
 * Minimal project-owned replacement for JavaObject where only the observed
 * class identity and Java-style string coercion are part of the contract.
 * Serializable entities and Java equality objects deliberately remain on
 * their existing compatibility boundary.
 */
export abstract class RuntimeObject {
    public static get class(): RuntimeClassToken<RuntimeObject> {
        return RuntimeClassToken.fromConstructor(
            this as unknown as RuntimeConstructor<RuntimeObject>,
        );
    }

    public getClass<T extends RuntimeObject>(): RuntimeClassToken<T> {
        return RuntimeClassToken.fromConstructor(
            this.constructor as RuntimeConstructor<T>,
        );
    }

    public equals(other: unknown): boolean {
        return other === this;
    }

    /**
     * Java's string concatenation and String(value) call toString on an
     * object.  Translated OpenNARS toString methods still return jree's boxed
     * TextString, so keep this coercion at the project-owned runtime boundary
     * while the domain classes are migrated away from JavaObject.
     */
    public [Symbol.toPrimitive](): string {
        const toString = (this as unknown as { toString?: unknown }).toString;
        if (typeof toString === "function") {
            const rendered = toString.call(this);
            return typeof rendered === "string" ? rendered : String(rendered);
        }
        return Object.prototype.toString.call(this);
    }
}
