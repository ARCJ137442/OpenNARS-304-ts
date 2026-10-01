//! Java source: opennars/operator/misc/Count.java
import type { int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { FunctionOperator } from "../FunctionOperator.ts";
import { Term } from "../../language/Term.ts";
import { SetExt } from "../../language/SetExt.ts";
import { SetInt } from "../../language/SetInt.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { ReasonerStateError } from "../../runtime/ReasonerErrors.ts";
import type { Memory } from "../../storage/Memory.ts";



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

    // Java source type: final static String. Keep the diagnostic native until it
    // crosses the exception compatibility boundary below.
    protected static readonly requireMessage = "Requires 1 SetExt or SetInt argument";

    protected static readonly counted: Term = Term.get("counted");

    protected function(memory: Memory, x: Term[]): Term {
        if (x.length !== 1) {
            throw new ReasonerStateError(Count.requireMessage);
        }

        let content: Term = x[0];
        if (!(content instanceof SetExt) && !(content instanceof SetInt)) {
            throw new ReasonerStateError(Count.requireMessage);
        }

        let n: int = (content as CompoundTerm).size();
        return Term.get(n);
    }

    protected getRange(): Term {
        return Count.counted;
    }

}
