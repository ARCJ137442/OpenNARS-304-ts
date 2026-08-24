//! Java source: opennars/language/Variable.java
import { java, type char, type int, type short, S } from "jree";
import { Texts } from "../io/Texts.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";

const VAR_INDEPENDENT = Symbols.VAR_INDEPENDENT;
const VAR_DEPENDENT = Symbols.VAR_DEPENDENT;
const VAR_QUERY = Symbols.VAR_QUERY;



/**
 * A variable term, which does not correspond to a concept
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Variable extends Term {
    /** caches the type character for faster lookup than charAt(0) */
    private type: char = 0;

    private scope: Term;

    private hash: int;

    public constructor(name: java.lang.CharSequence);

    /**
     * Constructor, from a given variable name
     *
     * @param name A String read from input
     */
    protected constructor(name: java.lang.CharSequence, scope: Term);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [name] = args as [java.lang.CharSequence];


                // Java constructor delegation (`this(name, null)`) is not legal
                // in TypeScript; initialize the base class once and reuse the
                // shared scope setup.
                super();
                this.setScope(null, name);


                break;
            }

            case 2: {
                const [name, scope] = args as [java.lang.CharSequence, Term];


                super();
                this.setScope(scope, name);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setScope(scope: Term, n: java.lang.CharSequence): Variable {
        this.setName(n);
        const first = java.lang.String.valueOf(n).charAt(0);
        this.type = (typeof first === "number" ? String.fromCharCode(first) : first) as unknown as char;
        this.scope = scope !== null ? scope : this;
        this.hash = 0; // calculate lazily
        if (!Variable.validVariableType(this.type))
            throw new java.lang.IllegalStateException("Invalid variable type: " + n);
        return this;
    }

    /**
     * Clone a Variable
     *
     * @return The cloned Variable
     */
    public clone(): Variable {
        let v: Variable = new Variable(this.name(), this.scope);
        if (this.scope === this)
            v.scope = v;
        return v;
    }

    /**
     * Get the type of the variable
     *
     * @return The variable type
     */
    public getType(): char {
        return this.type;
    }

    /**
     * A variable is not constant
     *
     * @return false
     */
    public isConstant(): boolean {
        return false;
    }

    /**
     * The syntactic complexity of a variable is 0, because it does not refer to
     * any concept.
     *
     * @return The complexity of the term, an integer
     */
    public getComplexity(): short {
        return 0;
    }

    public hasVar(): boolean {
        return true;
    }

    public hasVarIndep(): boolean {
        return this.isIndependentVariable();
    }

    public hasVarDep(): boolean {
        return this.isDependentVariable();
    }

    public hasVarQuery(): boolean {
        return this.isQueryVariable();
    }

    public equals(that: java.lang.Object): boolean {
        if (that === this) {
            return true;
        }
        if (!(that instanceof Variable)) {
            return false;
        }
        if (!super.equals(that)) {
            return false;
        }
        let v: Variable = that as Variable;
        if (!this.name().equals(v.name())) {
            return false;
        }
        if ((this.getScope() === this && v.getScope() !== v) ||
            (this.getScope() !== this && v.getScope() === v)) {
            return false;
        }
        return (v.getScope().name().equals(this.getScope().name()));
    }

    public equalsTerm(that: java.lang.Object): boolean {
        // TODO factor these comparisons into 2 nested if's
        let v: Variable = that as Variable;
        if ((v.scope === v) && (this.scope === this))
            // both are unscoped, so compare by name only
            return this.name().equals(v.name());
        else if ((v.scope !== v) && (this.scope === this))
            return false;
        else if ((v.scope === v) && (this.scope !== this))
            return false;
        else {
            if (!this.name().equals(v.name()))
                return false;

            if (this.scope === v.scope)
                return true;

            if (this.scope.hashCode() !== v.scope.hashCode())
                return false;

            // WARNING infinnite loop can happen if the two scopes start equaling echother
            // we need a special equals comparison which ignores variable scope when
            // recursively
            // called from this
            // until then, we'll use the name for comparison because it wont
            // invoke infinite recursion

            return this.scope.name().equals(v.scope.name());
        }
    }

    public hashCode(): int {
        if (this.hash === 0) {
            if (this.scope !== this)
                this.hash = 31 * this.name().hashCode() + this.scope.hashCode();
            else
                this.hash = this.name().hashCode();
        }
        return this.hash;
    }

    public compareTo(that: AbstractTerm): int {
        if (this === that) {
            return 0;
        }
        let superCmp: int = super.compareTo(that);
        if (superCmp !== 0) {
            return superCmp;
        }
        if (!(that instanceof Variable)) {
            return 0;
        }

        let thatVar: Variable = that as Variable;
        // Java compares these names with String.compareTo (UTF-16 code-unit
        // order). jree's JavaString comparator applies locale punctuation
        // ordering, which reverses terms such as `#` and `[` and changes the
        // TreeSet order used by commutative compound terms.
        let nameCmp: int = Texts.compareTo(String(this.name()), String(thatVar.name()));
        if (nameCmp !== 0) {
            return nameCmp;
        }
        if (this.getScope() === this && thatVar.getScope() !== thatVar) {
            return 1;
        }
        if (this.getScope() !== this && thatVar.getScope() === thatVar) {
            return -1;
        }
        return Texts.compareTo(String(this.getScope().name()), String(thatVar.getScope().name()));
    }

    /*
     * variable terms are listed first alphabetically
     *
     * @param that The Term to be compared with the current Term
     *
     * @return The same as compareTo as defined on Strings
     */
    /*
     * @Override
     * public final int compareTo(final AbstractTerm that) {
     * return (that instanceof Variable) ?
     * ((Comparable)name()).compareTo(that.name()) : -1;
     * }
     */

    protected isQueryVariable(): boolean {
        return this.getType() === VAR_QUERY;
    }

    protected isDependentVariable(): boolean {
        return this.getType() === VAR_DEPENDENT;
    }

    protected isIndependentVariable(): boolean {
        return this.getType() === VAR_INDEPENDENT;
    }

    protected isCommon(): boolean {
        let n: java.lang.CharSequence = this.name();
        let l: int = n.length();
        const last = n.charAt(l - 1);
        // jree exposes Java charAt() as a numeric code unit in this runtime;
        // normalize it before applying the Java character comparison.
        return (typeof last === "number" ? String.fromCharCode(last) : String(last)) === '$';
    }

    public getScope(): Term {
        return this.scope;
    }

    // ported back from 1.7, sehs addition
    public static compare(a: Variable, b: Variable): int {
        // int i = a.name().compareTo(b.name());
        let i: int = Texts.compareTo(a.name().toString(), b.name().toString());
        if (i === 0) {
            let ascoped: boolean = a.scope !== a;
            let bscoped: boolean = b.scope !== b;
            if (!ascoped && !bscoped) {
                // if the two variables are each without scope, they are not equal.
                // so use their identityHashCode to determine a stable ordering
                let as: int = java.lang.System.identityHashCode(a.scope);
                let bs: int = java.lang.System.identityHashCode(b.scope);
                return java.lang.Integer.compare(as, bs);
            } else if (ascoped && !bscoped) {
                return -1;
            } else if (bscoped && !ascoped) {
                return 1;
            } else {
                return Texts.compareTo(a.getScope().name().toString(), b.getScope().name().toString());
                // return Texts.compare(a.getScope().name(), b.getScope().name());
            }
        }
        return i;
    }

    public static validVariableType(c: char): boolean {
        return (c === VAR_QUERY) || (c === VAR_DEPENDENT) || (c === VAR_INDEPENDENT);
    }

    private static readonly MAX_CACHED_VARNAME_INDEXES: int = 64;
    private static readonly vn1: java.lang.CharSequence[] = new Array<java.lang.CharSequence>(Variable.MAX_CACHED_VARNAME_INDEXES);
    private static readonly vn2: java.lang.CharSequence[] = new Array<java.lang.CharSequence>(Variable.MAX_CACHED_VARNAME_INDEXES);
    private static readonly vn3: java.lang.CharSequence[] = new Array<java.lang.CharSequence>(Variable.MAX_CACHED_VARNAME_INDEXES);

    public static getName(type: char, index: int): java.lang.CharSequence {
        if (index > Variable.MAX_CACHED_VARNAME_INDEXES)
            return Variable.newName(type, index);

        let cache: java.lang.CharSequence[];
        switch (type) {
            case VAR_INDEPENDENT:
                cache = Variable.vn1;
                break;
            case VAR_DEPENDENT:
                cache = Variable.vn2;
                break;
            case VAR_QUERY:
                cache = Variable.vn3;
                break;
            default:
                throw new java.lang.IllegalStateException("Invalid variable type");
        }

        let c: java.lang.CharSequence = cache[index];
        if (c == null) {
            c = Variable.newName(type, index);
            cache[index] = c;
        }

        return c;
    }

    protected static newName(type: char, index: int): java.lang.CharSequence {
        const typeText = typeof type === "number" ? String.fromCharCode(type) : String(type);
        let name = typeText;
        do {
            name += (index % 16).toString(16);
            index = Math.trunc(index / 16);
        } while (index !== 0);
        return name;
    }

    public countTermRecursively(map: java.util.Map<Term, java.lang.Integer>): java.util.Map<Term, java.lang.Integer> {
        if (map === null) {
            map = new java.util.LinkedHashMap<Term, java.lang.Integer>();
        }
        return map; // don't count vars
    }
}
