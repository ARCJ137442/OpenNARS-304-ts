
import { java } from "jree";



/**
 * Something which can work with Narsese as a string representation
 *
 * @author Robert Wünsche
 */
interface NarseseConsumer {
    // TODO< split this and refactor to interface which can be used by the parser
    // too >

    /**
     * feeds narsese input to the consumer
     *
     * @param narsese the narsese text
     */
    addInput(narsese: java.lang.String): void;
}
