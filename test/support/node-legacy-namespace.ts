import {
    createNodeByteWriter,
    decodeNodeValue,
    encodeNodeValue,
    readNodeBytes,
    createNodeFileWriter,
    openNodeFileDescriptor,
    writeNodeFileDescriptor,
    closeNodeFileDescriptor,
    NodeStringWriter,
    NodeTextWriter,
} from "../../src/platform/node/native-host-adapter.ts";
import { NativeJavaString, createNativeJavaFacade, type NativeJavaNamespace, Class, JavaObject } from "../../src/runtime/native-java-runtime.ts";
import { JavaException } from "../../src/runtime/JavaExceptions.ts";

class NodeFileOutputStream {
    private readonly fd: number;
    public constructor(path: unknown) { this.fd = openNodeFileDescriptor(String(path)); }
    public write(value: Uint8Array | number): void { writeNodeFileDescriptor(this.fd, value); }
    public close(): void { closeNodeFileDescriptor(this.fd); }
}

class NodeFileInputStream {
    public readonly bytes: Buffer;
    public constructor(path: unknown) { this.bytes = readNodeBytes(String(path)); }
    public close(): void {}
}

class NodeByteArrayOutputStream {
    private readonly writer = createNodeByteWriter();
    public write(value: Uint8Array | number): void { this.writer.write(value); }
    public toByteArray(): Int8Array { return new Int8Array(this.writer.toBytes()); }
    public close(): void {}
}

class NodeObjectOutputStream {
    public constructor(private readonly target: NodeFileOutputStream | NodeByteArrayOutputStream) {}
    public writeObject(value: unknown): void { this.target.write(encodeNodeValue(value)); }
    public close(): void { this.target.close(); }
}

class NodeObjectInputStream {
    public constructor(private readonly source: NodeFileInputStream | { bytes: Buffer }) {}
    public readObject(): unknown { return decodeNodeValue(this.source.bytes); }
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
            if (byte === 10) {
                const line = this.line.replace(/\r$/, "");
                this.line = "";
                return new NativeJavaString(line);
            }
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

/** Build the translated namespace for legacy tests and migration tools only. */
export function createNodeLegacyNamespace(): NativeJavaNamespace {
    const facade = createNativeJavaFacade();
    const javaIo = {
        IOException: class NodeIOException extends JavaException {},
        PrintWriter: NodeTextWriter,
        PrintStream: NodeTextWriter,
        StringWriter: NodeStringWriter,
        StringBuilder: facade.lang.StringBuilder,
        FileWriter: class {
            private readonly writer: ReturnType<typeof createNodeFileWriter>;
            public constructor(path: unknown) { this.writer = createNodeFileWriter(String(path)); }
            public print(value: unknown): void { (this.writer as NodeTextWriter).print(value); }
            public write(value: unknown): void { this.print(value); }
            public println(value = ""): void { this.writer.println(value); }
            public flush(): void { this.writer.flush?.(); }
            public close(): void { this.writer.close?.(); }
        },
        FileOutputStream: NodeFileOutputStream,
        FileInputStream: NodeFileInputStream,
        ByteArrayOutputStream: NodeByteArrayOutputStream,
        ObjectOutputStream: NodeObjectOutputStream,
        ObjectInputStream: NodeObjectInputStream,
        InputStreamReader: NodeInputStreamReader,
        BufferedReader: NodeBufferedReader,
    };
    return {
        ...facade,
        io: javaIo,
        net: {
            InetAddress: { getByName: (host: unknown): string => String(host) },
            DatagramSocket: NodeDatagramSocket,
            DatagramPacket: NodeDatagramPacket,
        },
        nio: {
            charset: {
                StandardCharsets: { UTF_8: new NativeJavaString("UTF-8") },
                Charset: { defaultCharset: () => new NativeJavaString("UTF-8") },
            },
        },
    } as unknown as NativeJavaNamespace;
}

export { Class, JavaObject, NativeJavaString } from "../../src/runtime/native-java-runtime.ts";
