//! Java source: opennars/interfaces/SensoryChannelConsumer.java
import type { TextInput } from "../runtime/Text.ts";
import type { SensoryChannel } from "../plugin/perception/SensoryChannel.ts";



/**
 * Implementations have sensory channels
 *
 * @author Robert Wünsche
 */
export interface SensoryChannelConsumer {
    /**
     * registers a sensory channel by/for the term
     *
     * @param term    term in narsese
     * @param channel the channel to be registered
     */
    // Java source type: String. Accept boxed Java and native strings at the boundary.
    addSensoryChannel(term: TextInput, channel: SensoryChannel): void;
}
