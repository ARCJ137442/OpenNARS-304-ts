import { java, type short, type int, S } from "jree";



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
    public constructor(/* final */  arg: Term[] | null, /* final */  index: short) {
        super(arg, index);
    }

    /**
     * Clone an object
     *
     * @return A new object, to be casted into an ImageExt
     */
    public clone(): ImageExt | null;

    public clone(/* final */  replaced: Term[] | null): Term | null;
    public clone(...args: unknown[]): ImageExt | null | Term | null {
        switch (args.length) {
            case 0: {

                return new ImageExt(term, relationIndex);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                if (replaced.length !== term.length)
                    throw new java.lang.IllegalStateException("Replaced terms not the same amount as existing terms (" + term.length
                        + "): " + java.util.Arrays.toString(replaced));

                return new ImageExt(replaced, relationIndex);


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
    public static make(/* final */  argList: Term[] | null): Term | null;

    /**
     * Try to make an Image from a Product and a relation. Called by the inference
     * rules.
     *
     * @param product  The product
     * @param relation The relation
     * @param index    The index of the place-holder
     * @return A compound generated or a term it reduced to
     */
    public static make(/* final */  product: Product | null, /* final */  relation: Term | null, /* final */  index: short): Term | null;

    /**
     * Try to make an Image from an existing Image and a component. Called by the
     * inference rules.
     *
     * @param oldImage  The existing Image
     * @param component The component to be added into the component list
     * @param index     The index of the place-holder in the new Image
     * @return A compound generated or a term it reduced to
     */
    public static make(/* final */  oldImage: ImageExt | null, /* final */  component: Term | null, /* final */  index: short): Term | null;
    public static make(...args: unknown[]): Term | null {
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


                break;
            }

            case 3: {
                const [oldImage, component, index] = args as [ImageExt, Term, short];


                let argList: Term[] = oldImage.cloneTerms();
                let oldIndex: int = oldImage.relationIndex;
                let relation: Term = argList[oldIndex];
                argList[oldIndex] = component;
                argList[index] = relation;
                return new ImageExt(argList, index);


                break;
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
    public operator(): NativeOperator | null {
        return NativeOperator.IMAGE_EXT;
    }
}
