//! Java source: opennars/language/Similarity.java
import type { int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Statement } from "./Statement.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * A Statement about a Similarity relation as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Similarity extends Statement {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(arg: Term[]);

    public constructor(subj: Term, pred: Term);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                super(arg);

                this.init(arg);


                break;
            }

            case 2: {
                const [subj, pred] = args as [Term, Term];


                super([subj, pred]);
                this.init([subj, pred]);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * Clone an object
     *
     * @return A new object, to be casted into a Similarity
     */
    public clone(): Similarity;

    public clone(replaced: Term[]): Similarity;
    public clone(...args: unknown[]): Similarity | null {
        switch (args.length) {
            case 0: {
                return new Similarity(this.term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                if (replaced.length !== 2)
                    return null;
                return Similarity.make(replaced[0], replaced[1]);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * alternate version of make that allows equivalent subject and predicate
     * to be reduced to the common term.
     */
    public static makeTerm(subject: Term, predicate: Term): Term | null {
        if (subject.equals(predicate))
            return subject;
        return Similarity.make(subject, predicate);
    }

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(statement: Statement, subj: Term, pred: Term): Statement | null;
    public static make(op: NativeOperator, subj: Term, pred: Term, order: int): Statement | null;
    public static make(statement: Statement, subj: Term, pred: Term, order: int): Statement | null;
    public static make(o: NativeOperator, subject: Term, predicate: Term,
        customOrder: boolean, order: int): Statement | null;
    public static make(subject: Term, predicate: Term): Similarity | null;
    public static make(...args: unknown[]): Similarity | Statement | null {
        if (args.length === 3) {
            return Statement.make(...args as [Statement, Term, Term]);
        }
        if (args.length === 4) {
            const [first, subject, predicate, order] = args as [NativeOperator | Statement, Term, Term, int];
            return first instanceof Statement
                ? Statement.make(first, subject, predicate, order)
                : Statement.make(first, subject, predicate, order);
        }
        if (args.length === 5) {
            return Statement.make(...args as [NativeOperator, Term, Term, boolean, int]);
        }

        const [subject, predicate] = args as [Term, Term];
        if (Statement.invalidStatement(subject, predicate)) {
            return null;
        }
        if (subject.compareTo(predicate) > 0) {
            return Similarity.make(predicate, subject);
        }

        return new Similarity(subject, predicate);
    }

    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        return NativeOperator.SIMILARITY;
    }

    /**
     * Check if the compound is commutative.
     *
     * @return true for commutative
     */
    public isCommutative(): boolean {
        return true;
    }
}
