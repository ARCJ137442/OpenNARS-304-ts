//! Java source: opennars/language/Terms.java
import { java, S } from "jree";
import type { int, short } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { CompoundTerm } from "./CompoundTerm.ts";
import { Symbols } from "../io/Symbols.ts";
import { TermLink } from "../entity/TermLink.ts";
import type { Statement } from "./Statement.ts";
import { Variable } from "./Variable.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Term } from "./Term.ts";
import type { Memory } from "../storage/Memory.ts";
import { javaValuesEqual } from "../runtime/jree-compat.ts";
import { NativeList } from "../runtime/NativeList.ts";
import { NativeSet } from "../runtime/NativeSet.ts";

type TermsRuntime = Record<string, any>;

const {
    SET_EXT_OPENER, SET_INT_OPENER, INTERSECTION_EXT, INTERSECTION_INT,
    DIFFERENCE_EXT, DIFFERENCE_INT, INHERITANCE, PRODUCT, IMAGE_EXT, IMAGE_INT,
    NEGATION, DISJUNCTION, CONJUNCTION, SEQUENCE, SPATIAL, PARALLEL,
    IMPLICATION, IMPLICATION_AFTER, IMPLICATION_BEFORE, IMPLICATION_WHEN,
    EQUIVALENCE, EQUIVALENCE_AFTER, EQUIVALENCE_WHEN,
} = Symbols.NativeOperator;

const isStatementTerm = (value: unknown): boolean => {
    if (!(value instanceof CompoundTerm)) {
        return false;
    }
    const operator = (value as CompoundTerm).operator?.();
    return Boolean(operator?.relation);
};

const operatorName = (value: unknown): string => {
    const operator = (value as { operator?: () => unknown } | null)?.operator?.();
    const name = (operator as { name?: () => unknown } | null)?.name?.();
    return String(name ?? operator ?? "");
};

const isOperator = (value: unknown, name: string): boolean => {
    const actual = operatorName(value);
    if (actual === name) {
        return true;
    }
    // Java's `instanceof Conjunction` also covers temporal conjunctions
    // (`&/`, `&|`, and spatial conjunction). The port sees their native
    // operator names instead, so preserve that class-level dispatch here.
    if (name === "CONJUNCTION") {
        return actual === "SEQUENCE" || actual === "PARALLEL" || actual === "SPATIAL";
    }
    if (name === "IMPLICATION") {
        return actual === "IMPLICATION_AFTER" || actual === "IMPLICATION_BEFORE" || actual === "IMPLICATION_WHEN";
    }
    if (name === "EQUIVALENCE") {
        return actual === "EQUIVALENCE_AFTER" || actual === "EQUIVALENCE_WHEN";
    }
    return false;
};

/**
 * Java's TermLink preparation passes each inspected component through a
 * punctuation-only Sentence constructor. That constructor is also the place
 * where variable scopes are normalized. Importing Sentence here would create
 * a CompoundTerm -> Terms -> Sentence -> CompoundTerm initialization cycle,
 * so keep this small, synchronous part of the contract at the lower layer.
 */
const normalizeComponentForLinks = (term: Term): Term => {
    if (!(term instanceof CompoundTerm) || !term.hasVar() || term.isNormalized()) {
        return term;
    }

    const normalized = term.cloneDeepVariables();
    if (!(normalized instanceof CompoundTerm)) {
        return term;
    }

    const variables: Variable[] = [];
    normalized.recurseSubtermsContainingVariables((candidate) => {
        if (candidate instanceof Variable) {
            variables.push(candidate);
        }
    });

    const rename = new Map<string, java.lang.CharSequence>();
    let renamed = false;
    for (const variable of variables) {
        let variableName = String(variable.name());
        if (!variable.hasVarIndep()) {
            variableName += " " + String(variable.getScope().name());
        }

        let normalizedName = rename.get(variableName);
        if (normalizedName == null) {
            normalizedName = Variable.getName(variable.getType(), rename.size + 1);
            rename.set(variableName, normalizedName);
            if (String(normalizedName) !== variableName) {
                renamed = true;
            }
        }
        variable.setScope(normalized, normalizedName);
    }

    if (renamed) {
        normalized.invalidateName();
    }
    normalized.setNormalized(true);
    return normalized;
};



/**
 * Static utility class for static methods related to Terms
 *
 * @author Patrick Hammer
 */
// Java implicit Object -> native TypeScript class; this class is a static utility namespace.
export class Terms {

    private static runtime: TermsRuntime | null = null;

    public static registerRuntime(runtime: TermsRuntime): void {
        Terms.runtime = runtime;
    }

    private static getRuntime(): TermsRuntime {
        if (Terms.runtime === null) {
            throw new java.lang.IllegalStateException("Terms runtime classes are not registered");
        }
        return Terms.runtime;
    }

    public static equalSubTermsInRespectToImageAndProduct(a: Term, b: Term): boolean {
        if (a === null || b === null) {
            return false;
        }
        if (!((a instanceof CompoundTerm) && (b instanceof CompoundTerm))) {
            return a.equals(b);
        }
        if (isOperator(a, "INHERITANCE") && isOperator(b, "INHERITANCE")) {
            return Terms.equalSubjectPredicateInRespectToImageAndProduct(a, b);
        }
        if (isOperator(a, "SIMILARITY") && isOperator(b, "SIMILARITY")) {
            return Terms.equalSubjectPredicateInRespectToImageAndProduct(a, b)
                || Terms.equalSubjectPredicateInRespectToImageAndProduct(b, a);
        }
        let A: Term[] = (a as CompoundTerm).term;
        let B: Term[] = (b as CompoundTerm).term;
        if (A.length !== B.length || !(a.operator().equals(b.operator()))) {
            return false;
        } else {
            for (let i: int = 0; i < A.length; i++) {
                let x: Term = A[i];
                let y: Term = B[i];
                if (!x.equals(y)) {
                    if (isOperator(x, "INHERITANCE") && isOperator(y, "INHERITANCE")) {
                        if (!Terms.equalSubjectPredicateInRespectToImageAndProduct(x, y)) {
                            return false;
                        } else {
                            continue;
                        }
                    }
                    if (isOperator(x, "SIMILARITY") && isOperator(y, "SIMILARITY")) {
                        if (!Terms.equalSubjectPredicateInRespectToImageAndProduct(x, y)
                            && !Terms.equalSubjectPredicateInRespectToImageAndProduct(y, x)) {
                            return false;
                        } else {
                            continue;
                        }
                    }
                    return false;
                }
            }
            return true;
        }
    }

    public static reduceUntilLayer2(_itself: CompoundTerm, replacement: Term, memory: Memory): Term {
        if (_itself === null)
            return null as unknown as Term;

        let reduced: Term = Terms.reduceComponentOneLayer(_itself, replacement, memory);
        if (!(reduced instanceof CompoundTerm))
            return null as unknown as Term;

        let itself: CompoundTerm = reduced as CompoundTerm;
        let j: int = 0;
        for (let t of itself.term) {
            let t2: Term = Terms.unwrapNegation(t);
            if (!isOperator(t2, "IMPLICATION") && !isOperator(t2, "EQUIVALENCE")
                && !isOperator(t2, "CONJUNCTION") && !isOperator(t2, "DISJUNCTION")) {
                j++;
                continue;
            }
            let ret2: Term = Terms.reduceComponentOneLayer(t2 as CompoundTerm, replacement, memory);

            // CompoundTerm itselfCompound = itself;
            let replaced: Term = null as unknown as Term;
            if (j < itself.term.length)
                replaced = itself.setComponent(j, ret2, memory);

            if (replaced !== null) {
                if (replaced instanceof CompoundTerm)
                    itself = replaced as CompoundTerm;
                else
                    return replaced;
            }
            j++;
        }
        return itself;
    }

    /* static methods making new compounds, which may return null */
    /**
     * Try to make a compound term from a template and a list of term
     *
     * @param compound   The template
     * @param components The term
     * @return A compound term or null
     */
    public static term(compound: CompoundTerm, components: Term[]): Term;

    public static term(compound: CompoundTerm, components: NativeList<Term>): Term;

    public static term(compound: CompoundTerm, components: java.util.Collection<Term>): Term;

    /**
     * Try to make a compound term from an operator and a list of term
     * <p>
     * Called from StringParser
     *
     * @param copula        Term operator
     * @param componentList Component list
     * @return A term or null
     */
    public static term(copula: Symbols.NativeOperator, componentList: Term[]): Term;
    public static term(...args: unknown[]): Term {
        switch (args.length) {
            case 2: {
                const [source, rawComponents] = args as [CompoundTerm | Symbols.NativeOperator, Term[] | NativeList<Term> | java.util.Collection<Term>];
                const componentList: Term[] = Array.isArray(rawComponents)
                    ? rawComponents
                    : rawComponents instanceof NativeList
                        ? rawComponents.toArray()
                        : rawComponents.toArray(new Array<Term>(0));
                if (source instanceof CompoundTerm) {
                    // Java preserves the image template's relation index when
                    // rebuilding its components. Re-entering the one-argument
                    // parser form treats the first component as the relation
                    // and changes ImageInt/ImageExt semantics.
                    const runtime = Terms.getRuntime();
                    const relationIndex = (source as CompoundTerm & { relationIndex?: short }).relationIndex;
                    if (source.operator() === IMAGE_EXT && relationIndex !== undefined) {
                        return new runtime.ImageExt(componentList, relationIndex);
                    }
                    if (source.operator() === IMAGE_INT && relationIndex !== undefined) {
                        return runtime.ImageInt.make(componentList, relationIndex);
                    }
                    return Terms.term(source.operator(), componentList);
                }
                const copula = source as Symbols.NativeOperator;
                const runtime = Terms.getRuntime();


                switch (copula) {

                    case SET_EXT_OPENER:
                        return runtime.SetExt.make(componentList);
                    case SET_INT_OPENER:
                        return runtime.SetInt.make(componentList);
                    case INTERSECTION_EXT:
                        return runtime.IntersectionExt.make(componentList);
                    case INTERSECTION_INT:
                        return runtime.IntersectionInt.make(componentList);
                    case DIFFERENCE_EXT:
                        return runtime.DifferenceExt.make(componentList);
                    case DIFFERENCE_INT:
                        return runtime.DifferenceInt.make(componentList);
                    case INHERITANCE:
                        return runtime.Inheritance.make(componentList[0], componentList[1]);
                    case PRODUCT:
                        return new runtime.Product(...componentList);
                    case IMAGE_EXT:
                        return runtime.ImageExt.make(componentList);
                    case IMAGE_INT:
                        return runtime.ImageInt.make(componentList);
                    case NEGATION:
                        return runtime.Negation.make(componentList);
                    case DISJUNCTION:
                        return runtime.Disjunction.make(componentList);
                    case CONJUNCTION:
                        return runtime.Conjunction.make(componentList);
                    case SEQUENCE:
                        return runtime.Conjunction.make(componentList, TemporalRules.ORDER_FORWARD);
                    case SPATIAL:
                        return runtime.Conjunction.make(componentList, TemporalRules.ORDER_FORWARD, true);
                    case PARALLEL:
                        return runtime.Conjunction.make(componentList, TemporalRules.ORDER_CONCURRENT);
                    case IMPLICATION:
                        return runtime.Implication.make(componentList[0], componentList[1]);
                    case IMPLICATION_AFTER:
                        return runtime.Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_FORWARD);
                    case IMPLICATION_BEFORE:
                        return runtime.Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_BACKWARD);
                    case IMPLICATION_WHEN:
                        return runtime.Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_CONCURRENT);
                    case EQUIVALENCE:
                        return runtime.Equivalence.make(componentList[0], componentList[1]);
                    case EQUIVALENCE_WHEN:
                        return runtime.Equivalence.make(componentList[0], componentList[1], TemporalRules.ORDER_CONCURRENT);
                    case EQUIVALENCE_AFTER:
                        return runtime.Equivalence.make(componentList[0], componentList[1], TemporalRules.ORDER_FORWARD);
                    default:
                        throw new java.lang.IllegalStateException("Unknown Term operator: " + copula + " (" + copula.name() + ")");
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Try to remove a component from a compound
     *
     * @param compound  The compound
     * @param component The component
     * @param memory    Reference to the memory
     * @return The new compound
     */
    public static reduceComponents(compound: CompoundTerm, component: Term, memory: Memory): Term {
        let list: Term[];
        if (compound.getClass() === component.getClass()) {
            list = compound.cloneTermsExcept(true, (component as CompoundTerm).term);
        } else {
            list = compound.cloneTermsExcept(true, [component]);
        }
        if (list !== null) {
            if (list.length > 1) {
                return Terms.term(compound, list);
            }
            if (list.length === 1) {
                if (isOperator(compound, "CONJUNCTION") || isOperator(compound, "DISJUNCTION")
                    || isOperator(compound, "INTERSECTION_EXT") || isOperator(compound, "INTERSECTION_INT")
                    || isOperator(compound, "DIFFERENCE_EXT") || isOperator(compound, "DIFFERENCE_INT")) {
                    return list[0];
                }
            }
        }
        return null as unknown as Term;
    }

    public static reduceComponentOneLayer(compound: CompoundTerm, component: Term, memory: Memory): Term {
        let list: Term[];
        if (compound.getClass() === component.getClass()) {
            list = compound.cloneTermsExcept(true, (component as CompoundTerm).term);
        } else {
            list = compound.cloneTermsExcept(true, [component]);
        }
        if (list !== null) {
            if (list.length > 1) {
                return Terms.term(compound, list);
            } else if (list.length === 1) {
                return list[0];
            }
        }
        return compound;
    }

    public static unwrapNegation(T: Term): Term {
        if (T !== null && isOperator(T, "NEGATION")) {
            return (T as CompoundTerm).term[0];
        }
        return T;
    }

    public static equalSubjectPredicateInRespectToImageAndProduct(a: Term, b: Term): boolean {

        if (a === null || b === null) {
            return false;
        }

        if (!isStatementTerm(a) && !isStatementTerm(b)) {
            return false;
        }

        if (a.equals(b)) {
            return true;
        }

        let A: Statement = a as Statement;
        let B: Statement = b as Statement;

        if (!(isOperator(A, "SIMILARITY") && isOperator(B, "SIMILARITY")
            || isOperator(A, "INHERITANCE") && isOperator(B, "INHERITANCE")))
            return false;

        let subjA: Term = A.getSubject();
        let predA: Term = A.getPredicate();
        let subjB: Term = B.getSubject();
        let predB: Term = B.getPredicate();

        let ta: Term = null as unknown as Term;
        let tb: Term = null as unknown as Term;
        let sa: Term = null as unknown as Term;
        let sb: Term = null as unknown as Term;

        if (isOperator(subjA, "PRODUCT") && isOperator(predB, "IMAGE_EXT")) {
            ta = predA;
            sa = subjA;
            tb = subjB;
            sb = predB;
        }
        if (isOperator(subjB, "PRODUCT") && isOperator(predA, "IMAGE_EXT")) {
            ta = subjA;
            sa = predA;
            tb = predB;
            sb = subjB;
        }
        if (isOperator(predA, "IMAGE_EXT") && isOperator(predB, "IMAGE_EXT")) {
            ta = subjA;
            sa = predA;
            tb = subjB;
            sb = predB;
        }
        if (isOperator(subjA, "IMAGE_INT") && isOperator(subjB, "IMAGE_INT")) {
            ta = predA;
            sa = subjA;
            tb = predB;
            sb = subjB;
        }
        if (isOperator(predA, "PRODUCT") && isOperator(subjB, "IMAGE_INT")) {
            ta = subjA;
            sa = predA;
            tb = predB;
            sb = subjB;
        }
        if (isOperator(predB, "PRODUCT") && isOperator(subjA, "IMAGE_INT")) {
            ta = predA;
            sa = subjA;
            tb = subjB;
            sb = predB;
        }

        if (ta === null) {
            return false;
        }

        if (sa === null || sb === null)
            throw new java.lang.IllegalStateException("Equivalence requires 2 components: " + sa + sb);
        let sat: Term[] = (sa as CompoundTerm).term;
        let sbt: Term[] = (sb as CompoundTerm).term;

        if (isOperator(sa, "IMAGE_EXT") && isOperator(sb, "IMAGE_EXT")
            || isOperator(sa, "IMAGE_INT") && isOperator(sb, "IMAGE_INT")) {
            let im1 = sa as CompoundTerm & { relationIndex: number };
            let im2 = sb as CompoundTerm & { relationIndex: number };
            if (im1.relationIndex !== im2.relationIndex) {
                return false;
            }
        }

        // Java source: Set<Term> componentsA/B = new LinkedHashSet<>(...);
        // These are local membership sets; NativeSet preserves Term.equals
        // de-duplication and insertion order without exposing a List/array.
        const componentsA = new NativeSet<Term>();
        const componentsB = new NativeSet<Term>();

        componentsA.add(ta);
        for (const term of sat) {
            componentsA.add(term);
        }

        componentsB.add(tb);
        for (const term of sbt) {
            componentsB.add(term);
        }

        for (let sA of componentsA) {
            let had: boolean = false;
            for (let sB of componentsB) {
                if (sA instanceof Variable && sB instanceof Variable) {
                    if (javaValuesEqual(sA.name(), sB.name())) {
                        had = true;
                    }
                } else if (sA.equals(sB)) {
                    had = true;
                }
            }
            if (!had) {
                return false;
            }
        }

        return true;
    }

    public static prepareComponentLinks(componentLinks: NativeList<TermLink>, ct: CompoundTerm): NativeList<TermLink>;

    /**
     * Collect TermLink templates into a list, go down one level except in
     * special cases
     * <p>
     *
     * @param componentLinks The list of TermLink templates built so far
     * @param type           The type of TermLink to be built
     * @param term           The CompoundTerm for which the links are built
     */
    public static prepareComponentLinks(componentLinks: NativeList<TermLink>, type: short,
        term: CompoundTerm): NativeList<TermLink>;
    public static prepareComponentLinks(...args: unknown[]): NativeList<TermLink> {
        switch (args.length) {
            case 2: {
                const [componentLinks, ct] = args as [NativeList<TermLink>, CompoundTerm];


                let type: short = isStatementTerm(ct) ? TermLink.COMPOUND_STATEMENT : TermLink.COMPOUND; // default
                return Terms.prepareComponentLinks(componentLinks, type, ct);


                break;
            }

            case 3: {
                const [componentLinks, type, term] = args as [NativeList<TermLink>, short, CompoundTerm];



                let tEquivalence: boolean = isOperator(term, "EQUIVALENCE");
                let tImplication: boolean = isOperator(term, "IMPLICATION");

                for (let i: int = 0; i < term.size(); i++) {
                    let t1: Term = term.term[i];
                    t1 = normalizeComponentForLinks(t1);
                    if (!(t1 instanceof Variable)) {
                        componentLinks.add(new TermLink(type, t1, i));
                    }
                    if ((tEquivalence || (tImplication && (i === 0)))
                        && (isOperator(t1, "CONJUNCTION") || isOperator(t1, "NEGATION"))) {
                        Terms.prepareComponentLinks(componentLinks, TermLink.COMPOUND_CONDITION, t1 as CompoundTerm);
                    } else if (t1 instanceof CompoundTerm) {
                        let ct1: CompoundTerm = t1 as CompoundTerm;
                        let ct1Size: int = ct1.size(); // cache because this loop is critical
                        let t1ProductOrImage: boolean = isOperator(t1, "PRODUCT")
                            || isOperator(t1, "IMAGE_EXT") || isOperator(t1, "IMAGE_INT");

                        for (let j: int = 0; j < ct1Size; j++) {
                            let t2: Term = ct1.term[j];
                            t2 = normalizeComponentForLinks(t2);

                            if (!t2.hasVar()) {
                                if (t1ProductOrImage) {
                                    if (type === TermLink.COMPOUND_CONDITION) {
                                        componentLinks.add(new TermLink(TermLink.TRANSFORM, t2, 0, i, j));
                                    } else {
                                        componentLinks.add(new TermLink(TermLink.TRANSFORM, t2, i, j));
                                    }
                                } else {
                                    componentLinks.add(new TermLink(type, t2, i, j));
                                }
                            }
                            if (isOperator(t2, "PRODUCT") || isOperator(t2, "IMAGE_EXT")
                                || isOperator(t2, "IMAGE_INT")) {
                                let ct2: CompoundTerm = t2 as CompoundTerm;
                                let ct2Size: int = ct2.size();

                                for (let k: int = 0; k < ct2Size; k++) {
                                    let t3: Term = ct2.term[k];
                                    t3 = normalizeComponentForLinks(t3);

                                    if (!t3.hasVar()) {
                                        if (type === TermLink.COMPOUND_CONDITION) {
                                            componentLinks.add(new TermLink(TermLink.TRANSFORM, t3, 0, i, j, k));
                                        } else {
                                            componentLinks.add(new TermLink(TermLink.TRANSFORM, t3, i, j, k));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return componentLinks;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    // TODO move this to a utility method
    public static indexOf<T>(array: T[], v: T): int {
        /*
         * if (v == null) {
         * for (final T e : array)
         * if (e == null)
         * return true;
         * } else {
         */
        let i: int = 0;
        for (let e of array) {
            if (javaValuesEqual(v, e)) {
                return i;
            }
            i++;
        }
        return -1;
    }

    /**
     * compres a set of terms (assumed to be unique) with another set to find if
     * their
     * contents match. they can be in different order and still match. this is
     * useful for
     * comparing whether compound terms in which order doesn't matter (ex:
     * conjunction)
     * are equivalent.
     */
    public static containsAll<T>(a: T[], b: T[]): boolean {
        for (let ax of a) {
            if (!Terms.contains(b, ax))
                return false;
        }
        return true;
    }

    /** a contains any of b NOT TESTED YET */
    public static containsAny(a: Term[], b: java.util.Collection<Term>): boolean {
        for (let bx of b) {
            if (Terms.contains(a, bx))
                return true;
        }
        for (let ax of a) {
            if (ax instanceof CompoundTerm)
                if (Terms.containsAny((ax as CompoundTerm).term, b))
                    return true;
        }

        return false;
    }

    public static contains<T>(array: T[], v: T): boolean {
        for (let e of array) {
            if (javaValuesEqual(v, e)) {
                return true;
            }
        }
        return false;
    }

    protected static equals(a: Term[], b: Term[]): boolean {
        if (a.length !== b.length)
            return false;
        for (let i: int = 0; i < a.length; i++) {
            if (!a[i].equals(b[i]))
                return false;
        }
        return true;
    }

    public static verifyNonNull(t: java.util.Collection<unknown>): void;

    public static verifyNonNull(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [t] = args as [java.util.Collection<unknown>];


                for (let o of t)
                    if (o === null)
                        throw new java.lang.IllegalStateException("Element null in: " + t);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                for (let o of t)
                    if (o === null)
                        throw new java.lang.IllegalStateException("Element null in: " + java.util.Arrays.toString(t));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public static verifyNonNullTerms(...t: Term[]): void {
        for (let o of t)
            if (o === null)
                throw new java.lang.IllegalStateException("Element null in: " + java.util.Arrays.toString(t));
    }


    public static verifySortedAndUnique(arg: Term[], allowSingleton: boolean): Term[] {
        if (arg.length === 0) {
            throw new java.lang.IllegalStateException("Needs >0 components");
        }
        if (!allowSingleton && (arg.length === 1)) {
            throw new java.lang.IllegalStateException("Needs >1 components: " + java.util.Arrays.toString(arg));
        }
        let s: Term[] = Term.toSortedSetArray(...arg);
        if (arg.length !== s.length) {
            throw new java.lang.IllegalStateException("Contains duplicates: " + java.util.Arrays.toString(arg));
        }
        let j: int = 0;
        for (let t of s) {
            if (!t.equals(arg[j++]))
                throw new java.lang.IllegalStateException(
                    "Un-ordered: " + java.util.Arrays.toString(arg) + " , correct order=" + java.util.Arrays.toString(s));
        }
        return s;
    }
}
