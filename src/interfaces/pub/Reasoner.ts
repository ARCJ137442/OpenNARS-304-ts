//! Java source: opennars/interfaces/pub/Reasoner.java
import type { JavaStringInput } from "../../runtime/java-text.ts";
import type { SensoryChannelConsumer } from "../SensoryChannelConsumer.ts";
import type { Resettable } from "../Resettable.ts";
import type { NarseseConsumer } from "../NarseseConsumer.ts";
import type { Eventable } from "../Eventable.ts";
import type { Pluggable } from "../Pluggable.ts";
import type { Multistepable } from "../Multistepable.ts";
import type { Timable } from "../Timable.ts";
import type { AnswerHandler } from "../../io/events/AnswerHandler.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Task } from "../../entity/Task.ts";



/**
 * Implementations implement a full Non-axiomatic-reasoner
 *
 * @author Robert Wünsche
 */
export interface Reasoner extends
    SensoryChannelConsumer,
    Resettable,
    NarseseConsumer,
    Eventable,
    Pluggable,
    Multistepable,
    Timable {
    addInput(narsese: JavaStringInput): void;
    addInput(task: Task, time: Timable): Reasoner;

    /**
     * ask reasoner a eternal question
     *
     * @param termString narsese string with term of question
     * @param answered   handler which will be called when answered
     * @return reasoner which processes the question
     * @throws Narsese.InvalidInputException
     */
    ask(termString: JavaStringInput, answered: AnswerHandler): Reasoner;

    /**
     * ask reasoner a now question
     *
     * @param termString narsese string with term of question
     * @param answered   handler which will be called when answered
     * @return reasoner which processes the question
     * @throws Narsese.InvalidInputException
     */
    askNow(termString: JavaStringInput, answered: AnswerHandler): Reasoner;

    /**
     * returns the concept by name/term or creates it if it doesn't exist
     *
     * @param concept the name/term of the concept
     * @return queried or created concept
     * @throws Narsese.InvalidInputException
     */
    concept(concept: JavaStringInput): Concept;

    /**
     * Main loop executed by the Thread. Should not be called directly.
     */
    run(): void;

    /**
     * return the current time from the clock
     *
     * @return The current time
     */
    time(): bigint;

    /**
     * is the reasoner running?
     *
     * @return is it running
     */
    isRunning(): boolean;

    /**
     * returns the minimum delay of a cycle in milliseconds
     *
     * @return minimum cycle delay period
     */
    getMinCyclePeriodMS(): bigint;

    /**
     * When b is true, Nar will call Thread.yield each run() iteration that
     * minCyclePeriodMS==0 (no delay).
     * This is for improving program responsiveness when Nar is run with no delay.
     *
     * @param b Nar will call Thread.yield each run()
     */
    setThreadYield(b: boolean): void;
}
