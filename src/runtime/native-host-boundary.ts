import { javaStringValue, type JavaStringInput } from "./java-text.ts";

/** Minimal logging contract shared by the core and host adapters. */
export class JavaSystemLoggerCompat {
    public static readonly Level = { SEVERE: "SEVERE" } as const;
    private constructor(private readonly name: string) {}

    public static getLogger(name: JavaStringInput | string): JavaSystemLoggerCompat {
        return new JavaSystemLoggerCompat(javaStringValue(name));
    }

    public log(level: string, message: unknown, error: unknown): void {
        const prefix = `${level} ${this.name}`;
        if (message === null || message === undefined) console.error(prefix);
        else console.error(prefix, javaStringValue(message));
        if (error !== null && error !== undefined) {
            const printStackTrace = (error as { printStackTrace?: unknown }).printStackTrace;
            if (typeof printStackTrace === "function") printStackTrace.call(error);
            else console.error(error);
        }
    }
}

/** Boxed numeric compatibility used by translated configuration parsing. */
export class JavaDoubleCompat {
    public static readonly POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    public static readonly NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
    public static readonly NaN = Number.NaN;
    public constructor(private readonly value: number | string | JavaStringInput) {}
    public static toString(value: number): string { return String(value); }
    public static valueOf(value: number | string | JavaStringInput): JavaDoubleCompat { return new JavaDoubleCompat(value); }
    public doubleValue(): number { return Number(javaStringValue(this.value)); }
    public floatValue(): number { return Math.fround(this.doubleValue()); }
    public intValue(): number { return Math.trunc(this.doubleValue()); }
    public longValue(): bigint { return BigInt(this.intValue()); }
    public valueOf(): number { return this.doubleValue(); }
}
