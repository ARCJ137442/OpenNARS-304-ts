


import { java, type long, JavaObject, S, type int, type double, closeResources, handleResourceError, throwResourceError } from "jree";



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
    public narParameters: java.security.Policy.Parameters | null = new java.security.Policy.Parameters();

    /*
     * System clock, relatively defined to guarantee the repeatability of behaviors
     */
    private cycle: java.lang.Long | null = new java.lang.Long(0);

    /**
     * The information about the version of the project
     */
    public static readonly VERSION: java.lang.String | null = "v3.0.4";

    /**
     * Name of the reasoner of the project
     */
    public static readonly NAME: java.lang.String | null = "Open-NARS";

    /**
     * The project web sites.
     */
    public static readonly WEBSITE: java.lang.String | null = " Open-NARS website:  http://code.google.com/p/open-org.opennars/ \n"
        + "      NARS website:  http://sites.google.com/site/narswang/ \n" +
        "    Github website:  http://github.com/opennars/ \n" +
        "    IRC:  http://webchat.freenode.net/?channels=org.opennars \n";

    private threads: java.lang.Thread[] | null = null;
    protected sensoryChannels: java.util.Map<Term, SensoryChannel> | null = new java.util.LinkedHashMap();

    public addSensoryChannel(/* final */  term: java.lang.String | null, /* final */  channel: SensoryChannel | null): void {
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

    public SaveToFile(/* final */  name: java.lang.String | null): void {
        let outStream: java.io.FileOutputStream = new java.io.FileOutputStream(name);
        let stream: java.io.ObjectOutputStream = new java.io.ObjectOutputStream(outStream);
        stream.writeObject(this);
        outStream.close();
    }

    public static LoadFromFile(/* final */  name: java.lang.String | null): Nar | null {
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
    protected name: java.lang.String | null;
    /**
     * The memory of the reasoner
     */
    public readonly memory: Memory | null;

    public PluginState = (($outer) => {
        return class PluginState extends JavaObject implements java.io.Serializable {
            public readonly plugin: Plugin | null;
            protected enabled: boolean = false;

            public constructor(/* final */  plugin: Plugin | null);

            public constructor(/* final */  plugin: Plugin | null, /* final */  enabled: boolean);
            public constructor(...args: unknown[]) {
                switch (args.length) {
                    case 1: {
                        const [plugin] = args as [Plugin];


                        this(plugin, true);


                        break;
                    }

                    case 2: {
                        const [plugin, enabled] = args as [Plugin, boolean];


                        super();
                        this.plugin = plugin;
                        this.setEnabled(enabled);


                        break;
                    }

                    default: {
                        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
                    }
                }
            }


            public setEnabled(/* final */  enabled: boolean): void {
                if (this.enabled === enabled)
                    return;

                this.plugin.setEnabled(Nar.this, enabled);
                this.enabled = enabled;
                $outer.emit(Events.PluginsChange.class, this.plugin, enabled);
            }

            public isEnabled(): boolean {
                return this.enabled;
            }
        }
    })(this);


    protected plugins: java.util.List<Nar.PluginState> | null = new java.util.ArrayList(); // was CopyOnWriteArrayList

    /** Flag for running continuously */
    private running: boolean = false;
    /** used by stop() to signal that a running loop should be interrupted */
    private stopped: boolean = false;
    private threadYield: boolean;

    public static readonly DEFAULTCONFIG_FILEPATH: java.lang.String | null = "./config/defaultConfig.xml";

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
    public constructor(relativeConfigFilePath: java.lang.String | null);

    /**
     * constructs the NAR and loads a config from the default filepath
     *
     * Assigns a random id to the instance
     *
     * @param parameterOverrides (overwritten) parameters of a Reasoner
     */
    public constructor(/* final */  parameterOverrides: java.util.Map<java.lang.String, java.lang.Object> | null);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param narId                  inter NARS id of this NARS instance
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     */
    public constructor(narId: long, relativeConfigFilePath: java.lang.String | null);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     * @param parameterOverrides     (overwritten) parameters of a Reasoner
     */
    public constructor(relativeConfigFilePath: java.lang.String | null, /* final */  parameterOverrides: java.util.Map<java.lang.String, java.lang.Object> | null);

    /**
     * constructs the NAR and loads a config from the filepath
     *
     * @param narId                  inter NARS id of this NARS instance
     * @param relativeConfigFilePath (relative) path of the XML encoded config file
     * @param parameterOverrides     (overwritten) parameters of a Reasoner
     */
    public constructor(narId: long, relativeConfigFilePath: java.lang.String | null, /* final */  parameterOverrides: java.util.Map<java.lang.String, java.lang.Object> | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                this(Nar.DEFAULTCONFIG_FILEPATH);


                break;
            }

            case 1: {
                const [narId] = args as [long];


                this(narId, Nar.DEFAULTCONFIG_FILEPATH);


                break;
            }

            case 1: {
                const [relativeConfigFilePath] = args as [java.lang.String];


                this(java.util.UUID.randomUUID().getLeastSignificantBits(), relativeConfigFilePath);


                break;
            }

            case 1: {
                const [parameterOverrides] = args as [java.util.Map<java.lang.String, java.lang.Object>];


                this(Nar.DEFAULTCONFIG_FILEPATH, parameterOverrides);


                break;
            }

            case 2: {
                const [narId, relativeConfigFilePath] = args as [long, java.lang.String];


                super();
                let pluginsToAdd: java.util.List<Plugin> = ConfigReader.loadParamsFromFileAndReturnPlugins(relativeConfigFilePath, this,
                    this.narParameters);
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


                break;
            }

            case 2: {
                const [relativeConfigFilePath, parameterOverrides] = args as [java.lang.String, java.util.Map<java.lang.String, java.lang.Object>];


                this(java.util.UUID.randomUUID().getLeastSignificantBits(), relativeConfigFilePath, parameterOverrides);


                break;
            }

            case 3: {
                const [narId, relativeConfigFilePath, parameterOverrides] = args as [long, java.lang.String, java.util.Map<java.lang.String, java.lang.Object>];


                super();
                let pluginsToAdd: java.util.List<Plugin> = ConfigReader.loadParamsFromFileAndReturnPlugins(relativeConfigFilePath, this,
                    this.narParameters);
                Nar.overrideParameters(this.narParameters, parameterOverrides);
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



                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public usedConfigFilePath: java.lang.String | null = "";

    /**
     * Reset the system with an empty memory and reset clock. Called locally.
     */
    public reset(): void {
        this.cycle = 0 as long;
        this.memory.reset();
    }

    /**
     * Generally the text will consist of Task's to be parsed in Narsese, but
     * may contain other commands recognized by the system. The creationTime
     * will be set to the current memory cycle time, but may be processed by
     * memory later according to the length of the input queue.
     */
    private addMultiLineInput(/* final */  text: java.lang.String | null): boolean {
        let lines: java.lang.String[] = text.split("\n");
        for (let s of lines) {
            this.addInput(s);
            if (!this.running) {
                this.cycle();
            }
        }
        return true;
    }

    private addCommand(/* final */  text: java.lang.String | null): boolean {
        // 重置
        if (text.startsWith("**") || text.startsWith("*reset")) {
            this.reset();
            return true;
        } // 决策阈值
        else if (text.startsWith("*decisionthreshold=")) { // TODO use reflection for narParameters, allow to set
            // others too
            let value: java.lang.Double = java.lang.Double.valueOf(text.split("decisionthreshold=")[1]);
            this.narParameters.DECISION_THRESHOLD = value.floatValue();
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
                java.lang.System.out.println("INFO: Running at " + this.minCyclePeriodMS + "ms per cycle.");
            else if (this.minCyclePeriodMS === 0)
                java.lang.System.out.println("INFO: Running at full speed.");
            else
                java.lang.System.out.println("INFO: Auto-cycling off.");
            return true;
        }
        // 设置运行速度（负数为关闭）
        else if (text.startsWith("*speed=")) {
            let value: java.lang.Integer = java.lang.Integer.valueOf(text.split("speed=")[1]);
            this.minCyclePeriodMS = value;
            return true;
        }
        // 推理循环
        else if (StringUtils.isNumeric(text)) {
            let retVal: java.lang.Integer = java.lang.Integer.parseInt(text);
            // * 🚩【2024-04-19 21:08:03】现在无论如何都要运行推理周期
            // if (!running) {
            java.lang.System.out.println("INFO: Running " + retVal + " cycles.");
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

    public addInput(text: java.lang.String | null): void;

    public addInput(/* final */  t: Task | null, /* final */  time: Timable | null): Nar | null;
    public addInput(...args: unknown[]): void | Nar | null {
        switch (args.length) {
            case 1: {
                const [text] = args as [java.lang.String];


                text = text.trim();
                let narsese: Parser = new Narsese(this);
                if (text.contains("\n") && this.addMultiLineInput(text)) {
                    return;
                }
                // Ignore any input that is just a comment
                if (text.startsWith("\'") || text.startsWith("//") || text.trim().length() <= 0) {
                    if (text.trim().length() > 0) {
                        this.emit(org.opennars.io.events.OutputHandler.ECHO.class, text);
                    }
                    return;
                }
                try {
                    if (this.addCommand(text)) {
                        return;
                    }
                } catch (ex) {
                    if (ex instanceof java.io.IOException) {
                        throw new java.lang.IllegalStateException("I/O command failed: " + text, ex);
                    } else {
                        throw ex;
                    }
                }
                let task: Task = null;
                try {
                    task = narsese.parseTask(text);
                } catch (e) {
                    if (e instanceof Parser.InvalidInputException) {
                        if (Debug.SHOW_INPUT_ERRORS) {
                            this.emit(ERR.class, e);
                        }
                        if (!Debug.INPUT_ERRORS_CONTINUE) {
                            throw new java.lang.IllegalStateException("Invalid input: " + text, e);
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
    private dispatchToSensoryChannel(task: Task | null): boolean {
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

    public addInputFile(/* final */  s: java.lang.String | null): void {
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
    public concept(/* final */  concept: java.lang.String | null): Concept | null {
        return this.memory.concept(new Narsese(this).parseTerm(concept));
    }

    public ask(/* final */  termString: java.lang.String | null, /* final */  answered: AnswerHandler | null): Nar | null {
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

    public askNow(/* final */  termString: java.lang.String | null, /* final */  answered: AnswerHandler | null): Nar | null {
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
    public on(/* final */  c: java.lang.Class<unknown> | null, /* final */  o: EventObserver | null): void {
        this.memory.event.on(c, o);
    }

    /** remove event handler */
    public off(/* final */  c: java.lang.Class<unknown> | null, /* final */  o: EventObserver | null): void {
        this.memory.event.off(c, o);
    }

    /** set an event handler. useful for multiple events. */
    public event(/* final */  e: EventObserver | null, /* final */  enabled: boolean, /* final */ ...events: java.lang.Class<unknown> | null[]): void {
        this.memory.event.set(e, enabled, events);
    }

    public addPlugin(/* final */  p: Plugin | null): void {
        if (p instanceof SensoryChannel) {
            this.addSensoryChannel((p as SensoryChannel).getName(), p as SensoryChannel);
        } else if (p instanceof Operator) {
            this.memory.addOperator(p as Operator);
        } else if (p instanceof Emotions) {
            this.memory.emotion = p as Emotions;
        } else if (p instanceof InternalExperience) {
            this.memory.internalExperience = p as InternalExperience;
        }
        let ps: Nar.PluginState = new PluginState(p);
        this.plugins.add(ps);
        this.emit(Events.PluginsChange.class, p, null);
    }

    public removePlugin(/* final */  ps: Nar.PluginState | null): void {
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

    public getPlugins(): java.util.List<Nar.PluginState> | null {
        return java.util.Collections.unmodifiableList(this.plugins);
    }

    public start(): void;

    public start(/* final */  minCyclePeriodMS: long): void;
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
    public cycles(/* final */  cycles: int): void {
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

    public emit(/* final */  c: java.lang.Class<unknown> | null, /* final */ ...o: java.lang.Object | null[]): void {
        this.memory.event.emit(c, o);
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
            this.cycle++;
            /* } */
        } catch (e) {
            if (e instanceof java.lang.Exception) {
                if (Debug.SHOW_REASONING_ERRORS) {
                    this.emit(ERR.class, e);
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

    public toString(): java.lang.String | null {
        return this.memory.toString();
    }

    public time(): long {
        if (this.narParameters.STEPS_CLOCK) {
            return this.cycle;
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

    /**
     * When b is true, Nar will call Thread.yield each run() iteration that
     * minCyclePeriodMS==0 (no delay).
     * This is for improving program responsiveness when Nar is run with no delay.
     */
    public setThreadYield(/* final */  b: boolean): void {
        this.threadYield = b;
    }

    /**
     * overrides parameter values by name
     *
     * @param parameters (overwritten) parameters of a Reasoner
     * @param overrides  specific override values by parameter name
     */
    private static overrideParameters(parameters: java.security.Policy.Parameters | null, overrides: java.util.Map<java.lang.String, java.lang.Object> | null): void {
        for (let iOverride of overrides.entrySet()) {
            let propertyName: java.lang.String = iOverride.getKey();
            let value: java.lang.Object = iOverride.getValue();

            try {
                let fieldOfProperty: java.lang.reflect.Field = java.security.Policy.Parameters.class.getField(propertyName);
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


