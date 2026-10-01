/**
 * 项目自有的运行时类身份边界。
 *
 * Project class identity consists of stable constructor tokens, display names,
 * exact identity, and instance checks. Hashing, synchronization, and
 * serialization are deliberately outside this boundary.
 */
export interface ClassTokenLike {
    getName(): string;
    getSimpleName(): string;
    equals(other: unknown): boolean;
}

export type ConstructorShape<T> = (new (...args: never[]) => T) & {
    name: string;
    prototype: T;
};

/** Stable identity token for one TypeScript constructor. */
export class ClassToken<T> implements ClassTokenLike {
    private static readonly tokens = new WeakMap<Function, ClassToken<unknown>>();

    private constructor(private readonly owner: ConstructorShape<T>) {}

    public static fromConstructor<T>(owner: ConstructorShape<T>): ClassToken<T> {
        const existing = ClassToken.tokens.get(owner);
        if (existing !== undefined) {
            return existing as ClassToken<T>;
        }

        const token = new ClassToken(owner);
        ClassToken.tokens.set(owner, token as ClassToken<unknown>);
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
 * Minimal project-owned base for entities that participate in class identity
 * and object coercion. Serializable entities and value-equality objects keep
 * their own domain contracts.
 */
export abstract class ReasonerObject {
    public static get class(): ClassToken<ReasonerObject> {
        return ClassToken.fromConstructor(
            this as unknown as ConstructorShape<ReasonerObject>,
        );
    }

    public getClass<T extends ReasonerObject>(): ClassToken<T> {
        return ClassToken.fromConstructor(
            this.constructor as ConstructorShape<T>,
        );
    }

    public equals(other: unknown): boolean {
        return other === this;
    }

    /**
     * Keep object-to-text coercion at the project boundary while domain classes
     * expose their own string representations.
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
