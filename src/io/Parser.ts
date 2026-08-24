//! Java source: opennars/io/Parser.java
import { java } from "jree";
import type { Task } from "../entity/Task.ts";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
export interface Parser {
    parseTask(narsese: java.lang.String): Task;
}

class ParserInvalidInputException extends java.lang.Exception {
    /**
     * An invalid addInput line.
     *
     * @param s type of error
     */
    public constructor(s: java.lang.String) {
        super(s);
    }
}

export const Parser = {
    InvalidInputException: ParserInvalidInputException,
};


