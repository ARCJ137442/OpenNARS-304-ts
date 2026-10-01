import { createNativeJavaFacade, NativeJavaString, Class, JavaObject, type NativeJavaNamespace } from "./native-java-runtime.ts";
import { JavaException, JavaThrowable } from "./legacy-exceptions.ts";

const unavailable = (name: string): never => {
    throw new Error(`${name} is unavailable in the browser host`);
};

const browserOutput = {
    println(value: unknown): void { console.log(String(value)); },
    print(value: unknown): void { console.log(String(value)); },
};
const facade = createNativeJavaFacade();

/** Legacy namespace kept solely for translated demo compatibility. */
export const java: NativeJavaNamespace = {
    ...facade,
    lang: {
        ...facade.lang,
        System: {
            ...facade.lang.System as Record<string, unknown>,
            out: browserOutput,
            err: browserOutput,
            currentTimeMillis: () => BigInt(Date.now()),
        },
    },
    io: {
        IOException: class BrowserIOException extends JavaException {},
        PrintWriter: class BrowserPrintWriter {
            public println(value: unknown): void { console.log(String(value)); }
            public flush(): void {}
            public close(): void {}
        },
        PrintStream: class BrowserPrintStream {},
        StringWriter: class BrowserStringWriter {},
        StringBuilder: facade.lang.StringBuilder,
        FileWriter: class BrowserFileWriter { public constructor(_path: unknown) { unavailable("FileWriter"); } },
        FileOutputStream: class BrowserFileOutputStream { public constructor(_path: unknown) { unavailable("FileOutputStream"); } },
        FileInputStream: class BrowserFileInputStream { public constructor(_path: unknown) { unavailable("FileInputStream"); } },
        ObjectOutputStream: class BrowserObjectOutputStream { public constructor(_stream: unknown) { unavailable("ObjectOutputStream"); } },
        ObjectInputStream: class BrowserObjectInputStream { public constructor(_stream: unknown) { unavailable("ObjectInputStream"); } },
    },
    net: {
        InetAddress: { getByName: () => unavailable("InetAddress") },
        DatagramSocket: class {},
        DatagramPacket: class {},
    },
    nio: {
        charset: {
            StandardCharsets: { UTF_8: new NativeJavaString("UTF-8") },
            Charset: { defaultCharset: () => new NativeJavaString("UTF-8") },
        },
    },
} as unknown as NativeJavaNamespace;

export { Class, JavaObject };
export type JavaStringInput = NativeJavaString | string;
export const toJavaString = (value: JavaStringInput): NativeJavaString =>
    value instanceof NativeJavaString ? value : new NativeJavaString(value);
export const isJavaThrowable = (value: unknown): value is JavaThrowable => value instanceof JavaThrowable;
export const isJavaException = (value: unknown): value is JavaException => value instanceof JavaException;
