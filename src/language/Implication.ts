import { java, type int, type long, S } from "jree";



/**
 * A Statement about an Inheritance copula as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Implication extends Statement {
    private temporalOrder: int = TemporalRules.ORDER_NONE;

    // counter used for evidence tracking
    public counter: long = 1;

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(/* final */  arg: Term[], /* final */  order: int);

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(/* final */  arg: Term[], /* final */  order: int, /* final */  counter: long);

    public constructor(/* final */  subject: Term, /* final */  predicate: Term, /* final */  order: int);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [arg, order] = args as [Term[], int];


                super(arg);

                this.temporalOrder = order;

                java.security.cert.CertPathChecker.init(arg);


                break;
            }

            case 3: {
                const [arg, order, counter] = args as [Term[], int, long];


                super(arg);

                this.temporalOrder = order;
                this.counter = counter;

                java.security.cert.CertPathChecker.init(arg);


                break;
            }

            case 3: {
                const [subject, predicate, order] = args as [Term, Term, int];


                this([subject, predicate], order);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Implication;

    public clone(/* final */  t: Term[]): Implication;
    public clone(...args: unknown[]): Implication {
        switch (args.length) {
            case 0: {

                return new Implication(term, this.getTemporalOrder(), this.counter);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                if (t === null) {
                    return null;
                }
                if (t.length !== 2)
                    throw new java.lang.IllegalStateException("Implication requires 2 components: " + java.util.Arrays.toString(t));

                return Implication.make(t[0], t[1], this.temporalOrder);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or a term it reduced to
     */
    public static make(/* final */  subject: Term, /* final */  predicate: Term): Implication;

    public static make(/* final */  subject: Term, /* final */  predicate: Term, /* final */  temporalOrder: int): Implication;
    public static make(...args: unknown[]): Implication {
        switch (args.length) {
            case 2: {
                const [subject, predicate] = args as [Term, Term];


                return Implication.make(subject, predicate, TemporalRules.ORDER_NONE);


                break;
            }

            case 3: {
                const [subject, predicate, temporalOrder] = args as [Term, Term, int];


                if (invalidStatement(subject, predicate,
                    temporalOrder !== TemporalRules.ORDER_FORWARD && temporalOrder !== TemporalRules.ORDER_CONCURRENT)) {
                    return null;
                }

                if ((subject instanceof Implication) || (subject instanceof Equivalence) || (predicate instanceof Equivalence)
                    ||
                    (subject instanceof Interval) || (predicate instanceof Interval)) {
                    return null;
                }

                // final CharSequence name = makeName(subject, temporalOrder, predicate);
                if (predicate instanceof Implication) {
                    let oldCondition: Term = (predicate as Statement).getSubject();
                    if ((oldCondition instanceof Conjunction) && oldCondition.containsTerm(subject)) {
                        return null;
                    }
                    let order: int = temporalOrder;
                    let spatial: boolean = false;
                    if (subject instanceof Conjunction) {
                        let conj: Conjunction = subject as Conjunction;
                        order = conj.getTemporalOrder();
                        spatial = conj.getIsSpatial();
                    }
                    let newCondition: Term = Conjunction.make(subject, oldCondition, order, spatial);
                    return Implication.make(newCondition, (predicate as Statement).getPredicate(), temporalOrder);
                } else {
                    return new Implication([subject, predicate], temporalOrder);
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static makeName(/* final */  subject: Term, /* final */  temporalOrder: int, /* final */  predicate: Term): java.lang.CharSequence {
        let copula: NativeOperator;
        switch (temporalOrder) {
            case TemporalRules.ORDER_FORWARD:
                copula = NativeOperator.IMPLICATION_AFTER;
                break;
            case TemporalRules.ORDER_CONCURRENT:
                copula = NativeOperator.IMPLICATION_WHEN;
                break;
            case TemporalRules.ORDER_BACKWARD:
                copula = NativeOperator.IMPLICATION_BEFORE;
                break;
            default:
                copula = NativeOperator.IMPLICATION;
        }
        return makeStatementName(subject, copula, predicate);
    }

    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        switch (this.temporalOrder) {
            case TemporalRules.ORDER_FORWARD:
                return NativeOperator.IMPLICATION_AFTER;
            case TemporalRules.ORDER_CONCURRENT:
                return NativeOperator.IMPLICATION_WHEN;
            case TemporalRules.ORDER_BACKWARD:
                return NativeOperator.IMPLICATION_BEFORE;

            default:

        }
        return NativeOperator.IMPLICATION;
    }

    public getTemporalOrder(): int {
        return this.temporalOrder;
    }

    public isForward(): boolean {
        return this.getTemporalOrder() === TemporalRules.ORDER_FORWARD;
    }

    public isBackward(): boolean {
        return this.getTemporalOrder() === TemporalRules.ORDER_BACKWARD;
    }

    public isConcurrent(): boolean {
        return this.getTemporalOrder() === TemporalRules.ORDER_CONCURRENT;
    }

}
