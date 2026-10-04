//! Java source: opennars/language/SetExt.java
import { SetTensional } from "./SetTensional.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import { type TextString, type ArrayConvertible } from "../runtime/Text.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const SET_EXT_OPENER = NativeOperator.SET_EXT_OPENER;
const SET_EXT_CLOSER = NativeOperator.SET_EXT_CLOSER;



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
    public constructor(arg: Term[]);
    public constructor(...arg: Term[]);
    public constructor(...arg: unknown[]) {
        // Java exposes both SetExt(Term[]) and the varargs call shape. A
        // translated call such as new SetExt(t1) therefore carries the whole
        // array as one runtime argument and must not become a one-component
        // set whose component is itself an array.
        super(arg.length === 1 && Array.isArray(arg[0]) ? arg[0] as Term[] : arg as Term[]);
    }

    /**
     * Clone a SetExt
     *
     * @return A new object, to be casted into a SetExt
     */
    public clone(): SetExt;

    public clone(replaced: Term[]): SetExt;
    public clone(...args: unknown[]): SetExt | null {
        switch (args.length) {
            case 0: {

                return new SetExt(...this.term);


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
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    public static make(t: Term[]): SetExt;
    public static make(...t: Term[]): SetExt;

    public static make(l: ArrayConvertible<Term>): SetExt;
    public static make(...args: unknown[]): SetExt | null {
        switch (args.length) {
            case 1: {
                const [t] = args as [Term[] | ArrayConvertible<Term>];
                if (!Array.isArray(t)) {
                    if (typeof (t as { toArray?: unknown }).toArray === "function") {
                        return SetExt.make((t as ArrayConvertible<Term>).toArray(new Array<Term>(0)));
                    }
                    return new SetExt(t as unknown as Term);
                }
                const sorted = Term.toSortedSetArray(...t);
                if (sorted.length === 0)
                    return null;
                return new SetExt(...sorted);


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
        return NativeOperator.SET_EXT_OPENER;
    }

    /**
     * Make a String representation of the set, override the default.
     *
     * @return true for communitative
     */
    public makeName(): TextString {
        return SetExt.makeSetName(SET_EXT_OPENER.ch, this.term, SET_EXT_CLOSER.ch);
    }
}

// Match Java's Term.SELF = SetExt.make(Term.get("SELF") without importing
// SetExt from Term.ts, which would re-enter the CompoundTerm -> Interval cycle.
Term.installSelf(SetExt.make(Term.get("SELF")));
