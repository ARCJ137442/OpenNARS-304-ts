//! Java source: opennars/operator/misc/Reflect.java
import type { int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { FunctionOperator } from "../FunctionOperator.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { Product } from "../../language/Product.ts";
import { Similarity } from "../../language/Similarity.ts";
import type { Statement } from "../../language/Statement.ts";
import { Term } from "../../language/Term.ts";
import { Symbols } from "../../io/Symbols.ts";
import {
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    javaStringValue,
} from "../../runtime/jree-compat.ts";
import type { JavaStringInput } from "../../runtime/jree-compat.ts";
import type { Memory } from "../../storage/Memory.ts";

const NativeOperator = Symbols.NativeOperator;



/**
 * Produces canonical "Reflective-Narsese" representation of a parameter term
 *
 * @author me
 */
export class Reflect extends FunctionOperator {

    /*
     * <(*,<(*,good,property) --> inheritance>,(&&,<(*,human,good) -->
     * product>,<(*,(*,human,good),inheritance) --> inheritance>)) --> conjunction>.
     */

    public constructor() {
        super("^reflect");
    }

    protected function(memory: Memory, x: Term[]): Term {

        if (x.length !== 1) {
            throw new JavaIllegalStateException("Requires 1 Term argument");
        }

        let content: Term = x[0];

        return Reflect.getMetaTerm(content);
    }

    public static sop(s: Statement, operatorName: JavaStringInput): Term;

    public static sop(s: Statement, predicate: Term): Term;

    public static sop(operatorName: JavaStringInput, t: Term[]): Term;

    public static sop(operatorName: JavaStringInput, ...t: Term[]): Term;

    /**
     * <(*,subject,object) --> predicate>
     *
     * @param subject   the subject of the relation
     * @param object    the object for the relation
     * @param predicate the predicate of the relation
     */
    public static sop(subject: Term, object: Term, predicate: Term): Term;
    public static sop(...args: unknown[]): Term {
        switch (args.length) {
            case 2: {
                const [first, second] = args;
                const isStatement = first !== null
                    && typeof (first as { getSubject?: unknown }).getSubject === "function"
                    && typeof (first as { getPredicate?: unknown }).getPredicate === "function";
                if (isStatement) {
                    const s = first as Statement;
                    const product = Product.make(Reflect.getMetaTerm(s.getSubject()), Reflect.getMetaTerm(s.getPredicate()));
                    const predicate = second instanceof Term
                        ? second
                        : Term.get(javaStringValue(second));
                    return Inheritance.make(product, predicate);
                }
                const operatorName = javaStringValue(first);
                const terms = second as Term[];
                let m: Term[] = new Array<Term>(terms.length);
                let i: int = 0;
                for (let x of terms)
                    m[i++] = Reflect.getMetaTerm(x);
                return Inheritance.make(Product.make(m), Term.get(operatorName));
            }

            case 3: {
                const [subject, object, predicate] = args as [Term, Term, Term];


                return Inheritance.make(Product.make(Reflect.getMetaTerm(subject), Reflect.getMetaTerm(object)), predicate);


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public static getMetaTerm(node: Term): Term {
        if (!(node instanceof CompoundTerm)) {
            return node;
        }
        let t: CompoundTerm = node as CompoundTerm;
        switch (t.operator()) {
            case NativeOperator.INHERITANCE:
                return Reflect.sop(t as Inheritance, "inheritance");
            case NativeOperator.SIMILARITY:
                return Reflect.sop(t as Similarity, "similarity");
            default:
                return Reflect.sop(t.operator().toString(), t.term);
        }

    }

    protected getRange(): Term {
        return Term.get("reflect");
    }

}
