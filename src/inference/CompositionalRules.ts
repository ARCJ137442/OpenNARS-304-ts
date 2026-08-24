//! Java source: opennars/inference/CompositionalRules.java
import { java, JavaObject, type int, type long, type float } from "jree";
import { BudgetValue } from "../entity/BudgetValue.ts";
import type { Concept } from "../entity/Concept.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Stamp } from "../entity/Stamp.ts";
import { Task } from "../entity/Task.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { Debug } from "../main/Debug.ts";
import { Symbols } from "../io/Symbols.ts";
import { Statement } from "../language/Statement.ts";
import { CompoundTerm } from "../language/CompoundTerm.ts";
import { Conjunction } from "../language/Conjunction.ts";
import { Disjunction } from "../language/Disjunction.ts";
import { DifferenceExt } from "../language/DifferenceExt.ts";
import { DifferenceInt } from "../language/DifferenceInt.ts";
import { Equivalence } from "../language/Equivalence.ts";
import { Image } from "../language/Image.ts";
import { ImageExt } from "../language/ImageExt.ts";
import { ImageInt } from "../language/ImageInt.ts";
import { Implication } from "../language/Implication.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { IntersectionExt } from "../language/IntersectionExt.ts";
import { IntersectionInt } from "../language/IntersectionInt.ts";
import { Interval } from "../language/Interval.ts";
import { Negation } from "../language/Negation.ts";
import { SetExt } from "../language/SetExt.ts";
import { SetInt } from "../language/SetInt.ts";
import { Similarity } from "../language/Similarity.ts";
import { Terms } from "../language/Terms.ts";
import { Variable } from "../language/Variable.ts";
import { Variables } from "../language/Variables.ts";
import type { Term } from "../language/Term.ts";
import { BudgetFunctions } from "./BudgetFunctions.ts";
import { TemporalRules } from "./TemporalRules.ts";
import { TruthFunctions } from "./TruthFunctions.ts";
import type { DerivationContext } from "../control/DerivationContext.ts";
import { Float32Math } from "../runtime/Float32.ts";

export type Pair<L, R> = {
    getLeft(): L;
    getRight(): R;
    equals(other: unknown): boolean;
    hashCode(): number;
};

const pairValueEquals = (left: unknown, right: unknown): boolean => {
    if (left === right) return true;
    const equals = (left as { equals?: unknown } | null)?.equals;
    return typeof equals === "function" && Boolean(equals.call(left, right));
};

const javaStringHashCode = (value: string): number => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = ((hash * 31) + value.charCodeAt(i)) | 0;
    }
    return hash;
};

const pairValueHashCode = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const hashCode = (value as { hashCode?: unknown }).hashCode;
    if (typeof hashCode === "function") return Number(hashCode.call(value));
    return javaStringHashCode(String(value));
};

const pair = <L, R>(left: L, right: R): Pair<L, R> => ({
    getLeft: () => left,
    getRight: () => right,
    equals: (other: unknown): boolean => {
        if (other === null || typeof other !== "object") return false;
        const otherPair = other as Partial<Pair<L, R>>;
        return typeof otherPair.getLeft === "function"
            && typeof otherPair.getRight === "function"
            && pairValueEquals(left, otherPair.getLeft())
            && pairValueEquals(right, otherPair.getRight());
    },
    hashCode: (): number => pairValueHashCode(left) ^ pairValueHashCode(right),
});

const union = TruthFunctions.union;
const intersection = TruthFunctions.intersection;
const negation = TruthFunctions.negation;
const induction = TruthFunctions.induction;
const comparison = TruthFunctions.comparison;
const abduction = TruthFunctions.abduction;
const lookupTruthOrNull = TruthFunctions.lookupTruthOrNull;
const reduceDisjunction = TruthFunctions.reduceDisjunction;
const reduceConjunction = TruthFunctions.reduceConjunction;
const reduceConjunctionNeg = TruthFunctions.reduceConjunctionNeg;
const reduceComponents = Terms.reduceComponents;
const EnumType = TruthFunctions.EnumType;



/**
 * Compound term composition and decomposition rules, with two premises.
 * <p>
 * New compound terms are introduced only in forward inference, while
 * decompositional rules are also used in backward inference
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class CompositionalRules extends JavaObject {

    /* -------------------- intersections and differences -------------------- */
    /**
     * {<S ==> M>, <P ==> M>} |- <br>
     * {<(S|P) ==> M>, <(S&P) ==> M>, <(S-P) ==> M>,
     * <(P-S) ==> M>}
     *
     * @param taskContent   The first premise
     * @param beliefContent The second premise
     * @param index         The location of the shared term
     * @param nal           Reference to the memory
     */
    protected static composeCompound(taskContent: Statement, beliefContent: Statement, index: int,
        nal: DerivationContext): void {
        if ((!nal.getCurrentTask().sentence.isJudgment()) || (taskContent.getClass() !== beliefContent.getClass())) {
            return;
        }
        let componentT: Term = taskContent.term[1 - index];
        let componentB: Term = beliefContent.term[1 - index];
        let componentCommon: Term = taskContent.term[index];
        let order1: int = taskContent.getTemporalOrder();
        let order2: int = beliefContent.getTemporalOrder();
        let order: int = TemporalRules.composeOrder(order1, order2);
        if (order === TemporalRules.ORDER_INVALID) {
            return;
        }
        if ((componentT instanceof CompoundTerm) && (componentT as CompoundTerm).containsAllTermsOf(componentB)) {
            CompositionalRules.decomposeCompound(componentT as CompoundTerm, componentB, componentCommon, index, true, order, nal);
            return;
        } else if ((componentB instanceof CompoundTerm) && (componentB as CompoundTerm).containsAllTermsOf(componentT)) {
            CompositionalRules.decomposeCompound(componentB as CompoundTerm, componentT, componentCommon, index, false, order, nal);
            return;
        }
        let truthT: TruthValue = nal.getCurrentTask().sentence.getTruth();
        let truthB: TruthValue = nal.getCurrentBelief().getTruth();
        let truthOr: TruthValue = union(truthT, truthB, nal.narParameters);
        let truthAnd: TruthValue = intersection(truthT, truthB, nal.narParameters);
        let truthDif: TruthValue = null;
        let termOr: Term = null;
        let termAnd: Term = null;
        let termDif: Term = null;
        if (index === 0) {
            if (taskContent instanceof Inheritance) {
                termOr = IntersectionInt.make(componentT, componentB);
                termAnd = IntersectionExt.make(componentT, componentB);
                if (truthB.isNegative()) {
                    if (!truthT.isNegative()) {
                        termDif = DifferenceExt.make(componentT, componentB);
                        truthDif = intersection(truthT, negation(truthB, nal.narParameters), nal.narParameters);
                    }
                } else if (truthT.isNegative()) {
                    termDif = DifferenceExt.make(componentB, componentT);
                    truthDif = intersection(truthB, negation(truthT, nal.narParameters), nal.narParameters);
                }
            } else if (taskContent instanceof Implication) {
                termOr = Disjunction.make(componentT, componentB);
                termAnd = Conjunction.make(componentT, componentB);
            }
            if (!(componentT.cloneDeep().equals(componentB.cloneDeep()))) {
                CompositionalRules.processComposed(taskContent, componentCommon, termOr, order, truthOr, nal);
                CompositionalRules.processComposed(taskContent, componentCommon, termAnd, order, truthAnd, nal);
            }
            CompositionalRules.processComposed(taskContent, componentCommon, termDif, order, truthDif, nal);
        } else { // index == 1
            if (taskContent instanceof Inheritance) {
                termOr = IntersectionExt.make(componentT, componentB);
                termAnd = IntersectionInt.make(componentT, componentB);
                if (truthB.isNegative()) {
                    if (!truthT.isNegative()) {
                        termDif = DifferenceInt.make(componentT, componentB);
                        truthDif = intersection(truthT, negation(truthB, nal.narParameters), nal.narParameters);
                    }
                } else if (truthT.isNegative()) {
                    termDif = DifferenceInt.make(componentB, componentT);
                    truthDif = intersection(truthB, negation(truthT, nal.narParameters), nal.narParameters);
                }
            } else if (taskContent instanceof Implication) {
                termOr = Conjunction.make(componentT, componentB);
                termAnd = Disjunction.make(componentT, componentB);
            }

            if (!(componentT.cloneDeep().equals(componentB.cloneDeep()))) {
                CompositionalRules.processComposed(taskContent, termOr, componentCommon, order, truthOr, nal);
                CompositionalRules.processComposed(taskContent, termAnd, componentCommon, order, truthAnd, nal);
            }
            CompositionalRules.processComposed(taskContent, termDif, componentCommon, order, truthDif, nal);
        }
    }

    /**
     * Finish composing implication term
     *
     * @param statement Type of the contentInd
     * @param subject   Subject of contentInd
     * @param predicate Predicate of contentInd
     * @param truth     TruthValue of the contentInd
     * @param nal       Reference to the memory
     */
    private static processComposed(statement: Statement, subject: Term, predicate: Term,
        order: int, truth: TruthValue, nal: DerivationContext): void {
        if ((subject === null) || (predicate === null)) {
            return;
        }
        let content: Term = Statement.make(statement, subject, predicate, order);
        if ((content === null) || statement === null || content.equals(statement)
            || content.equals(nal.getCurrentBelief().term)) {
            return;
        }
        let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content, nal);
        nal.doublePremiseTask(content, truth, budget, false, false); // (allow overlap) but not needed here, isn't
        // detachment, this one would be even problematic
        // from control perspective because its composition
    }

    /**
     * {<(S|P) ==> M>, <P ==> M>} |- <S ==> M>
     *
     * @param term1        The other term in the contentInd
     * @param index        The location of the shared term: 0 for subject, 1 for
     *                     predicate
     * @param compoundTask Whether the implication comes from the task
     * @param nal          Reference to the memory
     */
    private static decomposeCompound(compound: CompoundTerm, component: Term, term1: Term,
        index: int, compoundTask: boolean, order: int, nal: DerivationContext): void {

        if ((compound instanceof Statement) || (compound instanceof ImageExt) || (compound instanceof ImageInt)) {
            return;
        }
        let term2: Term = reduceComponents(compound, component, nal.mem());
        if (term2 === null) {
            return;
        }

        let delta: long = 0;
        while ((term2 instanceof Conjunction) && ((term2 as CompoundTerm).term[0] instanceof Interval)) {
            let interval: Interval = (term2 as CompoundTerm).term[0] as Interval;
            delta += interval.time;
            term2 = (term2 as CompoundTerm).setComponent(0, null, nal.mem());
        }

        let task: Task = nal.getCurrentTask();
        let sentence: Sentence = task.sentence;
        let belief: Sentence = nal.getCurrentBelief();
        let oldContent: Statement = task.getTerm() as Statement;

        let v1: TruthValue = compoundTask ? sentence.getTruth() : belief.getTruth();
        let v2: TruthValue = compoundTask ? belief.getTruth() : sentence.getTruth();

        let content: Term = Statement.make(oldContent, index === 0 ? term1 : term2, index === 0 ? term2 : term1, order);
        if (content === null) {
            return;
        }

        let truth: TruthValue = null;
        if (index === 0) {
            if (oldContent instanceof Inheritance) {
                truth = lookupTruthOrNull(v1, v2, nal.narParameters,
                    compound instanceof IntersectionExt, EnumType.REDUCECONJUNCTION,
                    compound instanceof IntersectionInt, EnumType.REDUCEDISJUNCTION,
                    compound instanceof SetInt && component instanceof SetInt, EnumType.REDUCECONJUNCTION,
                    compound instanceof SetExt && component instanceof SetExt, EnumType.REDUCEDISJUNCTION);

                if (truth === null && compound instanceof DifferenceExt) {
                    if (compound.term[0].equals(component)) {
                        truth = reduceDisjunction(v2, v1, nal.narParameters);
                    } else {
                        truth = reduceConjunctionNeg(v1, v2, nal.narParameters);
                    }
                }
            } else if (oldContent instanceof Implication) {
                if (compound instanceof Conjunction) {
                    truth = reduceConjunction(v1, v2, nal.narParameters);
                } else if (compound instanceof Disjunction) {
                    truth = reduceDisjunction(v1, v2, nal.narParameters);
                }
            }
        } else {
            if (oldContent instanceof Inheritance) {
                truth = lookupTruthOrNull(v1, v2, nal.narParameters,
                    compound instanceof IntersectionInt, EnumType.REDUCECONJUNCTION,
                    compound instanceof IntersectionExt, EnumType.REDUCEDISJUNCTION,
                    compound instanceof SetExt && component instanceof SetExt, EnumType.REDUCECONJUNCTION,
                    compound instanceof SetInt && component instanceof SetInt, EnumType.REDUCEDISJUNCTION);

                if (truth === null && compound instanceof DifferenceInt) {
                    if (compound.term[1].equals(component)) {
                        truth = reduceDisjunction(v2, v1, nal.narParameters);
                    } else {
                        truth = reduceConjunctionNeg(v1, v2, nal.narParameters);
                    }
                }
            } else if (oldContent instanceof Implication) {
                if (compound instanceof Disjunction) {
                    truth = reduceConjunction(v1, v2, nal.narParameters);
                } else if (compound instanceof Conjunction) {
                    truth = reduceDisjunction(v1, v2, nal.narParameters);
                }
            }
        }
        if (truth !== null) {
            let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content, nal);
            if (delta !== 0) {
                let baseTime: long = task.sentence.getOccurrenceTime();
                if (baseTime !== Stamp.ETERNAL) {
                    baseTime += delta;
                    nal.getTheNewStamp().setOccurrenceTime(baseTime);
                }
            }
            nal.doublePremiseTask(content, truth, budget, false, true); // (allow overlap), a form of detachment
        }
    }

    /**
     * {(||, S, P), P} |- S {(&&, S, P), P} |- S
     *
     * @param compoundTask Whether the implication comes from the task
     * @param nal          Reference to the memory
     */
    protected static decomposeStatement(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        let isTemporalConjunction: boolean = (compound instanceof Conjunction) && !(compound as Conjunction).isSpatial;
        if (isTemporalConjunction && (compound.getTemporalOrder() === TemporalRules.ORDER_FORWARD) && (index !== 0)) {
            return;
        }
        let occurrence_time: long = nal.getCurrentTask().sentence.getOccurrenceTime();
        if (isTemporalConjunction && (compound.getTemporalOrder() === TemporalRules.ORDER_FORWARD)) {
            if (!nal.getCurrentTask().sentence.isEternal() && compound.term[index + 1] instanceof Interval) {
                let shift_occurrence: long = (compound.term[index + 1] as Interval).time;
                occurrence_time = nal.getCurrentTask().sentence.getOccurrenceTime() + shift_occurrence;
            }
        }

        let task: Task = nal.getCurrentTask();
        let taskSentence: Sentence = task.sentence;
        let belief: Sentence = nal.getCurrentBelief();
        let content: Term = reduceComponents(compound, component, nal.mem());
        if (content === null) {
            return;
        }
        let truth: TruthValue = null;
        let budget: BudgetValue;
        if (taskSentence.isQuestion() || taskSentence.isQuest()) {
            budget = BudgetFunctions.compoundBackward(content, nal);
            nal.getTheNewStamp().setOccurrenceTime(occurrence_time);
            nal.doublePremiseTask(content, truth, budget, false, false);
            // special inference to answer conjunctive questions with query variables
            if (taskSentence.term.hasVarQuery()) {
                let contentConcept: Concept = nal.mem().concept(content);
                if (contentConcept === null) {
                    return;
                }
                let contentBelief: Sentence = contentConcept.getBelief(nal, task);
                if (contentBelief === null) {
                    return;
                }

                let contentTask: Task = new Task(contentBelief, task.budget, Task.EnumType.DERIVED);

                nal.setCurrentTask(contentTask);
                let conj: Term = Conjunction.make(component, content);
                truth = intersection(contentBelief.getTruth(), belief.getTruth(), nal.narParameters);
                budget = BudgetFunctions.compoundForward(truth, conj, nal);
                nal.getTheNewStamp().setOccurrenceTime(occurrence_time);
                nal.doublePremiseTask(conj, truth, budget, false, false);
            }
        } else {
            let v1: TruthValue = compoundTask ? taskSentence.getTruth() : belief.getTruth();
            let v2: TruthValue = compoundTask ? belief.getTruth() : taskSentence.getTruth();

            if (compound instanceof Conjunction || compound instanceof Disjunction) {
                if (taskSentence.isGoal() && !compoundTask) {
                    return;
                }
            } else {
                return;
            }

            if (compound instanceof Conjunction) {
                if (taskSentence.isGoal()) {
                    truth = intersection(v1, v2, nal.narParameters);
                } else { // isJudgment
                    truth = reduceConjunction(v1, v2, nal.narParameters);
                }
            } else {
                if (taskSentence.isGoal()) {
                    truth = reduceConjunction(v2, v1, nal.narParameters);
                } else { // isJudgment
                    truth = reduceDisjunction(v1, v2, nal.narParameters);
                }
            }

            budget = BudgetFunctions.compoundForward(truth, content, nal);
        }
        nal.getTheNewStamp().setOccurrenceTime(occurrence_time);
        nal.doublePremiseTask(content, truth, budget, false, false);
    }

    /* --------------- rules used for variable introduction --------------- */
    /**
     * Introduce a dependent variable in an outer-layer conjunction
     * <br>
     * {<S --> P1>, <S --> P2>} |- (&&, <#x -->
     * P1>, <#x --> P2>)
     *
     * @param taskContent   The first premise <M --> S>
     * @param beliefContent The second premise <M --> P>
     * @param index         The location of the shared term: 0 for subject, 1 for
     *                      predicate
     * @param nal           Reference to the memory
     */
    public static introVarOuter(taskContent: Statement, beliefContent: Statement, index: int,
        nal: DerivationContext): void {

        if (!(taskContent instanceof Inheritance)) {
            return;
        }

        let term11: Term = taskContent.getSubject();
        let term21: Term = beliefContent.getSubject();
        let term12: Term = taskContent.getPredicate();
        let term22: Term = beliefContent.getPredicate();
        let state1: Statement = Inheritance.make(term11, term12);
        let state2: Statement = Inheritance.make(term21, term22);
        let truthT: TruthValue | null = nal.getCurrentTask().sentence.truth;
        let truthB: TruthValue | null = nal.getCurrentBelief().truth;
        if ((truthT === null) || (truthB === null)) {
            if (Debug.DETAILED) {
                java.lang.System.out.println("ERROR: Belief with null truth value. (introVarOuter)");
            }
            return;
        }
        for (let subjectIntroduction of [true, false]) {
            let contents: java.util.Set<Pair<Term, float>> = CompositionalRules.introduceVariables(nal,
                Implication.make(state1, state2), subjectIntroduction);
            for (let content_penalty of contents) {
                let truth: TruthValue = induction(truthT, truthB, nal.narParameters)
                    .mulConfidence(content_penalty.getRight());
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content_penalty.getLeft(), nal);
                nal.doublePremiseTask(content_penalty.getLeft(), truth, budget.clone(), false, false);
            }

            contents = CompositionalRules.introduceVariables(nal, Implication.make(state2, state1),
                subjectIntroduction);
            for (let content_penalty of contents) {
                let truth: TruthValue = induction(truthB, truthT, nal.narParameters)
                    .mulConfidence(content_penalty.getRight());
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content_penalty.getLeft(), nal);
                nal.doublePremiseTask(content_penalty.getLeft(), truth, budget.clone(), false, false);
            }

            contents = CompositionalRules.introduceVariables(nal, Equivalence.make(state1, state2),
                subjectIntroduction);
            for (let content_penalty of contents) {
                let truth: TruthValue = comparison(truthT, truthB, nal.narParameters)
                    .mulConfidence(content_penalty.getRight());
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content_penalty.getLeft(), nal);
                nal.doublePremiseTask(content_penalty.getLeft(), truth, budget.clone(), false, false);
            }

            contents = CompositionalRules.introduceVariables(nal, Conjunction.make(state1, state2),
                subjectIntroduction);
            for (let content_penalty of contents) {
                let truth: TruthValue = intersection(truthT, truthB, nal.narParameters)
                    .mulConfidence(content_penalty.getRight());
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content_penalty.getLeft(), nal);
                nal.doublePremiseTask(content_penalty.getLeft(), truth, budget.clone(), false, false);
            }
        }
    }

    /**
     * {<M --> S>, <C ==> <M --> P>>} |- <(&&,
     * <#x --> S>, C) ==> <#x --> P>>
     * <br>
     * {<M --> S>, (&&, C, <M --> P>)} |- (&&, C,
     * <<#x --> S> ==> <#x --> P>>)
     *
     * @param oldCompound The whole contentInd of the first premise, Implication
     *                    or Conjunction
     * @param nal         Reference to the memory
     */
    protected static introVarInner(premise1: Statement, premise2: Statement, oldCompound: CompoundTerm,
        nal: DerivationContext): boolean {
        let task: Task = nal.getCurrentTask();
        let taskSentence: Sentence = task.sentence;
        if (!taskSentence.isJudgment() || (premise1.getClass() !== premise2.getClass())
            || oldCompound.containsTerm(premise1)) {
            return false;
        }
        let belief: Sentence = nal.getCurrentBelief();

        let b1: boolean = false;
        let b2: boolean = false;

        {
            let content: Term = Conjunction.make(premise1, oldCompound);
            if (!(content instanceof CompoundTerm)) {
                return false;
            }
            for (let subjectIntro of [true, false]) {
                let conts: java.util.Set<Pair<Term, float>> = CompositionalRules.introduceVariables(nal, content, subjectIntro);
                for (let content_penalty of conts) {
                    let truth: TruthValue = intersection(taskSentence.getTruth(), belief.getTruth(), nal.narParameters)
                        .mulConfidence(content_penalty.getRight());
                    let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
                    b1 |= (nal.doublePremiseTask(content_penalty.getLeft(), truth, budget, false, false)) !== null;
                }
            }
        }

        {
            let content: Term = Implication.make(premise1, oldCompound);
            if ((content === null) || (!(content instanceof CompoundTerm))) {
                return false;
            }
            for (let subjectIntro of [true, false]) {
                let conts: java.util.Set<Pair<Term, float>> = CompositionalRules.introduceVariables(nal, content, subjectIntro);
                for (let content_penalty of conts) {
                    let truth: TruthValue;
                    if (premise1.equals(taskSentence.term)) {
                        truth = induction(belief.getTruth(), taskSentence.getTruth(), nal.narParameters);
                    } else {
                        truth = induction(taskSentence.getTruth(), belief.getTruth(), nal.narParameters);
                    }
                    truth.mulConfidence(content_penalty.getRight());
                    let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
                    b2 |= nal.doublePremiseTask(content_penalty.getLeft(), truth, budget, false, false) !== null;
                }
            }
        }

        return b1 || b2;
    }

    /*
     * The other inversion (abduction) should also be studied:
     * IN: <<lock1 --> (/,open,$1,_)> ==> <$1 --> key>>.
     * IN: <(&&,<#1 --> lock>,<#1 --> (/,open,$2,_)>) ==> <$2 --> key>>.
     * OUT: <lock1 --> lock>.
     * http://code.google.com/p/open-nars/issues/detail?id=40&can=1
     */
    public static eliminateVariableOfConditionAbductive(figure: int, sentence: Sentence,
        belief: Sentence, nal: DerivationContext): void {
        let T1: Statement = sentence.term as Statement;
        let T2: Statement = belief.term as Statement;

        let S1: Term = T2.getSubject();
        let S2: Term = T1.getSubject();
        let P1: Term = T2.getPredicate();
        let P2: Term = T1.getPredicate();

        let res1: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        let
            res2: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        let
            res3: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        let
            res4: java.util.Map<Term, Term> = new java.util.LinkedHashMap();

        if (figure === 21) {
            Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, P1, S2, res1, res2);
        } else if (figure === 12) {
            Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, S1, P2, res1, res2);
        } else if (figure === 11) {
            Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, S1, S2, res1, res2);
        } else if (figure === 22) {
            Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT, P1, P2, res1, res2);
        }

        // this part is independent, the rule works if it unifies
        T1 = T1.applySubstitute(res2) as Statement;
        if (T1 === null) {
            return;
        }
        T2 = T2.applySubstitute(res1) as Statement;
        if (T2 === null) {
            return;
        }

        if (figure === 21) {
            // update the variables because T1 and T2 may have changed
            S1 = T2.getSubject();
            P2 = T1.getPredicate();

            CompositionalRules.eliminateVariableOfConditionAbductiveTryCrossUnification(sentence, belief, nal, S1, P2, res3, res4);
        } else if (figure === 12) {
            // update the variables because T1 and T2 may have changed
            S2 = T1.getSubject();
            P1 = T2.getPredicate();

            CompositionalRules.eliminateVariableOfConditionAbductiveTryCrossUnification(sentence, belief, nal, S2, P1, res3, res4);
        } else if (figure === 11) {
            // update the variables because T1 and T2 may have changed
            P1 = T2.getPredicate();
            P2 = T1.getPredicate();

            CompositionalRules.eliminateVariableOfConditionAbductiveTryCrossUnification(sentence, belief, nal, P1, P2, res3, res4);
        } else if (figure === 22) {
            // update the variables because T1 and T2 may have changed
            S1 = T2.getSubject();
            S2 = T1.getSubject();

            if (S1 instanceof Conjunction) {
                // try to unify S2 with a component
                for (let s1 of (S1 as CompoundTerm).term) {
                    res3.clear();
                    res4.clear(); // here the dependent part matters, see example of Issue40
                    if (Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, s1, S2, res3, res4)) {
                        for (let s2 of (S1 as CompoundTerm).term) {
                            if (!(s2 instanceof CompoundTerm)) {
                                continue;
                            }
                            s2 = (s2 as CompoundTerm).applySubstitute(res3);
                            if (s2 === null || s2.hasVarIndep()) {
                                continue;
                            }
                            if (s2 !== null && !s2.equals(s1) && (sentence.truth !== null) && (belief.truth !== null)) {
                                let truth: TruthValue = abduction(sentence.truth, belief.truth, nal.narParameters);
                                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, s2, nal);
                                nal.doublePremiseTask(s2, truth, budget, false, false);
                            }
                        }
                    }
                }
            }
            if (S2 instanceof Conjunction) {
                // try to unify S1 with a component
                for (let s1 of (S2 as CompoundTerm).term) {
                    res3.clear();
                    res4.clear(); // here the dependent part matters, see example of Issue40
                    if (Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, s1, S1, res3, res4)) {
                        for (let s2 of (S2 as CompoundTerm).term) {
                            if (!(s2 instanceof CompoundTerm)) {
                                continue;
                            }

                            s2 = (s2 as CompoundTerm).applySubstitute(res3);
                            if (s2 === null || s2.hasVarIndep()) {
                                continue;
                            }
                            if (s2 !== null && !s2.equals(s1) && (sentence.truth !== null) && (belief.truth !== null)) {
                                let truth: TruthValue = abduction(sentence.truth, belief.truth, nal.narParameters);
                                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, s2, nal);
                                nal.doublePremiseTask(s2, truth, budget, false, false);
                            }
                        }
                    }
                }
            }
        }
    }

    private static eliminateVariableOfConditionAbductiveTryCrossUnification(sentence: Sentence, belief: Sentence,
        nal: DerivationContext, s1: Term, p2: Term, res3: java.util.Map<Term, Term>, res4: java.util.Map<Term, Term>): void {
        if (s1 instanceof Conjunction) {
            // try to unify P2 with a component
            CompositionalRules.eliminateVariableOfConditionAbductiveTryUnification1(sentence, belief, nal, p2, s1 as CompoundTerm, res3,
                res4);
        }
        if (p2 instanceof Conjunction) {
            // try to unify S1 with a component
            CompositionalRules.eliminateVariableOfConditionAbductiveTryUnification1(sentence, belief, nal, s1, p2 as CompoundTerm, res3,
                res4);
        }
    }

    private static eliminateVariableOfConditionAbductiveTryUnification1(sentence: Sentence, belief: Sentence,
        nal: DerivationContext, p1: Term, p2: CompoundTerm, res3: java.util.Map<Term, Term>, res4: java.util.Map<Term, Term>): void {
        for (let s1 of p2.term) {
            res3.clear();
            res4.clear(); // here the dependent part matters, see example of Issue40
            if (Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_DEPENDENT, s1, p1, res3, res4)) {
                CompositionalRules.eliminateVariableOfConditionAbductiveInner1(sentence, belief, nal, p2, res3, s1);
            }
        }
    }

    private static eliminateVariableOfConditionAbductiveInner1(sentence: Sentence, belief: Sentence,
        nal: DerivationContext, s1: CompoundTerm, res3: java.util.Map<Term, Term>, s12: Term): void {
        for (let s2 of s1.term) {
            if (!(s2 instanceof CompoundTerm)) {
                continue;
            }
            s2 = (s2 as CompoundTerm).applySubstitute(res3);
            if (s2 === null || s2.hasVarIndep()) {
                continue;
            }
            if (!s2.equals(s12) && (sentence.truth !== null) && (belief.truth !== null)) {
                let truth: TruthValue = abduction(sentence.truth, belief.truth, nal.narParameters);
                let budget: BudgetValue = BudgetFunctions.compoundForward(truth, s2, nal);
                nal.doublePremiseTask(s2, truth, budget, false, false);
            }
        }
    }

    protected static IntroVarSameSubjectOrPredicate(originalMainSentence: Sentence, subSentence: Sentence,
        component: Term, content: Term, index: int, nal: DerivationContext): void {
        let T1: Term = originalMainSentence.term;
        if (!(T1 instanceof CompoundTerm) || !(content instanceof CompoundTerm)) {
            return;
        }
        let T: CompoundTerm = T1 as CompoundTerm;
        let T2: CompoundTerm = content as CompoundTerm;

        if ((component instanceof Inheritance && content instanceof Inheritance)
            || (component instanceof Similarity && content instanceof Similarity)) {
            // CompoundTerm result = T;
            if (component.equals(content)) {
                return; // wouldn't make sense to create a conjunction here, would contain a statement
                // twice
            }

            if ((component as Statement).getPredicate().equals((content as Statement).getPredicate())
                && !((component as Statement).getPredicate() instanceof Variable)) {

                let zw: CompoundTerm = T.term[index] as CompoundTerm;
                let res: Conjunction = Conjunction.make(zw, T2) as Conjunction;
                T = T.setComponent(index, res, nal.mem()) as CompoundTerm;
            } else if ((component as Statement).getSubject().equals((content as Statement).getSubject())
                && !((component as Statement).getSubject() instanceof Variable)) {

                let zw: CompoundTerm = T.term[index] as CompoundTerm;
                let res: Conjunction = Conjunction.make(zw, T2) as Conjunction;
                T = T.setComponent(index, res, nal.mem()) as CompoundTerm;
            }

            if (T === null) {
                return;
            }
            let truth: TruthValue = induction(originalMainSentence.getTruth(), subSentence.getTruth(), nal.narParameters);
            for (let subjectIntro of [true, false]) {
                let conts: java.util.Set<Pair<Term, float>> = CompositionalRules.introduceVariables(nal, T, subjectIntro);
                for (let content_penalty of conts) {
                    let budget: BudgetValue = BudgetFunctions.compoundForward(truth, content_penalty.getLeft(), nal);
                    let truthVal: TruthValue = truth.clone();
                    truthVal.mulConfidence(content_penalty.getRight());
                    nal.doublePremiseTask(content_penalty.getLeft(), truthVal, budget.clone(), false, false);
                }
            }
        }
    }

    /**
     * The power set, from João Silva,
     * https://stackoverflow.com/questions/1670862/obtaining-a-powerset-of-a-set-in-java
     *
     * @param <T>
     * @param originalSet
     * @return
     */
    public static powerSet<T>(originalSet: java.util.Set<T>): java.util.Set<java.util.Set<T>> {
        let sets: java.util.Set<java.util.Set<T>> = new java.util.LinkedHashSet<java.util.Set<T>>();
        if (originalSet.isEmpty()) {
            sets.add(new java.util.LinkedHashSet<T>());
            return sets;
        }
        let list: java.util.List<T> = new java.util.ArrayList<T>(originalSet);
        let head: T = list.get(0);
        let rest: java.util.Set<T> = new java.util.LinkedHashSet<T>(list.subList(1, list.size()));
        for (let set of CompositionalRules.powerSet(rest)) {
            let newSet: java.util.Set<T> = new java.util.LinkedHashSet<T>();
            newSet.add(head);
            newSet.addAll(set);
            sets.add(newSet);
            sets.add(set);
        }
        return sets;
    }

    /**
     * Introduction of variables that appear either within subjects or within
     * predicates and more than once
     *
     * @param nal                              The derivation context
     * @param implicationEquivalenceOrJunction
     * @param subject
     * @return The terms of the variable introduction variants plus the penalty from
     *         the amount of vars introduced
     */
    public static introduceVariables(nal: DerivationContext,
        implicationEquivalenceOrJunction: Term, subject: boolean): java.util.Set<Pair<Term, float>> {
        let result: java.util.Set<Pair<Term, float>> = new java.util.LinkedHashSet<Pair<Term, float>>();
        let validForIntroduction: boolean = implicationEquivalenceOrJunction instanceof Conjunction ||
            implicationEquivalenceOrJunction instanceof Disjunction ||
            implicationEquivalenceOrJunction instanceof Equivalence ||
            implicationEquivalenceOrJunction instanceof Implication;
        if (!validForIntroduction) {
            return result;
        }
        let app: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
        let candidates: java.util.Set<Term> = new java.util.LinkedHashSet();
        if (implicationEquivalenceOrJunction instanceof Implication
            || implicationEquivalenceOrJunction instanceof Equivalence) {
            CompositionalRules.addVariableCandidates(candidates, (implicationEquivalenceOrJunction as Statement).getSubject(), subject);
            CompositionalRules.addVariableCandidates(candidates, (implicationEquivalenceOrJunction as Statement).getPredicate(), subject);
        }
        if (implicationEquivalenceOrJunction instanceof Conjunction
            || implicationEquivalenceOrJunction instanceof Disjunction) {
            CompositionalRules.addVariableCandidates(candidates, implicationEquivalenceOrJunction, subject);
        }
        let termCounts: java.util.Map<Term, java.lang.Integer> = implicationEquivalenceOrJunction.countTermRecursively(null);
        let k: int = 0;
        for (let t of candidates) {
            if (termCounts.getOrDefault(t, 0) > 1) {
                // ok it appeared as subject or predicate but appears in the Conjunction more
                // than once
                // => introduce a dependent variable for it!
                let varType: java.lang.String = "#";
                if (implicationEquivalenceOrJunction instanceof Implication
                    || implicationEquivalenceOrJunction instanceof Equivalence) {
                    let imp: Statement = implicationEquivalenceOrJunction as Statement;
                    if (imp.getSubject().containsTermRecursively(t) && imp.getPredicate().containsTermRecursively(t)) {
                        varType = "$";
                    }
                }
                let introVar: Variable = new Variable(varType + "ind" + k);
                app.put(t, introVar);
                k++;
            }
        }

        let shuffledVariables: java.util.List<Term> = new java.util.ArrayList<Term>();
        for (let t of app.keySet()) {
            shuffledVariables.add(t);
        }
        for (let i = shuffledVariables.size() - 1; i > 0; i--) {
            const j = nal.memory.randomNumber.nextInt(i + 1);
            const current = shuffledVariables.get(i);
            shuffledVariables.set(i, shuffledVariables.get(j));
            shuffledVariables.set(j, current);
        }
        let selected: java.util.Set<Term> = new java.util.LinkedHashSet<Term>();
        let i: int = 1;
        for (let t of shuffledVariables) {
            selected.add(t);
            if (java.lang.Math.pow(2.0, i) > nal.narParameters.VARIABLE_INTRODUCTION_COMBINATIONS_MAX) {
                break;
            }
            i++;
        }
        let powerset: java.util.Set<java.util.Set<Term>> = CompositionalRules.powerSet(selected);
        for (let combo of powerset) {
            let mapping: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
            for (let vIntro of combo) {
                mapping.put(vIntro, app.get(vIntro));
            }
            if (mapping.size() > 0) {
                let generalizationPenalty: float = Float32Math.pow(
                    nal.narParameters.VARIABLE_INTRODUCTION_CONFIDENCE_MUL,
                    mapping.size() - 1,
                );
                result.add(
                    pair((implicationEquivalenceOrJunction as CompoundTerm).applySubstitute(mapping),
                        generalizationPenalty));
            }
        }
        return result;
    }

    /**
     * Add the variable candidates that appear as subjects and predicates
     *
     * @param candidates manipulated set of candidates
     * @param side
     * @param subject
     */
    public static addVariableCandidates(candidates: java.util.Set<Term>, side: Term, subject: boolean): void {
        let junction: boolean = (side instanceof Conjunction || side instanceof Disjunction || side instanceof Negation);
        let n: int = junction ? (side as CompoundTerm).size() : 1;
        for (let i: int = 0; i < n; i++) {
            // we found an Inheritance
            let t: Term = null;
            if (i < n) {
                if (junction) {
                    t = (side as CompoundTerm).term[i];
                } else {
                    t = side;
                }
            }
            if (t instanceof Conjunction || t instanceof Disjunction || t instanceof Negation) { // component itself is
                // a
                // conjunction/disjunction
                CompositionalRules.addVariableCandidates(candidates, t, subject);
            }
            if (t instanceof Inheritance) {
                let inh: Inheritance = t as Inheritance;
                let subjT: Term = inh.getSubject();
                let predT: Term = inh.getPredicate();
                let addSubject: boolean = subject || subjT instanceof ImageInt; // also allow for images due to equivalence
                // transform
                let removals: java.util.Set<Term> = new java.util.LinkedHashSet<Term>();
                if (addSubject && !subjT.hasVar()) {
                    let ret: java.util.Set<Term> = CompoundTerm.addComponentsRecursively(subjT, null);
                    for (let ct of ret) {
                        if (ct instanceof Image) {
                            removals.add((ct as Image).term[(ct as Image).relationIndex]);
                        }
                        candidates.add(ct);
                    }
                }
                let addPredicate: boolean = !subject || predT instanceof ImageExt; // also allow for images due to
                // equivalence transform
                if (addPredicate && !predT.hasVar()) {
                    let ret: java.util.Set<Term> = CompoundTerm.addComponentsRecursively(predT, null);
                    for (let ct of ret) {
                        if (ct instanceof Image) {
                            removals.add((ct as Image).term[(ct as Image).relationIndex]);
                        }
                        candidates.add(ct);
                    }
                }
                for (let remove of removals) { // but do not introduce variables for image relation, only if they appear
                    // as product
                    candidates.remove(remove);
                }
            }
        }
    }
}
