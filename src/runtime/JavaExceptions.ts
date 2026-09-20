/**
 * Project-owned Java throwable contracts.
 *
 * Java original type: java.lang.Throwable -> native Error hierarchy.
 * This module deliberately has no npm jree runtime import.  It is the first
 * step toward moving exception identity and message observation out of the
 * compatibility bridge without changing translated caller behavior.
 */
export class JavaThrowable extends Error {
    private detailMessage: string | null;
    private causeValue: unknown | null;

    public constructor(message?: unknown, cause: unknown | null = null) {
        const normalizedMessage = message === null || message === undefined
            ? null
            : String(message);
        super(normalizedMessage ?? undefined);
        this.name = new.target.name;
        this.detailMessage = normalizedMessage;
        this.causeValue = cause;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public getMessage(): string | null {
        return this.detailMessage;
    }

    public getLocalizedMessage(): string | null {
        return this.detailMessage;
    }

    public getCause(): unknown | null {
        return this.causeValue;
    }

    public initCause(cause: unknown | null): this {
        this.causeValue = cause;
        return this;
    }

    public setMessage(message: unknown): this {
        this.detailMessage = message === null || message === undefined
            ? null
            : String(message);
        this.message = this.detailMessage ?? "";
        return this;
    }
}

/** Java original type: java.lang.Error. */
export class JavaError extends JavaThrowable {}

/** Java original type: java.lang.Exception. */
export class JavaException extends JavaThrowable {}

/** Java original type: java.lang.RuntimeException. */
export class JavaRuntimeException extends JavaException {}

/** Java original type: java.lang.AssertionError. */
export class JavaAssertionError extends JavaError {}
