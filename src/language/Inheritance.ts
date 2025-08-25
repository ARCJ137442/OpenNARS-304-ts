import { java, S } from "jree";



/**
 * A Statement about an Inheritance relation as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Inheritance extends Statement {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    protected constructor(/* final */  arg: Term[]);

    protected constructor(/* final */  subj: Term, /* final */  pred: Term);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                super(arg);

                java.security.cert.CertPathChecker.init(arg);


                break;
            }

            case 2: {
                const [subj, pred] = args as [Term, Term];


                this([subj, pred]);


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
     * @return A new object, to be casted into a SetExt
     */
    public clone(): Inheritance;

    public clone(/* final */  t: Term[]): Inheritance;
    public clone(...args: unknown[]): Inheritance {
        switch (args.length) {
            case 0: {

                return Inheritance.make(java.security.cert.X509CertSelector.getSubject(), getPredicate());


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                if (t === null) {
                    return null;
                }
                if (t.length !== 2)
                    throw new java.lang.IllegalArgumentException(
                        "Invalid terms for " + java.lang.Object.getClass().getSimpleName() + ": " + java.util.Arrays.toString(t));

                return Inheritance.make(t[0], t[1]);


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
    public static makeTerm(/* final */  subject: Term, /* final */  predicate: Term): Term {
        return Inheritance.make(subject, predicate);
    }

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(/* final */  subject: Term, /* final */  predicate: Term): Inheritance {

        if (subject === null || predicate === null || invalidStatement(subject, predicate)) {
            return null;
        }

        let subjectProduct: boolean = subject instanceof Product;
        let predicateOperator: boolean = predicate instanceof Operator;

        if (Debug.DETAILED) {
            if (!predicateOperator && predicate.toString().startsWith("^")) {
                throw new java.lang.IllegalStateException("operator term detected but is not an operator: " + predicate);
            }
        }

        if (subjectProduct && predicateOperator) {
            // name = Operation.makeName(predicate.name(), ((CompoundTerm) subject).term);
            return Operation.make(predicate as Operator, (subject as CompoundTerm).term, true);
        } else {
            return new Inheritance(subject, predicate);
        }

    }

    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        return NativeOperator.INHERITANCE;
    }

}
