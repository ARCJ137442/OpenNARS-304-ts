//! Java source: opennars/storage/Memory.java
import { JavaIllegalArgumentException } from "../runtime/JavaExceptions.ts";
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";
import type { long, float, int, double } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Float32Math } from "../runtime/Float32.ts";
import type { JavaIterator } from "../runtime/JavaIterator.ts";
import { Parameters } from "../main/Parameters.ts";
import { Concept } from "../entity/Concept.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Task } from "../entity/Task.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Stamp } from "../entity/Stamp.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { Bag } from "./Bag.ts";
import { EventEmitter } from "../io/events/EventEmitter.ts";
import { Events } from "../io/events/Events.ts";
import { OutputHandler } from "../io/events/OutputHandler.ts";
import { Symbols } from "../io/Symbols.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Interval } from "../language/Interval.ts";
import { Tense } from "../language/Tense.ts";
import { Term } from "../language/Term.ts";
import { Operation } from "../operator/Operation.ts";
import { Operator } from "../operator/Operator.ts";
import { Debug } from "../main/Debug.ts";
import { Emotions } from "../plugin/mental/Emotions.ts";
import { InternalExperience } from "../plugin/mental/InternalExperience.ts";
import { ProcessTask } from "../control/concept/ProcessTask.ts";
import { DerivationContext } from "../control/DerivationContext.ts";
import { GeneralInferenceControl } from "../control/GeneralInferenceControl.ts";
import { TemporalInferenceControl } from "../control/TemporalInferenceControl.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import type { Nar } from "../main/Nar.ts";
import { javaStringValue } from "../runtime/java-text.ts";
import { toJavaString as toHostJavaString } from "../platform/node/native-host-adapter.ts";
import type { JavaStringInput } from "../runtime/java-text.ts";
import { ThreadCompat } from "../runtime/ThreadCompat.ts";
import { JavaRandom } from "../runtime/JavaRandom.ts";
import type { Resettable } from "../interfaces/Resettable.ts";
import type { Timable } from "../interfaces/Timable.ts";

const IN = OutputHandler.IN;
const OUT = OutputHandler.OUT;
const DEBUG = OutputHandler.DEBUG;
const ResetStart = Events.ResetStart;
const ResetEnd = Events.ResetEnd;
const TaskRemove = Events.TaskRemove;



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
// Java original type: Memory implements Serializable, Iterable<Concept>, Resettable.
// It has no explicit superclass and no observed JavaObject/class-identity use;
// Serializable is only a marker, so the runtime state is a native TS class.
export class Memory implements Iterable<Concept>, Resettable {

    /* Nar parameters */
    public readonly narParameters: Parameters;

    public narId: long = 0 as unknown as long;
    // emotion meter keeping track of global emotion
    public emotion: Emotions = null as unknown as Emotions;
    public internalExperience: InternalExperience = null as unknown as InternalExperience;
    public lastDecision: Task = null as unknown as Task;
    public allowExecution: boolean = true;

    public readonly randomSeed: long = 1n;
    public readonly randomNumber: JavaRandom = new JavaRandom(this.randomSeed);

    // todo make sense of this class and de-obfuscate
    public readonly concepts: Bag<Concept, Term>;
    public event: EventEmitter;

    /* InnateOperator registry. Containing all registered operators of the system */
    public readonly operators: Map<string, Operator>;

    /* a mutex for novel and new tasks */
    private readonly tasksMutex: boolean = true;

    /* New tasks with novel composed terms, for delayed and selective processing */
    public readonly novelTasks: Bag<Task, Sentence>;

    /* Input event tasks that were either input events or derived sequences */
    public readonly seq_current: Bag<Task, Sentence>;
    public readonly recent_operations: Bag<Task, Sentence>;

    // Boolean localInferenceMutex = false;

    protected checked: boolean = false;
    protected isjUnit: boolean = false;

    /* ---------- Constructor ---------- */
    /**
     * Create a new memory
     */
    public constructor(narParameters: Parameters, concepts: Bag<Concept, Term>,
        novelTasks: Bag<Task, Sentence>,
        seq_current: Bag<Task, Sentence>,
        recent_operations: Bag<Task, Sentence>) {
        this.narParameters = narParameters;
        this.event = new EventEmitter();
        this.concepts = concepts;
        this.novelTasks = novelTasks;
        this.recent_operations = recent_operations;
        this.seq_current = seq_current;
        this.operators = new Map();
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
        this.lastDecision = null as unknown as Task;
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
    public concept(t: Term): Concept {
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
    public conceptualize(budget: BudgetValue, term: Term): Concept {
        if (term instanceof Interval) {
            return null as unknown as Concept;
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
            BudgetFunctions.activate(concept.getBudget(), budget, BudgetFunctions.Activating.TaskLink);
        } else {
            // unable to create, ex: has variables
            return null as unknown as Concept;
        }

        displaced = this.concepts.putBack(concept, this.cycles(this.narParameters.CONCEPT_FORGET_DURATIONS), this);
        /* } */

        if (displaced === null) {
            // added without replacing anything
            return concept;
        } else if (displaced === concept) {
            // not able to insert
            this.conceptRemoved(displaced);
            return null as unknown as Concept;
        } else {
            this.conceptRemoved(displaced);
            return concept;
        }
    }

    /* ---------- new task entries ---------- */
    /**
     * add new task that waits to be processed in the next cycleMemory
     */
    public addNewTask(t: Task, reason: JavaStringInput): void {
        /* synchronized (tasksMutex) { */
        this.novelTasks.putIn(t);
        /* } */
        // logic.TASK_ADD_NEW.commit(t.getPriority());
        if (this.emitting(Events.TaskAdd.class)) {
            this.emit(Events.TaskAdd.class, t, toHostJavaString(reason));
        }
        this.output(t);
    }

    public static isJUnitTest(): boolean {
        if (typeof process !== "undefined" && process.release?.name === "node") {
            return false;
        }
        const stackTrace = ThreadCompat.currentThread().getStackTrace();
        for (let element of stackTrace) {
            if (element.getClassName().startsWith("org.junit.")) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param time indirection to retrieve time
     */
    public inputTask(time: Timable, t: Task): void;

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
    public inputTask(time: Timable, task: Task, emitIn: boolean): void;
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
                    if (s.getCreationTime() === (-1 as unknown as long)) {
                        s.setCreationTime(time.time(), this.narParameters.DURATION);
                        task.sentence.refreshHash();
                    }

                    if (emitIn) {
            this.emit(IN.class, task);
                    }

                    if (task.getBudget().aboveThreshold()) {
                        this.addNewTask(task, "Perceived");
                    } else {
                        this.removeTask(task, "Neglected");
                    }
                }


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public removeTask(task: Task, reason: JavaStringInput): void {
        if (this.emitting(TaskRemove.class)) {
            this.emit(TaskRemove.class, task, toHostJavaString(reason));
        }
    }

    /**
     * ExecutedTask called in Operator.call
     *
     * @param operation The operation just executed
     * @param time      indirection to retrieve time
     */
    public executedTask(time: Timable, operation: Operation, truth: TruthValue): void {
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
            BudgetFunctions.truthToQuality(sentence.getTruth()), this.narParameters);
        let newTask: Task = new Task(sentence, budgetForNewTask, Task.EnumType.INPUT);

        newTask.setElemOfSequenceBuffer(true);
        this.addNewTask(newTask, "Executed");
    }

    public output(t: Task): void {
        const shouldOutput = this.emitting(OUT.class);
        const shouldDebug = Debug.PARENTS && this.emitting(DEBUG.class);
        if (!shouldOutput && !shouldDebug) return;

        let budget: float = t.getBudget().summary();
        // Java evaluates both the division and subtraction as float because
        // VOLUME is converted to the 100.0f operand type before the divide.
        const volumeRatio: float = Float32Math.divide(this.narParameters.VOLUME, 100) as float;
        let noiseLevel: float = Float32Math.subtract(1.0, volumeRatio) as float;

        if (budget >= noiseLevel) { // only report significant derived Tasks
            if (shouldOutput) this.emit(OUT.class, t);
            if (shouldDebug) {
                this.emit(DEBUG.class, "Parent Belief\t" + t.parentBelief);
                this.emit(DEBUG.class, "Parent Task\t" + t.parentTask + "\n\n");
            }
        }
    }

    // Java Object... accepts native TypeScript payloads as well; convert only
    // at the legacy EventEmitter boundary.
    public emit(c: ClassTokenLike, ...signal: EventEmitter.EventPayload): void {
        this.event.emit(c, ...signal);
    }

    public emitting(channel: ClassTokenLike): boolean {
        return this.event.isActive(channel);
    }

    public conceptRemoved(c: Concept): void {
        this.emit(Events.ConceptForget.class, c);
    }

    public cycle(nar: Nar): void {

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
    public localInference(task: Task, narParameters: Parameters, time: Timable): void {
        // synchronized (localInferenceMutex) {
        let cont: DerivationContext = new DerivationContext(this, narParameters, time);
        cont.setCurrentTask(task);
        cont.setCurrentTerm(task.getTerm());
        cont.setCurrentConcept(this.conceptualize(task.getBudget(), cont.requireCurrentTerm()));
        const currentConcept = cont.getCurrentConcept();
        if (currentConcept !== null) {
            let processed: boolean = ProcessTask.processTask(currentConcept, cont, task, time);
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
    public processNovelTask(narParameters: Parameters, time: Timable): void {
        /* synchronized (tasksMutex) { */
        let task: Task = this.novelTasks.takeOut();
        if (task !== null) {
            this.localInference(task, narParameters, time);
        }
        /* } */
    }

    public getOperator(op: JavaStringInput): Operator {
        return (this.operators.get(javaStringValue(op)) ?? null) as unknown as Operator;
    }

    public addOperator(op: Operator): Operator {
        this.operators.set(javaStringValue(op.name()), op);
        return op;
    }

    public removeOperator(op: Operator): Operator {
        const key = javaStringValue(op.name());
        const previous = this.operators.get(key) ?? null;
        this.operators.delete(key);
        return previous as unknown as Operator;
    }

    private currentStampSerial: long = 0 as unknown as long;

    public newStampSerial(): Stamp.BaseEntry {
        return new Stamp.BaseEntry(this.narId, this.currentStampSerial++);
    }

    /** converts durations to cycles */
    public cycles(durations: double): float {
        // Java narrows the double duration before multiplying by the integer
        // DURATION; keep that operand boundary instead of narrowing only the
        // final binary64 product.
        return Float32Math.multiply(this.narParameters.DURATION, Float32Math.from(durations)) as float;
    }

    // Java original return type: java.util.Iterator<Concept>.
    public iterator(): JavaIterator<Concept> {
        return this.concepts.iterator();
    }

    public [Symbol.iterator](): IterableIterator<Concept> {
        return this.concepts[Symbol.iterator]();
    }
}
