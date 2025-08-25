import { java, S } from "jree";



/**
 * A compound term whose extension is the difference of the intensions of its
 * term as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class DifferenceInt extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    private constructor(arg: Term[]) {
        super(arg);

        DifferenceInt.ensureValidDifferenceArguments(arg);

        java.security.cert.CertPathChecker.init(arg);
    }

    public static ensureValidDifferenceArguments(arg: Term[]): void {
        if (arg.length !== 2)
            throw new java.lang.IllegalStateException("Requires 2 components");

        if (Debug.DETAILED) {
            if (arg[0].equals(arg[1]))
                throw new java.lang.IllegalStateException("Equal arguments invalid");
        }
    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into a DifferenceInt
     */
    public clone(): DifferenceInt;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): DifferenceInt | Term {
        switch (args.length) {
            case 0: {

                return new DifferenceInt(term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return DifferenceInt.make(replaced);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Try to make a new DifferenceExt. Called by StringParser.
     *
     * @return the Term generated from the arguments
     * @param arg The list of term
     */
    public static make(arg: Term[]): Term;

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param t1 The first component
     * @param t2 The second component
     * @return A compound generated or a term it reduced to
     */
    public static make(t1: Term, t2: Term): Term;
    public static make(...args: unknown[]): Term {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                if (arg.length === 1) { // special case from CompoundTerm.reduceComponent
                    return arg[0];
                }
                if (arg.length !== 2) {
                    return null;
                }

                if ((arg[0] instanceof SetInt) && (arg[1] instanceof SetInt)) {
                    // TODO maybe a faster way to calculate:
                    let set: java.util.NavigableSet<Term> = new java.util.TreeSet((arg[0] as CompoundTerm).asTermList());
                    set.removeAll((arg[1] as CompoundTerm).asTermList()); // set difference
                    return SetInt.make(set);
                }

                if (arg[0].equals(arg[1])) {
                    return null;
                }

                return new DifferenceInt(arg);


                break;
            }

            case 2: {
                const [t1, t2] = args as [Term, Term];


                if (t1.equals(t2))
                    return null;

                return DifferenceInt.make([t1, t2]);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        return NativeOperator.DIFFERENCE_INT;
    }
}
