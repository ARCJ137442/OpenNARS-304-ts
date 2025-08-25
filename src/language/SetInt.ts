import { java, S } from "jree";



/**
 * An intensionally defined set, which contains one or more instances defining
 * the Term.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class SetInt extends SetTensional {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term - args must be unique and sorted
     */
    public constructor(/* final */ ...arg: Term[]) {
        super(arg);
    }

    /**
     * Clone a SetInt
     *
     * @return A new object, to be casted into a SetInt
     */
    public clone(): SetInt;

    public clone(/* final */  replaced: Term[]): SetInt;
    public clone(...args: unknown[]): SetInt {
        switch (args.length) {
            case 0: {

                return new SetInt(term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return SetInt.make(replaced);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(/* final */  l: java.util.Collection<Term>): SetInt;

    public static make(...t: Term[]): SetInt;
    public static make(...args: unknown[]): SetInt {
        switch (args.length) {
            case 1: {
                const [l] = args as [java.util.Collection<Term>];


                return SetInt.make(l.toArray(new Array<Term>(0)));


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                t = Term.toSortedSetArray(t);
                if (t.length === 0)
                    return null;
                return new SetInt(t);


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
        return NativeOperator.SET_INT_OPENER;
    }

    /**
     * Make a String representation of the set, override the default.
     *
     * @return true for communitative
     */
    public makeName(): java.lang.CharSequence {
        return makeSetName(SET_INT_OPENER.ch, term, SET_INT_CLOSER.ch);
    }

}
