
import { java } from "jree";



/**
 * Something which can consume files
 *
 * @author Robert Wünsche
 */
interface InputFileConsumer {
    /**
     * consumes a file
     *
     * @param filename optional path followed by filename
     */
    addInputFile(/* final */  filename: java.lang.String): void;
}
