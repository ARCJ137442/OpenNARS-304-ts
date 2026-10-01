//! Java source: opennars/language/Implication.java
import type { int, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Statement } from "./Statement.ts";
import { Term } from "./Term.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Conjunction } from "./Conjunction.ts";
import { Interval } from "./Interval.ts";
import { Symbols } from "../io/Symbols.ts";
import { ReasonerInputError, ReasonerStateError } from "../runtime/ReasonerErrors.ts";
import type { JavaCharSequence } from "../runtime/java-text.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;

const operatorName = (value: unknown): string => {
    const operator = (value as { operator?: () => unknown } | null)?.operator?.();
    return String((operator as { name?: () => unknown } | null)?.name?.() ?? operator ?? "");
};
const isOperator = (value: unknown, name: string): boolean => operatorName(value) === name;



/**
 * A Statement about an Inheritance copula as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Implication extends Statement {
    private temporalOrder: int = TemporalRules.ORDER_NONE;

    // counter used for evidence tracking
    public counter: long = 1 as unknown as long;

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(arg: Term[], order: int);

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(arg: Term[], order: int, counter: long);

    public constructor(subject: Term, predicate: Term, order: int);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [arg, order] = args as [Term[], int];


                super(arg);

                this.temporalOrder = order;

                this.init(arg);


                break;
            }

            case 3: {
                const [first, second, third] = args as [Term[] | Term, int | Term, long | int];
                const components = Array.isArray(first) ? first : [first as Term, second as Term];
                const order = (Array.isArray(first) ? second : third) as int;
                const counter = Array.isArray(first) ? third as long : 1 as unknown as long;

                super(components);
                this.temporalOrder = order;
                this.counter = counter;
                this.init(components);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Implication;

    public clone(t: Term[]): Implication;
    public clone(...args: unknown[]): Implication | null {
        switch (args.length) {
            case 0: {

                return new Implication(this.term, this.getTemporalOrder(), this.counter);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                if (t === null) {
                    return null;
                }
                if (t.length !== 2)
                    throw new ReasonerStateError(`Implication requires 2 components: [${t.map(String).join(", ")}]`);

                return Implication.make(t[0], t[1], this.temporalOrder);


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
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
    public static make(statement: Statement, subj: Term, pred: Term): Statement | null;
    public static make(op: NativeOperator, subj: Term, pred: Term, order: int): Statement | null;
    public static make(statement: Statement, subj: Term, pred: Term, order: int): Statement | null;
    public static make(o: NativeOperator, subject: Term, predicate: Term,
        customOrder: boolean, order: int): Statement | null;
    public static make(subject: Term, predicate: Term): Implication;

    public static make(subject: Term, predicate: Term, temporalOrder: int): Implication;
    public static make(...args: unknown[]): Implication | Statement | null {
        switch (args.length) {
            case 2: {
                const [subject, predicate] = args as [Term, Term];


                return Implication.make(subject, predicate, TemporalRules.ORDER_NONE);


                break;
            }

            case 3: {
                // A normal implication call also has a Statement (for example
                // Inheritance) as its subject. Runtime dispatch must therefore
                // remain positional; the inherited overloads are type-only.
                const [subject, predicate, temporalOrder] = args as [Term, Term, int];


                if (Statement.invalidStatement(subject, predicate,
                    temporalOrder !== TemporalRules.ORDER_FORWARD && temporalOrder !== TemporalRules.ORDER_CONCURRENT)) {
                    return null as unknown as Implication;
                }

                if (isOperator(subject, "IMPLICATION") || isOperator(subject, "EQUIVALENCE") || isOperator(predicate, "EQUIVALENCE")
                    ||
                    (subject instanceof Interval) || (predicate instanceof Interval)) {
                    return null as unknown as Implication;
                }

                // final CharSequence name = makeName(subject, temporalOrder, predicate);
                if (predicate instanceof Implication) {
                    let oldCondition: Term = (predicate as Statement).getSubject();
                    if ((oldCondition instanceof Conjunction) && oldCondition.containsTerm(subject)) {
                        return null as unknown as Implication;
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

            case 4: {
                const [first, subject, predicate, order] = args as [NativeOperator | Statement, Term, Term, int];
                return first instanceof Statement
                    ? Statement.make(first, subject, predicate, order)
                    : Statement.make(first, subject, predicate, order);
            }

            case 5: {
                return Statement.make(...args as [NativeOperator, Term, Term, boolean, int]);
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    public static makeName(subject: Term, temporalOrder: int, predicate: Term): JavaCharSequence {
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
        return Implication.makeStatementName(subject, copula, predicate);
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
