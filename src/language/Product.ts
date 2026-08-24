//! Java source: opennars/language/Product.java
import { java, type int, S } from "jree";
import { CompoundTerm } from "./CompoundTerm.ts";
import { Symbols } from "../io/Symbols.ts";
import type { Term } from "./Term.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;



/**
 * A Product is a sequence of 1 or more terms as defined in the NARS-theory
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Product extends CompoundTerm {

    /**
     * Constructor with partial values, called by make
     *
     * @param arg The component list of the term
     */
    public constructor(arg: Term[]);
    public constructor(...arg: Term[]);

    public constructor(x: java.util.List<Term>);
    public constructor(...args: unknown[]) {
        let terms: Term[];
        if (args.length === 1 && Array.isArray(args[0])) {
            terms = args[0] as Term[];
        } else if (args.length === 1 && typeof (args[0] as java.util.List<Term>)?.toArray === "function") {
            terms = (args[0] as java.util.List<Term>).toArray(new Array<Term>(0));
        } else {
            terms = args as Term[];
        }
        super(terms);
        this.init(terms);
    }


    public static make(arg: Term[]): Product;
    public static make(...arg: Term[]): Product;

    /**
     * Try to make a Product from an ImageExt/ImageInt and a component. Called by
     * the inference rules.
     *
     * @param image     The existing Image
     * @param component The component to be added into the component list
     * @param index     The index of the place-holder in the new Image -- optional
     *                  parameter
     * @return A compound generated or a term it reduced to
     */
    public static make(image: CompoundTerm, component: Term, index: int): Term;
    public static make(...args: unknown[]): Product | Term {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                return new Product(arg);


                break;
            }

            case 3: {
                if (args[0] instanceof CompoundTerm && typeof args[2] === "number") {
                    const [image, component, index] = args as [CompoundTerm, Term, int];
                    const argument: Term[] = image.cloneTerms();
                    argument[index] = component;
                    return new Product(argument);
                }

                return new Product(args as Term[]);


                break;
            }

            default: {
                if (args.length > 0) {
                    return new Product(args as Term[]);
                }
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }

        }
    }


    /**
     * Clone a Product
     *
     * @return A new object, to be casted into an ImageExt
     */
    public clone(): Product;

    public clone(replaced: Term[]): CompoundTerm;
    public clone(...args: unknown[]): Product | CompoundTerm | null {
        switch (args.length) {
            case 0: {

                return new Product(this.term);


                break;
            }

            case 1: {
                const [replaced] = args as [Term[]];


                if (replaced === null) {
                    return null;
                }
                return new Product(replaced);


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
        return NativeOperator.PRODUCT;
    }

}
