import type { RuntimeCapabilities, TextWriter } from "../RuntimeCapabilities.ts";

/** Browser-native host capabilities. No Java namespace is exposed here. */
export function createBrowserRuntimeCapabilities(): RuntimeCapabilities {
    const output: TextWriter = {
        println(value: unknown): void { console.log(String(value)); },
        flush(): void {},
        close(): void {},
    };
    return {
        currentTimeMillis: () => BigInt(Date.now()),
        openTextWriter: () => output,
    };
}

export class BrowserCapabilityUnavailableError extends Error {
    public constructor(public readonly capability: string) {
        super(`${capability} is unavailable in the browser host`);
        this.name = "BrowserCapabilityUnavailableError";
    }
}
