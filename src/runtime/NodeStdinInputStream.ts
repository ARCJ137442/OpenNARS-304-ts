import { java } from "jree";

export type NodeReadableInput = {
    on(event: "data" | "end", listener: (...args: unknown[]) => void): NodeReadableInput;
    resume(): NodeReadableInput;
};

/** Bridges Node's evented stdin to the blocking-shaped Java InputStream API. */
export class NodeStdinInputStream extends java.io.InputStream {
    private readonly chunks: Uint8Array[] = [];
    private chunkIndex = 0;
    private availableBytes = 0;
    private closed = false;

    public constructor(input: NodeReadableInput = process.stdin as unknown as NodeReadableInput) {
        super();
        input.on("data", (chunk: unknown) => {
            if (this.closed) return;
            const bytes = typeof chunk === "string"
                ? new TextEncoder().encode(chunk)
                : chunk instanceof Uint8Array
                    ? new Uint8Array(chunk)
                    : new TextEncoder().encode(String(chunk));
            if (bytes.length === 0) return;
            this.chunks.push(bytes);
            this.availableBytes += bytes.length;
        });
        input.on("end", () => {
            // InputStream.read() already reports -1 once all queued bytes are consumed.
        });
        input.resume();
    }

    public override available(): number {
        return this.availableBytes;
    }

    public override read(): number;
    public override read(buffer: Int8Array): number;
    public override read(buffer: Int8Array, offset: number, length: number): number;
    public override read(...args: unknown[]): number {
        if (args.length === 0) {
            return this.readByte();
        }

        const buffer = args[0] as Int8Array;
        const offset = args.length === 1 ? 0 : args[1] as number;
        const length = args.length === 1 ? buffer.length : args[2] as number;
        let count = 0;
        while (count < length) {
            const value = this.readByte();
            if (value === -1) return count === 0 ? -1 : count;
            buffer[offset + count] = value;
            count += 1;
        }
        return count;
    }

    private readByte(): number {
        if (this.closed || this.availableBytes === 0) return -1;

        while (this.chunkIndex < this.chunks.length && this.chunks[this.chunkIndex].length === 0) {
            this.chunkIndex += 1;
        }
        if (this.chunkIndex >= this.chunks.length) {
            this.availableBytes = 0;
            return -1;
        }

        const chunk = this.chunks[this.chunkIndex];
        const value = chunk[0];
        this.chunks[this.chunkIndex] = chunk.subarray(1);
        this.availableBytes -= 1;
        return value;
    }

    public override close(): void {
        this.closed = true;
        this.chunks.length = 0;
        this.chunkIndex = 0;
        this.availableBytes = 0;
    }
}
