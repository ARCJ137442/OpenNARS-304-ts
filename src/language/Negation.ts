//! Java source: opennars/language/Negation.java
import { java, S } from "jree";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Terms } from "./Terms.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * A negation of a statement as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Negation extends CompoundTerm {

    /**
     * avoid using this externally, because double-negatives can be unwrapped to the
     * original term using Negation.make
     */
    protected constructor(t: Term) {
        super([t]);

        this.init(this.term);
    }

    protected makeName(): java.lang.CharSequence {
        return Negation.makeCompoundName(NativeOperator.NEGATION, this.term[0]);
    }

    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Negation;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): Negation | Term {
        switch (args.length) {
            case 0: {

                return new Negation(this.term[0]);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                if (replaced.length !== 1)
                    return null;
                return Negation.make(replaced[0]);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Try to make a Negation of one component. Called by the inference rules.
     *
     * @param t The component
     * @return A compound generated or a term it reduced to
     */
    public static make(t: Term): Term;

    /**
     * Try to make a new Negation. Called by StringParser.
     *
     * @return the Term generated from the arguments
     * @param argument The list of term
     */
    public static make(argument: Term[]): Term;
    public static make(...args: unknown[]): Term {
        if (args.length !== 1) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }

        // Java overloads make(Term) and make(Term[]) have the same arity.
        // The array overload is used by the parser and must be selected before
        // the single-term construction path.
        const [value] = args;
        if (Array.isArray(value)) {
            if (value.length !== 1) {
                return null;
            }
            return Negation.make(value[0]);
        }

        const term = value as Term;
        if (term instanceof Negation) {
            // (--,(--,P)) = P
            return term.term[0];
        }
        return new Negation(term);
    }


    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        return NativeOperator.NEGATION;
    }

    public static areMutuallyInverse(tc: Term, ptc: Term): boolean {
        // doesnt seem necessary to check both, one seems sufficient.
        // incurs cost of creating a Negation and its id
        return (ptc.equals(Negation.make(tc)) /* || tc.equals(Negation.make(ptc)) */);
    }

}
