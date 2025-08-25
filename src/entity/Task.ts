


import { java, type int, type long, S } from "jree";



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
export class Task extends Item<Sentence> {

    /* The sentence of the Task */
    public readonly sentence: Sentence | null;
    /* Belief from which the Task is derived, or null if derived from a theorem */
    public readonly parentBelief: Sentence | null;
    /*
     * Tasklink from which the Task is derived, null unless Debug.PARENTS is turned
     * on
     */
    public parentTask: Sentence | null;
    /* For Question and Goal: best solution found so far */
    private bestSolution: Sentence | null;
    /* Whether the task should go into event bag or not */
    private partOfSequenceBuffer: boolean = false;
    /* Whether it is an input task or not */
    private isInput: boolean = false;

    /**
     * Constructor for input task and single premise derived task
     *
     * @param s The sentence
     * @param b The budget
     */
    public constructor(/* final */  s: Sentence | null, /* final */  b: BudgetValue | null, type: Task.EnumType | null);

    /***
     * Constructors for double premise derived task
     *
     * @param s            The sentence
     * @param b            The budget
     * @param parentBelief The belief used for deriving the task
     */
    public constructor(/* final */  s: Sentence | null, /* final */  b: BudgetValue | null, /* final */  parentBelief: Sentence | null);

    /***
     * Constructors for solved double premise derived task
     *
     * @param s            The sentence
     * @param b            The budget
     * @param parentBelief The belief used for deriving the task
     * @param solution     The solution to the task
     */
    public constructor(/* final */  s: Sentence | null, /* final */  b: BudgetValue | null, /* final */  parentBelief: Sentence | null, /* final */  solution: Sentence | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                const [s, b, type] = args as [Sentence, BudgetValue, Task.EnumType];


                this(s, b, null, null);
                this.isInput = type === Task.EnumType.INPUT;


                break;
            }

            case 3: {
                const [s, b, parentBelief] = args as [Sentence, BudgetValue, Sentence];


                this(s, b, parentBelief, null);


                break;
            }

            case 4: {
                const [s, b, parentBelief, solution] = args as [Sentence, BudgetValue, Sentence, Sentence];


                super(b);
                this.sentence = s;
                this.parentBelief = parentBelief;
                this.bestSolution = solution;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public name(): Sentence | null {
        return this.sentence;
    }

    public equals(/* final */  obj: java.lang.Object | null): boolean {
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
        return this.isInput;
    }

    public aboveThreshold(): boolean {
        return budget.aboveThreshold();
    }

    /**
     * Merge one Task into another
     *
     * @param that The other Task
     */
    public merge(/* final */  that: Item<unknown> | null): Item<unknown> | null {
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
    public setBestSolution(/* final */  memory: Memory | null, /* final */  judgment: Sentence | null, /* final */  time: Timable | null): void {
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
    public toStringLong(): java.lang.String | null {
        let s: java.lang.StringBuilder = new java.lang.StringBuilder();
        s.append(super.toString()).append(' ').append(this.sentence.stamp.name());
        if (this.bestSolution !== null) {
            s.append("  \n solution: ").append(this.bestSolution.toString());
        }
        return s.toString();
    }

    /**
     * flag to indicate whether this Event Task participates in temporal induction
     */
    public setElemOfSequenceBuffer(/* final */  b: boolean): void {
        this.partOfSequenceBuffer = b;
    }

    public isElemOfSequenceBuffer(): boolean {
        return !this.sentence.isEternal() && (this.isInput() || this.partOfSequenceBuffer);
    }

    public getTerm(): Term | null {
        return this.sentence.getTerm();
    }

    public static EnumType = class EnumType extends java.lang.Enum<EnumType> {
        public static readonly INPUT: EnumType = new class extends EnumType {
        }(S`INPUT`, 0);
        public static readonly DERIVED: EnumType = new class extends EnumType {
        }(S`DERIVED`, 1),
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Task {
    export type EnumType = InstanceType<typeof Task.EnumType>;
}


