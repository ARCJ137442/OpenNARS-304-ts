


import { java, type int, S } from "jree";



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
    public constructor(/* final */ ...arg: Term | null[]);

    public constructor(/* final */  x: java.util.List<Term> | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                super(arg);

                java.security.cert.CertPathChecker.init(arg);


                break;
            }

            case 1: {
                const [x] = args as [java.util.List<Term>];


                this(x.toArray(new Array<Term>(0)));


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static make(/* final */ ...arg: Term | null[]): Product | null;

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
    public static make(/* final */  image: CompoundTerm | null, /* final */  component: Term | null, /* final */  index: int): Term | null;
    public static make(...args: unknown[]): Product | null | Term | null {
        switch (args.length) {
            case 1: {
                const [arg] = args as [Term[]];


                return new Product(arg);


                break;
            }

            case 3: {
                const [image, component, index] = args as [CompoundTerm, Term, int];


                let argument: Term[] = image.cloneTerms();
                argument[index] = component;
                return new Product(argument);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Clone a Product
     *
     * @return A new object, to be casted into an ImageExt
     */
    public clone(): Product | null;

    public clone(/* final */  replaced: Term[] | null): CompoundTerm | null;
    public clone(...args: unknown[]): Product | null | CompoundTerm | null {
        switch (args.length) {
            case 0: {

                return new Product(term);


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
    public operator(): NativeOperator | null {
        return NativeOperator.PRODUCT;
    }

}
