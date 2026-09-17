//! Java source: opennars/language/ImageExt.java
import { java, S } from "jree";
import type { short, int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Image } from "./Image.ts";
import { Term } from "./Term.ts";
import { Product } from "./Product.ts";
import { Symbols } from "../io/Symbols.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const isPlaceHolder = Image.isPlaceHolder;



/**
 * An extension image as defined in the NARS-theory
 *
 * <p>
 * B --> (/,P,A,_)) iff (*,A,B) --$gt; P
 * <p>
 * Internally, it is actually (/,A,P)_1, with an index.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class ImageExt extends Image {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg   The component list of the term
     * @param index The index of relation in the component list
     */
    public constructor(arg: Term[], index: short) {
        super(arg, index);
    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into an ImageExt
     */
    public clone(): ImageExt;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): ImageExt | Term | null {
        switch (args.length) {
            case 0: {

                return new ImageExt(this.term, this.relationIndex);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                if (replaced.length !== this.term.length)
                    throw new java.lang.IllegalStateException("Replaced terms not the same amount as existing terms (" + this.term.length
                        + "): " + java.util.Arrays.toString(replaced));

                return new ImageExt(replaced, this.relationIndex);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Try to make a new ImageExt. Called by StringParser.
     *
     * @return the Term generated from the arguments
     * @param argList The list of term
     */
    public static make(argList: Term[]): Term;

    /**
     * Try to make an Image from a Product and a relation. Called by the inference
     * rules.
     *
     * @param product  The product
     * @param relation The relation
     * @param index    The index of the place-holder
     * @return A compound generated or a term it reduced to
     */
    public static make(product: Product, relation: Term, index: short): Term;

    /**
     * Try to make an Image from an existing Image and a component. Called by the
     * inference rules.
     *
     * @param oldImage  The existing Image
     * @param component The component to be added into the component list
     * @param index     The index of the place-holder in the new Image
     * @return A compound generated or a term it reduced to
     */
    public static make(oldImage: ImageExt, component: Term, index: short): Term;
    public static make(...args: unknown[]): Term {
        switch (args.length) {
            case 1: {
                const [argList] = args as [Term[]];


                if (argList.length < 2) {
                    return argList[0];
                }
                let relation: Term = argList[0];
                let argument: Term[] = new Array<Term>(argList.length - 1);
                let index: int = 0;
                let n: int = 0;
                for (let j: int = 1; j < argList.length; j++) {
                    if (isPlaceHolder(argList[j])) {
                        index = j - 1;
                        argument[n] = relation;
                    } else {
                        argument[n] = argList[j];
                    }
                    n++;
                }
                return new ImageExt(argument, index as short);


                break;
            }

            case 3: {
                if (args[0] instanceof ImageExt) {
                    const [oldImage, component, index] = args as [ImageExt, Term, short];
                    let argList: Term[] = oldImage.cloneTerms();
                    let oldIndex: int = oldImage.relationIndex;
                    let relation: Term = argList[oldIndex];
                    argList[oldIndex] = component;
                    argList[index] = relation;
                    return new ImageExt(argList, index);
                }

                const [product, relation, index] = args as [Product, Term, short];
                if (relation instanceof Product) {
                    let p2: Product = relation as Product;
                    if ((product.size() === 2) && (p2.size() === 2)) {
                        if ((index === 0) && product.term[1].equals(p2.term[1])) { // (/,_,(*,a,b),b) is reduced to a
                            return p2.term[0];
                        }
                        if ((index === 1) && product.term[0].equals(p2.term[0])) { // (/,(*,a,b),a,_) is reduced to b
                            return p2.term[1];
                        }
                    }
                }
                let argument: Term[] = product.cloneTerms(); // TODO is this clone needed?
                argument[index] = relation;
                return new ImageExt(argument, index);
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * get the operator of the term.
     *
     * @return the operator of the term
     */
    public operator(): NativeOperator {
        return NativeOperator.IMAGE_EXT;
    }
}
