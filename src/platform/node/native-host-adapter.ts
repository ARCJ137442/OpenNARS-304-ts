import { appendFileSync, closeSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { deserialize, serialize } from "node:v8";
import type { TextWriter } from "../RuntimeCapabilities.ts";

/**
 * Native Node host services. This module deliberately exposes capabilities,
 * not a Java namespace. Compatibility shims live in `legacy-namespace.ts`.
 */
export class NodeTextWriter implements TextWriter {
    public constructor(
        private readonly target: { write(value: string): unknown; end?(): unknown } = process.stdout,
        private readonly autoFlush = false,
    ) {}
    public print(value: unknown): void { this.target.write(String(value)); }
    public write(value: unknown): void { this.print(value); }
    public println(value = ""): void {
        this.target.write(`${String(value)}\n`);
        if (this.autoFlush) this.flush();
    }
    public flush(): void {}
    public close(): void { this.target.end?.(); }
}

export class NodeStringWriter implements TextWriter {
    private value = "";
    public print(value: unknown): void { this.value += String(value); }
    public println(value = ""): void { this.print(`${String(value)}\n`); }
    public toString(): string { return this.value; }
    public flush(): void {}
    public close(): void {}
}

export function createNodeFileWriter(path: string): TextWriter {
    writeFileSync(path, "", "utf8");
    return new NodeTextWriter({ write(value: string): void { appendFileSync(path, value, "utf8"); } });
}

export function writeNodeBytes(path: string, bytes: Uint8Array): void { writeFileSync(path, bytes); }
export function readNodeBytes(path: string): Buffer { return readFileSync(path); }

export function createNodeByteWriter(): { write(value: Uint8Array | number): void; toBytes(): Uint8Array } {
    const chunks: Buffer[] = [];
    return {
        write(value): void { chunks.push(typeof value === "number" ? Buffer.from([value]) : Buffer.from(value)); },
        toBytes(): Uint8Array { return new Uint8Array(Buffer.concat(chunks)); },
    };
}

export function encodeNodeValue(value: unknown): Uint8Array { return serialize(value); }
export function decodeNodeValue(bytes: Uint8Array): unknown { return deserialize(Buffer.from(bytes)); }
export function openNodeFileDescriptor(path: string): number { return openSync(path, "w"); }
export function writeNodeFileDescriptor(fd: number, value: Uint8Array | number): void {
    writeFileSync(fd, typeof value === "number" ? Buffer.from([value]) : Buffer.from(value));
}
export function closeNodeFileDescriptor(fd: number): void { closeSync(fd); }
