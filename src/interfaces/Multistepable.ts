//! Java source: opennars/interfaces/Multistepable.java

/**
 * Implementation can work with cycles and stopped
 *
 * @author Robert Wünsche
 */
export interface Multistepable {
    start(minCyclePeriodMS: bigint): void;

    start(): void;

    stop(): void;

    cycles(cycles: number): void;

    cycle(): void;
}
