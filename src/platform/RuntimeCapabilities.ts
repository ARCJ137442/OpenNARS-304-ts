/**
 * Optional host services consumed by platform-sensitive operators.
 *
 * The core only knows the capability contract. A host decides whether and
 * how to provide the service; browser hosts may deliberately omit it.
 */
export type CurrentTimeMillis = () => bigint;

export interface RuntimeCapabilities {
    readonly executeSystemCommand?: (command: string) => string;
    readonly currentTimeMillis?: CurrentTimeMillis;
}

export const defaultCurrentTimeMillis: CurrentTimeMillis = () => BigInt(Date.now());

export class MissingRuntimeCapabilityError extends Error {
    public readonly code = "MISSING_RUNTIME_CAPABILITY";

    public constructor(public readonly capability: string) {
        super(`Runtime capability is unavailable: ${capability}`);
        this.name = "MissingRuntimeCapabilityError";
    }
}
