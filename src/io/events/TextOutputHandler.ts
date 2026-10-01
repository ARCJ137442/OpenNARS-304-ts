//! Java source: opennars/io/events/TextOutputHandler.java
import type { ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import type { float } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { OutputHandler } from "./OutputHandler.ts";
import type { EventEmitter } from "./EventEmitter.ts";
import type { Nar } from "../../main/Nar.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Task } from "../../entity/Task.ts";
import { Events } from "./Events.ts";
import { javaStringValue } from "../../runtime/java-text.ts";
import type { JavaStringInput } from "../../runtime/java-text.ts";
import { ReasonerInputError } from "../../runtime/ReasonerErrors.ts";
import { ReasonerIoError } from "../../runtime/ReasonerErrors.ts";

export interface TextLineWriter {
    println(value: unknown): void;
    flush?(): void;
    close?(): void;
}

interface OutputBuffer {
    append(value: unknown): OutputBuffer;
    setLength(length: number): void;
    toString(): string;
}

class NativeOutputBuffer implements OutputBuffer {
    private value = "";
    public append(value: unknown): OutputBuffer {
        this.value += String(value);
        return this;
    }
    public setLength(length: number): void {
        this.value = this.value.slice(0, length);
    }
    public toString(): string {
        return this.value;
    }
}

const isThrowable = (value: unknown): value is Error & { getStackTrace?: () => readonly unknown[] } =>
    value instanceof Error;
const isOutputBuffer = (value: unknown): value is OutputBuffer => {
    const candidate = value as Partial<OutputBuffer> | null;
    return candidate !== null && typeof candidate === "object"
        && typeof candidate.append === "function"
        && typeof candidate.setLength === "function"
        && typeof candidate.toString === "function";
};
const isLineWriter = (value: unknown): value is TextLineWriter => {
    const candidate = value as Partial<TextLineWriter> | null;
    return candidate !== null && typeof candidate === "object" && typeof candidate.println === "function";
};

const IN = OutputHandler.IN;
const OUT = OutputHandler.OUT;
const ERR = OutputHandler.ERR;
const ECHO = OutputHandler.ECHO;
const EXE = OutputHandler.EXE;
const DEBUG = OutputHandler.DEBUG;
const ANTICIPATE = OutputHandler.ANTICIPATE;
const CONFIRM = OutputHandler.CONFIRM;
const DISAPPOINT = OutputHandler.DISAPPOINT;
const Answer = Events.Answer;

const formatJavaArray = (values: readonly unknown[]): string => JSON.stringify(values) ?? "null";
const formatJavaList = (values: readonly unknown[]): string => `[${values.map(value => String(value)).join(", ")}]`;


/**
 * To read and write experience as Task streams
 *
 */
// Java 原始类型实现 Serializable；它是 marker，不增加运行时方法，故不引入 jree 接口。
export class TextOutputHandler extends OutputHandler {

    private readonly nar: Nar;

    private prefix: string = "";
    private outExp2: TextOutputHandler.LineOutput | null = null;
    private outExp: TextLineWriter | null = null;
    private showErrors: boolean = true;
    private showStackTrace: boolean = false;
    private readonly showStamp: boolean = true;
    private showInput: boolean = true;
    private minPriority: float = 0;

    /**
     * Default constructor; adds the reasoner to a Nar's output channels
     *
     * @param n
     */
    public constructor(n: Nar);

    public constructor(n: Nar, outExp2: TextOutputHandler.LineOutput);

    public constructor(n: Nar, outExp: TextLineWriter);

    public constructor(n: Nar, ps: TextLineWriter);

    public constructor(n: Nar, s: TextLineWriter);

    public constructor(n: Nar, outExp: TextLineWriter, minPriority: float);

    public constructor(n: Nar, ps: TextLineWriter, minPriority: float);
    public constructor(...args: unknown[]) {
        const n = args[0] as Nar;
        super(n, true);
        this.nar = n;

        switch (args.length) {
            case 1: {
                break;
            }

            case 2: {
                const target = args[1];
                if (isLineWriter(target)) this.outExp = target;
                else this.outExp2 = target as TextOutputHandler.LineOutput;
                break;
            }

            case 3: {
                const target = args[1];
                const minPriority = args[2] as float;
                if (isLineWriter(target)) this.outExp = target;
                else {
                    throw new ReasonerInputError("Invalid output target");
                }
                this.minPriority = minPriority;
                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * Open an output experience file
     */
    public openSaveFile(path: JavaStringInput): void {
        const openTextWriter = this.nar.getRuntimeCapabilities()?.openTextWriter;
        if (openTextWriter === undefined) {
            throw new ReasonerIoError("Opening an output file requires the host text-writer capability");
        }
        try {
            this.outExp = openTextWriter(javaStringValue(path));
        } catch (ex) {
            throw new ReasonerIoError(`Could not open save file: ${javaStringValue(path)}`, { cause: ex });
        }
    }

    /**
     * Close an output experience file
     */
    public closeSaveFile(): void {
        if (this.outExp !== null)
            this.outExp.close?.();
        this.setActive(false);
    }

    /**
     * Process the next chunk of output data
     *
     */
    public event(channel: ClassTokenLike, oo: EventEmitter.EventPayload): void {
        if (!this.showErrors && (channel === ERR.class))
            return;

        if (!this.showInput && (channel === IN.class))
            return;

        if ((this.outExp !== null) || (this.outExp2 !== null)) {
            const o: unknown = oo[0];
            const s: string | null = this.process(channel, o);
            if (s !== null) {
                const line = `${this.prefix}${s}`;
                if (this.outExp !== null) {
                    this.outExp.println(line);
                    this.outExp.flush?.();
                }
                if (this.outExp2 !== null) {
                    this.outExp2.println(line);
                }
            }
        }
    }

    protected readonly result: OutputBuffer = new NativeOutputBuffer();

    public process(c: ClassTokenLike, o: unknown): string | null {
        return this.getOutputString(c, o, true, this.showStamp, this.nar, this.result, this.minPriority);
    }

    public setErrors(errors: boolean): TextOutputHandler {
        this.showErrors = errors;
        return this;
    }

    public setShowInput(showInput: boolean): TextOutputHandler {
        this.showInput = showInput;
        return this;
    }

    public setErrorStackTrace(b: boolean): TextOutputHandler {
        this.showStackTrace = true;
        return this;
    }

    public setLinePrefix(prefix: JavaStringInput): TextOutputHandler {
        this.prefix = javaStringValue(prefix);
        return this;
    }

    public static getOutputString(channel: ClassTokenLike, signal: unknown,
        showStamp: boolean, nar: Nar): string | null;

    public static getOutputString(channel: ClassTokenLike, signal: unknown,
        showStamp: boolean, nar: Nar, buffer: OutputBuffer): string | null;

    public static getOutputString(channel: ClassTokenLike, signal: unknown, showChannel: boolean,
        showStamp: boolean, nar: Nar): string | null;

    public static getOutputString(...args: unknown[]): string | null {
        switch (args.length) {
            case 4: {
                const [channel, signal, showStamp, nar] = args as [ClassTokenLike, unknown, boolean, Nar];
                return TextOutputHandler.formatStaticOutputString(
                    channel, signal, showStamp, nar, new NativeOutputBuffer(),
                );
            }
            case 5: {
                if (isOutputBuffer(args[4])) {
                    const [channel, signal, showStamp, nar, buffer] = args as [ClassTokenLike, unknown, boolean, Nar, OutputBuffer];
                    return TextOutputHandler.formatStaticOutputString(channel, signal, showStamp, nar, buffer);
                }
                const [channel, signal, showChannel, showStamp, nar] = args as [ClassTokenLike, unknown, boolean, boolean, Nar];
                const output = TextOutputHandler.formatStaticOutputString(
                    channel, signal, showStamp, nar, new NativeOutputBuffer(),
                );
                if (output === null || !showChannel)
                    return output;
                return `${channel.getSimpleName()}: ${output}`;
            }
            default:
                throw new ReasonerInputError("Invalid number of arguments");
        }
    }

    public getOutputString(channel: ClassTokenLike, signal: unknown, showChannel: boolean,
        showStamp: boolean, nar: Nar, buffer: OutputBuffer): string | null;

    /** generates a human-readable string from an output channel and signal */
    public getOutputString(channel: ClassTokenLike, signal: unknown, showChannel: boolean,
        showStamp: boolean, nar: Nar, buffer: OutputBuffer, minPriority: float): string | null;
    public getOutputString(...args: unknown[]): string | null {
        switch (args.length) {
            case 6: {
                const [channel, signal, showChannel, showStamp, nar, buffer] = args as [ClassTokenLike, unknown, boolean, boolean, Nar, OutputBuffer];
                return this.getOutputString(channel, signal, showChannel, showStamp, nar, buffer, 0);
            }
            case 7: {
                const [channel, signal, showChannel, showStamp, nar, buffer, minPriority] = args as [ClassTokenLike, unknown, boolean, boolean, Nar, OutputBuffer, float];
                return TextOutputHandler.formatInstanceOutputString(
                    channel, signal, showChannel, showStamp, nar, buffer, minPriority, this.showStackTrace,
                );
            }
            default:
                throw new ReasonerInputError("Invalid number of arguments");
        }
    }

    private static formatInstanceOutputString(channel: ClassTokenLike, signal: unknown, showChannel: boolean,
        showStamp: boolean, nar: Nar, buffer: OutputBuffer, minPriority: float,
        showStackTrace: boolean): string | null {
        buffer.setLength(0);

        if (showChannel)
            buffer.append(channel.getSimpleName()).append(": ");

        if (channel === ERR.class) {
            if (isThrowable(signal)) {
                const e = signal;
                buffer.append(e.toString().replace(/^Java/, ""));
                if (showStackTrace) {
                    buffer.append(" ").append(formatJavaList(e.getStackTrace?.() ?? []));
                }
            } else {
                buffer.append(String(signal));
            }
        } else if ((channel === OUT.class) || (channel === IN.class) || (channel === ECHO.class) || (channel === EXE.class)
            || (channel === Answer.class)
            || (channel === ANTICIPATE.class) || (channel === DISAPPOINT.class) || (channel === CONFIRM.class)
            || (channel === DEBUG.class)) {
            if (channel === CONFIRM.class) {
                buffer.append(String(signal));
            }
            if (signal instanceof Task) {
                const task: Task = signal as Task;
                if (task.getPriority() < minPriority)
                    return null;

                if ((channel === ANTICIPATE.class) || (channel === DISAPPOINT.class)) {
                    buffer.append(task.sentence.toString(nar, showStamp));
                } else if (channel === Answer.class) {
                    const answer: Sentence | null = task.getBestSolution();
                    if (answer !== null)
                        buffer.append(answer.toString(nar, showStamp));
                    else
                        buffer.append(task.sentence.toString(nar, showStamp));
                } else {
                    buffer.append(task.sentence.toString(nar, showStamp));
                }
            } else {
                buffer.append(String(signal));
            }
        } else {
            buffer.append(String(signal));
        }

        return buffer.toString();
    }

    private static formatStaticOutputString(channel: ClassTokenLike, signal: unknown,
        showStamp: boolean, nar: Nar, buffer: OutputBuffer): string {
        buffer.setLength(0);

        if (isThrowable(signal)) {
            const error = signal;
            buffer.append(error.toString().replace(/^Java/, "")).append(" ")
                .append(formatJavaList(error.getStackTrace?.() ?? []));
        } else if (signal instanceof Task) {
            buffer.append(signal.sentence.toString(nar, showStamp));
        } else if (signal instanceof Sentence) {
            buffer.append(signal.toString(nar, showStamp));
        } else if (Array.isArray(signal)) {
            if (channel === Answer.class) {
                const answer = (signal as unknown[])[1] as Sentence;
                buffer.append(answer.toString(nar, showStamp));
            } else {
                buffer.append(formatJavaArray(signal as unknown[]));
            }
        } else {
            buffer.append(String(signal));
        }

        return buffer.toString();
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TextOutputHandler {
    export interface LineOutput {
        println(s: JavaStringInput): void;
    }

}
