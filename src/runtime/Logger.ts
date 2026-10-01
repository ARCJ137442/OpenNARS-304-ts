import { javaStringValue, type JavaStringInput } from "./java-text.ts";

export type LogLevel = "INFO" | "SEVERE" | string;

/** Small project logger; hosts can replace the sink without changing reasoner code. */
export class Logger {
    private constructor(private readonly name: string) {}

    public static named(name: JavaStringInput | string): Logger {
        return new Logger(javaStringValue(name));
    }

    public log(level: LogLevel, message: unknown, error?: unknown): void {
        const prefix = `${level} ${this.name}`;
        if (message === null || message === undefined) console.error(prefix);
        else console.error(prefix, javaStringValue(message));
        if (error === null || error === undefined) return;
        const printStackTrace = (error as { stack?: unknown }).stack;
        if (typeof printStackTrace === "string") console.error(printStackTrace);
        else console.error(error);
    }
}
