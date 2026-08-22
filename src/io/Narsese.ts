//! Java source: opennars/io/Narsese.java
import { java, JavaObject, type int, type char, type float, S } from "jree";
import { Parser } from "./Parser.ts";
import { Symbols } from "./Symbols.ts";
import { Tense } from "../language/Tense.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Stamp } from "../entity/Stamp.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Task } from "../entity/Task.ts";
import { Term } from "../language/Term.ts";
import { Variable } from "../language/Variable.ts";
import { Variables } from "../language/Variables.ts";
import { Interval } from "../language/Interval.ts";
import { Operator } from "../operator/Operator.ts";
import { Operation } from "../operator/Operation.ts";
import { Product } from "../language/Product.ts";
import { Conjunction } from "../language/Conjunction.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import { Terms } from "../language/Terms.ts";
import { SetExt } from "../language/SetExt.ts";
import { SetInt } from "../language/SetInt.ts";
import { ImageExt } from "../language/ImageExt.ts";
import { ImageInt } from "../language/ImageInt.ts";
import { Statement } from "../language/Statement.ts";
import { IntersectionExt } from "../language/IntersectionExt.ts";
import { IntersectionInt } from "../language/IntersectionInt.ts";
import { DifferenceExt } from "../language/DifferenceExt.ts";
import { DifferenceInt } from "../language/DifferenceInt.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { Instance } from "../language/Instance.ts";
import { Property } from "../language/Property.ts";
import { InstanceProperty } from "../language/InstanceProperty.ts";
import { Negation } from "../language/Negation.ts";
import { Disjunction } from "../language/Disjunction.ts";
import { Implication } from "../language/Implication.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Similarity } from "../language/Similarity.ts";
import { BudgetFunctions } from "../inference/BudgetFunctions.ts";
import { CompositionalRules } from "../inference/CompositionalRules.ts";
import { TruthFunctions } from "../inference/TruthFunctions.ts";
import { TemporalInferenceControl } from "../control/TemporalInferenceControl.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Nar } from "../main/Nar.ts";

const NativeOperator = Symbols.NativeOperator;
const BUDGET_VALUE_MARK = Symbols.BUDGET_VALUE_MARK;
const TRUTH_VALUE_MARK = Symbols.TRUTH_VALUE_MARK;
const VALUE_SEPARATOR = Symbols.VALUE_SEPARATOR;
const JUDGMENT_MARK = Symbols.JUDGMENT_MARK;
const QUESTION_MARK = Symbols.QUESTION_MARK;
const GOAL_MARK = Symbols.GOAL_MARK;
const QUEST_MARK = Symbols.QUEST_MARK;
const ARGUMENT_SEPARATOR = Symbols.ARGUMENT_SEPARATOR;
const COMPOUND_TERM_OPENER = NativeOperator.COMPOUND_TERM_OPENER;
const COMPOUND_TERM_CLOSER = NativeOperator.COMPOUND_TERM_CLOSER;
const SET_EXT_OPENER = NativeOperator.SET_EXT_OPENER;
const SET_EXT_CLOSER = NativeOperator.SET_EXT_CLOSER;
const SET_INT_OPENER = NativeOperator.SET_INT_OPENER;
const SET_INT_CLOSER = NativeOperator.SET_INT_CLOSER;
const STATEMENT_OPENER = NativeOperator.STATEMENT_OPENER;
const STATEMENT_CLOSER = NativeOperator.STATEMENT_CLOSER;
const getOperator = (value: string) => Symbols.getOperator(value);
const getRelation = (value: string) => Symbols.getRelation(value);
const getOpener = (value: string) => Symbols.getOpener(value);
const getCloser = (value: string) => Symbols.getCloser(value);
const isRelation = (value: string) => Symbols.isRelation(value);

Terms.registerRuntime({
    SetExt,
    SetInt,
    IntersectionExt,
    IntersectionInt,
    DifferenceExt,
    DifferenceInt,
    Inheritance,
    Instance,
    Property,
    InstanceProperty,
    Product,
    ImageExt,
    ImageInt,
    Negation,
    Disjunction,
    Conjunction,
    Implication,
    Equivalence,
});

Statement.registerRuntime({
    Inheritance,
    Instance,
    Property,
    InstanceProperty,
    Similarity,
    Implication,
    Equivalence,
});

// Keep the inference-rule layer from importing language subclasses during
// module initialization. All runtime classes are ready at this parser boundary.
TemporalRules.registerRuntime({
    BudgetFunctions,
    CompositionalRules,
    Conjunction,
    Equivalence,
    Implication,
    Inheritance,
    Interval,
    Similarity,
    Statement,
    TemporalInferenceControl,
    TruthFunctions,
});



/**
 * Utility methods for working and reacting to Narsese input.
 * This will eventually be integrated with NarseseParser for systematic
 * parsing and prediction of input.
 *
 * @author Patrick Hammer
 */
export class Narsese extends JavaObject implements java.io.Serializable, Parser {

    public readonly memory: Memory;

    public constructor(memory: Memory);

    public constructor(n: Nar);
    public constructor(...args: unknown[]) {
        if (args.length !== 1 || args[0] === null) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        const value = args[0] as Memory | Nar;
        super();
        this.memory = (value as Nar).memory ?? value as Memory;
    }


    /**
     * Enter a new Task in String into the memory, called from InputWindow or
     * locally.
     *
     * @param s the single-line addInput String
     * @return An experienced task
     */
    public parseTask(s: java.lang.String): Task {
        let buffer: java.lang.StringBuilder = new java.lang.StringBuilder(s);

        let budgetString: java.lang.String = Narsese.getBudgetString(buffer);
        let truthString: java.lang.String = Narsese.getTruthString(buffer);
        let tense: Tense = Narsese.parseTense(buffer);
        let str: java.lang.String = buffer.toString().trim();
        let last: int = str.length() - 1;
        let punc: char = String.fromCharCode(str.charAt(last)) as unknown as char;

        let stamp: Stamp = new Stamp(-1 /* if -1, will be set right before the Task is input */,
            tense, this.memory.newStampSerial(), this.memory.narParameters.DURATION);

        let truth: TruthValue = this.parseTruth(truthString, punc);
        let content: Term = this.parseTerm(str.substring(0, last));
        if (content === null)
            throw new Parser.InvalidInputException("Content term missing");

        let sentence: Sentence = new Sentence(
            content,
            punc,
            truth,
            stamp);

        // if ((content instanceof Conjunction) &&
        // Variable.containVarDep(content.getName())) {
        // sentence.setRevisible(false);
        // }
        let budget: BudgetValue = this.parseBudget(budgetString, punc, truth);
        return new Task(sentence, budget, Task.EnumType.INPUT);
    }

    /* ---------- react values ---------- */
    /**
     * Return the prefix of a task symbol that contains a BudgetValue
     *
     * @param s the addInput in a StringBuilder
     * @return a String containing a BudgetValue
     *
     * @throws Parser.InvalidInputException if the addInput cannot be parsed into a
     *                                      BudgetValue
     */
    private static getBudgetString(s: java.lang.StringBuilder): java.lang.String {
        if (s.length() === 0 || String.fromCharCode(s.charAt(0)) !== BUDGET_VALUE_MARK) {
            return null;
        }
        let i: int = s.indexOf(BUDGET_VALUE_MARK, 1); // looking for the end
        if (i < 0) {
            throw new Parser.InvalidInputException("missing budget closer");
        }
        let budgetString: java.lang.String = s.substring(1, i).trim();
        if (budgetString.length() === 0) {
            throw new Parser.InvalidInputException("empty budget");
        }
        s.delete(0, i + 1);
        return budgetString;
    }

    /**
     * Return the postfix of a task symbol that contains a TruthValue
     *
     * @return a String containing a TruthValue
     * @param s the addInput in a StringBuilder
     *
     * @throws Parser.InvalidInputException if the addInput cannot be parsed into a
     *                                      TruthValue
     */
    private static getTruthString(s: java.lang.StringBuilder): java.lang.String {
        let last: int = s.length() - 1;
        if (s.length() === 0 || String.fromCharCode(s.charAt(last)) !== TRUTH_VALUE_MARK) { // use default
            return null;
        }
        let first: int = s.indexOf(TRUTH_VALUE_MARK); // looking for the beginning
        if (first === last) { // no matching closer
            throw new Parser.InvalidInputException("missing truth mark");
        }
        let truthString: java.lang.String = s.substring(first + 1, last).trim();
        if (truthString.length() === 0) { // empty usage
            throw new Parser.InvalidInputException("empty truth");
        }
        s.delete(first, last + 1); // remaining addInput to be processed outside
        s.trimToSize();
        return truthString;
    }

    /**
     * react the addInput String into a TruthValue (or DesireValue)
     *
     * @param s    addInput String
     * @param type Task type
     * @return the addInput TruthValue
     */
    private parseTruth(s: java.lang.String, type: char): TruthValue {
        if ((type === QUESTION_MARK) || (type === QUEST_MARK)) {
            return null;
        }
        let frequency: float = 1.0;
        let confidence: float = this.memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE;
        if (type === GOAL_MARK) {
            confidence = this.memory.narParameters.DEFAULT_GOAL_CONFIDENCE;
        }
        if (s !== null) {
            let i: int = s.indexOf(VALUE_SEPARATOR.charCodeAt(0));
            if (i < 0) {
                frequency = Number.parseFloat(String(s));
            } else {
                frequency = Number.parseFloat(String(s.substring(0, i)));
                confidence = Number.parseFloat(String(s.substring(i + 1)));
            }
        }
        return TruthValue.fromFrequencyConfidence(frequency, confidence, this.memory.narParameters);
    }

    /**
     * react the addInput String into a BudgetValue
     *
     * @param truth       the TruthValue of the task
     * @param s           addInput String
     * @param punctuation Task punctuation
     * @return the addInput BudgetValue
     * @throws Parser.InvalidInputException If the String cannot be parsed into a
     *                                      BudgetValue
     */
    private parseBudget(s: java.lang.String, punctuation: char, truth: TruthValue): BudgetValue {
        let priority: float;
        let durability: float;
        switch (punctuation) {
            case JUDGMENT_MARK:
                priority = this.memory.narParameters.DEFAULT_JUDGMENT_PRIORITY;
                durability = this.memory.narParameters.DEFAULT_JUDGMENT_DURABILITY;
                break;
            case QUESTION_MARK:
                priority = this.memory.narParameters.DEFAULT_QUESTION_PRIORITY;
                durability = this.memory.narParameters.DEFAULT_QUESTION_DURABILITY;
                break;
            case GOAL_MARK:
                priority = this.memory.narParameters.DEFAULT_GOAL_PRIORITY;
                durability = this.memory.narParameters.DEFAULT_GOAL_DURABILITY;
                break;
            case QUEST_MARK:
                priority = this.memory.narParameters.DEFAULT_QUEST_PRIORITY;
                durability = this.memory.narParameters.DEFAULT_QUEST_DURABILITY;
                break;
            default:
                throw new Parser.InvalidInputException("unknown punctuation: '" + punctuation + "'");
        }
        if (s !== null) { // override default
            let i: int = s.indexOf(VALUE_SEPARATOR.charCodeAt(0));
            if (i < 0) { // default durability
                priority = Number.parseFloat(String(s));
            } else {
                let i2: int = s.indexOf(VALUE_SEPARATOR.charCodeAt(0), i + 1);
                if (i2 === -1)
                    i2 = s.length();
                priority = Number.parseFloat(String(s.substring(0, i)));
                durability = Number.parseFloat(String(s.substring(i + 1, i2)));
            }
        }
        let quality: float = (truth === null) ? 1 : BudgetFunctions.truthToQuality(truth);
        return new BudgetValue(priority, durability, quality, this.memory.narParameters);
    }

    /**
     * Recognize the tense of an addInput sentence
     *
     * @param s the addInput in a StringBuilder
     * @return a tense value
     */
    public static parseTense(s: java.lang.StringBuilder): Tense {
        let i: int = s.indexOf(Symbols.TENSE_MARK);
        let t: java.lang.String = "";
        if (i > 0) {
            t = s.substring(i).trim();
            s.delete(i, s.length());
        }
        return Tense.tense(t);
    }

    /* ---------- react String into term ---------- */
    /**
     * Top-level method that react a Term in general, which may recursively call
     * itself.
     * <p>
     * There are 5 valid cases: 1. (Op, A1, ..., An) is a CompoundTerm if Op is
     * a built-in getOperator 2. {A1, ..., An} is an SetExt; 3. [A1, ..., An] is an
     * SetInt; 4. <T1 Re T2> is a Statement (including higher-order
     * Statement);
     * 5. otherwise it is a simple term.
     *
     * @param s the String to be parsed
     * @return the Term generated from the String
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    public parseTerm(s: java.lang.String): Term {
        s = s.trim();

        if (s.length() === 0)
            return null;

        let index: int = s.length() - 1;
        let first: char = String.fromCharCode(s.charAt(0)) as unknown as char;
        let last: char = String.fromCharCode(s.charAt(index)) as unknown as char;

        let opener: NativeOperator = getOpener(first);
        if (opener !== null) {
            switch (opener) {
                case COMPOUND_TERM_OPENER:
                    if (last === COMPOUND_TERM_CLOSER.ch) {
                        return this.parseCompoundTerm(s.substring(1, index));
                    } else {
                        throw new Parser.InvalidInputException("missing CompoundTerm closer");
                    }
                case SET_EXT_OPENER:
                    if (last === SET_EXT_CLOSER.ch) {
                        return SetExt.make(this.parseArguments(new java.lang.String(String(s.substring(1, index)) + ARGUMENT_SEPARATOR)));
                    } else {
                        throw new Parser.InvalidInputException("missing ExtensionSet closer");
                    }
                case SET_INT_OPENER:
                    if (last === SET_INT_CLOSER.ch) {
                        return SetInt.make(this.parseArguments(new java.lang.String(String(s.substring(1, index)) + ARGUMENT_SEPARATOR)));
                    } else {
                        throw new Parser.InvalidInputException("missing IntensionSet closer");
                    }
                case STATEMENT_OPENER:
                    if (last === STATEMENT_CLOSER.ch) {
                        return this.parseStatement(s.substring(1, index));
                    } else {
                        throw new Parser.InvalidInputException("missing Statement closer");
                    }
                default: // ! 📌【2025-08-25 23:36:31】还有其它一些类型没被解析
                    throw new Parser.InvalidInputException("unknown opener");
            }
        } else {

            // parse functional operation:
            // function()
            // function(a)
            // function(a,b)

            // test for existence of matching parentheses at beginning at index!=0
            let pOpen: int = s.indexOf('('.charCodeAt(0));
            let pClose: int = s.lastIndexOf(')'.charCodeAt(0));
            if ((pOpen !== -1) && (pClose !== -1) && (pClose === s.length() - 1)) {

                let operatorString: java.lang.String = Operator.addPrefixIfMissing(s.substring(0, pOpen));

                let operator: Operator = this.memory.getOperator(operatorString);

                if (operator === null) {
                    // ???
                    throw new Parser.InvalidInputException("Unknown operator: " + operatorString);
                }

                let argString: java.lang.String = s.substring(pOpen + 1, pClose + 1);

                let a: Term[];
                if (argString.length() > 1) {
                    let args: java.util.List<Term> = this.parseArguments(argString);
                    a = args.toArray(new Array<Term>(0));
                } else {
                    // void "()" arguments, default to (SELF)
                    a = Operation.SELF_TERM_ARRAY;
                }

                let o: Operation = Operation.make(operator, a, true);
                return o;
            }
        }

        // if no opener, parse the term
        return this.parseAtomicTerm(s);

    }

    // private static void showWarning(String message) {
    // new TemporaryFrame( message + "\n( the faulty line has been kept in the
    // addInput window )",
    // 40000, TemporaryFrame.WARNING );
    // }
    /**
     * Parse a term that has no internal structure.
     * <p>
     * The term can be a constant or a variable.
     *
     * @param s0 the String to be parsed
     * @return the Term generated from the String
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    private parseAtomicTerm(s0: java.lang.String): Term {
        let s: java.lang.String = s0.trim();
        if (s.length() === 0) {
            throw new Parser.InvalidInputException("missing term");
        }

        let op: Operator = this.memory.getOperator(s0);
        if (op !== null) {
            return op;
        }

        if (s.indexOf(" ".charCodeAt(0)) >= 0) { // invalid characters in a name
            throw new Parser.InvalidInputException("invalid term: " + s);
        }

        let c: char = s.charAt(0);
        // jree's Java String charAt boundary is not a native JS string value.
        // Normalize it before comparing with the wire-level interval prefix.
        if (String.fromCharCode(Number(c)) === Symbols.INTERVAL_PREFIX) {
            return Interval.interval(s);
        }

        if (Variables.containVar(s) && !s.equals("#")) {
            return new Variable(s);
        } else {
            return Term.get(s);
        }
    }

    /**
     * Parse a string to create a statement.
     *
     * @return the statement generated from the string
     * @param s0 The addInput String to be parsed
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    private parseStatement(s0: java.lang.String): Statement {
        let s: java.lang.String = s0.trim();
        let i: int = Narsese.topRelation(s);
        if (i < 0) {
            throw new Parser.InvalidInputException("invalid statement: topRelation(s) < 0");
        }
        let relation: java.lang.String = s.substring(i, i + 3);
        let subject: Term = this.parseTerm(s.substring(0, i));
        let predicate: Term = this.parseTerm(s.substring(i + 3));
        let t: Statement = Statement.make(getRelation(relation), subject, predicate, false, 0);
        if (t === null) {
            throw new Parser.InvalidInputException("invalid statement: statement unable to create: "
                + getOperator(relation) + " " + subject + " " + predicate);
        }
        return t;
    }

    /**
     * Parse a String to create a CompoundTerm.
     *
     * @return the Term generated from the String
     * @param s0 The String to be parsed
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    private parseCompoundTerm(s0: java.lang.String): Term {
        let s: java.lang.String = s0.trim();
        if (s.isEmpty()) {
            throw new Parser.InvalidInputException("Empty compound term: " + s);
        }
        let firstSeparator: int = s.indexOf(ARGUMENT_SEPARATOR.charCodeAt(0));
        if (firstSeparator === -1) {
            throw new Parser.InvalidInputException("Invalid compound term (missing ARGUMENT_SEPARATOR): " + s);
        }

        let op: java.lang.String = (firstSeparator < 0) ? s : s.substring(0, firstSeparator).trim();
        let oNative: NativeOperator = getOperator(op);
        let oRegistered: Operator = this.memory.getOperator(op);

        if ((oRegistered === null) && (oNative === null)) {
            throw new Parser.InvalidInputException("Unknown operator: " + op);
        }

        let arg: java.util.List<Term> = (firstSeparator < 0) ? new java.util.ArrayList(0)
            : this.parseArguments(new java.lang.String(String(s.substring(firstSeparator + 1)) + ARGUMENT_SEPARATOR));

        let argA: Term[] = arg.toArray(new Array<Term>(0));

        let t: Term;

        if (oNative !== null) {
            if (oNative === NativeOperator.IMAGE_EXT) {
                t = ImageExt.make(argA);
            } else if (oNative === NativeOperator.IMAGE_INT) {
                t = ImageInt.make(argA);
            } else if (oNative === NativeOperator.PRODUCT) {
                t = new Product(...argA);
            } else if (oNative === NativeOperator.CONJUNCTION) {
                t = Conjunction.make(argA);
            } else if (oNative === NativeOperator.SEQUENCE) {
                t = Conjunction.make(argA, TemporalRules.ORDER_FORWARD);
            } else if (oNative === NativeOperator.PARALLEL) {
                t = Conjunction.make(argA, TemporalRules.ORDER_CONCURRENT);
            } else if (oNative === NativeOperator.SPATIAL) {
                t = Conjunction.make(argA, TemporalRules.ORDER_FORWARD, true);
            } else {
                t = Terms.term(oNative, argA);
            }
        } else if (oRegistered !== null) {
            t = Operation.make(oRegistered, argA, true);
        } else {
            throw new Parser.InvalidInputException("Invalid compound term");
        }

        return t;
    }

    /**
     * Parse a String into the argument get of a CompoundTerm.
     *
     * @return the arguments in an List
     * @param s0 The String to be parsed
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    private parseArguments(s0: java.lang.String): java.util.List<Term> {
        let s: java.lang.String = s0.trim();
        let list: java.util.List<Term> = new java.util.ArrayList();
        let start: int = 0;
        let end: int = 0;
        let t: Term;
        while (end < s.length() - 1) {
            end = Narsese.nextSeparator(s, start);
            if (end === start)
                break;
            t = this.parseTerm(s.substring(start, end)); // recursive call
            list.add(t);
            start = end + 1;
        }
        if (list.isEmpty()) {
            throw new Parser.InvalidInputException("null argument");
        }
        return list;
    }

    /* ---------- locate top-level substring ---------- */
    /**
     * Locate the first top-level separator in a CompoundTerm
     *
     * @return the index of the next seperator in a String
     * @param s     The String to be parsed
     * @param first The starting index
     */
    private static nextSeparator(s: java.lang.String, first: int): int {
        let levelCounter: int = 0;
        let i: int = first;
        while (i < s.length() - 1) {
            if (Narsese.isOpener(s, i)) {
                levelCounter++;
            } else if (Narsese.isCloser(s, i)) {
                levelCounter--;
            } else if (String.fromCharCode(s.charAt(i)) === ARGUMENT_SEPARATOR) {
                if (levelCounter === 0) {
                    break;
                }
            }
            i++;
        }
        return i;
    }

    /**
     * locate the top-level getRelation in a statement
     *
     * @return the index of the top-level getRelation
     * @param s The String to be parsed
     */
    private static topRelation(s: java.lang.String): int { // need efficiency improvement
        let levelCounter: int = 0;
        let i: int = 0;
        while (i < s.length() - 3) { // don't need to check the last 3 characters
            if ((levelCounter === 0) && (isRelation(s.substring(i, i + 3)))) {
                return i;
            }
            if (Narsese.isOpener(s, i)) {
                levelCounter++;
            } else if (Narsese.isCloser(s, i)) {
                levelCounter--;
            }
            i++;
        }
        return -1;
    }

    /* ---------- recognize symbols ---------- */
    /**
     * Check CompoundTerm opener symbol
     *
     * @return if the given String is an opener symbol
     * @param s The String to be checked
     * @param i The starting index
     */
    private static isOpener(s: java.lang.String, i: int): boolean {
        let c: char = String.fromCharCode(s.charAt(i)) as unknown as char;

        let b: boolean = (getOpener(c) !== null);
        if (!b)
            return false;

        return i + 3 > s.length() || !isRelation(s.substring(i, i + 3));
    }

    /**
     * Check CompoundTerm closer symbol
     *
     * @return if the given String is a closer symbol
     * @param s The String to be checked
     * @param i The starting index
     */
    private static isCloser(s: java.lang.String, i: int): boolean {
        let c: char = String.fromCharCode(s.charAt(i)) as unknown as char;

        let b: boolean = (getCloser(c) !== null);
        if (!b)
            return false;

        return i < 2 || !isRelation(s.substring(i - 2, i + 1));
    }

    /**
     * @param s string to get checked if it may be narsese
     * @return returns if the string may be narsese
     */
    public static possiblyNarsese(s: java.lang.String): boolean {
        const native = String(s);
        return !native.includes("(") && !native.includes(")") && !native.includes("<") && !native.includes(">");
    }
}
