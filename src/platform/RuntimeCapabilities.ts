/**
 * Optional host services consumed by platform-sensitive operators.
 *
 * The core only knows the capability contract. A host decides whether and
 * how to provide the service; browser hosts may deliberately omit it.
 */
export type CurrentTimeMillis = () => bigint;

export type TextWriter = {
    println(value: unknown): void;
    flush?(): void;
    close?(): void;
};

export interface MessageTransportCapability {
    listen(port: number, onMessage: (message: unknown) => void): void;
    send(address: string, port: number, message: unknown): void;
}

export interface RuntimeCapabilities {
    readonly readTextFile?: (path: string) => string;
    readonly executeSystemCommand?: (command: string) => string;
    readonly currentTimeMillis?: CurrentTimeMillis;
    readonly saveSnapshot?: (name: string, value: unknown) => void;
    readonly loadSnapshot?: (name: string) => unknown;
    readonly openTextWriter?: (path: string) => TextWriter;
    readonly messageTransport?: MessageTransportCapability;
}

export const defaultCurrentTimeMillis: CurrentTimeMillis = () => BigInt(Date.now());

export class MissingRuntimeCapabilityError extends Error {
    public readonly code = "MISSING_RUNTIME_CAPABILITY";

    public constructor(public readonly capability: string) {
        super(`Runtime capability is unavailable: ${capability}`);
        this.name = "MissingRuntimeCapabilityError";
    }
}
