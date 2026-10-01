//! Java source: opennars/main/Nar.java
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";
import type { long, int, double, float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { javaStringValue, toJavaString as toNativeJavaString, type JavaStringInput } from "../runtime/java-text.ts";
import { toRuntimeLong, type JavaLongInput } from "../runtime/java-values.ts";
import { Parameters } from "./Parameters.ts";
import { Debug } from "./Debug.ts";
import { ConfigReader } from "../io/ConfigReader.ts";
import { Narsese } from "../io/Narsese.ts";
import { Parser } from "../io/Parser.ts";
import { Symbols } from "../io/Symbols.ts";
import { Events } from "../io/events/Events.ts";
import { EventEmitter } from "../io/events/EventEmitter.ts";
import { OutputHandler } from "../io/events/OutputHandler.ts";
import { AnswerHandler } from "../io/events/AnswerHandler.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { SetExt } from "../language/SetExt.ts";
import { SetInt } from "../language/SetInt.ts";
import { Tense } from "../language/Tense.ts";
import { Term } from "../language/Term.ts";
import { Operator } from "../operator/Operator.ts";
import { Emotions } from "../plugin/mental/Emotions.ts";
import { InternalExperience } from "../plugin/mental/InternalExperience.ts";
import { SensoryChannel } from "../plugin/perception/SensoryChannel.ts";
import { Bag } from "../storage/Bag.ts";
import { Memory } from "../storage/Memory.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Concept } from "../entity/Concept.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Stamp } from "../entity/Stamp.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { NativeReadOnlyList } from "../runtime/NativeList.ts";
import { NativeMap } from "../runtime/NativeMap.ts";
import { ReasonerInputError, ReasonerStateError } from "../runtime/ReasonerErrors.ts";
import { InterruptedExceptionCompat, ThreadCompat } from "../runtime/ThreadCompat.ts";
import { Task } from "../entity/Task.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import type { Timable } from "../interfaces/Timable.ts";
import { DEFAULT_CONFIG_XML } from "../io/DefaultConfig.ts";
import { defaultCurrentTimeMillis, type RuntimeCapabilities } from "../platform/RuntimeCapabilities.ts";

type EventObserver = EventEmitter.EventObserver;
export interface NarOptions {
    readonly narId?: JavaLongInput;
    readonly configText?: string;
    readonly configSource?: string;
    readonly parameterOverrides?: NativeMap<string, unknown>;
    readonly capabilities?: RuntimeCapabilities;
}


const isNumeric = (value: unknown): boolean => /^[-+]?\d+(?:\.\d+)?$/.test(String(value).trim());
const CyclesStart = Events.CyclesStart;
const CyclesEnd = Events.CyclesEnd;
const printInfo = (message: unknown): void => {
    if (typeof console !== "undefined") console.log(String(message));
};

const isLongLike = (value: unknown): value is { longValue(): bigint } =>
    typeof (value as { longValue?: unknown } | null)?.longValue === "function";



/**
 * Non-Axiomatic Reasoner
 *
 * Instances of this represent a reasoner connected to a Memory, and set of
 * Input and Output channels.
 *
 * All state is contained within Memory. A Nar is responsible for managing I/O
 * channels and executing
 * memory operations. It executesa series sof cycles in two possible modes:
 * * step mode - controlled by an outside system, such as during debugging or
 * testing
 * * thread mode - runs in a pausable closed-loop at a specific maximum
 * framerate.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
// Java 原始类型实现 Runnable；Reasoner 已声明 run()，ThreadCompat 只消费该运行合同。
export class Nar extends SensoryChannel implements Reasoner {
    public narParameters: Parameters = new Parameters();

    /*
     * System clock, relatively defined to guarantee the repeatability of behaviors
     */
    // Keep the existing runtime number representation; `long` here is the
    // translated Java contract, while the project time adapter still uses
    // numeric clock values at runtime.
    private cycleCounter: long = 0 as unknown as long;
    private currentTimeMillis: (() => bigint) | undefined;
    private capabilities: RuntimeCapabilities | undefined;

    /**
     * The information about the version of the project
     */
    public static readonly VERSION: string = "v3.0.4";

    /**
     * Name of the reasoner of the project
     */
    public static readonly NAME: string = "Open-NARS";

    /**
     * The project web sites.
     */
    public static readonly WEBSITE: string = " Open-NARS website:  http://code.google.com/p/open-org.opennars/ \n      NARS website:  http://sites.google.com/site/narswang/ \n    Github website:  http://github.com/opennars/ \n    IRC:  http://webchat.freenode.net/?channels=org.opennars \n";

    private threads: ThreadCompat[] | null = null;
    // Java `Map<Term, SensoryChannel>` backed by `LinkedHashMap`; NativeMap
    // preserves Term.equals lookup, insertion order, and Map views.
    protected sensoryChannels: NativeMap<Term, SensoryChannel> = new NativeMap<Term, SensoryChannel>();

    // Java source type: String. Normalize both boxed and native inputs in Narsese.
    public addSensoryChannel(term: JavaStringInput, channel: SensoryChannel): void {
        try {
            const parsedTerm = new Narsese(this).parseTerm(term);
            if (parsedTerm === null) {
                throw new ReasonerInputError("Invalid sensory channel term");
            }
            this.sensoryChannels.put(parsedTerm, channel);
        } catch (ex) {
            if (ex instanceof Parser.InvalidInputException) {
                throw new ReasonerStateError(
                    "Could not add sensory channel.",
                    { cause: ex },
                );
            } else {
                throw ex;
            }
        }
    }

    public SaveToFile(name: JavaStringInput): void {
        const saveSnapshot = this.capabilities?.saveSnapshot;
        if (saveSnapshot === undefined) throw new Error("SaveToFile requires a host saveSnapshot capability");
        saveSnapshot(javaStringValue(name), this);
    }

    /** Expose only the injected host capabilities needed by adapters. */
    public getRuntimeCapabilities(): RuntimeCapabilities | undefined {
        return this.capabilities;
    }

    public static LoadFromFile(name: JavaStringInput, capabilities?: RuntimeCapabilities): Nar {
        const loadSnapshot = capabilities?.loadSnapshot;
        if (loadSnapshot === undefined) throw new Error("LoadFromFile requires a host loadSnapshot capability");
        let ret: Nar = loadSnapshot(javaStringValue(name)) as Nar;
        ret.capabilities = capabilities;
        ret.memory.event = new EventEmitter();
        ret.plugins = [];
        ret.sensoryChannels = new NativeMap<Term, SensoryChannel>();
        let pluginsToAdd: Plugin[] = ConfigReader.loadParamsFromFileAndReturnPlugins(ret.usedConfigFilePath, ret,
            ret.narParameters);
        for (let p of pluginsToAdd) {
            ret.addPlugin(p);
        }
        return ret;
    }

    protected minCyclePeriodMS: long = 0n;

    /**
     * The name of the reasoner
     */
    protected name: string | null = null;
    /**
     * The memory of the reasoner
     */
    public readonly memory: Memory;

    public PluginState = (($outer) => {
        // Java source: public class PluginState implements Serializable.
        // Serializable is a marker here; plugin lifecycle is the only runtime contract.
        return class PluginState {
            public readonly plugin: Plugin;
            protected enabled: boolean = false;

            public constructor(plugin: Plugin);

            public constructor(plugin: Plugin, enabled: boolean);
            public constructor(...args: unknown[]) {
                if (args.length === 1 || args.length === 2) {
                    const plugin = args[0] as Plugin;
                    const enabled = args.length === 2 ? args[1] as boolean : true;
                    this.plugin = plugin;
                    this.setEnabled(enabled);
                } else {
                    throw new ReasonerInputError("Invalid number of arguments");
                }
            }


            public setEnabled(enabled: boolean): void {
                if (this.enabled === enabled)
                    return;

                this.plugin.setEnabled($outer, enabled);
                this.enabled = enabled;
                    $outer.emit(Events.PluginsChange.class, this.plugin, enabled);
            }

            public isEnabled(): boolean {
                return this.enabled;
            }
        }
    })(this);


    protected plugins: Nar.PluginState[] = []; // was CopyOnWriteArrayList

    /** Flag for running continuously */
    private running: boolean = false;
    /** used by stop() to signal that a running loop should be interrupted */
    private stopped: boolean = false;
    private threadYield: boolean = false;

    public static readonly DEFAULTCONFIG_FILEPATH: string = "./config/defaultConfig.xml";

    /** Constructs the NAR with the embedded default configuration text. */
    public constructor();

    /** Constructs the NAR with the embedded default configuration text. */
    public constructor(narId: JavaLongInput);

    /** Constructs the NAR from explicit XML configuration text. */
    public constructor(configText: JavaStringInput);

    /** Constructs the NAR with parameter overrides and embedded defaults. */
    public constructor(parameterOverrides: NativeMap<string, unknown>);

    /** Constructs the NAR with an id and explicit XML configuration text. */
    public constructor(narId: JavaLongInput, configText: JavaStringInput);

    /** Constructs the NAR from XML text with parameter overrides. */
    public constructor(configText: JavaStringInput, parameterOverrides: NativeMap<string, unknown>);

    /** Constructs the NAR with an id, XML text and parameter overrides. */
    public constructor(narId: JavaLongInput, configText: JavaStringInput, parameterOverrides: NativeMap<string, unknown>);
    /** Constructs the NAR from explicit configuration text without file I/O. */
    public constructor(options: NarOptions);
    public constructor(...args: unknown[]) {
        // Java constructor delegation (`this(...)`) is not legal in
        // TypeScript. Resolve all overloads before the one and only `super()`.
        let narId: long = Nar.randomId();
        let configText = DEFAULT_CONFIG_XML;
        let configSource: string = Nar.DEFAULTCONFIG_FILEPATH;
        let parameterOverrides: NativeMap<string, unknown> | null = null;
        let capabilities: RuntimeCapabilities | undefined;

        if (args.length === 0) {
            // defaults above
        } else if (args.length === 1) {
            const value = args[0];
            const isOptions = value !== null && typeof value === "object"
                && ("configText" in (value as object) || "narId" in (value as object)
                    || "configSource" in (value as object) || "parameterOverrides" in (value as object)
                    || "capabilities" in (value as object));
            if (isOptions) {
                const options = value as NarOptions;
                if (options.narId !== undefined) narId = toRuntimeLong(options.narId);
                if (options.configText !== undefined) configText = options.configText;
                if (options.configSource !== undefined) configSource = options.configSource;
                if (options.parameterOverrides !== undefined) parameterOverrides = options.parameterOverrides;
                if (options.capabilities !== undefined) capabilities = options.capabilities;
            } else if (typeof value === "number" || typeof value === "bigint" || isLongLike(value)) {
                narId = typeof value === "number" || typeof value === "bigint"
                    ? toRuntimeLong(value)
                    : value.longValue();
            } else if (value !== null && typeof (value as { toString?: unknown }).toString === "function") {
                const text = String(value);
                if (!text.trimStart().startsWith("<")) {
                    throw new ReasonerInputError("Nar configuration must be XML text; read files in the host adapter and pass NarOptions.configText");
                }
                configText = text;
            } else {
                parameterOverrides = value as NativeMap<string, unknown>;
            }
        } else if (args.length === 2) {
            if (typeof args[0] === "number" || typeof args[0] === "bigint" || isLongLike(args[0])) {
                narId = typeof args[0] === "number" || typeof args[0] === "bigint"
                    ? toRuntimeLong(args[0] as JavaLongInput)
                    : (args[0] as { longValue(): bigint }).longValue();
                const text = String(args[1]);
                if (!text.trimStart().startsWith("<")) {
                    throw new ReasonerInputError("Nar configuration must be XML text; read files in the host adapter and pass NarOptions.configText");
                }
                configText = text;
            } else {
                const text = String(args[0]);
                if (!text.trimStart().startsWith("<")) {
                    throw new ReasonerInputError("Nar configuration must be XML text; read files in the host adapter and pass NarOptions.configText");
                }
                configText = text;
                parameterOverrides = args[1] as NativeMap<string, unknown>;
            }
        } else if (args.length === 3) {
            narId = typeof args[0] === "number" || typeof args[0] === "bigint"
                ? toRuntimeLong(args[0] as JavaLongInput)
                : (args[0] as { longValue(): bigint }).longValue();
            const text = String(args[1]);
            if (!text.trimStart().startsWith("<")) {
                throw new ReasonerInputError("Nar configuration must be XML text; read files in the host adapter and pass NarOptions.configText");
            }
            configText = text;
            parameterOverrides = args[2] as NativeMap<string, unknown>;
        } else {
            throw new ReasonerInputError("Invalid number of arguments");
        }

        super();
        this.capabilities = capabilities;
        this.currentTimeMillis = capabilities?.currentTimeMillis ?? defaultCurrentTimeMillis;
        let pluginsToAdd: Plugin[] = ConfigReader.loadParamsFromConfigTextAndReturnPlugins(configText, this,
            this.narParameters, capabilities);
        if (parameterOverrides !== null) {
            Nar.overrideParameters(this.narParameters, parameterOverrides);
        }
        let m: Memory = new Memory(this.narParameters,
            new Bag(this.narParameters.CONCEPT_BAG_LEVELS, this.narParameters.CONCEPT_BAG_SIZE, this.narParameters),
            new Bag(this.narParameters.NOVEL_TASK_BAG_LEVELS, this.narParameters.NOVEL_TASK_BAG_SIZE, this.narParameters),
            new Bag(this.narParameters.SEQUENCE_BAG_LEVELS, this.narParameters.SEQUENCE_BAG_SIZE, this.narParameters),
            new Bag(this.narParameters.OPERATION_BAG_LEVELS, this.narParameters.OPERATION_BAG_SIZE, this.narParameters));
        this.memory = m;
        this.memory.narId = narId;
        this.usedConfigFilePath = configSource;
        for (let p of pluginsToAdd) { // adding after memory is constructed, as memory depends on the loaded params!!
            this.addPlugin(p);
        }
    }


    public usedConfigFilePath: string = "";

    /**
     * Reset the system with an empty memory and reset clock. Called locally.
     */
    public reset(): void {
        this.cycleCounter = 0 as unknown as long;
        this.memory.reset();
    }

    /**
     * Generally the text will consist of Task's to be parsed in Narsese, but
     * may contain other commands recognized by the system. The creationTime
     * will be set to the current memory cycle time, but may be processed by
     * memory later according to the length of the input queue.
     */
    private addMultiLineInput(text: string): boolean {
        const lines = text.split("\n");
        for (let s of lines) {
            this.addInput(s);
            if (!this.running) {
                this.cycle();
            }
        }
        return true;
    }

    private addCommand(text: string): boolean {
        // 重置
        if (text.startsWith("**") || text.startsWith("*reset")) {
            this.reset();
            return true;
        } // 决策阈值
        else if (text.startsWith("*decisionthreshold=")) { // TODO use reflection for narParameters, allow to set
            // others too
            const value = Number.parseFloat(text.split("decisionthreshold=")[1]);
            this.narParameters.DECISION_THRESHOLD = Float32Math.from(value) as float;
            return true;
        } // 音量
        else if (text.startsWith("*volume=")) {
            const value = Number.parseInt(text.split("volume=")[1], 10);
            this.narParameters.VOLUME = value;
            return true;
        } // 线程数
        else if (text.startsWith("*threads=")) {
            const value = Number.parseInt(text.split("threads=")[1], 10);
            this.narParameters.THREADS_AMOUNT = value;
            return true;
        } // 保存
        else if (text.startsWith("*save=")) {
            const filename = text.split("save=")[1];
            let wasRunning: boolean = this.isRunning();
            if (wasRunning) {
                this.stop();
            }
            this.SaveToFile(filename);
            if (wasRunning) {
                this.start(this.minCyclePeriodMS);
            }
            return true;
        }
        // 设置运行速度（负数为关闭）
        else if (text.startsWith("*speed")) {
            const split = text.split("speed");
            const stripped = split.length > 1 ? split[1] : "";
            // 若带等号⇒修改
            if (stripped.startsWith("=")) {
                this.minCyclePeriodMS = BigInt(stripped.split("=")[1]);
            }
            // 总是打印信息
            if (this.minCyclePeriodMS > 0n)
                printInfo("INFO: Running at " + this.minCyclePeriodMS + "ms per cycle.");
            else if (this.minCyclePeriodMS === 0n)
                printInfo("INFO: Running at full speed.");
            else
                printInfo("INFO: Auto-cycling off.");
            return true;
        }
        // 设置运行速度（负数为关闭）
        else if (text.startsWith("*speed=")) {
            const value = Number.parseInt(text.split("speed=")[1], 10);
            this.minCyclePeriodMS = BigInt(value);
            return true;
        }
        // 推理循环
        else if (isNumeric(text)) {
            const retVal: int = Number.parseInt(text, 10) as int;
            // * 🚩【2024-04-19 21:08:03】现在无论如何都要运行推理周期
            // if (!running) {
            printInfo("INFO: Running " + retVal + " cycles.");
            this.emit(CyclesStart.class);
            for (let i: int = 0; i < retVal; i++) {
                this.cycle();
            }
            this.emit(CyclesEnd.class);
            // }
            return true;
        } else {
            return false;
        }
    }

    public addInput(text: JavaStringInput): void;

    public addInput(t: Task, time: Timable): Nar;
    public addInput(...args: unknown[]): void | Nar {
        switch (args.length) {
            case 1: {
                const [rawText] = args as [JavaStringInput];
                const inputText = String(rawText).trim();
                let narsese: Parser = new Narsese(this);
                if (inputText.includes("\n") && this.addMultiLineInput(inputText)) {
                    return;
                }
                // Ignore any input that is just a comment
                if (inputText.startsWith("\'") || inputText.startsWith("//") || inputText.length <= 0) {
                    if (inputText.length > 0) {
                        this.emit(OutputHandler.ECHO.class, inputText);
                    }
                    return;
                }
                try {
                    if (this.addCommand(inputText)) {
                        return;
                    }
                } catch (ex) {
                    throw new ReasonerStateError(`I/O command failed: ${inputText}`, { cause: ex });
                }
                let task: Task | null = null;
                try {
                    task = narsese.parseTask(inputText);
                } catch (e) {
                    if (e instanceof Parser.InvalidInputException) {
                        if (Debug.SHOW_INPUT_ERRORS) {
                            this.emit(OutputHandler.ERR.class, e);
                        }
                        if (!Debug.INPUT_ERRORS_CONTINUE) {
                            throw new ReasonerStateError(
                                `Invalid input: ${inputText}`,
                                { cause: e },
                            );
                        }
                        return;
                    } else {
                        throw e;
                    }
                }
                if (task === null) {
                    return;
                }
                // check if it should go to a sensory channel and dispatch to it instead
                if (this.dispatchToSensoryChannel(task)) {
                    return;
                }

                // else input into NARS directly:
                this.memory.inputTask(this, task);


                break;
            }

            case 2: {
                const [t, time] = args as [Task, Timable];


                this.memory.inputTask(this, t);
                return this;


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * dispatches the task to the sensory channel if necessary
     *
     * @param task dispatched task
     * @return was it dispatched to a sensory channel?
     */
    private dispatchToSensoryChannel(task: Task): boolean {
        let t: Term = task.getTerm();
        if (t !== null) {
            let predicate: Term | null = null;
            if (t instanceof Inheritance) {
                predicate = (t as Inheritance).getPredicate();
            } else {
                predicate = SetInt.make(new Term(toNativeJavaString("OBSERVED")));
            }
            if (this.sensoryChannels.containsKey(predicate)) {
                const channel = this.sensoryChannels.get(predicate);
                if (channel === null) {
                    return false;
                }
                // transform to channel-specific coordinate if available.
                let channelWidth: int = channel.width;
                let channelHeight: int = channel.height;
                if (channelWidth !== 0 && channelHeight !== 0 && (t instanceof Inheritance) &&
                    ((t as Inheritance).getSubject() instanceof SetExt)) {
                    let subj: SetExt = (t as Inheritance).getSubject() as SetExt;
                    // map to pei's -1 to 1 indexing schema
                    if (subj.term[0].term_indices === null) {
                        const subjectText = String(subj.name());
                        const openingBracket = subjectText.indexOf("[");
                        const closingBracket = subjectText.lastIndexOf("]");
                        if (openingBracket < 0 || closingBracket <= openingBracket) {
                            throw new ReasonerInputError(
                                `Sensory input is missing coordinates: ${subjectText}`,
                            );
                        }
                        let variable: string = subjectText.slice(0, openingBracket);
                        let vals: string[] = subjectText
                            .slice(openingBracket + 1, closingBracket)
                            .split(",");
                        let height: double = Number.parseFloat(vals[0]);
                        let width: double = Number.parseFloat(vals[1]);
                        let wval: int = Number(Math
                            .round((width + 1.0) / 2.0 * (channel.width - 1))) as int;
                        let hval: int = Number(Math
                            .round(((height + 1.0) / 2.0 * (channel.height - 1)))) as int;
                        let ev: string = task.sentence.isEternal() ? " " : " :|: ";
                        const newInput = `<${variable}[${hval},${wval}]} --> ${predicate.toString()}>${task.sentence.punctuation}${ev}${task.sentence.getTruth().toString()}`;
                        // this.emit(OutputHandler.IN.class, task); too expensive to print each input
                        // task, consider vision :)
                        this.addInput(newInput);
                        return true;
                    }
                }
                channel.addInput(task, this);
                return true;
            }
        }
        return false;
    }

    /**
     * Accept NAL text at the core boundary.
     *
     * File-system access belongs to a host adapter. The one-argument form
     * keeps the old experience-file semantics: empty lines are ignored,
     * metadata other than IN: is ignored, and an IN: creation time advances
     * the deterministic clock before the task is submitted. The inherited
     * two-argument form remains the Java sensory-channel task overload.
     */
    public addInputText(source: JavaStringInput): void;
    public addInputText(text: JavaStringInput, time: Timable): void;
    public addInputText(...args: unknown[]): void {
        if (args.length === 2) {
            super.addInputText(args[0] as JavaStringInput, args[1] as Timable);
            return;
        }
        if (args.length !== 1) {
            throw new ReasonerInputError("Invalid number of arguments");
        }

        const source = String(args[0]);
        for (const rawLine of source.split(/\r?\n/)) {
            if (rawLine.length === 0) continue;
            if (/^[A-Za-z]+:/.test(rawLine)) {
                if (!rawLine.startsWith("IN:")) continue;
                const parts = rawLine.slice(3).split("{");
                const creationTime = Number.parseInt(parts.at(-1)?.split(" :")[0].split("|")[0] ?? "0", 10);
                while (this.time() < creationTime) this.cycles(1);
                this.addInput(parts.slice(0, -1).join("{").trim());
            } else {
                this.addInput(rawLine);
            }
        }
    }

    /** gets a concept if it exists, or returns null if it does not */
    public concept(concept: JavaStringInput): Concept {
        const parsedTerm = new Narsese(this).parseTerm(concept);
        if (parsedTerm === null) {
            throw new ReasonerInputError("Invalid concept term");
        }
        return this.memory.concept(parsedTerm);
    }

    public ask(termString: JavaStringInput, answered: AnswerHandler): Nar {
        const parsedTerm = new Narsese(this).parseTerm(termString);
        if (parsedTerm === null) {
            throw new ReasonerInputError("Invalid question term");
        }
        let sentenceForNewTask: Sentence = new Sentence(
            parsedTerm,
            Symbols.QUESTION_MARK,
            null,
            new Stamp(this, this.memory, Tense.Eternal));
        let budget: BudgetValue = new BudgetValue(
            this.narParameters.DEFAULT_QUESTION_PRIORITY,
            this.narParameters.DEFAULT_QUESTION_DURABILITY,
            1, this.narParameters);
        let t: Task = new Task(sentenceForNewTask, budget, Task.EnumType.INPUT);

        this.addInput(t, this);

        if (answered !== null) {
            answered.start(t, this);
        }
        return this;

    }

    public askNow(termString: JavaStringInput, answered: AnswerHandler): Nar {
        const parsedTerm = new Narsese(this).parseTerm(termString);
        if (parsedTerm === null) {
            throw new ReasonerInputError("Invalid question term");
        }
        let sentenceForNewTask: Sentence = new Sentence(
            parsedTerm,
            Symbols.QUESTION_MARK,
            null,
            new Stamp(this, this.memory, Tense.Present));
        let budgetForNewTask: BudgetValue = new BudgetValue(
            this.narParameters.DEFAULT_QUESTION_PRIORITY,
            this.narParameters.DEFAULT_QUESTION_DURABILITY,
            1, this.narParameters);
        let t: Task = new Task(sentenceForNewTask, budgetForNewTask, Task.EnumType.INPUT);

        this.addInput(t, this);

        if (answered !== null) {
            answered.start(t, this);
        }
        return this;

    }

    /** attach event handler */
    public on(c: ClassTokenLike, o: EventObserver): void {
        this.memory.event.on(c, o);
    }

    /** remove event handler */
    public off(c: ClassTokenLike, o: EventObserver): void {
        this.memory.event.off(c, o);
    }

    /** set an event handler. useful for multiple events. */
    public event(e: EventObserver, enabled: boolean, ...events: ClassTokenLike[]): void {
        this.memory.event.set(e, enabled, ...events);
    }

    public addPlugin(p: Plugin): void {
        if (p instanceof SensoryChannel) {
            this.addSensoryChannel((p as SensoryChannel).getName(), p as SensoryChannel);
        } else if (p instanceof Operator) {
            this.memory.addOperator(p as Operator);
        } else if (p instanceof Emotions) {
            this.memory.emotion = p as Emotions;
        } else if (p instanceof InternalExperience) {
            this.memory.internalExperience = p as InternalExperience;
        }
        let ps: Nar.PluginState = new this.PluginState(p);
        this.plugins.push(ps);
        this.emit(Events.PluginsChange.class, p, null);
    }

    public removePlugin(ps: Nar.PluginState): void {
        const pluginIndex = this.plugins.indexOf(ps);
        if (pluginIndex >= 0) {
            this.plugins.splice(pluginIndex, 1);
            let p: Plugin = ps.plugin;
            if (p instanceof Operator) {
                this.memory.removeOperator(p as Operator);
            }
            if (p instanceof SensoryChannel) {
                const sensoryTerm = new Narsese(this).parseTerm(p.getName());
                if (sensoryTerm !== null) {
                    this.sensoryChannels.remove(sensoryTerm);
                }
            }
            // TODO sensory channels can be plugins
            ps.setEnabled(false);
        this.emit(Events.PluginsChange.class, null, p);
        }
    }

    public getPlugins(): NativeReadOnlyList<Nar.PluginState> {
        return new NativeReadOnlyList(this.plugins);
    }

    public start(): void;

    public start(minCyclePeriodMS: long): void;
    public start(...args: unknown[]): void {
        switch (args.length) {
            case 0: {

                this.start(this.narParameters.MILLISECONDS_PER_STEP as unknown as long);


                break;
            }

            case 1: {
                const [minCyclePeriodMS] = args as [long];


                this.minCyclePeriodMS = minCyclePeriodMS;
                if (this.threads === null) {
                    let n_threads: int = this.narParameters.THREADS_AMOUNT;
                    this.threads = new Array<ThreadCompat>(n_threads);
                    for (let i: int = 0; i < n_threads; i++) {
                        this.threads[i] = new ThreadCompat(this, "Inference" + i);
                        this.threads[i].start();
                    }
                }
                this.running = true;


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * Stop the inference process, killing its thread.
     */
    public stop(): void {
        if (this.threads !== null) {
            for (let thread of this.threads) {
                thread.interrupt();
            }
            this.threads = null;
        }
        this.stopped = true;
        this.running = false;
    }

    /** Execute a fixed number of cycles. */
    public cycles(cycles: int): void {
        this.memory.allowExecution = true;
        this.emit(CyclesStart.class);
        let wasRunning: boolean = this.running;
        this.running = true;
        this.stopped = false;
        for (let i: int = 0; i < cycles; i++) {
            this.cycle();
        }
        this.running = wasRunning;
        this.emit(CyclesEnd.class);
    }

    /** Main loop executed by the Thread. Should not be called directly. */
    public run(): void {
        this.stopped = false;

        while (this.running && !this.stopped) {
            // * 🚩【2024-04-19 21:26:19】现在在「循环周期小于0」的时候跳过（但不停止循环）
            if (this.minCyclePeriodMS < 0n)
                continue;
            this.emit(CyclesStart.class);
            this.cycle();
            this.emit(CyclesEnd.class);

            if (this.minCyclePeriodMS > 0n) {
                try {
                    ThreadCompat.sleep(this.minCyclePeriodMS);
                } catch (e) {
                    if (e instanceof InterruptedExceptionCompat) {
                    } else {
                        throw e;
                    }
                }
            } else if (this.threadYield) {
                ThreadCompat.yield();
            }
        }
    }

    public emit(c: ClassTokenLike, ...o: EventEmitter.EventPayload): void {
        this.memory.event.emit(c, ...o);
    }

    /**
     * A frame, consisting of one or more Nar memory cycles
     */
    public cycle(): void {
        try {
            this.memory.cycle(this);
            // * 📌20250826000546预期：Shell启动后输入simpleOperationTest.nal，一定会在43377步左右执行操作
            // * 🚩断点：reportExecution(operation, args, feedback, memory);

            /* synchronized (cycle) { */
            this.cycleCounter++;
            /* } */
        } catch (e) {
            if (e instanceof Error) {
                if (Debug.SHOW_REASONING_ERRORS) {
                    this.emit(OutputHandler.ERR.class, e);
                }
                if (!Debug.REASONING_ERRORS_CONTINUE) {
                    throw new ReasonerStateError("Reasoning error", { cause: e });
                }
            } else {
                throw e;
            }
        }
    }

    public toString(): string {
        return String(this.memory.toString());
    }

    public time(): long {
        if (this.narParameters.STEPS_CLOCK) {
            return this.cycleCounter;
        } else {
            return (this.currentTimeMillis ?? defaultCurrentTimeMillis)();
        }
    }

    public isRunning(): boolean {
        return this.running;
    }

    public getMinCyclePeriodMS(): long {
        return this.minCyclePeriodMS;
    }

    private static randomId(): long {
        // jree does not expose java.util.UUID. A process-local numeric id is
        // sufficient here; persisted/inter-process identity is handled by the
        // explicit narId overload.
        return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) as long;
    }

    /**
     * When b is true, Nar will call Thread.yield each run() iteration that
     * minCyclePeriodMS==0 (no delay).
     * This is for improving program responsiveness when Nar is run with no delay.
     */
    public setThreadYield(b: boolean): void {
        this.threadYield = b;
    }

    /**
     * overrides parameter values by name
     *
     * @param parameters (overwritten) parameters of a Reasoner
     * @param overrides  specific override values by parameter name
     */
    private static overrideParameters(parameters: Parameters, overrides: NativeMap<string, unknown>): void {
        for (let iOverride of overrides.entrySet()) {
            const propertyName = String(iOverride.getKey());
            const value: unknown = iOverride.getValue();

            const key = propertyName;
            const parameterRecord = parameters as unknown as Record<string, unknown>;
            if (key in parameterRecord) {
                parameterRecord[key] = value;
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Nar {
    export type PluginState = InstanceType<Nar["PluginState"]>;
}
