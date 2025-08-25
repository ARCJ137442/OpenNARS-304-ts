import { java, JavaObject, type int, type short, S } from "jree";



/**
 * Static utility class for static methods related to Terms
 *
 * @author Patrick Hammer
 */
export class Terms extends JavaObject {

    public static equalSubTermsInRespectToImageAndProduct(/* final */  a: Term | null, /* final */  b: Term | null): boolean {
        if (a === null || b === null) {
            return false;
        }
        if (!((a instanceof CompoundTerm) && (b instanceof CompoundTerm))) {
            return a.equals(b);
        }
        if (a instanceof Inheritance && b instanceof Inheritance) {
            return Terms.equalSubjectPredicateInRespectToImageAndProduct(a, b);
        }
        if (a instanceof Similarity && b instanceof Similarity) {
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
                    if (x instanceof Inheritance && y instanceof Inheritance) {
                        if (!Terms.equalSubjectPredicateInRespectToImageAndProduct(x, y)) {
                            return false;
                        } else {
                            continue;
                        }
                    }
                    if (x instanceof Similarity && y instanceof Similarity) {
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

    public static reduceUntilLayer2(/* final */  _itself: CompoundTerm | null, /* final */  replacement: Term | null, /* final */  memory: Memory | null): Term | null {
        if (_itself === null)
            return null;

        let reduced: Term = Terms.reduceComponentOneLayer(_itself, replacement, memory);
        if (!(reduced instanceof CompoundTerm))
            return null;

        let itself: CompoundTerm = reduced as CompoundTerm;
        let j: int = 0;
        for (let t of itself.term) {
            let t2: Term = Terms.unwrapNegation(t);
            if (!(t2 instanceof Implication) && !(t2 instanceof Equivalence) && !(t2 instanceof Conjunction)
                && !(t2 instanceof Disjunction)) {
                j++;
                continue;
            }
            let ret2: Term = Terms.reduceComponentOneLayer(t2 as CompoundTerm, replacement, memory);

            // CompoundTerm itselfCompound = itself;
            let replaced: Term = null;
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
    public static term(/* final */  compound: CompoundTerm | null, /* final */  components: Term[] | null): Term | null;

    public static term(/* final */  compound: CompoundTerm | null, /* final */  components: java.util.Collection<Term> | null): Term | null;

    /**
     * Try to make a compound term from an operator and a list of term
     * <p>
     * Called from StringParser
     *
     * @param copula        Term operator
     * @param componentList Component list
     * @return A term or null
     */
    public static term(/* final */  copula: Symbols.NativeOperator | null, /* final */  componentList: Term[] | null): Term | null;
    public static term(...args: unknown[]): Term | null {
        switch (args.length) {
            case 2: {
                const [compound, components] = args as [CompoundTerm, Term[]];


                if (compound instanceof ImageExt) {
                    return new ImageExt(components, (compound as Image).relationIndex);
                } else if (compound instanceof ImageInt) {
                    return ImageInt.make(components, (compound as Image).relationIndex);
                } else {
                    return Terms.term(compound.operator(), components);
                }


                break;
            }

            case 2: {
                const [compound, components] = args as [CompoundTerm, java.util.Collection<Term>];


                let c: Term[] = components.toArray(new Array<Term>(0));
                return Terms.term(compound, c);


                break;
            }

            case 2: {
                const [copula, componentList] = args as [Symbols.NativeOperator, Term[]];



                switch (copula) {

                    case SET_EXT_OPENER:
                        return SetExt.make(componentList);
                    case SET_INT_OPENER:
                        return SetInt.make(componentList);
                    case INTERSECTION_EXT:
                        return IntersectionExt.make(componentList);
                    case INTERSECTION_INT:
                        return IntersectionInt.make(componentList);
                    case DIFFERENCE_EXT:
                        return DifferenceExt.make(componentList);
                    case DIFFERENCE_INT:
                        return DifferenceInt.make(componentList);
                    case INHERITANCE:
                        return Inheritance.make(componentList[0], componentList[1]);
                    case PRODUCT:
                        return new Product(componentList);
                    case IMAGE_EXT:
                        return ImageExt.make(componentList);
                    case IMAGE_INT:
                        return ImageInt.make(componentList);
                    case NEGATION:
                        return Negation.make(componentList);
                    case DISJUNCTION:
                        return Disjunction.make(componentList);
                    case CONJUNCTION:
                        return Conjunction.make(componentList);
                    case SEQUENCE:
                        return Conjunction.make(componentList, TemporalRules.ORDER_FORWARD);
                    case SPATIAL:
                        return Conjunction.make(componentList, TemporalRules.ORDER_FORWARD, true);
                    case PARALLEL:
                        return Conjunction.make(componentList, TemporalRules.ORDER_CONCURRENT);
                    case IMPLICATION:
                        return Implication.make(componentList[0], componentList[1]);
                    case IMPLICATION_AFTER:
                        return Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_FORWARD);
                    case IMPLICATION_BEFORE:
                        return Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_BACKWARD);
                    case IMPLICATION_WHEN:
                        return Implication.make(componentList[0], componentList[1], TemporalRules.ORDER_CONCURRENT);
                    case EQUIVALENCE:
                        return Equivalence.make(componentList[0], componentList[1]);
                    case EQUIVALENCE_WHEN:
                        return Equivalence.make(componentList[0], componentList[1], TemporalRules.ORDER_CONCURRENT);
                    case EQUIVALENCE_AFTER:
                        return Equivalence.make(componentList[0], componentList[1], TemporalRules.ORDER_FORWARD);
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
    public static reduceComponents(/* final */  compound: CompoundTerm | null, /* final */  component: Term | null, /* final */  memory: Memory | null): Term | null {
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
                if ((compound instanceof Conjunction) || (compound instanceof Disjunction)
                    || (compound instanceof IntersectionExt) || (compound instanceof IntersectionInt)
                    || (compound instanceof DifferenceExt) || (compound instanceof DifferenceInt)) {
                    return list[0];
                }
            }
        }
        return null;
    }

    public static reduceComponentOneLayer(/* final */  compound: CompoundTerm | null, /* final */  component: Term | null, /* final */  memory: Memory | null): Term | null {
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

    public static unwrapNegation(/* final */  T: Term | null): Term | null {
        if (T !== null && T instanceof Negation) {
            return (T as CompoundTerm).term[0];
        }
        return T;
    }

    public static equalSubjectPredicateInRespectToImageAndProduct(/* final */  a: Term | null, /* final */  b: Term | null): boolean {

        if (a === null || b === null) {
            return false;
        }

        if (!(a instanceof Statement) && !(b instanceof Statement)) {
            return false;
        }

        if (a.equals(b)) {
            return true;
        }

        let A: Statement = a as Statement;
        let B: Statement = b as Statement;

        if (!(A instanceof Similarity && B instanceof Similarity
            || A instanceof Inheritance && B instanceof Inheritance))
            return false;

        let subjA: Term = A.getSubject();
        let predA: Term = A.getPredicate();
        let subjB: Term = B.getSubject();
        let predB: Term = B.getPredicate();

        let ta: Term = null;
        let tb: Term = null;
        let sa: Term = null;
        let sb: Term = null;

        if ((subjA instanceof Product) && (predB instanceof ImageExt)) {
            ta = predA;
            sa = subjA;
            tb = subjB;
            sb = predB;
        }
        if ((subjB instanceof Product) && (predA instanceof ImageExt)) {
            ta = subjA;
            sa = predA;
            tb = predB;
            sb = subjB;
        }
        if ((predA instanceof ImageExt) && (predB instanceof ImageExt)) {
            ta = subjA;
            sa = predA;
            tb = subjB;
            sb = predB;
        }
        if ((subjA instanceof ImageInt) && (subjB instanceof ImageInt)) {
            ta = predA;
            sa = subjA;
            tb = predB;
            sb = subjB;
        }
        if ((predA instanceof Product) && (subjB instanceof ImageInt)) {
            ta = subjA;
            sa = predA;
            tb = predB;
            sb = subjB;
        }
        if ((predB instanceof Product) && (subjA instanceof ImageInt)) {
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

        if (sa instanceof Image && sb instanceof Image) {
            let im1: Image = sa as Image;
            let im2: Image = sb as Image;
            if (im1.relationIndex !== im2.relationIndex) {
                return false;
            }
        }

        let componentsA: java.util.Set<Term> = new java.util.LinkedHashSet(1 + sat.length);
        let componentsB: java.util.Set<Term> = new java.util.LinkedHashSet(1 + sbt.length);

        componentsA.add(ta);
        java.util.Collections.addAll(componentsA, sat);

        componentsB.add(tb);
        java.util.Collections.addAll(componentsB, sbt);

        for (let sA of componentsA) {
            let had: boolean = false;
            for (let sB of componentsB) {
                if (sA instanceof Variable && sB instanceof Variable) {
                    if (sA.name().equals(sB.name())) {
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

    public static prepareComponentLinks(/* final */  componentLinks: java.util.List<TermLink> | null, /* final */  ct: CompoundTerm | null): java.util.List<TermLink> | null;

    /**
     * Collect TermLink templates into a list, go down one level except in
     * special cases
     * <p>
     *
     * @param componentLinks The list of TermLink templates built so far
     * @param type           The type of TermLink to be built
     * @param term           The CompoundTerm for which the links are built
     */
    public static prepareComponentLinks(/* final */  componentLinks: java.util.List<TermLink> | null, /* final */  type: short,
            /* final */  term: CompoundTerm | null): java.util.List<TermLink> | null;
    public static prepareComponentLinks(...args: unknown[]): java.util.List<TermLink> | null {
        switch (args.length) {
            case 2: {
                const [componentLinks, ct] = args as [java.util.List<TermLink>, CompoundTerm];


                let type: short = (ct instanceof Statement) ? TermLink.COMPOUND_STATEMENT : TermLink.COMPOUND; // default
                return Terms.prepareComponentLinks(componentLinks, type, ct);


                break;
            }

            case 3: {
                const [componentLinks, type, term] = args as [java.util.List<TermLink>, short, CompoundTerm];



                let tEquivalence: boolean = (term instanceof Equivalence);
                let tImplication: boolean = (term instanceof Implication);

                for (let i: int = 0; i < term.size(); i++) {
                    let t1: Term = term.term[i];
                    t1 = new Sentence(
                        t1,
                        Symbols.TERM_NORMALIZING_WORKAROUND_MARK,
                        null,
                        null).term;

                    if (!(t1 instanceof Variable)) {
                        componentLinks.add(new TermLink(type, t1, i));
                    }
                    if ((tEquivalence || (tImplication && (i === 0)))
                        && ((t1 instanceof Conjunction) || (t1 instanceof Negation))) {
                        Terms.prepareComponentLinks(componentLinks, TermLink.COMPOUND_CONDITION, t1 as CompoundTerm);
                    } else if (t1 instanceof CompoundTerm) {
                        let ct1: CompoundTerm = t1 as CompoundTerm;
                        let ct1Size: int = ct1.size(); // cache because this loop is critical
                        let t1ProductOrImage: boolean = (t1 instanceof Product) || (t1 instanceof ImageExt)
                            || (t1 instanceof ImageInt);

                        for (let j: int = 0; j < ct1Size; j++) {
                            let t2: Term = ct1.term[j];

                            t2 = new Sentence(
                                t2,
                                Symbols.TERM_NORMALIZING_WORKAROUND_MARK,
                                null,
                                null).term;

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
                            if ((t2 instanceof Product) || (t2 instanceof ImageExt) || (t2 instanceof ImageInt)) {
                                let ct2: CompoundTerm = t2 as CompoundTerm;
                                let ct2Size: int = ct2.size();

                                for (let k: int = 0; k < ct2Size; k++) {
                                    let t3: Term = ct2.term[k];

                                    t3 = new Sentence(
                                        t3,
                                        Symbols.TERM_NORMALIZING_WORKAROUND_MARK,
                                        null,
                                        null).term;

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
    public static indexOf<T>(/* final */  array: T[] | null, /* final */  v: T | null): int {
        /*
         * if (v == null) {
         * for (final T e : array)
         * if (e == null)
         * return true;
         * } else {
         */
        let i: int = 0;
        for (let e of array) {
            if (v.equals(e)) {
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
    public static containsAll<T>(/* final */  a: T[] | null, /* final */  b: T[] | null): boolean {
        for (let ax of a) {
            if (!Terms.contains(b, ax))
                return false;
        }
        return true;
    }

    /** a contains any of b NOT TESTED YET */
    public static containsAny(/* final */  a: Term[] | null, /* final */  b: java.util.Collection<Term> | null): boolean {
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

    public static contains<T>(/* final */  array: T[] | null, /* final */  v: T | null): boolean {
        for (let e of array) {
            if (v.equals(e)) {
                return true;
            }
        }
        return false;
    }

    protected override static equals(/* final */  a: Term[] | null, /* final */  b: Term[] | null): boolean {
        if (a.length !== b.length)
            return false;
        for (let i: int = 0; i < a.length; i++) {
            if (!a[i].equals(b[i]))
                return false;
        }
        return true;
    }

    public static verifyNonNull(/* final */  t: java.util.Collection<unknown> | null): void;

    protected static verifyNonNull(/* final */ ...t: Term | null[]): void;
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


    public static verifySortedAndUnique(/* final */  arg: Term[] | null, /* final */  allowSingleton: boolean): Term[] | null {
        if (arg.length === 0) {
            throw new java.lang.IllegalStateException("Needs >0 components");
        }
        if (!allowSingleton && (arg.length === 1)) {
            throw new java.lang.IllegalStateException("Needs >1 components: " + java.util.Arrays.toString(arg));
        }
        let s: Term[] = Term.toSortedSetArray(arg);
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
