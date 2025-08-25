
import { java, type long, type int } from "jree";



/**
 * Implementation can work with cycles and stopped
 *
 * @author Robert Wünsche
 */
interface Multistepable {
    start(/* final */  minCyclePeriodMS: long): void;

    start(): void;

    stop(): void;

    cycles(/* final */  cycles: int): void;

    cycle(): void;
}
