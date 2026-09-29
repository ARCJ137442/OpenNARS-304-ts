//! Java source: opennars/language/Image.java
import type { short, int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { CompoundTerm } from "./CompoundTerm.ts";
import { Term } from "./Term.ts";
import type { AbstractTerm } from "./AbstractTerm.ts";
import { Symbols } from "../io/Symbols.ts";
import { javaObjectsHash } from "../runtime/JavaArrays.ts";
import { toJavaString, type JavaCharSequence, type JavaString } from "../runtime/jree-compat.ts";
import { javaStringValue } from "../runtime/java-text.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
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
        this.hash = javaObjectsHash(super.hashCode(), this.relationIndex);
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
        // Java accepts only an exact atomic Term here. `instanceof Term` also
        // accepts Variable and every CompoundTerm subclass in TypeScript,
        // which changes image parsing for a derived term named "_".
        if (!(t instanceof Term) || t.getClass() !== Term.class)
            return false;
        let n: JavaCharSequence = t.name();
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
    protected static makeImageName(op: NativeOperator, arg: Term[], relationIndex: int): JavaString {
        let name = `${COMPOUND_TERM_OPENER.ch}${op.toString()}${Symbols.ARGUMENT_SEPARATOR}${javaStringValue(arg[relationIndex].name())}`;

        for (let i: int = 0; i < arg.length; i++) {
            name += Symbols.ARGUMENT_SEPARATOR;
            name += i === relationIndex
                ? Symbols.IMAGE_PLACE_HOLDER
                : javaStringValue(arg[i].name());
        }
        name += COMPOUND_TERM_CLOSER.ch;
        return toJavaString(name);
    }

    /**
     * Get the other term in the Image
     *
     * @return The term relaterom existing fields
     * @return the name of the term
     */
    public makeName(): JavaCharSequence {
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
    public getTheOtherComponent(): Term | null {
        if (this.term.length !== 2) {
            return null;
        }
        return (this.relationIndex === 0) ? this.term[1] : this.term[0];
    }
}
