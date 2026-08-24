//! Java source: opennars/interfaces/InputFileConsumer.java

import { java } from "jree";



/**
 * Something which can consume files
 *
 * @author Robert Wünsche
 */
export interface InputFileConsumer {
    /**
     * consumes a file
     *
     * @param filename optional path followed by filename
     */
    addInputFile(filename: java.lang.String): void;
}
