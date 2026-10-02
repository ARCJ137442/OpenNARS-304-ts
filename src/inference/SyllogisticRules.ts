//! Java source: opennars/inference/SyllogisticRules.java
import type { IntNumber, RuntimeLong, ShortNumber, FloatNumber } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Symbols } from "../io/Symbols.ts";
import { Statement } from "../language/Statement.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Conjunction } from "../language/Conjunction.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Implication } from "../language/Implication.ts";
import { Interval } from "../language/Interval.ts";
import { Terms } from "../language/Terms.ts";
import type { Term } from "../language/Term.ts";
import { Variables } from "../language/Variables.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Task } from "../entity/Task.ts";
import { Stamp } from "../entity/Stamp.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { BudgetFunctions } from "./BudgetFunctions.ts";
import { TruthFunctions } from "./TruthFunctions.ts";
import { TemporalRules } from "./TemporalRules.ts";
import type { DerivationContext } from "../control/DerivationContext.ts";
import { ProcessAnticipation } from "../control/concept/ProcessAnticipation.ts";
import { Float32Math } from "../runtime/Float32.ts";
import { NativeMap } from "../runtime/NativeMap.ts";
import { NativeList } from "../runtime/NativeList.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";

const NativeOperator = Symbols.NativeOperator;
const { ORDER_NONE, ORDER_FORWARD, ORDER_BACKWARD, ORDER_INVALID } = TemporalRules;
const dedExeOrder = TemporalRules.dedExeOrder;
const abdIndComOrder = TemporalRules.abdIndComOrder;
const analogyOrder = TemporalRules.analogyOrder;
const resemblanceOrder = TemporalRules.resemblanceOrder;
const reduceComponents = Terms.reduceComponents;



/**
 * Syllogisms: Inference rules based on the transitivity of the relation.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
// Java implicit Object -> native TypeScript class; this class is a static rule namespace.
export class SyllogisticRules {

    /*
     * --------------- rules used in both first-tense inference and higher-tense
     * inference ---------------
     */
    /**
     * <pre>
     * {<S ==> M>, <M ==> P>} |- {<S ==> P>, <P ==> S>}
     * </pre>
     *
     * @param term1    Subject of the first new task
     * @param term2    Predicate of the first new task
     * @param sentence The first premise
     * @param belief   The second premise
     * @param nal      Reference to the memory
     */
    public static dedExe(term1: Term, term2: Term, sentence: Sentence, belief: Sentence,
        nal: DerivationContext): void {
        if (Statement.invalidStatement(term1, term2)) {
            return;
        }
        let order1: IntNumber = sentence.term.getTemporalOrder();
        let order2: IntNumber = belief.term.getTemporalOrder();
        let order: IntNumber = dedExeOrder(order1, order2);
        if (order === ORDER_INVALID) {
            return;
        }
        let value1: TruthValue | null = sentence.truth;
        let value2: TruthValue = belief.getTruth();
        let truth1: TruthValue = null as unknown as TruthValue;
        let truth2: TruthValue = null as unknown as TruthValue;
        let budget1: BudgetValue;
        let budget2: BudgetValue;

        if (!(sentence.isQuestion() || sentence.isQuest())) {
            if (sentence.isGoal()) {
                truth1 = TruthFunctions.desireWeak(sentence.getTruth(), value2, nal.narParameters);
                truth2 = TruthFunctions.desireWeak(sentence.getTruth(), value2, nal.narParameters);
            } else {
                // isJudgment
                truth1 = TruthFunctions.deduction(sentence.getTruth(), value2, nal.narParameters);
                truth2 = TruthFunctions.exemplification(sentence.getTruth(), value2, nal.narParameters);
            }
        }

        if (sentence.isQuestion()) {
            budget1 = BudgetFunctions.backwardWeak(value2, nal);
            budget2 = BudgetFunctions.backwardWeak(value2, nal);
        } else if (sentence.isQuest()) {
            budget1 = BudgetFunctions.backward(value2, nal);
            budget2 = BudgetFunctions.backward(value2, nal);
        } else {
            budget1 = BudgetFunctions.forward(truth1, nal);
            budget2 = BudgetFunctions.forward(truth2, nal);
        }

        let content: Statement = sentence.term as Statement;
        let content1: Statement | null = Statement.make(content, term1, term2, order);
        let content2: Statement | null = Statement.make(content, term2, term1, TemporalRules.reverseOrder(order));

        if ((content1 === null) || (content2 === null))
            return;

        nal.doublePremiseTask(content1, truth1, budget1, false, false); // (allow overlap) but not needed here, isn't
        // detachment
        nal.doublePremiseTask(content2, truth2, budget2, false, false);
    }

    /**
     * {<M ==> S>, <M ==> P>} |- {<S ==> P>, <P ==>
     * S>, <S <=> P>}
     *
     * @param term1     Subject of the first new task
     * @param term2     Predicate of the first new task
     * @param sentence1 The first premise
     * @param sentence2 The second premise
     * @param figure    Locations of the shared term in premises --- can be
     *                  removed?
     * @param nal       Reference to the memory
     */
    public static abdIndCom(term1: Term, term2: Term, sentence1: Sentence, sentence2: Sentence,
        figure: IntNumber, nal: DerivationContext): boolean {
        if (Statement.invalidStatement(term1, term2) || Statement.invalidPair(term1, term2)) {
            return false;
        }
        let order1: IntNumber = sentence1.term.getTemporalOrder();
        let order2: IntNumber = sentence2.term.getTemporalOrder();
        let order: IntNumber = abdIndComOrder(order1, order2);

        let taskContent: Statement = sentence1.term as Statement;
        let truth1: TruthValue = null as unknown as TruthValue;
        let truth2: TruthValue = null as unknown as TruthValue;
        let truth3: TruthValue = null as unknown as TruthValue;
        let budget1: BudgetValue;
        let budget2: BudgetValue;
        let budget3: BudgetValue;
        let value1: TruthValue | null = sentence1.truth;
        let value2: TruthValue = sentence2.getTruth();

        if (sentence1.isGoal()) {
            truth1 = TruthFunctions.desireStrong(sentence1.getTruth(), value2, nal.narParameters); // P --> S
            truth2 = TruthFunctions.desireWeak(value2, sentence1.getTruth(), nal.narParameters); // S --> P
            truth3 = TruthFunctions.desireStrong(sentence1.getTruth(), value2, nal.narParameters); // S <-> P
        } else if (sentence1.isJudgment()) {
            truth1 = TruthFunctions.abduction(sentence1.getTruth(), value2, nal.narParameters); // P --> S
            truth2 = TruthFunctions.abduction(value2, sentence1.getTruth(), nal.narParameters); // S --> P
            truth3 = TruthFunctions.comparison(sentence1.getTruth(), value2, nal.narParameters); // S <-> P
        }

        if (sentence1.isQuestion()) {
            budget1 = BudgetFunctions.backward(value2, nal);
            budget2 = BudgetFunctions.backwardWeak(value2, nal);
            budget3 = BudgetFunctions.backward(value2, nal);
        } else if (sentence1.isQuest()) {
            budget1 = BudgetFunctions.backwardWeak(value2, nal);
            budget2 = BudgetFunctions.backward(value2, nal);
            budget3 = BudgetFunctions.backwardWeak(value2, nal);
        } else {
            budget1 = BudgetFunctions.forward(truth1, nal);
            budget2 = BudgetFunctions.forward(truth2, nal);
            budget3 = BudgetFunctions.forward(truth3, nal);
        }

        if (term1.imagination !== null && term2.imagination !== null) {
            let T: TruthValue = term1.imagination.AbductionOrComparisonTo(term2.imagination, true);
            const similarity = Statement.make(NativeOperator.SIMILARITY, term1, term2, TemporalRules.ORDER_NONE);
            if (similarity !== null) {
                nal.doublePremiseTask(similarity, T, BudgetFunctions.forward(T, nal), false, false);
            }
            let T2: TruthValue = term1.imagination.AbductionOrComparisonTo(term2.imagination, false);
            const inheritanceForward = Statement.make(NativeOperator.INHERITANCE, term1, term2, TemporalRules.ORDER_NONE);
            if (inheritanceForward !== null) {
                nal.doublePremiseTask(inheritanceForward, T2, BudgetFunctions.forward(T2, nal), false, false);
            }
            let T3: TruthValue = term2.imagination.AbductionOrComparisonTo(term1.imagination, false);
            const inheritanceBackward = Statement.make(NativeOperator.INHERITANCE, term2, term1, TemporalRules.ORDER_NONE);
            if (inheritanceBackward !== null) {
                nal.doublePremiseTask(inheritanceBackward, T3, BudgetFunctions.forward(T3, nal), false, false);
            }

            /**
             * no need for other syllogistic inference, it were sensational terms,
             * but it would not hurt to allow it either.. but why afford tasks that
             * summarize
             * so little evidence in comparison to the amount summarized by the array
             * comparison.
             */

            return true;
        }

        let occurrence_time2: RuntimeLong = nal.getCurrentTask().sentence.getOccurrenceTime();
        while (occurrence_time2 !== Stamp.ETERNAL && (term2 instanceof Conjunction)
            && ((term2 as CompoundTerm).term[0] instanceof Interval)) {
            let interval: Interval = (term2 as CompoundTerm).term[0] as Interval;
            occurrence_time2 += interval.time;
            term2 = (term2 as CompoundTerm).setComponent(0, null as unknown as Term, nal.mem());
        }
        let occurrence_time1: RuntimeLong = nal.getCurrentTask().sentence.getOccurrenceTime();
        while (occurrence_time1 !== Stamp.ETERNAL && (term1 instanceof Conjunction)
            && ((term1 as CompoundTerm).term[0] instanceof Interval)) {
            let interval: Interval = (term1 as CompoundTerm).term[0] as Interval;
            occurrence_time1 += interval.time;
            term1 = (term1 as CompoundTerm).setComponent(0, null as unknown as Term, nal.mem());
        }

        if (order !== ORDER_INVALID) {
            nal.getTheNewStamp().setOccurrenceTime(occurrence_time1);
            const forward = Statement.make(taskContent, term1, term2, order);
            if (forward !== null) {
                nal.doublePremiseTask(forward, truth1, budget1, false, false);
            }
            nal.getTheNewStamp().setOccurrenceTime(occurrence_time2);
            const backward = Statement.make(taskContent, term2, term1, TemporalRules.reverseOrder(order));
            if (backward !== null) {
                nal.doublePremiseTask(backward, truth2, budget2, false, false);
            }
            nal.getTheNewStamp().setOccurrenceTime(occurrence_time1);
            const symmetric = Statement.makeSym(taskContent, term1, term2, order);
            if (symmetric !== null) {
                nal.doublePremiseTask(symmetric, truth3, budget3, false, false);
            }
        }
        if (nal.narParameters.BREAK_NAL_HOL_BOUNDARY && order1 === order2 && taskContent.isHigherOrderStatement()
            && sentence2.term.isHigherOrderStatement()) { //
            /*
             * Bridge to higher order statements:
             * <a ==> c>.
             * <b ==> c>.
             * |-
             * <a <-> b>. %F_cmp%
             * <a --> b>. %F_abd%
             * <b --> a>. %F_abd%
             */
            /*
             * // commented because it may be useful in the future
             * if(truth1!=null)
             * truth1=truth1.clone();
             * if(truth2!=null)
             * truth2=truth2.clone();
             */
            if (truth3 !== null)
                truth3 = truth3.clone();
            /*
             * // commented because it may be useful in the future
             * nal.doublePremiseTask(
             * Statement.make(NativeOperator.INHERITANCE, term1, term2),
             * truth1, budget1.clone(),false, false);
             * nal.doublePremiseTask(
             * Statement.make(NativeOperator.INHERITANCE, term2, term1),
             * truth2, budget2.clone(),false, false);
             */
            const similarity = Statement.make(NativeOperator.SIMILARITY, term1, term2, TemporalRules.ORDER_NONE);
            if (similarity !== null) {
                nal.doublePremiseTask(similarity, truth3, budget3.clone(), false, false);
            }
        }
        return false;
    }

    /**
     * {<S ==> P>, <M <=> P>} |- <S ==> P>
     *
     * @param subj   Subject of the new task
     * @param pred   Predicate of the new task
     * @param asym   The asymmetric premise
     * @param sym    The symmetric premise
     * @param figure Locations of the shared term in premises
     * @param nal    Reference to the memory
     */
    public static analogy(subj: Term, pred: Term, asym: Sentence, sym: Sentence, figure: IntNumber,
        nal: DerivationContext): void {
        if (Statement.invalidStatement(subj, pred)) {
            return;
        }
        let order1: IntNumber = asym.term.getTemporalOrder();
        let order2: IntNumber = sym.term.getTemporalOrder();
        let order: IntNumber = analogyOrder(order1, order2, figure);
        if (order === ORDER_INVALID) {
            return;
        }
        let st: Statement = asym.term as Statement;
        let truth: TruthValue = null as unknown as TruthValue;
        let budget: BudgetValue;
        let sentence: Sentence = nal.getCurrentTask().sentence;
        let taskTerm: CompoundTerm = sentence.term as CompoundTerm;
        if (sentence.isQuestion() || sentence.isQuest()) {
            if (taskTerm.isCommutative()) {
                if (asym.truth === null) { // a question for example
                    return;
                }
                budget = BudgetFunctions.backwardWeak(asym.getTruth(), nal);
            } else {
                if (sym.truth === null) { // a question for example
                    return;
                }
                budget = BudgetFunctions.backward(sym.getTruth(), nal);
            }
        } else {
            if (sentence.isGoal()) {
                truth = TruthFunctions.lookupTruthFunctionByBoolAndCompute(taskTerm.isCommutative(),
                    TruthFunctions.EnumType.DESIREWEAK, TruthFunctions.EnumType.DESIRESTRONG, asym.getTruth(), sym.getTruth(),
                    nal.narParameters);
            } else {
                truth = TruthFunctions.analogy(asym.getTruth(), sym.getTruth(), nal.narParameters);
            }

            budget = BudgetFunctions.forward(truth, nal);
        }

        // nal.mem().logic.ANALOGY.commit();
        const content = Statement.make(st, subj, pred, order);
        if (content !== null) {
            nal.doublePremiseTask(content, truth, budget, false, false); // (allow overlap)
        }
        // but not needed
        // here, isn't
        // detachment
    }

    /**
     * {<S <=> M>, << <=> P>} |- <S <=> P>
     *
     * @param term1    Subject of the new task
     * @param term2    Predicate of the new task
     * @param belief   The first premise
     * @param sentence The second premise
     * @param figure   Locations of the shared term in premises
     * @param nal      Reference to the memory
     */
    public static resemblance(term1: Term, term2: Term, belief: Sentence, sentence: Sentence,
        figure: IntNumber, nal: DerivationContext): void {
        if (Statement.invalidStatement(term1, term2)) {
            return;
        }
        let order1: IntNumber = belief.term.getTemporalOrder();
        let order2: IntNumber = sentence.term.getTemporalOrder();
        let order: IntNumber = resemblanceOrder(order1, order2, figure);
        if (order === ORDER_INVALID) {
            return;
        }
        let st: Statement = belief.term as Statement;
        let truth: TruthValue = null as unknown as TruthValue;
        let budget: BudgetValue;
        if (!(sentence.isQuestion() || sentence.isQuest())) {
            if (sentence.isGoal()) {
                truth = TruthFunctions.desireStrong(sentence.getTruth(), belief.getTruth(), nal.narParameters);
            } else {
                // NOTE< this must be Judgement again ? >
                truth = TruthFunctions.resemblance(belief.getTruth(), sentence.getTruth(), nal.narParameters);
            }
        }

        if (sentence.isQuestion() || sentence.isQuest()) {
            budget = BudgetFunctions.backward(belief.getTruth(), nal);
        } else {
            budget = BudgetFunctions.forward(truth, nal);
        }

        let higherOrder: boolean = (belief.term.isHigherOrderStatement() || sentence.term.isHigherOrderStatement());
        let bothHigherOrder: boolean = (belief.term.isHigherOrderStatement()
            && sentence.term.isHigherOrderStatement());
        if (!bothHigherOrder && higherOrder) {
            if (belief.term.isHigherOrderStatement()) {
                order = belief.term.getTemporalOrder();
            } else if (sentence.term.isHigherOrderStatement()) {
                order = sentence.term.getTemporalOrder();
            }
        }
        let s: Statement | null = Statement.make(higherOrder ? NativeOperator.EQUIVALENCE : NativeOperator.SIMILARITY, term1,
            term2, order);
        if (s !== null) {
            nal.doublePremiseTask(s, truth, budget, false, false); // (allow overlap) but not needed here, isn't detachment
        }

        if (nal.narParameters.BREAK_NAL_HOL_BOUNDARY && !sentence.term.hasVarIndep() && (st instanceof Equivalence)
            && order1 === order2 && belief.term.isHigherOrderStatement() && sentence.term.isHigherOrderStatement()) {

            // final BudgetValue budget1 = null;
            // final BudgetValue budget2 = null;
            let budget3: BudgetValue = null as unknown as BudgetValue;
            // final TruthValue truth1 = null;
            // final TruthValue truth2 = null;
            let truth3: TruthValue = null as unknown as TruthValue;
            let value1: TruthValue = sentence.getTruth();
            let value2: TruthValue = belief.getTruth();

            if (sentence.isQuestion()) {
                /*
                 * // commented because it may be useful in the future
                 * budget1 = BudgetFunctions.backward(value2, nal);
                 * budget2 = BudgetFunctions.backwardWeak(value2, nal);
                 */
                budget3 = BudgetFunctions.backward(value2, nal);
            } else if (sentence.isQuest()) {
                /*
                 * // commented because it may be useful in the future
                 * budget1 = BudgetFunctions.backwardWeak(value2, nal);
                 * budget2 = BudgetFunctions.backward(value2, nal);
                 */
                budget3 = BudgetFunctions.backwardWeak(value2, nal);
            } else {
                if (sentence.isGoal()) {
                    /*
                     * // commented because it may be useful in the future
                     * truth1 = TruthFunctions.desireStrong(value1, value2);
                     * truth2 = TruthFunctions.desireWeak(value2, value1);
                     */
                    truth3 = TruthFunctions.desireStrong(value1, value2, nal.narParameters);
                } else {
                    // isJudgment
                    /*
                     * // commented because it may be useful in the future
                     * truth1 = TruthFunctions.abduction(value1, value2);
                     * truth2 = TruthFunctions.abduction(value2, value1);
                     */
                    truth3 = TruthFunctions.comparison(value1, value2, nal.narParameters);
                }

                /*
                 * // commented because it may be useful in the future
                 * budget1 = BudgetFunctions.forward(truth1, nal);
                 * budget2 = BudgetFunctions.forward(truth2, nal);
                 */
                budget3 = BudgetFunctions.forward(truth3, nal);
            }

            /*
             * Bridge to higher order statements:
             * <b <=> k>.
             * <b <=> c>.
             * |-
             * <k <-> c>. %F_cmp%
             */
            /*
             * // commented because it may be useful in the future
             * nal.doublePremiseTask(
             * Statement.make(NativeOperator.INHERITANCE, term1, term2),
             * truth1, budget1.clone(),false, false);
             * nal.doublePremiseTask(
             * Statement.make(NativeOperator.INHERITANCE, term2, term1),
             * truth2, budget2.clone(),false, false);
             */
            const similarity = Statement.make(NativeOperator.SIMILARITY, term1, term2, TemporalRules.ORDER_NONE);
            if (similarity !== null) {
                nal.doublePremiseTask(similarity, truth3, budget3.clone(), false, false);
            }
        }
    }

    /* --------------- rules used only in conditional inference --------------- */
    /**
     * {<<M --> S> ==> <M --> P>>, <M --> S>} |-
     * <M --> P>
     * <br>
     * {<<M --> S> ==> <M --> P>>, <M --> P>} |-
     * <M --> S>
     * <br>
     * {<<M --> S> <=> <M --> P>>, <M --> S>}
     * |- <M --> P>
     * <br>
     * {<<M --> S> <=> <M --> P>>, <M --> P>}
     * |- <M --> S>
     *
     * @param mainSentence The implication/equivalence premise
     * @param subSentence  The premise on part of s1
     * @param side         The location of s2 in s1
     * @param nal          Reference to the memory
     */
    public static detachment(mainSentence: Sentence, subSentence: Sentence, side: IntNumber,
        nal: DerivationContext): void;

    public static detachment(mainSentence: Sentence, subSentence: Sentence, side: IntNumber,
        checkTermAgain: boolean, nal: DerivationContext): void;
    public static detachment(...args: unknown[]): void {
        switch (args.length) {
            case 4: {
                const [mainSentence, subSentence, side, nal] = args as [Sentence, Sentence, IntNumber, DerivationContext];


                SyllogisticRules.detachment(mainSentence, subSentence, side, true, nal);


                break;
            }

            case 5: {
                const [mainSentence, subSentence, side, checkTermAgain, nal] = args as [Sentence, Sentence, IntNumber, boolean, DerivationContext];


                let statement: Statement = mainSentence.term as Statement;
                if (!(statement instanceof Implication) && !(statement instanceof Equivalence)) {
                    return;
                }
                let subject: Term = statement.getSubject();
                let predicate: Term = statement.getPredicate();
                let content: Term;
                let term: Term = subSentence.term;
                if ((side === 0) && (!checkTermAgain || term.equals(subject))) {
                    content = predicate;
                } else if ((side === 1) && (!checkTermAgain || term.equals(predicate))) {
                    content = subject;
                } else {
                    return;
                }
                if ((content instanceof Statement) && (content as Statement).invalid()) {
                    return;
                }

                let taskSentence: Sentence = nal.getCurrentTask().sentence;
                let beliefSentence: Sentence | null = nal.getCurrentBelief();

                if (beliefSentence === null)
                    return;

                let order: IntNumber = statement.getTemporalOrder();
                let occurrence_time: RuntimeLong = nal.getCurrentTask().sentence.getOccurrenceTime();
                if ((order !== ORDER_NONE) && (order !== ORDER_INVALID)) {
                    let baseTime: RuntimeLong = subSentence.getOccurrenceTime();
                    if (baseTime !== Stamp.ETERNAL) {
                        let inc: RuntimeLong = (order * nal.narParameters.DURATION) as unknown as RuntimeLong;
                        occurrence_time = (side === 0) ? baseTime + inc : baseTime - inc;
                    }
                }

                let beliefTruth: TruthValue = beliefSentence.getTruth();
                let truth1: TruthValue = mainSentence.getTruth();
                let truth2: TruthValue = subSentence.getTruth();
                let truth: TruthValue = null as unknown as TruthValue;
                let strong: boolean = false;
                let budget: BudgetValue;

                if (!(taskSentence.isQuestion() || taskSentence.isQuest())) {
                    if (taskSentence.isGoal()) {
                        strong = statement instanceof Equivalence || side !== 0;
                    } else { // isJudgment
                        strong = statement instanceof Equivalence || side === 0;
                    }
                }

                if (!(taskSentence.isQuestion() || taskSentence.isQuest())) {
                    if (taskSentence.isGoal()) {
                        if (statement instanceof Equivalence) {
                            truth = TruthFunctions.desireStrong(truth1, truth2, nal.narParameters);
                        } else if (side === 0) {
                            truth = TruthFunctions.desireInd(truth1, truth2, nal.narParameters);
                        } else {
                            truth = TruthFunctions.desireDed(truth1, truth2, nal.narParameters);
                        }
                    } else { // isJudgment
                        if (statement instanceof Equivalence) {
                            truth = TruthFunctions.analogy(truth2, truth1, nal.narParameters);
                        } else if (side === 0) {
                            truth = TruthFunctions.deduction(truth1, truth2, nal.narParameters);
                        } else {
                            truth = TruthFunctions.abduction(truth2, truth1, nal.narParameters);
                        }
                    }
                }

                if (taskSentence.isQuestion()) {
                    if (statement instanceof Equivalence) {
                        budget = BudgetFunctions.backward(beliefTruth, nal);
                    } else if (side === 0) {
                        budget = BudgetFunctions.backwardWeak(beliefTruth, nal);
                    } else {
                        budget = BudgetFunctions.backward(beliefTruth, nal);
                    }
                } else if (taskSentence.isQuest()) {
                    if (statement instanceof Equivalence) {
                        budget = BudgetFunctions.backwardWeak(beliefTruth, nal);
                    } else if (side === 0) {
                        budget = BudgetFunctions.backward(beliefTruth, nal);
                    } else {
                        budget = BudgetFunctions.backwardWeak(beliefTruth, nal);
                    }
                } else {
                    budget = BudgetFunctions.forward(truth, nal);
                }
                if (!Variables.indepVarUsedInvalid(content)) {
                    let allowOverlap: boolean = taskSentence.isJudgment() && strong;
                    nal.getTheNewStamp().setOccurrenceTime(occurrence_time);
                    nal.doublePremiseTask(content, truth, budget, false, allowOverlap); // (strong) when strong on judgement
                }


                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }


    /**
     * {<(&&, S1, S2, S3) ==> P>, S1} |- <(&&, S2, S3)
     * ==> P>
     * <br>
     * {<(&&, S2, S3) ==> P>, <S1 ==> S2>} |-
     * <(&&, S1, S3) ==> P>
     * <br>
     * {<(&&, S1, S3) ==> P>, <S1 ==> S2>} |-
     * <(&&, S2, S3) ==> P>
     *
     * @param premise1 The conditional premise
     * @param index    The location of the shared term in the condition of premise1
     * @param premise2 The premise which, or part of which, appears in the
     *                 condition of premise1
     * @param side     The location of the shared term in premise2: 0 for subject, 1
     *                 for predicate, -1 for the whole term
     * @param nal      Reference to the memory
     */
    public static conditionalDedInd(premise1Sentence: Sentence, premise1: Implication, index: ShortNumber, premise2: Term,
        side: IntNumber, nal: DerivationContext): void {
        let task: Task = nal.getCurrentTask();
        let taskSentence: Sentence = task.sentence;
        const belief = nal.getCurrentBelief();
        if (belief === null) {
            return;
        }
        let deduction: boolean = (side !== 0);
        let conditionalTask: boolean = Variables.hasSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT,
            premise2, belief.term);
        let commonComponent: Term;
        let newComponent: Term = null as unknown as Term;
        if (side === 0 || side === 1) {
            let sideOfCommonComponentAsEnum: Statement.EnumStatementSide = side === 0 ? Statement.EnumStatementSide.SUBJECT
                : Statement.EnumStatementSide.PREDICATE;
            commonComponent = (premise2 as Statement).retBySide(sideOfCommonComponentAsEnum);
            newComponent = (premise2 as Statement).retBySide(Statement.retOppositeSide(sideOfCommonComponentAsEnum));
        } else {
            commonComponent = premise2;
        }

        let subj: Term = premise1.getSubject();

        if (!(subj instanceof Conjunction)) {
            return;
        }
        let oldCondition: Conjunction = subj as Conjunction;

        let index2: IntNumber = Terms.indexOf(oldCondition.term, commonComponent);
        if (index2 >= 0) {
            index = index2 as ShortNumber;
        } else {
            let u: Term[] = [premise1, premise2];
            let match: boolean = Variables.unify(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, oldCondition.term[index],
                commonComponent, u);
            premise1 = u[0] as Implication;
            premise2 = u[1];

            if (!match && (commonComponent.constructor === oldCondition.constructor)) {

                let compoundCommonComponent: CompoundTerm = (commonComponent as CompoundTerm);

                if ((oldCondition.term.length > index) && (compoundCommonComponent.term.length > index)) { // assumption:
                    // { was
                    // missing
                    u = [premise1, premise2];
                    match = Variables.unify(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT,
                        oldCondition.term[index],
                        compoundCommonComponent.term[index],
                        u);
                    premise1 = u[0] as Implication;
                    premise2 = u[1];
                }

            }
            if (!match) {
                return;
            }
        }
        let conjunctionOrder: IntNumber = subj.getTemporalOrder();
        if (conjunctionOrder === ORDER_FORWARD) {
            if (index > 0) {
                return;
            }
            if ((side === 0) && (premise2.getTemporalOrder() === ORDER_FORWARD)) {
                return;
            }
            if ((side === 1) && (premise2.getTemporalOrder() === ORDER_BACKWARD)) {
                return;
            }
        }
        let newCondition: Term;
        if (oldCondition.equals(commonComponent)) {
            newCondition = null as unknown as Term;
        } else {
            newCondition = oldCondition.setComponent(index, newComponent as Term, nal.mem());
        }
        let content: Term | null;

        let delta: RuntimeLong = 0 as unknown as RuntimeLong;
        let minTime: RuntimeLong = 0 as unknown as RuntimeLong;
        let maxTime: RuntimeLong = 0 as unknown as RuntimeLong;
        let predictedEvent: boolean = false;

        if (newCondition !== null) {
            if (newCondition instanceof Interval) {
                content = premise1.getPredicate();
                delta = (newCondition as Interval).time;
                if (taskSentence.getOccurrenceTime() !== Stamp.ETERNAL) {
                    let timeOffset: FloatNumber = Number((newCondition as Interval).time) as FloatNumber;
                    let timeWindowHalf: FloatNumber = Float32Math.multiply(
                        timeOffset,
                        nal.narParameters.ANTICIPATION_TOLERANCE,
                    ) as FloatNumber;
                    const taskOccurrenceTime = Number(taskSentence.getOccurrenceTime());
                    minTime = Math.max(taskOccurrenceTime,
                        (taskOccurrenceTime + Number(timeOffset) - Number(timeWindowHalf))) as unknown as RuntimeLong;
                    maxTime = (taskOccurrenceTime + Number(timeOffset) + Number(timeWindowHalf)) as unknown as RuntimeLong;
                    predictedEvent = nal.narParameters.RETROSPECTIVE_ANTICIPATIONS
                        || (Number(taskSentence.getOccurrenceTime()) >= Number(nal.time.time()));
                }
            } else {
                while ((newCondition instanceof Conjunction)
                    && ((newCondition as CompoundTerm).term[0] instanceof Interval)) {
                    let interval: Interval = (newCondition as CompoundTerm).term[0] as Interval;
                    delta += interval.time;
                    newCondition = (newCondition as CompoundTerm).setComponent(0, null as unknown as Term, nal.mem());
                }
                content = Statement.make(premise1, newCondition, premise1.getPredicate(), premise1.getTemporalOrder());
            }

        } else {
            content = premise1.getPredicate();
        }

        if (content === null)
            return;

        let occurrence_time: RuntimeLong = nal.getCurrentTask().sentence.getOccurrenceTime();
        if (delta !== (0 as unknown as RuntimeLong)) {
            let baseTime: RuntimeLong = taskSentence.getOccurrenceTime();
            if (baseTime !== Stamp.ETERNAL) {
                baseTime += delta;
                occurrence_time = baseTime;
            }
        }

        let truth1: TruthValue = taskSentence.getTruth();
        let truth2: TruthValue = belief.getTruth();
        let truth: TruthValue = null as unknown as TruthValue;
        let budget: BudgetValue;

        if (!(taskSentence.isQuestion() || taskSentence.isQuest())) {
            if (taskSentence.isGoal()) {
                if (conditionalTask) {
                    truth = TruthFunctions.desireWeak(truth1, truth2, nal.narParameters);
                } else if (deduction) {
                    truth = TruthFunctions.desireInd(truth1, truth2, nal.narParameters);
                } else {
                    truth = TruthFunctions.desireDed(truth1, truth2, nal.narParameters);
                }
            } else {
                if (deduction) {
                    truth = TruthFunctions.deduction(truth1, truth2, nal.narParameters);
                } else if (conditionalTask) {
                    truth = TruthFunctions.induction(truth2, truth1, nal.narParameters);
                } else {
                    truth = TruthFunctions.induction(truth1, truth2, nal.narParameters);
                }
            }
        }

        if (taskSentence.isQuestion() || taskSentence.isQuest()) {
            budget = BudgetFunctions.backwardWeak(truth2, nal);
        } else {
            budget = BudgetFunctions.forward(truth, nal);
        }

        nal.getTheNewStamp().setOccurrenceTime(occurrence_time);
        let ret: NativeList<Task> | null = nal.doublePremiseTask(content, truth, budget, false,
            taskSentence.isJudgment() && deduction); // (allow overlap) when deduction on judgment
        if (!nal.evidentialOverlap && ret !== null && ret.size() > 0 && predictedEvent && taskSentence.isJudgment()
            && truth !== null &&
            truth.getExpectation() > nal.narParameters.DEFAULT_CONFIRMATION_EXPECTATION
            && !premise1Sentence.stamp.alreadyAnticipatedNegConfirmation) {
            premise1Sentence.stamp.alreadyAnticipatedNegConfirmation = true;
            // Java 原类型：Map<Term, Term>；原实现：LinkedHashMap。
            // This is a temporary substitution map, so preserve the Java Map
            // boundary while using the native equality-aware ordered map.
            ProcessAnticipation.anticipate(nal, premise1Sentence, budget, minTime, maxTime, 1,
                new NativeMap<Term, Term>());
        }
    }

    /**
     * {<(&&, S1, S2, S3) <=> P>, S1} |- <(&&, S2,
     * S3) <=> P>
     * <br>
     * {<(&&, S2, S3) <=> P>, <S1 ==> S2>} |-
     * <(&&, S1, S3) <=> P>
     * <br>
     * {<(&&, S1, S3) <=> P>, <S1 ==>
     *
     * @param premise1 The equivalence premise
     * @param index    The location of the shared term in the condition of premise1
     * @param premise2 The premise which, or part of which, appears in the condition
     *                 of premise1
     * @param side     The location of the shared term in premise2: 0 for subject, 1
     *                 for predicate, -1 for the whole term
     * @param nal      Reference to the memory
     */
    public static conditionalAna(premise1: Equivalence, index: ShortNumber, premise2: Term, side: IntNumber,
        nal: DerivationContext): void {
        let task: Task = nal.getCurrentTask();
        let taskSentence: Sentence = task.sentence;
        const belief = nal.getCurrentBelief();
        if (belief === null) {
            return;
        }
        let conditionalTask: boolean = Variables.hasSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT,
            premise2, belief.term);
        let commonComponent: Term;
        let newComponent: Term = null as unknown as Term;
        if (side === 0) {
            commonComponent = (premise2 as Statement).getSubject();
            newComponent = (premise2 as Statement).getPredicate();
        } else if (side === 1) {
            commonComponent = (premise2 as Statement).getPredicate();
            newComponent = (premise2 as Statement).getSubject();
        } else {
            commonComponent = premise2;
        }

        let tm: Term = premise1.getSubject();
        if (!(tm instanceof Conjunction)) {
            return;
        }
        let oldCondition: Conjunction = tm as Conjunction;

        let u: Term[] = [premise1, premise2];
        let match: boolean = Variables.unify(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, oldCondition.term[index],
            commonComponent, u);
        premise1 = u[0] as Equivalence;
        premise2 = u[1];

        if (!match && (commonComponent.constructor === oldCondition.constructor)) {
            u = [premise1, premise2];
            match = Variables.unify(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, oldCondition.term[index],
                (commonComponent as CompoundTerm).term[index], u);
            premise1 = u[0] as Equivalence;
            premise2 = u[1];
        }
        if (!match) {
            return;
        }
        let conjunctionOrder: IntNumber = oldCondition.getTemporalOrder();
        if (conjunctionOrder === ORDER_FORWARD) {
            if (index > 0) {
                return;
            }
            if ((side === 0) && (premise2.getTemporalOrder() === ORDER_FORWARD)) {
                return;
            }
            if ((side === 1) && (premise2.getTemporalOrder() === ORDER_BACKWARD)) {
                return;
            }
        }
        let newCondition: Term;
        if (oldCondition.equals(commonComponent)) {
            newCondition = null as unknown as Term;
        } else {
            newCondition = oldCondition.setComponent(index, newComponent as Term, nal.mem());
        }
        let content: Term | null;
        if (newCondition !== null) {
            content = Statement.make(premise1, newCondition, premise1.getPredicate(), premise1.getTemporalOrder());
        } else {
            content = premise1.getPredicate();
        }

        if (content === null)
            return;

        let truth1: TruthValue = taskSentence.getTruth();
        let truth2: TruthValue = belief.getTruth();
        let truth: TruthValue = null as unknown as TruthValue;
        let budget: BudgetValue;
        if (!(taskSentence.isQuestion() || taskSentence.isQuest())) {
            if (taskSentence.isGoal()) {
                truth = TruthFunctions.lookupTruthFunctionByBoolAndCompute(conditionalTask,
                    TruthFunctions.EnumType.DESIREWEAK, TruthFunctions.EnumType.DESIREDED, truth1, truth2,
                    nal.narParameters);
            } else {
                truth = TruthFunctions.lookupTruthFunctionByBoolAndCompute(conditionalTask,
                    TruthFunctions.EnumType.COMPARISON, TruthFunctions.EnumType.ANALOGY, truth1, truth2,
                    nal.narParameters);
            }
        }

        if (taskSentence.isQuestion() || taskSentence.isQuest()) {
            budget = BudgetFunctions.backwardWeak(truth2, nal);
        } else {
            budget = BudgetFunctions.forward(truth, nal);
        }

        nal.doublePremiseTask(content, truth, budget, false, taskSentence.isJudgment() && !conditionalTask); // (allow
        // overlap)
        // when
        // !conditionalTask
        // on
        // judgment
    }

    /**
     * {<(&&, S2, S3) ==> P>, <(&&, S1, S3) ==>
     * P>} |- <S1 ==> S2>
     *
     * @param cond1 The condition of the first premise
     * @param cond2 The condition of the second premise
     * @param st1   The first premise
     * @param st2   The second premise
     * @param nal   Reference to the memory
     * @return Whether there are derived tasks
     */
    public static conditionalAbd(cond1: Term, cond2: Term, st1: Statement, st2: Statement,
        nal: DerivationContext): boolean {
        if (!(st1 instanceof Implication) || !(st2 instanceof Implication)) {
            return false;
        }
        if (!(cond1 instanceof Conjunction) && !(cond2 instanceof Conjunction)) {
            return false;
        }
        let order1: IntNumber = st1.getTemporalOrder();
        let order2: IntNumber = st2.getTemporalOrder();
        if (order1 !== TemporalRules.reverseOrder(order2)) {
            return false;
        }
        let term1: Term = null as unknown as Term;
        let term2: Term = null as unknown as Term;
        if (cond1 instanceof Conjunction) {
            term1 = reduceComponents(cond1 as CompoundTerm, cond2, nal.mem());
        }
        if (cond2 instanceof Conjunction) {
            term2 = reduceComponents(cond2 as CompoundTerm, cond1, nal.mem());
        }
        if ((term1 === null) && (term2 === null)) {
            return false;
        }
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        const belief = nal.getCurrentBelief();
        if (belief === null) {
            return false;
        }
        let value1: TruthValue = sentence.getTruth();
        let value2: TruthValue = belief.getTruth();

        let keepOrder: boolean = Variables.hasSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, st1,
            task.getTerm());

        // we folded the logic to use loops for more compact code
        for (let loop: IntNumber = 0; loop < 2; loop++) {
            let isFirstLoop: boolean = loop === 0;
            let term1InLoop: Term = isFirstLoop ? term1 : term2;
            let term2InLoop: Term = isFirstLoop ? term2 : term1;

            if (term1InLoop === null) {
                continue;
            }
            let content: Term | null;
            let truth: TruthValue = null as unknown as TruthValue;
            let budget: BudgetValue;

            if (term2InLoop !== null) {
                content = Statement.make(isFirstLoop ? st2 : st1, term2InLoop, term1InLoop,
                    isFirstLoop ? st2.getTemporalOrder() : st1.getTemporalOrder());
            } else {
                content = term1InLoop;
                if (content.hasVarIndep()) {
                    return false;
                }
            }

            if (sentence.isQuestion() || sentence.isQuest()) {
                budget = BudgetFunctions.backwardWeak(value2, nal);
            } else {
                if (sentence.isGoal()) {
                    truth = TruthFunctions.lookupTruthFunctionByBoolAndCompute(keepOrder,
                        TruthFunctions.EnumType.DESIREDED, TruthFunctions.EnumType.DESIREIND, value1, value2,
                        nal.narParameters);
                } else { // isJudgment
                    if (isFirstLoop) {
                        truth = TruthFunctions.abduction(value2, value1, nal.narParameters);
                    } else {
                        truth = TruthFunctions.abduction(value1, value2, nal.narParameters);
                    }
                }
                budget = BudgetFunctions.forward(truth, nal);
            }
            if (content === null) {
                continue;
            }
            nal.doublePremiseTask(content, truth, budget, false, false);
        }

        return true;
    }

    /**
     * {(&&, <#x() --> S>, <#x() --> P>>, <M -->
     * P>} |- <M --> S>
     *
     * @param compound     The compound term to be decomposed
     * @param component    The part of the compound to be removed
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    public static elimiVarDep(compound: CompoundTerm, component: Term, compoundTask: boolean,
        nal: DerivationContext): void {
        let comp: Term = null as unknown as Term;
        for (let t of compound.term) {
            let unify: Term[] = [t, component];
            if (Variables.unify(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, unify)) {
                comp = t;
                break;
            }
            if (Variables.unify(nal.memory.randomNumber, Symbols.VAR_QUERY, unify)) {
                comp = t;
                break;
            }
        }
        if (comp === null) {
            return;
        }
        let content: Term = reduceComponents(compound, comp, nal.mem());
        if ((content === null) || ((content instanceof Statement) && (content as Statement).invalid())) {
            return;
        }
        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        const belief = nal.getCurrentBelief();
        if (belief === null) {
            return;
        }
        let v1: TruthValue = sentence.getTruth();
        let v2: TruthValue = belief.getTruth();
        let truth: TruthValue = null as unknown as TruthValue;
        let budget: BudgetValue;

        if (!(sentence.isQuestion() || sentence.isQuest())) {
            if (sentence.isGoal()) {
                truth = TruthFunctions.lookupTruthFunctionByBoolAndCompute(compoundTask,
                    TruthFunctions.EnumType.DESIREDED, TruthFunctions.EnumType.DESIREIND, v1, v2,
                    nal.narParameters);
            } else {
                truth = (compoundTask ? TruthFunctions.anonymousAnalogy(v1, v2, nal.narParameters)
                    : TruthFunctions.anonymousAnalogy(v2, v1, nal.narParameters));
            }
        }

        if (sentence.isQuestion() || sentence.isQuest()) {
            budget = (compoundTask ? BudgetFunctions.backward(v2, nal) : BudgetFunctions.backwardWeak(v2, nal));
        } else {
            budget = BudgetFunctions.compoundForward(truth, content, nal);
        }

        nal.doublePremiseTask(content, truth, budget, false, false);
    }
}
