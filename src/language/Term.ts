//! Java source: opennars/language/Term.java
import { java, JavaObject, type JavaString, type int, type short, S } from "jree";
import type { AbstractTerm } from "./AbstractTerm.ts";
import { Texts } from "../io/Texts.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { javaStringHashCode, javaStringValue, javaStringsEqual, type JavaChar } from "../runtime/jree-compat.ts";
import type { Memory } from "../storage/Memory.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const isVariableTerm = (value: unknown): boolean =>
    typeof (value as { getType?: unknown } | null)?.getType === "function";
const compoundTerms = (value: unknown): Term[] | null => {
    const terms = (value as { term?: unknown } | null)?.term;
    return Array.isArray(terms) ? terms as Term[] : null;
};


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
export class Term extends JavaObject implements AbstractTerm {
    // Java initializes this reference to null; keeping that default matters for
    // inference branches that test whether a term has an imagination space.
    public imagination: any = null;
    // Java's atom cache is keyed only by CharSequence text.  Keep that
    // contract at the boundary instead of retaining a jree Map for a
    // domain-object key.
    private static readonly atoms: Map<string, Term> = new Map();

    // Java defines SELF as the singleton extension set {SELF}, not as the
    // atomic term SELF.  SetExt registers that value after the module cycle has
    // initialized; the atomic fallback only exists during module loading.
    private static selfValue: Term | null = null;
    public static get SELF(): Term {
        return Term.selfValue ?? Term.get("SELF");
    }

    public static installSelf(value: Term): void {
        Term.selfValue = value;
    }
    public static readonly SEQ_SPATIAL: Term = Term.get("#");
    public static readonly SEQ_TEMPORAL: Term = Term.get("&/");

    // private to cache it
    // Java permits a field and a method to share a name; an instance property
    // with that name would shadow `name()` in JavaScript. Keep the cache under a
    // distinct name so the translated method remains callable at runtime.
    private nameValue: java.lang.CharSequence | null = null;

    public static isSelf(t: Term): boolean {
        return Term.SELF.equals(t);
    }

    public operator(): NativeOperator {
        return NativeOperator.ATOM;
    }

    public isHigherOrderStatement(): boolean { // ==> <=>
        const operator = this.operator();
        return operator === NativeOperator.IMPLICATION
            || operator === NativeOperator.IMPLICATION_AFTER
            || operator === NativeOperator.IMPLICATION_WHEN
            || operator === NativeOperator.IMPLICATION_BEFORE
            || operator === NativeOperator.EQUIVALENCE
            || operator === NativeOperator.EQUIVALENCE_AFTER
            || operator === NativeOperator.EQUIVALENCE_WHEN;
    }

    public isExecutable(mem: Memory): boolean {
        // don't allow ^want and ^believe to be active/have an effect,
        // which means its only used as monitor
        let isOp: boolean = typeof (this as unknown as { getOperator?: unknown }).getOperator === "function"
            && typeof (this as unknown as { getArguments?: unknown }).getArguments === "function";
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
    public constructor();

    /**
     * Constructor with a given name
     *
     * @param name A String as the name of the Term
     */
    public constructor(name: JavaString);
    public constructor(name: java.lang.CharSequence);
    public constructor(...args: unknown[]) {
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
    public static get(name: string): Term;
    public static get(name: java.lang.CharSequence): Term;

    /** gets the atomic term of an integer */
    public static get(i: int): Term;
    public static get(...args: unknown[]): Term {
        switch (args.length) {
            case 1: {
                const [name] = args as [java.lang.CharSequence];


                const nativeName = javaStringValue(name);
                const nativeNameKey = nativeName;
                let x: Term | null = Term.atoms.get(nativeNameKey) ?? null; // only
                if (x !== null && !String(x).endsWith("]")) { // return only if it isn't an index term
                    return x;
                }

                let nameStr: java.lang.String = nativeName as unknown as java.lang.String;
                // p[s,i,j]
                let term_indices: Int32Array | null = null;
                let before_indices_str: java.lang.String | null = null;
                if (javaStringValue(nameStr).endsWith("]") && javaStringValue(nameStr).includes("[")) { // simple check, failing for most terms
                    let indices_str: java.lang.String = nameStr.split("[")[1].split("]")[0];
                    before_indices_str = nameStr.split("[")[0];
                    let ind_s: java.lang.String[] = indices_str.split(",");
                    if (ind_s.length === 2) { // only position info given
                        indices_str = java.lang.String.valueOf("1,1," + indices_str);
                        ind_s = indices_str.split(",");
                    }
                    term_indices = new Int32Array(ind_s.length);
                    for (let i: int = 0; i < ind_s.length; i++) {
                        // Java StringUtils.isNumeric accepts only unsigned decimal digits.
                        // Decimal coordinates such as -1.0 therefore stay conceptual and
                        // are mapped by Nar.dispatchToSensoryChannel before matrix access.
                        if (/^\d+$/.test(String(ind_s[i]).trim()))
                            term_indices[i] = java.lang.Integer.valueOf(ind_s[i]).valueOf();
                        else {
                            term_indices = null;
                            break;
                        }
                    }
                }

                let name2: java.lang.CharSequence = nativeName as unknown as java.lang.CharSequence;
                if (term_indices !== null) { // only on conceptual level not
                    name2 = (String(before_indices_str) + "[i,j,k,l]") as unknown as java.lang.CharSequence;
                }
                x = new Term(name2);
                x.term_indices = term_indices;
                x.index_variable = before_indices_str === null ? null : String(before_indices_str);
                Term.atoms.set(javaStringValue(name2), x);

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
        // Java's internal field is nullable: CompoundTerm.name() relies on
        // null to invalidate and lazily rebuild compound names.
        return this.nameInternal() as java.lang.CharSequence;
    }

    protected nameInternal(): java.lang.CharSequence | null {
        return this.nameValue;
    }

    public term_indices: Int32Array | null = null;
    public index_variable: string | null = "";

    /**
     * Make a new Term with the same name.
     *
     * @return The new Term
     */
    public override  clone(): Term {
        let t: Term = new Term();
        if (this.term_indices !== null) {
            t.term_indices = this.term_indices.slice();
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
        if (that === null || !(that instanceof Term) || this.getClass() !== (that as Term).getClass())
            return false; // optimization, if complexity is different they cant be equal
        // jree's JavaString currently compares its UTF-16 backing arrays through
        // a case-insensitive locale path. Term equality is Java's exact string
        // equality, so cross the boundary through the native text value here.
        return this.getComplexity() === (that as Term).getComplexity()
            && javaStringsEqual(this.name(), (that as Term).name());
    }

    /**
     * Produce a hash code for the term
     *
     * @return An integer hash code
     */
    public override  hashCode(): int {
        // Match java.lang.String.hashCode() instead of jree's typed-array hash
        // fallback, which otherwise gives unrelated term names the same hash.
        return javaStringHashCode(this.name());
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

    public recurseTerms(v: Term.TermVisitor | ((term: Term, parent: Term | null) => void), parent: Term | null): void {
        if (typeof v === "function") {
            v(this, parent);
        } else {
            v.visit(this, parent);
        }
        const terms = compoundTerms(this);
        if (terms !== null) {
            for (let t of terms) {
                t.recurseTerms(v, this);
            }
        }
    }

    public recurseSubtermsContainingVariables(v: Term.TermVisitor | ((term: Term, parent: Term | null) => void)): void;

    public recurseSubtermsContainingVariables(v: Term.TermVisitor | ((term: Term, parent: Term | null) => void), parent: Term | null): void;
    public recurseSubtermsContainingVariables(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [v] = args as [Term.TermVisitor | ((term: Term, parent: Term | null) => void)];


                this.recurseTerms(v, null);


                break;
            }

            case 2: {
                const [v, parent] = args as [Term.TermVisitor | ((term: Term, parent: Term | null) => void), Term | null];


                if (!this.hasVar())
                    return;
                if (typeof v === "function") {
                    v(this, parent);
                } else {
                    v.visit(this, parent);
                }
                const terms = compoundTerms(this);
                if (terms !== null) {
                    for (let t of terms) {
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
    protected setName(newName: java.lang.CharSequence | null): void {
        // Java callers expect CharSequence methods (hashCode/equals/etc.),
        // while translated literals arrive as native strings.
        this.nameValue = newName === null
            ? null
            : typeof newName === "string"
            ? java.lang.String.valueOf(newName)
            : newName;
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
        if (isVariableTerm(that) && !isVariableTerm(this)) {
            return 1;
        } else if (isVariableTerm(this) && !isVariableTerm(that)) {
            return -1;
        }
        // jree's java.lang.String.toString() is not a native string at this
        // boundary. Convert explicitly so Texts.compareTo receives the same
        // UTF-16 text that Java's String.compareTo compares.
        return Texts.compareTo(String(this.name()), String(that.name()));
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
    public countTermRecursively(map: java.util.Map<Term, java.lang.Integer> | null): java.util.Map<Term, java.lang.Integer> {
        if (map === null) {
            map = new java.util.LinkedHashMap<Term, java.lang.Integer>();
        }
        map.put(this, java.lang.Integer.valueOf(map.getOrDefault(this, java.lang.Integer.valueOf(0)).valueOf() + 1));
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

    public hasVar(type: JavaChar): boolean;
    public hasVar(...args: unknown[]): boolean {
        switch (args.length) {
            case 0: {

                return false;


                break;
            }

            case 1: {
                const [type] = args as [JavaChar];


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

    public static toSortedSet(...arg: Term[]): java.util.Set<Term> {
        // jree does not provide java.util.TreeSet. An ArrayList with the same
        // sorted/unique contents is sufficient for the callers here, which only
        // use retainAll() and toArray().
        return new java.util.ArrayList(Term.toSortedSetArray(...arg)) as unknown as java.util.Set<Term>;
    }

    /**
     * Apply the set difference used by the set compound factories without
     * materializing the sorted terms through a Java collection.
     */
    public static sortedDifference(left: Term[], right: Term[]): Term[] {
        return Term.toSortedSetArray(...left).filter((candidate) =>
            !right.some((other) => candidate.equals(other)));
    }

    /**
     * Apply the set intersection used by the set compound factories without
     * materializing the sorted terms through a Java collection.
     */
    public static sortedIntersection(left: Term[], right: Term[]): Term[] {
        return Term.toSortedSetArray(...left).filter((candidate) =>
            right.some((other) => candidate.equals(other)));
    }

    public static readonly EmptyTermArray: Term[] = new Array<Term>(0);

    public static toSortedSetArray(...arg: Term[]): Term[] {
        const values = arg.length === 1 && Array.isArray(arg[0])
            ? arg[0] as unknown as Term[]
            : arg;
        switch (values.length) {
            case 0:
                return Term.EmptyTermArray;
            case 1:
                return [values[0]];
            case 2:
                let a: Term = values[0];
                let b: Term = values[1];
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

        // terms > 2: TreeSet is not part of jree, so preserve its observable
        // contract with a compareTo-sorted, duplicate-free native array.
        const sorted = values.slice().sort((left, right) => left.compareTo(right));
        const unique: Term[] = [];
        for (const term of sorted) {
            if (unique.length === 0 || unique[unique.length - 1].compareTo(term) !== 0) {
                unique.push(term);
            }
        }
        return unique;
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
        // Avoid importing Statement/Variable here: that creates a Term <-
        // Statement <- CompoundTerm <- Interval <- Term evaluation cycle.
        // The two accessor methods are the stable behavioural contract needed
        // by this check, so structural dispatch preserves the Java semantics
        // without forcing the cycle at module initialization time.
        const candidate = this as Term & {
            getSubject?: () => Term;
            getPredicate?: () => Term;
        };
        if (typeof candidate.getSubject === "function" && typeof candidate.getPredicate === "function") {
            const subject = candidate.getSubject() as Term & { getType?: () => unknown; hasVarIndep?: () => boolean };
            const predicate = candidate.getPredicate() as Term & { getType?: () => unknown; hasVarIndep?: () => boolean };
            // Java checks only whether the direct subject/predicate is a
            // Variable. A compound statement containing a variable is valid;
            // treating its recursive hasVarIndep() result as a direct variable
            // incorrectly zeroes the confidence of higher-order rules.
            const isIndependentVariable = (value: Term & { getType?: () => unknown; hasVarIndep?: () => boolean }): boolean =>
                typeof value?.getType === "function"
                && typeof value?.hasVarIndep === "function"
                && value.hasVarIndep();
            return isIndependentVariable(subject) || isIndependentVariable(predicate);
        }
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Term {
    export interface TermVisitor {
        visit(t: Term, superterm: Term | null): void;
    }

}


