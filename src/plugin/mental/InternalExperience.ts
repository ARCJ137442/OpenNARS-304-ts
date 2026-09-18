//! Java source: opennars/plugin/mental/InternalExperience.java
import { java, S } from "jree";
import type { float, double, int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { TemporalRules } from "../../inference/TemporalRules.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Conjunction } from "../../language/Conjunction.ts";
import { Implication } from "../../language/Implication.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { Interval } from "../../language/Interval.ts";
import { Product } from "../../language/Product.ts";
import { Term } from "../../language/Term.ts";
import { truthToWordTerm } from "../../entity/TruthValueTerm.ts";
import { Events } from "../../io/events/Events.ts";
import { Operation } from "../../operator/Operation.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Nar } from "../../main/Nar.ts";
import type { DerivationContext } from "../../control/DerivationContext.ts";
import type { Operator } from "../../operator/Operator.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Plugin } from "../Plugin.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";

type EventObserver = EventEmitter.EventObserver;



/**
 * To rememberAction an internal action as an operation
 * <p>
 * called from Concept
 */
// Java source declares a plain Plugin/EventObserver implementation without a
// JavaObject base; the event observer contract remains explicit below.
export class InternalExperience implements Plugin, EventObserver {
    private memory: Memory | null = null;

    public static enabled: boolean = false;

    private nar: Nar | null = null;

    public MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC: float = Float32Math.from(0.3) as float;
    public MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE: float = Float32Math.from(0.3) as float;

    // internal experience has less durability?
    public INTERNAL_EXPERIENCE_PROBABILITY: float = Float32Math.from(0.0001) as float;

    // internal experience has less durability?
    public INTERNAL_EXPERIENCE_DURABILITY_MUL: float = Float32Math.from(0.1) as float; // 0.1

    // internal experience has less priority?
    public INTERNAL_EXPERIENCE_PRIORITY_MUL: float = Float32Math.from(0.1) as float; // 0.1

    /** less probable form */
    public INTERNAL_EXPERIENCE_RARE_PROBABILITY: float = Float32Math.from(0.000025) as float;

    /** dont use internal experience for want and believe if this setting is true */
    public ALLOW_WANT_BELIEF: boolean = true;

    // https://groups.google.com/forum/#!topic/open-nars/DVE5FJd7FaM
    public OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY: boolean = false;

    public FULL_REFLECTION: boolean = false;

    public setMINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC(val: double): void {
        this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC = Float32Math.from(val) as float;
    }

    public getMINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC(): double {
        return this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC;
    }

    public setMINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE(val: double): void {
        this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE = Float32Math.from(val) as float;
    }

    public getMINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE(): double {
        return this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE;
    }

    public setINTERNAL_EXPERIENCE_PROBABILITY(val: double): void {
        this.INTERNAL_EXPERIENCE_PROBABILITY = Float32Math.from(val) as float;
    }

    public getINTERNAL_EXPERIENCE_PROBABILITY(): double {
        return this.INTERNAL_EXPERIENCE_PROBABILITY;
    }

    public setINTERNAL_EXPERIENCE_RARE_PROBABILITY(val: double): void {
        this.INTERNAL_EXPERIENCE_RARE_PROBABILITY = Float32Math.from(val) as float;
    }

    public getINTERNAL_EXPERIENCE_RARE_PROBABILITY(): double {
        return this.INTERNAL_EXPERIENCE_RARE_PROBABILITY;
    }

    public setINTERNAL_EXPERIENCE_DURABILITY_MUL(val: double): void {
        this.INTERNAL_EXPERIENCE_DURABILITY_MUL = Float32Math.from(val) as float;
    }

    public getINTERNAL_EXPERIENCE_DURABILITY_MUL(): double {
        return this.INTERNAL_EXPERIENCE_DURABILITY_MUL;
    }

    public setINTERNAL_EXPERIENCE_PRIORITY_MUL(val: double): void {
        this.INTERNAL_EXPERIENCE_PRIORITY_MUL = Float32Math.from(val) as float;
    }

    public getINTERNAL_EXPERIENCE_PRIORITY_MUL(): double {
        return this.INTERNAL_EXPERIENCE_PRIORITY_MUL;
    }

    public isALLOW_WANT_BELIEF(): boolean {
        return this.ALLOW_WANT_BELIEF;
    }

    public setALLOW_WANT_BELIEF(val: boolean): void {
        this.ALLOW_WANT_BELIEF = val;
    }

    public isOLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY(): boolean {
        return this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY;
    }

    public setOLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY(val: boolean): void {
        this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY = val;
    }

    public isFULL_REFLECTION(): boolean {
        return this.FULL_REFLECTION;
    }

    public setFULL_REFLECTION(val: boolean): void {
        this.FULL_REFLECTION = val;
    }

    public constructor();

    public constructor(MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC: float,
        MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE: float,
        INTERNAL_EXPERIENCE_PROBABILITY: float,
        INTERNAL_EXPERIENCE_RARE_PROBABILITY: float,
        INTERNAL_EXPERIENCE_DURABILITY_MUL: float,
        INTERNAL_EXPERIENCE_PRIORITY_MUL: float,
        ALLOW_WANT_BELIEF: boolean,
        OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY: boolean,
        FULL_REFLECTION: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                break;
            }

            case 9: {
                const [MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC, MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE, INTERNAL_EXPERIENCE_PROBABILITY, INTERNAL_EXPERIENCE_RARE_PROBABILITY, INTERNAL_EXPERIENCE_DURABILITY_MUL, INTERNAL_EXPERIENCE_PRIORITY_MUL, ALLOW_WANT_BELIEF, OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY, FULL_REFLECTION] = args as [float, float, float, float, float, float, boolean, boolean, boolean];

                this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC = Float32Math.from(MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC) as float;
                this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE = Float32Math.from(MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE) as float;
                this.INTERNAL_EXPERIENCE_PROBABILITY = Float32Math.from(INTERNAL_EXPERIENCE_PROBABILITY) as float;
                this.INTERNAL_EXPERIENCE_RARE_PROBABILITY = Float32Math.from(INTERNAL_EXPERIENCE_RARE_PROBABILITY) as float;
                this.INTERNAL_EXPERIENCE_DURABILITY_MUL = Float32Math.from(INTERNAL_EXPERIENCE_DURABILITY_MUL) as float;
                this.INTERNAL_EXPERIENCE_PRIORITY_MUL = Float32Math.from(INTERNAL_EXPERIENCE_PRIORITY_MUL) as float;
                this.ALLOW_WANT_BELIEF = ALLOW_WANT_BELIEF;
                this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY = OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY;
                this.FULL_REFLECTION = FULL_REFLECTION;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(n: Nar, enable: boolean): boolean {
        this.memory = n.memory;
        this.nar = n;

        this.memory.event.set(this, enable, Events.ConceptDirectProcessedTask.class);

        if (this.FULL_REFLECTION)
            this.memory.event.set(this, enable, Events.BeliefReason.class);

        InternalExperience.enabled = enable;

        return true;
    }

    public static toTerm(s: Sentence, mem: Memory, time: Timable): Term | null {
        let opName: java.lang.String;
        switch (s.punctuation) {
            case Symbols.JUDGMENT_MARK:
                opName = S`^believe`;
                if (!mem.internalExperience.ALLOW_WANT_BELIEF) {
                    return null;
                }
                break;
            case Symbols.GOAL_MARK:
                opName = S`^want`;
                if (!mem.internalExperience.ALLOW_WANT_BELIEF) {
                    return null;
                }
                break;
            case Symbols.QUESTION_MARK:
                opName = S`^wonder`;
                break;
            case Symbols.QUEST_MARK:
                opName = S`^evaluate`;
                break;
            default:
                return null;
        }

        let opTerm: Term = mem.getOperator(opName);
        let arg: Term[] = new Array<Term>(s.truth === null ? 2 : 3);
        arg[0] = Term.SELF;
        arg[1] = s.getTerm();
        if (s.truth !== null) {
            arg[2] = truthToWordTerm(s.projection(time.time(), time.time(), mem).getTruth());
        }

        // Operation.make ?
        let operation: Term = Inheritance.make(new Product(arg), opTerm);
        if (operation === null) {
            throw new java.lang.IllegalStateException(
                S`Unable to create Inheritance: ${opTerm}, ${java.util.Arrays.toString(arg)}`);
        }
        return operation;
    }

    public event(event: java.lang.Class<unknown>, a: java.lang.Object[]): void {

        if (event === Events.ConceptDirectProcessedTask.class) {
            const memory = this.memory;
            const nar = this.nar;
            if (memory === null || nar === null) {
                return;
            }
            let task: Task = a[0] as Task;

            // old strategy always, new strategy only for QUESTION and QUEST:
            if (this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY || (!this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY
                && (task.sentence.punctuation === Symbols.QUESTION_MARK
                    || task.sentence.punctuation === Symbols.QUEST_MARK))) {
                InternalExperience.InternalExperienceFromTaskInternal(memory, task, this.FULL_REFLECTION, nar);
            }
        } else if (event === Events.BeliefReason.class) {
            // belief, beliefTerm, taskTerm, nal
            let belief: Sentence = a[0] as Sentence;
            let beliefTerm: Term = a[1] as Term;
            let taskTerm: Term = a[2] as Term;
            let nal: DerivationContext = a[3] as unknown as DerivationContext;
            this.beliefReason(belief, beliefTerm, taskTerm, nal);
        }
    }

    public static InternalExperienceFromBelief(memory: Memory, task: Task, belief: Sentence,
        time: Timable): void {
        let newTask: Task = new Task(belief.clone(), task.getBudget().clone(), Task.EnumType.INPUT);

        InternalExperience.InternalExperienceFromTask(memory, newTask, false, time);
    }

    public static InternalExperienceFromTask(memory: Memory, task: Task, full: boolean,
        time: Timable): void {
        if (memory.internalExperience === null) {
            return;
        }
        if (!memory.internalExperience.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY) {
            InternalExperience.InternalExperienceFromTaskInternal(memory, task, full, time);
        }
    }

    public static InternalExperienceFromTaskInternal(memory: Memory, task: Task, full: boolean,
        time: Timable): boolean {
        if (!InternalExperience.enabled) {
            return false;
        }

        // if(OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY ||
        // (!OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY &&
        // (task.sentence.punctuation==Symbols.QUESTION_MARK ||
        // task.sentence.punctuation==Symbols.QUEST_MARK))) {
        {
            if (task.sentence.punctuation === Symbols.QUESTION_MARK || task.sentence.punctuation === Symbols.QUEST_MARK) {
                if (task.getPriority() < memory.internalExperience.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE) {
                    return false;
                }
            } else if (task.getPriority() < memory.internalExperience.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC) {
                return false;
            }
        }

        let content: Term = task.getTerm();
        // to prevent infinite recursions
        if (content instanceof Operation/*
                                         * || nal.memory.randomNumber.nextDouble()>Parameters.
                                         * INTERNAL_EXPERIENCE_PROBABILITY
                                         */) {
            return true;
        }
        let sentence: Sentence = task.sentence;
        let truth: TruthValue = TruthValue.fromFrequencyConfidence(1.0, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);
        let stamp: Stamp = task.sentence.stamp.clone();
        stamp.setOccurrenceTime(time.time());
        let ret: Term | null = InternalExperience.toTerm(sentence, memory, time);
        if (ret === null) {
            return true;
        }
        let j: Sentence = new Sentence(
            ret,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let newbudget: BudgetValue = new BudgetValue(
            memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE
            * memory.internalExperience.INTERNAL_EXPERIENCE_PRIORITY_MUL,
            memory.narParameters.DEFAULT_JUDGMENT_PRIORITY
            * memory.internalExperience.INTERNAL_EXPERIENCE_DURABILITY_MUL,
            BudgetFunctions.truthToQuality(truth), memory.narParameters);

        if (!memory.internalExperience.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY) {
            newbudget.setPriority(task.getPriority() * memory.internalExperience.INTERNAL_EXPERIENCE_PRIORITY_MUL);
            newbudget
                .setDurability(task.getDurability() * memory.internalExperience.INTERNAL_EXPERIENCE_DURABILITY_MUL);
        }

        let newTask: Task = new Task(j, newbudget, Task.EnumType.INPUT);

        memory.addNewTask(newTask, S`Reflected mental operation (Internal Experience)`);
        return false;
    }

    protected static readonly nonInnateBeliefOperators: java.lang.String[] = [
        S`^remind`, S`^doubt`, S`^consider`, S`^evaluate`, S`hestitate`, S`^wonder`, S`^belief`, S`^want`
    ];

    /** used in full internal experience mode only */
    protected beliefReason(belief: Sentence, beliefTerm: Term, taskTerm: Term,
        nal: DerivationContext): void {

        let memory: Memory = nal.memory;

        if (nal.memory.randomNumber.nextDouble() < this.INTERNAL_EXPERIENCE_RARE_PROBABILITY) {

            // the operators which dont have a innate belief
            // also get a chance to reveal its effects to the system this way
            let op: Operator = memory.getOperator(
                InternalExperience.nonInnateBeliefOperators[nal.memory.randomNumber.nextInt(InternalExperience.nonInnateBeliefOperators.length)]);

            let prod: Product = new Product(belief.term);

            if (op !== null && prod !== null) {

                let new_term: Term = Inheritance.make(prod, op);
                let sentence: Sentence = new Sentence(
                    new_term,
                    Symbols.GOAL_MARK,
                    TruthValue.fromFrequencyConfidence(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, memory.narParameters), // a
                    // naming
                    // convension
                    new Stamp(nal.time, memory));

                let quality: float = BudgetFunctions.truthToQuality(sentence.getTruth());
                let budget: BudgetValue = new BudgetValue(
                    memory.narParameters.DEFAULT_GOAL_PRIORITY * this.INTERNAL_EXPERIENCE_PRIORITY_MUL,
                    memory.narParameters.DEFAULT_GOAL_DURABILITY * this.INTERNAL_EXPERIENCE_DURABILITY_MUL,
                    quality, memory.narParameters);

                let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

                nal.derivedTask(newTask, false, false, false);
            }
        }

        if (beliefTerm instanceof Implication
            && nal.memory.randomNumber.nextDouble() <= this.INTERNAL_EXPERIENCE_PROBABILITY) {
            let imp: Implication = beliefTerm as Implication;
            if (imp.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                // 1. check if its (&/,term,+i1,...,+in) =/> anticipateTerm form:
                let valid: boolean = true;
                if (imp.getSubject() instanceof Conjunction) {
                    let conj: Conjunction = imp.getSubject() as Conjunction;
                    if (!conj.term[0].equals(taskTerm)) {
                        valid = false; // the expected needed term is not included
                    }
                    for (let i: int = 1; i < conj.term.length; i++) {
                        if (!(conj.term[i] instanceof Interval)) {
                            valid = false;
                            break;
                        }
                    }
                } else {
                    if (!imp.getSubject().equals(taskTerm)) {
                        valid = false;
                    }
                }

                if (valid) {
                    let op: Operator = memory.getOperator(S`^anticipate`);
                    if (op === null)
                        throw new java.lang.IllegalStateException(S`${this} requires ^anticipate operator`);

                    let args: Product = new Product(imp.getPredicate());
                    let new_term: Term = Operation.make(args, op);

                    let sentence: Sentence = new Sentence(
                        new_term,
                        Symbols.GOAL_MARK,
                        TruthValue.fromFrequencyConfidence(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, memory.narParameters), // a
                        // naming
                        // convension
                        new Stamp(nal.time, memory));

                let quality: float = BudgetFunctions.truthToQuality(sentence.getTruth());
                    let budget: BudgetValue = new BudgetValue(
                        memory.narParameters.DEFAULT_GOAL_PRIORITY * this.INTERNAL_EXPERIENCE_PRIORITY_MUL,
                        memory.narParameters.DEFAULT_GOAL_DURABILITY * this.INTERNAL_EXPERIENCE_DURABILITY_MUL,
                        quality, memory.narParameters);

                    let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

                    nal.derivedTask(newTask, false, false, false);
                }
            }
        }
    }
}
