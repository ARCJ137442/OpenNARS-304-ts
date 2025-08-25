import { java, JavaObject, type double, type long, type char, S } from "jree";



/**
 * NAL Reasoner Process. Includes all reasoning process state.
 *
 * @author Patrick Hammer
 */
export class DerivationContext extends JavaObject {
    public evidentialOverlap: boolean = false;
    public readonly memory: Memory | null;
    protected currentTerm: Term | null;
    protected currentConcept: Concept | null;
    protected currentTask: Task | null;
    protected currentBeliefLink: TermLink | null;
    protected currentTaskLink: TaskLink | null;
    protected currentBelief: Sentence | null;
    protected newStamp: Stamp | null;
    public newStampBuilder: DerivationContext.StampBuilder | null;

    public narParameters: java.security.Policy.Parameters | null;

    public time: Timable | null;

    public constructor(/* final */  mem: Memory | null, /* final */  narParameters: java.security.Policy.Parameters | null, /* final */  time: Timable | null) {
        super();
        this.memory = mem;
        this.narParameters = narParameters;
        this.time = time;
    }

    public emit(/* final */  c: java.lang.Class<unknown> | null, /* final */ ...o: java.lang.Object | null[]): void {
        this.memory.emit(c, o);
    }

    /**
     * Derived task comes from the inference rules.
     *
     * @param task           the derived task
     * @param overlapAllowed //https://groups.google.com/forum/#!topic/open-nars/FVbbKq5En-M
     */
    public derivedTask(/* final */  task: Task | null, /* final */  revised: boolean, /* final */  single: boolean,
            /* final */  overlapAllowed: boolean): boolean;

    public derivedTask(/* final */  task: Task | null, /* final */  revised: boolean, /* final */  single: boolean,
            /* final */  overlapAllowed: boolean, /* final */  addToMemory: boolean): boolean;
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
                if (!task.budget.aboveThreshold()) {
                    this.memory.removeTask(task, "Insufficient Budget");
                    return false;
                }
                if (task.sentence !== null && task.sentence.truth !== null) {
                    let conf: double = task.sentence.truth.getConfidence();
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
                    task.getBudget().setDurability(task.getBudget().getDurability() * this.narParameters.DERIVATION_DURABILITY_LEAK);
                    task.getBudget().setPriority(task.getBudget().getPriority() * this.narParameters.DERIVATION_PRIORITY_LEAK);
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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public doublePremiseTaskRevised(/* final */  newContent: Term | null, /* final */  newTruth: TruthValue | null,
            /* final */  newBudget: BudgetValue | null, /* final */  counter: long): boolean {
        let derived_stamp: Stamp = this.getTheNewStamp().clone();
        this.resetOccurrenceTime(); // stamp was already absorbed

        let isCounterValid: boolean = counter !== -1;
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
    public doublePremiseTask(/* final */  newContent: Term | null, /* final */  newTruth: TruthValue | null, /* final */  newBudget: BudgetValue | null,
            /* final */  temporalInduction: boolean, /* final */  overlapAllowed: boolean): java.util.List<Task> | null;

    public doublePremiseTask(/* final */  newContent: Term | null, /* final */  newTruth: TruthValue | null, /* final */  newBudget: BudgetValue | null,
            /* final */  temporalInduction: boolean, /* final */  overlapAllowed: boolean, /* final */  addToMemory: boolean): java.util.List<Task> | null;
    public doublePremiseTask(...args: unknown[]): java.util.List<Task> | null {
        switch (args.length) {
            case 5: {
                const [newContent, newTruth, newBudget, temporalInduction, overlapAllowed] = args as [Term, TruthValue, BudgetValue, boolean, boolean];


                return this.doublePremiseTask(newContent, newTruth, newBudget, temporalInduction, overlapAllowed, true);


                break;
            }

            case 6: {
                const [newContent, newTruth, newBudget, temporalInduction, overlapAllowed, addToMemory] = args as [Term, TruthValue, BudgetValue, boolean, boolean, boolean];



                let ret: java.util.List<Task> = new java.util.ArrayList();
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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public singlePremiseTask(/* final */  newSentence: Sentence | null, /* final */  newBudget: BudgetValue | null): boolean;

    /**
     * Shared final operations by all single-premise rules, called in
     * StructuralRules
     *
     * @param newContent The content of the sentence in task
     * @param newTruth   The truth value of the sentence in task
     * @param newBudget  The budget value in task
     */
    public singlePremiseTask(/* final */  newContent: Term | null, /* final */  newTruth: TruthValue | null, /* final */  newBudget: BudgetValue | null): boolean;

    /**
     * Shared final operations by all single-premise rules, called in
     * StructuralRules
     *
     * @param newContent  The content of the sentence in task
     * @param punctuation The punctuation of the sentence in task
     * @param newTruth    The truth value of the sentence in task
     * @param newBudget   The budget value in task
     */
    public singlePremiseTask(newContent: Term | null, /* final */  punctuation: char, /* final */  newTruth: TruthValue | null,
            /* final */  newBudget: BudgetValue | null): boolean;
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
                const [newContent, punctuation, newTruth, newBudget] = args as [Term, char, TruthValue, BudgetValue];


                if (!newBudget.aboveThreshold())
                    return false;

                let taskSentence: Sentence = this.getCurrentTask().sentence;
                if (taskSentence.isGoal() || taskSentence.isJudgment() || this.getCurrentBelief() === null) {
                    this.setTheNewStamp(new Stamp(taskSentence.stamp, this.getTime()));
                } else {
                    // to answer a question with negation in NAL-5 --- move to activated task?
                    this.setTheNewStamp(new Stamp(this.getCurrentBelief().stamp, this.getTime()));
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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public getTime(): long {
        return this.time.time();
    }

    public getNewStamp(): Stamp | null {
        return this.newStamp;
    }

    public setNewStamp(/* final */  newStamp: Stamp | null): void {
        this.newStamp = newStamp;
    }

    /**
     * @return the currentTask
     */
    public getCurrentTask(): Task | null {
        return this.currentTask;
    }

    /**
     * @param currentTask the currentTask to set
     */
    public setCurrentTask(/* final */  currentTask: Task | null): void {
        this.currentTask = currentTask;
    }

    public setCurrentConcept(/* final */  currentConcept: Concept | null): void {
        this.currentConcept = currentConcept;
    }

    private original_time: long = 0;

    /**
     * @return the created stamp
     */
    public getTheNewStamp(): Stamp | null {
        if (this.newStamp === null) {
            // if newStamp==null then newStampBuilder must be available. cache it's return
            // value as newStamp
            this.newStamp = this.newStampBuilder.build();
            this.original_time = this.newStamp.getOccurrenceTime();
            this.newStampBuilder = null;
        }
        return this.newStamp;
    }

    public resetOccurrenceTime(): void {
        this.newStamp.setOccurrenceTime(this.original_time);
    }

    /**
     * @param newStamp the newStamp to set
     */
    public setTheNewStamp(/* final */  newStamp: Stamp | null): Stamp | null;

    /**
     * creates a lazy/deferred StampBuilder which only constructs the stamp if
     * getTheNewStamp() is actually invoked
     */
    public setTheNewStamp(/* final */  first: Stamp | null, /* final */  second: Stamp | null, /* final */  time: long): void;
    public setTheNewStamp(...args: unknown[]): Stamp | null | void {
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
                this.newStampBuilder = () => new Stamp(first, second, time, this.narParameters);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public setCurrentBelief(/* final */  currentBelief: Sentence | null): void {
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
    public setCurrentBeliefLink(/* final */  currentBeliefLink: TermLink | null): void {
        this.currentBeliefLink = currentBeliefLink;
    }

    /**
     * @return the currentTaskLink
     */
    public getCurrentTaskLink(): TaskLink | null {
        return this.currentTaskLink;
    }

    /**
     * @param currentTaskLink the currentTaskLink to set
     */
    public setCurrentTaskLink(/* final */  currentTaskLink: TaskLink | null): void {
        this.currentTaskLink = currentTaskLink;
    }

    /**
     * @return the currentTerm
     */
    public getCurrentTerm(): Term | null {
        return this.currentTerm;
    }

    /**
     * @param currentTerm the currentTerm to set
     */
    public setCurrentTerm(/* final */  currentTerm: Term | null): void {
        this.currentTerm = currentTerm;
    }

    /**
     * @return the currentConcept
     */
    public getCurrentConcept(): Concept | null {
        return this.currentConcept;
    }

    public mem(): Memory | null {
        return this.memory;
    }

    /**
     * tasks added with this method will be remembered by this NAL instance; useful
     * for feedback
     */
    public addTask(/* final */  t: Task | null, /* final */  reason: java.lang.String | null): void;

    /**
     * Activated task called in MatchingRules.trySolution and
     * Concept.processGoal
     *
     * @param budget          The budget value of the new Task
     * @param sentence        The content of the new Task
     * @param candidateBelief The belief to be used in future inference, for
     *                        forward/backward correspondence
     */
    public addTask(/* final */  currentTask: Task | null, /* final */  budget: BudgetValue | null, /* final */  sentence: Sentence | null,
            /* final */  candidateBelief: Sentence | null): void;
    public addTask(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [t, reason] = args as [Task, java.lang.String];


                if (t.sentence.term === null) {
                    return;
                }
                this.memory.addNewTask(t, reason);


                break;
            }

            case 4: {
                const [currentTask, budget, sentence, candidateBelief] = args as [Task, BudgetValue, Sentence, Sentence];


                this.addTask(new Task(sentence, budget, sentence, candidateBelief), "Activated");


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public override  toString(): java.lang.String | null {
        return "DerivationContext[" + this.currentConcept + "," + this.currentTaskLink + "]";
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace DerivationContext {
    export interface StampBuilder {

        build(): Stamp;
    }

}


