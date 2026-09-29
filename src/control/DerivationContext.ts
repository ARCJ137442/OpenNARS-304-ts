//! Java source: opennars/control/DerivationContext.java
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../runtime/JavaExceptions.ts";
import type { ClassTokenLike } from "../runtime/RuntimeClass.ts";
import type { double, long, float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Stamp } from "../entity/Stamp.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Task } from "../entity/Task.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Implication } from "../language/Implication.ts";
import { TruthFunctions } from "../inference/TruthFunctions.ts";
import { Events } from "../io/events/Events.ts";
import { Interval } from "../language/Interval.ts";
import { Debug } from "../main/Debug.ts";
import { Operation } from "../operator/Operation.ts";
import { Variable } from "../language/Variable.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Term } from "../language/Term.ts";
import type { Concept } from "../entity/Concept.ts";
import type { TermLink } from "../entity/TermLink.ts";
import type { TaskLink } from "../entity/TaskLink.ts";
import type { Parameters } from "../main/Parameters.ts";
import type { JavaChar, JavaStringInput } from "../runtime/java-text.ts";
import type { Timable } from "../interfaces/Timable.ts";
import { NativeList } from "../runtime/NativeList.ts";

/**
 * NAL Reasoner Process. Includes all reasoning process state.
 *
 * @author Patrick Hammer
 */
// Java source declares DerivationContext without a specialized parent.  Its
// runtime role is the mutable inference context itself; JavaObject supplied
// no behavior used by this class and is not used for class identity here.
export class DerivationContext {
    public evidentialOverlap: boolean = false;
    public readonly memory: Memory;
    public currentTerm: Term | null = null;
    public currentConcept: Concept | null = null;
    public currentTask: Task | null = null;
    public currentBeliefLink: TermLink | null = null;
    public currentTaskLink: TaskLink | null = null;
    public currentBelief: Sentence | null = null;
    public newStamp: Stamp | null = null;
    public newStampBuilder: DerivationContext.StampBuilder | null = null;

    public narParameters: Parameters;

    public time: Timable;

    public constructor(mem: Memory, narParameters: Parameters, time: Timable) {
        this.memory = mem;
        this.narParameters = narParameters;
        this.time = time;
    }

    // Java Object... accepts any event payload, including native TypeScript
    // classes that no longer extend jree JavaObject.
    public emit(c: ClassTokenLike, ...o: unknown[]): void {
        this.memory.emit(c, ...o);
    }

    /**
     * Derived task comes from the inference rules.
     *
     * @param task           the derived task
     * @param overlapAllowed //https://groups.google.com/forum/#!topic/open-nars/FVbbKq5En-M
     */
    public derivedTask(task: Task, revised: boolean, single: boolean,
        overlapAllowed: boolean): boolean;

    public derivedTask(task: Task, revised: boolean, single: boolean,
        overlapAllowed: boolean, addToMemory: boolean): boolean;
    public derivedTask(...args: unknown[]): boolean {
        switch (args.length) {
            case 4: {
                const [task, revised, single, overlapAllowed] = args as [Task, boolean, boolean, boolean];


                return this.derivedTask(task, revised, single, overlapAllowed, true);


                break;
            }

            case 5: {
                const [task, revised, single, overlapAllowed, addToMemory] = args as [Task, boolean, boolean, boolean, boolean];


                if (Debug.PARENTS) {
                    task.parentTask = this.getCurrentTask().sentence;
                }

                if ((task.sentence.isGoal() || task.sentence.isQuest()) && (task.sentence.term instanceof Implication ||
                    task.sentence.term instanceof Equivalence)) {
                    return false; // implication and equivalence goals and quests are not supported anymore
                }
                if (!task.getBudget().aboveThreshold()) {
                    this.memory.removeTask(task, "Insufficient Budget");
                    return false;
                }
                if (task.sentence !== null && task.sentence.truth !== null) {
                    let conf: double = task.sentence.truth.confidence;
                    if (conf < this.narParameters.TRUTH_EPSILON) {
                        // no confidence - we can delete the wrongs out that way.
                        this.memory.removeTask(task, "Ignored (zero confidence)");
                        return false;
                    }
                }
                if (task.sentence.term instanceof Operation) {
                    let op: Operation = task.sentence.term as Operation;
                    if (op.getSubject() instanceof Variable || op.getPredicate() instanceof Variable) {
                        this.memory.removeTask(task, "Operation with variable as subject or predicate");
                        return false;
                    }
                }
                if (task.sentence.term.cloneDeep() === null) {
                    // sorted sub-term version leaded to a invalid term that remained undetected
                    // while the term was constructed optimistically
                    // example: (&,a,b) --> (&,b,a) which gets normalized to (&,a,b) --> (&,a,b)
                    // which is invalid.
                    this.memory.removeTask(task, "Wrong Format");
                    return false;
                }

                let stamp: Stamp = task.sentence.stamp;

                // its revision, of course its cyclic, apply evidential base policy
                if (!overlapAllowed) { // todo reconsider
                    // !single since the derivation shouldn't depend on whether there is a current
                    // belief or not!!
                    let doublePremiseEvidentialBaseOverlap: boolean = !single && this.evidentialOverlap;
                    if (doublePremiseEvidentialBaseOverlap) {
                        this.memory.removeTask(task, "overlapping evidential base");
                        return false;
                    }

                    let selfOverlap: boolean = stamp.evidenceIsCyclic();
                    if (selfOverlap) {
                        this.memory.removeTask(task, "overlapping evidential base");
                        return false;
                    }
                }

                // deactivated, new anticipation handling is attempted instead
                /*
                 * if(task.sentence.getOccurenceTime()>memory.time() &&
                 * ((this.getCurrentTask()!=null && (this.getCurrentTask().isInput() ||
                 * this.getCurrentTask().sentence.producedByTemporalInduction)) ||
                 * (this.getCurrentBelief()!=null &&
                 * this.getCurrentBelief().producedByTemporalInduction))) {
                 * Anticipate ret = ((Anticipate)memory.getOperator("^anticipate"));
                 * if(ret!=null) {
                 * ret.anticipate(task.sentence.term, memory,
                 * task.sentence.getOccurenceTime(),task);
                 * }
                 * }
                 */

                task.setElemOfSequenceBuffer(false);
                if (!revised) {
                    // Java narrows both float operands before the multiplication;
                    // narrowing only the final JavaScript result changes Bag levels.
                    const durabilityLeak: float = Math.fround(this.narParameters.DERIVATION_DURABILITY_LEAK) as float;
                    const priorityLeak: float = Math.fround(this.narParameters.DERIVATION_PRIORITY_LEAK) as float;
                    task.getBudget().setDurability(Math.fround(
                        task.getBudget().getDurability() * durabilityLeak,
                    ) as float);
                    task.getBudget().setPriority(Math.fround(
                        task.getBudget().getPriority() * priorityLeak,
                    ) as float);
                }
                this.memory.event.emit(Events.TaskDerive.class, task, revised, single);
                // memory.logic.TASK_DERIVED.commit(task.budget.getPriority());

                if (addToMemory) {
                    this.addTask(task, "Derived");
                }
                return true;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /* --------------- new task building --------------- */
    /**
     * Shared final operations by all double-premise rules, called from the
     * rules except StructuralRules
     *
     * @param newContent The content of the sentence in task
     * @param newTruth   The truth value of the sentence in task
     * @param newBudget  The budget value in task
     */
    public doublePremiseTaskRevised(newContent: Term, newTruth: TruthValue,
        newBudget: BudgetValue, counter: long): boolean {
        let derived_stamp: Stamp = this.getTheNewStamp().clone();
        this.resetOccurrenceTime(); // stamp was already absorbed

        let isCounterValid: boolean = Number(counter as unknown as number) !== -1;
        let conclusionTerm: Term = newContent;
        if (isCounterValid) {
            // assert newContent is implication

            let conclusionSubject: Term = (conclusionTerm as Implication).getSubject();
            let conclusionPredicate: Term = (conclusionTerm as Implication).getPredicate();
            conclusionTerm = new Implication([conclusionSubject, conclusionPredicate],
                newContent.getTemporalOrder(), counter);
        }

        let newSentence: Sentence = new Sentence(
            conclusionTerm,
            this.getCurrentTask().sentence.punctuation,
            newTruth,
            derived_stamp);

        let newTask: Task = new Task(newSentence, newBudget, this.getCurrentBelief());

        return this.derivedTask(newTask, true, false, true); // allows overlap since overlap was already checked on
        // revisable( function
    } // which is not the case for other single premise tasks

    /**
     * Shared final operations by all double-premise rules, called from the
     * rules except StructuralRules
     *
     * @param newContent        The content of the sentence in task
     * @param newTruth          The truth value of the sentence in task
     * @param newBudget         The budget value in task
     * @param temporalInduction
     * @param overlapAllowed    //
     *                          https://groups.google.com/forum/#!topic/open-nars/FVbbKq5En-M
     */
    public doublePremiseTask(newContent: Term, newTruth: TruthValue, newBudget: BudgetValue,
        temporalInduction: boolean, overlapAllowed: boolean): NativeList<Task> | null;

    public doublePremiseTask(newContent: Term, newTruth: TruthValue, newBudget: BudgetValue,
        temporalInduction: boolean, overlapAllowed: boolean, addToMemory: boolean): NativeList<Task> | null;
    public doublePremiseTask(...args: unknown[]): NativeList<Task> | null {
        switch (args.length) {
            case 5: {
                const [newContent, newTruth, newBudget, temporalInduction, overlapAllowed] = args as [Term, TruthValue, BudgetValue, boolean, boolean];


                return this.doublePremiseTask(newContent, newTruth, newBudget, temporalInduction, overlapAllowed, true);


                break;
            }

            case 6: {
                const [newContent, newTruth, newBudget, temporalInduction, overlapAllowed, addToMemory] = args as [Term, TruthValue, BudgetValue, boolean, boolean, boolean];



                // Java original: List<Task>, implemented as ArrayList<Task>.
                // This is a local 0–2 item result buffer; expose the project
                // NativeList contract while preserving null for rejected results.
                const ret = new NativeList<Task>();
                if (newContent === null || !newBudget.aboveThreshold()) {
                    return null;
                }
                if ((newContent !== null) && (!(newContent instanceof Interval)) && (!(newContent instanceof Variable))) {

                    if (newContent.subjectOrPredicateIsIndependentVar()) {
                        return null;
                    }
                    let derive_stamp: Stamp = this.getTheNewStamp().clone(); // because occurrence time will be reset:
                    this.resetOccurrenceTime(); // stamp was already absorbed into task

                    let newSentence: Sentence = new Sentence(
                        newContent,
                        this.getCurrentTask().sentence.punctuation,
                        newTruth,
                        derive_stamp);

                    newSentence.producedByTemporalInduction = temporalInduction;
                    let newTask: Task = new Task(newSentence, newBudget, this.getCurrentBelief());

                    if (newTask !== null) {
                        let added: boolean = this.derivedTask(newTask, false, false, overlapAllowed, addToMemory);
                        if (added) {
                            ret.add(newTask);
                        }
                    }

                    // "Since in principle it is always valid to eternalize a tensed belief"
                    if (temporalInduction && this.narParameters.IMMEDIATE_ETERNALIZATION) {
                        // temporal induction generated ones get eternalized directly
                        let truthEt: TruthValue = TruthFunctions.eternalize(newTruth, this.narParameters);
                        let st: Stamp = derive_stamp.clone();
                        st.setEternal();
                        newSentence = new Sentence(
                            newContent,
                            this.getCurrentTask().sentence.punctuation,
                            truthEt,
                            st);

                        newSentence.producedByTemporalInduction = temporalInduction;
                        newTask = new Task(newSentence, newBudget, this.getCurrentBelief());
                        if (newTask !== null) {
                            let added: boolean = this.derivedTask(newTask, false, false, overlapAllowed, addToMemory);
                            if (added) {
                                ret.add(newTask);
                            }
                        }
                    }
                    return ret;
                }
                return null;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public singlePremiseTask(newSentence: Sentence, newBudget: BudgetValue): boolean;

    /**
     * Shared final operations by all single-premise rules, called in
     * StructuralRules
     *
     * @param newContent The content of the sentence in task
     * @param newTruth   The truth value of the sentence in task
     * @param newBudget  The budget value in task
     */
    public singlePremiseTask(newContent: Term, newTruth: TruthValue, newBudget: BudgetValue): boolean;

    /**
     * Shared final operations by all single-premise rules, called in
     * StructuralRules
     *
     * @param newContent  The content of the sentence in task
     * @param punctuation The punctuation of the sentence in task
     * @param newTruth    The truth value of the sentence in task
     * @param newBudget   The budget value in task
     */
    public singlePremiseTask(newContent: Term, punctuation: JavaChar, newTruth: TruthValue,
        newBudget: BudgetValue): boolean;
    public singlePremiseTask(...args: unknown[]): boolean {
        switch (args.length) {
            case 2: {
                const [newSentence, newBudget] = args as [Sentence, BudgetValue];


                if (!newBudget.aboveThreshold()) {
                    return false;
                }

                let newTask: Task = new Task(newSentence, newBudget, Task.EnumType.DERIVED);
                return this.derivedTask(newTask, false, true, false);


                break;
            }

            case 3: {
                const [newContent, newTruth, newBudget] = args as [Term, TruthValue, BudgetValue];


                return this.singlePremiseTask(newContent, this.getCurrentTask().sentence.punctuation, newTruth, newBudget);


                break;
            }

            case 4: {
                const [newContent, punctuation, newTruth, newBudget] = args as [Term, JavaChar, TruthValue, BudgetValue];


                if (!newBudget.aboveThreshold())
                    return false;

                let taskSentence: Sentence = this.getCurrentTask().sentence;
                const currentBelief = this.getCurrentBelief();
                if (taskSentence.isGoal() || taskSentence.isJudgment() || currentBelief === null) {
                    this.setTheNewStamp(new Stamp(taskSentence.stamp, this.getTime()));
                } else {
                    // to answer a question with negation in NAL-5 --- move to activated task?
                    this.setTheNewStamp(new Stamp(currentBelief.stamp, this.getTime()));
                }

                if (newContent.subjectOrPredicateIsIndependentVar()) {
                    return false;
                }

                if (newContent instanceof Interval) {
                    return false;
                }

                let derive_stamp: Stamp = this.getTheNewStamp().clone();
                this.resetOccurrenceTime(); // stamp was already absorbed into task

                let newSentence: Sentence = new Sentence(
                    newContent,
                    punctuation,
                    newTruth,
                    derive_stamp);

                let newTask: Task = new Task(newSentence, newBudget, Task.EnumType.DERIVED);
                return this.derivedTask(newTask, false, true, false); // * ℹ️ new之后的对象不会是null


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public getTime(): long {
        return this.time.time();
    }

    public getNewStamp(): Stamp | null {
        return this.newStamp;
    }

    public setNewStamp(newStamp: Stamp | null): void {
        this.newStamp = newStamp;
    }

    /**
     * @return the currentTask
     */
    public getCurrentTask(): Task {
        return this.requireCurrentTask();
    }

    public requireCurrentTask(): Task {
        const currentTask = this.currentTask;
        if (currentTask === null) {
            throw new JavaIllegalStateException("DerivationContext.currentTask is not initialized");
        }
        return currentTask;
    }

    /**
     * @param currentTask the currentTask to set
     */
    public setCurrentTask(currentTask: Task): void {
        this.currentTask = currentTask;
    }

    public setCurrentConcept(currentConcept: Concept): void {
        this.currentConcept = currentConcept;
    }

    private original_time: long = 0 as unknown as long;

    /**
     * @return the created stamp
     */
    public getTheNewStamp(): Stamp {
        let stamp = this.newStamp;
        if (stamp === null) {
            // if newStamp==null then newStampBuilder must be available. cache it's return
            // value as newStamp
            const builder = this.newStampBuilder;
            if (builder === null) {
                throw new JavaIllegalStateException("Cannot build new stamp without a StampBuilder");
            }
            stamp = builder.build();
            this.newStamp = stamp;
            this.original_time = stamp.getOccurrenceTime();
            this.newStampBuilder = null;
        }
        return stamp;
    }

    public resetOccurrenceTime(): void {
        const stamp = this.newStamp;
        if (stamp === null) {
            throw new JavaIllegalStateException("Cannot reset occurrence time without a new stamp");
        }
        stamp.setOccurrenceTime(this.original_time);
    }

    /**
     * @param newStamp the newStamp to set
     */
    public setTheNewStamp(newStamp: Stamp): Stamp;

    /**
     * creates a lazy/deferred StampBuilder which only constructs the stamp if
     * getTheNewStamp() is actually invoked
     */
    public setTheNewStamp(first: Stamp, second: Stamp, time: long): void;
    public setTheNewStamp(...args: unknown[]): Stamp | void {
        switch (args.length) {
            case 1: {
                const [newStamp] = args as [Stamp];


                this.newStamp = newStamp;
                this.newStampBuilder = null;
                return newStamp;


                break;
            }

            case 3: {
                const [first, second, time] = args as [Stamp, Stamp, long];


                this.newStamp = null;
                this.newStampBuilder = { build: () => new Stamp(first, second, time, this.narParameters) };


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /**
     * @return the currentBelief
     */
    public getCurrentBelief(): Sentence | null {
        return this.currentBelief;
    }

    /**
     * @param currentBelief the currentBelief to set
     */
    public setCurrentBelief(currentBelief: Sentence | null): void {
        this.currentBelief = currentBelief;
    }

    /**
     * @return the currentBeliefLink
     */
    public getCurrentBeliefLink(): TermLink | null {
        return this.currentBeliefLink;
    }

    /**
     * @param currentBeliefLink the currentBeliefLink to set
     */
    public setCurrentBeliefLink(currentBeliefLink: TermLink | null): void {
        this.currentBeliefLink = currentBeliefLink;
    }

    /**
     * @return the currentTaskLink
     */
    public getCurrentTaskLink(): TaskLink | null {
        return this.currentTaskLink;
    }

    public requireCurrentTaskLink(): TaskLink {
        const currentTaskLink = this.currentTaskLink;
        if (currentTaskLink === null) {
            throw new JavaIllegalStateException("DerivationContext.currentTaskLink is not initialized");
        }
        return currentTaskLink;
    }

    /**
     * @param currentTaskLink the currentTaskLink to set
     */
    public setCurrentTaskLink(currentTaskLink: TaskLink): void {
        this.currentTaskLink = currentTaskLink;
    }

    /**
     * @return the currentTerm
     */
    public getCurrentTerm(): Term {
        return this.requireCurrentTerm();
    }

    public requireCurrentTerm(): Term {
        const currentTerm = this.currentTerm;
        if (currentTerm === null) {
            throw new JavaIllegalStateException("DerivationContext.currentTerm is not initialized");
        }
        return currentTerm;
    }

    /**
     * @param currentTerm the currentTerm to set
     */
    public setCurrentTerm(currentTerm: Term): void {
        this.currentTerm = currentTerm;
    }

    /**
     * @return the currentConcept
     */
    public getCurrentConcept(): Concept | null {
        return this.currentConcept;
    }

    public requireCurrentConcept(): Concept {
        const currentConcept = this.currentConcept;
        if (currentConcept === null) {
            throw new JavaIllegalStateException("DerivationContext.currentConcept is not initialized");
        }
        return currentConcept;
    }

    public mem(): Memory {
        return this.memory;
    }

    /**
     * tasks added with this method will be remembered by this NAL instance; useful
     * for feedback
     */
    public addTask(t: Task, reason: JavaStringInput): void;

    /**
     * Activated task called in MatchingRules.trySolution and
     * Concept.processGoal
     *
     * @param budget          The budget value of the new Task
     * @param sentence        The content of the new Task
     * @param candidateBelief The belief to be used in future inference, for
     *                        forward/backward correspondence
     */
    public addTask(currentTask: Task, budget: BudgetValue, sentence: Sentence,
        candidateBelief: Sentence | null): void;
    public addTask(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [t, reason] = args as [Task, JavaStringInput];


                if (t.sentence.term === null) {
                    return;
                }
                this.memory.addNewTask(t, reason);


                break;
            }

            case 4: {
                const [currentTask, budget, sentence, candidateBelief] = args as [Task, BudgetValue, Sentence, Sentence | null];


                this.addTask(new Task(sentence, budget, sentence, candidateBelief as Sentence), "Activated");


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public toString(): string {
        return `DerivationContext[${this.currentConcept},${this.currentTaskLink}]`;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace DerivationContext {
    export interface StampBuilder {

        build(): Stamp;
    }

}


