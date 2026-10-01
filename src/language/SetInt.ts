//! Java source: opennars/language/SetInt.java
import { SetTensional } from "./SetTensional.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import { type TextString, type ArrayConvertible } from "../runtime/Text.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const SET_INT_OPENER = NativeOperator.SET_INT_OPENER;
const SET_INT_CLOSER = NativeOperator.SET_INT_CLOSER;



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
    public constructor(arg: Term[]);
    public constructor(...arg: Term[]);
    public constructor(...arg: unknown[]) {
        // Keep the Java array and varargs constructor shapes distinct at the
        // runtime boundary, just as SetExt does.
        super(arg.length === 1 && Array.isArray(arg[0]) ? arg[0] as Term[] : arg as Term[]);
    }

    /**
     * Clone a SetInt
     *
     * @return A new object, to be casted into a SetInt
     */
    public clone(): SetInt;

    public clone(replaced: Term[]): SetInt;
    public clone(...args: unknown[]): SetInt | null {
        switch (args.length) {
            case 0: {

                return new SetInt(...this.term);


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
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    public static make(t: Term[]): SetInt;
    public static make(l: ArrayConvertible<Term>): SetInt;

    public static make(...t: Term[]): SetInt;
    public static make(...args: unknown[]): SetInt | null {
        switch (args.length) {
            case 1: {
                const [l] = args as [ArrayConvertible<Term> | Term[]];
                if (Array.isArray(l)) {
                    const sorted = Term.toSortedSetArray(...l);
                    if (sorted.length === 0) return null;
                    return new SetInt(...sorted);
                }
                if (typeof (l as { toArray?: unknown }).toArray === "function") {
                    return SetInt.make((l as ArrayConvertible<Term>).toArray(new Array<Term>(0)));
                }
                return new SetInt(l as unknown as Term);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];
                const sorted = Term.toSortedSetArray(...t);
                if (sorted.length === 0)
                    return null;
                return new SetInt(...sorted);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
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
    public makeName(): TextString {
        return SetInt.makeSetName(SET_INT_OPENER.ch, this.term, SET_INT_CLOSER.ch);
    }

}
