/**
 * Platform-neutral errors exposed by the reasoner and its orchestration
 * layer.  They describe the meaning of a failure rather than the language or
 * runtime that happened to produce it.
 */
export class ReasonerError extends Error {
    public constructor(message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public getMessage(): string {
        return this.message;
    }

    public getCause(): unknown {
        return this.cause;
    }
}

/** The caller supplied an invalid command, configuration, or Narsese value. */
export class ReasonerInputError extends ReasonerError {}

/** The requested operation conflicts with the current reasoner lifecycle. */
export class ReasonerStateError extends ReasonerError {}

/** A violated NARS invariant that should not be presented as invalid input. */
export class ReasonerInvariantError extends ReasonerError {}

/** An operation is valid for other values but unsupported for this value. */
export class ReasonerOperationError extends ReasonerError {}

/** A host capability required by an optional operation was not supplied. */
export class HostCapabilityError extends ReasonerError {
    public readonly code = "MISSING_RUNTIME_CAPABILITY";
    public constructor(public readonly capability: string) {
        super(`Runtime capability is unavailable: ${capability}`);
    }
}

/** A host-side read, write, process, or transport operation failed. */
export class ReasonerIoError extends ReasonerError {}
