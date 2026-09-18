//! Java source: opennars/operator/mental/Anticipate.java
import { java, S } from "jree";
import type { float, long, double } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import type { DerivationContext } from "../../control/DerivationContext.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import { toRuntimeLong, type JavaLongInput } from "../../runtime/jree-compat.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Events } from "../../io/events/Events.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";
import { OutputHandler } from "../../io/events/OutputHandler.ts";
import { Interval } from "../../language/Interval.ts";
import { Product } from "../../language/Product.ts";
import { Term } from "../../language/Term.ts";
import type { Nar } from "../../main/Nar.ts";
import { Operation } from "../Operation.ts";
import { Operator } from "../Operator.ts";
import type { Memory } from "../../storage/Memory.ts";
import { NativeMap } from "../../runtime/NativeMap.ts";
import { NativeSet } from "../../runtime/NativeSet.ts";

const CycleEnd = Events.CycleEnd;
const ANTICIPATE = OutputHandler.ANTICIPATE;
const CONFIRM = OutputHandler.CONFIRM;
const DISAPPOINT = OutputHandler.DISAPPOINT;



/**
 * Operator that creates a judgment with a given statement
 */
export class Anticipate extends Operator implements EventEmitter.EventObserver {

    // Java source: Map<Prediction, LinkedHashSet<Term>> backed by LinkedHashMap.
    // Keep the outer Map abstraction and Java Object-identity key semantics:
    // Prediction has no equals/hashCode override. NativeMap replaces only the
    // concrete Map implementation; NativeSet preserves value membership, order,
    // and Iterator.remove() for each prediction's terms.
    public readonly anticipations: java.util.Map<Anticipate.Prediction, NativeSet<Term>> =
        new NativeMap<Anticipate.Prediction, NativeSet<Term>>() as unknown as java.util.Map<Anticipate.Prediction, NativeSet<Term>>;

    // Java source: transient Set<Term> newTasks = new LinkedHashSet<>();
    // NativeSet preserves Java equals-based uniqueness and insertion order.
    private newTasks: NativeSet<Term> = new NativeSet<Term>();

    private expiredTruth: TruthValue = null as unknown as TruthValue;
    private expiredBudget: BudgetValue = null as unknown as BudgetValue;

    // internal experience has less durability?
    public ANTICIPATION_DURABILITY_MUL: float = Float32Math.from(0.1) as float; // 0.1
    // internal experience has less priority?
    public ANTICIPATION_PRIORITY_MUL: float = Float32Math.from(0.1) as float; // 0.1

    private nal: DerivationContext = null as unknown as DerivationContext; // don't serialize, it will be re-set after deserialization

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


                super("^anticipate");
                this.ANTICIPATION_DURABILITY_MUL = Float32Math.from(ANTICIPATION_DURABILITY_MUL) as float;
                this.ANTICIPATION_PRIORITY_MUL = Float32Math.from(ANTICIPATION_PRIORITY_MUL) as float;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(n: Nar, enabled: boolean): boolean {
        n.memory.event.set(this, enabled, Events.InduceSucceedingEvent.class, Events.CycleEnd.class);
        this.expiredTruth = TruthValue.fromFrequencyConfidence(0.0, n.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, n.narParameters);
        this.expiredBudget = new BudgetValue(n.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            n.narParameters.DEFAULT_JUDGMENT_DURABILITY,
            BudgetFunctions.truthToQuality(this.expiredTruth), n.narParameters);
        return true;
    }

    public updateAnticipations(nal: DerivationContext): void {

        if (this.anticipations.isEmpty())
            return;

        let now: long = nal.time.time();

        // share stamps created by tasks in this cycle
        if (this.newTasks === null) {
            this.newTasks = new NativeSet<Term>();
        }
        let hasNewTasks: boolean = !this.newTasks.isEmpty();
        // Java source removes the current Map entry through a live entry
        // iterator. jree's LinkedHashMap iterator does not implement remove;
        // keep the Map abstraction and defer those removals until traversal
        // completes. The array is only a temporary ordered key accumulator.
        const predictionsToRemove: Anticipate.Prediction[] = [];

        let aei: java.util.Iterator<java.util.Map.Entry<Anticipate.Prediction, NativeSet<Term>>> = this.anticipations.entrySet().iterator();
        while (aei.hasNext()) {

            let ae: java.util.Map.Entry<Anticipate.Prediction, NativeSet<Term>> = aei.next();

            let aTime: long = ae.getKey().predictedOccurenceTime;
            let predictionstarted: long = ae.getKey().predictionCreationTime;
            if (aTime < predictionstarted) { // its about the past..
                for (const prediction of predictionsToRemove) {
                    this.anticipations.remove(prediction);
                }
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
            let expiredate: double = Number(predictionstarted as unknown as number)
                + Number(Int.time as unknown as number) * nal.narParameters.ANTICIPATION_TOLERANCE;
            //

            let didntHappen: boolean = (now >= expiredate);
            let maybeHappened: boolean = hasNewTasks && !didntHappen;

            if ((!didntHappen) && (!maybeHappened))
                continue;

            let terms: NativeSet<Term> = ae.getValue();

            const ii = terms.iterator();
            while (ii.hasNext()) {
                let aTerm: Term = ii.next();

                let remove: boolean = false;

                if (didntHappen) {
                    this.deriveDidntHappen(aTerm, aTime, nal);
                    remove = true;
                }

                if (maybeHappened) {
                    if (this.newTasks === null) {
                        this.newTasks = new NativeSet<Term>();
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
                predictionsToRemove.push(ae.getKey());
            }
        }

        for (const prediction of predictionsToRemove) {
            this.anticipations.remove(prediction);
        }

        if (this.newTasks === null) {
            this.newTasks = new NativeSet<Term>();
        }
        this.newTasks.clear();
    }

    public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
        if (event === Events.InduceSucceedingEvent.class || event === Events.TaskDerive.class) {
            let newEvent: Task = args[0] as Task;
            let nal: DerivationContext = args[1] as unknown as DerivationContext;
            this.nal = nal;

            if (newEvent.sentence.truth !== null && newEvent.sentence.isJudgment()
                && newEvent.sentence.truth.getExpectation() > nal.narParameters.DEFAULT_CONFIRMATION_EXPECTATION
                && !newEvent.sentence.isEternal()) {
                if (this.newTasks === null) {
                    this.newTasks = new NativeSet<Term>();
                }
                this.newTasks.add(newEvent.getTerm()); // new: always add but keep truth value in mind
            }
        }

        if (this.nal !== null && event === CycleEnd.class) {
            this.updateAnticipations(this.nal);
        }
    }

    // to create a judgment with a given statement
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> {
        if (operation === null) {
            return null as unknown as java.util.List<Task>; // not as mental operator but as fundamental principle
        }

        this.anticipate(args[1], memory,
            (Number(time.time() as unknown as number) + memory.narParameters.DURATION) as unknown as long,
            null as unknown as Task, time);

        return null as unknown as java.util.List<Task>;
    }

    protected anticipationOperator: boolean = true; // a parameter which tells whether NARS should know if it anticipated or not
    // in one case its the base functionality needed for NAL7 and in the other its a
    // mental NAL9 operator

    public isAnticipationAsOperator(): boolean {
        return this.anticipationOperator;
    }

    public setAnticipationAsOperator(val: boolean): void {
        this.anticipationOperator = val;
    }

    public anticipate(content: Term, memory: Memory, occurenceTime: JavaLongInput, t: Task | null,
        time: Timable): void {
        if (t !== null && t.sentence.getTruth().getExpectation() < memory.narParameters.DEFAULT_CONFIRMATION_EXPECTATION) {
            return;
        }

        if (t !== null) {
            memory.emit(ANTICIPATE.class, t);
        } else {
            memory.emit(ANTICIPATE.class, content);
        }

        // Java source: final LinkedHashSet<Term> ae = new LinkedHashSet<>();
        const ae = new NativeSet<Term>();
        this.anticipations.put(new this.Prediction(time.time(), toRuntimeLong(occurenceTime)), ae);

        ae.add(content);
        this.anticipationFeedback(content, t, memory, time);
    }

    public anticipationFeedback(content: Term, t: Task | null, memory: Memory, time: Timable): void {
        if (this.anticipationOperator) {
            let op: Operation = Operation.make(Product.make(Term.SELF, content), this) as Operation;
            let truth: TruthValue = TruthValue.fromFrequencyConfidence(1.0, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
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

            memory.addNewTask(newTask, S`Perceived (Internal Experience: Anticipation)`);
        }
    }

    protected deriveDidntHappen(aTerm: Term, expectedOccurenceTime: long, nal: DerivationContext): void {

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

    // Java source: package-private class Prediction.
    // It is a plain identity-key data holder; no JavaObject, equals/hashCode,
    // reflection, or serialization behavior is consumed by this module.
    public Prediction = (($outer) => {
        return class Prediction {
            public readonly predictionCreationTime: long; // 2014 and this is still the best way to define a data structure that
            // simple?
            public readonly predictedOccurenceTime: long;

            public constructor(predictionCreationTime: JavaLongInput, predictedOccurenceTime: JavaLongInput) { // rest of the crap:
                this.predictionCreationTime = toRuntimeLong(predictionCreationTime); // when the prediction happened
                this.predictedOccurenceTime = toRuntimeLong(predictedOccurenceTime); // when the event is expected
            }
        }
    })(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Anticipate {
    export type Prediction = InstanceType<Anticipate["Prediction"]>;
}


