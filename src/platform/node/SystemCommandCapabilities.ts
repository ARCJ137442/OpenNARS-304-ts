import { execFileSync } from "node:child_process";

import type { RuntimeCapabilities } from "../RuntimeCapabilities.ts";

/** Provide the Java-compatible ^system command capability to a Node host. */
export function createNodeRuntimeCapabilities(): RuntimeCapabilities {
    return {
        executeSystemCommand(command: string): string {
            return execFileSync("bash", ["-c", command], {
                encoding: "utf8",
                // Java's System operator consumes stdout and does not mirror
                // the child process' stderr into the NARS shell.
                stdio: ["ignore", "pipe", "pipe"],
            });
        },
    };
}
