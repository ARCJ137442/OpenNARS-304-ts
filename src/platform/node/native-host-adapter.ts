import { appendFileSync, closeSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { deserialize, serialize } from "node:v8";
import { NativeJavaString, createNativeJavaFacade, type NativeJavaNamespace, Class, JavaObject } from "../../runtime/native-java-runtime.ts";
import { JavaException, JavaThrowable } from "../../runtime/JavaExceptions.ts";
import { JavaRandom } from "../../runtime/JavaRandom.ts";

export { Class, JavaObject, NativeJavaString } from "../../runtime/native-java-runtime.ts";
export type JavaStringInput = NativeJavaString | string;
export const toJavaString = (value: JavaStringInput): NativeJavaString =>
    value instanceof NativeJavaString ? value : new NativeJavaString(value);
export const isJavaThrowable = (value: unknown): value is JavaThrowable => value instanceof JavaThrowable;
export const isJavaException = (value: unknown): value is JavaException => value instanceof JavaException;

type Writable = { write?(value: string): unknown; end?(): unknown };

class NodePrintWriter {
    public constructor(private readonly target: Writable = process.stdout, private readonly autoFlush = false) {}
    public print(value: unknown): void { this.target.write?.(String(value)); }
    public println(value = ""): void { this.target.write?.(`${String(value)}\n`); if (this.autoFlush) this.flush(); }
    public write(value: unknown): void { this.print(value); }
    public flush(): void {}
    public close(): void {}
}

class NodePrintStream extends NodePrintWriter {}

class NodeStringWriter {
    private value = "";
    public write(value: unknown): void { this.value += String(value); }
    public println(value = ""): void { this.write(`${String(value)}\n`); }
    public flush(): void {}
    public close(): void {}
    public toString(): NativeJavaString { return new NativeJavaString(this.value); }
}

class NodeFileWriter extends NodePrintWriter {
    public constructor(path: unknown) {
        const file = String(path);
        writeFileSync(file, "", "utf8");
        super({ write: (value: string) => appendFileSync(file, value, "utf8") });
    }
}

class NodeFileOutputStream {
    public readonly fd: number;
    public constructor(path: unknown) { this.fd = openSync(String(path), "w"); }
    public write(value: Uint8Array | number): void {
        if (typeof value === "number") writeFileSync(this.fd, Buffer.from([value]));
        else writeFileSync(this.fd, Buffer.from(value));
    }
    public close(): void { closeSync(this.fd); }
}

class NodeFileInputStream {
    public readonly bytes: Buffer;
    public constructor(path: unknown) { this.bytes = readFileSync(String(path)); }
    public close(): void {}
}

class NodeByteArrayOutputStream {
    private chunks: Buffer[] = [];
    public write(value: Uint8Array | number): void { this.chunks.push(typeof value === "number" ? Buffer.from([value]) : Buffer.from(value)); }
    public toByteArray(): Int8Array { return new Int8Array(Buffer.concat(this.chunks)); }
    public close(): void {}
}

class NodeObjectOutputStream {
    public constructor(private readonly target: NodeFileOutputStream | NodeByteArrayOutputStream) {}
    public writeObject(value: unknown): void { this.target.write(serialize(value)); }
    public close(): void { this.target.close(); }
}

class NodeObjectInputStream {
    public constructor(private readonly source: NodeFileInputStream | { bytes: Buffer }) {}
    public readObject(): unknown { return deserialize(this.source.bytes); }
    public close(): void { if ("close" in this.source) this.source.close(); }
}

class NodeInputStreamReader { public constructor(public readonly stream: { read(): number }) {} }

class NodeBufferedReader {
    private line = "";
    public constructor(private readonly reader: NodeInputStreamReader) {}
    public readLine(): NativeJavaString | null {
        while (true) {
            const byte = this.reader.stream.read();
            if (byte < 0) return this.line.length === 0 ? null : new NativeJavaString(this.line.replace(/\r$/, ""));
            if (byte === 10) { const line = this.line.replace(/\r$/, ""); this.line = ""; return new NativeJavaString(line); }
            this.line += String.fromCharCode(byte);
        }
    }
}

class NodeDatagramPacket {
    public constructor(public bytes: Int8Array, public length = bytes.length, public readonly address?: unknown, public readonly port?: number) {}
    public getLength(): number { return this.length; }
}

class NodeDatagramSocket {
    public constructor(public readonly port?: number, public readonly address?: unknown) {}
    public send(_packet: NodeDatagramPacket): void { throw new Error("Datagram send requires an explicit Node network capability"); }
    public receive(_packet: NodeDatagramPacket): void { throw new Error("Datagram receive requires an explicit Node network capability"); }
}

const facade = createNativeJavaFacade();
const javaIo = {
    IOException: class NodeIOException extends JavaException {},
    PrintWriter: NodePrintWriter,
    PrintStream: NodePrintStream,
    StringWriter: NodeStringWriter,
    StringBuilder: facade.lang.StringBuilder,
    FileWriter: NodeFileWriter,
    FileOutputStream: NodeFileOutputStream,
    FileInputStream: NodeFileInputStream,
    ByteArrayOutputStream: NodeByteArrayOutputStream,
    ObjectOutputStream: NodeObjectOutputStream,
    ObjectInputStream: NodeObjectInputStream,
    InputStreamReader: NodeInputStreamReader,
    BufferedReader: NodeBufferedReader,
};
const javaNet = {
    InetAddress: { getByName: (host: unknown): string => String(host) },
    DatagramSocket: NodeDatagramSocket,
    DatagramPacket: NodeDatagramPacket,
};

export const java: NativeJavaNamespace = {
    ...facade,
    io: javaIo,
    net: javaNet,
    nio: { charset: { StandardCharsets: { UTF_8: new NativeJavaString("UTF-8") }, Charset: { defaultCharset: () => new NativeJavaString("UTF-8") } } },
} as unknown as NativeJavaNamespace;

export { JavaRandom };
