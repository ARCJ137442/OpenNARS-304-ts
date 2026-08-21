//! Java source: opennars/language/SetExt.java
import { java, S } from "jree";
import { SetTensional } from "./SetTensional.ts";



/**
 * An extensionally defined set, which contains one or more instances as defined
 * in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class SetExt extends SetTensional {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term - args must be unique and sorted
     */
    public constructor(...arg: Term[]) {
        super(arg);
    }

    /**
     * Clone a SetExt
     *
     * @return A new object, to be casted into a SetExt
     */
    public clone(): SetExt;

    public clone(replaced: Term[]): SetExt;
    public clone(...args: unknown[]): SetExt {
        switch (args.length) {
            case 0: {

                return new SetExt(term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return SetExt.make(replaced);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(...t: Term[]): SetExt;

    public static make(l: java.util.Collection<Term>): SetExt;
    public static make(...args: unknown[]): SetExt {
        switch (args.length) {
            case 1: {
                const [t] = args as [Term[]];


                t = Term.toSortedSetArray(t);
                if (t.length === 0)
                    return null;
                return new SetExt(t);


                break;
            }

            case 1: {
                const [l] = args as [java.util.Collection<Term>];


                return SetExt.make(l.toArray(new Array<Term>(0)));


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
        return NativeOperator.SET_EXT_OPENER;
    }

    /**
     * Make a String representation of the set, override the default.
     *
     * @return true for communitative
     */
    public makeName(): java.lang.CharSequence {
        return makeSetName(SET_EXT_OPENER.ch, term, SET_EXT_CLOSER.ch);
    }
}
