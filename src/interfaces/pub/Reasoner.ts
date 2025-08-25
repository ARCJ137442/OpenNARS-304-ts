import { java, type long } from "jree";



/**
 * Implementations implement a full Non-axiomatic-reasoner
 *
 * @author Robert Wünsche
 */
interface Reasoner extends
    SensoryChannelConsumer,
    Resettable,
    NarseseConsumer,
    InputFileConsumer,
    TaskConsumer<Reasoner>,
    Eventable,
    Pluggable,
    Multistepable,
    Timable {
    /**
     * ask reasoner a eternal question
     *
     * @param termString narsese string with term of question
     * @param answered   handler which will be called when answered
     * @return reasoner which processes the question
     * @throws Narsese.InvalidInputException
     */
    ask(/* final */  termString: java.lang.String, /* final */  answered: AnswerHandler): Reasoner;

    /**
     * ask reasoner a now question
     *
     * @param termString narsese string with term of question
     * @param answered   handler which will be called when answered
     * @return reasoner which processes the question
     * @throws Narsese.InvalidInputException
     */
    askNow(/* final */  termString: java.lang.String, /* final */  answered: AnswerHandler): Reasoner;

    /**
     * returns the concept by name/term or creates it if it doesn't exist
     *
     * @param concept the name/term of the concept
     * @return queried or created concept
     * @throws Narsese.InvalidInputException
     */
    concept(/* final */  concept: java.lang.String): Concept;

    /**
     * Main loop executed by the Thread. Should not be called directly.
     */
    run(): void;

    /**
     * return the current time from the clock
     *
     * @return The current time
     */
    time(): long;

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
    getMinCyclePeriodMS(): long;

    /**
     * When b is true, Nar will call Thread.yield each run() iteration that
     * minCyclePeriodMS==0 (no delay).
     * This is for improving program responsiveness when Nar is run with no delay.
     *
     * @param b Nar will call Thread.yield each run()
     */
    setThreadYield(/* final */  b: boolean): void;
}
