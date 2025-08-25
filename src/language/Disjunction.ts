


import { java, S } from "jree";



/**
 * A disjunction of Statements as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Disjunction extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    private constructor(/* final */  arg: Term[] | null) {
        super(arg);

        if (Debug.DETAILED) {
            Terms.verifySortedAndUnique(arg, false);
        }

        java.security.cert.CertPathChecker.init(arg);
    }

    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Disjunction | null;

    public clone(/* final */  x: Term[] | null): Term | null;
    public clone(...args: unknown[]): Disjunction | null | Term | null {
        switch (args.length) {
            case 0: {

                return new Disjunction(term);


                break;
            }

            case 1: {
                const [x] = args as [Term[]];


                if (x === null) {
                    return null;
                }
                return Disjunction.make(x);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(t: Term[] | null): Term | null;

    /**
     * Try to make a new Disjunction from two term. Called by the inference rules.
     *
     * @param term1 The first component
     * @param term2 The first component
     * @return A Disjunction generated or a Term it reduced to
     */
    public static make(/* final */  term1: Term | null, /* final */  term2: Term | null): Term | null;
    public static make(...args: unknown[]): Term | null {
        switch (args.length) {
            case 1: {
                const [t] = args as [Term[]];


                t = Term.toSortedSetArray(t);

                if (t.length === 0)
                    return null;
                if (t.length === 1) {
                    // special case: single component
                    return t[0];
                }

                return new Disjunction(t);


                break;
            }

            case 2: {
                const [term1, term2] = args as [Term, Term];


                let set: java.util.List<Term> = new java.util.ArrayList();
                if (term1 instanceof Disjunction) {
                    set.addAll((term1 as CompoundTerm).asTermList());
                    if (term2 instanceof Disjunction) {
                        // (&,(&,P,Q),(&,R,S)) = (&,P,Q,R,S)
                        set.addAll((term2 as CompoundTerm).asTermList());
                    } else {
                        // (&,(&,P,Q),R) = (&,P,Q,R)
                        set.add(term2);
                    }
                } else if (term2 instanceof Disjunction) {
                    // (&,R,(&,P,Q)) = (&,P,Q,R)
                    set.addAll((term2 as CompoundTerm).asTermList());
                    set.add(term1);
                } else {
                    set.add(term1);
                    set.add(term2);
                }
                return Disjunction.make(set.toArray(new Array<Term>(0)));


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
    public operator(): NativeOperator | null {
        return NativeOperator.DISJUNCTION;
    }

    /**
     * Disjunction is commutative.
     *
     * @return true for commutative
     */
    public isCommutative(): boolean {
        return true;
    }
}
