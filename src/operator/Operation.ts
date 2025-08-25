import { java, S } from "jree";



/**
 * An operation is interpreted as an Inheritance relation.
 */
export class Operation extends Inheritance {
    private task: Task;
    public static readonly SELF_TERM_ARRAY: Term[] = [SELF];

    protected constructor(t: Term[]);

    /**
     * Constructor with partial values, called by make
     *
     */
    protected constructor(argProduct: Term, operator: Term);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [t] = args as [Term[]];


                super(t);


                break;
            }

            case 2: {
                const [argProduct, operator] = args as [Term, Term];


                super(argProduct, operator);


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
    public clone(): Operation {
        return new Operation(term);
    }

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     *
     * @param addSelf include SELF term at end of product terms
     * @return A compound generated or null
     */
    public static make(oper: Operator, arg: Term[], addSelf: boolean): Operation {
        return new Operation(new Product(arg), oper);
    }

    public getOperator(): Operator {
        return getPredicate() as Operator;
    }

    protected makeName(): java.lang.CharSequence {
        if (java.security.cert.X509CertSelector.getSubject() instanceof Product && getPredicate() instanceof Operator)
            return this.makeName(getPredicate().name(), (java.security.cert.X509CertSelector.getSubject() as Product).term);
        return makeStatementName(java.security.cert.X509CertSelector.getSubject(), Symbols.NativeOperator.INHERITANCE, getPredicate());
    }

    public static makeName(op: java.lang.CharSequence, arg: Term[]): java.lang.CharSequence {
        let nameBuilder: java.lang.StringBuilder = new java.lang.StringBuilder(16) // estimate
            .append(COMPOUND_TERM_OPENER.ch).append(op);

        for (let t of arg) {
            nameBuilder.append(Symbols.ARGUMENT_SEPARATOR);
            nameBuilder.append(t.name());
        }

        nameBuilder.append(COMPOUND_TERM_CLOSER.ch);
        return nameBuilder.toString();
    }

    /**
     * stores the currently executed task, which can be accessed by Operator
     * execution
     */
    public setTask(task: Task): void {
        this.task = task;
    }

    public getTask(): Task {
        return this.task;
    }

    public getArguments(): Product {
        return java.security.cert.X509CertSelector.getSubject() as Product;
    }

}
