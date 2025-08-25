import { java, JavaObject, type long, type float, type int, type double, S } from "jree";



/**
 * Memory consists of the run-time state of a Nar, including:
 * * term and concept memory
 * * reasoner state
 * * etc.
 * <br>
 * Excluding input/output channels which are managed by a Nar.
 * <br>
 * A memory is controlled by zero or one Nar's at a given time.
 * <br>
 * Memory is serializable so it can be persisted and transported.
 */
export class Memory extends JavaObject implements java.io.Serializable, java.lang.Iterable<Concept>, Resettable {

    /* Nar parameters */
    public readonly narParameters: java.security.Policy.Parameters | null;

    public narId: long = 0;
    // emotion meter keeping track of global emotion
    public emotion: Emotions | null = null;
    public internalExperience: InternalExperience | null = null;
    public lastDecision: Task | null = null;
    public allowExecution: boolean = true;

    public readonly randomSeed: long = 1;
    public readonly randomNumber: java.util.Random | null = new java.util.Random(this.randomSeed);

    // todo make sense of this class and de-obfuscate
    public readonly concepts: Bag<Concept, Term> | null;
    public event: EventEmitter | null;

    /* InnateOperator registry. Containing all registered operators of the system */
    public readonly operators: java.util.Map<java.lang.CharSequence, Operator> | null;

    /* a mutex for novel and new tasks */
    private readonly tasksMutex: java.lang.Boolean | null = java.lang.Boolean.TRUE;

    /* New tasks with novel composed terms, for delayed and selective processing */
    public readonly novelTasks: Bag<Task, Sentence> | null;

    /* Input event tasks that were either input events or derived sequences */
    public readonly seq_current: Bag<Task, Sentence> | null;
    public readonly recent_operations: Bag<Task, Sentence> | null;

    // Boolean localInferenceMutex = false;

    protected checked: boolean = false;
    protected isjUnit: boolean = false;

    /* ---------- Constructor ---------- */
    /**
     * Create a new memory
     */
    public constructor(/* final */  narParameters: java.security.Policy.Parameters | null, /* final */  concepts: Bag<Concept, Term> | null,
            /* final */  novelTasks: Bag<Task, Sentence> | null,
            /* final */  seq_current: Bag<Task, Sentence> | null,
            /* final */  recent_operations: Bag<Task, Sentence> | null) {
        super();
        this.narParameters = narParameters;
        this.event = new EventEmitter();
        this.concepts = concepts;
        this.novelTasks = novelTasks;
        this.recent_operations = recent_operations;
        this.seq_current = seq_current;
        this.operators = new java.util.LinkedHashMap();
        this.reset();
    }

    public reset(): void {
        this.event.emit(ResetStart.class);
        /* synchronized (concepts) { */
        this.concepts.clear();
        /* } */
        /* synchronized (tasksMutex) { */
        this.novelTasks.clear();
        /* } */
        /* synchronized (this.seq_current) { */
        this.seq_current.clear();
        /* } */
        if (this.emotion !== null) {
            this.emotion.resetEmotions();
        }
        this.recent_operations.clear();
        this.lastDecision = null;
        this.randomNumber.setSeed(this.randomSeed);
        this.event.emit(ResetEnd.class);
    }

    /* ---------- conversion utilities ---------- */
    /**
     * Get an existing Concept for a given name
     * <p>
     * called from Term and ConceptWindow.
     *
     * @param t the name of a concept
     * @return a Concept or null
     */
    public concept(/* final */  t: Term | null): Concept | null {
        /* synchronized (concepts) { */
        return this.concepts.get(CompoundTerm.replaceIntervals(t));
        /* } */
    }

    /**
     * Get the Concept associated to a Term, or create it.
     *
     * Existing concept: apply taskLink activation (remove from bag, adjust budget,
     * reinsert)
     * New concept: set initial activation, insert
     * Subconcept: extract from cache, apply activation, insert
     *
     * If failed to insert as a result of null bag, returns null
     *
     * A displaced Concept resulting from insert is forgotten (but may be stored in
     * optional subconcept memory
     *
     * @param term indicating the concept
     * @return an existing Concept, or a new one, or null
     */
    public conceptualize(/* final */  budget: BudgetValue | null, term: Term | null): Concept | null {
        if (term instanceof Interval) {
            return null;
        }
        term = CompoundTerm.replaceIntervals(term);

        let displaced: Concept;
        let concept: Concept;

        /* synchronized (concepts) { */
        concept = this.concepts.pickOut(term);

        // see if concept is active
        if (concept === null) {
            // create new concept, with the applied budget
            concept = new Concept(budget, term, this);
            // if (memory.logic!=null)
            // memory.logic.CONCEPT_NEW.commit(term.getComplexity());
            this.emit(Events.ConceptNew.class, concept);
        } else if (concept !== null) {
            // apply budget to existing concept
            // memory.logic.CONCEPT_ACTIVATE.commit(term.getComplexity());
            BudgetFunctions.activate(concept.budget, budget, BudgetFunctions.Activating.TaskLink);
        } else {
            // unable to create, ex: has variables
            return null;
        }

        displaced = this.concepts.putBack(concept, this.cycles(this.narParameters.CONCEPT_FORGET_DURATIONS), this);
        /* } */

        if (displaced === null) {
            // added without replacing anything
            return concept;
        } else if (displaced === concept) {
            // not able to insert
            this.conceptRemoved(displaced);
            return null;
        } else {
            this.conceptRemoved(displaced);
            return concept;
        }
    }

    /* ---------- new task entries ---------- */
    /**
     * add new task that waits to be processed in the next cycleMemory
     */
    public addNewTask(/* final */  t: Task | null, /* final */  reason: java.lang.String | null): void {
        /* synchronized (tasksMutex) { */
        this.novelTasks.putIn(t);
        /* } */
        // logic.TASK_ADD_NEW.commit(t.getPriority());
        this.emit(Events.TaskAdd.class, t, reason);
        this.output(t);
    }

    public static isJUnitTest(): boolean {
        let stackTrace: java.lang.StackTraceElement[] = java.lang.Thread.currentThread().getStackTrace();
        let list: java.lang.StackTraceElement[] = stackTrace;
        for (let element of list) {
            if (element.getClassName().startsWith("org.junit.")) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param time indirection to retrieve time
     */
    public inputTask(/* final */  time: Timable | null, /* final */  t: Task | null): void;

    /**
     * Input task processing. Invoked by the outside or inside environment.
     * Outside: StringParser (addInput);
     * Inside: InnateOperator (feedback).
     *
     * @param time indirection to retrieve time
     * @param task The addInput task
     */
    /*
     * There are several types of new tasks, all added into the
     * newTasks list, to be processed in the next cycleMemory.
     * Some of them are reported and/or logged.
     */
    /*
     * Input tasks with low priority are ignored, and the others are put into task
     * buffer.
     */
    public inputTask(/* final */  time: Timable | null, /* final */  task: Task | null, /* final */  emitIn: boolean): void;
    public inputTask(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [time, t] = args as [Timable, Task];


                this.inputTask(time, t, true);


                break;
            }

            case 3: {
                const [time, task, emitIn] = args as [Timable, Task, boolean];


                if (!this.checked) {
                    this.checked = true;
                    this.isjUnit = Memory.isJUnitTest();
                }
                if (task !== null) {
                    let s: Stamp = task.sentence.stamp;
                    if (s.getCreationTime() === -1)
                        s.setCreationTime(time.time(), this.narParameters.DURATION);

                    if (emitIn) {
                        this.emit(IN.class, task);
                    }

                    if (task.budget.aboveThreshold()) {
                        this.addNewTask(task, "Perceived");
                    } else {
                        this.removeTask(task, "Neglected");
                    }
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public removeTask(/* final */  task: Task | null, /* final */  reason: java.lang.String | null): void {
        this.emit(TaskRemove.class, task, reason);
    }

    /**
     * ExecutedTask called in Operator.call
     *
     * @param operation The operation just executed
     * @param time      indirection to retrieve time
     */
    public executedTask(/* final */  time: Timable | null, /* final */  operation: Operation | null, /* final */  truth: TruthValue | null): void {
        // final Task opTask = operation.getTask();
        // logic.TASK_EXECUTED.commit(opTask.budget.getPriority());

        let stamp: Stamp = new Stamp(time, this, Tense.Present);
        let sentence: Sentence = new Sentence(
            operation,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let budgetForNewTask: BudgetValue = new BudgetValue(this.narParameters.DEFAULT_FEEDBACK_PRIORITY,
            this.narParameters.DEFAULT_FEEDBACK_DURABILITY,
            truthToQuality(sentence.getTruth()), this.narParameters);
        let newTask: Task = new Task(sentence, budgetForNewTask, Task.EnumType.INPUT);

        newTask.setElemOfSequenceBuffer(true);
        this.addNewTask(newTask, "Executed");
    }

    public output(/* final */  t: Task | null): void {

        let budget: float = t.budget.summary();
        let noiseLevel: float = 1.0 - (this.narParameters.VOLUME / 100.0);

        if (budget >= noiseLevel) { // only report significant derived Tasks
            this.emit(OUT.class, t);
            if (Debug.PARENTS) {
                this.emit(DEBUG.class, "Parent Belief\t" + t.parentBelief);
                this.emit(DEBUG.class, "Parent Task\t" + t.parentTask + "\n\n");
            }
        }
    }

    public emit(/* final */  c: java.lang.Class<unknown> | null, /* final */ ...signal: java.lang.Object | null[]): void {
        this.event.emit(c, java.util.concurrent.locks.Condition.signal);
    }

    public emitting(/* final */  channel: java.lang.Class<unknown> | null): boolean {
        return this.event.isActive(channel);
    }

    public conceptRemoved(/* final */  c: Concept | null): void {
        this.emit(Events.ConceptForget.class, c);
    }

    public cycle(/* final */  nar: Nar | null): void {

        this.event.emit(Events.CycleStart.class);
        for (let i: int = 0; i < nar.narParameters.NOVEL_TASK_BAG_SELECTIONS; i++) {
            this.processNovelTask(nar.narParameters, nar);
        }
        // if(noResult()) //newTasks empty
        GeneralInferenceControl.selectConceptForInference(this, nar.narParameters, nar);

        this.event.emit(Events.CycleEnd.class);
        this.event.synch();
    }

    /**
     *
     * @param task          task to be processed
     * @param narParameters parameters for the Reasoner instance
     * @param time          indirection to retrieve time
     */
    public localInference(/* final */  task: Task | null, narParameters: java.security.Policy.Parameters | null, /* final */  time: Timable | null): void {
        // synchronized (localInferenceMutex) {
        let cont: DerivationContext = new DerivationContext(this, narParameters, time);
        cont.setCurrentTask(task);
        cont.setCurrentTerm(task.getTerm());
        cont.setCurrentConcept(this.conceptualize(task.budget, cont.getCurrentTerm()));
        if (cont.getCurrentConcept() !== null) {
            let processed: boolean = ProcessTask.processTask(cont.getCurrentConcept(), cont, task, time);
            if (processed) {
                this.event.emit(Events.ConceptDirectProcessedTask.class, task);
            }
        }

        if (!task.sentence.isEternal() && !(task.sentence.term instanceof Operation)) {
            TemporalInferenceControl.eventInference(task, cont);
        }

        // memory.logic.TASK_IMMEDIATE_PROCESS.commit();
        this.emit(Events.TaskImmediateProcess.class, task, cont);
        // }
    }

    /**
     * Select a novel task to process
     *
     * @param narParameters parameters for the Reasoner instance
     * @param time          indirection to retrieve time
     */
    public processNovelTask(narParameters: java.security.Policy.Parameters | null, /* final */  time: Timable | null): void {
        /* synchronized (tasksMutex) { */
        let task: Task = this.novelTasks.takeOut();
        if (task !== null) {
            this.localInference(task, narParameters, time);
        }
        /* } */
    }

    public getOperator(/* final */  op: java.lang.String | null): Operator | null {
        return this.operators.get(op);
    }

    public addOperator(/* final */  op: Operator | null): Operator | null {
        this.operators.put(op.name(), op);
        return op;
    }

    public removeOperator(/* final */  op: Operator | null): Operator | null {
        return this.operators.remove(op.name());
    }

    private currentStampSerial: long = 0;

    public newStampSerial(): BaseEntry | null {
        return new BaseEntry(this.narId, this.currentStampSerial++);
    }

    /** converts durations to cycles */
    public cycles(/* final */  durations: double): float {
        return this.narParameters.DURATION * durations as float;
    }

    public iterator(): java.util.Iterator<Concept> | null {
        return this.concepts.iterator();
    }
}
