


import { java, type float, type long, type double, JavaObject, S } from "jree";



/**
 * Operator that creates a judgment with a given statement
 */
export class Anticipate extends Operator implements EventObserver {

    public readonly anticipations: java.util.Map<Anticipate.Prediction, java.util.LinkedHashSet<Term>> | null = new java.util.LinkedHashMap();

    private newTasks: java.util.Set<Term> | null = new java.util.LinkedHashSet();

    private expiredTruth: TruthValue | null = null;
    private expiredBudget: BudgetValue | null = null;

    // internal experience has less durability?
    public ANTICIPATION_DURABILITY_MUL: float = 0.1; // 0.1
    // internal experience has less priority?
    public ANTICIPATION_PRIORITY_MUL: float = 0.1; // 0.1

    private nal: DerivationContext | null; // don't serialize, it will be re-set after deserialization

    public constructor();

    public constructor(ANTICIPATION_DURABILITY_MUL: float, ANTICIPATION_PRIORITY_MUL: float);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super("^anticipate");


                break;
            }

            case 2: {
                const [ANTICIPATION_DURABILITY_MUL, ANTICIPATION_PRIORITY_MUL] = args as [float, float];


                this();
                this.ANTICIPATION_DURABILITY_MUL = ANTICIPATION_DURABILITY_MUL;
                this.ANTICIPATION_PRIORITY_MUL = ANTICIPATION_PRIORITY_MUL;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(/* final */  n: Nar | null, /* final */  enabled: boolean): boolean {
        n.memory.event.set(this, enabled, Events.InduceSucceedingEvent.class, Events.CycleEnd.class);
        this.expiredTruth = new TruthValue(0.0, n.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, n.narParameters);
        this.expiredBudget = new BudgetValue(n.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            n.narParameters.DEFAULT_JUDGMENT_DURABILITY,
            BudgetFunctions.truthToQuality(this.expiredTruth), n.narParameters);
        return true;
    }

    public updateAnticipations(nal: DerivationContext | null): void {

        if (this.anticipations.isEmpty())
            return;

        let now: long = nal.time.time();

        // share stamps created by tasks in this cycle
        if (this.newTasks === null) {
            this.newTasks = new java.util.LinkedHashSet();
        }
        let hasNewTasks: boolean = !this.newTasks.isEmpty();

        let aei: java.util.Iterator<java.util.Map.Entry<Anticipate.Prediction, java.util.LinkedHashSet<Term>>> = this.anticipations.entrySet().iterator();
        while (aei.hasNext()) {

            let ae: java.util.Map.Entry<Anticipate.Prediction, java.util.LinkedHashSet<Term>> = aei.next();

            let aTime: long = ae.getKey().predictedOccurenceTime;
            let predictionstarted: long = ae.getKey().predictionCreationTime;
            if (aTime < predictionstarted) { // its about the past..
                return;
            }

            // lets say a and <(&/,a,+4) =/> b> leaded to prediction of b with specific
            // occurence time
            // this indicates that this interval can be reconstructed by looking by when the
            // prediction
            // happened and for what time it predicted, Only when the happening would
            // already lead to <(&/,a,+5) =/> b>
            // we are allowed to apply CWA already, i think this is the perfect time to do
            // this
            // since there is no way anymore that the observation would support <(&/,a,+4)
            // =/> b> at this time,
            // also this way it is not applied to early, it seems to be the perfect time to
            // me,
            // making hopeExpirationWindow parameter entirely osbolete
            let Int: Interval = new Interval(aTime - predictionstarted);
            // ok we know the magnitude now, let's now construct a interval with magnitude
            // one higher
            // (this we can skip because magnitudeToTime allows it without being explicitly
            // constructed)
            // ok, and what predicted occurence time would that be? because only if now is
            // bigger or equal, didnt happen is true
            let expiredate: double = predictionstarted + Int.time * nal.narParameters.ANTICIPATION_TOLERANCE;
            //

            let didntHappen: boolean = (now >= expiredate);
            let maybeHappened: boolean = hasNewTasks && !didntHappen;

            if ((!didntHappen) && (!maybeHappened))
                continue;

            let terms: java.util.LinkedHashSet<Term> = ae.getValue();

            let ii: java.util.Iterator<Term> = terms.iterator();
            while (ii.hasNext()) {
                let aTerm: Term = ii.next();

                let remove: boolean = false;

                if (didntHappen) {
                    this.deriveDidntHappen(aTerm, aTime, nal);
                    remove = true;
                }

                if (maybeHappened) {
                    if (this.newTasks === null) {
                        this.newTasks = new java.util.LinkedHashSet();
                    }
                    if (this.newTasks.remove(aTerm)) {
                        // in case it happened, temporal induction will do the rest, else
                        // deriveDidntHappen occurred
                        if (!remove) {
                            nal.memory.emit(CONFIRM.class, aTerm);
                        }
                        remove = true;
                        hasNewTasks = !this.newTasks.isEmpty();
                    }
                }

                if (remove)
                    ii.remove();
            }

            if (terms.isEmpty()) {
                // remove this time entry because its terms have been emptied
                aei.remove();
            }
        }

        if (this.newTasks === null) {
            this.newTasks = new java.util.LinkedHashSet();
        }
        this.newTasks.clear();
    }

    public event(/* final */  event: java.lang.Class<unknown> | null, /* final */  args: java.lang.Object[] | null): void {
        if (event === Events.InduceSucceedingEvent.class || event === Events.TaskDerive.class) {
            let newEvent: Task = args[0] as Task;
            let nal: DerivationContext = args[1] as DerivationContext;
            this.nal = nal;

            if (newEvent.sentence.truth !== null && newEvent.sentence.isJudgment()
                && newEvent.sentence.truth.getExpectation() > nal.narParameters.DEFAULT_CONFIRMATION_EXPECTATION
                && !newEvent.sentence.isEternal()) {
                if (this.newTasks === null) {
                    this.newTasks = new java.util.LinkedHashSet();
                }
                this.newTasks.add(newEvent.getTerm()); // new: always add but keep truth value in mind
            }
        }

        if (this.nal !== null && event === CycleEnd.class) {
            this.updateAnticipations(this.nal);
        }
    }

    // to create a judgment with a given statement
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
            /* final */  time: Timable | null): java.util.List<Task> | null {
        if (operation === null) {
            return null; // not as mental operator but as fundamental principle
        }

        this.anticipate(args[1], memory, time.time() + memory.narParameters.DURATION, null, time);

        return null;
    }

    protected anticipationOperator: boolean = true; // a parameter which tells whether NARS should know if it anticipated or not
    // in one case its the base functionality needed for NAL7 and in the other its a
    // mental NAL9 operator

    public isAnticipationAsOperator(): boolean {
        return this.anticipationOperator;
    }

    public setAnticipationAsOperator(/* final */  val: boolean): void {
        this.anticipationOperator = val;
    }

    public anticipate(/* final */  content: Term | null, /* final */  memory: Memory | null, /* final */  occurenceTime: long, /* final */  t: Task | null,
            /* final */  time: Timable | null): void {
        if (t !== null && t.sentence.truth.getExpectation() < memory.narParameters.DEFAULT_CONFIRMATION_EXPECTATION) {
            return;
        }

        if (t !== null) {
            memory.emit(ANTICIPATE.class, t);
        } else {
            memory.emit(ANTICIPATE.class, content);
        }

        let ae: java.util.LinkedHashSet<Term> = new java.util.LinkedHashSet();
        this.anticipations.put(new Prediction(time.time(), occurenceTime), ae);

        ae.add(content);
        this.anticipationFeedback(content, t, memory, time);
    }

    public anticipationFeedback(/* final */  content: Term | null, /* final */  t: Task | null, /* final */  memory: Memory | null, /* final */  time: Timable | null): void {
        if (this.anticipationOperator) {
            let op: Operation = Operation.make(Product.make(Term.SELF, content), this) as Operation;
            let truth: TruthValue = new TruthValue(1.0, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
                memory.narParameters);
            let st: Stamp;
            if (t === null) {
                st = new Stamp(time, memory);
            } else {
                st = t.sentence.stamp.clone();
                st.setOccurrenceTime(time.time());
            }

            let s: Sentence = new Sentence(
                op,
                Symbols.JUDGMENT_MARK,
                truth,
                st);

            let budgetForNewTask: BudgetValue = new BudgetValue(
                memory.narParameters.DEFAULT_JUDGMENT_PRIORITY * this.ANTICIPATION_PRIORITY_MUL,
                memory.narParameters.DEFAULT_JUDGMENT_DURABILITY * this.ANTICIPATION_DURABILITY_MUL,
                BudgetFunctions.truthToQuality(truth), memory.narParameters);
            let newTask: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);

            memory.addNewTask(newTask, "Perceived (Internal Experience: Anticipation)");
        }
    }

    protected deriveDidntHappen(/* final */  aTerm: Term | null, /* final */  expectedOccurenceTime: long, nal: DerivationContext | null): void {

        let truth: TruthValue = this.expiredTruth;
        let budget: BudgetValue = this.expiredBudget;

        let stamp: Stamp = new Stamp(nal.time, nal.memory);
        // stamp.setOccurrenceTime(nal.memory.time());
        stamp.setOccurrenceTime(expectedOccurenceTime); // it did not happen, so the time of when it did not
        // happen is exactly the time it was expected

        let S: Sentence = new Sentence(
            aTerm,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let task: Task = new Task(S, budget, Task.EnumType.INPUT);

        nal.derivedTask(task, false, true, false);
        task.setElemOfSequenceBuffer(true);
        nal.memory.emit(DISAPPOINT.class, task);
    }

    public Prediction = (($outer) => {
        return class Prediction extends JavaObject {
            public readonly predictionCreationTime: long; // 2014 and this is still the best way to define a data structure that
            // simple?
            public readonly predictedOccurenceTime: long;

            public constructor(/* final */  predictionCreationTime: long, /* final */  predictedOccurenceTime: long) { // rest of the crap:
                super();
                this.predictionCreationTime = predictionCreationTime; // when the prediction happened
                this.predictedOccurenceTime = predictedOccurenceTime; // when the event is expected
            }
        }
    })(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Anticipate {
    export type Prediction = InstanceType<Anticipate["Prediction"]>;
}


