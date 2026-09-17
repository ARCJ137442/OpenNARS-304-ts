//! Java source: opennars/entity/TermLink.java
import { java, type short, type int, S } from "jree";
import { Item } from "./Item.ts";
import { Term } from "../language/Term.ts";
import { BudgetValue } from "./BudgetValue.ts";
import { Symbols } from "../io/Symbols.ts";
import type { TLink } from "./TLink.ts";
import { javaStringValue } from "../runtime/jree-compat.ts";



/**
 * A link between a compound term and a component term
 * <p>
 * A TermLink links the current Term to a target Term, which is
 * either a component of, or compound made from, the current term.
 * <p>
 * Neither of the two terms contain variable shared with other terms.
 * <p>
 * The index value(s) indicates the location of the component in the compound.
 * <p>
 * This class is mainly used in inference.RuleTable to dispatch premises to
 * inference rules
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class TermLink extends Item<TermLink> implements TLink<Term> {

    /** At C, point to C; TaskLink only */
    public static readonly SELF: short = 0;
    /** At (&&, A, C), point to C */
    public static readonly COMPONENT: short = 1;
    /** At C, point to (&&, A, C) */
    public static readonly COMPOUND: short = 2;
    /** At <C --> A>, point to C */
    public static readonly COMPONENT_STATEMENT: short = 3;
    /** At C, point to <C --> A> */
    public static readonly COMPOUND_STATEMENT: short = 4;
    /** At <(&&, C, B) ==> A>, point to C */
    public static readonly COMPONENT_CONDITION: short = 5;
    /** At C, point to <(&&, C, B) ==> A> */
    public static readonly COMPOUND_CONDITION: short = 6;
    /** At C, point to <(*, C, B) --> A>; TaskLink only */
    public static readonly TRANSFORM: short = 8;
    /** At C, point to B, potentially without common subterm term */
    public static readonly TEMPORAL: short = 9;

    /** The linked Term */
    public readonly target: Term;

    /** The type of link, one of the above */
    public readonly type: short;

    /**
     * The index of the component in the component list of the compound, may have up
     * to 4 levels
     */
    public readonly index: Int16Array;

    protected readonly hash: int;

    /**
     * Constructor for TermLink template
     * <p>
     * called in CompoundTerm.prepareComponentLinks only
     *
     * @param target  Target Term
     * @param type    Link type
     * @param indices Component indices in compound, may be 1 to 4
     */
    public constructor(target: Term, type: short, ...indices: short[]);

    /**
     * Constructor to make actual TermLink from a template
     * <p>
     * called in Concept.buildTermLinks only
     *
     * @param t        Target Term
     * @param template TermLink template previously prepared
     * @param v        Budget value of the link
     */
    public constructor(t: Term, template: TermLink, v: BudgetValue);

    public constructor(type: short, target: Term, i0: int);

    public constructor(type: short, target: Term, i0: int, i1: int);

    public constructor(type: short, target: Term, i0: int, i1: int, i2: int);

    public constructor(type: short, target: Term, i0: int, i1: int, i2: int, i3: int);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                if (args[1] instanceof TermLink) {
                    const [t, template, v] = args as [Term, TermLink, BudgetValue];
                    super(v);
                    this.target = t;
                    this.type = (template.target.equals(t))
                        ? (template.type - 1) as short // point to component
                        : template.type;
                    this.index = template.index;
                    this.hash = this.init();
                    break;
                }

                const typeFirst = typeof args[0] === "number";
                const type = (typeFirst ? args[0] : args[1]) as short;
                const target = (typeFirst ? args[1] : args[0]) as Term;
                const indices = args.slice(2) as short[];
                super(null);
                this.target = target;
                this.type = type;
                /* assert (type % 2 == 0); */  // template types all point to compound, though the target is component
                if (type === TermLink.COMPOUND_CONDITION) { // the first index is 0 by default
                    this.index = new Int16Array(indices.length + 1);
                    this.index[0] = 0;
                    // jree's System.arraycopy accepts native arrays only, while
                    // this field is intentionally a typed array in TypeScript.
                    // Preserve Java's indexed copy without crossing that
                    // incompatible runtime boundary.
                    this.index.set(indices, 1);
                } else {
                    this.index = new Int16Array(indices);
                }
                this.hash = this.init();
                break;
            }

            case 4: {
                const [type, target, i0, i1] = args as [short, Term, int, int];


                super(null);
                this.target = target;
                this.type = type;
                this.index = new Int16Array(type === TermLink.COMPOUND_CONDITION
                    ? [0, i0, i1]
                    : [i0, i1]);
                this.hash = this.init();


                break;
            }

            case 5: {
                const [type, target, i0, i1, i2] = args as [short, Term, int, int, int];


                super(null);
                this.target = target;
                this.type = type;
                this.index = new Int16Array(type === TermLink.COMPOUND_CONDITION
                    ? [0, i0, i1, i2]
                    : [i0, i1, i2]);
                this.hash = this.init();


                break;
            }

            case 6: {
                const [type, target, i0, i1, i2, i3] = args as [short, Term, int, int, int, int];


                super(null);
                this.target = target;
                this.type = type;
                this.index = new Int16Array(type === TermLink.COMPOUND_CONDITION
                    ? [0, i0, i1, i2, i3]
                    : [i0, i1, i2, i3]);
                this.hash = this.init();


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public name(): TermLink {
        return this;
    }

    public hashCode(): int {
        return this.hash;
    }

    public equals(obj: java.lang.Object): boolean {
        if (obj === this)
            return true;
        if (this.hashCode() !== obj.hashCode())
            return false;

        if (obj instanceof TermLink) {
            let t: TermLink = obj as TermLink;

            if (this.type !== t.type)
                return false;
            if (!java.util.Arrays.equals(t.index, this.index))
                return false;

            let tt: Term = t.target;
            if (this.target === null) {
                return tt === null;
            } else if (tt === null) {
                return this.target === null;
            } else
                return this.target.equals(t.target);

        }
        return false;
    }

    /**
     * @return hashcode
     */
    protected init(): int {
        // TODO lazy calculate this?
        let h: int = java.util.Objects.hash(this.target, this.type, java.util.Arrays.hashCode(this.index));
        return h;
    }

    public toString(): string {
        // Java source return type: String; new StringBuilder().append(newKeyPrefix()).append(
        //              target != null ? target.name() : "").toString();
        const targetText = this.target !== null ? javaStringValue(this.target.name()) : "";
        return `${this.newKeyPrefix()}${targetText}`;
    }

    public newKeyPrefix(): string {
        // Java source type: CharSequence built by a local StringBuilder.
        // The builder is immediately consumed by toString(), so native text
        // plus join preserves the same value without retaining a jree object.
        let at1: string;
        let at2: string;
        if ((this.type % 2) === 1) { // to component
            at1 = Symbols.TO_COMPONENT_1;
            at2 = Symbols.TO_COMPONENT_2;
        } else { // to compound
            at1 = Symbols.TO_COMPOUND_1;
            at2 = Symbols.TO_COMPOUND_2;
        }
        const indexText = this.index === null
            ? ""
            : Array.from(this.index, (i) => (i + 1).toString(16)).join("-");
        const indexSuffix = indexText.length === 0 ? "" : `-${indexText}`;
        return `${at1}T${this.type}${indexSuffix}${at2}`;
    }

    /**
     * Get one index by level
     *
     * @param i The index level
     * @return The index value
     */
    public getIndex(i: int): short {
        if ((this.index !== null) && (i < this.index.length)) {
            return this.index[i];
        } else {
            return -1;
        }
    }

    public getTarget(): Term {
        return this.target;
    }

    public getTerm(): Term {
        return this.getTarget();
    }
}
