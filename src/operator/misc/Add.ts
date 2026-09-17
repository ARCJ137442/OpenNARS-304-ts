//! Java source: opennars/operator/misc/Add.java
import { java } from "jree";
import type { int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { FunctionOperator } from "../FunctionOperator.ts";
import { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";

// Java's StringUtils.isNumeric accepts an integer composed only of digits.
// Keep this check local so the operator does not depend on the main entrypoint.
const isNumeric = (value: unknown): boolean => /^\d+$/.test(String(value).trim());



/**
 * Count the number of elements in a set
 */
export class Add extends FunctionOperator {

    public constructor() {
        super("^add");
    }

    protected function(memory: Memory, x: Term[]): Term {
        if (x.length !== 2) {
            throw new java.lang.IllegalStateException("Requires 2 arguments");
        }

        let n1: int;
        let n2: int;

        if (isNumeric(x[0].name())) {
            n1 = java.lang.Integer.parseInt(java.lang.String.valueOf(x[0].name()));
        } else {
            throw new java.lang.IllegalArgumentException("1st parameter not an integer");
        }

        if (isNumeric(x[1].name())) {
            n2 = java.lang.Integer.parseInt(java.lang.String.valueOf(x[1].name()));
        } else {
            throw new java.lang.IllegalArgumentException("2nd parameter not an integer");
        }

        return new Term(java.lang.String.valueOf(n1 + n2));
    }

    protected getRange(): Term {
        return Term.get("added");
    }

}
