import { readFileSync } from "node:fs";
import type { ShellHost, ShellOutput } from "../../main/Shell.ts";
import { createNodeRuntimeCapabilities } from "./SystemCommandCapabilities.ts";

/** Assemble the platform-neutral Shell with Node's file, output, and exit APIs. */
export function createNodeShellHost(output: ShellOutput = {
    println(value: unknown): void {
        process.stdout.write(`${String(value)}\n`);
    },
}): ShellHost {
    const capabilities = createNodeRuntimeCapabilities();
    return {
        capabilities,
        output,
        readTextFile(path: string): string {
            return readFileSync(path, "utf8");
        },
    };
}
