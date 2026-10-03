import { textValue, type TextInput } from "./Text.ts";

export type LogLevel = "INFO" | "SEVERE" | string;

/** Small project logger; hosts can replace the sink without changing reasoner code. */
export class Logger {
    private constructor(private readonly name: string) {}

    public static named(name: TextInput | string): Logger {
        return new Logger(textValue(name));
    }

    public log(level: LogLevel, message: unknown, error?: unknown): void {
        const prefix = `${level} ${this.name}`;
        const write = level === "INFO" ? console.info : console.error;
        if (message === null || message === undefined) write.call(console, prefix);
        else write.call(console, prefix, textValue(message));
        if (error === null || error === undefined) return;
        const printStackTrace = (error as { stack?: unknown }).stack;
        if (typeof printStackTrace === "string") console.error(printStackTrace);
        else console.error(error);
    }
}
