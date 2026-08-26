//! Java source: opennars/language/Conjunction.java
import { java, type int, type long, S } from "jree";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Interval } from "./Interval.ts";
import { Symbols } from "../io/Symbols.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Debug } from "../main/Debug.ts";
import { Terms } from "./Terms.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * Conjunction of statements as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Conjunction extends CompoundTerm {

    public readonly temporalOrder: int;
    public readonly isSpatial: boolean;

    protected constructor(arg: Term[], order: int, normalized: boolean, spatial: boolean);

    /**
     * Constructor with partial values, called by make
     *
     * @param arg        The component list of the term
     * @param order
     * @param normalized
     */
    // avoids re-calculates of conv rectangle
    protected constructor(arg: Term[], order: int, normalized: boolean, spatial: boolean,
        rect: CompoundTerm.ConvRectangle);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 4: {
                const [arg, order, normalized, spatial] = args as [Term[], int, boolean, boolean];


                super(arg);
                this.isSpatial = spatial;
                this.temporalOrder = order;
                this.init(this.term);
                // update imagination space if it exists (also type checking the operations):
                if (arg[0].imagination !== null) {
                    this.imagination = arg[0].imagination.ConstructSpace(this);
                }


                break;
            }

            case 5: {
                const [arg, order, normalized, spatial, rect] = args as [Term[], int, boolean, boolean, CompoundTerm.ConvRectangle];


                super(arg);
                this.isSpatial = spatial;
                this.temporalOrder = order;
                this.index_variable = rect.index_variable;
                this.term_indices = rect.term_indices;
                this.init(this.term);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Clone an object
     *
     * @return A new object
     */
    public clone(): Conjunction;

    public clone(t: Term[]): Term;
    public clone(...args: unknown[]): Conjunction | Term | null {
        switch (args.length) {
            case 0: {

                return new Conjunction(this.term, this.temporalOrder, this.isNormalized(), this.isSpatial);


                break;
            }

            case 1: {
                const [t] = args as [Term[]];


                if (t === null) {
                    return null;
                }
                return Conjunction.make(t, this.temporalOrder, this.isSpatial);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        switch (this.temporalOrder) {
            case TemporalRules.ORDER_FORWARD:
                if (this.isSpatial) {
                    return NativeOperator.SPATIAL;
                } else {
                    return NativeOperator.SEQUENCE;
                }
            case TemporalRules.ORDER_CONCURRENT:
                return NativeOperator.PARALLEL;
            default:
                return NativeOperator.CONJUNCTION;
        }
    }

    /**
     * Check if the compound is commutative.
     *
     * @return true for commutative
     */
    public isCommutative(): boolean {
        return this.temporalOrder !== TemporalRules.ORDER_FORWARD;
    }

    /**
     * Try to make a new compound from a list of term. Called by StringParser.
     *
     * @return the Term generated from the arguments
     * @param argList the list of arguments
     */
    public static make(argList: Term[]): Term;

    /**
     * Try to make a new compound from a list of term. Called by StringParser.
     *
     * @param temporalOrder The temporal order among term
     * @param argList       the list of arguments
     * @return the Term generated from the arguments, or null if not possible
     */
    public static make(argList: Term[], temporalOrder: int): Term;

    // overload this method by term type?
    /**
     * Try to make a new compound from two term. Called by the inference rules.
     *
     * @param term1 The first component
     * @param term2 The second component
     * @return A compound generated or a term it reduced to
     */
    public static make(term1: Term, term2: Term): Term;

    public static make(argList: Term[], temporalOrder: int, spatial: boolean): Term;

    public static make(prefix: Term, suffix: Interval, temporalOrder: int): Term;

    /**
     *
     * @param set a set of Term as term
     * @return the Term generated from the arguments
     */
    public static make(term1: Term, term2: Term, temporalOrder: int): Term;

    public static make(prefix: Term, ival: Interval, suffix: Term, temporalOrder: int): Term;

    public static make(term1: Term, term2: Term, temporalOrder: int, spatial: boolean): Term;
    public static make(...args: unknown[]): Term {
        switch (args.length) {
            case 1: {
                const [argList] = args as [Term[]];


                return Conjunction.make(argList, TemporalRules.ORDER_NONE);


                break;
            }

            case 2: {
                const [first, second] = args;
                if (Array.isArray(first)) {
                    return Conjunction.make(first as Term[], second as int, false);
                }
                return Conjunction.make(first as Term, second as Term, TemporalRules.ORDER_NONE);
            }

            case 3: {
                const [first, second, third] = args;
                if (Array.isArray(first)) {
                    const argList = first as Term[];
                    const temporalOrder = second as int;
                    const spatial = third as boolean;
                    if (Debug.DETAILED) {
                        Terms.verifyNonNullTerms(...argList);
                    }
                    if (argList === null || argList.length === 0) {
                        return null as unknown as Term;
                    }
                    if (argList.length === 1) {
                        return argList[0];
                    }
                    if (temporalOrder === TemporalRules.ORDER_FORWARD) {
                        const newArgList = spatial ? argList : Conjunction.simplifyIntervals(
                            Conjunction.flatten(argList, temporalOrder, spatial));
                        if (newArgList.length === 1) {
                            return newArgList[0];
                        }
                        return new Conjunction(newArgList, temporalOrder, false, spatial);
                    }
                    const terms: Term[] = [];
                    const flattened = Conjunction.flatten(argList, temporalOrder, spatial);
                    const rect: CompoundTerm.ConvRectangle = CompoundTerm.UpdateConvRectangle(flattened);
                    for (let t of flattened) {
                        if (!(t instanceof Interval)) {
                            if (t.term_indices === null || rect === null || rect.term_indices === null) {
                                terms.push(t);
                            } else if (t instanceof CompoundTerm) {
                                const updated = Conjunction.UpdateRelativeIndices(rect.term_indices[2], rect.term_indices[3],
                                    rect.term_indices[4], rect.term_indices[5], t.cloneDeep());
                                terms.push(updated);
                            }
                        }
                    }
                    const sorted = Term.toSortedSetArray(...terms);
                    if (sorted.length === 1) {
                        return sorted[0];
                    }
                    return new Conjunction(sorted, temporalOrder, false, spatial, rect);
                }
                if (typeof (first as { toArray?: unknown })?.toArray === "function") {
                    return Conjunction.make(
                        (first as java.util.Collection<Term>).toArray(new Array<Term>(0)),
                        second as int,
                        third as boolean,
                    );
                }
                if (second instanceof Interval) {
                    return Conjunction.make([first as Term, second as Interval], third as int);
                }
                return Conjunction.make(first as Term, second as Term, third as int, false);
            }

            case 4: {
                if (args[1] instanceof Interval) {
                    const [prefix, ival, suffix, temporalOrder] = args as [Term, Interval, Term, int];
                    return Conjunction.make([prefix, ival, suffix], temporalOrder);
                }
                const [term1, term2, temporalOrder, spatial] = args as [Term, Term, int, boolean];


                if (temporalOrder === TemporalRules.ORDER_FORWARD) {

                    let components: Term[];

                    if ((term1 instanceof Conjunction) && (term1.getTemporalOrder() === TemporalRules.ORDER_FORWARD)) {

                        let cterm1: CompoundTerm = term1 as CompoundTerm;

                        const list: Term[] = [...cterm1.term];

                        if ((term2 instanceof Conjunction) &&
                            cterm1.getIsSpatial() === term2.getIsSpatial() &&
                            term2.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                            // (&/,(&/,P,Q),(&/,R,S)) = (&/,P,Q,R,S)
                            list.push(...(term2 as CompoundTerm).term);
                        } else {
                            // (&,(&,P,Q),R) = (&,P,Q,R)
                            list.push(term2);
                        }

                        components = list;

                    } else if ((term2 instanceof Conjunction) && (term2.getTemporalOrder() === TemporalRules.ORDER_FORWARD)) {
                        let cterm2: CompoundTerm = term2 as CompoundTerm;
                        components = new Array<Term>((term2 as CompoundTerm).size() + 1);
                        components[0] = term1;
                        java.lang.System.arraycopy(cterm2.term, 0, components, 1, cterm2.size());
                    } else {
                        components = [term1, term2];
                    }
                    return Conjunction.make(components, temporalOrder, spatial);

                } else {

                    const set: Term[] = [];
                    if (term1 instanceof Conjunction) {
                        set.push(...(term1 as CompoundTerm).term);
                        if (term2 instanceof Conjunction) {
                            // (&,(&,P,Q),(&,R,S)) = (&,P,Q,R,S)
                            set.push(...(term2 as CompoundTerm).term);
                        } else {
                            // (&,(&,P,Q),R) = (&,P,Q,R)
                            set.push(term2);
                        }

                    } else if (term2 instanceof Conjunction) {
                        set.push(...(term2 as CompoundTerm).term);
                        set.push(term1); // (&,R,(&,P,Q)) = (&,P,Q,R)
                    } else {
                        set.push(term1);
                        set.push(term2);
                    }

                    return Conjunction.make(set, temporalOrder, spatial);
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public static isConjunctionAndHasSameOrder(t: Term, order: int): boolean {
        if (t instanceof Conjunction) {
            let c: Conjunction = t as Conjunction;
            return c.getTemporalOrder() === order;
        }
        return false;
    }

    public static flatten(args: Term[], order: int, isSpatial: boolean): Term[] { // flatten only same
        // order!
        // determine how many there are with same order
        let sz: int = 0;
        for (let a of args) {
            if (Conjunction.isConjunctionAndHasSameOrder(a, order) && isSpatial === (a as Conjunction).isSpatial) {
                sz += (a as Conjunction).term.length;
            } else {
                sz += 1;
            }
        }
        let ret: Term[] = new Array<Term>(sz);
        let k: int = 0;
        for (let a of args) {
            if (Conjunction.isConjunctionAndHasSameOrder(a, order) && isSpatial === (a as Conjunction).isSpatial) {
                let c: Conjunction = (a as Conjunction);
                for (let t of c.term) {
                    ret[k] = t;
                    k++;
                }
            } else {
                ret[k] = a;
                k++;
            }
        }
        return ret;
    }

    public static PositiveIntString(value: int): java.lang.String {
        if (value === 0) {
            return new java.lang.String("");
        } else {
            return new java.lang.String("+" + String(value));
        }
    }

    public static UpdateRelativeIndices(minX: int, minY: int, minsX: int, minsY: int,
        term: Term): Term {
        if (term instanceof CompoundTerm) {
            let ct: CompoundTerm = (term as CompoundTerm);
            for (let i: int = 0; i < ct.term.length; i++) {
                ct.term[i] = Conjunction.UpdateRelativeIndices(minX, minY, minsX, minsY, ct.term[i]);
            }
            return ct;
        } else {
            if (term.term_indices !== null) {
                // term indices remain the same, but representation changes
                // Java string concatenation turns a null reference into the literal "null".
                let s: string = String(term.index_variable);
                let relativeSizeX: int = term.term_indices[0] - minsX;
                let relativeSizeY: int = term.term_indices[1] - minsY;
                let relativePositionX: int = term.term_indices[2] - minX;
                let relativePositionY: int = term.term_indices[3] - minY;

                s += "[i" + Conjunction.PositiveIntString(relativeSizeX) +
                    ",j" + Conjunction.PositiveIntString(relativeSizeY);
                s += ",k" + Conjunction.PositiveIntString(relativePositionX);
                s += ",l" + Conjunction.PositiveIntString(relativePositionY) + "]";
                let ret: Term = Term.get(new java.lang.String(s));
                ret.term_indices = term.term_indices;
                ret.index_variable = term.index_variable;
                return ret;
            } else {
                return term; // another atomic term
            }
        }
    }

    /**
     * @param components The components
     * @return The components sequence with summed intervals
     *         for transforming (&/,a,+1,+1) to (&/,a,+2)
     */
    public static simplifyIntervals(components: Term[]): Term[] {
        const ret: Term[] = [];
        for (let i: int = 0; i < components.length;) {
            if (components[i] instanceof Interval) {
                // add up next ones
                // jree models Java long as bigint, while this port keeps Interval.time
                // as a runtime number for compatibility with the existing arithmetic.
                let ival: number = 0;
                for (; i < components.length && components[i] instanceof Interval; i++) {
                    ival += Number((components[i] as Interval).time as unknown as number);
                }
                ret.push(new Interval(ival as unknown as long));
            } else {
                ret.push(components[i]);
                i++;
            }
        }
        return ret;
    }

    protected makeName(): java.lang.CharSequence {
        return Conjunction.makeCompoundName(this.operator(), ...this.term);
    }

    public getTemporalOrder(): int {
        return this.temporalOrder;
    }

    public getIsSpatial(): boolean {
        return this.isSpatial;
    }
}
