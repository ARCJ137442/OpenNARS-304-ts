//! Java source: opennars/entity/Sentence.java
import type { int, long, float, double } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Texts } from "../io/Texts.ts";
import { javaObjectsHash } from "../runtime/JavaArrays.ts";
import { Symbols } from "../io/Symbols.ts";
import { Term } from "../language/Term.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Conjunction } from "../language/Conjunction.ts";
import { Statement } from "../language/Statement.ts";
import { Implication } from "../language/Implication.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Interval } from "../language/Interval.ts";
import { Variable } from "../language/Variable.ts";
import { Stamp } from "./Stamp.ts";
import { TruthValue } from "./TruthValue.ts";
import { Debug } from "../main/Debug.ts";
import { TruthFunctions } from "../inference/TruthFunctions.ts";
import { TemporalRules } from "../inference/TemporalRules.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Nar } from "../main/Nar.ts";
import type { Parameters } from "../main/Parameters.ts";
import { javaStringValue, javaStringsEqual } from "../runtime/java-text.ts";
import { addRuntimeLongValues, subtractRuntimeLongValues } from "../runtime/java-values.ts";
import { toJavaString } from "../runtime/java-text.ts";
import type { JavaChar, JavaCharSequence, JavaString } from "../runtime/java-text.ts";
import { JavaAssertionError, JavaIllegalArgumentException, JavaIllegalStateException } from "../runtime/JavaExceptions.ts";
import { RuntimeObject } from "../runtime/RuntimeClass.ts";

class SentenceStringBuilder {
    private value = "";

    public append(value: string): this {
        this.value += value;
        return this;
    }

    public toString(): string {
        return this.value;
    }
}



/**
 * Sentence as defined by the NARS-theory
 *
 * A Sentence is used as the premises and conclusions of all inference rules.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
// Java 原始声明：public class Sentence implements Cloneable, Serializable。
// Sentence 自身承载值相等、哈希和 clone；RuntimeObject 只替换无行为的类身份壳。
export class Sentence extends RuntimeObject {

    public producedByTemporalInduction: boolean = false;

    /**
     * The content of a Sentence is a Term
     */
    public readonly term: Term;

    /**
     * The punctuation indicates the type of the Sentence:
     * Judgment '.', Question '?', Goal '!', or Quest '@'
     */
    public readonly punctuation: JavaChar;

    /**
     * The truth value of Judgment, or desire value of Goal
     */
    // Java permits null here for questions and quests; judgments and goals are
    // checked in the constructor before inference consumes the value.
    public readonly truth: TruthValue | null;

    /**
     * Partial record of the derivation path
     */
    public readonly stamp: Stamp;

    /**
     * Whether the sentence can be revised
     */
    private revisable: boolean;

    /**
     * caches the 'getKey()' result
     */
    private key: string | null = null;

    private hash: int = 0;

    public constructor(term: Term, punctuation: JavaChar, newTruth: TruthValue | null, newStamp: Stamp);

    /**
     * Create a Sentence with the given fields
     *
     * @param _content    The Term that forms the content of the sentence
     * @param punctuation The punctuation indicating the type of the sentence
     * @param truth       The truth value of the sentence, null for question
     * @param stamp       The stamp of the sentence indicating its derivation time
     *                    and
     *                    base
     */
    public constructor(_content: Term, punctuation: JavaChar, truth: TruthValue | null, stamp: Stamp,
        normalize: boolean);
    public constructor(...args: unknown[]) {
        let _content: Term;
        let punctuation: JavaChar;
        let truth: TruthValue | null;
        let stamp: Stamp;
        let normalize: boolean;
        if (args.length === 4) {
            [_content, punctuation, truth, stamp] = args as [Term, JavaChar, TruthValue | null, Stamp];
            normalize = true;
        } else if (args.length === 5) {
            [_content, punctuation, truth, stamp, normalize] = args as [Term, JavaChar, TruthValue | null, Stamp, boolean];
        } else {
            throw new JavaIllegalArgumentException("Invalid number of arguments");
        }



                // cut interval at end for sentence in serial conjunction, and inbetween for
                // parallel
                super();
                if (punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                    if (_content instanceof Conjunction) {
                        let c: Conjunction = _content as Conjunction;
                        if (c.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                            if (c.term[c.term.length - 1] instanceof Interval) {
                                let time: number = 0;
                                // refined:
                                let u: int = 0;
                                while (c.term.length - 1 - u >= 0 && c.term[c.term.length - 1 - u] instanceof Interval) {
                                    time += Number((c.term[c.term.length - 1 - u] as Interval).time);
                                    u++;
                                }

                                let term2: Term[] = new Array<Term>(c.term.length - u);
                                term2 = c.term.slice(0, term2.length);
                                _content = Conjunction.make(term2, c.getTemporalOrder(), c.isSpatial);
                                // ok we removed a part of the interval, we have to transform the occurence time
                                // of the sentence back
                                // accordingly

                                if (!c.isSpatial && stamp !== null && stamp.getOccurrenceTime() !== Stamp.ETERNAL)
                                    stamp.setOccurrenceTime(subtractRuntimeLongValues(stamp.getOccurrenceTime(), time));
                            }
                            if (c.term[0] instanceof Interval) {
                                let time: number = 0;
                                // refined:
                                let u: int = 0;
                                while (u < c.term.length && (c.term[u] instanceof Interval)) {
                                    time += Number((c.term[u] as Interval).time);
                                    u++;
                                }

                                let term2: Term[] = new Array<Term>(c.term.length - u);
                                term2 = c.term.slice(u, u + term2.length);
                                _content = Conjunction.make(term2, c.getTemporalOrder(), c.isSpatial);
                                // ok we removed a part of the interval, we have to transform the occurence time
                                // of the sentence back
                                // accordingly

                                if (!c.isSpatial && stamp !== null && stamp.getOccurrenceTime() !== Stamp.ETERNAL)
                                    stamp.setOccurrenceTime(addRuntimeLongValues(stamp.getOccurrenceTime(), time));
                            }
                        }
                    }
                }

                this.punctuation = punctuation;

                if (truth !== null) {
                    if (_content instanceof Implication || _content instanceof Equivalence) {
                        if ((_content as Statement).getSubject().hasVarIndep()
                            && !(_content as Statement).getPredicate().hasVarIndep())
                            truth.confidence = 0.0;
                        if ((_content as Statement).getPredicate().hasVarIndep()
                            && !(_content as Statement).getSubject().hasVarIndep())
                            truth.confidence = 0.0; // TODO:
                    } else if (_content instanceof Interval && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        truth.confidence = 0.0; // do it that way for now, because else further inference is interrupted.
                        if (Debug.DETAILED && Debug.DETAILED_SENTENCES)
                            throw new JavaIllegalStateException(
                                "Sentence content must not be Interval: " + _content + punctuation + " " + stamp);
                    }

                    if ((!this.isQuestion() && !this.isQuest()) && (truth === null)
                        && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        throw new JavaIllegalStateException("Judgment and Goal sentences require non-null truth value");
                    }

                    if (_content.subjectOrPredicateIsIndependentVar()
                        && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        truth.confidence = 0.0; // do it that way for now, because else further inference is interrupted.
                        if (Debug.DETAILED && Debug.DETAILED_SENTENCES)
                            throw new JavaIllegalStateException(
                                "A statement sentence is not allowed to have a independent variable as subj or pred");
                    }

                    if (Debug.DETAILED && Debug.DETAILED_SENTENCES && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        if (!Term.valid(_content)) {
                            let ntc: CompoundTerm.UnableToCloneException = new CompoundTerm.UnableToCloneException(
                                "Invalid term discovered " + _content);
                            ntc.printStackTrace();
                            throw ntc;
                        }
                    }
                }

                if ((this.isQuestion() || this.isQuest()) && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK
                    && stamp !== null && !stamp.isEternal()) {
                    stamp.setEternal();
                    // throw new IllegalStateException("Questions and Quests require eternal
                    // tense");
                }

                this.truth = truth;
                this.stamp = stamp;
                this.revisable = _content instanceof Implication || _content instanceof Equivalence || !(_content.hasVarDep());

                let newTerm: Term | null = null;
                if (_content instanceof CompoundTerm)
                    newTerm = (_content as CompoundTerm).cloneDeepVariables();

                // Variable name normalization
                // TODO move this to Concept method, like cloneNormalized()
                if (newTerm !== null && normalize && _content.hasVar() && (!(_content as CompoundTerm).isNormalized())) {

                    this.term = newTerm;
                    let c: CompoundTerm = this.term as CompoundTerm;
                    // Keep duplicates and traversal order; this is a short-lived normalization snapshot,
                    // so a native array avoids a jree list without changing the rename pass.
                    let vars: Variable[] = [];

                    c.recurseSubtermsContainingVariables((t, parent) => {
                        if (t instanceof Variable) {
                            let v: Variable = (t as Variable);
                            vars.push(v);
                        }
                    });

                    // Java's normalization table uses only the variable-name text
                    // as its key; retain the mapped Java CharSequence as the value
                    // so duplicate variables share the same generated object.
                    let rename: Map<string, JavaCharSequence> = new Map();
                    let renamed: boolean = false;

                    for (let v of vars) {
                        let vname: JavaCharSequence = v.name();
                        if (!v.hasVarIndep())
                            vname = toJavaString(`${javaStringValue(vname)} ${javaStringValue(v.getScope().name())}`);
                        const renameKey = javaStringValue(vname);
                        let n: JavaCharSequence | null = rename.get(renameKey) ?? null;
                        if (n == null) {
                            // type + id
                            n = Variable.getName(v.getType(), rename.size + 1);
                            rename.set(renameKey, n);
                            if (!javaStringsEqual(n, vname))
                                renamed = true;
                        }

                        v.setScope(c, n);
                    }

                    if (renamed) {
                        c.invalidateName();

                        if (Debug.DETAILED && Debug.DETAILED_SENTENCES) {
                            if (!Term.valid(c)) {
                                let ntc: CompoundTerm.UnableToCloneException = new CompoundTerm.UnableToCloneException(
                                    "Invalid term discovered after normalization: " + c + " ; prior to normalization: "
                                    + _content);
                                ntc.printStackTrace();
                                throw ntc;
                            }
                        }

                    }
                    c.setNormalized(true);
                } else {
                    this.term = _content;
                }
                this.refreshHash();

    }


    protected isNotTermlinkNormalizer(): boolean {
        return this.punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK;
    }

    /**
     * To check whether two sentences are equal
     *
     * @param that The other sentence
     * @return Whether the two sentences have the same content
     */
    public override equals(that: unknown): boolean {
        if (this === that)
            return true;
        if (that instanceof Sentence) {
            let t: Sentence = that as Sentence;

            if (this.hash !== t.hash)
                return false;

            if (this.punctuation !== t.punctuation)
                return false;
            if (this.isNotTermlinkNormalizer()) {
                if (this.stamp.getOccurrenceTime() !== t.stamp.getOccurrenceTime())
                    return false;
            }

            if (this.truth === null) {
                if (t.truth !== null)
                    return false;
            } else if (t.truth === null) {
                return false;
            } else if (!this.truth.equals(t.truth))
                return false;

            if (!this.term.equals(t.term))
                return false;

            if (this.term.term_indices !== null && t.term.term_indices !== null) {
                for (let i: int = 0; i < this.term.term_indices.length; i++) {
                    if (this.term.term_indices[i] !== t.term.term_indices[i]) {
                        return false; // position or scale was different
                    }
                }
            }

            return this.stamp.equals(t.stamp, false, true, true);
        }
        return false;
    }

    /**
     * To produce the hashcode of a sentence
     *
     * @return a hashcode
     */
    public hashCode(): int {
        return this.hash;
    }

    /** Keep the cached Java hash aligned after Memory assigns an input occurrence time. */
    public refreshHash(): void {
        if (this.isNotTermlinkNormalizer()) {
            if (this.stamp === null)
                throw new JavaAssertionError("Stamp should not be null");
            this.hash = javaObjectsHash(this.term, this.punctuation, this.truth,
                this.stamp.getOccurrenceTime());
        } else {
            this.hash = javaObjectsHash(this.term, this.punctuation, this.truth);
        }
    }

    /**
     * Clone the Sentence
     *
     * @return The cloned Sentence
     */
    public clone(): Sentence;

    public clone(makeEternal: boolean): Sentence;

    /**
     * clone with a different term
     *
     * @param t term which has to get cloned
     * @return sentence with the cloned term as a property
     */
    public clone(t: Term): Sentence;
    public clone(...args: unknown[]): Sentence {
        switch (args.length) {
            case 0: {

                return this.clone(this.term);


                break;
            }

            case 1: {
                const [value] = args;
                if (typeof value === "boolean") {
                    let clon: Sentence = this.clone(this.term as unknown as Term);
                    if (clon.stamp.getOccurrenceTime() !== Stamp.ETERNAL && value) {
                        clon.stamp.setEternal();
                    }
                    return clon;
                }
                return new Sentence(
                    value as Term,
                    this.punctuation,
                    this.truth !== null ? TruthValue.fromTruthValue(this.truth) : null,
                    this.stamp.clone());
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /**
     * project a judgment to a difference occurrence time
     *
     * @param targetTime  The time to be projected into
     * @param currentTime The current time as a reference
     * @return The projected belief
     */
    public projection(targetTime: long, currentTime: long, mem: Memory): Sentence {

        let newTruth: TruthValue = this.projectionTruth(targetTime, currentTime, mem);
        let eternalizing: boolean = (newTruth instanceof TruthFunctions.EternalizedTruthValue);

        let newStamp: Stamp = eternalizing ? this.stamp.cloneWithNewOccurrenceTime(Stamp.ETERNAL)
            : this.stamp.cloneWithNewOccurrenceTime(targetTime);

        return new Sentence(
            this.term,
            this.punctuation,
            newTruth,
            newStamp,
            false);
    }

    public projectionTruth(targetTime: long, currentTime: long, mem: Memory): TruthValue {
        if (this.truth === null) {
            throw new JavaIllegalStateException("Cannot project a sentence without a truth value");
        }
        const truth = this.truth;
        let newTruth: TruthValue | null = null;

        if (!this.stamp.isEternal()) {
            newTruth = TruthFunctions.eternalize(truth, mem.narParameters);
            if (targetTime !== Stamp.ETERNAL) {
                let occurrenceTime: long = this.stamp.getOccurrenceTime();
                let factor: float = TruthFunctions.temporalProjection(occurrenceTime, targetTime, currentTime,
                    mem.narParameters);
                let projectedConfidence: double = factor * truth.confidence;
                if (projectedConfidence > newTruth.confidence) {
                    newTruth = TruthValue.fromFrequencyConfidence(truth.frequency, projectedConfidence, mem.narParameters);
                }
            }
        }

        if (newTruth === null)
            newTruth = truth.clone();

        return newTruth;
    }

    /**
     * @return property, whether the object is a judgment
     */
    public isJudgment(): boolean {
        return (this.punctuation === Symbols.JUDGMENT_MARK);
    }

    /**
     * @return property, whether the object is a question
     */
    public isQuestion(): boolean {
        return (this.punctuation === Symbols.QUESTION_MARK);
    }

    /**
     * @return property, whether the sentence is a goal
     */
    public isGoal(): boolean {
        return (this.punctuation === Symbols.GOAL_MARK);
    }

    /**
     * @return property, whether the sentence is a quest
     */
    public isQuest(): boolean {
        return (this.punctuation === Symbols.QUEST_MARK);
    }

    /**
     * @return property of the ability to revise the sentence
     */
    public getRevisable(): boolean {
        return this.revisable;
    }

    public setRevisable(b: boolean): void {
        this.revisable = b;
    }

    public getTemporalOrder(): int {
        return this.term.getTemporalOrder();
    }

    public getOccurrenceTime(): long {
        return this.stamp.getOccurrenceTime();
    }

    /**
     * Get a String representation of the sentence
     *
     * @return The String
     */
    public override toString(): JavaString;

    /**
     * @param nar       Reasoner instance
     * @param showStamp must the stamp get appended to the string?
     * @return textural representation of the sentence for humans
     */
    public override toString(nar: Nar, showStamp: boolean): JavaString;
    public override toString(...args: unknown[]): JavaString {
        switch (args.length) {
            case 0: {

                return toJavaString(this.getKey());


                break;
            }

            case 2: {
                const [nar, showStamp] = args as [Nar, boolean];



                let contentName: JavaCharSequence = this.term.name();

                // final long t = nar.time();

                let diff: long = this.stamp.getOccurrenceTime() - nar.time();
                const diffNumber = Number(diff);
                let diffabs = Math.abs(diffNumber);

                let timediff: string = "";
                if (diffabs < nar.narParameters.DURATION) {
                    timediff = "|";
                } else {
                    timediff = diffNumber > 0 ? `+${diffabs}` : `-${diffabs}`;
                }

                if (Debug.TEST) {
                    timediff = `!${String(this.stamp.getOccurrenceTime())}`;
                }

                let tenseString: string = ":" + timediff + ":";
                if (this.stamp.getOccurrenceTime() === Stamp.ETERNAL)
                    tenseString = "";

                let stampString: JavaCharSequence | null = showStamp ? this.stamp.name() : null;

                let stringLength: int = String(contentName).length + String(tenseString).length + 1 + 1;

                if (this.truth !== null)
                    stringLength += 11;

                if (showStamp && stampString !== null)
                    stringLength += String(stampString).length + 1;

                let conv: string = "";
                if (this.term.term_indices !== null) {
                    conv = " [i,j,k,l]=[";
                    for (let i: int = 0; i < 4; i++) { // skip min sizes
                        conv += String(this.term.term_indices[i]) + ",";
                    }
                    // Java String.length() becomes the JS string length property.
                    conv = conv.substring(0, conv.length - 1) + "]";
                }

                const buffer = new SentenceStringBuilder()
                    .append(javaStringValue(contentName))
                    .append(this.punctuation)
                    .append(conv);

                if (String(tenseString).length > 0)
                    buffer.append(" ").append(tenseString);

                if (this.truth !== null) {
                    buffer.append(" ");
                    this.truth.appendString(buffer, true);
                }

                if (showStamp)
                    buffer.append(" ").append(javaStringValue(stampString));

                return toJavaString(buffer.toString());


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    /**
     * Get a String representation of the sentence for key of Task and TaskLink
     *
     * @return The String
     */
    public getKey(): string {
        // key must be invalidated if content or truth change
        if (this.key === null) {
            let contentName: string = String(this.term.name().toString());

            let showOcurrenceTime: boolean = ((this.punctuation === Symbols.JUDGMENT_MARK)
                || (this.punctuation === Symbols.QUESTION_MARK));

            let stringLength: int = 0;
            if (this.truth !== null) {
                stringLength += (showOcurrenceTime ? 8 : 0) + 11 /* truthString.length() */;
            }

            let conv: string = "";
            if (this.term.term_indices !== null) {
                conv = " [i,j,k,l]=[";
                for (let i: int = 0; i < 4; i++) { // skip min sizes
                conv += String(this.term.term_indices[i]) + ",";
                }
                conv = conv.substring(0, conv.length - 1) + "]";
            }

            // suffix = [punctuation][ ][truthString][ ][occurenceTimeString]
            const suffix = new SentenceStringBuilder().append(this.punctuation).append(conv);

            if (this.truth !== null) {
                suffix.append(" ");
                this.truth.appendString(suffix, false);
            }
            if ((showOcurrenceTime) && (this.stamp !== null)) {
                suffix.append(" ");
                this.stamp.appendOcurrenceTime(suffix);
            }

            this.key = Texts.yarn(
                contentName,
                suffix.toString()) ?? "";
        }
        return this.key;
    }

    /**
     * discounts the truth value of the sentence
     *
     */
    public discountConfidence(narParameters: Parameters): void {
        if (this.truth === null) {
            throw new JavaIllegalStateException("Cannot discount a sentence without a truth value");
        }
        this.truth.confidence = this.truth.confidence * narParameters.DISCOUNT_RATE;
        this.truth.analytic = false;
    }

    /**
     *
     * @return classification if the sentence is true for ever
     */
    public isEternal(): boolean {
        return this.stamp.isEternal();
    }

    /**
     *
     * @return term of the sentence, terms are properties of sentences
     */
    public getTerm(): Term {
        return this.term;
    }

    /**
     *
     * @return truth of the sentence, truths are properties of sentences
     */
    public getTruth(): TruthValue {
        // Java returns the nullable field directly; it does not turn a query
        // sentence into an exception at this accessor boundary.
        return this.truth as TruthValue;
    }
}
