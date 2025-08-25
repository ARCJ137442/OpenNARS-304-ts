import { java, type int, S } from "jree";



/**
 * A Statement about an Equivalence relation as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Equivalence extends Statement {

    private temporalOrder: int = TemporalRules.ORDER_NONE;

    /**
     * Constructor with partial values, called by make
     *
     * @param components The component list of the term
     */
    private constructor(/* final */  components: Term[] | null, /* final */  order: int) {
        super(components);

        this.temporalOrder = order;

        java.security.cert.CertPathChecker.init(components);
    }

    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Equivalence | null;

    public clone(/* final */  t: Term[] | null): Equivalence | null;
    public clone(...args: unknown[]): Equivalence | null {
        switch (args.length) {
            case 0: {

                return new Equivalence(term, this.temporalOrder);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                if (t === null) {
                    return null;
                }
                if (t.length !== 2)
                    throw new java.lang.IllegalStateException("Equivalence requires 2 components: " + java.util.Arrays.toString(t));

                return Equivalence.make(t[0], t[1], this.temporalOrder);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * alternate version of Inheritance.make that allows equivalent subject and
     * predicate
     * to be reduced to the common term.
     */
    public static makeTerm(/* final */  subject: Term | null, /* final */  predicate: Term | null, /* final */  temporalOrder: int): Term | null {
        if (subject.equals(predicate))
            return subject;
        return Equivalence.make(subject, predicate, temporalOrder);
    }

    /**
     * Try to make a new compound from two term. Called by the inference
     * rules.
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(/* final */  subject: Term | null, /* final */  predicate: Term | null): Equivalence | null;

    public static make(subject: Term | null, predicate: Term | null, temporalOrder: int): Equivalence | null;
    public static make(...args: unknown[]): Equivalence | null {
        switch (args.length) {
            case 2: {
                const [subject, predicate] = args as [Term, Term];

                // to be extended to check if subject is
                // Conjunction
                return Equivalence.make(subject, predicate, TemporalRules.ORDER_NONE);


                break;
            }

            case 3: {
                const [subject, predicate, temporalOrder] = args as [Term, Term, int];

                // to be extended to check if
                // subject is Conjunction
                if (invalidStatement(subject, predicate) && temporalOrder !== TemporalRules.ORDER_FORWARD
                    && temporalOrder !== TemporalRules.ORDER_CONCURRENT) {
                    return null;
                }

                if ((subject instanceof Implication) || (subject instanceof Equivalence)
                    || (predicate instanceof Implication) || (predicate instanceof Equivalence) ||
                    (subject instanceof Interval) || (predicate instanceof Interval)) {
                    return null;
                }

                if ((temporalOrder === TemporalRules.ORDER_BACKWARD)
                    || ((subject.compareTo(predicate) > 0) && (temporalOrder !== TemporalRules.ORDER_FORWARD))) {
                    let interm: Term = subject;
                    subject = predicate;
                    predicate = interm;
                }

                // final NativeOperator copula;
                switch (temporalOrder) {
                    case TemporalRules.ORDER_BACKWARD:
                        temporalOrder = TemporalRules.ORDER_FORWARD;

                    default:

                    // TODO determine if this missing break is intended
                    // case TemporalRules.ORDER_FORWARD:
                    // copula = NativeOperator.EQUIVALENCE_AFTER;
                    // break;
                    // case TemporalRules.ORDER_CONCURRENT:
                    // copula = NativeOperator.EQUIVALENCE_WHEN;
                    // break;
                    // default:
                    // copula = NativeOperator.EQUIVALENCE;
                }
                let t: Term[];
                if (temporalOrder === TemporalRules.ORDER_FORWARD)
                    t = [subject, predicate];
                else
                    t = Term.toSortedSetArray(subject, predicate);

                if (t.length !== 2)
                    return null;
                return new Equivalence(t, temporalOrder);


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
        switch (this.temporalOrder) {
            case TemporalRules.ORDER_FORWARD:
                return NativeOperator.EQUIVALENCE_AFTER;
            case TemporalRules.ORDER_CONCURRENT:
                return NativeOperator.EQUIVALENCE_WHEN;

            default:

        }
        return NativeOperator.EQUIVALENCE;
    }

    /**
     * Check if the compound is commutative.
     *
     * @return true for commutative
     */
    public isCommutative(): boolean {
        return (this.temporalOrder !== TemporalRules.ORDER_FORWARD);
    }

    public getTemporalOrder(): int {
        return this.temporalOrder;
    }
}
