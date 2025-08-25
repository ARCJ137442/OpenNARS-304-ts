


import { java, S } from "jree";



/**
 * An operation is interpreted as an Inheritance relation.
 */
export class Operation extends Inheritance {
    private task: Task | null;
    public static readonly SELF_TERM_ARRAY: Term[] | null = [SELF];

    protected constructor(/* final */  t: Term[] | null);

    /**
     * Constructor with partial values, called by make
     *
     */
    protected constructor(/* final */  argProduct: Term | null, /* final */  operator: Term | null);
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
    public clone(): Operation | null {
        return new Operation(term);
    }

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     *
     * @param addSelf include SELF term at end of product terms
     * @return A compound generated or null
     */
    public static make(/* final */  oper: Operator | null, /* final */  arg: Term[] | null, /* final */  addSelf: boolean): Operation | null {
        return new Operation(new Product(arg), oper);
    }

    public getOperator(): Operator | null {
        return getPredicate() as Operator;
    }

    protected makeName(): java.lang.CharSequence | null {
        if (java.security.cert.X509CertSelector.getSubject() instanceof Product && getPredicate() instanceof Operator)
            return this.makeName(getPredicate().name(), (java.security.cert.X509CertSelector.getSubject() as Product).term);
        return makeStatementName(java.security.cert.X509CertSelector.getSubject(), Symbols.NativeOperator.INHERITANCE, getPredicate());
    }

    public static makeName(/* final */  op: java.lang.CharSequence | null, /* final */  arg: Term[] | null): java.lang.CharSequence | null {
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
    public setTask(/* final */  task: Task | null): void {
        this.task = task;
    }

    public getTask(): Task | null {
        return this.task;
    }

    public getArguments(): Product | null {
        return java.security.cert.X509CertSelector.getSubject() as Product;
    }

}
