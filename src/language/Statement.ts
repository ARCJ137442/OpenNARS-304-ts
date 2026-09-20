//! Java source: opennars/language/Statement.java
import type { int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";
import { Terms } from "./Terms.ts";
import { Debug } from "../main/Debug.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../runtime/JavaExceptions.ts";
import { javaStringValue } from "../runtime/jree-compat.ts";

type StatementFactory = (subject: Term, predicate: Term, order: int) => Statement;
type StatementRuntime = Record<string, any>;
type NativeOperator = Symbols.NativeOperator;
type StatementName = ReturnType<CompoundTerm["name"]>;

const javaArrayToString = (values: unknown[]): string =>
    `[${values.map(value => value === null || value === undefined ? "null" : javaStringValue(value)).join(", ")}]`;

/** Java original type: Statement.EnumStatementSide. */
class EnumStatementSide {
    public static readonly SUBJECT = new EnumStatementSide("SUBJECT", 0);
    public static readonly PREDICATE = new EnumStatementSide("PREDICATE", 1);

    private constructor(
        private readonly enumName: string,
        private readonly enumOrdinal: int,
    ) {}

    public name(): string {
        return this.enumName;
    }

    public ordinal(): int {
        return this.enumOrdinal;
    }

    public toString(): string {
        return this.enumName;
    }
}



/**
 * A statement is a compound term as defined in the NARS-theory, consisting of a
 * subject, a predicate, and a
 * relation symbol in between. It can be of either first-order or higher-order.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract class Statement extends CompoundTerm {

    private static readonly relationFactories = new Map<string, StatementFactory>();
    private static runtime: StatementRuntime | null = null;

    public static registerRuntime(runtime: StatementRuntime): void {
        Statement.runtime = runtime;
        const operators = Symbols.NativeOperator;
        Statement.relationFactories.set(String(operators.INHERITANCE),
            (subject, predicate) => runtime.Inheritance.make(subject, predicate));
        Statement.relationFactories.set(String(operators.INSTANCE),
            (subject, predicate) => runtime.Instance.make(subject, predicate));
        Statement.relationFactories.set(String(operators.PROPERTY),
            (subject, predicate) => runtime.Property.make(subject, predicate));
        Statement.relationFactories.set(String(operators.INSTANCE_PROPERTY),
            (subject, predicate) => runtime.InstanceProperty.make(subject, predicate));
        Statement.relationFactories.set(String(operators.SIMILARITY),
            (subject, predicate) => runtime.Similarity.make(subject, predicate));
        Statement.relationFactories.set(String(operators.IMPLICATION),
            (subject, predicate, order) => runtime.Implication.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.IMPLICATION_AFTER),
            (subject, predicate, order) => runtime.Implication.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.IMPLICATION_BEFORE),
            (subject, predicate, order) => runtime.Implication.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.IMPLICATION_WHEN),
            (subject, predicate, order) => runtime.Implication.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.EQUIVALENCE),
            (subject, predicate, order) => runtime.Equivalence.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.EQUIVALENCE_AFTER),
            (subject, predicate, order) => runtime.Equivalence.make(subject, predicate, order));
        Statement.relationFactories.set(String(operators.EQUIVALENCE_WHEN),
            (subject, predicate, order) => runtime.Equivalence.make(subject, predicate, order));
    }

    private static getRuntime(): StatementRuntime {
        if (Statement.runtime === null) {
            throw new JavaIllegalStateException("Statement runtime classes are not registered");
        }
        return Statement.runtime;
    }

    public static registerRelationFactory(operator: unknown, factory: StatementFactory): void {
        Statement.relationFactories.set(String(operator), factory);
    }

    /**
     * Constructor with partial values, called by make
     * Subclass constructors should call init after any initialization
     *
     * @param arg The component list of the term
     */
    protected constructor(arg: Term[]) {
        super(arg);
    }

    protected init(t: Term[]): void {
        if (t.length !== 2)
            throw new JavaIllegalStateException("Requires 2 terms: " + javaArrayToString(t));
        if (t[0] === null)
            throw new JavaIllegalStateException("Null subject: " + this);
        if (t[1] === null)
            throw new JavaIllegalStateException("Null predicate: " + this);
        if (Debug.DETAILED) {
                    if (this.isCommutative()) {
                if (t[0].compareTo(t[1]) === 1) {
                    throw new JavaIllegalStateException(
                        "Commutative term requires natural order of subject,predicate: " + javaArrayToString(t));
                }
            }
        }
        super.init(t);
    }

    /**
     * Make a Statement from given components, called by the rules
     *
     * @return The Statement built
     * @param subj      The first component
     * @param pred      The second component
     * @param statement A sample statement providing the class type
     */
    public static make(statement: Statement, subj: Term, pred: Term): Statement | null;

    /**
     * Make a Statement from given term, called by the rules
     *
     * @param order The temporal order of the statement
     * @return The Statement built
     * @param subj The first component
     * @param pred The second component
     */
    public static make(op: NativeOperator, subj: Term, pred: Term, order: int): Statement | null;

    public static make(statement: Statement, subj: Term, pred: Term, order: int): Statement | null;

    /**
     * Make a Statement from String, called by StringParser
     *
     * @param o         The relation String
     * @param subject   The first component
     * @param predicate The second component
     * @return The Statement built
     */
    public static make(o: NativeOperator, subject: Term, predicate: Term,
        customOrder: boolean, order: int): Statement | null;
    public static make(...args: unknown[]): Statement | null {
        switch (args.length) {
            case 3: {
                const [statement, subj, pred] = args as [Statement, Term, Term];
                const runtime = Statement.getRuntime();


                if (statement instanceof runtime.Inheritance) {
                    return runtime.Inheritance.make(subj, pred);
                }
                if (statement instanceof runtime.Similarity) {
                    return runtime.Similarity.make(subj, pred);
                }
                if (statement instanceof runtime.Implication) {
                    return runtime.Implication.make(subj, pred, statement.getTemporalOrder());
                }
                if (statement instanceof runtime.Equivalence) {
                    return runtime.Equivalence.make(subj, pred, statement.getTemporalOrder());
                }
                return null;


                break;
            }

            case 4: {
                const [first, subj, pred, order] = args as [NativeOperator | Statement, Term, Term, int];
                const op = first instanceof Statement ? first.operator() : first;
                return Statement.make(op as NativeOperator, subj, pred, true, order);


                break;
            }

            case 5: {
                const [o, subject, predicate, customOrder, order] = args as [NativeOperator, Term, Term, boolean, int];



                if (Terms.equalSubTermsInRespectToImageAndProduct(subject, predicate)) {
                    return null;
                }
                const factory = Statement.relationFactories.get(String(o));
                if (factory === undefined) {
                    return null;
                }

                // Java's overload derives temporal order from the relation when
                // customOrder is false. This matters for parser input such as
                // =/> and =|>, which intentionally calls this overload with
                // order=0.
                let effectiveOrder: int = customOrder ? order : TemporalRules.ORDER_NONE;
                if (!customOrder) {
                    switch (o) {
                        case Symbols.NativeOperator.IMPLICATION_AFTER:
                        case Symbols.NativeOperator.EQUIVALENCE_AFTER:
                            effectiveOrder = TemporalRules.ORDER_FORWARD;
                            break;
                        case Symbols.NativeOperator.IMPLICATION_BEFORE:
                            effectiveOrder = TemporalRules.ORDER_BACKWARD;
                            break;
                        case Symbols.NativeOperator.IMPLICATION_WHEN:
                        case Symbols.NativeOperator.EQUIVALENCE_WHEN:
                            effectiveOrder = TemporalRules.ORDER_CONCURRENT;
                            break;
                        default:
                            break;
                    }
                }
                return factory(subject, predicate, effectiveOrder);


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /**
     * Make a symmetric Statement from given term and temporal
     * information, called by the rules
     *
     * @param statement A sample asymmetric statement providing the class type
     * @param subj      The first component
     * @param pred      The second component
     * @param order     The temporal order
     * @return The Statement built
     */
    public static makeSym(statement: Statement, subj: Term, pred: Term,
        order: int): Statement | null {
        const runtime = Statement.getRuntime();
        if (statement instanceof runtime.Inheritance) {
            return runtime.Similarity.make(subj, pred);
        }
        if (statement instanceof runtime.Implication) {
            return runtime.Equivalence.make(subj, pred, order);
        }
        return null;
    }

    /**
     * Override the default in making the nameStr of the current term from
     * existing fields
     *
     * @return the nameStr of the term
     */
    protected makeName(): StatementName {
        return Statement.makeStatementName(this.getSubject(), this.operator(), this.getPredicate());
    }

    protected static makeStatementName(subject: Term, relation: NativeOperator,
        predicate: Term): StatementName {
        const subjectName = javaStringValue(subject.name());
        const predicateName = javaStringValue(predicate.name());
        return `${Symbols.NativeOperator.STATEMENT_OPENER.ch}${subjectName} ${relation.toString()} ${predicateName}${Symbols.NativeOperator.STATEMENT_CLOSER.ch}` as unknown as StatementName;
    }

    public static invalidStatement(subject: Term, predicate: Term): boolean;

    /**
     * Check the validity of a potential Statement. [To be refined]
     * <p>
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return Whether The Statement is invalid
     */
    public static invalidStatement(subject: Term, predicate: Term,
        checkSameTermInPredicateAndSubject: boolean): boolean;
    public static invalidStatement(...args: unknown[]): boolean {
        switch (args.length) {
            case 2: {
                const [subject, predicate] = args as [Term, Term];


                return Statement.invalidStatement(subject, predicate, true);


                break;
            }

            case 3: {
                const [subject, predicate, checkSameTermInPredicateAndSubject] = args as [Term, Term, boolean];


                if (subject === null || predicate === null)
                    return true;

                if (checkSameTermInPredicateAndSubject && subject.equals(predicate)) {
                    return true;
                }
                if (checkSameTermInPredicateAndSubject && Statement.invalidReflexive(subject, predicate)) {
                    return true;
                }
                if (checkSameTermInPredicateAndSubject && Statement.invalidReflexive(predicate, subject)) {
                    return true;
                }
                if ((subject instanceof Statement) && (predicate instanceof Statement)) {
                    let s1: Statement = subject as Statement;
                    let s2: Statement = predicate as Statement;
                    let t11: Term = s1.getSubject();
                    let t22: Term = s2.getPredicate();
                    let t12: Term = s1.getPredicate();
                    let t21: Term = s2.getSubject();
                    return t11.equals(t22) && t12.equals(t21);
                }
                return false;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /**
     * Check if one term is identical to or included in another one, except in a
     * reflexive relation
     * <p>
     *
     * @param t1 The first term
     * @param t2 The second term
     * @return Whether they cannot be related in a statement
     */
    private static invalidReflexive(t1: Term, t2: Term): boolean {
        if (!(t1 instanceof CompoundTerm)) {
            return false;
        }
        let ct1: CompoundTerm = t1 as CompoundTerm;
        const operatorName = String(ct1.operator()?.name?.() ?? ct1.operator());
        if (operatorName === "IMAGE_EXT" || operatorName === "IMAGE_INT") {
            return false;
        }
        return ct1.containsTerm(t2);
    }

    public static invalidPair(s1: Term, s2: Term): boolean {
        let s1Indep: boolean = s1.hasVarIndep();
        let s2Indep: boolean = s2.hasVarIndep();
        if (s1Indep && !s2Indep) {
            return true;
        } else
            return !s1Indep && s2Indep;
    }

    /**
     * Check the validity of a potential Statement. [To be refined]
     * <p>
     * Minimum requirement: the two terms cannot be the same, or containing each
     * other as component
     *
     * @return Whether The Statement is invalid
     */
    public invalid(): boolean {
        return Statement.invalidStatement(this.getSubject(), this.getPredicate());
    }

    /**
     * Return the first component of the statement
     *
     * @return The first component
     */
    public getSubject(): Term {
        return this.term[0];
    }

    /**
     * Return the second component of the statement
     *
     * @return The second component
     */
    public getPredicate(): Term {
        return this.term[1];
    }

    /**
     * returns the subject (0) or predicate(1)
     *
     * @param side subject(0) or predicate(1)
     * @return the term of the side
     */
    public retBySide(side: Statement.EnumStatementSide): Term {
        return side === Statement.EnumStatementSide.SUBJECT ? this.getSubject() : this.getPredicate();
    }

    public static retOppositeSide(side: Statement.EnumStatementSide): Statement.EnumStatementSide {
        return side === Statement.EnumStatementSide.SUBJECT ? Statement.EnumStatementSide.PREDICATE : Statement.EnumStatementSide.SUBJECT;
    }

    public static EnumStatementSide = EnumStatementSide;


    public abstract clone(): Statement;
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Statement {
    export type EnumStatementSide = typeof Statement.EnumStatementSide.SUBJECT;
}


