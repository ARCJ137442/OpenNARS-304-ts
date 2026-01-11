//! Java source: opennars/parameter/Debug.java

import { java, JavaObject } from "jree";



/**
 * Nar operating parameters.
 * All static values will be removed so that this is an entirely dynamic class.
 */
export class Debug extends JavaObject {
    /**
     * ========================================================
     * The following options add additional logging and outputs
     * These do not impact the execution of the system
     * ========================================================
     */

    /**
     * Show errors in reasoning cycle, they are not fatal but ideally should not be
     * hidden, recommended.
     */
    public static SHOW_REASONING_ERRORS: boolean = true;
    /**
     * Show execution errors in operators, they ideally should not be hidden,
     * recommended.
     */
    public static SHOW_EXECUTION_ERRORS: boolean = true;
    /**
     * Show input errors, not recommended as the program that uses NARS should
     * handle them by itself
     */
    public static SHOW_INPUT_ERRORS: boolean = false;
    /** Show premises (parents) of statements */
    public static PARENTS: boolean = false;

    /**
     * =======================================================
     * The following options change the behavior of the system
     * Some may slow down the time per cycle or violate AIKR
     * =======================================================
     */

    /**
     * Whether the system tries to continue after occurrence of a reasoning error,
     * recommended as not all cases may be tested
     */
    public static REASONING_ERRORS_CONTINUE: boolean = true;
    /**
     * Whether the system tries to continue after occurrence of an execution error,
     * recommended as these are not always avoidable
     */
    public static EXECUTION_ERRORS_CONTINUE: boolean = true;
    /**
     * Whether the system should continue after an input error, not recommended as
     * it should be handled externally
     */
    public static INPUT_ERRORS_CONTINUE: boolean = false;
    /**
     * Use this for advanced error checking, at the expense of lower performance.
     */
    public static DETAILED: boolean = false;
    /** For thorough sentence debugging (slow), requires DETAILED=true */
    public static readonly DETAILED_SENTENCES: boolean = false;
    /** Set this to generate ancestry tree, not yet implemented */
    public static readonly ANCESTRY: boolean = false;

    /** Set to true by the test system, leave false */
    public static TEST: boolean = false;
}
