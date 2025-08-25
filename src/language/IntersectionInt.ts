import { java, S } from "jree";



/**
 * A compound term whose intension is the intersection of the extensions of its
 * term as defined in the NARS-theory
 *
 * @author Patrick Hammer
 */
export class IntersectionInt extends CompoundTerm {

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
     * @return A new object, to be casted into a Conjunction
     */
    public clone(): IntersectionInt | null;

    public clone(/* final */  replaced: Term[] | null): Term | null;
    public clone(...args: unknown[]): IntersectionInt | null | Term | null {
        switch (args.length) {
            case 0: {

                return new IntersectionInt(term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return IntersectionInt.make(replaced);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(t: Term[] | null): Term | null;

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param term1 The first component
     * @param term2 The second component
     * @return A compound generated or a term it reduced to
     */
    public static make(/* final */  term1: Term | null, /* final */  term2: Term | null): Term | null;
    public static make(...args: unknown[]): Term | null {
        switch (args.length) {
            case 1: {
                const [t] = args as [Term[]];


                t = Term.toSortedSetArray(t);
                switch (t.length) {
                    case 0:
                        return null;
                    case 1:
                        return t[0];
                    default:
                        return new IntersectionInt(t);
                }


                break;
            }

            case 2: {
                const [term1, term2] = args as [Term, Term];



                if ((term1 instanceof SetExt) && (term2 instanceof SetExt)) {
                    // set union
                    let both: Term[] = ObjectArrays.concat(
                        (term1 as CompoundTerm).term,
                        (term2 as CompoundTerm).term, Term.class);
                    return SetExt.make(both);
                }
                if ((term1 instanceof SetInt) && (term2 instanceof SetInt)) {
                    // set intersection
                    let set: java.util.NavigableSet<Term> = Term.toSortedSet((term1 as CompoundTerm).term);

                    set.retainAll((term2 as CompoundTerm).asTermList());

                    // technically this can be used directly if it can be converted to array
                    // but wait until we can verify that NavigableSet.toarray does it or write a
                    // helper function like existed previously
                    return SetInt.make(set.toArray(new Array<Term>(0)));
                }

                let se: java.util.List<Term> = new java.util.ArrayList();
                if (term1 instanceof IntersectionInt) {
                    (term1 as CompoundTerm).addTermsTo(se);
                    if (term2 instanceof IntersectionInt) {
                        // (&,(&,P,Q),(&,R,S)) = (&,P,Q,R,S)
                        (term2 as CompoundTerm).addTermsTo(se);
                    } else {
                        // (&,(&,P,Q),R) = (&,P,Q,R)
                        se.add(term2);
                    }
                } else if (term2 instanceof IntersectionInt) {
                    // (&,R,(&,P,Q)) = (&,P,Q,R)
                    (term2 as CompoundTerm).addTermsTo(se);
                    se.add(term1);
                } else {
                    se.add(term1);
                    se.add(term2);
                }
                return IntersectionInt.make(se.toArray(new Array<Term>(0)));


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
        return NativeOperator.INTERSECTION_INT;
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
