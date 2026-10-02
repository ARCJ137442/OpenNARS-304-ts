//! Java source: opennars/operator/misc/Add.java
import type { IntNumber } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { FunctionOperator } from "../FunctionOperator.ts";
import { Term } from "../../language/Term.ts";
import {
    asText,
} from "../../runtime/Text.ts";
import { textValue } from "../../runtime/Text.ts";
import { ReasonerInputError, ReasonerStateError } from "../../runtime/ReasonerErrors.ts";
import type { Memory } from "../../storage/Memory.ts";

// Java 3.7's StringUtils.isNumeric accepts a non-empty ASCII digit sequence;
// it does not trim whitespace or accept signs, decimal points, or Unicode digits.
// Keep this check local so the operator does not depend on the main entrypoint.
const isNumeric = (value: unknown): boolean => /^[0-9]+$/.test(textValue(value));

const parseIntLiteral = (value: string): IntNumber => {
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed > 2_147_483_647) {
        throw new ReasonerInputError(`For input string: "${value}"`);
    }
    return parsed as IntNumber;
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
            throw new ReasonerStateError("Requires 2 arguments");
        }

        let n1: IntNumber;
        let n2: IntNumber;

        const first = textValue(x[0].name());
        if (isNumeric(first)) {
            n1 = parseIntLiteral(first);
        } else {
            throw new ReasonerInputError("1st parameter not an integer");
        }

        const second = textValue(x[1].name());
        if (isNumeric(second)) {
            n2 = parseIntLiteral(second);
        } else {
            throw new ReasonerInputError("2nd parameter not an integer");
        }

        return new Term(asText(String(n1 + n2)));
    }

    protected getRange(): Term {
        return Term.get("added");
    }

}
