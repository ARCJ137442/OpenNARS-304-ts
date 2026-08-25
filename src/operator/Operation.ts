//! Java source: opennars/operator/Operation.java
import { java, type int, S } from "jree";
import { Inheritance } from "../language/Inheritance.ts";
import { Product } from "../language/Product.ts";
import { Term } from "../language/Term.ts";
import { Statement } from "../language/Statement.ts";
import { Symbols } from "../io/Symbols.ts";
import { Operator } from "./Operator.ts";
import type { Task } from "../entity/Task.ts";



/**
 * An operation is interpreted as an Inheritance relation.
 */
export class Operation extends Inheritance {
    private task: Task;
    public static get SELF_TERM_ARRAY(): Term[] {
        return [Term.SELF];
    }

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
    public clone(): Operation;

    public clone(replaced: Term[]): Inheritance;
    public clone(...args: unknown[]): Operation | Inheritance {
        if (args.length === 0) {
            return new Operation(this.term);
        }
        return super.clone(args[0] as Term[]);
    }

    /**
     * Try to make a new compound from two components. Called by the inference
     * rules.
     *
     * @param addSelf include SELF term at end of product terms
     * @return A compound generated or null
     */
    public static make(statement: Statement, subj: Term, pred: Term): Statement | null;
    public static make(op: Symbols.NativeOperator, subj: Term, pred: Term, order: int): Statement | null;
    public static make(statement: Statement, subj: Term, pred: Term, order: int): Statement | null;
    public static make(o: Symbols.NativeOperator, subject: Term, predicate: Term,
        customOrder: boolean, order: int): Statement | null;
    public static make(argProduct: Term, operator: Term): Operation;
    public static make(oper: Operator, arg: Term[], addSelf: boolean): Operation;
    public static make(...args: unknown[]): Operation | Statement | null {
        if (args.length === 2) {
            const [argProduct, operator] = args as [Term, Term];
            return super.make(argProduct, operator) as Operation;
        }
        if (args.length === 3) {
            if (args[0] instanceof Statement) {
                return Statement.make(args[0], args[1] as Term, args[2] as Term);
            }
            const [oper, arg] = args as [Operator, Term[], boolean];
            return new Operation(new Product(arg), oper);
        }
        if (args.length === 4) {
            const [first, subject, predicate, order] = args as [Symbols.NativeOperator | Statement, Term, Term, int];
            return first instanceof Statement
                ? Statement.make(first, subject, predicate, order)
                : Statement.make(first, subject, predicate, order);
        }
        if (args.length === 5) {
            return Statement.make(...args as [Symbols.NativeOperator, Term, Term, boolean, int]);
        }
        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
    }

    public getOperator(): Operator {
        return this.getPredicate() as Operator;
    }

    protected makeName(): java.lang.CharSequence {
        if (this.getSubject() instanceof Product && this.getPredicate() instanceof Operator)
            return Operation.makeName(this.getPredicate().name(), (this.getSubject() as Product).term);
        return Statement.makeStatementName(this.getSubject(), Symbols.NativeOperator.INHERITANCE, this.getPredicate());
    }

    public static makeName(op: java.lang.CharSequence, arg: Term[]): java.lang.CharSequence {
        let nameBuilder: java.lang.StringBuilder = new java.lang.StringBuilder(16) // estimate
            .append(Symbols.NativeOperator.COMPOUND_TERM_OPENER.ch).append(op);

        for (let t of arg) {
            nameBuilder.append(Symbols.ARGUMENT_SEPARATOR);
            nameBuilder.append(t.name());
        }

        nameBuilder.append(Symbols.NativeOperator.COMPOUND_TERM_CLOSER.ch);
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
        return this.getSubject() as Product;
    }

}

Inheritance.registerOperationFactory((operator, terms, addSelf) =>
    Operation.make(operator as Operator, terms, addSelf));
