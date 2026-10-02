/** Native resource cleanup errors with an explicit suppressed-error chain. */
export class ResourceError extends Error {
    private readonly suppressed: Error[] = [];

    public constructor(message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = "ResourceError";
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public addSuppressed(error: Error): void { this.suppressed.push(error); }
    public getSuppressed(): readonly Error[] { return this.suppressed.slice(); }
    public getMessage(): string { return this.message; }
}

type AutoCloseable = { close(): void };

function toResourceError(error: unknown): ResourceError {
    if (error instanceof ResourceError) return error;
    if (error instanceof Error) return new ResourceError(error.message, { cause: error.cause });
    return new ResourceError(String(error));
}

export function closeResources(resources: AutoCloseable[]): ResourceError | undefined {
    let error: ResourceError | undefined;
    for (const resource of [...resources].reverse()) {
        try {
            resource.close();
        } catch (cause) {
            const cleanupError = toResourceError(cause);
            if (error === undefined) error = cleanupError;
            else error.addSuppressed(cleanupError);
        }
    }
    return error;
}

export function handleResourceError(cause: unknown, closeError?: ResourceError): ResourceError {
    const error = toResourceError(cause);
    if (closeError !== undefined) error.addSuppressed(closeError);
    return error;
}

export function throwResourceError(error?: ResourceError): void {
    if (error !== undefined) throw error;
}
