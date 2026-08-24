//! Java source: opennars/interfaces/Multistepable.java

import { java, type long, type int } from "jree";



/**
 * Implementation can work with cycles and stopped
 *
 * @author Robert Wünsche
 */
export interface Multistepable {
    start(minCyclePeriodMS: long): void;

    start(): void;

    stop(): void;

    cycles(cycles: int): void;

    cycle(): void;
}
