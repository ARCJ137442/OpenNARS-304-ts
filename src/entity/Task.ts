//! Java source: opennars/entity/Task.java
import { JavaIllegalArgumentException } from "../runtime/JavaExceptions.ts";
import type { int, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Item } from "./Item.ts";
import { InternalExperience } from "../plugin/mental/InternalExperience.ts";
import { javaStringValue } from "../runtime/java-text.ts";
import type { Sentence } from "./Sentence.ts";
import type { BudgetValue } from "./BudgetValue.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Term } from "../language/Term.ts";



/**
 * A task to be processed, consists of a Sentence and a BudgetValue.
 * A task references its parent and an optional causal factor (usually an
 * Operation instance). These are implemented as WeakReference to allow
 * forgetting via the
 * garbage collection process. Otherwise, Task ancestry would grow unbounded,
 * violating the assumption of insufficient resources (AIKR).
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
class EnumType {
    public static readonly INPUT = new EnumType("INPUT", 0);
    public static readonly DERIVED = new EnumType("DERIVED", 1);

    private constructor(
        private readonly enumName: string,
        private readonly enumOrdinal: int,
    ) {}

    public name(): string {
        return this.enumName;
    }

    public ordinal(): int {
        return this.enumOrdinal;
    }

    public toString(): string {
        return this.enumName;
    }
}

export class Task extends Item<Sentence> {

    /** Every Java Task constructor requires a budget; refine Item's nullable base field here. */
    public declare readonly budget: BudgetValue;

    /* The sentence of the Task */
    public readonly sentence: Sentence;
    /* Belief from which the Task is derived, or null if derived from a theorem */
    public readonly parentBelief: Sentence | null;
    /*
     * Tasklink from which the Task is derived, null unless Debug.PARENTS is turned
     * on
     */
    public parentTask: Sentence | null = null;
    /* For Question and Goal: best solution found so far */
    private bestSolution: Sentence | null;
    /* Whether the task should go into event bag or not */
    private partOfSequenceBuffer: boolean = false;
    /* Whether it is an input task or not */
    private inputTask: boolean = false;

    /**
     * Constructor for input task and single premise derived task
     *
     * @param s The sentence
     * @param b The budget
     */
    public constructor(s: Sentence, b: BudgetValue, type: Task.EnumType);

    /***
     * Constructors for double premise derived task
     *
     * @param s            The sentence
     * @param b            The budget
     * @param parentBelief The belief used for deriving the task
     */
    public constructor(s: Sentence, b: BudgetValue, parentBelief: Sentence | null);

    /***
     * Constructors for solved double premise derived task
     *
     * @param s            The sentence
     * @param b            The budget
     * @param parentBelief The belief used for deriving the task
     * @param solution     The solution to the task
     */
    public constructor(s: Sentence, b: BudgetValue, parentBelief: Sentence | null, solution: Sentence | null);
    public constructor(...args: unknown[]) {
        if (args.length !== 3 && args.length !== 4) {
            throw new JavaIllegalArgumentException("Invalid number of arguments");
        }
        const budget = args[1] as BudgetValue;
        super(budget);

        switch (args.length) {
            case 3: {
                const [s, _b, third] = args as [Sentence, BudgetValue, Task.EnumType | Sentence | null];
                this.sentence = s;
                const isType = third === Task.EnumType.INPUT || third === Task.EnumType.DERIVED;
                this.parentBelief = isType ? null : third as Sentence | null;
                this.bestSolution = null;
                this.inputTask = third === Task.EnumType.INPUT;
                break;
            }

            case 4: {
                const [s, b, parentBelief, solution] = args as [Sentence, BudgetValue, Sentence | null, Sentence | null];


                this.sentence = s;
                this.parentBelief = parentBelief;
                this.bestSolution = solution;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public name(): Sentence {
        return this.sentence;
    }

    public equals(obj: unknown): boolean {
        if (obj === this)
            return true;
        if (obj instanceof Task) {
            let t: Task = obj as Task;
            return t.sentence.equals(this.sentence);
        }
        return false;
    }

    public hashCode(): int {
        return this.sentence.hashCode();
    }

    /**
     * Directly get the creation time of the sentence
     *
     * @return The creation time of the sentence
     */
    public getCreationTime(): long {
        return this.sentence.stamp.getCreationTime();
    }

    /**
     * Check if a Task is a direct input
     *
     * @return Whether the Task is derived from another task
     */
    public isInput(): boolean {
        return this.inputTask;
    }

    public aboveThreshold(): boolean {
        return this.getBudget().aboveThreshold();
    }

    /**
     * Merge one Task into another
     *
     * @param that The other Task
     */
    public merge(that: Item<unknown>): Item<unknown> {
        if (this.getCreationTime() >= (that as Task).getCreationTime()) {
            return super.merge(that);
        } else {
            return that.merge(this);
        }
    }

    /**
     * Get the best-so-far solution for a Question or Goal
     *
     * @return The stored Sentence or null
     */
    public getBestSolution(): Sentence | null {
        return this.bestSolution;
    }

    /**
     * Set the best-so-far solution for a Question or Goal, and report answer
     * for input question
     *
     * @param judgment The solution to be remembered
     */
    public setBestSolution(memory: Memory, judgment: Sentence, time: Timable): void {
        if (memory.internalExperience !== null) {
            InternalExperience.InternalExperienceFromBelief(memory, this, judgment, time);
        }
        this.bestSolution = judgment;
    }

    /**
     * Get the parent belief of a task
     *
     * @return The belief from which the task is derived
     */
    public getParentBelief(): Sentence | null {
        if (this.parentBelief === null)
            return null;
        return this.parentBelief;
    }

    /**
     * Get a String representation of the Task
     *
     * @return The Task as a String
     */
    public toStringLong(): string {
        let result = `${javaStringValue(super.toString())} ${javaStringValue(this.sentence.stamp.name())}`;
        if (this.bestSolution !== null) {
            result += `  \n solution: ${javaStringValue(this.bestSolution.toString())}`;
        }
        return result;
    }

    /**
     * flag to indicate whether this Event Task participates in temporal induction
     */
    public setElemOfSequenceBuffer(b: boolean): void {
        this.partOfSequenceBuffer = b;
    }

    public isElemOfSequenceBuffer(): boolean {
        return !this.sentence.isEternal() && (this.isInput() || this.partOfSequenceBuffer);
    }

    public getTerm(): Term {
        return this.sentence.getTerm();
    }

    public static EnumType = EnumType;

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Task {
    export type EnumType = typeof Task.EnumType.INPUT;
}


