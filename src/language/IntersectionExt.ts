//! Java source: opennars/language/IntersectionExt.java
import { java, S } from "jree";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Terms } from "./Terms.ts";
import { SetExt } from "./SetExt.ts";
import { SetInt } from "./SetInt.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * A compound term whose extension is the intersection of the extensions of its
 * term as defined in the NARS-theory
 *
 * @author Patrick Hammer
 */
export class IntersectionExt extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    private constructor(arg: Term[]) {
        super(arg);

        if (Debug.DETAILED) {
            Terms.verifySortedAndUnique(arg, false);
        }

        this.init(arg);

    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into a IntersectionExt
     */
    public clone(): IntersectionExt;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): IntersectionExt | Term | null {
        switch (args.length) {
            case 0: {

                return new IntersectionExt(this.term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return IntersectionExt.make(replaced);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(t: Term[]): Term | null;

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param term1 The first component
     * @param term2 The first component
     * @return A compound generated or a term it reduced to
     */
    public static make(term1: Term, term2: Term): Term | null;
    public static make(...args: unknown[]): Term | null {
        switch (args.length) {
            case 1: {
                let [t] = args as [Term[]];


                t = Term.toSortedSetArray(...t);
                switch (t.length) {
                    case 0:
                        return null;
                    case 1:
                        return t[0];
                    default:
                        return new IntersectionExt(t);
                }


                break;
            }

            case 2: {
                const [term1, term2] = args as [Term, Term];



                if ((term1 instanceof SetInt) && (term2 instanceof SetInt)) {
                    // set union
                    let both: Term[] = [
                        ...(term1 as CompoundTerm).term,
                        ...(term2 as CompoundTerm).term,
                    ];
                    return SetInt.make(both);
                }
                if ((term1 instanceof SetExt) && (term2 instanceof SetExt)) {
                    // set intersection
                    let set: java.util.Set<Term> = Term.toSortedSet(...(term1 as CompoundTerm).term);

                    set.retainAll((term2 as CompoundTerm).asTermList());

                    // technically this can be used directly if it can be converted to array
                    // but wait until we can verify that NavigableSet.toarray does it or write a
                    // helper function like existed previously
                    return SetExt.make(set.toArray(new Array<Term>(0)));
                }
            let se: java.util.List<Term> = new java.util.ArrayList<Term>();
                if (term1 instanceof IntersectionExt) {
                    (term1 as CompoundTerm).addTermsTo(se);
                    if (term2 instanceof IntersectionExt) {
                        // (&,(&,P,Q),(&,R,S)) = (&,P,Q,R,S)
                        (term2 as CompoundTerm).addTermsTo(se);
                    } else {
                        // (&,(&,P,Q),R) = (&,P,Q,R)
                        se.add(term2);
                    }
                } else if (term2 instanceof IntersectionExt) {
                    // (&,R,(&,P,Q)) = (&,P,Q,R)
                    (term2 as CompoundTerm).addTermsTo(se);
                    se.add(term1);
                } else {
                    se.add(term1);
                    se.add(term2);
                }
                return IntersectionExt.make(se.toArray(new Array<Term>(0)));


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
        return NativeOperator.INTERSECTION_EXT;
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
