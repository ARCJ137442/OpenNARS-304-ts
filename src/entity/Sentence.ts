import { java, JavaObject, type char, type int, type long, type float, type double, S } from "jree";



/**
 * Sentence as defined by the NARS-theory
 *
 * A Sentence is used as the premises and conclusions of all inference rules.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Sentence extends JavaObject implements java.lang.Cloneable, java.io.Serializable {

    public producedByTemporalInduction: boolean = false;

    /**
     * The content of a Sentence is a Term
     */
    public readonly term: Term;

    /**
     * The punctuation indicates the type of the Sentence:
     * Judgment '.', Question '?', Goal '!', or Quest '@'
     */
    public readonly punctuation: char;

    /**
     * The truth value of Judgment, or desire value of Goal
     */
    public readonly truth: TruthValue;

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
    private key: java.lang.CharSequence;

    private readonly hash: int;

    public constructor(/* final */  term: Term, /* final */  punctuation: char, /* final */  newTruth: TruthValue, /* final */  newStamp: Stamp);

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
    private constructor(_content: Term, /* final */  punctuation: char, /* final */  truth: TruthValue, /* final */  stamp: Stamp,
            /* final */  normalize: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 4: {
                const [term, punctuation, newTruth, newStamp] = args as [Term, char, TruthValue, Stamp];


                this(term, punctuation, newTruth, newStamp, true);


                break;
            }

            case 5: {
                const [_content, punctuation, truth, stamp, normalize] = args as [Term, char, TruthValue, Stamp, boolean];



                // cut interval at end for sentence in serial conjunction, and inbetween for
                // parallel
                super();
                if (punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                    if (_content instanceof Conjunction) {
                        let c: Conjunction = _content as Conjunction;
                        if (c.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                            if (c.term[c.term.length - 1] instanceof Interval) {
                                let time: long = 0;
                                // refined:
                                let u: int = 0;
                                while (c.term.length - 1 - u >= 0 && c.term[c.term.length - 1 - u] instanceof Interval) {
                                    time += (c.term[c.term.length - 1 - u] as Interval).time;
                                    u++;
                                }

                                let term2: Term[] = new Array<Term>(c.term.length - u);
                                java.lang.System.arraycopy(c.term, 0, term2, 0, term2.length);
                                _content = Conjunction.make(term2, c.getTemporalOrder(), c.isSpatial);
                                // ok we removed a part of the interval, we have to transform the occurence time
                                // of the sentence back
                                // accordingly

                                if (!c.isSpatial && stamp !== null && stamp.getOccurrenceTime() !== Stamp.ETERNAL)
                                    stamp.setOccurrenceTime(stamp.getOccurrenceTime() - time);
                            }
                            if (c.term[0] instanceof Interval) {
                                let time: long = 0;
                                // refined:
                                let u: int = 0;
                                while (u < c.term.length && (c.term[u] instanceof Interval)) {
                                    time += (c.term[u] as Interval).time;
                                    u++;
                                }

                                let term2: Term[] = new Array<Term>(c.term.length - u);
                                java.lang.System.arraycopy(c.term, u, term2, 0, term2.length);
                                _content = Conjunction.make(term2, c.getTemporalOrder(), c.isSpatial);
                                // ok we removed a part of the interval, we have to transform the occurence time
                                // of the sentence back
                                // accordingly

                                if (!c.isSpatial && stamp !== null && stamp.getOccurrenceTime() !== Stamp.ETERNAL)
                                    stamp.setOccurrenceTime(stamp.getOccurrenceTime() + time);
                            }
                        }
                    }
                }

                this.punctuation = punctuation;

                if (truth !== null) {
                    if (_content instanceof Implication || _content instanceof Equivalence) {
                        if ((_content as Statement).getSubject().hasVarIndep()
                            && !(_content as Statement).getPredicate().hasVarIndep())
                            truth.setConfidence(0.0);
                        if ((_content as Statement).getPredicate().hasVarIndep()
                            && !(_content as Statement).getSubject().hasVarIndep())
                            truth.setConfidence(0.0); // TODO:
                    } else if (_content instanceof Interval && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        truth.setConfidence(0.0); // do it that way for now, because else further inference is interrupted.
                        if (Debug.DETAILED && Debug.DETAILED_SENTENCES)
                            throw new java.lang.IllegalStateException(
                                "Sentence content must not be Interval: " + _content + punctuation + " " + stamp);
                    }

                    if ((!this.isQuestion() && !this.isQuest()) && (truth === null)
                        && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        throw new java.lang.IllegalStateException("Judgment and Goal sentences require non-null truth value");
                    }

                    if (_content.subjectOrPredicateIsIndependentVar()
                        && punctuation !== Symbols.TERM_NORMALIZING_WORKAROUND_MARK) {
                        truth.setConfidence(0.0); // do it that way for now, because else further inference is interrupted.
                        if (Debug.DETAILED && Debug.DETAILED_SENTENCES)
                            throw new java.lang.IllegalStateException(
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

                let newTerm: Term = null;
                if (_content instanceof CompoundTerm)
                    newTerm = (_content as CompoundTerm).cloneDeepVariables();

                // Variable name normalization
                // TODO move this to Concept method, like cloneNormalized()
                if (newTerm !== null && normalize && _content.hasVar() && (!(_content as CompoundTerm).isNormalized())) {

                    this.term = newTerm;
                    let c: CompoundTerm = this.term as CompoundTerm;
                    let vars: java.util.List<Variable> = new java.util.ArrayList<Variable>(); // may contain duplicates, list for efficiency

                    c.recurseSubtermsContainingVariables((t, parent) => {
                        if (t instanceof Variable) {
                            let v: Variable = (t as Variable);
                            vars.add(v);
                        }
                    });

                    let rename: java.util.Map<java.lang.CharSequence, java.lang.CharSequence> = new java.util.LinkedHashMap();
                    let renamed: boolean = false;

                    for (let v of vars) {
                        let vname: java.lang.CharSequence = v.name();
                        if (!v.hasVarIndep())
                            vname = vname + " " + v.getScope().name();
                        let n: java.lang.CharSequence = rename.get(vname);
                        if (n === null) {
                            // type + id
                            rename.put(vname, n = Variable.getName(v.getType(), rename.size() + 1));
                            if (!n.equals(vname))
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
                if (this.isNotTermlinkNormalizer()) {
                    if (stamp === null)
                        throw new java.lang.AssertionError("Stamp should not be null");
                    this.hash = java.util.Objects.hash(this.term, punctuation, truth, stamp.getOccurrenceTime());
                } else
                    this.hash = java.util.Objects.hash(this.term, punctuation, truth);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
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
    public override  equals(/* final */  that: java.lang.Object): boolean {
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
    public override  hashCode(): int {
        return this.hash;
    }

    /**
     * Clone the Sentence
     *
     * @return The cloned Sentence
     */
    public override  clone(): Sentence;

    public override  clone(/* final */  makeEternal: boolean): Sentence;

    /**
     * clone with a different term
     *
     * @param t term which has to get cloned
     * @return sentence with the cloned term as a property
     */
    public override clone(/* final */  t: Term): Sentence;
    public override clone(...args: unknown[]): Sentence {
        switch (args.length) {
            case 0: {

                return this.clone(this.term);


                break;
            }

            case 1: {
                const [makeEternal] = args as [boolean];


                let clon: Sentence = this.clone(this.term);
                if (clon.stamp.getOccurrenceTime() !== Stamp.ETERNAL && makeEternal) {
                    // change occurence time of clone
                    clon.stamp.setEternal();
                }
                return clon;


                break;
            }

            case 1: {
                const [t] = args as [Term];


                return new Sentence(
                    t,
                    this.punctuation,
                    this.truth !== null ? new TruthValue(this.truth) : null,
                    this.stamp.clone());


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public projection(/* final */  targetTime: long, /* final */  currentTime: long, mem: Memory): Sentence {

        let newTruth: TruthValue = this.projectionTruth(targetTime, currentTime, mem);
        let eternalizing: boolean = (newTruth instanceof EternalizedTruthValue);

        let newStamp: Stamp = eternalizing ? this.stamp.cloneWithNewOccurrenceTime(Stamp.ETERNAL)
            : this.stamp.cloneWithNewOccurrenceTime(targetTime);

        return new Sentence(
            this.term,
            this.punctuation,
            newTruth,
            newStamp,
            false);
    }

    public projectionTruth(/* final */  targetTime: long, /* final */  currentTime: long, mem: Memory): TruthValue {
        let newTruth: TruthValue = null;

        if (!this.stamp.isEternal()) {
            newTruth = TruthFunctions.eternalize(this.truth, mem.narParameters);
            if (targetTime !== Stamp.ETERNAL) {
                let occurrenceTime: long = this.stamp.getOccurrenceTime();
                let factor: float = TruthFunctions.temporalProjection(occurrenceTime, targetTime, currentTime,
                    mem.narParameters);
                let projectedConfidence: double = factor * this.truth.getConfidence();
                if (projectedConfidence > newTruth.getConfidence()) {
                    newTruth = new TruthValue(this.truth.getFrequency(), projectedConfidence, mem.narParameters);
                }
            }
        }

        if (newTruth === null)
            newTruth = this.truth.clone();

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

    public setRevisable(/* final */  b: boolean): void {
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
    public override  toString(): java.lang.String;

    /**
     * @param nar       Reasoner instance
     * @param showStamp must the stamp get appended to the string?
     * @return textural representation of the sentence for humans
     */
    public override  toString(/* final */  nar: Nar, /* final */  showStamp: boolean): java.lang.CharSequence;
    public override toString(...args: unknown[]): java.lang.String | java.lang.CharSequence {
        switch (args.length) {
            case 0: {

                return this.getKey().toString();


                break;
            }

            case 2: {
                const [nar, showStamp] = args as [Nar, boolean];



                let contentName: java.lang.CharSequence = this.term.name();

                // final long t = nar.time();

                let diff: long = this.stamp.getOccurrenceTime() - nar.time();
                let diffabs: long = java.lang.Math.abs(diff);

                let timediff: java.lang.String = "";
                if (diffabs < nar.narParameters.DURATION) {
                    timediff = "|";
                } else {
                    let Int: java.lang.Long = diffabs;
                    timediff = diff > 0 ? "+" + java.lang.String.valueOf(Int) : "-" + java.lang.String.valueOf(Int);
                }

                if (Debug.TEST) {
                    timediff = "!" + java.lang.String.valueOf(this.stamp.getOccurrenceTime());
                }

                let tenseString: java.lang.String = ":" + timediff + ":";
                if (this.stamp.getOccurrenceTime() === Stamp.ETERNAL)
                    tenseString = "";

                let stampString: java.lang.CharSequence = showStamp ? this.stamp.name() : null;

                let stringLength: int = contentName.length() + tenseString.length() + 1 + 1;

                if (this.truth !== null)
                    stringLength += 11;

                if (stampString === null)
                    throw new java.lang.AssertionError("stampString should not be null");
                if (showStamp)
                    stringLength += stampString.length() + 1;

                let conv: java.lang.String = "";
                if (this.term.term_indices !== null) {
                    conv = " [i,j,k,l]=[";
                    for (let i: int = 0; i < 4; i++) { // skip min sizes
                        conv += java.lang.String.valueOf(this.term.term_indices[i]) + ",";
                    }
                    conv = conv.substring(0, conv.length() - 1) + "]";
                }

                let buffer: java.lang.StringBuilder = new java.lang.StringBuilder(stringLength).append(contentName).append(this.punctuation)
                    .append(conv);

                if (tenseString.length() > 0)
                    buffer.append(' ').append(tenseString);

                if (this.truth !== null) {
                    buffer.append(' ');
                    this.truth.appendString(buffer, true);
                }

                if (showStamp)
                    buffer.append(' ').append(stampString);

                return buffer;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Get a String representation of the sentence for key of Task and TaskLink
     *
     * @return The String
     */
    public getKey(): java.lang.CharSequence {
        // key must be invalidated if content or truth change
        if (this.key === null) {
            let contentName: java.lang.CharSequence = this.term.name();

            let showOcurrenceTime: boolean = ((this.punctuation === Symbols.JUDGMENT_MARK)
                || (this.punctuation === Symbols.QUESTION_MARK));

            let stringLength: int = 0;
            if (this.truth !== null) {
                stringLength += (showOcurrenceTime ? 8 : 0) + 11 /* truthString.length() */;
            }

            let conv: java.lang.String = "";
            if (this.term.term_indices !== null) {
                conv = " [i,j,k,l]=[";
                for (let i: int = 0; i < 4; i++) { // skip min sizes
                    conv += java.lang.String.valueOf(this.term.term_indices[i]) + ",";
                }
                conv = conv.substring(0, conv.length() - 1) + "]";
            }

            // suffix = [punctuation][ ][truthString][ ][occurenceTimeString]
            let suffix: java.lang.StringBuilder = new java.lang.StringBuilder(stringLength).append(this.punctuation).append(conv);

            if (this.truth !== null) {
                suffix.append(' ');
                this.truth.appendString(suffix, false);
            }
            if ((showOcurrenceTime) && (this.stamp !== null)) {
                suffix.append(' ');
                this.stamp.appendOcurrenceTime(suffix);
            }

            this.key = Texts.yarn(
                contentName,
                suffix);
        }
        return this.key;
    }

    /**
     * discounts the truth value of the sentence
     *
     */
    public discountConfidence(narParameters: java.security.Policy.Parameters): void {
        this.truth.setConfidence(this.truth.getConfidence() * narParameters.DISCOUNT_RATE).setAnalytic(false);
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
        return this.truth;
    }
}
