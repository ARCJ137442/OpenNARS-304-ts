//! Java source: opennars/language/Variables.java
import { java, S } from "jree";
import type { int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Symbols } from "../io/Symbols.ts";
import { Variable } from "./Variable.ts";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Implication } from "./Implication.ts";
import { Equivalence } from "./Equivalence.ts";
import { Conjunction } from "./Conjunction.ts";
import { Disjunction } from "./Disjunction.ts";
import { ImageExt } from "./ImageExt.ts";
import { ImageInt } from "./ImageInt.ts";
import { Inheritance } from "./Inheritance.ts";
import { Similarity } from "./Similarity.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { NativeMap, type MapContract } from "../runtime/NativeMap.ts";
import { NativeSet } from "../runtime/NativeSet.ts";
import type { Term } from "./Term.ts";
import type { JavaChar } from "../runtime/jree-compat.ts";

// Java 原类型：Map<Term, Term>，实现类型：LinkedHashMap。
// The two-element array remains the Java Map<Term, Term>[] container; only the
// concrete map implementation moves to the native ordered Map contract.
const nativeTermMap = (): NativeMap<Term, Term> =>
    new NativeMap<Term, Term>();


/**
 * Static utility class for static methods related to Variables
 *
 * @author Patrick Hammer
 */
// Java implicit Object -> native TypeScript class; this class is a static utility namespace.
export class Variables {

    /**
     * map is a 2-element array of Map<Term,Term>. it may be null, in which
     * case
     * the maps will be instantiated as necessary.
     * this is to delay the instantiation of the 2 Map until necessary to avoid
     * wasting them if they are not used.
     */
    public static findSubstitute(rnd: java.util.Random, type: JavaChar, term1: Term, term2: Term,
        map: MapContract<Term, Term>[]): boolean;

    public static findSubstitute(rnd: java.util.Random, type: JavaChar, term1: Term, term2: Term,
        map1: MapContract<Term, Term>, map2: MapContract<Term, Term>): boolean;

    public static findSubstitute(rnd: java.util.Random, type: JavaChar, term1: Term, term2: Term,
        map: MapContract<Term, Term>[], allowPartial: boolean): boolean;
    public static findSubstitute(...args: unknown[]): boolean {
        switch (args.length) {
            case 5: {
                const [rnd, type, term1, term2, map] = args as [java.util.Random, JavaChar, Term, Term, MapContract<Term, Term>[]];


                return Variables.findSubstitute(rnd, type, term1, term2, map, false);


                break;
            }

            case 6: {
                if (typeof args[5] !== "boolean") {
                    const [rnd, type, term1, term2, map1, map2] = args as [java.util.Random, JavaChar, Term, Term, MapContract<Term, Term>, MapContract<Term, Term>];
                    return Variables.findSubstitute(rnd, type, term1, term2, [map1, map2]);
                }

                const [rnd, type, term1, term2, map, allowPartial] = args as [java.util.Random, JavaChar, Term, Term, MapContract<Term, Term>[], boolean];



                let term1HasVar: boolean = term1.hasVar(type);
                if (type === Symbols.VAR_INDEPENDENT) {
                    const hasDependentVar = term1.hasVarDep();
                    term1HasVar = term1HasVar || hasDependentVar;
                    const hasQueryVar = term1.hasVarQuery();
                    term1HasVar = term1HasVar || hasQueryVar;
                }
                if (type === Symbols.VAR_DEPENDENT) {
                    const hasQueryVar = term1.hasVarQuery();
                    term1HasVar = term1HasVar || hasQueryVar;
                }
                let term2HasVar: boolean = term2.hasVar(type);

                let term1Var: boolean = term1 instanceof Variable;
                let term2Var: boolean = term2 instanceof Variable;

                if (allowPartial && term1 instanceof Conjunction && term2 instanceof Conjunction) {
                    let c1: Conjunction = term1 as Conjunction;
                    let c2: Conjunction = term2 as Conjunction;
                    // more effective matching for NLP
                    if (c1.getTemporalOrder() === TemporalRules.ORDER_FORWARD &&
                        c2.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                        let size_smaller: int = c1.size();
                        if (c1.size() < c2.size()) {
                            // find an offset that works
                            for (let k: int = 0; k < (c2.term.length - c1.term.length); k++) {

                                if (map[0] === null) {
                                    map[0] = nativeTermMap();
                                }
                                if (map[1] === null) {
                                    map[1] = nativeTermMap();
                                }

                                let mapk: MapContract<Term, Term>[] = Variables.copyMapFrom(map);
                                let succeeded: boolean = true;
                                for (let j: int = k; j < k + size_smaller; j++) {
                                    let i: int = j - k;
                                    let mapNew: MapContract<Term, Term>[] = Variables.copyMapFrom(map);
                                    // attempt unification:
                                    if (Variables.findSubstitute(rnd, type, c1.term[i], c2.term[j], mapNew)) {
                                        Variables.appendToMap(mapNew[0], mapk[0]);
                                        Variables.appendToMap(mapNew[1], mapk[1]);
                                    } else { // another shift k is needed
                                        succeeded = false;
                                        break;
                                    }
                                }
                                if (succeeded) {
                                    Variables.appendToMap(mapk[0], map[0]);
                                    Variables.appendToMap(mapk[1], map[1]);
                                    return true;
                                }
                            }
                        }
                    }
                }

                let termsEqual: boolean = term1.equals(term2);
                if (!term1Var && !term2Var && termsEqual) {
                    return true;
                }

                // variable "renaming" to variable of same type is always valid
                if (term1 instanceof Variable && term2 instanceof Variable) {
                    let v1: Variable = term1 as Variable;
                    let v2: Variable = term2 as Variable;
                    if (v1.getType() === v2.getType()) {
                        let CommonVar: Variable = Variables.makeCommonVariable(term1, term2);
                        if (map[0] === null) {
                            map[0] = nativeTermMap();
                            map[1] = nativeTermMap();
                        }
                        map[0].put(v1, CommonVar);
                        map[1].put(v2, CommonVar);
                        return true;
                    }
                }

                let term1VarUnifyAllowed: boolean = term1Var && Variables.allowUnification((term1 as Variable).getType(), type);
                let term2VarUnifyAllowed: boolean = term2Var && Variables.allowUnification((term2 as Variable).getType(), type);

                if (term1VarUnifyAllowed || term2VarUnifyAllowed) {

                    let termA: Term = term1VarUnifyAllowed ? term1 : term2;
                    let termB: Term = term1VarUnifyAllowed ? term2 : term1;
                    let termAAsVariable: Variable = termA as Variable;
                    // https://github.com/opennars/opennars/issues/482:
                    let mapIdx: int = term1VarUnifyAllowed ? 0 : 1;
                    let t: Term = ((map[mapIdx] !== null ? map[mapIdx].get(termAAsVariable) : null) as unknown as Term);
                    if (t !== null) {
                        return Variables.findSubstitute(rnd, type, t, termB, map);
                    }

                    if (map[0] === null) {
                        map[0] = nativeTermMap();
                        map[1] = nativeTermMap();
                    }

                    if (term1VarUnifyAllowed) {

                        if ((termB instanceof Variable) && Variables.allowUnification((termB as Variable).getType(), type)) {
                            let CommonVar: Variable = Variables.makeCommonVariable(termA, termB);
                            map[0].put(termAAsVariable, CommonVar);
                            map[1].put(termB, CommonVar);
                        } else {
                            if (termB instanceof Variable && (((termB as Variable).getType() === Symbols.VAR_QUERY
                                && (termA as Variable).getType() !== Symbols.VAR_QUERY) ||
                                ((termB as Variable).getType() !== Symbols.VAR_QUERY
                                    && (termA as Variable).getType() === Symbols.VAR_QUERY))) {
                                return false;
                            }
                            map[0].put(termAAsVariable, termB);
                            if (termAAsVariable.isCommon()) {
                                map[1].put(termAAsVariable, termB);
                            }
                        }
                    } else {
                        map[1].put(termAAsVariable, termB);
                        if (termAAsVariable.isCommon()) {
                            map[0].put(termAAsVariable, termB);
                        }
                    }

                    return true;

                } else {
                    let hasAnyTermVars: boolean = term1HasVar || term2HasVar;
                    let termsHaveSameClass: boolean = term1.getClass().equals(term2.getClass());

                    if (!(hasAnyTermVars && termsHaveSameClass && term1 instanceof CompoundTerm)) {
                        return termsEqual;
                    }

                    let cTerm1: CompoundTerm = term1 as CompoundTerm;
                    let cTerm2: CompoundTerm = term2 as CompoundTerm;

                    // consider temporal order on term matching
                    let isSameOrder: boolean = term1.getTemporalOrder() === term2.getTemporalOrder();
                    let isSameSpatial: boolean = term1.getIsSpatial() === term2.getIsSpatial();
                    let isSameOrderAndSameSpatial: boolean = isSameOrder && isSameSpatial;

                    let areBothConjunctions: boolean = term1 instanceof Conjunction && term2 instanceof Conjunction;
                    let areBothImplication: boolean = term1 instanceof Implication && term2 instanceof Implication;
                    let areBothEquivalence: boolean = term1 instanceof Equivalence && term2 instanceof Equivalence;

                    if ((areBothConjunctions && !isSameOrderAndSameSpatial) ||
                        ((areBothEquivalence || areBothImplication) && !isSameOrder)) {
                        return false;
                    }

                    if (cTerm1.size() !== cTerm2.size()) {
                        return false;
                    }
                    if ((cTerm1 instanceof ImageExt) && ((cTerm1 as ImageExt).relationIndex !== (cTerm2 as ImageExt).relationIndex)
                        || (cTerm1 instanceof ImageInt)
                        && ((cTerm1 as ImageInt).relationIndex !== (cTerm2 as ImageInt).relationIndex)) {
                        return false;
                    }
                    let list: Term[] = cTerm1.cloneTerms();
                    if (cTerm1.isCommutative()) {
                        CompoundTerm.shuffle(list, rnd);
                        // ok attempt unification
                        if (list === null || cTerm2.term === null || list.length !== cTerm2.term.length) {
                            return false;
                        }
                        // Java source: final Set<Integer> matchedJ = new LinkedHashSet<>(list.length * 2);
                        // Keep Integer wrapper values at the translated Java boundary; NativeSet preserves Set uniqueness.
                        const matchedJ = new NativeSet<java.lang.Integer>();
                        for (let i: int = 0; i < list.length; i++) {
                            let succeeded: boolean = false;
                            for (let j: int = 0; j < list.length; j++) {
                                if (matchedJ.contains(java.lang.Integer.valueOf(j))) { // this one already was used to match one of the i's
                                    continue;
                                }
                                let ti: Term = list[i].clone();
                                // clone map also:

                                if (map[0] === null) {
                                    map[0] = nativeTermMap();
                                }
                                if (map[1] === null) {
                                    map[1] = nativeTermMap();
                                }

                                let mapNew: MapContract<Term, Term>[] = Variables.copyMapFrom(map);
                                // attempt unification:
                                if (Variables.findSubstitute(rnd, type, ti, cTerm2.term[j], mapNew)) {
                                    Variables.appendToMap(mapNew[0], map[0]);
                                    Variables.appendToMap(mapNew[1], map[1]);
                                    succeeded = true;
                                    matchedJ.add(java.lang.Integer.valueOf(j));
                                    break;
                                }
                            }
                            if (!succeeded) {
                                return false;
                            }
                        }
                        return true;
                    }
                    for (let i: int = 0; i < cTerm1.size(); i++) {
                        let t1: Term = list[i];
                        let t2: Term = cTerm2.term[i];
                        if (!Variables.findSubstitute(rnd, type, t1, t2, map)) {
                            return false;
                        }
                    }
                    return true;

                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static allowUnification(type: JavaChar, uniType: JavaChar): boolean { // it is valid to allow dependent var
        // unification in case that a
        // independent var unification is
        // happening,
        // as shown in the
        // <(&&,<$1 --> [ENGLISH]>, <$2 -->
        // [CHINESE]>, <(*, $1, #3) -->
        // REPRESENT>, <(*, $2, #3) -->
        // REPRESENT>) ==> <(*, $1, $2) -->
        // TRANSLATE>>.
        // example by Kai Liu.
        // 1.7.0 and 2.0.1 also already
        // allowed this, so this is for v1.6.x
        // now.

        if (uniType === type) { // the usual case
            return true;
        }
        if (uniType === Symbols.VAR_INDEPENDENT) { // the now allowed case
            if (type === Symbols.VAR_DEPENDENT ||
                type === Symbols.VAR_QUERY) {
                return true;
            }
        }
        if (uniType === Symbols.VAR_DEPENDENT) { // the now allowed case
            return type === Symbols.VAR_QUERY;
        }
        return false;
    }

    /**
     * copies two maps from source into two new maps
     *
     * @param source source maps (two)
     * @return copied maps
     */
    private static copyMapFrom(source: MapContract<Term, Term>[]): MapContract<Term, Term>[] {
        // Java original: Map<Term, Term>[] backed by two LinkedHashMap instances.
        let destination: MapContract<Term, Term>[] = new Array<MapContract<Term, Term>>(2);

        destination[0] = nativeTermMap();
        destination[1] = nativeTermMap();

        Variables.appendToMap(source[0], destination[0]);
        Variables.appendToMap(source[1], destination[1]);
        return destination;
    }

    private static appendToMap(source: MapContract<Term, Term>, target: MapContract<Term, Term>): void {
        for (let c of source.keySet()) {
            target.put(c, source.get(c) as unknown as Term);
        }
    }

    /**
     * Check whether a string represent a name of a term that contains a
     * variable
     *
     * @param n The string name to be checked
     * @return Whether the name contains a variable
     */
    public static containVar(n: java.lang.CharSequence): boolean;

    public static containVar(t: Term[]): boolean;
    public static containVar(...args: unknown[]): boolean {
        switch (args.length) {
            case 1: {
                const [n] = args as [java.lang.CharSequence];


                if (n === null)
                    return false;
                let l: int = n.length();
                for (let i: int = 0; i < l; i++) {
                    switch (String.fromCharCode(n.charAt(i) as unknown as number)) {
                        case Symbols.VAR_INDEPENDENT:
                        case Symbols.VAR_DEPENDENT:
                        case Symbols.VAR_QUERY:
                            return true;

                        default:

                    }
                }
                return false;


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                for (let x of t)
                    if (x instanceof Variable)
                        return true;
                return false;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * To unify two terms
     *
     * @param type The type of variable that can be substituted
     * @param t    The first and second term as an array, which will have been
     *             modified upon returning true
     * @return Whether the unification is possible. 't' will refer to the unified
     *         terms
     */
    public static unify(rnd: java.util.Random, type: JavaChar, t: Term[]): boolean;

    /**
     * To unify two terms
     *
     * @param type     The type of variable that can be substituted
     * @param t1       The compound containing the first term, possibly modified
     * @param t2       The compound containing the second term, possibly modified
     * @param compound The first and second term as an array, which will have been
     *                 modified upon returning true
     * @return Whether the unification is possible. 't' will refer to the unified
     *         terms
     */
    public static unify(rnd: java.util.Random, type: JavaChar, t1: Term, t2: Term, compound: Term[]): boolean;

    public static unify(rnd: java.util.Random, type: JavaChar, t1: Term, t2: Term, compound: Term[],
        allowPartial: boolean): boolean;
    public static unify(...args: unknown[]): boolean {
        switch (args.length) {
            case 3: {
                const [rnd, type, t] = args as [java.util.Random, JavaChar, Term[]];


                return Variables.unify(rnd, type, t[0], t[1], t);


                break;
            }

            case 5: {
                const [rnd, type, t1, t2, compound] = args as [java.util.Random, JavaChar, Term, Term, Term[]];


                return Variables.unify(rnd, type, t1, t2, compound, false);


                break;
            }

            case 6: {
                const [rnd, type, t1, t2, compound, allowPartial] = args as [java.util.Random, JavaChar, Term, Term, Term[], boolean];


                let map: MapContract<Term, Term>[] = [
                    null as unknown as MapContract<Term, Term>,
                    null as unknown as MapContract<Term, Term>,
                ]; // begins empty: null,null

                let hasSubs: boolean = Variables.findSubstitute(rnd, type, t1, t2, map, allowPartial);
                if (hasSubs) {
                    let a: Term = (compound[0] instanceof Variable && map[0].containsKey(compound[0]))
                        ? map[0].get(compound[0]) as unknown as Term
                        : Variables.applySubstituteAndRenameVariables((compound[0] as CompoundTerm), map[0]);
                    if (a === null)
                        return false;
                    let b: Term = (compound[1] instanceof Variable && map[1].containsKey(compound[1]))
                        ? map[1].get(compound[1]) as unknown as Term
                        : Variables.applySubstituteAndRenameVariables((compound[1] as CompoundTerm), map[1]);
                    if (b === null)
                        return false;
                    // only set the values if it will return true, otherwise if it returns false the
                    // callee can expect its original values untouched
                    if (compound[0] instanceof Variable && compound[0].hasVarQuery() && (a.hasVarIndep() || a.hasVarIndep())) {
                        return false;
                    }
                    if (compound[1] instanceof Variable && compound[1].hasVarQuery() && (b.hasVarIndep() || b.hasVarIndep())) {
                        return false;
                    }
                    compound[0] = a;
                    compound[1] = b;
                    return true;
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
     * appliesSubstitute and renameVariables, resulting in a cloned object,
     * will not change this instance
     */
    private static applySubstituteAndRenameVariables(t: CompoundTerm, subs: MapContract<Term, Term>): Term {
        if ((subs === null) || (subs.isEmpty())) {
            // no change needed
            return t;
        }

        let r: Term = t.applySubstitute(subs);

        if (r === null)
            return null as unknown as Term;

        if (r.equals(t))
            return t;

        return r;
    }

    public static makeCommonVariable(v1: Term, v2: Term): Variable {
        // TODO use more efficient string construction
        const generatedName = String(v2.toString()) + String(v1.toString()) + '$';
        return new Variable(generatedName); // v2 first since when type does not match
    } // but it is an allowed rename like $1 -> #1 then the second type should be used

    /**
     * examines whether a term is using an
     * independent variable in an invalid way
     *
     * @param T term to be examined
     * @return Whether the term contains an independent variable
     */
    public static indepVarUsedInvalid(T: Term): boolean {

        // if its a conjunction/disjunction, this is invalid: (&&,<$1 --> test>,<$1 -->
        // test2>), while this isnt: (&&,<$1 --> test ==> <$1 --> test2>,others)
        // this means we have to go through the conjunction, and check if the component
        // is a indepVarUsedInvalid instance, if yes, return true
        //
        if (T instanceof Conjunction || T instanceof Disjunction) {
            let part: Term[] = (T as CompoundTerm).term;
            for (let t of part) {
                if (Variables.indepVarUsedInvalid(t)) {
                    return true;
                }
            }
        }

        if (!(T instanceof Inheritance) && !(T instanceof Similarity)) {
            return false;
        }

        return T.hasVarIndep();
    }

    /**
     * Check if two terms can be unified
     *
     * @param type  The type of variable that can be substituted
     * @param term1 The first term to be unified
     * @param term2 The second term to be unified
     * @return Whether there is a substitution
     */
    public static hasSubstitute(rnd: java.util.Random, type: JavaChar, term1: Term, term2: Term): boolean {
        return Variables.findSubstitute(rnd, type, term1, term2, nativeTermMap(), nativeTermMap());
    }

}
