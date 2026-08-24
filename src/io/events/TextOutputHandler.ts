//! Java source: opennars/io/events/TextOutputHandler.java
import { java, type float, S } from "jree";
import { OutputHandler } from "./OutputHandler.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Sentence } from "../../entity/Sentence.ts";
import { Task } from "../../entity/Task.ts";
import { Events } from "./Events.ts";

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



/**
 * To read and write experience as Task streams
 *
 */
export class TextOutputHandler extends OutputHandler implements java.io.Serializable {

    private readonly nar: Nar;

    private prefix: java.lang.String = S``;
    private outExp2: TextOutputHandler.LineOutput | null = null;
    private outExp: java.io.PrintWriter | null = null;
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

    public constructor(n: Nar, outExp: java.io.PrintWriter);

    public constructor(n: Nar, ps: java.io.PrintStream);

    public constructor(n: Nar, s: java.io.StringWriter);

    public constructor(n: Nar, outExp: java.io.PrintWriter, minPriority: float);

    public constructor(n: Nar, ps: java.io.PrintStream, minPriority: float);
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
                if (target instanceof java.io.PrintWriter) {
                    this.outExp = target;
                } else if (target instanceof java.io.PrintStream) {
                    this.outExp = new java.io.PrintWriter(target);
                } else if (target instanceof java.io.StringWriter) {
                    this.outExp = new java.io.PrintWriter(target);
                } else {
                    this.outExp2 = target as TextOutputHandler.LineOutput;
                }
                break;
            }

            case 3: {
                const target = args[1];
                const minPriority = args[2] as float;
                if (target instanceof java.io.PrintWriter) {
                    this.outExp = target;
                } else if (target instanceof java.io.PrintStream) {
                    this.outExp = new java.io.PrintWriter(target);
                } else {
                    throw new java.lang.IllegalArgumentException(S`Invalid output target`);
                }
                this.minPriority = minPriority;
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Open an output experience file
     */
    public openSaveFile(path: java.lang.String): void {
        try {
            this.outExp = new java.io.PrintWriter(new java.io.FileWriter(path));
        } catch (ex) {
            if (ex instanceof java.io.IOException) {
                throw new java.lang.IllegalStateException("Could not open save file.", ex);
            } else {
                throw ex;
            }
        }
    }

    /**
     * Close an output experience file
     */
    public closeSaveFile(): void {
        if (this.outExp !== null)
            this.outExp.close();
        this.setActive(false);
    }

    /**
     * Process the next chunk of output data
     *
     */
    public event(channel: java.lang.Class<unknown>, oo: java.lang.Object[]): void {
        if (!this.showErrors && (channel === ERR.class))
            return;

        if (!this.showInput && (channel === IN.class))
            return;

        if ((this.outExp !== null) || (this.outExp2 !== null)) {
            let o: java.lang.Object = oo[0];
            let s: java.lang.String | null = this.process(channel, o);
            if (s !== null) {
                const line = new java.lang.StringBuilder().append(this.prefix).append(s).toString();
                if (this.outExp !== null) {
                    this.outExp.println(line);
                    this.outExp.flush();
                }
                if (this.outExp2 !== null) {
                    this.outExp2.println(line);
                }
            }
        }
    }

    protected readonly result: java.lang.StringBuilder = new java.lang.StringBuilder(16 /* estimate */);

    public process(c: java.lang.Class<unknown>, o: java.lang.Object): java.lang.String | null {
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

    public setLinePrefix(prefix: java.lang.String): TextOutputHandler {
        this.prefix = prefix;
        return this;
    }

    public getOutputString(channel: java.lang.Class<unknown>, signal: java.lang.Object, showChannel: boolean,
        showStamp: boolean, nar: Nar, buffer: java.lang.StringBuilder): java.lang.String | null;

    /** generates a human-readable string from an output channel and signal */
    public getOutputString(channel: java.lang.Class<unknown>, signal: java.lang.Object, showChannel: boolean,
        showStamp: boolean, nar: Nar, buffer: java.lang.StringBuilder, minPriority: float): java.lang.String | null;
    public getOutputString(...args: unknown[]): java.lang.String | null {
        switch (args.length) {
            case 6: {
                const [channel, signal, showChannel, showStamp, nar, buffer] = args as [java.lang.Class<unknown>, java.lang.Object, boolean, boolean, Nar, java.lang.StringBuilder];


                return this.getOutputString(channel, signal, showChannel, showStamp, nar, buffer, 0);


                break;
            }

            case 7: {
                const [channel, signal, showChannel, showStamp, nar, buffer, minPriority] = args as [java.lang.Class<unknown>, java.lang.Object, boolean, boolean, Nar, java.lang.StringBuilder, float];


                buffer.setLength(0);

                if (showChannel)
                    buffer.append(channel.getSimpleName()).append(": ");

                if (channel === ERR.class) {
                    if (signal instanceof java.lang.Throwable) {
                        let e: java.lang.Throwable = signal as java.lang.Throwable;

                        buffer.append(e.toString());

                        if (this.showStackTrace) {
                            buffer.append(" ").append(java.util.Arrays.asList(e.getStackTrace()));
                        }
                    } else {
                        buffer.append(signal.toString());
                    }

                } else if ((channel === OUT.class) || (channel === IN.class) || (channel === ECHO.class) || (channel === EXE.class)
                    || (channel === Answer.class)
                    || (channel === ANTICIPATE.class) || (channel === DISAPPOINT.class) || (channel === CONFIRM.class)
                    || (channel === DEBUG.class)) {

                    if (channel === CONFIRM.class) {
                        buffer.append(signal.toString());
                    }
                    if (signal instanceof Task) {
                        let t: Task = signal as Task;
                        if (t.getPriority() < minPriority)
                            return null;

                        if ((channel === ANTICIPATE.class) || (channel === DISAPPOINT.class)) {
                            buffer.append(t.sentence.toString(nar, showStamp));
                        } else if (channel === Answer.class) {
                            let task: Task = t; // server / NARRun
                            let answer: Sentence = task.getBestSolution();
                            if (answer !== null)
                                buffer.append(answer.toString(nar, showStamp));
                            else
                                buffer.append(t.sentence.toString(nar, showStamp));
                        } else
                            buffer.append(t.sentence.toString(nar, showStamp));
                    } else {
                        buffer.append(signal.toString());
                    }

                } else {
                    buffer.append(signal.toString());
                }

                return buffer.toString();



                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TextOutputHandler {
    export interface LineOutput {
        println(s: java.lang.String): void;
    }

}


