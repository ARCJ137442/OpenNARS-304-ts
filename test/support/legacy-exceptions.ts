/**
 * Project-owned Java throwable contracts.
 *
 * Java original type: java.lang.Throwable -> native Error hierarchy.
 * This module deliberately has no npm jree runtime import.  It is the first
 * step toward moving exception identity and message observation out of the
 * compatibility bridge without changing translated caller behavior.
 */
export class JavaThrowable extends Error {
    private static readonly UNINITIALIZED_CAUSE = Symbol("uninitialized Java cause");
    private detailMessage: string | null;
    private causeValue: unknown | null | typeof JavaThrowable.UNINITIALIZED_CAUSE;
    private readonly suppressedValues: JavaThrowable[] = [];

    public constructor();
    public constructor(message: unknown);
    public constructor(message: unknown, cause: unknown | null);
    public constructor(message?: unknown, cause?: unknown | null) {
        const normalizedMessage = message === null || message === undefined
            ? null
            : String(message);
        super(normalizedMessage ?? undefined);
        this.name = new.target.name;
        this.detailMessage = normalizedMessage;
        const hasExplicitCause = arguments.length >= 2;
        this.causeValue = hasExplicitCause ? (cause ?? null) : JavaThrowable.UNINITIALIZED_CAUSE;
        Object.setPrototypeOf(this, new.target.prototype);
        if (hasExplicitCause && cause !== null && cause !== undefined) {
            Object.defineProperty(this, "cause", {
                configurable: true,
                enumerable: false,
                value: cause,
                writable: true,
            });
        }
    }

    public getMessage(): string | null {
        return this.detailMessage;
    }

    public getLocalizedMessage(): string | null {
        return this.detailMessage;
    }

    public getCause(): unknown | null {
        return this.causeValue === JavaThrowable.UNINITIALIZED_CAUSE
            ? null
            : this.causeValue;
    }

    public initCause(cause: unknown | null): this {
        if (cause === this) {
            throw new JavaIllegalArgumentException("Throwable cannot cause itself");
        }
        if (this.causeValue !== JavaThrowable.UNINITIALIZED_CAUSE) {
            throw new JavaIllegalStateException("Cause already initialized");
        }
        this.causeValue = cause;
        if (cause !== null) {
            Object.defineProperty(this, "cause", {
                configurable: true,
                enumerable: false,
                value: cause,
                writable: true,
            });
        }
        return this;
    }

    public addSuppressed(exception: JavaThrowable): void {
        if (exception === null || exception === undefined) {
            throw new JavaNullPointerException("Suppressed exception cannot be null");
        }
        if (exception === this) {
            throw new JavaIllegalArgumentException();
        }
        this.suppressedValues.push(exception);
    }

    public getSuppressed(): readonly JavaThrowable[] {
        return this.suppressedValues.slice();
    }

    public setMessage(message: unknown): this {
        this.detailMessage = message === null || message === undefined
            ? null
            : String(message);
        this.message = this.detailMessage ?? "";
        return this;
    }

    public printStackTrace(stream?: { println(value: unknown): void }): void {
        const lines = `${this.name}: ${this.detailMessage ?? ""}\n${this.stack ?? ""}`;
        if (stream !== undefined) {
            stream.println(lines);
            return;
        }
        console.error(lines);
    }

    public getStackTrace(): readonly unknown[] {
        return [];
    }
}

/** Java original type: java.lang.Error. */
export class JavaError extends JavaThrowable {}

/** Java original type: java.lang.Exception. */
export class JavaException extends JavaThrowable {}

/** Java original type: java.lang.RuntimeException. */
export class JavaRuntimeException extends JavaException {}

/** Compatibility observation for old translated invariant tests. */
export class JavaAssertionError extends JavaError {
    public static [Symbol.hasInstance](value: unknown): boolean {
        const name = typeof value === "object" && value !== null
            ? (value as { constructor?: { name?: unknown } }).constructor?.name
            : undefined;
        return (typeof value === "object" && value !== null && JavaAssertionError.prototype.isPrototypeOf(value))
            || name === "ReasonerInvariantError";
    }
}

/** Java original type: java.lang.IllegalArgumentException. */
export class JavaIllegalArgumentException extends JavaRuntimeException {
    public static [Symbol.hasInstance](value: unknown): boolean {
        // Native reasoner errors are accepted by old translated catch/tests.
        const constructorName = typeof value === "object" && value !== null
            ? (value as { constructor?: { name?: unknown } }).constructor?.name
            : undefined;
        return (typeof value === "object" && value !== null
            && JavaIllegalArgumentException.prototype.isPrototypeOf(value))
            || constructorName === "ReasonerInputError";
    }
}

/** Java original type: java.lang.NumberFormatException. */
export class JavaNumberFormatException extends JavaIllegalArgumentException {}

/** Java original type: java.lang.IllegalStateException. */
export class JavaIllegalStateException extends JavaRuntimeException {
    public static [Symbol.hasInstance](value: unknown): boolean {
        const constructorName = typeof value === "object" && value !== null
            ? (value as { constructor?: { name?: unknown } }).constructor?.name
            : undefined;
        return (typeof value === "object" && value !== null
            && JavaIllegalStateException.prototype.isPrototypeOf(value))
            || constructorName === "ReasonerStateError";
    }
}

/** Compatibility observation for old translated null-contract tests. */
export class JavaNullPointerException extends JavaRuntimeException {
    public static [Symbol.hasInstance](value: unknown): boolean {
        const name = typeof value === "object" && value !== null
            ? (value as { constructor?: { name?: unknown } }).constructor?.name
            : undefined;
        return (typeof value === "object" && value !== null && JavaNullPointerException.prototype.isPrototypeOf(value))
            || name === "ReasonerInputError" || name === "ReasonerStateError";
    }
}
/** Java original type: java.util.NoSuchElementException. */
export class JavaNoSuchElementException extends JavaRuntimeException {}
/** Compatibility observation for old translated iterator-contract tests. */
export class JavaUnsupportedOperationException extends JavaRuntimeException {
    public static [Symbol.hasInstance](value: unknown): boolean {
        const name = typeof value === "object" && value !== null
            ? (value as { constructor?: { name?: unknown } }).constructor?.name
            : undefined;
        return (typeof value === "object" && value !== null && JavaUnsupportedOperationException.prototype.isPrototypeOf(value))
            || name === "ReasonerOperationError";
    }
}

/** Java original type: java.lang.IllegalAccessError. */
export class JavaIllegalAccessError extends JavaError {}

/** Java original types: checked exceptions omitted by jree. */
export class JavaInstantiationException extends JavaException {}
export class JavaNoSuchMethodException extends JavaException {}
export class JavaIllegalAccessException extends JavaException {}
export class JavaClassNotFoundException extends JavaException {}
export class JavaInvocationTargetException extends JavaException {}
export class JavaParserConfigurationException extends JavaException {}
export class JavaSAXException extends JavaException {}
export class JavaParseException extends JavaException {}

export const isJavaThrowable = (value: unknown): value is JavaThrowable => value instanceof JavaThrowable;
export const isJavaException = (value: unknown): value is JavaException => value instanceof JavaException;
