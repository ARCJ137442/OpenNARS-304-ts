import { java, type int } from "jree";



/**
 * Count the number of elements in a set
 *
 *
 * 'INVALID
 * (^count,a)!
 * (^count,a,b)!
 * (^count,a,#b)!
 *
 * 'VALID:
 * (^count,[a,b],#b)!
 *
 *
 */
export class Count extends FunctionOperator {

    public constructor() {
        super("^count");
    }

    protected static readonly requireMessage: java.lang.String = "Requires 1 SetExt or SetInt argument";

    protected static readonly counted: Term = Term.get("counted");

    protected function(/* final */  memory: Memory, /* final */  x: Term[]): Term {
        if (x.length !== 1) {
            throw new java.lang.IllegalStateException(Count.requireMessage);
        }

        let content: Term = x[0];
        if (!(content instanceof SetExt) && !(content instanceof SetInt)) {
            throw new java.lang.IllegalStateException(Count.requireMessage);
        }

        let n: int = (content as CompoundTerm).size();
        return Term.get(n);
    }

    protected getRange(): Term {
        return Count.counted;
    }

}
