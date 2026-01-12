//! Java source: opennars/operator/misc/Reflect.java
import { java, type int, S } from "jree";



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
            throw new java.lang.IllegalStateException("Requires 1 Term argument");
        }

        let content: Term = x[0];

        return Reflect.getMetaTerm(content);
    }

    public static sop(s: Statement, operatorName: java.lang.String): Term;

    public static sop(s: Statement, predicate: Term): Term;

    public static sop(operatorName: java.lang.String, ...t: Term[]): Term;

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
                const [s, operatorName] = args as [Statement, java.lang.String];


                return Inheritance.make(Product.make(Reflect.getMetaTerm(s.getSubject()), Reflect.getMetaTerm(s.getPredicate())),
                    Term.get(operatorName));


                break;
            }

            case 2: {
                const [s, predicate] = args as [Statement, Term];


                return Inheritance.make(Product.make(Reflect.getMetaTerm(s.getSubject()), Reflect.getMetaTerm(s.getPredicate())), predicate);


                break;
            }

            case 2: {
                const [operatorName, t] = args as [java.lang.String, Term[]];


                let m: Term[] = new Array<Term>(t.length);
                let i: int = 0;
                for (let x of t)
                    m[i++] = Reflect.getMetaTerm(x);

                return Inheritance.make(Product.make(m), Term.get(operatorName));


                break;
            }

            case 3: {
                const [subject, object, predicate] = args as [Term, Term, Term];


                return Inheritance.make(Product.make(Reflect.getMetaTerm(subject), Reflect.getMetaTerm(object)), predicate);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static getMetaTerm(node: Term): Term {
        if (!(node instanceof CompoundTerm)) {
            return node;
        }
        let t: CompoundTerm = node as CompoundTerm;
        switch (t.operator()) {
            case INHERITANCE:
                return Reflect.sop(t as Inheritance, "inheritance");
            case SIMILARITY:
                return Reflect.sop(t as Similarity, "similarity");
            default:
                return Reflect.sop(t.operator().toString(), t.term);
        }

    }

    protected getRange(): Term {
        return Term.get("reflect");
    }

}
