//! Java source: opennars/main/Nar.java
import { readFileSync } from "node:fs";
import { java, type long, JavaObject, S, type int, type double, type float, closeResources, handleResourceError, throwResourceError } from "jree";
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
import { Task } from "../entity/Task.ts";
import type { Plugin } from "../plugin/Plugin.ts";
import type { Reasoner } from "../interfaces/pub/Reasoner.ts";
import type { Timable } from "../interfaces/Timable.ts";

const isNumeric = (value: unknown): boolean => /^[-+]?\d+(?:\.\d+)?$/.test(String(value).trim());
const CyclesStart = Events.CyclesStart;
const CyclesEnd = Events.CyclesEnd;
const printInfo = (message: unknown): void => {
    if (typeof process === "undefined" || process.release?.name !== "node") {
        java.lang.System.out.println(message);
    }
};



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
export class Nar extends SensoryChannel implements Reasoner, java.lang.Runnable {
    public narParameters: Parameters = new Parameters();

    /*
     * System clock, relatively defined to guarantee the repeatability of behaviors
     */
    private cycleCounter: long = 0;

    /**
     * The information about the version of the project
     */
    public static readonly VERSION: java.lang.String = "v3.0.4";

    /**
     * Name of the reasoner of the project
     */
    public static readonly NAME: java.lang.String = "Open-NARS";

    /**
     * The project web sites.
     */
    public static readonly WEBSITE: java.lang.String = " Open-NARS website:  http://code.google.com/p/open-org.opennars/ \n"
        + "      NARS website:  http://sites.google.com/site/narswang/ \n" +
        "    Github website:  http://github.com/opennars/ \n" +
        "    IRC:  http://webchat.freenode.net/?channels=org.opennars \n";

    private threads: java.lang.Thread[] = null;
    protected sensoryChannels: java.util.Map<Term, SensoryChannel> = new java.util.LinkedHashMap();

    public addSensoryChannel(term: java.lang.String, channel: SensoryChannel): void {
        try {
            this.sensoryChannels.put(new Narsese(this).parseTerm(term), channel);
        } catch (ex) {
            if (ex instanceof Parser.InvalidInputException) {
                java.lang.System.Logger.getLogger(Nar.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                throw new java.lang.IllegalStateException("Could not add sensory channel.", ex);
            } else {
                throw ex;
            }
        }
    }

    public SaveToFile(name: java.lang.String): void {
        let outStream: java.io.FileOutputStream = new java.io.FileOutputStream(name);
        let stream: java.io.ObjectOutputStream = new java.io.ObjectOutputStream(outStream);
        stream.writeObject(this);
        outStream.close();
    }

    public static LoadFromFile(name: java.lang.String): Nar {
        let inStream: java.io.FileInputStream = new java.io.FileInputStream(name);
        let stream: java.io.ObjectInputStream = new java.io.ObjectInputStream(inStream);
        let ret: Nar = stream.readObject() as Nar;
        ret.memory.event = new EventEmitter();
        ret.plugins = new java.util.ArrayList();
        ret.sensoryChannels = new java.util.LinkedHashMap();
        let pluginsToAdd: java.util.List<Plugin> = ConfigReader.loadParamsFromFileAndReturnPlugins(ret.usedConfigFilePath, ret,
            ret.narParameters);
        for (let p of pluginsToAdd) {
            ret.addPlugin(p);
        }
        stream.close();
        return ret;
    }

    protected minCyclePeriodMS: long;

    /**
     * The name of the reasoner
     */
    protected name: java.lang.String;
    /**
     * The memory of the reasoner
     */
    public readonly memory: Memory;

    public PluginState = (($outer) => {
        return class PluginState extends JavaObject implements java.io.Serializable {
            public readonly plugin: Plugin;
            protected enabled: boolean = false;

            public constructor(plugin: Plugin);

            public constructor(plugin: Plugin, enabled: boolean);
            public constructor(...args: unknown[]) {
                if (args.length === 1 || args.length === 2) {
                    const plugin = args[0] as Plugin;
                    const enabled = args.length === 2 ? args[1] as boolean : true;
                    super();
                    this.plugin = plugin;
                    this.setEnabled(enabled);
                } else {
                    throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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


    protected plugins: java.util.List<Nar.PluginState> = new java.util.ArrayList(); // was CopyOnWriteArrayList

    /** Flag for running continuously */
    private running: boolean = false;
    /** used by stop() to signal that a running loop should be interrupted */
    private stopped: boolean = false;
    private threadYield: boolean;

    public static readonly DEFAULTCONFIG_FILEPATH: java.lang.String = "./config/defaultConfig.xml";

    /**
     * constructs the NAR and loads a config from the default filepath
     *
     * Assigns a random id to the instance
     */
    public constructor();

    /**
     * constructs the NAR and loads a config from the default filepath
     *
     * @param narId inter NARS id of this NARS instance
     */
    public constructor(narId: long);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     */
    public constructor(relativeConfigFilePath: java.lang.String);

    /**
     * constructs the NAR and loads a config from the default filepath
     *
     * Assigns a random id to the instance
     *
     * @param parameterOverrides (overwritten) parameters of a Reasoner
     */
    public constructor(parameterOverrides: java.util.Map<java.lang.String, java.lang.Object>);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param narId                  inter NARS id of this NARS instance
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     */
    public constructor(narId: long, relativeConfigFilePath: java.lang.String);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     * @param parameterOverrides     (overwritten) parameters of a Reasoner
     */
    public constructor(relativeConfigFilePath: java.lang.String, parameterOverrides: java.util.Map<java.lang.String, java.lang.Object>);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param narId                  inter NARS id of this NARS instance
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     * @param parameterOverrides     (overwritten) parameters of a Reasoner
     */
    public constructor(narId: long, relativeConfigFilePath: java.lang.String, parameterOverrides: java.util.Map<java.lang.String, java.lang.Object>);
    public constructor(...args: unknown[]) {
        // Java constructor delegation (`this(...)`) is not legal in
        // TypeScript. Resolve all overloads before the one and only `super()`.
        let narId: long = Nar.randomId();
        let relativeConfigFilePath: java.lang.String = Nar.DEFAULTCONFIG_FILEPATH;
        let parameterOverrides: java.util.Map<java.lang.String, java.lang.Object> = null;

        if (args.length === 0) {
            // defaults above
        } else if (args.length === 1) {
            const value = args[0];
            if (typeof value === "number" || typeof value === "bigint" || value instanceof java.lang.Number) {
                narId = typeof value === "number" || typeof value === "bigint"
                    ? value as long
                    : (value as java.lang.Number).longValue();
            } else if (value !== null && typeof (value as java.lang.Object).toString === "function") {
                relativeConfigFilePath = value as java.lang.String;
            } else {
                parameterOverrides = value as java.util.Map<java.lang.String, java.lang.Object>;
            }
        } else if (args.length === 2) {
            if (typeof args[0] === "number" || typeof args[0] === "bigint" || args[0] instanceof java.lang.Number) {
                narId = typeof args[0] === "number" || typeof args[0] === "bigint"
                    ? args[0] as long
                    : (args[0] as java.lang.Number).longValue();
                relativeConfigFilePath = args[1] as java.lang.String;
            } else {
                relativeConfigFilePath = args[0] as java.lang.String;
                parameterOverrides = args[1] as java.util.Map<java.lang.String, java.lang.Object>;
            }
        } else if (args.length === 3) {
            narId = typeof args[0] === "number" || typeof args[0] === "bigint"
                ? args[0] as long
                : (args[0] as java.lang.Number).longValue();
            relativeConfigFilePath = args[1] as java.lang.String;
            parameterOverrides = args[2] as java.util.Map<java.lang.String, java.lang.Object>;
        } else {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        super();
        let pluginsToAdd: java.util.List<Plugin> = ConfigReader.loadParamsFromFileAndReturnPlugins(relativeConfigFilePath, this,
            this.narParameters);
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
        this.usedConfigFilePath = relativeConfigFilePath;
        for (let p of pluginsToAdd) { // adding after memory is constructed, as memory depends on the loaded params!!
            this.addPlugin(p);
        }
    }


    public usedConfigFilePath: java.lang.String = "";

    /**
     * Reset the system with an empty memory and reset clock. Called locally.
     */
    public reset(): void {
        this.cycleCounter = 0 as long;
        this.memory.reset();
    }

    /**
     * Generally the text will consist of Task's to be parsed in Narsese, but
     * may contain other commands recognized by the system. The creationTime
     * will be set to the current memory cycle time, but may be processed by
     * memory later according to the length of the input queue.
     */
    private addMultiLineInput(text: java.lang.String): boolean {
        let lines: java.lang.String[] = text.split("\n");
        for (let s of lines) {
            this.addInput(s);
            if (!this.running) {
                this.cycle();
            }
        }
        return true;
    }

    private addCommand(text: java.lang.String): boolean {
        // 重置
        if (text.startsWith("**") || text.startsWith("*reset")) {
            this.reset();
            return true;
        } // 决策阈值
        else if (text.startsWith("*decisionthreshold=")) { // TODO use reflection for narParameters, allow to set
            // others too
            let value: java.lang.Double = java.lang.Double.valueOf(text.split("decisionthreshold=")[1]);
            this.narParameters.DECISION_THRESHOLD = Float32Math.from(value.floatValue()) as float;
            return true;
        } // 音量
        else if (text.startsWith("*volume=")) {
            let value: java.lang.Integer = java.lang.Integer.valueOf(text.split("volume=")[1]);
            this.narParameters.VOLUME = value;
            return true;
        } // 线程数
        else if (text.startsWith("*threads=")) {
            let value: java.lang.Integer = java.lang.Integer.valueOf(text.split("threads=")[1]);
            this.narParameters.THREADS_AMOUNT = value;
            return true;
        } // 保存
        else if (text.startsWith("*save=")) {
            let filename: java.lang.String = text.split("save=")[1];
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
            let split: java.lang.String[] = text.split("speed");
            let stripped: java.lang.String = split.length > 1 ? split[1] : "";
            // 若带等号⇒修改
            if (stripped.startsWith("=")) {
                let value: java.lang.Long = java.lang.Long.valueOf(stripped.split("=")[1]);
                this.minCyclePeriodMS = value;
            }
            // 总是打印信息
            if (this.minCyclePeriodMS > 0)
                printInfo("INFO: Running at " + this.minCyclePeriodMS + "ms per cycle.");
            else if (this.minCyclePeriodMS === 0)
                printInfo("INFO: Running at full speed.");
            else
                printInfo("INFO: Auto-cycling off.");
            return true;
        }
        // 设置运行速度（负数为关闭）
        else if (text.startsWith("*speed=")) {
            let value: java.lang.Integer = java.lang.Integer.valueOf(text.split("speed=")[1]);
            this.minCyclePeriodMS = value;
            return true;
        }
        // 推理循环
        else if (isNumeric(text)) {
            let retVal: java.lang.Integer = java.lang.Integer.parseInt(text);
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

    public addInput(text: java.lang.String): void;

    public addInput(t: Task, time: Timable): Nar;
    public addInput(...args: unknown[]): void | Nar {
        switch (args.length) {
            case 1: {
                const [rawText] = args as [java.lang.String];
                const inputText = String(rawText).trim();
                let narsese: Parser = new Narsese(this);
                if (inputText.includes("\n") && this.addMultiLineInput(new java.lang.String(inputText))) {
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
                    if (this.addCommand(inputText as unknown as java.lang.String)) {
                        return;
                    }
                } catch (ex) {
                    if (ex instanceof java.io.IOException) {
                        throw new java.lang.IllegalStateException("I/O command failed: " + inputText, ex);
                    } else {
                        throw ex;
                    }
                }
                let task: Task = null;
                try {
                    task = narsese.parseTask(new java.lang.String(inputText));
                } catch (e) {
                    if (e instanceof Parser.InvalidInputException) {
                        if (Debug.SHOW_INPUT_ERRORS) {
                            this.emit(OutputHandler.ERR.class, e);
                        }
                        if (!Debug.INPUT_ERRORS_CONTINUE) {
                            throw new java.lang.IllegalStateException("Invalid input: " + inputText, e);
                        }
                        return;
                    } else {
                        throw e;
                    }
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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
            let predicate: Term = null;
            if (t instanceof Inheritance) {
                predicate = (t as Inheritance).getPredicate();
            } else {
                predicate = SetInt.make(new Term("OBSERVED"));
            }
            if (this.sensoryChannels.containsKey(predicate)) {
                // transform to channel-specific coordinate if available.
                let channelWidth: int = this.sensoryChannels.get(predicate).width;
                let channelHeight: int = this.sensoryChannels.get(predicate).height;
                if (channelWidth !== 0 && channelHeight !== 0 && (t instanceof Inheritance) &&
                    ((t as Inheritance).getSubject() instanceof SetExt)) {
                    let subj: SetExt = (t as Inheritance).getSubject() as SetExt;
                    // map to pei's -1 to 1 indexing schema
                    if (subj.term[0].term_indices === null) {
                        let variable: java.lang.String = subj.toString().split("\\[")[0];
                        let vals: java.lang.String[] = subj.toString().split("\\[")[1].split("\\]")[0].split(",");
                        let height: double = java.lang.Double.parseDouble(vals[0]);
                        let width: double = java.lang.Double.parseDouble(vals[1]);
                        let wval: int = java.lang.Math
                            .round((width + 1.0) / 2.0 * (this.sensoryChannels.get(predicate).width - 1)) as int;
                        let hval: int = java.lang.Math
                            .round(((height + 1.0) / 2.0 * (this.sensoryChannels.get(predicate).height - 1))) as int;
                        let ev: java.lang.String = task.sentence.isEternal() ? " " : " :|: ";
                        let newInput: java.lang.String = "<" + variable + "[" + hval + "," + wval + "]} --> " + predicate + ">" +
                            task.sentence.punctuation + ev + task.sentence.truth.toString();
                        // this.emit(OutputHandler.IN.class, task); too expensive to print each input
                        // task, consider vision :)
                        this.addInput(newInput);
                        return true;
                    }
                }
                this.sensoryChannels.get(predicate).addInput(task, this);
                return true;
            }
        }
        return false;
    }

    public addInputFile(s: java.lang.String): void {
        // jree's FileReader currently calls an uninitialized Charset.defaultCharset
        // field in Node. Keep the Java path below for translated runtimes, while
        // using the native UTF-8 boundary in the Node CLI and test runners.
        if (typeof process !== "undefined" && process.release?.name === "node") {
            const source = readFileSync(String(s), "utf8");
            for (const rawLine of source.split(/\r?\n/)) {
                if (rawLine.length === 0) continue;
                if (/^[A-Za-z]+:/.test(rawLine)) {
                    if (!rawLine.startsWith("IN:")) continue;
                    const parts = rawLine.slice(3).split("{");
                    const creationTime = Number.parseInt(parts.at(-1)?.split(" :")[0].split("|")[0] ?? "0", 10);
                    while (this.time() < creationTime) this.cycles(1);
                    this.addInput(new java.lang.String(parts.slice(0, -1).join("{").trim()));
                } else {
                    this.addInput(new java.lang.String(rawLine));
                }
            }
            return;
        }
        try {
            // This holds the final error to throw (if any).
            let error: java.lang.Throwable | undefined;

            const br: java.io.BufferedReader = new java.io.BufferedReader(new java.io.FileReader(s))
            try {
                try {
                    let line: java.lang.String;
                    while ((line = br.readLine()) !== null) {
                        if (!line.isEmpty()) {
                            // Loading experience file lines, or else just normal input lines
                            if (line.matches("([A-Za-z])+:(.*)")) {
                                // Extract creation time:
                                if (!line.startsWith("IN:")) {
                                    continue; // ignore
                                }
                                let spl: java.lang.String[] = line.replace("IN:", "").split("\\{");
                                let creationTime: int = java.lang.Integer.parseInt(spl[spl.length - 1].split(" :")[0].split("\\|")[0]);
                                while (this.time() < creationTime) {
                                    this.cycles(1);
                                }
                                let lineReconstructed: java.lang.String = ""; // the line but without the stamp info at the end
                                for (let i: int = 0; i < spl.length - 1; i++) {
                                    lineReconstructed += spl[i] + "{";
                                }
                                lineReconstructed = lineReconstructed.substring(0, lineReconstructed.length() - 1);
                                this.addInput(lineReconstructed.trim());
                            } else {
                                this.addInput(line);
                            }
                        }
                    }
                }
                finally {
                    error = closeResources([br]);
                }
            } catch (e) {
                error = handleResourceError(e, error);
            } finally {
                throwResourceError(error);
            }
        }
        catch (ex) {
            if (ex instanceof java.lang.Exception) {
                java.lang.System.Logger.getLogger(Nar.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                throw new java.lang.IllegalStateException("Loading experience file failed ", ex);
            } else {
                throw ex;
            }
        }
    }

    /** gets a concept if it exists, or returns null if it does not */
    public concept(concept: java.lang.String): Concept {
        return this.memory.concept(new Narsese(this).parseTerm(concept));
    }

    public ask(termString: java.lang.String, answered: AnswerHandler): Nar {
        let sentenceForNewTask: Sentence = new Sentence(
            new Narsese(this).parseTerm(termString),
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

    public askNow(termString: java.lang.String, answered: AnswerHandler): Nar {
        let sentenceForNewTask: Sentence = new Sentence(
            new Narsese(this).parseTerm(termString),
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
    public on(c: java.lang.Class<unknown>, o: EventObserver): void {
        this.memory.event.on(c, o);
    }

    /** remove event handler */
    public off(c: java.lang.Class<unknown>, o: EventObserver): void {
        this.memory.event.off(c, o);
    }

    /** set an event handler. useful for multiple events. */
    public event(e: EventObserver, enabled: boolean, ...events: java.lang.Class<unknown>[]): void {
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
        this.plugins.add(ps);
        this.emit(Events.PluginsChange.class, p, null);
    }

    public removePlugin(ps: Nar.PluginState): void {
        if (this.plugins.remove(ps)) {
            let p: Plugin = ps.plugin;
            if (p instanceof Operator) {
                this.memory.removeOperator(p as Operator);
            }
            if (p instanceof SensoryChannel) {
                this.sensoryChannels.remove(p as java.lang.Object);
            }
            // TODO sensory channels can be plugins
            ps.setEnabled(false);
            this.emit(Events.PluginsChange.class, null, p);
        }
    }

    public getPlugins(): java.util.List<Nar.PluginState> {
        return java.util.Collections.unmodifiableList(this.plugins);
    }

    public start(): void;

    public start(minCyclePeriodMS: long): void;
    public start(...args: unknown[]): void {
        switch (args.length) {
            case 0: {

                this.start(this.narParameters.MILLISECONDS_PER_STEP);


                break;
            }

            case 1: {
                const [minCyclePeriodMS] = args as [long];


                this.minCyclePeriodMS = minCyclePeriodMS;
                if (this.threads === null) {
                    let n_threads: int = this.narParameters.THREADS_AMOUNT;
                    this.threads = new Array<java.lang.Thread>(n_threads);
                    for (let i: int = 0; i < n_threads; i++) {
                        this.threads[i] = new java.lang.Thread(this, "Inference" + i);
                        this.threads[i].start();
                    }
                }
                this.running = true;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
            if (this.minCyclePeriodMS < 0)
                continue;
            this.emit(CyclesStart.class);
            this.cycle();
            this.emit(CyclesEnd.class);

            if (this.minCyclePeriodMS > 0) {
                try {
                    java.lang.Thread.sleep(this.minCyclePeriodMS);
                } catch (e) {
                    if (e instanceof java.lang.InterruptedException) {
                    } else {
                        throw e;
                    }
                }
            } else if (this.threadYield) {
                java.lang.Thread.yield();
            }
        }
    }

    public emit(c: java.lang.Class<unknown>, ...o: java.lang.Object[]): void {
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
            if (e instanceof java.lang.Exception) {
                if (Debug.SHOW_REASONING_ERRORS) {
                    this.emit(OutputHandler.ERR.class, e);
                }
                e.printStackTrace();
                if (!Debug.REASONING_ERRORS_CONTINUE) {
                    throw new java.lang.IllegalStateException("Reasoning error:\n", e);
                }
            } else {
                throw e;
            }
        }
    }

    public toString(): java.lang.String {
        return this.memory.toString();
    }

    public time(): long {
        if (this.narParameters.STEPS_CLOCK) {
            return this.cycleCounter;
        } else {
            return java.lang.System.currentTimeMillis();
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
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) as long;
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
    private static overrideParameters(parameters: Parameters, overrides: java.util.Map<java.lang.String, java.lang.Object>): void {
        for (let iOverride of overrides.entrySet()) {
            let propertyName: java.lang.String = iOverride.getKey();
            let value: java.lang.Object = iOverride.getValue();

            try {
                let fieldOfProperty: java.lang.reflect.Field = Parameters.class.getField(propertyName);
                fieldOfProperty.set(parameters, value);
            } catch (e) {
                if (e instanceof java.lang.NoSuchFieldException) {
                    // ignore
                } else if (e instanceof java.lang.IllegalAccessException) {
                    // ignore
                } else {
                    throw e;
                }
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Nar {
    export type PluginState = InstanceType<Nar["PluginState"]>;
}


