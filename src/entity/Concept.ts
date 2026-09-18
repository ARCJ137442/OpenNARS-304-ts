//! Java source: opennars/entity/Concept.java
import { java, S } from "jree";
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import type { int, float, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Item } from "./Item.ts";
import { Term } from "../language/Term.ts";
import { Sentence } from "./Sentence.ts";
import { Task } from "./Task.ts";
import { Bag } from "../storage/Bag.ts";
import { TaskLink } from "./TaskLink.ts";
import { TermLink } from "./TermLink.ts";
import { BudgetValue } from "./BudgetValue.ts";
import { TruthValue } from "./TruthValue.ts";
import { Stamp } from "./Stamp.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import { UtilityFunctions } from "../inference/UtilityFunctions.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { NativeList, NativeReadOnlyList } from "../runtime/NativeList.ts";
import { javaStringValue } from "../runtime/jree-compat.ts";
import { LocalRules } from "../inference/LocalRules.ts";
import { Events } from "../io/events/Events.ts";
import { ProcessQuestion } from "../control/concept/ProcessQuestion.ts";
import type { Symbols } from "../io/Symbols.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Parameters } from "../main/Parameters.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { DerivationContext } from "../control/DerivationContext.ts";

const TaskLinkAdd = Events.TaskLinkAdd;
const TaskLinkRemove = Events.TaskLinkRemove;
const TermLinkAdd = Events.TermLinkAdd;
const TermLinkRemove = Events.TermLinkRemove;
const BeliefSelect = Events.BeliefSelect;



/**
 * Concept as defined by the NARS-theory
 *
 * Concepts are used to keep track of interrelated sentences
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Concept extends Item<Term> {

    /**
     * The term is the unique ID of the concept
     */
    public readonly term: Term;

    // recent events that happened before the operation the
    // concept represents was executed
    // Java reference fields default to null; keep the null guard in
    // TemporalInferenceControl meaningful before the first operation frame.
    public seq_before: Bag<Task, Sentence> | null = null;

    /**
     * Task links for indirect processing
     */
    public readonly taskLinks: Bag<TaskLink, Task>;

    /**
     * Term links between the term and its components and compounds; beliefs
     */
    public readonly termLinks: Bag<TermLink, TermLink>;

    /**
     * Link templates of TermLink, only in concepts with CompoundTerm Templates
     * are used to improve the efficiency of TermLink building
     */
    public readonly termLinkTemplates: java.util.List<TermLink> | null;

    /**
     * Pending Question directly asked about the term
     *
     * Note: since this is iterated frequently, an array should be used. To
     * avoid iterator allocation, use .get(n) in a for-loop
     */
    public readonly questions: NativeList<Task>;

    /**
     * Pending Quests to be answered by new desire values
     */
    public readonly quests: NativeList<Task>;

    /**
     * Judgments directly made about the term Use List because of access
     * and insertion in the middle
     */
    public readonly beliefs: NativeList<Task>;
    public executable_preconditions: NativeList<Task>;
    public general_executable_preconditions: NativeList<Task>;

    /**
     * Desire values on the term, similar to the above one
     */
    public readonly desires: NativeList<Task>;

    /**
     * Reference to the memory to which the Concept belongs
     */
    public readonly memory: Memory;

    // Java source: List<Float> recent_intervals.
    // Native array is intentional: LocalRules only needs numeric length,
    // indexed read/write and append operations.
    public readonly recent_intervals: float[] = [];

    public observable: boolean = false; // whether it received a "native" input task
    public allowBabbling: boolean = true; // for operations, becomes false if sufficiently
    // confident, used procedure knowledge exists.

    /**
     * Constructor, called in Memory.getConcept only
     *
     * @param tm     A term corresponding to the concept
     * @param memory A reference to the memory
     */
    public constructor(b: BudgetValue, tm: Term, memory: Memory) {
        super(b);

        this.term = tm;
        this.memory = memory;

        this.questions = new NativeList<Task>();
        this.beliefs = new NativeList<Task>();
        this.executable_preconditions = new NativeList<Task>();
        this.general_executable_preconditions = new NativeList<Task>();
        this.quests = new NativeList<Task>();
        this.desires = new NativeList<Task>();

        this.taskLinks = new Bag(memory.narParameters.TASK_LINK_BAG_LEVELS, memory.narParameters.TASK_LINK_BAG_SIZE,
            memory.narParameters);
        this.termLinks = new Bag(memory.narParameters.TERM_LINK_BAG_LEVELS, memory.narParameters.TERM_LINK_BAG_SIZE,
            memory.narParameters);

        if (tm instanceof CompoundTerm) {
            this.termLinkTemplates = (tm as CompoundTerm).prepareComponentLinks();
        } else {
            this.termLinkTemplates = null;
        }

    }

    public equals(obj: java.lang.Object): boolean {
        if (this === obj)
            return true;
        if (!(obj instanceof Concept))
            return false;
        return (obj as Concept).name().equals(this.name());
    }

    public hashCode(): int {
        return this.name().hashCode();
    }

    public name(): Term {
        return this.term;
    }

    public addToTable(task: Task, rankTruthExpectation: boolean, table: NativeList<Task>, max: int,
        eventAdd: ClassTokenLike, eventRemove: ClassTokenLike, ...extraEventArguments: EventEmitter.EventPayload): void {

        let preSize: int = table.size();
        let removedT: Task | null;
        let removed: Sentence | null = null;
        removedT = Concept.addToTable(task, table, max, rankTruthExpectation);
        if (removedT !== null) {
            removed = removedT.sentence;
        }

        if (removed !== null) {
            this.memory.event.emit(eventRemove, this, removed, task, ...extraEventArguments);
        }
        if ((preSize !== table.size()) || (removed !== null)) {
            this.memory.event.emit(eventAdd, this, task, ...extraEventArguments);
        }
    }

    /**
     * Link to a new task from all relevant concepts for continued processing in
     * the near future for unspecified time.
     * <p>
     * The only method that calls the TaskLink constructor.
     *
     * @param task    The task to be linked
     * @param content The content of the task
     */
    public linkToTask(task: Task, content: DerivationContext): TaskLink {
        let taskBudget: BudgetValue = task.getBudget();

        let retLink: TaskLink = new TaskLink(task, null, taskBudget, content.narParameters.TERM_LINK_RECORD_LENGTH);
        this.insertTaskLink(retLink, content); // link type: SELF

        if (!(this.term instanceof CompoundTerm)) {
            return retLink;
        }
        if (this.termLinkTemplates === null || this.termLinkTemplates.isEmpty()) {
            return retLink;
        }

        let subBudget: BudgetValue = BudgetFunctions.distributeAmongLinks(taskBudget, this.termLinkTemplates.size(), content.narParameters);
        if (subBudget.aboveThreshold()) {

            for (let termLink of this.termLinkTemplates) {
                if (termLink.type === TermLink.TEMPORAL)
                    continue;
                let componentTerm: Term = termLink.target;

                let componentConcept: Concept = this.memory.conceptualize(subBudget, componentTerm);

                if (componentConcept !== null) {
                    /* synchronized (componentConcept) { */
                    componentConcept.insertTaskLink(
                        new TaskLink(task, termLink, subBudget, content.narParameters.TERM_LINK_RECORD_LENGTH),
                        content);
                    /* } */
                }
            }

            this.buildTermLinks(taskBudget, content.narParameters); // recursively insert TermLink
        }
        return retLink;
    }

    /**
     * Add a new belief (or goal) into the table Sort the beliefs/desires by
     * rank, and remove redundant or low rank one
     *
     * @param table    The table to be revised
     * @param capacity The capacity of the table
     * @return whether table was modified
     */
    public static addToTable(newTask: Task, table: NativeList<Task>, capacity: int,
        rankTruthExpectation: boolean): Task | null {
        let newSentence: Sentence = newTask.sentence;
        let rank1: float = BudgetFunctions.rankBelief(newSentence, rankTruthExpectation); // for the new isBelief
        let rank2: float;
        let i: int;
        for (i = 0; i < table.size(); i++) {
            let judgment2: Sentence = table.get(i).sentence;
            rank2 = BudgetFunctions.rankBelief(judgment2, rankTruthExpectation);
            if (rank1 >= rank2) {
                if (newSentence.getTruth().equals(judgment2.getTruth())
                    && newSentence.stamp.equals(judgment2.stamp, false, true, true)) {
                    // System.out.println(" ---------- Equivalent Belief: " + newSentence + " == " +
                    // judgment2);
                    return null;
                }
                table.add(i, newTask);
                break;
            }
        }

        if (table.size() === capacity) {
            // nothing
        } else if (table.size() > capacity) {
            let removed: Task | undefined = table.remove(table.size() - 1);
            return removed ?? null;
        } else if (i === table.size()) { // branch implies implicit table.size() < capacity
            table.add(newTask);
        }

        return null;
    }

    /**
     * Select a belief value or desire value for a given query
     *
     * @param query The query to be processed
     * @param list  The list of beliefs or desires to be used
     * @return The best candidate selected
     */
    public selectCandidate(query: Task, list: NativeList<Task>, time: Timable): Task | null {
        // if (list == null) {
        // return null;
        // }
        let currentBest: float = 0;
        let beliefQuality: float;
        let candidate: Task | null = null;
        let rateByConfidence: boolean = true; // table vote, yes/no question / local processing
        /* synchronized (list) { */
        for (let judgT of list) {
            let judg: Sentence = judgT.sentence;
            beliefQuality = LocalRules.solutionQuality(rateByConfidence, query, judg, this.memory, time); // makes
            // revision
            // explicitly
            // search for
            if (beliefQuality > currentBest /* && (!forRevision || judgT.sentence.equalsContent(query)) */ /*
                                                                                                                * && (!
                                                                                                                * forRevision
                                                                                                                * ||
                                                                                                                * !Stamp
                                                                                                                * .
                                                                                                                * baseOverlap
                                                                                                                * (query
                                                                                                                * .stamp
                                                                                                                * .
                                                                                                                * evidentialBase,
                                                                                                                * judg.
                                                                                                                * stamp.
                                                                                                                * evidentialBase
                                                                                                                * ))
                                                                                                                */) {
                currentBest = beliefQuality;
                candidate = judgT;
            }
        }
        /* } */
        return candidate;
    }

    // Java source: public static class AnticipationEntry implements Serializable.
    // Serializable is a marker here; no JavaObject or runtime class contract is consumed.
    public static AnticipationEntry = class AnticipationEntry {
        public negConfirmationPriority: float = 0.0;
        public negConfirmation: Task | null = null;
        public negConfirm_abort_minTime: long = 0n;
        public negConfirm_abort_maxTime: long = 0n;

        public constructor(negConfirmationPriority: float, negConfirmation: Task, negConfirm_abort_minTime: long,
            negConfirm_abort_maxTime: long) {
            this.negConfirmationPriority = Float32Math.from(negConfirmationPriority) as float;
            this.negConfirmation = negConfirmation;
            this.negConfirm_abort_minTime = negConfirm_abort_minTime;
            this.negConfirm_abort_maxTime = negConfirm_abort_maxTime;
        }
    };


    /**
     * Java source: public List<AnticipationEntry> backed by ArrayList.
     * Native array is intentional: the owner only needs ordered iteration,
     * append, indexed identity removal, filtering and length.
     */
    public anticipations: Concept.AnticipationEntry[] = [];

    /* ---------- insert Links for indirect processing ---------- */
    /**
     * Insert a TaskLink into the TaskLink bag
     * <p>
     * called only from Memory.continuedProcess
     *
     * @param taskLink The termLink to be inserted
     */
    protected insertTaskLink(taskLink: TaskLink, nal: DerivationContext): boolean {
        let target: Task = taskLink.getTarget();
        // what question answering, question side:
        ProcessQuestion.ProcessWhatQuestion(this, target, nal);
        // what question answering, belief side:
        ProcessQuestion.ProcessWhatQuestionAnswer(this, target, nal);
        // HANDLE MAX PER CONTENT
        // if taskLinks already contain a certain amount of tasks with same content then
        // one has to go
        let isEternal: boolean = target.sentence.isEternal();
        let nSameContent: int = 0;
        let lowest_priority: float = Number.MAX_VALUE;
        let lowest: TaskLink | null = null;
        for (let tl of this.taskLinks) {
            let s: Sentence = tl.getTarget().sentence;
            if (s.getTerm().equals(taskLink.getTerm()) && s.isEternal() === isEternal) {
                nSameContent++; // same content and occurrence-type, so count +1
                if (tl.getPriority() < lowest_priority) { // the current one has lower priority so save as lowest
                    lowest_priority = tl.getPriority();
                    lowest = tl;
                }
                if (nSameContent > nal.narParameters.TASKLINK_PER_CONTENT) { // ok we reached the maximum so lets delete
                    // the lowest
                    if (lowest !== null) {
                        this.taskLinks.pickOut(lowest);
                        this.memory.emit(TaskLinkRemove.class, lowest, this);
                    }
                    break;
                }
            }
        }
        // END HANDLE MAX PER CONTENT
        let removed: TaskLink = this.taskLinks.putIn(taskLink);
        if (removed !== null) {
            if (removed === taskLink) {
                this.memory.emit(TaskLinkRemove.class, taskLink, this);
                return false;
            } else {
                this.memory.emit(TaskLinkRemove.class, removed, this);
            }
        }
        this.memory.emit(TaskLinkAdd.class, taskLink, this);
        return true;
    }

    /**
     * Recursively build TermLinks between a compound and its components
     * <p>
     * called only from Memory.continuedProcess
     *
     * @param taskBudget The BudgetValue of the task
     */
    public buildTermLinks(taskBudget: BudgetValue, narParameters: Parameters): void {
        if (this.termLinkTemplates === null || this.termLinkTemplates.size() === 0) {
            return;
        }

        let subBudget: BudgetValue = BudgetFunctions.distributeAmongLinks(taskBudget, this.termLinkTemplates.size(), narParameters);

        if (!subBudget.aboveThreshold()) {
            return;
        }

        for (let template of this.termLinkTemplates) {
            if (template.type === TermLink.TRANSFORM) {
                continue;
            }

            let target: Term = template.target;

            let concept: Concept = this.memory.conceptualize(taskBudget, target);
            if (concept === null) {
                continue;
            }

            // this termLink to that and vice versa
            this.insertTermLink(new TermLink(target, template, subBudget));
            concept.insertTermLink(new TermLink(this.term, template, subBudget));

            if (target instanceof CompoundTerm && template.type !== TermLink.TEMPORAL) {
                concept.buildTermLinks(subBudget, narParameters);
            }
        }
    }

    /**
     * Insert a TermLink into the TermLink bag
     * <p>
     * called from buildTermLinks only
     *
     * @param termLink The termLink to be inserted
     */
    public insertTermLink(termLink: TermLink): boolean {
        let removed: TermLink = this.termLinks.putIn(termLink);
        if (removed !== null) {
            if (removed === termLink) {
                this.memory.emit(TermLinkRemove.class, termLink, this);
                return false;
            } else {
                // emit remove and add for this case
                this.memory.emit(TermLinkRemove.class, removed, this);
            }
        }
        this.memory.emit(TermLinkAdd.class, termLink, this);
        return true;
    }

    /**
     * Return a string representation of the concept, called in ConceptBag only
     *
     * @return The concept name, with taskBudget in the full version
     */
    public toString(): string { // called from concept bag
        // return (super.toStringBrief() + " " + key);
        return super.toStringExternal();
    }

    /**
     * called from {@link Shell}
     */
    public toStringLong(): string {
        const res: java.lang.String = S`${this.toStringExternal()} ${this.term.name()}${this.toStringIfNotNull(this.termLinks.size(), S`termLinks`)}${this.toStringIfNotNull(this.taskLinks.size(), S`taskLinks`)}${this.toStringIfNotNull(this.beliefs.size(), S`beliefs`)}${this.toStringIfNotNull(this.desires.size(), S`desires`)}${this.toStringIfNotNull(this.questions.size(), S`questions`)}${this.toStringIfNotNull(this.quests.size(), S`quests`)}`;

        // + toStringIfNotNull(null, "questions");
        /*
         * for (Task t : questions) {
         * res += t.toString();
         * }
         */
        // TODO other details?
        return javaStringValue(res);
    }

    private toStringIfNotNull(item: unknown, title: java.lang.String): java.lang.String {
        if (item === null) {
            return S``;
        }

        return S` ${title}:${String(item)}`;
    }

    public acquiredQuality: float = 0.0;

    public incAcquiredQuality(): void {
        this.acquiredQuality = Float32Math.add(this.acquiredQuality, 0.1) as float;
        if (this.acquiredQuality > 1.0) {
            this.acquiredQuality = 1.0;
        }
    }

    /**
     * Recalculate the quality of the concept [to be refined to show
     * extension/intension balance]
     *
     * @return The quality value
     */
    public getQuality(): float {
        let linkPriority: float = this.termLinks.getAveragePriority();
        // Java evaluates and stores this reciprocal as a float before the
        // disjunctive quality combination.
        let termComplexityFactor: float = Float32Math.divide(
            1.0,
            Float32Math.multiply(this.term.getComplexity(), this.memory.narParameters.COMPLEXITY_UNIT),
        ) as float;
        let result: float = UtilityFunctions.or(this.acquiredQuality, linkPriority, termComplexityFactor);
        if (result < 0) {
            throw new java.lang.IllegalStateException("Concept.getQuality < 0:  result=" + result + ", linkPriority="
                + linkPriority + " ,termComplexityFactor=" + termComplexityFactor + ", termLinks.size="
                + this.termLinks.size());
        }
        return result;
    }

    /**
     * Return the templates for TermLinks, only called in
     * Memory.continuedProcess
     *
     * @return The template get
     */
    public getTermLinkTemplates(): java.util.List<TermLink> | null {
        return this.termLinkTemplates;
    }

    /**
     * Select a isBelief to interact with the given task in inference
     * <p>
     * get the first qualified one
     * <p>
     * only called in RuleTables.reason
     *
     * @param task The selected task
     * @return The selected isBelief
     */
    public getBelief(nal: DerivationContext, task: Task): Sentence | null {
        let taskStamp: Stamp = task.sentence.stamp;
        let currentTime: long = nal.time.time();

        for (let beliefT of this.beliefs) {
            let belief: Sentence = beliefT.sentence;
            nal.emit(BeliefSelect.class, belief);
            nal.setTheNewStamp(taskStamp, belief.stamp, currentTime);

            let projectedBelief: Sentence = belief.projection(taskStamp.getOccurrenceTime(), nal.time.time(),
                nal.memory);
            /*
             * if (projectedBelief.getOccurenceTime() != belief.getOccurenceTime()) {
             * nal.singlePremiseTask(projectedBelief, task.budget);
             * }
             */

            return projectedBelief; // return the first satisfying belief
        }
        return null;
    }

    /**
     * Get the current overall desire value. TODO to be refined
     */
    public getDesire(): TruthValue | null {
        if (this.desires.isEmpty()) {
            return null;
        }
        let topValue: TruthValue = this.desires.get(0).sentence.getTruth();
        return topValue;
    }

    /**
     * Replace default to prevent repeated inference, by checking TaskLink
     *
     * @param taskLink The selected TaskLink
     * @param time     The current time
     * @return The selected TermLink
     */
    public selectTermLink(taskLink: TaskLink, time: long, narParameters: Parameters): TermLink | null {
        let toMatch: int = narParameters.TERM_LINK_MAX_MATCHED; // Math.min(memory.param.termLinkMaxMatched.get(),
        // termLinks.size());
        for (let i: int = 0; (i < toMatch) && (this.termLinks.size() > 0); i++) {

            let termLink: TermLink = this.termLinks.takeOut();
            if (termLink === null)
                break;

            if (taskLink.novel(termLink, time, narParameters)) {
                // return, will be re-inserted in caller method when finished processing it
                return termLink;
            }
            // just put back since it isn't novel
            this.returnTermLink(termLink);
        }
        return null;

    }

    public returnTermLink(termLink: TermLink): void {
        this.termLinks.putBack(termLink, this.memory.cycles(this.memory.narParameters.TERMLINK_FORGET_DURATIONS), this.memory);
    }

    /**
     * Return the questions, called in ComposionalRules in
     * dedConjunctionByQuestion only
     */
    public getQuestions(): NativeReadOnlyList<Task> {
        return new NativeReadOnlyList(this.questions);
    }

    public getQuess(): NativeReadOnlyList<Task> {
        return new NativeReadOnlyList(this.quests);
    }

    public discountConfidence(onBeliefs: boolean): void {
        if (onBeliefs) {
            for (let t of this.beliefs) {
                t.sentence.discountConfidence(this.memory.narParameters);
            }
        } else {
            for (let t of this.desires) {
                t.sentence.discountConfidence(this.memory.narParameters);
            }
        }
    }

    public operator(): Symbols.NativeOperator {
        return this.term.operator();
    }

    public getTerm(): Term {
        return this.term;
    }

    /** returns unmodifidable collection wrapping beliefs */
    public getBeliefs(): NativeReadOnlyList<Task> {
        return new NativeReadOnlyList(this.beliefs);
    }

    /** returns unmodifidable collection wrapping beliefs */
    public getDesires(): NativeReadOnlyList<Task> {
        return new NativeReadOnlyList(this.desires);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Concept {
    export type AnticipationEntry = InstanceType<typeof Concept.AnticipationEntry>;
}


