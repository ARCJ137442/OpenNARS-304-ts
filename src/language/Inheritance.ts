//! Java source: opennars/language/Inheritance.java
import { java, S } from "jree";
import { Statement } from "./Statement.ts";
import { Term } from "./Term.ts";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Product } from "./Product.ts";
import { Debug } from "../main/Debug.ts";
import { Symbols } from "../io/Symbols.ts";

const NativeOperator = Symbols.NativeOperator;



/**
 * A Statement about an Inheritance relation as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Inheritance extends Statement {

    private static operationFactory: ((operator: unknown, terms: Term[], addSelf: boolean) => Inheritance) | null = null;
    private static operatorPredicate: ((value: unknown) => boolean) | null = null;

    public static registerOperationFactory(factory: (operator: unknown, terms: Term[], addSelf: boolean) => Inheritance): void {
        Inheritance.operationFactory = factory;
    }

    public static registerOperatorPredicate(predicate: (value: unknown) => boolean): void {
        Inheritance.operatorPredicate = predicate;
    }

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    protected constructor(arg: Term[]);

    protected constructor(subj: Term, pred: Term);
    protected constructor(...args: unknown[]) {
        let terms: Term[];
        if (args.length === 1) {
            terms = args[0] as Term[];
        } else if (args.length === 2) {
            terms = [args[0] as Term, args[1] as Term];
        } else {
            super([]);
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        super(terms);
        this.init(terms);
    }


    /**
     * Clone an object
     *
     * @return A new object, to be casted into a SetExt
     */
    public clone(): Inheritance;

    public clone(t: Term[]): Inheritance;
    public clone(...args: unknown[]): Inheritance {
        switch (args.length) {
            case 0: {

                return Inheritance.make(this.getSubject(), this.getPredicate());


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
    public static makeTerm(subject: Term, predicate: Term): Term {
        return Inheritance.make(subject, predicate);
    }

    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return A compound generated or null
     */
    public static make(subject: Term, predicate: Term): Inheritance {

        if (subject === null || predicate === null || Statement.invalidStatement(subject, predicate)) {
            return null;
        }

        let subjectProduct: boolean = subject instanceof Product;
        let predicateOperator: boolean = Inheritance.operatorPredicate?.(predicate) ?? false;

        if (Debug.DETAILED) {
            if (!predicateOperator && predicate.toString().startsWith("^")) {
                throw new java.lang.IllegalStateException("operator term detected but is not an operator: " + predicate);
            }
        }

        if (subjectProduct && predicateOperator) {
            // name = Operation.makeName(predicate.name(), ((CompoundTerm) subject).term);
            if (Inheritance.operationFactory !== null) {
                return Inheritance.operationFactory(predicate, (subject as CompoundTerm).term, true);
            }
        } else {
            return new Inheritance(subject, predicate);
        }

        return new Inheritance(subject, predicate);

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

Statement.registerRelationFactory(NativeOperator.INHERITANCE,
    (subject, predicate) => Inheritance.make(subject, predicate));
