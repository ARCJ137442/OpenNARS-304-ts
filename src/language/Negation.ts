//! Java source: opennars/language/Negation.java
import { java, S } from "jree";



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

        java.security.cert.CertPathChecker.init(term);
    }

    protected makeName(): java.lang.CharSequence {
        return makeCompoundName(NativeOperator.NEGATION, term[0]);
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

                return new Negation(term[0]);


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
        switch (args.length) {
            case 1: {
                const [t] = args as [Term];


                if (t instanceof Negation) {
                    // (--,(--,P)) = P
                    return (t as Negation).term[0];
                }
                return new Negation(t);


                break;
            }

            case 1: {
                const [argument] = args as [Term[]];


                if (argument.length !== 1)
                    return null;
                return Negation.make(argument[0]);


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
        return NativeOperator.NEGATION;
    }

    public static areMutuallyInverse(tc: Term, ptc: Term): boolean {
        // doesnt seem necessary to check both, one seems sufficient.
        // incurs cost of creating a Negation and its id
        return (ptc.equals(Negation.make(tc)) /* || tc.equals(Negation.make(ptc)) */);
    }

}
