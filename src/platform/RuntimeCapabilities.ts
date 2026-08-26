/**
 * Optional host services consumed by platform-sensitive operators.
 *
 * The core only knows the capability contract. A host decides whether and
 * how to provide the service; browser hosts may deliberately omit it.
 */
export interface RuntimeCapabilities {
    readonly executeSystemCommand?: (command: string) => string;
}

export class MissingRuntimeCapabilityError extends Error {
    public readonly code = "MISSING_RUNTIME_CAPABILITY";

    public constructor(public readonly capability: string) {
        super(`Runtime capability is unavailable: ${capability}`);
        this.name = "MissingRuntimeCapabilityError";
    }
}
