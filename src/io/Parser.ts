


import { java } from "jree";



/**
 * abstraction for parsing of narsese
 *
 * @author Robert Wünsche
 */
abstract class Parser {
    protected abstract parseTask(/* final */  narsese: java.lang.String | null): Task;

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
            protected constructor(/* final */  s: java.lang.String | null) {
                super(s);
            }
        }
    })(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Parser {
    export type InvalidInputException = InstanceType<Parser["InvalidInputException"]>;
}


