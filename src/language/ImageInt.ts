//! Java source: opennars/language/ImageInt.java
import { java, type short, type int, S } from "jree";
import { Image } from "./Image.ts";
import { Term } from "./Term.ts";
import { Product } from "./Product.ts";
import { Symbols } from "../io/Symbols.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
const isPlaceHolder = Image.isPlaceHolder;



/**
 * An intension image as defined in the NARS-theory
 *
 * <p>
 * (\,P,A,_)) --> B iff P --> (*,A,B)
 * <p>
 * Internally, it is actually (\,A,P)_1, with an index.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class ImageInt extends Image {

    /**
     * constructor with partial values, called by make
     *
     * @param arg   The component list of the term
     * @param index The index of relation in the component list
     */
    protected constructor(arg: Term[], index: short) {
        super(arg, index);
    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into an ImageInt
     */
    public clone(): ImageInt;

    public clone(replaced: Term[]): Term;
    public clone(...args: unknown[]): ImageInt | Term | null {
        switch (args.length) {
            case 0: {

                return new ImageInt(this.term, this.relationIndex);


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

                return new ImageInt(replaced, this.relationIndex);


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
     * Try to make a new compound from a set of term. Called by the public make
     * methods.
     *
     * @param argument The argument list
     * @param index    The index of the place-holder in the new Image
     * @return the Term generated from the arguments
     */
    public static make(argument: Term[], index: short): ImageInt;

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
    public static make(oldImage: ImageInt, component: Term, index: short): Term;
    public static make(...args: unknown[]): Term | ImageInt {
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
                return ImageInt.make(argument, index as short);


                break;
            }

            case 2: {
                const [argument, index] = args as [Term[], short];


                return new ImageInt(argument, index);


                break;
            }

            case 3: {
                if (args[0] instanceof ImageInt) {
                    const [oldImage, component, index] = args as [ImageInt, Term, short];
                    let argList: Term[] = oldImage.cloneTerms();
                    let oldIndex: int = oldImage.relationIndex;
                    let relation: Term = argList[oldIndex];
                    argList[oldIndex] = component;
                    argList[index] = relation;
                    return ImageInt.make(argList, index);
                }

                const [product, relation, index] = args as [Product, Term, short];
                if (relation instanceof Product) {
                    let p2: Product = relation as Product;
                    if ((product.size() === 2) && (p2.size() === 2)) {
                        if ((index === 0) && product.term[1].equals(p2.term[1])) {// (\,_,(*,a,b),b) is reduced to a
                            return p2.term[0];
                        }
                        if ((index === 1) && product.term[0].equals(p2.term[0])) {// (\,(*,a,b),a,_) is reduced to b
                            return p2.term[1];
                        }
                    }
                }
                let argument: Term[] = product.cloneTerms(); // TODO is this clone needed?
                argument[index] = relation;
                return ImageInt.make(argument, index);
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
        return NativeOperator.IMAGE_INT;
    }
}
