import { java } from "jree";



/**
 * Implementations have sensory channels
 *
 * @author Robert Wünsche
 */
interface SensoryChannelConsumer {
    /**
     * registers a sensory channel by/for the term
     *
     * @param term    term in narsese
     * @param channel the channel to be registered
     */
    addSensoryChannel(/* final */  term: java.lang.String, /* final */  channel: SensoryChannel): void;
}
