import { java, type int, S } from "jree";



/**
 * A statement is a compound term as defined in the NARS-theory, consisting of a
 * subject, a predicate, and a
 * relation symbol in between. It can be of either first-order or higher-order.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract class Statement extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     * Subclass constructors should call init after any initialization
     *
     * @param arg The component list of the term
     */
    protected constructor(/* final */  arg: Term[] | null) {
        super(arg);
    }

    protected init(/* final */  t: Term[] | null): void {
        if (t.length !== 2)
            throw new java.lang.IllegalStateException("Requires 2 terms: " + java.util.Arrays.toString(t));
        if (t[0] === null)
            throw new java.lang.IllegalStateException("Null subject: " + this);
        if (t[1] === null)
            throw new java.lang.IllegalStateException("Null predicate: " + this);
        if (Debug.DETAILED) {
            if (isCommutative()) {
                if (t[0].compareTo(t[1]) === 1) {
                    throw new java.lang.IllegalStateException(
                        "Commutative term requires natural order of subject,predicate: " + java.util.Arrays.toString(t));
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
    public static make(/* final */  statement: Statement | null, /* final */  subj: Term | null, /* final */  pred: Term | null): Statement | null;

    /**
     * Make a Statement from given term, called by the rules
     *
     * @param order The temporal order of the statement
     * @return The Statement built
     * @param subj The first component
     * @param pred The second component
     */
    public static make(/* final */  op: NativeOperator | null, /* final */  subj: Term | null, /* final */  pred: Term | null, /* final */  order: int): Statement | null;

    public static make(/* final */  statement: Statement | null, /* final */  subj: Term | null, /* final */  pred: Term | null, /* final */  order: int): Statement | null;

    /**
     * Make a Statement from String, called by StringParser
     *
     * @param o         The relation String
     * @param subject   The first component
     * @param predicate The second component
     * @return The Statement built
     */
    public static make(/* final */  o: NativeOperator | null, /* final */  subject: Term | null, /* final */  predicate: Term | null,
            /* final */  customOrder: boolean, /* final */  order: int): Statement | null;
    public static make(...args: unknown[]): Statement | null {
        switch (args.length) {
            case 3: {
                const [statement, subj, pred] = args as [Statement, Term, Term];


                if (statement instanceof Inheritance) {
                    return Inheritance.make(subj, pred);
                }
                if (statement instanceof Similarity) {
                    return Similarity.make(subj, pred);
                }
                if (statement instanceof Implication) {
                    return Implication.make(subj, pred, statement.getTemporalOrder());
                }
                if (statement instanceof Equivalence) {
                    return Equivalence.make(subj, pred, statement.getTemporalOrder());
                }
                return null;


                break;
            }

            case 4: {
                const [op, subj, pred, order] = args as [NativeOperator, Term, Term, int];



                return Statement.make(op, subj, pred, true, order);


                break;
            }

            case 4: {
                const [statement, subj, pred, order] = args as [Statement, Term, Term, int];



                return Statement.make(statement.operator(), subj, pred, true, order);


                break;
            }

            case 5: {
                const [o, subject, predicate, customOrder, order] = args as [NativeOperator, Term, Term, boolean, int];



                if (Terms.equalSubTermsInRespectToImageAndProduct(subject, predicate)) {
                    return null;
                }

                switch (o) {
                    case INHERITANCE:
                        return Inheritance.make(subject, predicate);
                    case SIMILARITY:
                        return Similarity.make(subject, predicate);
                    case java.time.chrono.HijrahChronology.INSTANCE:
                        return Instance.make(subject, predicate);
                    case PROPERTY:
                        return Property.make(subject, predicate);
                    case INSTANCE_PROPERTY:
                        return InstanceProperty.make(subject, predicate);
                    case IMPLICATION:
                        return Implication.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_NONE);
                    case IMPLICATION_AFTER:
                        return Implication.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_FORWARD);
                    case IMPLICATION_BEFORE:
                        return Implication.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_BACKWARD);
                    case IMPLICATION_WHEN:
                        return Implication.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_CONCURRENT);
                    case EQUIVALENCE:
                        return Equivalence.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_NONE);
                    case EQUIVALENCE_AFTER:
                        return Equivalence.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_FORWARD);
                    case EQUIVALENCE_WHEN:
                        return Equivalence.make(subject, predicate, customOrder ? order : TemporalRules.ORDER_CONCURRENT);
                    default:
                        java.lang.System.out.println("Unknown Term operator: " + o + " (" + o.name() + ")");
                }

                return null;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public static makeSym(/* final */  statement: Statement | null, /* final */  subj: Term | null, /* final */  pred: Term | null,
            /* final */  order: int): Statement | null {
        if (statement instanceof Inheritance) {
            return Similarity.make(subj, pred);
        }
        if (statement instanceof Implication) {
            return Equivalence.make(subj, pred, order);
        }
        return null;
    }

    /**
     * Override the default in making the nameStr of the current term from
     * existing fields
     *
     * @return the nameStr of the term
     */
    protected makeName(): java.lang.CharSequence | null {
        return Statement.makeStatementName(this.getSubject(), operator(), this.getPredicate());
    }

    protected static makeStatementName(/* final */  subject: Term | null, /* final */  relation: NativeOperator | null,
            /* final */  predicate: Term | null): java.lang.CharSequence | null {
        let subjectName: java.lang.CharSequence = subject.name();
        let predicateName: java.lang.CharSequence = predicate.name();
        let length: int = subjectName.length() + predicateName.length() + relation.toString().length() + 4;

        let cb: java.nio.CharBuffer = java.nio.CharBuffer.allocate(length);

        cb.append(STATEMENT_OPENER.ch);

        // Texts.append(cb, subjectName);
        cb.append(subjectName);

        cb.append(' ').append(relation.toString()).append(' ');

        // Texts.append(cb, predicateName);
        cb.append(predicateName);

        cb.append(STATEMENT_CLOSER.ch);

        return cb.compact().toString();
    }

    public static invalidStatement(/* final */  subject: Term | null, /* final */  predicate: Term | null): boolean;

    /**
     * Check the validity of a potential Statement. [To be refined]
     * <p>
     *
     * @param subject   The first component
     * @param predicate The second component
     * @return Whether The Statement is invalid
     */
    public static invalidStatement(/* final */  subject: Term | null, /* final */  predicate: Term | null,
            /* final */  checkSameTermInPredicateAndSubject: boolean): boolean;
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
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    private static invalidReflexive(/* final */  t1: Term | null, /* final */  t2: Term | null): boolean {
        if (!(t1 instanceof CompoundTerm)) {
            return false;
        }
        let ct1: CompoundTerm = t1 as CompoundTerm;
        if ((ct1 instanceof ImageExt) || (ct1 instanceof ImageInt)) {
            return false;
        }
        return ct1.containsTerm(t2);
    }

    public static invalidPair(/* final */  s1: Term | null, /* final */  s2: Term | null): boolean {
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
    public getSubject(): Term | null {
        return term[0];
    }

    /**
     * Return the second component of the statement
     *
     * @return The second component
     */
    public getPredicate(): Term | null {
        return term[1];
    }

    /**
     * returns the subject (0) or predicate(1)
     *
     * @param side subject(0) or predicate(1)
     * @return the term of the side
     */
    public retBySide(/* final */  side: Statement.EnumStatementSide | null): Term | null {
        return side === Statement.EnumStatementSide.SUBJECT ? this.getSubject() : this.getPredicate();
    }

    public static retOppositeSide(/* final */  side: Statement.EnumStatementSide | null): Statement.EnumStatementSide | null {
        return side === Statement.EnumStatementSide.SUBJECT ? Statement.EnumStatementSide.PREDICATE : Statement.EnumStatementSide.SUBJECT;
    }

    public static EnumStatementSide = class EnumStatementSide extends java.lang.Enum<EnumStatementSide> {
        public static readonly SUBJECT: EnumStatementSide = new class extends EnumStatementSide {
        }(S`SUBJECT`, 0);
        public static readonly PREDICATE: EnumStatementSide = new class extends EnumStatementSide {
        }(S`PREDICATE`, 1),
    };


    public abstract clone(): Statement | null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Statement {
    export type EnumStatementSide = InstanceType<typeof Statement.EnumStatementSide>;
}


