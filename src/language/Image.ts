//! Java source: opennars/language/Image.java
import { java, type short, type int } from "jree";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";

const NativeOperator = Symbols.NativeOperator;
const COMPOUND_TERM_OPENER = NativeOperator.COMPOUND_TERM_OPENER;
const COMPOUND_TERM_CLOSER = NativeOperator.COMPOUND_TERM_CLOSER;



/**
 * Generalization of Images as defined in the NARS-theory
 *
 */
export abstract class Image extends CompoundTerm {
    /** The index of relation in the component list */
    public readonly relationIndex: short;

    protected constructor(components: Term[], relationIndex: short) {
        super(components);

        this.relationIndex = relationIndex;

        this.init(components);
    }

    protected init(components: Term[]): void {
        super.init(components);
        this.hash = java.util.Objects.hash(super.hashCode(), this.relationIndex);
    }

    public compareTo(that: AbstractTerm): int {
        if (that instanceof Image) {
            let r: int = this.relationIndex - (that as Image).relationIndex;
            if (r !== 0)
                return r;
        }
        return super.compareTo(that);
    }

    // TODO replace with a special Term type
    public static isPlaceHolder(t: Term): boolean {
        if (!(t instanceof Term))
            return false;
        let n: java.lang.CharSequence = t.name();
        if (String(n).length !== 1)
            return false;
        return String(n) === Symbols.IMAGE_PLACE_HOLDER;
    }

    /**
     * default method to make the oldName of an image term from given fields
     *
     * @param op            the term operator
     * @param arg           the list of term
     * @param relationIndex the location of the place holder
     * @return the oldName of the term
     */
    protected static makeImageName(op: NativeOperator, arg: Term[], relationIndex: int): java.lang.String {
        let sizeEstimate: int = 12 * arg.length + 2;

        let name: java.lang.StringBuilder = new java.lang.StringBuilder(sizeEstimate)
            .append(COMPOUND_TERM_OPENER.ch)
            .append(op.toString())
            .append(Symbols.ARGUMENT_SEPARATOR)
            .append(arg[relationIndex].name());

        for (let i: int = 0; i < arg.length; i++) {
            name.append(Symbols.ARGUMENT_SEPARATOR);
            if (i === relationIndex) {
                name.append(Symbols.IMAGE_PLACE_HOLDER);
            } else {
                name.append(arg[i].name());
            }
        }
        name.append(COMPOUND_TERM_CLOSER.ch);
        return name.toString();
    }

    /**
     * Get the other term in the Image
     *
     * @return The term relaterom existing fields
     * @return the name of the term
     */
    public makeName(): java.lang.CharSequence {
        return Image.makeImageName(this.operator(), this.term, this.relationIndex);
    }

    /**
     * Get the relation term in the Image
     *
     * @return The term representing a relation
     */
    public getRelation(): Term {
        return this.term[this.relationIndex];
    }

    /**
     * Get the other term in the Image
     *
     * @return The term related
     */
    public getTheOtherComponent(): Term {
        if (this.term.length !== 2) {
            return null;
        }
        return (this.relationIndex === 0) ? this.term[1] : this.term[0];
    }
}
