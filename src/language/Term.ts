import { java, JavaObject, type int, type short, type char, S } from "jree";
import { Texts } from "../io/Texts";
import { SetExt } from "./SetExt";


//import org.opennars.util.sort.SortedList;

/**
 * Term is the basic component of Narsese, and the object of processing in NARS.
 * <p>
 * A Term may have an associated Concept containing relations with other Terms.
 * It is not linked in the Term, because a Concept may be forgot while the Term
 * exists. Multiple objects may represent the same Term.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Term extends JavaObject {
    // public  imagination:  ImaginationSpace;
    private static readonly atoms: java.util.Map<java.lang.CharSequence, Term> = new java.util.LinkedHashMap();

    public static readonly SELF: Term = SetExt.make(Term.get("SELF"));
    public static readonly SEQ_SPATIAL: Term = Term.get("#");
    public static readonly SEQ_TEMPORAL: Term = Term.get("&/");

    // private to cache it
    private name: string = null;

    public static isSelf(t: Term): boolean {
        return Term.SELF.equals(t);
    }

    public operator(): NativeOperator {
        return NativeOperator.ATOM;
    }

    public isHigherOrderStatement(): boolean { // ==> <=>
        return (this instanceof Equivalence) || (this instanceof Implication);
    }

    public isExecutable(mem: Memory): boolean {
        // don't allow ^want and ^believe to be active/have an effect,
        // which means its only used as monitor
        let isOp: boolean = this instanceof Operation;
        if (isOp) {
            // final Operator op = ((Operation) this).getOperator();
            // the following part may be refactored after we know more about how the NAL9
            // concepts should really interact together:
            /*
             * if(op.equals(mem.getOperator("^want")) ||
             * op.equals(mem.getOperator("^believe"))) {
             * return false;
             * }
             */
        }
        return isOp;
    }

    /**
     * Default constructor that build an internal Term
     */
    protected constructor();

    /**
     * Constructor with a given name
     *
     * @param name A String as the name of the Term
     */
    public constructor(name: java.lang.CharSequence);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 1: {
                const [name] = args as [java.lang.CharSequence];


                super();
                this.setName(name);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /** gets the atomic term given a name */
    public static get(name: java.lang.CharSequence): Term;

    /** gets the atomic term of an integer */
    public static get(i: int): Term;
    public static get(...args: unknown[]): Term {
        switch (args.length) {
            case 1: {
                const [name] = args as [java.lang.CharSequence];


                let x: Term = Term.atoms.get(name); // only
                if (x !== null && !x.toString().endsWith("]")) { // return only if it isn't an index term
                    return x;
                }

                let nameStr: java.lang.String = name.toString();
                // p[s,i,j]
                let term_indices: Int32Array = null;
                let before_indices_str: java.lang.String = null;
                if (nameStr.endsWith("]") && nameStr.contains("[")) { // simple check, failing for most terms
                    let indices_str: java.lang.String = nameStr.split("\\[")[1].split("\\]")[0];
                    before_indices_str = nameStr.split("\\[")[0];
                    let ind_s: java.lang.String[] = indices_str.split(",");
                    if (ind_s.length === 2) { // only position info given
                        indices_str = "1,1," + indices_str;
                        ind_s = indices_str.split(",");
                    }
                    term_indices = new Int32Array(ind_s.length);
                    for (let i: int = 0; i < ind_s.length; i++) {
                        if (StringUtils.isNumeric(ind_s[i]))
                            term_indices[i] = java.lang.Integer.valueOf(ind_s[i]);
                        else {
                            term_indices = null;
                            break;
                        }
                    }
                }

                let name2: java.lang.CharSequence = name;
                if (term_indices !== null) { // only on conceptual level not
                    name2 = before_indices_str + "[i,j,k,l]";
                }
                x = new Term(name2);
                x.term_indices = term_indices;
                x.index_variable = before_indices_str;
                Term.atoms.put(name2, x);

                return x;


                break;
            }

            case 1: {
                const [i] = args as [int];


                return Term.get(java.lang.Integer.toString(i));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Reporting the name of the current Term.
     *
     * @return The name of the term as a String
     */
    public name(): java.lang.CharSequence {
        return this.nameInternal();
    }

    protected nameInternal(): java.lang.CharSequence {
        return this.name;
    }

    public term_indices: int[] = null;
    public index_variable: string = "";

    /**
     * Make a new Term with the same name.
     *
     * @return The new Term
     */
    public override  clone(): Term {
        let t: Term = new Term();
        if (this.term_indices !== null) {
            t.term_indices = this.term_indices.clone();
            t.index_variable = this.index_variable;
        }
        t.setName(this.name());
        t.imagination = this.imagination;
        return t;
    }

    public cloneDeep(): Term {
        return this.clone();
    }

    /**
     * Equal terms have identical name, though not necessarily the same
     * reference.
     *
     * @return Whether the two Terms are equal
     * @param that The Term to be compared with the current Term
     */
    public override  equals(that: java.lang.Object): boolean {
        if (that === this)
            return true;
        if (this.getClass() !== this.getClass())
            return false; // optimization, if complexity is different they cant be equal
        return this.getComplexity() === (that as Term).getComplexity() && this.name().equals((that as Term).name());
    }

    /**
     * Produce a hash code for the term
     *
     * @return An integer hash code
     */
    public override  hashCode(): int {
        return this.name().hashCode();
    }

    /**
     * Check whether the current Term can name a Concept.
     * isConstant means if the term contains free variable
     * True if:
     * has zero variables, or
     * uses several instances of the same variable
     * False if it uses one instance of a variable ("free" like a "free radical" in
     * chemistry).
     * Therefore it may be considered Constant, yet actually contain variables.
     *
     * @return A Term is constant by default
     */
    public isConstant(): boolean {
        return true;
    }

    public getTemporalOrder(): int {
        return TemporalRules.ORDER_NONE;
    }

    public getIsSpatial(): boolean {
        return false;
    }

    public recurseTerms(v: Term.TermVisitor, parent: Term): void {
        v.visit(this, parent);
        if (this instanceof CompoundTerm) {
            for (let t of (this as CompoundTerm).term) {
                t.recurseTerms(v, this);
            }
        }
    }

    public recurseSubtermsContainingVariables(v: Term.TermVisitor): void;

    public recurseSubtermsContainingVariables(v: Term.TermVisitor, parent: Term): void;
    public recurseSubtermsContainingVariables(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [v] = args as [Term.TermVisitor];


                this.recurseTerms(v, null);


                break;
            }

            case 2: {
                const [v, parent] = args as [Term.TermVisitor, Term];


                if (!this.hasVar())
                    return;
                v.visit(this, parent);
                if (this instanceof CompoundTerm) {
                    for (let t of (this as CompoundTerm).term) {
                        t.recurseSubtermsContainingVariables(v, this);
                    }
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * @return The complexity of the term, an integer
     */
    // the syntactic complexity, for constant atomic Term, is 1
    public getComplexity(): short {
        return 1;
    }

    /**
     * set the name
     */
    // only method that should modify Term.name
    protected setName(newName: java.lang.CharSequence): void {
        this.name = newName;
    }

    /**
     * @param that The Term to be compared with the current Term
     * @return The same as compareTo as defined on Strings
     */
    public compareTo(that: AbstractTerm): int {
        if (that === this) {
            return 0;
        }
        // previously: Orders among terms: variable < atomic < compound
        if ((that instanceof Variable) && (this.getClass() !== Variable.class)) {
            return 1;
        } else if ((this instanceof Variable) && (that.getClass() !== Variable.class)) {
            return -1;
        }
        return Texts.compareTo(this.name().toString(), that.name().toString());
    }

    public containedTemporalRelations(): int {
        return 0;
    }

    /**
     * Recursively check if a compound contains a term
     *
     * @param target The term to be searched
     * @return Whether the two have the same content
     */
    public containsTermRecursively(target: Term): boolean {
        if (target === null) {
            return false;
        }
        return this.equals(target);
    }

    /**
     * Recursively count how often the terms are contained
     *
     * @param map The count map that will be created to count how often each term
     *            occurs
     * @return The counts of the terms
     */
    public countTermRecursively(map: java.util.Map<Term, java.lang.Integer>): java.util.Map<Term, java.lang.Integer> {
        if (map === null) {
            map = new java.util.LinkedHashMap<Term, java.lang.Integer>();
        }
        map.put(this, map.getOrDefault(this, 0) + 1);
        return map;
    }

    /** whether this contains a term in its components. */
    public containsTerm(target: Term): boolean {
        return this.equals(target);
    }

    /**
     * The same as getName by default, used in display only.
     *
     * @return The name of the term as a String
     */
    public override toString(): java.lang.String {
        return this.name().toString();
    }

    /**
     * Creates a quote-escaped term from a string. Useful for an atomic term that is
     * meant to contain a message as its name
     */
    public static text(t: java.lang.String): Term {
        return Term.get("\"" + t + "\"");
    }

    /**
     * Whether this compound term contains any variable term
     *
     * @return Whether the name contains a variable
     */
    public hasVar(): boolean;

    public hasVar(type: char): boolean;
    public hasVar(...args: unknown[]): boolean {
        switch (args.length) {
            case 0: {

                return false;


                break;
            }

            case 1: {
                const [type] = args as [char];


                switch (type) {
                    case Symbols.VAR_DEPENDENT:
                        return this.hasVarDep();
                    case Symbols.VAR_INDEPENDENT:
                        return this.hasVarIndep();
                    case Symbols.VAR_QUERY:
                        return this.hasVarQuery();

                    default:

                }
                throw new java.lang.IllegalStateException("Invalid variable type: " + type);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public hasVarIndep(): boolean {
        return false;
    }

    public hasInterval(): boolean {
        return false;
    }

    public hasVarDep(): boolean {
        return false;
    }

    public hasVarQuery(): boolean {
        return false;
    }

    public static toSortedSet(...arg: Term[]): java.util.NavigableSet<Term> {
        // use toSortedSetArray where possible
        let t: java.util.NavigableSet<Term> = new java.util.TreeSet();
        java.util.Collections.addAll(t, arg);
        return t;
    }

    public static readonly EmptyTermArray: Term[] = new Array<Term>(0);

    public static toSortedSetArray(...arg: Term[]): Term[] {
        switch (arg.length) {
            case 0:
                return Term.EmptyTermArray;
            case 1:
                return [arg[0]];
            case 2:
                let a: Term = arg[0];
                let b: Term = arg[1];
                let c: int = a.compareTo(b);

                if (Debug.DETAILED) {
                    // verify consistency of compareTo() and equals()
                    let equal: boolean = a.equals(b);
                    if ((equal && (c !== 0)) || (!equal && (c === 0))) {
                        throw new java.lang.IllegalStateException("invalid order: " + a + " = " + b);
                    }
                }

                if (c < 0)
                    return [a, b];
                else if (c > 0)
                    return [b, a];
                else if (c === 0)
                    return [a];

            default:
            // equal

        }

        // TODO fast sorted array for arg.length == 3

        // terms > 2:
        let s: java.util.NavigableSet<Term> = new java.util.TreeSet();
        // SortedList<Term> s = new SortedList<>(arg.length);
        // s.setAllowDuplicate(false);

        java.util.Collections.addAll(s, arg);

        return s.toArray(new Array<Term>(0));
    }

    /**
     * performs a thorough check of the validity of a term (by cloneDeep it) to see
     * if it's valid
     */
    public static valid(content: Term): boolean {
        let cloned: Term = content.cloneDeep();
        return cloned !== null;
    }

    public subjectOrPredicateIsIndependentVar(): boolean {
        if (this instanceof Statement) {
            let cont: Statement = this as Statement;
            if (cont.getSubject() instanceof Variable) {
                let v: Variable = cont.getSubject() as Variable;
                if (v.hasVarIndep()) {
                    return true;
                }
            }
            if (cont.getPredicate() instanceof Variable) {
                let v: Variable = cont.getPredicate() as Variable;
                return v.hasVarIndep();
            }
        }
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Term {
    export interface TermVisitor {
        visit(t: Term, superterm: Term): void;
    }

}


