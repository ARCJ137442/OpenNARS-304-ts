//! Java source: opennars/io/Parser.java
import type { Task } from "../entity/Task.ts";
import { JavaException } from "../runtime/JavaExceptions.ts";
import type { JavaStringInput } from "../runtime/jree-compat.ts";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
export interface Parser {
    parseTask(narsese: JavaStringInput): Task;
}

class ParserInvalidInputException extends JavaException {
    /**
     * An invalid addInput line.
     *
     * @param s type of error
     */
    public constructor(s: JavaStringInput) {
        super(s);
    }
}

export const Parser = {
    InvalidInputException: ParserInvalidInputException,
};

