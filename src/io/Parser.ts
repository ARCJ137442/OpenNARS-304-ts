//! Java source: opennars/io/Parser.java
import { java } from "jree";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
export abstract class Parser {
    protected abstract parseTask(narsese: java.lang.String): Task;

    /**
     * All kinds of invalid addInput lines
     */
    public static InvalidInputException = class InvalidInputException extends java.lang.Exception {
            /**
             * An invalid addInput line.
             *
             * @param s type of error
             */
            public constructor(s: java.lang.String) {
                super(s);
            }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Parser {
    export type InvalidInputException = InstanceType<typeof Parser.InvalidInputException>;
}


