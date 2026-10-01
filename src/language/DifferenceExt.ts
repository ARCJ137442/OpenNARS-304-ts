//! Java source: opennars/language/DifferenceExt.java
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Terms } from "./Terms.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";
import { SetExt } from "./SetExt.ts";
import { DifferenceInt } from "./DifferenceInt.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * A compound term whose extension is the difference of the extensions of its
 * term as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class DifferenceExt extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    private constructor(arg: Term[]) {
        super(arg);

        DifferenceInt.ensureValidDifferenceArguments(arg);

        this.init(arg);
    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into a DifferenceExt
     */
    public clone(): DifferenceExt;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): DifferenceExt | Term | null {
        switch (args.length) {
            case 0: {

                return new DifferenceExt(this.term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return DifferenceExt.make(replaced);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * Try to make a new DifferenceExt. Called by StringParser.
     *
     * @return the Term generated from the arguments
     * @param arg The list of term
     */
    public static make(arg: Term[]): Term | null;

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param t1 The first component
     * @param t2 The second component
     * @return A compound generated or a term it reduced to
     */
    public static make(t1: Term, t2: Term): Term | null;
    public static make(...args: unknown[]): Term | null {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                if (arg.length === 1) { // special case from CompoundTerm.reduceComponent
                    return arg[0];
                }
                if (arg.length !== 2) {
                    return null;
                }
                if ((arg[0] instanceof SetExt) && (arg[1] instanceof SetExt)) {
                    const set = Term.sortedDifference(
                        (arg[0] as CompoundTerm).term,
                        (arg[1] as CompoundTerm).term,
                    );
                    return SetExt.make(set);
                }

                if (arg[0].equals(arg[1])) {
                    return null;
                }

                return new DifferenceExt(arg);


                break;
            }

            case 2: {
                const [t1, t2] = args as [Term, Term];


                if (t1.equals(t2))
                    return null;

                return DifferenceExt.make([t1, t2]);


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
        return NativeOperator.DIFFERENCE_EXT;
    }
}
