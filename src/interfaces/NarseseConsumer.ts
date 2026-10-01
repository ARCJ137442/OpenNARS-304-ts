//! Java source: opennars/interfaces/NarseseConsumer.java

import type { TextInput } from "../runtime/Text.ts";



/**
 * Something which can work with Narsese as a string representation
 *
 * @author Robert Wünsche
 */
export interface NarseseConsumer {
    // TODO< split this and refactor to interface which can be used by the parser
    // too >

    /**
     * feeds narsese input to the consumer
     *
     * @param narsese the narsese text
     */
    addInput(narsese: TextInput): void;
}
