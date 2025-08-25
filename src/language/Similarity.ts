import { java, S } from "jree";



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
    public constructor(/* final */  arg: Term[] | null);

    public constructor(/* final */  subj: Term | null, /* final */  pred: Term | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                super(arg);

                java.security.cert.CertPathChecker.init(arg);


                break;
            }

            case 2: {
                const [subj, pred] = args as [Term, Term];


                this([subj, pred]);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Clone an object
     *
     * @return A new object, to be casted into a Similarity
     */
    public clone(): Similarity | null;

    public clone(/* final */  replaced: Term[] | null): Similarity | null;
    public clone(...args: unknown[]): Similarity | null {
        switch (args.length) {
            case 0: {

                return new Similarity(term);


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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * alternate version of make that allows equivalent subject and predicate
     * to be reduced to the common term.
     */
    public static makeTerm(/* final */  subject: Term | null, /* final */  predicate: Term | null): Term | null {
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
    public static make(/* final */  subject: Term | null, /* final */  predicate: Term | null): Similarity | null {

        if (invalidStatement(subject, predicate)) {
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
    public operator(): NativeOperator | null {
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
