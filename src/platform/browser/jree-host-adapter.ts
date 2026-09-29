import { NativeList } from "../../runtime/NativeList.ts";
import { NativeMap } from "../../runtime/NativeMap.ts";
import { NativeSet } from "../../runtime/NativeSet.ts";
import { javaStringHashCode, NativeJavaString } from "../../runtime/java-text.ts";
import {
    JavaError,
    JavaException,
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaNumberFormatException,
    JavaRuntimeException,
    JavaThrowable,
} from "../../runtime/JavaExceptions.ts";
import { JavaRandom } from "../../runtime/JavaRandom.ts";
import { RuntimeClassToken } from "../../runtime/RuntimeClass.ts";

type Constructor<T> = new (...args: any[]) => T;

class BrowserNumber extends Number {
    public constructor(value: number | string | NativeJavaString = 0) { super(Number(String(value))); }
    public doubleValue(): number { return Number(this.valueOf()); }
    public floatValue(): number { return Math.fround(this.doubleValue()); }
    public intValue(): number { return Math.trunc(this.doubleValue()); }
    public longValue(): bigint { return BigInt(this.intValue()); }
}

class BrowserInteger extends BrowserNumber {
    public static valueOf(value: number | string | NativeJavaString): BrowserInteger { return new BrowserInteger(value); }
    public static parseInt(value: string | NativeJavaString, radix = 10): number { return Number.parseInt(String(value), radix); }
}

class BrowserLong extends BrowserNumber {
    public static valueOf(value: number | string | bigint | NativeJavaString): BrowserLong { return new BrowserLong(Number(value)); }
    public static parseLong(value: string | NativeJavaString, radix = 10): bigint { return BigInt(Number.parseInt(String(value), radix)); }
}

class BrowserFloat extends BrowserNumber {
    public static valueOf(value: number | string | NativeJavaString): BrowserFloat { return new BrowserFloat(value); }
    public static parseFloat(value: string | NativeJavaString): number { return Number.parseFloat(String(value)); }
}

class BrowserDouble extends BrowserNumber {
    public static readonly POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    public static readonly NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    public static readonly NaN = Number.NaN;
    public static valueOf(value: number | string | NativeJavaString): BrowserDouble { return new BrowserDouble(value); }
    public static parseDouble(value: string | NativeJavaString): number { return Number.parseFloat(String(value)); }
}

class BrowserBoolean {
    public constructor(public readonly value: boolean) {}
    public valueOf(): boolean { return this.value; }
    public toString(): string { return String(this.value); }
    public static parseBoolean(value: string | NativeJavaString): boolean { return String(value).toLowerCase() === "true"; }
    public static valueOf(value: boolean): BrowserBoolean { return new BrowserBoolean(value); }
}

class BrowserStringBuilder {
    private value: string;
    public constructor(initial = "") { this.value = String(initial); }
    public append(value: unknown): this { this.value += String(value); return this; }
    public setLength(length: number): void { this.value = this.value.slice(0, length); }
    public toString(): NativeJavaString { return new NativeJavaString(this.value); }
}

class BrowserClass {
    public static fromConstructor<T>(owner: Constructor<T>): RuntimeClassToken<T> { return RuntimeClassToken.fromConstructor(owner as any); }
}

class BrowserObject {
    public static get class(): RuntimeClassToken<any> { return BrowserClass.fromConstructor(this as any); }
    public getClass(): RuntimeClassToken<any> { return BrowserClass.fromConstructor(this.constructor as any); }
}

const unavailable = (name: string): never => {
    throw new Error(`${name} is unavailable in the browser host`);
};

const browserOutput = { println(value: unknown): void { console.log(String(value)); }, print(value: unknown): void { console.log(String(value)); } };
const browserJava = {
    lang: {
        Object: BrowserObject,
        String: NativeJavaString,
        CharSequence: NativeJavaString,
        Number: BrowserNumber,
        Integer: BrowserInteger,
        Long: BrowserLong,
        Float: BrowserFloat,
        Double: BrowserDouble,
        Boolean: BrowserBoolean,
        StringBuilder: BrowserStringBuilder,
        Throwable: JavaThrowable,
        Error: JavaError,
        Exception: JavaException,
        RuntimeException: JavaRuntimeException,
        IllegalArgumentException: JavaIllegalArgumentException,
        IllegalStateException: JavaIllegalStateException,
        NumberFormatException: JavaNumberFormatException,
        System: { out: browserOutput, err: browserOutput, currentTimeMillis: () => BigInt(Date.now()), identityHashCode: (value: object) => javaStringHashCode(String(value)) },
        Math: Math,
    },
    util: {
        Random: JavaRandom,
        ArrayList: NativeList,
        LinkedHashSet: NativeSet,
        HashSet: NativeSet,
        HashMap: NativeMap,
        LinkedHashMap: NativeMap,
        Collections: { emptyList: () => [], emptySet: () => new NativeSet(), unmodifiableList: (value: unknown) => value },
        UUID: { randomUUID: () => ({ toString: () => crypto.randomUUID() }) },
    },
    io: {
        IOException: class BrowserIOException extends JavaException {},
        PrintWriter: class BrowserPrintWriter { public println(value: unknown): void { console.log(String(value)); } public flush(): void {} public close(): void {} },
        PrintStream: class BrowserPrintStream {},
        StringWriter: class BrowserStringWriter {},
        StringBuilder: BrowserStringBuilder,
        FileWriter: class BrowserFileWriter { public constructor(_path: unknown) { unavailable("FileWriter"); } },
        FileOutputStream: class BrowserFileOutputStream { public constructor(_path: unknown) { unavailable("FileOutputStream"); } },
        FileInputStream: class BrowserFileInputStream { public constructor(_path: unknown) { unavailable("FileInputStream"); } },
        ObjectOutputStream: class BrowserObjectOutputStream { public constructor(_stream: unknown) { unavailable("ObjectOutputStream"); } },
        ObjectInputStream: class BrowserObjectInputStream { public constructor(_stream: unknown) { unavailable("ObjectInputStream"); } },
    },
    net: { InetAddress: { getByName: () => unavailable("InetAddress") }, DatagramSocket: class {}, DatagramPacket: class {} },
    nio: { charset: { StandardCharsets: { UTF_8: new NativeJavaString("UTF-8") }, Charset: { defaultCharset: () => new NativeJavaString("UTF-8") } } },
};

export const Class = BrowserClass;
export const JavaObject = BrowserObject;
export const java = browserJava as any;
export type JavaStringInput = NativeJavaString | string;
export const toJavaString = (value: JavaStringInput): NativeJavaString =>
    value instanceof NativeJavaString ? value : new NativeJavaString(value);
export const isJavaThrowable = (value: unknown): value is JavaThrowable => value instanceof JavaThrowable;
export const isJavaException = (value: unknown): value is JavaException => value instanceof JavaException;
