//! Java source: opennars/io/Parser.java
import { java } from "jree";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
abstract class Parser {
    protected abstract parseTask(narsese: java.lang.String): Task;

    /**
     * All kinds of invalid addInput lines
     */
    public InvalidInputException = (($outer) => {
        return class InvalidInputException extends java.lang.Exception {
            /**
             * An invalid addInput line.
             *
             * @param s type of error
             */
            protected constructor(s: java.lang.String) {
                super(s);
            }
        }
    })(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Parser {
    export type InvalidInputException = InstanceType<Parser["InvalidInputException"]>;
}


