//! Java source: opennars/parameter/Parameters.java
import { java, JavaObject, type int, type float, type double } from "jree";
import { Float32Math } from "../runtime/Float32.ts";



/**
 * Reasoner local settings and deriver options
 *
 * @author Patrick Hammer
 */
// TODO< rename this after MVP0 to "ReasonerArguments" >
export class Parameters extends JavaObject implements java.io.Serializable {
    /**
     * what this value represents was originally equal to the termLink record length
     * (10), but we may want to adjust it or make it scaled according to duration
     * since it has more to do with time than # of records. it can probably be
     * increased several times larger since each item should remain in the recording
     * queue for longer than 1 cycle
     */
    public NOVELTY_HORIZON: int = 100000;

    /**
     * Minimum expectation for a desire value to execute an operation.
     * the range of "now" is [-DURATION, DURATION];
     */
    public DECISION_THRESHOLD: float = Float32Math.from(0.51) as float;

    /** Size of ConceptBag and level amount */
    // not changeable at runtime as bags would have to be re-constructed
    public CONCEPT_BAG_SIZE: int = 10000;
    public CONCEPT_BAG_LEVELS: int = 1000;

    /**
     * Cycles per duration.
     * Past/future tense usage convention;
     * How far away "past" and "future" is from "now", in cycles.
     * The range of "now" is [-DURATION/2, +DURATION/2];
     */

    public DURATION: int = 5;

    /* ---------- logical parameters ---------- */
    /**
     * Evidential Horizon, the amount of future evidence to be considered.
     * Must be >=1.0, usually 1 .. 2, not changeable at runtime as evidence
     * measurement would change
     */
    public HORIZON: float = Float32Math.from(1) as float;

    /**
     * determines the internal precision used for TruthValue calculations.
     * a value of 0.01 gives 100 truth value states between 0 and 1.0.
     * other values may be used, for example, 0.02 for 50, 0.10 for 10, etc.
     * Change at your own risk, but can't be changed at runtime
     */
    // Java declares this threshold as 0.01f. Keep the binary32 value because
    // TruthValue's confidence clamp performs double arithmetic with it.
    public TRUTH_EPSILON: float = Float32Math.from(0.01) as float;

    public BUDGET_EPSILON: float = Float32Math.from(0.0001) as float;

    /* ---------- budget thresholds ---------- */
    /** The budget threshold rate for task to be accepted. */
    public BUDGET_THRESHOLD: float = Float32Math.from(0.01) as float;

    /* ---------- default input values ---------- */
    /** Default expectation for confirmation on anticipation. */
    public DEFAULT_CONFIRMATION_EXPECTATION: float = Float32Math.from(0.6) as float;
    /** Ignore expectation for creation of concept. */
    public ALWAYS_CREATE_CONCEPT: boolean = true;
    /** Default expectation for creation of concept. */
    public DEFAULT_CREATION_EXPECTATION: float = Float32Math.from(0.66) as float; // 0.66
    /** Default expectation for creation of concept for goals. */
    public DEFAULT_CREATION_EXPECTATION_GOAL: float = Float32Math.from(0.6) as float; // 0.66
    /** Default confidence of input judgment. */
    public DEFAULT_JUDGMENT_CONFIDENCE: float = Float32Math.from(0.9) as float;
    /** Default priority of input judgment */
    public DEFAULT_JUDGMENT_PRIORITY: float = Float32Math.from(0.8) as float;
    /** Default durability of input judgment */
    public DEFAULT_JUDGMENT_DURABILITY: float = Float32Math.from(0.5) as float; // was 0.8 in 1.5.5; 0.5 after
    /** Default priority of input question */
    public DEFAULT_QUESTION_PRIORITY: float = Float32Math.from(0.9) as float;
    /** Default durability of input question */
    public DEFAULT_QUESTION_DURABILITY: float = Float32Math.from(0.9) as float;

    /** Default confidence of input goal. */
    public DEFAULT_GOAL_CONFIDENCE: float = Float32Math.from(0.9) as float;
    /** Default priority of input judgment */
    public DEFAULT_GOAL_PRIORITY: float = Float32Math.from(0.9) as float;
    /** Default durability of input judgment */
    public DEFAULT_GOAL_DURABILITY: float = Float32Math.from(0.9) as float;
    /** Default priority of input question */
    public DEFAULT_QUEST_PRIORITY: float = Float32Math.from(0.9) as float;
    /** Default durability of input question */
    public DEFAULT_QUEST_DURABILITY: float = Float32Math.from(0.9) as float;

    /* ---------- space management ---------- */

    /**
     * Level separation in LevelBag, one digit
     */
    public BAG_THRESHOLD: float = Float32Math.from(1.0) as float;

    /** (see its use in budgetfunctions iterative forgetting) */
    public FORGET_QUALITY_RELATIVE: float = Float32Math.from(0.3) as float;

    public REVISION_MAX_OCCURRENCE_DISTANCE: int = 10;

    /** Size of TaskLinkBag */
    public TASK_LINK_BAG_SIZE: int = 100; // was 200 in new experiment
    public TASK_LINK_BAG_LEVELS: int = 10;
    /** Size of TermLinkBag */
    public TERM_LINK_BAG_SIZE: int = 100; // was 1000 in new experiment
    public TERM_LINK_BAG_LEVELS: int = 10;
    /** Maximum TermLinks checked for novelty for each TaskLink in TermLinkBag */
    public TERM_LINK_MAX_MATCHED: int = 10;
    /** Size of Novel Task Buffer */
    public NOVEL_TASK_BAG_SIZE: int = 1000;
    public NOVEL_TASK_BAG_LEVELS: int = 100;
    public NOVEL_TASK_BAG_SELECTIONS: int = 100;
    /** Size of derived sequence and input event bag */
    public SEQUENCE_BAG_SIZE: int = 30;
    public SEQUENCE_BAG_LEVELS: int = 10;
    /** Size of remembered last operation tasks */
    public OPERATION_BAG_SIZE: int = 10;
    public OPERATION_BAG_LEVELS: int = 10;
    public OPERATION_SAMPLES: int = 6; // should be at least 2 to not only consider last decision

    /** How fast events decay in confidence **/
    public PROJECTION_DECAY: double = 0.1;

    /* ---------- avoiding repeated reasoning ---------- */
    /** Maximum length of the evidental base of the Stamp */
    public MAXIMUM_EVIDENTAL_BASE_LENGTH: int = 20000;

    /** Maximum TermLinks used in reasoning for each Task in Concept */
    public TERMLINK_MAX_REASONED: int = 3;

    /** Record-length for newly created TermLink's */
    public TERM_LINK_RECORD_LENGTH: int = 10;

    /** Maximum number of beliefs kept in a Concept */
    public CONCEPT_BELIEFS_MAX: int = 28; // was 7

    /** Maximum number of questions kept in a Concept */
    public CONCEPT_QUESTIONS_MAX: int = 5;

    /** Maximum number of goals kept in a Concept */
    public CONCEPT_GOALS_MAX: int = 7;

    /**
     * Reliance factor, the empirical confidence of analytical truth.
     * the same as default confidence
     */
    public reliance: float = Float32Math.from(0.9) as float;

    /**
     * The rate of confidence decrease in mental operations Doubt and Hesitate
     * set to zero to disable this feature.
     */
    public DISCOUNT_RATE: float = Float32Math.from(0.5) as float;

    // RUNTIME PERFORMANCE (should not affect logic):
    // ----------------------------------

    /*
     * max length of a Term name for which it can be storedally via String.intern().
     * set to zero to disable this feature.
     * The problem with indiscriminate use of intern() is that interned strings can
     * not be garbage collected (i.e. permgen) - possible a memory leak if terms
     * disappear.
     */
    // public int INTERNED_TERM_NAME_MAXLEN = 0;

    /*
     * Determines when TermLink and TaskLink should use Rope implementation for its
     * Key,
     * rather than String/StringBuilder.
     *
     * Set to -1 to disable the Rope entirely, 0 to use always, or a larger number
     * as a threshold
     * below which uses contiguous char[] implementation, and above which uses
     * FastConcatenationRope.
     *
     * While a Rope is potentially more memory efficient (because it can re-use
     * String instances
     * in its components without a redundant copy being stored) it can be more
     * computationally costly than a character array.
     *
     * The value needs to be weighed against the overhead of the comparison and
     * iteration costs.
     *
     * Optimal value to be determined.
     */

    /** whether eternalization should happen on every derivation */
    public IMMEDIATE_ETERNALIZATION: boolean = true;

    // public int STM_SIZE = 1;
    public SEQUENCE_BAG_ATTEMPTS: int = 10; // 5 //20
    public CONDITION_BAG_ATTEMPTS: int = 10; // 5 //20

    public DERIVATION_PRIORITY_LEAK: float = Float32Math.from(0.4) as float; // https://groups.google.com/forum/#!topic/open-nars/y0XDrs2dTVs

    public DERIVATION_DURABILITY_LEAK: float = Float32Math.from(0.4) as float; // https://groups.google.com/forum/#!topic/open-nars/y0XDrs2dTVs

    /**
     * how much risk is the system allowed to take just to fullfill its hunger for
     * knowledge?
     */
    public CURIOSITY_DESIRE_CONFIDENCE_MUL: float = Float32Math.from(0.1) as float;

    /** how much priority should curiosity have? */
    public CURIOSITY_DESIRE_PRIORITY_MUL: float = Float32Math.from(0.1) as float;

    /** how much durability should curiosity have? */
    public CURIOSITY_DESIRE_DURABILITY_MUL: float = Float32Math.from(0.3) as float;

    public CURIOSITY_FOR_OPERATOR_ONLY: boolean = false; // for Peis concern that it may be overkill to allow it
    // for all <a =/> b> statement, so that a has
    // to be an operator

    public BREAK_NAL_HOL_BOUNDARY: boolean = false;

    public QUESTION_GENERATION_ON_DECISION_MAKING: boolean = false;

    public HOW_QUESTION_GENERATION_ON_DECISION_MAKING: boolean = false;

    /** eternalized induction confidence to revise A =/> B beliefs */
    public ANTICIPATION_CONFIDENCE: float = Float32Math.from(0.1) as float;

    public ANTICIPATION_TOLERANCE: float = Float32Math.from(100.0) as float;

    /**
     * Retrospective anticipation, allow to check memory for content in case of
     * anticipation (potential issue with forgetting)
     */
    public RETROSPECTIVE_ANTICIPATIONS: boolean = false;

    public SATISFACTION_THRESHOLD: float = Float32Math.from(0.0) as float; // decision threshold is enough for now

    public COMPLEXITY_UNIT: float = Float32Math.from(1.0) as float; // 1.0 - oo

    public INTERVAL_ADAPT_SPEED: float = Float32Math.from(4.0) as float;

    public TASKLINK_PER_CONTENT: int = 4; // eternal/event are also seen extra

    /** Default priority of execution feedback */
    public DEFAULT_FEEDBACK_PRIORITY: float = Float32Math.from(0.9) as float;
    /** Default durability of execution feedback */
    public DEFAULT_FEEDBACK_DURABILITY: float = Float32Math.from(0.5) as float; // was 0.8 in 1.5.5; 0.5 after

    /**
     * Concept decay rate in ConceptBag, in [1, 99]. originally:
     * CONCEPT_FORGETTING_CYCLE
     * How many cycles it takes an item to decay completely to a threshold value
     * (ex: 0.1).
     * Lower means faster rate of decay.
     */
    public CONCEPT_FORGET_DURATIONS: float = Float32Math.from(2.0) as float;

    /**
     * TermLink decay rate in TermLinkBag, in [1, 99]. originally:
     * TERM_LINK_FORGETTING_CYCLE
     */
    public TERMLINK_FORGET_DURATIONS: float = Float32Math.from(10.0) as float;

    /**
     * TaskLink decay rate in TaskLinkBag, in [1, 99]. originally:
     * TASK_LINK_FORGETTING_CYCLE
     */
    public TASKLINK_FORGET_DURATIONS: float = Float32Math.from(4.0) as float;

    /** Sequence bag forget durations */
    public EVENT_FORGET_DURATIONS: float = Float32Math.from(4.0) as float;

    /** Maximum attempted combinations in variable introduction. */
    public VARIABLE_INTRODUCTION_COMBINATIONS_MAX: int = 8;

    /** How much confidence should be penalized per introduced var */
    public VARIABLE_INTRODUCTION_CONFIDENCE_MUL: float = Float32Math.from(0.9) as float;

    /** Maximum anticipations about its content stored in a concept */
    public ANTICIPATIONS_PER_CONCEPT_MAX: int = 8;

    /**
     * operations having used procedure knowledge above the confidence threshold
     * will not babble
     */
    public MOTOR_BABBLING_CONFIDENCE_THRESHOLD: float = Float32Math.from(0.8) as float;

    /** Default threads amount at startup */
    public THREADS_AMOUNT: int = 1;

    /** Default volume at startup */
    public VOLUME: int = 0;

    /** Default milliseconds per step at startup */
    public MILLISECONDS_PER_STEP: int = 0;

    /** Timing mode, steps or real time */
    public STEPS_CLOCK: boolean = true;

}
