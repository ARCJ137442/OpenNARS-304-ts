//! Java source: opennars/operator/misc/Add.java
import type { int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { FunctionOperator } from "../FunctionOperator.ts";
import { Term } from "../../language/Term.ts";
import {
    JavaIllegalArgumentException,
    JavaIllegalStateException,
    JavaNumberFormatException,
    javaStringValue,
    toJavaString,
} from "../../runtime/jree-compat.ts";
import type { Memory } from "../../storage/Memory.ts";

// Java 3.7's StringUtils.isNumeric accepts a non-empty ASCII digit sequence;
// it does not trim whitespace or accept signs, decimal points, or Unicode digits.
// Keep this check local so the operator does not depend on the main entrypoint.
const isNumeric = (value: unknown): boolean => /^[0-9]+$/.test(javaStringValue(value));

const parseJavaInt = (value: string): int => {
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed > 2_147_483_647) {
        throw new JavaNumberFormatException(`For input string: "${value}"`);
    }
    return parsed as int;
};



/**
 * Count the number of elements in a set
 */
export class Add extends FunctionOperator {

    public constructor() {
        super("^add");
    }

    protected function(memory: Memory, x: Term[]): Term {
        if (x.length !== 2) {
            throw new JavaIllegalStateException("Requires 2 arguments");
        }

        let n1: int;
        let n2: int;

        const first = javaStringValue(x[0].name());
        if (isNumeric(first)) {
            n1 = parseJavaInt(first);
        } else {
            throw new JavaIllegalArgumentException("1st parameter not an integer");
        }

        const second = javaStringValue(x[1].name());
        if (isNumeric(second)) {
            n2 = parseJavaInt(second);
        } else {
            throw new JavaIllegalArgumentException("2nd parameter not an integer");
        }

        return new Term(toJavaString(String(n1 + n2)));
    }

    protected getRange(): Term {
        return Term.get("added");
    }

}
