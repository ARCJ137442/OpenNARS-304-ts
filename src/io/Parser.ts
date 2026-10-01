//! Java source: opennars/io/Parser.java
import type { Task } from "../entity/Task.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import { textValue } from "../runtime/Text.ts";
import type { TextInput } from "../runtime/Text.ts";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
export interface Parser {
    parseTask(narsese: TextInput): Task;
}

class ParserInvalidInputException extends ReasonerInputError {
    /**
     * An invalid addInput line.
     *
     * @param s type of error
     */
    public constructor(s: TextInput) {
        super(textValue(s));
    }
}

export const Parser = {
    InvalidInputException: ParserInvalidInputException,
};

