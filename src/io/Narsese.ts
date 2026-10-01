//! Java source: opennars/io/Narsese.java
import type { int, float, long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { textValue } from "../runtime/Text.ts";
import type { TextInput } from "../runtime/Text.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
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
import type { TextCharacter } from "../runtime/Text.ts";
import { CompositionalRules } from "../inference/CompositionalRules.ts";
import { TruthFunctions } from "../inference/TruthFunctions.ts";
import { TemporalInferenceControl } from "../control/TemporalInferenceControl.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Nar } from "../main/Nar.ts";

const NativeOperator = Symbols.NativeOperator;
type NativeOperator = Symbols.NativeOperator;
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
const getOperator = (value: string) => Symbols.getOperator(textValue(value));
const getRelation = (value: string) => Symbols.getRelation(textValue(value));
const getOpener = (value: string) => Symbols.getOpener(textValue(value));
const getCloser = (value: string) => Symbols.getCloser(textValue(value));
const isRelation = (value: string) => Symbols.isRelation(textValue(value));

/**
 * Minimal UTF-16 mutable buffer used by the parser's prefix/suffix passes.
 * Keeping this local makes the parser independent from jree's StringBuilder
 * while retaining the Java index contract at every mutation boundary.
 */
class Utf16Builder {
    private value: string;

    public constructor(value: TextInput = "") {
        this.value = textValue(value);
    }

    public length(): number {
        return this.value.length;
    }

    public charAt(index: number): number {
        return this.value.charCodeAt(index);
    }

    public indexOf(search: string, fromIndex = 0): number {
        return this.value.indexOf(search, fromIndex);
    }

    public substring(start: number, end?: number): string {
        return this.value.substring(start, end);
    }

    public delete(start: number, end: number): this {
        this.value = this.value.slice(0, start) + this.value.slice(end);
        return this;
    }

    public trimToSize(): this {
        return this;
    }

    public toString(): string {
        return this.value;
    }
}

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
// Java original type: public class Narsese implements Serializable, Parser; no superclass.
// Serializable is a Java marker; the jree TypeScript interface also requires reflection methods.
export class Narsese implements Parser {

    public readonly memory: Memory;

    public constructor(memory: Memory);

    public constructor(n: Nar);
    public constructor(...args: unknown[]) {
        if (args.length !== 1 || args[0] === null) {
            throw new ReasonerInputError("Invalid number of arguments");
        }
        const value = args[0] as Memory | Nar;
        this.memory = (value as Nar).memory ?? value as Memory;
    }


    /**
     * Enter a new Task in String into the memory, called from InputWindow or
     * locally.
     *
     * @param s the single-line addInput String
     * @return An experienced task
     */
    public parseTask(s: TextInput): Task {
        const buffer = new Utf16Builder(s);

        const budgetString = Narsese.getBudgetString(buffer);
        const truthString = Narsese.getTruthString(buffer);
        const tense = Narsese.parseTense(buffer);
        const str = buffer.toString().trim();
        let last: int = str.length - 1;
        let punc: TextCharacter = str.charAt(last);

        let stamp: Stamp = new Stamp(-1 as unknown as long /* if -1, will be set right before the Task is input */,
            tense, this.memory.newStampSerial(), this.memory.narParameters.DURATION);

        let truth: TruthValue | null = this.parseTruth(truthString, punc);
        let content: Term | null = this.parseTerm(str.substring(0, last));
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
    private static getBudgetString(s: Utf16Builder): string | null {
        if (s.length() === 0 || String.fromCharCode(s.charAt(0)) !== BUDGET_VALUE_MARK) {
            return null;
        }
        let i: int = s.indexOf(BUDGET_VALUE_MARK, 1); // looking for the end
        if (i < 0) {
            throw new Parser.InvalidInputException("missing budget closer");
        }
        const budgetString = s.substring(1, i).trim();
        if (budgetString.length === 0) {
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
    private static getTruthString(s: Utf16Builder): string | null {
        let last: int = s.length() - 1;
        if (s.length() === 0 || String.fromCharCode(s.charAt(last)) !== TRUTH_VALUE_MARK) { // use default
            return null;
        }
        let first: int = s.indexOf(TRUTH_VALUE_MARK); // looking for the beginning
        if (first === last) { // no matching closer
            throw new Parser.InvalidInputException("missing truth mark");
        }
        const truthString = s.substring(first + 1, last).trim();
        if (truthString.length === 0) { // empty usage
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
    private parseTruth(s: string | null, type: TextCharacter): TruthValue | null {
        if ((type === QUESTION_MARK) || (type === QUEST_MARK)) {
            return null;
        }
        let frequency: float = Math.fround(1.0) as float;
        let confidence: float = Math.fround(this.memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE) as float;
        if (type === GOAL_MARK) {
            confidence = Math.fround(this.memory.narParameters.DEFAULT_GOAL_CONFIDENCE) as float;
        }
        if (s !== null) {
            let i: int = s.indexOf(VALUE_SEPARATOR);
            if (i < 0) {
                frequency = Math.fround(Number.parseFloat(s)) as float;
            } else {
                frequency = Math.fround(Number.parseFloat(s.substring(0, i))) as float;
                confidence = Math.fround(Number.parseFloat(s.substring(i + 1))) as float;
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
    private parseBudget(s: string | null, punctuation: TextCharacter, truth: TruthValue | null): BudgetValue {
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
                throw new Parser.InvalidInputException(`unknown punctuation: '${punctuation}'`);
        }
        if (s !== null) { // override default
            let i: int = s.indexOf(VALUE_SEPARATOR);
            if (i < 0) { // default durability
                priority = Number.parseFloat(s);
            } else {
                let i2: int = s.indexOf(VALUE_SEPARATOR, i + 1);
                if (i2 === -1)
                    i2 = s.length;
                priority = Number.parseFloat(s.substring(0, i));
                durability = Number.parseFloat(s.substring(i + 1, i2));
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
    public static parseTense(s: Utf16Builder): Tense {
        let i: int = s.indexOf(Symbols.TENSE_MARK);
        let t = "";
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
    public parseTerm(s: TextInput): Term | null {
        const text = textValue(s).trim();

        if (text.length === 0)
            return null;

        let index: int = text.length - 1;
        let first: TextCharacter = text.charAt(0);
        let last: TextCharacter = text.charAt(index);

        let opener: NativeOperator | null = getOpener(first);
        if (opener !== null) {
            switch (opener) {
                case COMPOUND_TERM_OPENER:
                    if (last === COMPOUND_TERM_CLOSER.ch) {
                        return this.parseCompoundTerm(text.substring(1, index));
                    } else {
                        throw new Parser.InvalidInputException("missing CompoundTerm closer");
                    }
                case SET_EXT_OPENER:
                    if (last === SET_EXT_CLOSER.ch) {
                        return SetExt.make(this.parseArguments(text.substring(1, index) + ARGUMENT_SEPARATOR));
                    } else {
                        throw new Parser.InvalidInputException("missing ExtensionSet closer");
                    }
                case SET_INT_OPENER:
                    if (last === SET_INT_CLOSER.ch) {
                        return SetInt.make(this.parseArguments(text.substring(1, index) + ARGUMENT_SEPARATOR));
                    } else {
                        throw new Parser.InvalidInputException("missing IntensionSet closer");
                    }
                case STATEMENT_OPENER:
                    if (last === STATEMENT_CLOSER.ch) {
                        return this.parseStatement(text.substring(1, index));
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
            let pOpen: int = text.indexOf('(');
            let pClose: int = text.lastIndexOf(')');
            if ((pOpen !== -1) && (pClose !== -1) && (pClose === text.length - 1)) {

                const operatorString: string = Operator.addPrefixIfMissing(text.substring(0, pOpen));

                let operator: Operator = this.memory.getOperator(operatorString);

                if (operator === null) {
                    // ???
                    throw new Parser.InvalidInputException(`Unknown operator: ${operatorString}`);
                }

                let argString: string = text.substring(pOpen + 1, pClose + 1);

                let a: Term[];
                if (argString.length > 1) {
                    const args: Term[] = this.parseArguments(argString);
                    a = args;
                } else {
                    // void "()" arguments, default to (SELF)
                    a = Operation.SELF_TERM_ARRAY;
                }

                let o: Operation = Operation.make(operator, a, true);
                return o;
            }
        }

        // if no opener, parse the term
        return this.parseAtomicTerm(text);

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
    private parseAtomicTerm(s0: string): Term {
        const s = s0.trim();
        if (s.length === 0) {
            throw new Parser.InvalidInputException("missing term");
        }

        let op: Operator = this.memory.getOperator(s0);
        if (op !== null) {
            return op;
        }

        if (s.indexOf(" ") >= 0) { // invalid characters in a name
            throw new Parser.InvalidInputException(`invalid term: ${s}`);
        }

        let c: TextCharacter = s.charAt(0);
        // jree's Java String charAt boundary is not a native JS string value.
        // Normalize it before comparing with the wire-level interval prefix.
        if (c === Symbols.INTERVAL_PREFIX) {
            return Interval.interval(s);
        }

        if (Variables.containVar(s) && s !== "#") {
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
    private parseStatement(s0: string): Statement {
        const s = s0.trim();
        let i: int = Narsese.topRelation(s);
        if (i < 0) {
            throw new Parser.InvalidInputException("invalid statement: topRelation(s) < 0");
        }
        let relation: string = s.substring(i, i + 3);
        let subject: Term | null = this.parseTerm(s.substring(0, i));
        let predicate: Term | null = this.parseTerm(s.substring(i + 3));
        if (subject === null || predicate === null)
            throw new Parser.InvalidInputException("invalid statement: missing subject or predicate");
        const relationOperator = getRelation(relation);
        if (relationOperator === null)
            throw new Parser.InvalidInputException("invalid statement: relation missing");
        let t: Statement | null = Statement.make(relationOperator, subject, predicate, false, 0);
        if (t === null) {
            throw new Parser.InvalidInputException(`invalid statement: statement unable to create: ${getOperator(relation)} ${subject} ${predicate}`);
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
    private parseCompoundTerm(s0: string): Term {
        const s = s0.trim();
        if (s.length === 0) {
            throw new Parser.InvalidInputException(`Empty compound term: ${s}`);
        }
        let firstSeparator: int = s.indexOf(ARGUMENT_SEPARATOR);
        if (firstSeparator === -1) {
            throw new Parser.InvalidInputException(`Invalid compound term (missing ARGUMENT_SEPARATOR): ${s}`);
        }

        let op: string = (firstSeparator < 0) ? s : s.substring(0, firstSeparator).trim();
        let oNative: NativeOperator | null = getOperator(op);
        let oRegistered: Operator = this.memory.getOperator(op);

        if ((oRegistered === null) && (oNative === null)) {
            throw new Parser.InvalidInputException(`Unknown operator: ${op}`);
        }

        const arg: Term[] = (firstSeparator < 0) ? []
            : this.parseArguments(s.substring(firstSeparator + 1) + ARGUMENT_SEPARATOR);

        const argA: Term[] = arg;

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
     * @return the arguments in an array
     * @param s0 The String to be parsed
     *
     * @throws Parser.InvalidInputException if the String couldn't get parsed to a
     *                                      term
     */
    private parseArguments(s0: string): Term[] {
        const s = s0.trim();
        const list: Term[] = [];
        let start: int = 0;
        let end: int = 0;
        let t: Term;
        while (end < s.length - 1) {
            end = Narsese.nextSeparator(s, start);
            if (end === start)
                break;
            const parsed = this.parseTerm(s.substring(start, end)); // recursive call
            if (parsed === null)
                throw new Parser.InvalidInputException("null argument");
            list.push(parsed);
            start = end + 1;
        }
        if (list.length === 0) {
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
    private static nextSeparator(s: string, first: int): int {
        let levelCounter: int = 0;
        let i: int = first;
        while (i < s.length - 1) {
            if (Narsese.isOpener(s, i)) {
                levelCounter++;
            } else if (Narsese.isCloser(s, i)) {
                levelCounter--;
            } else if (s.charAt(i) === ARGUMENT_SEPARATOR) {
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
    private static topRelation(s: string): int { // need efficiency improvement
        let levelCounter: int = 0;
        let i: int = 0;
        while (i < s.length - 3) { // don't need to check the last 3 characters
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
    private static isOpener(s: string, i: int): boolean {
        let c: TextCharacter = s.charAt(i);

        let b: boolean = (getOpener(c) !== null);
        if (!b)
            return false;

        return i + 3 > s.length || !isRelation(s.substring(i, i + 3));
    }

    /**
     * Check CompoundTerm closer symbol
     *
     * @return if the given String is a closer symbol
     * @param s The String to be checked
     * @param i The starting index
     */
    private static isCloser(s: string, i: int): boolean {
        let c: TextCharacter = s.charAt(i);

        let b: boolean = (getCloser(c) !== null);
        if (!b)
            return false;

        return i < 2 || !isRelation(s.substring(i - 2, i + 1));
    }

    /**
     * @param s string to get checked if it may be narsese
     * @return returns if the string may be narsese
     */
    public static possiblyNarsese(s: TextInput): boolean {
        const native = textValue(s);
        return !native.includes("(") && !native.includes(")") && !native.includes("<") && !native.includes(">");
    }
}
