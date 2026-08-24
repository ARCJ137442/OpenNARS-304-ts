//! Java source: opennars/language/CompoundTerm.java
import { java, type short, type int, JavaObject, S } from "jree";
import { Term } from "./Term.ts";
import type { AbstractTerm } from "./AbstractTerm.ts";
import { Interval } from "./Interval.ts";
import { Variable } from "./Variable.ts";
import { Symbols } from "../io/Symbols.ts";
import { Debug } from "../main/Debug.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Terms } from "./Terms.ts";
import type { Memory } from "../storage/Memory.ts";
import type { TermLink } from "../entity/TermLink.ts";
import type { JavaChar } from "../runtime/jree-compat.ts";

const javaStringHashCode = (value: java.lang.CharSequence): int => {
    let hash = 0;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
        hash = Math.imul(31, hash) + text.charCodeAt(index);
    }
    return hash;
};

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const COMPOUND_TERM_OPENER = NativeOperator.COMPOUND_TERM_OPENER;
const COMPOUND_TERM_CLOSER = NativeOperator.COMPOUND_TERM_CLOSER;



/**
 * Compound term as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export abstract class CompoundTerm extends Term implements Iterable<Term> {

    /**
     * list of (direct) term
     *
     */
    // TODO make final again
    public readonly term: Term[];

    /**
     * syntactic complexity of the compound, the sum of those of its term plus 1
     */
    // TODO make final again
    public complexity: short = 0;

    /** Whether contains a variable */
    private hasVariables: boolean = false;


    /** Whether contains a variable */
    private hasVarQueries: boolean = false;


    /** Whether contains a variable */
    private hasVarIndeps: boolean = false;


    /** Whether contains a variable */
    private hasVarDeps: boolean = false;


    /** Whether contains a variable */
    private hasIntervals: boolean = false;

    // Java permits a cache field and accessor method to share a name; a JS
    // instance field would shadow the method, so keep the cache distinct.
    protected containedTemporalRelationsCache: int = -1;
    protected hash: int = 0;
    private normalized: boolean = false;

    /**
     * method to get the operator of the compound
     */
    public abstract operator(): NativeOperator;

    /**
     * clone method
     *
     * @return A clone of the compound term
     */
    public abstract clone(): CompoundTerm;
    public abstract clone(replaced: Term[]): Term;

    /**
     * subclasses should be sure to call init() in their constructors;
     * it is not done here to allow subclass constructors to set data before calling
     * init()
     */
    public constructor(components: Term[]) {
        super();
        this.term = components;
    }

    public static ConvRectangle = class ConvRectangle extends JavaObject {
        public index_variable: string | null = null;
        public term_indices: Int32Array | null = null; // size X, size Y, pos X, pos Y, min size X, min size Y

        public constructor() {
            super();
        } // the latter two for being able to assing a relative index for size too
    };


    public static UpdateConvRectangle(term: Term[]): CompoundTerm.ConvRectangle {
        let index_last_var: string | null = null;
        let minX: int = java.lang.Integer.MAX_VALUE;
        let minY: int = java.lang.Integer.MAX_VALUE;
        let maxX: int = 0;
        let maxY: int = 0;
        let
            minsX: int = java.lang.Integer.MAX_VALUE;
        let minsY: int = java.lang.Integer.MAX_VALUE;
        let hasTermIndices: boolean = false;
        let calculateTermIndices: boolean = true;
        for (let t of term) {
            if (t !== null && t.term_indices !== null) {
                if (!calculateTermIndices ||
                    (t.index_variable !== null && index_last_var !== null &&
                        (String(t.index_variable) !== String(index_last_var)))) {
                    calculateTermIndices = false;
                    hasTermIndices = false;
                    continue; // different "channels", don't calculate term indices
                }
                hasTermIndices = true;
                let size_X: int = t.term_indices[0];
                if (size_X < minsX)
                    minsX = size_X;
                let size_Y: int = t.term_indices[1];
                if (size_Y < minsY)
                    minsY = size_Y;
                let pos_X: int = t.term_indices[2];
                let pos_Y: int = t.term_indices[3];
                if (pos_X < minX)
                    minX = pos_X;
                if (pos_Y < minY)
                    minY = pos_Y;
                if (pos_X + size_X > maxX)
                    maxX = pos_X + size_X;
                if (pos_Y + size_Y > maxY)
                    maxY = pos_Y + size_Y;

                index_last_var = t.index_variable;
            }
        }
        let rect: CompoundTerm.ConvRectangle = new CompoundTerm.ConvRectangle();// = new ConvRectangle();
        if (hasTermIndices) {
            rect.term_indices = new Int32Array(6);
            rect.term_indices[0] = maxX - minX;
            rect.term_indices[1] = maxY - minY;
            rect.term_indices[2] = minX;
            rect.term_indices[3] = minY;
            rect.term_indices[4] = minsX;
            rect.term_indices[5] = minsY;
            rect.index_variable = index_last_var;
        }
        return rect;
    }

    /** call this after changing Term[] contents */
    protected init(term: Term[]): void {

        this.complexity = 1;
        this.hasVariables = this.hasVarDeps = this.hasVarIndeps = this.hasVarQueries = false;

        if (this.term_indices === null) {
            let rect: CompoundTerm.ConvRectangle = CompoundTerm.UpdateConvRectangle(term);
            this.index_variable = rect.index_variable;
            this.term_indices = rect.term_indices;
        }

        for (let t of term) {

            this.complexity += t.getComplexity();
            this.hasVariables ||= t.hasVar();
            this.hasVarDeps ||= t.hasVarDep();
            this.hasVarIndeps ||= t.hasVarIndep();
            this.hasVarQueries ||= t.hasVarQuery();
            this.hasIntervals ||= t.hasInterval();
        }

        this.invalidateName();

        if (!this.hasVar())
            this.setNormalized(true);
    }

    public invalidateName(): void {
        this.setName(null); // invalidate name so it will be (re-)created lazily
        for (let t of this.term) {
            if (t.hasVar())
                if (t instanceof CompoundTerm)
                    (t as CompoundTerm).invalidateName();
        }
        this.setNormalized(false);
    }

    public cloneDeep(): CompoundTerm {
        let c: Term = this.clone(this.cloneTermsDeep());
        if (c === null)
            return null;
        if (Debug.DETAILED && c.getClass() !== java.lang.Object.getClass()) // debug relevant, while it is natural due to interval
            // simplification to reduce to other term type,
            // other cases should not appear
            java.lang.System.out.println("cloneDeep resulted in different class: " + c + " from " + this);
        if (this.isNormalized())
            (c as CompoundTerm).setNormalized(true);
        if (!(c instanceof CompoundTerm)) {
            return null;
        }
        return c as CompoundTerm;
    }

    public static transformIndependentVariableToDependent(T: CompoundTerm): void { // a special instance of
        // transformVariableTermsDeep in
        // 1.7
        let term: Term[] = T.term;
        for (let i: int = 0; i < term.length; i++) {
            let t: Term = term[i];
            if (t.hasVar()) {
                if (t instanceof CompoundTerm) {
                    CompoundTerm.transformIndependentVariableToDependent(t as CompoundTerm);
                } else if (t instanceof Variable && (t as Variable).isIndependentVariable()) { /* it's a variable */
                    term[i] = new Variable("" + Symbols.VAR_DEPENDENT + t.name().subSequence(1, t.name().length())); // vars.get(t.toString());
                    /* assert term[i] != null; */
                }
            }
        }
    }

    protected static readonly conceptival: Interval = new Interval(1);

    private static ReplaceIntervals(comp: CompoundTerm): void {
        if (!comp.hasIntervals) {
            return;
        }

        comp.invalidateName();
        for (let i: int = 0; i < comp.term.length; i++) {
            let t: Term = comp.term[i];
            if (t instanceof Interval) {
                /* assert conceptival != null; */
                comp.term[i] = CompoundTerm.conceptival;
                comp.invalidateName();
            } else if (t instanceof CompoundTerm) {
                CompoundTerm.ReplaceIntervals(t as CompoundTerm);
            }
        }
    }

    public static replaceIntervals(T: Term): Term {
        if (T instanceof CompoundTerm) {
            T = T.cloneDeep(); // we will operate on a copy
            if (T === null) {
                return null; // not a valid concept term
            }
            CompoundTerm.ReplaceIntervals(T as CompoundTerm);
        }
        return T;
    }

    private static ExtractIntervals(mem: Memory, ivals: java.util.List<java.lang.Long>, comp: CompoundTerm): void {
        for (let i: int = 0; i < comp.term.length; i++) {
            let t: Term = comp.term[i];
            if (t instanceof Interval) {
                ivals.add((t as Interval).time);
            } else if (t instanceof CompoundTerm) {
                CompoundTerm.ExtractIntervals(mem, ivals, t as CompoundTerm);
            }
        }
    }

    public static extractIntervals(mem: Memory, T: Term): java.util.List<java.lang.Long> {
        let ret: java.util.List<java.lang.Long> = new java.util.ArrayList<java.lang.Long>();
        if (T instanceof CompoundTerm) {
            CompoundTerm.ExtractIntervals(mem, ret, T as CompoundTerm);
        }
        return ret;
    }

    public static UnableToCloneException = class UnableToCloneException extends java.lang.RuntimeException {

        public constructor(message: java.lang.String) {
            super(message);
        }

        public override  fillInStackTrace(): java.lang.Throwable {
            if (Debug.DETAILED) {
                return super.fillInStackTrace();
            } else {
                // avoid recording stack trace for efficiency reasons
                return this;
            }
        }

    };


    public cloneDeepVariables(): CompoundTerm {
        let c: Term = this.clone(this.cloneVariableTermsDeep());

        if (c === null)
            return null;

        if (Debug.DETAILED && c.getClass() !== java.lang.Object.getClass())
            java.lang.System.out.println("cloneDeepVariables resulted in different class: " + c + " from " + this);

        let cc: CompoundTerm = c as CompoundTerm;
        cc.setNormalized(this.isNormalized());
        return cc;
    }

    public containedTemporalRelations(): int {
        if (this.containedTemporalRelationsCache === -1) {

            this.containedTemporalRelationsCache = 0;

            // Keep CompoundTerm independent from statement subclasses. Java's
            // instanceof checks are narrowed by the relation operator here;
            // Conjunction also exposes getTemporalOrder but is not a statement.
            const operatorName = String(this.operator()?.name?.() ?? this.operator());
            if (operatorName.startsWith("IMPLICATION") || operatorName.startsWith("EQUIVALENCE")) {
                const temporalOrder = (this as unknown as { getTemporalOrder: () => int }).getTemporalOrder();
                switch (temporalOrder) {
                    case TemporalRules.ORDER_FORWARD:
                    case TemporalRules.ORDER_CONCURRENT:
                    case TemporalRules.ORDER_BACKWARD:
                        this.containedTemporalRelationsCache = 1;

                    default:

                }
            }

            for (let t of this.term)
                this.containedTemporalRelationsCache += t.containedTemporalRelations();
        }
        return this.containedTemporalRelationsCache;
    }

    /**
     * build a component list from terms
     *
     * @return the component list
     */
    public static termArray(...t: Term[]): Term[] {
        return t;
    }

    public static termList(...t: Term[]): java.util.List<Term> {
        return java.util.Arrays.asList(t as Term[]);
    }

    /* ----- utilities for oldName ----- */
    /**
     * default method to make the oldName of the current term from existing
     * fields. needs overridden in certain subclasses
     *
     * @return the oldName of the term
     */
    protected makeName(): java.lang.CharSequence {
        return CompoundTerm.makeCompoundName(this.operator(), ...this.term);
    }

    public name(): java.lang.CharSequence {
        if (this.nameInternal() === null) {
            this.setName(this.makeName());
        }
        return this.nameInternal();
    }

    /**
     * default method to make the oldName of a compound term from given fields
     *
     * @param op  the term operator
     * @param arg the list of term
     * @return the oldName of the term
     */
    protected static makeCompoundName(op: NativeOperator, ...arg: Term[]): java.lang.CharSequence {
        const opString = op.toString();
        const names = arg.map((t) => String(t.name()));
        return new java.lang.String(
            `${COMPOUND_TERM_OPENER.ch}${opString}${Symbols.ARGUMENT_SEPARATOR}${names.join(Symbols.ARGUMENT_SEPARATOR)}${COMPOUND_TERM_CLOSER.ch}`);
    }

    /* ----- utilities for other fields ----- */
    /**
     * report the term's syntactic complexity
     *
     * @return the complexity value
     */
    public getComplexity(): short {
        return this.complexity;
    }

    /**
     * Check if the order of the term matters
     * <p>
     * commutative CompoundTerms: Sets, Intersections Commutative Statements:
     * Similarity, Equivalence (except the one with a temporal order)
     * Commutative CompoundStatements: Disjunction, Conjunction (except the one
     * with a temporal order)
     *
     * @return The default value is false
     */
    public isCommutative(): boolean {
        return false;
    }

    /* ----- extend Collection methods to component list ----- */
    /**
     * get the number of term
     *
     * @return the size of the component list
     */
    public size(): int {
        return this.term.length;
    }

    /** Gives a set of all contained term, recursively */
    public getContainedTerms(): java.util.Set<Term> {
        let s: java.util.Set<Term> = new java.util.LinkedHashSet(this.getComplexity());
        for (let t of this.term) {
            s.add(t);
            if (t instanceof CompoundTerm)
                s.addAll((t as CompoundTerm).getContainedTerms());
        }
        return s;
    }

    /**
     * Clone the component list
     *
     * @return The cloned component list
     */
    public cloneTerms(...additional: Term[]): Term[] {
        return CompoundTerm.cloneTermsAppend(this.term, additional);
    }

    /**
     * Cloned array of Terms, except for one or more Terms.
     *
     * @param toRemove
     * @return the cloned array with the missing terms removed, OR null if no terms
     *         were actually removed when requireModification=true
     */
    public cloneTermsExcept(requireModification: boolean, toRemove: Term[]): Term[] {
        // TODO if deep, this wastes created clones that are then removed. correct this
        // inefficiency?

        let l: java.util.List<Term> = this.asTermList();
        let removed: boolean = false;

        for (let t of toRemove) {
            if (l.remove(t))
                removed = true;
        }
        if ((!removed) && (requireModification))
            return null;

        return l.toArray(new Array<Term>(0));
    }

    /**
     * Deep clone an array list of terms
     *
     * @param original The original component list
     * @return an identical and separate copy of the list
     */
    public static cloneTermsAppend(original: Term[], additional: Term[]): Term[] {
        if (original === null) {
            return null;
        }

        let L: int = original.length + additional.length;
        if (L === 0)
            return original;

        // TODO apply preventUnnecessaryDeepCopy to more cases

        let arr: Term[] = new Array<Term>(L);

        let i: int;
        let j: int = 0;
        let srcArray: Term[] = original;
        for (i = 0; i < L; i++) {
            if (i === original.length) {
                srcArray = additional;
                j = 0;
            }

            arr[i] = srcArray[j++];
        }

        return arr;

    }

    public asTermList(): java.util.List<Term> {
        let l: java.util.List<Term> = new java.util.ArrayList<Term>(this.term.length);
        this.addTermsTo(l);
        return l;
    }

    /** forced deep clone of terms */
    public cloneTermsDeep(): Term[] {
        let l: Term[] = new Array<Term>(this.term.length);
        for (let i: int = 0; i < l.length; i++) {
            l[i] = this.term[i].cloneDeep();
            if (l[i] === null) {
                return null;
            }
        }
        return l;
    }

    public cloneVariableTermsDeep(): Term[] {
        let l: Term[] = new Array<Term>(this.term.length);
        for (let i: int = 0; i < l.length; i++) {
            let t: Term = this.term[i];
            if (t.hasVar()) {
                if (t instanceof CompoundTerm) {
                    t = (t as CompoundTerm).cloneDeepVariables();
                } else /* it's a variable */
                    t = t.clone();
            }
            l[i] = t;
        }
        return l;
    }

    /** forced deep clone of terms */
    public cloneTermsListDeep(): java.util.List<Term> {
        let l: java.util.List<Term> = new java.util.ArrayList<Term>(this.term.length);
        for (let t of this.term)
            l.add(t.clone());
        return l;
    }

    public static shuffle(ar: Term[], randomNumber: java.util.Random): void {
        if (ar.length < 2) {
            return;
        }

        for (let i: int = ar.length - 1; i > 0; i--) {
            let index: int = randomNumber.nextInt(i + 1);
            // Simple swap
            let a: Term = ar[index];
            ar[index] = ar[i];
            ar[i] = a;
        }
    }

    /**
     * Check whether the compound contains a certain component
     * Also matches variables, ex: (&&,<a --> b>,<b --> c>) also contains <a --> #1>
     *
     * @param t The component to be checked
     * @return Whether the component is in the compound
     */
    /*
     * extra comment because it is a Implementation detail - question:
     *
     * Check whether the compound contains a certain component
     * Also matches variables, ex: (&&,<a --> b>,<b --> c>) also contains <a --> #1>
     * ^^^ is this right? if so then try containsVariablesAsWildcard
     */
    public containsTerm(t: Term): boolean {
        return Terms.contains(this.term, t);
        // return Terms.containsVariablesAsWildcard(term, t);
    }

    /**
     * Recursively check if a compound contains a term
     *
     * @param target The term to be searched
     * @return Whether the target is in the current term
     */
    public containsTermRecursively(target: Term): boolean {
        if (super.containsTermRecursively(target))
            return true;
        for (let term of this.term) {
            if (term.containsTermRecursively(target)) {
                return true;
            }
        }
        return false;
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
        map.put(this, java.lang.Integer.valueOf(map.getOrDefault(this, java.lang.Integer.valueOf(0)).valueOf() + 1));
        for (let term of this.term) {
            term.countTermRecursively(map);
        }
        return map;
    }

    /**
     * Add all the components of term t into components recursively
     *
     * @param t          The term
     * @param components The components
     * @return
     */
    public static addComponentsRecursively(t: Term, components: java.util.Set<Term>): java.util.Set<Term> {
        if (components === null) {
            components = new java.util.LinkedHashSet<Term>();
        }
        components.add(t);
        if (t instanceof CompoundTerm) {
            let cTerm: CompoundTerm = t as CompoundTerm;
            for (let component of cTerm.term) {
                CompoundTerm.addComponentsRecursively(component, components);
            }
        }
        return components;
    }

    /**
     * Check whether the compound contains all term of another term, or
     * that term as a whole
     *
     * @param t The other term
     * @return Whether the term are all in the compound
     */
    public containsAllTermsOf(t: Term): boolean {
        if (this.getClass() === t.getClass()) { // (t instanceof CompoundTerm) {
            return Terms.containsAll(this.term, (t as CompoundTerm).term);
        } else {
            return Terms.contains(this.term, t);
        }
    }

    /**
     * Try to replace a component in a compound at a given index by another one
     *
     * @param index  The location of replacement
     * @param t      The new component
     * @param memory Reference to the memory
     * @return The new compound
     */
    public setComponent(index: int, t: Term, memory: Memory): Term {
        let list: java.util.List<Term> = this.asTermList();// Deep();
        list.remove(index);
        if (t !== null) {
            if (this.getClass() !== t.getClass()) {
                list.add(index, t);
            } else {
                // final List<Term> list2 = ((CompoundTerm) t).cloneTermsList();
                let tt: Term[] = (t as CompoundTerm).term;
                for (let i: int = 0; i < tt.length; i++) {
                    list.add(index + i, tt[i]);
                }
            }
        }
        if (this.isCommutative()) {
            let ret: Term[] = list.toArray(new Array<Term>(0));
            return Terms.term(this, ret);
        }
        return Terms.term(this, list);
    }

    /* ----- variable-related utilities ----- */
    /**
     * Whether this compound term contains any variable term
     *
     * @return Whether the name contains a variable
     */
    public hasVar(): boolean;
    public hasVar(type: JavaChar): boolean;
    public hasVar(...args: unknown[]): boolean {
        // Java overload dispatch is part of the contract: hasVar(type) must
        // reach Term.hasVar(type), rather than the cached any-variable flag.
        if (args.length === 0) {
            return this.hasVariables;
        }
        if (args.length === 1) {
            return super.hasVar(args[0] as JavaChar);
        }
        throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
    }

    public hasVarDep(): boolean {
        return this.hasVarDeps;
    }

    public hasVarIndep(): boolean {
        return this.hasVarIndeps;
    }

    public hasVarQuery(): boolean {
        return this.hasVarQueries;
    }

    public hasInterval(): boolean {
        return this.hasIntervals;
    }

    /**
     * Recursively apply a substitute to the current CompoundTerm
     * May return null if the term can not be created
     *
     * @param subs
     */
    public applySubstitute(subs: java.util.Map<Term, Term>): Term {
        if ((subs === null) || (subs.isEmpty())) {
            return this;// .clone();
        }

        let tt: Term[] = new Array<Term>(this.term.length);
        let modified: boolean = false;

        for (let i: int = 0; i < tt.length; i++) {
            let t1: Term = tt[i] = this.term[i];

            if (subs.containsKey(t1)) {
                let t2: Term = subs.get(t1);
                while (subs.containsKey(t2)) {
                    t2 = subs.get(t2);
                }
                // prevents infinite recursion
                if (!t2.containsTerm(t1)) {
                    tt[i] = t2; // t2.clone();
                    modified = true;
                }
            } else if (t1 instanceof CompoundTerm) {
                let ss: Term = (t1 as CompoundTerm).applySubstitute(subs);
                if (ss !== null) {
                    tt[i] = ss;
                    if (!tt[i].equals(this.term[i]))
                        modified = true;
                }
            }
        }
        if (!modified)
            return this;

        if (this.isCommutative()) {
            java.util.Arrays.sort(tt);
        }

        return this.clone(tt);
    }

    /**
     * returns result of applySubstitute, if and only if it's a CompoundTerm.
     * otherwise it is null
     */
    public applySubstituteToCompound(substitute: java.util.Map<Term, Term>): CompoundTerm {
        let t: Term = this.applySubstitute(substitute);
        if (t instanceof CompoundTerm)
            return (t as CompoundTerm);
        return null;
    }

    /* ----- link CompoundTerm and its term ----- */
    /**
     * Build TermLink templates to constant term and subcomponents
     * <p>
     * The compound type determines the link type; the component type determines
     * whether to build the link.
     *
     * @return A list of TermLink templates
     */
    public prepareComponentLinks(): java.util.List<TermLink> {
        // complexity seems like an upper bound for the resulting number of
        // componentLinks.
        // Capacity is only an optimization; avoid passing a Java short through
        // jree's native ArrayList length constructor.
        let componentLinks: java.util.List<TermLink> = new java.util.ArrayList<TermLink>();
        return Terms.prepareComponentLinks(componentLinks, this);
    }

    public addTermsTo(c: java.util.Collection<Term>): void {
        for (const term of this.term) {
            c.add(term);
        }
    }

    public hashCode(): int {
        // jree JavaString.equals/hashCode may fold case; Java String does not.
        return javaStringHashCode(this.name());
    }

    public compareTo(that: AbstractTerm): int {
        if (that === this) {
            return 0;
        }
        return super.compareTo(that);
    }

    public equals(that: java.lang.Object): boolean {
        if (that === this)
            return true;
        if (!(that instanceof Term))
            return false;
        return String(this.name()) === String((that as Term).name());
    }

    public setNormalized(b: boolean): void {
        this.normalized = b;
    }

    public isNormalized(): boolean {
        return this.normalized;
    }

    public cloneTermsReplacing(from: Term, to: Term): Term[] {
        let y: Term[] = new Array<Term>(this.term.length);
        let i: int = 0;
        for (let x of this.term) {
            if (x.equals(from))
                x = to;
            y[i++] = x;
        }
        return y;
    }

    public iterator(): java.util.Iterator<Term> {
        return new java.util.ArrayList<Term>(this.term).iterator();
    }

    public [Symbol.iterator](): IterableIterator<Term> {
        let index = 0;
        const terms = this.term;
        return {
            next: (): IteratorResult<Term> => index < terms.length
                ? { value: terms[index++], done: false }
                : { value: undefined as unknown as Term, done: true },
            [Symbol.iterator](): IterableIterator<Term> {
                return this;
            },
        };
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace CompoundTerm {
    export type ConvRectangle = InstanceType<typeof CompoundTerm.ConvRectangle>;
    export type UnableToCloneException = InstanceType<typeof CompoundTerm.UnableToCloneException>;
}


