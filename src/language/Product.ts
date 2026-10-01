//! Java source: opennars/language/Product.java
import type { int } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { CompoundTerm } from "./CompoundTerm.ts";
import { Symbols } from "../io/Symbols.ts";
import type { Term } from "./Term.ts";
import {
    isJavaListInput,
} from "../runtime/java-text.ts";
import type { JavaListInput } from "../runtime/java-text.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";

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

    // Java 原始重载：Product(List<Term>)；保留 List 的有序 toArray 合同。
    public constructor(x: JavaListInput<Term>);
    public constructor(...args: unknown[]) {
        let terms: Term[];
        if (args.length === 1 && Array.isArray(args[0])) {
            terms = args[0] as Term[];
        } else if (args.length === 1 && isJavaListInput<Term>(args[0])) {
            terms = args[0].toArray(new Array<Term>(0));
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
                throw new ReasonerInputError("Invalid number of arguments");
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
                throw new ReasonerInputError("Invalid number of arguments");
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
