import { execFileSync } from "node:child_process";
import { createWriteStream, readFileSync, writeFileSync } from "node:fs";
import { deserialize, serialize } from "node:v8";

import { defaultCurrentTimeMillis, type RuntimeCapabilities } from "../RuntimeCapabilities.ts";
import { UdpMessageTransport } from "./UdpMessageTransport.ts";

/** Provide the Java-compatible ^system command capability to a Node host. */
export function createNodeRuntimeCapabilities(): RuntimeCapabilities {
    return {
        currentTimeMillis: defaultCurrentTimeMillis,
        executeSystemCommand(command: string): string {
            return execFileSync("bash", ["-c", command], {
                encoding: "utf8",
                // Java's System operator consumes stdout and does not mirror
                // the child process' stderr into the NARS shell.
                stdio: ["ignore", "pipe", "pipe"],
            });
        },
        saveSnapshot(name: string, value: unknown): void {
            writeFileSync(name, serialize(value));
        },
        loadSnapshot(name: string): unknown {
            return deserialize(readFileSync(name));
        },
        openTextWriter(path: string) {
            const stream = createWriteStream(path, { encoding: "utf8" });
            return {
                println(value: unknown): void { stream.write(`${String(value)}\n`); },
                flush(): void { /* Node streams flush as data is accepted. */ },
                close(): void { stream.end(); },
            };
        },
        messageTransport: new UdpMessageTransport(),
    };
}
