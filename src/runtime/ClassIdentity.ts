/** Native constructor identity used for events, plugins, and exact type checks. */
export type ConstructorShape<T = unknown> = {
    name: string;
    prototype: T;
};

/** Read the concrete constructor without allocating a reflection token. */
export const getClass = <T extends object>(value: T): ConstructorShape<T> =>
    value.constructor as ConstructorShape<T>;

/** Display name for a constructor used in diagnostics and output channels. */
export const className = (value: ConstructorShape<unknown>): string => value.name;

/** Compatibility type alias during the event API migration. */
export type ClassKey<T = unknown> = ConstructorShape<T>;

/**
 * Minimal project-owned base for entities that participate in class identity
 * and object coercion. Serializable entities and value-equality objects keep
 * their own domain contracts.
 */
export abstract class ReasonerObject {
    public static get class(): ConstructorShape<ReasonerObject> {
        return this as unknown as ConstructorShape<ReasonerObject>;
    }

    public getClass<T extends ReasonerObject>(): ConstructorShape<T> {
        return getClass(this) as unknown as ConstructorShape<T>;
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
