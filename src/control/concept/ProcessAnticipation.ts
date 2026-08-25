//! Java source: opennars/control/concept/ProcessAnticipation.java
import { java, JavaObject, type long, type float, type double } from "jree";
import { DerivationContext } from "../DerivationContext.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Concept } from "../../entity/Concept.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TaskLink } from "../../entity/TaskLink.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { RuleTables } from "../../inference/RuleTables.ts";
import { TemporalRules } from "../../inference/TemporalRules.ts";
import { UtilityFunctions } from "../../inference/UtilityFunctions.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import { Symbols } from "../../io/Symbols.ts";
import { OutputHandler } from "../../io/events/OutputHandler.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Conjunction } from "../../language/Conjunction.ts";
import { Equivalence } from "../../language/Equivalence.ts";
import { Implication } from "../../language/Implication.ts";
import { Interval } from "../../language/Interval.ts";
import { Statement } from "../../language/Statement.ts";
import { Tense } from "../../language/Tense.ts";
import type { Term } from "../../language/Term.ts";
import type { Nar } from "../../main/Nar.ts";
import { Anticipate } from "../../operator/mental/Anticipate.ts";
import { Operator } from "../../operator/Operator.ts";
import type { Parameters } from "../../main/Parameters.ts";



/**
 *
 * @author Patrick Hammer
 */
export class ProcessAnticipation extends JavaObject {

    public static anticipate(nal: DerivationContext, mainSentence: Sentence, budget: BudgetValue,
        minTime: long, maxTime: long, urgency: float, substitution: java.util.Map<Term, Term>): void {
        // derivation was successful and it was a judgment event
        let stamp: Stamp = new Stamp(nal.time, nal.memory);
        stamp.setOccurrenceTime(Stamp.ETERNAL);
        let eternalized_induction_confidence: float = nal.memory.narParameters.ANTICIPATION_CONFIDENCE;
        let s: Sentence = new Sentence(
            mainSentence.term,
            mainSentence.punctuation,
            TruthValue.fromFrequencyConfidence(0.0, eternalized_induction_confidence, nal.narParameters),
            stamp);
        let t: Task = new Task(s, new BudgetValue(0.99, 0.1, 0.1, nal.narParameters), Task.EnumType.DERIVED);
        // Budget for one-time processing
        let mainPredicate: Term = (mainSentence.term as Statement).getPredicate();
        if (!(mainPredicate instanceof CompoundTerm))
            return; // ! ℹ️【2025-08-25 23:11:08】原版也会在「执行操作后的预期」中出现该错误
        /*
         * MWE 触发案例
         * A. :|:
         * 3
         * <(*, {SELF}) --> ^left>. :|:
         * 3
         * G. :|:
         * 5
         * A. :|:
         * 3
         * G! :|:
         * 50000
         */
        let specificAnticipationTerm: Term = (mainPredicate as CompoundTerm).applySubstitute(substitution);
        let c: Concept = nal.memory.concept(specificAnticipationTerm); // put into consequence concept
        if (c !== null /* && minTime > nal.memory.time() */ && c.observable
            && (mainSentence.getTerm() instanceof Implication || mainSentence.getTerm() instanceof Equivalence) &&
            mainSentence.getTerm().getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
            let toDelete: Concept.AnticipationEntry | null = null;
            let toInsert: Concept.AnticipationEntry = new Concept.AnticipationEntry(urgency, t, minTime, maxTime);
            let fullCapacity: boolean = c.anticipations.length >= nal.narParameters.ANTICIPATIONS_PER_CONCEPT_MAX;
            // choose an element to replace with the new, in case that we are already at
            // full capacity
            if (fullCapacity) {
                for (let entry of c.anticipations) {
                    if (urgency > entry.negConfirmationPriority /*
                                                                 * || t.getPriority() > c.negConfirmation.getPriority()
                                                                 */) {
                        // prefer to replace one that is more far in the future, takes longer to be
                        // disappointed about
                        if (toDelete === null || entry.negConfirm_abort_maxTime > toDelete.negConfirm_abort_maxTime) {
                            toDelete = entry;
                        }
                    }
                }
            }
            // we were at full capacity but there was no item that can be replaced with the
            // new one
            if (fullCapacity && toDelete === null) {
                return;
            }
            if (toDelete !== null) {
                const index = c.anticipations.indexOf(toDelete);
                if (index >= 0) c.anticipations.splice(index, 1);
            }
            c.anticipations.push(toInsert);
            if (toInsert.negConfirmation === null) {
                return;
            }
            let impOrEqu: Statement = toInsert.negConfirmation.sentence.term as Statement;
            let cTarget: Concept = nal.memory.concept(impOrEqu.getPredicate());
            if (cTarget !== null) {
                let anticipate_op: Operator = (c.memory.getOperator(new java.lang.String("^anticipate")) as Anticipate);
                if (anticipate_op !== null && anticipate_op instanceof Anticipate) {
                    (anticipate_op as Anticipate).anticipationFeedback(impOrEqu.getPredicate(), null, c.memory,
                        nal.time);
                }
            }
            nal.memory.emit(OutputHandler.ANTICIPATE.class, specificAnticipationTerm); // disappoint/confirm printed
            // anyway
        }

    }

    /**
     * Process outdated anticipations within the concept,
     * these which are outdated generate negative feedback
     *
     * @param narParameters The reasoner parameters
     * @param concept       The concept which potentially outdated anticipations
     *                      should be processed
     * @param nar           the reasoner
     */
    public static maintainDisappointedAnticipations(narParameters: Parameters, concept: Concept,
        nar: Nar): void {
        // here we can check the expiration of the feedback:
        const confirmed: Concept.AnticipationEntry[] = [];
        const disappointed: Concept.AnticipationEntry[] = [];
        for (let entry of concept.anticipations) {
            if (entry.negConfirmation === null || nar.time() <= entry.negConfirm_abort_maxTime) {
                continue;
            }
            // at first search beliefs for input tasks:
            let gotConfirmed: boolean = false;
            if (narParameters.RETROSPECTIVE_ANTICIPATIONS) {
                for (let tl of concept.taskLinks) { // search for input in taskLinks (beliefs alone can not
                    // take temporality into account as the eternals will win)
                    let t: Task = tl.targetTask;
                    if (t !== null && t.sentence.isJudgment() && /* t.isInput() && */ !t.sentence.isEternal()
                        && t.sentence.getTruth()
                            .getExpectation() > concept.memory.narParameters.DEFAULT_CONFIRMATION_EXPECTATION
                        &&
                        CompoundTerm.replaceIntervals(t.sentence.term)
                            .equals(CompoundTerm.replaceIntervals(concept.getTerm()))) {
                        if (t.sentence.getOccurrenceTime() >= entry.negConfirm_abort_minTime
                            && t.sentence.getOccurrenceTime() <= entry.negConfirm_abort_maxTime) {
                            confirmed.push(entry);
                            gotConfirmed = true;
                            break;
                        }
                    }
                }
            }
            if (!gotConfirmed) {
                disappointed.push(entry);
            }
        }
        // confirmed by input, nothing to do
        if (confirmed.length > 0) {
            concept.memory.emit(OutputHandler.CONFIRM.class, concept.getTerm());
        }
        const confirmedSet = new Set(confirmed);
        concept.anticipations = concept.anticipations.filter((entry) => !confirmedSet.has(entry));
        // not confirmed and time is out, generate disappointment
        if (disappointed.length > 0) {
            concept.memory.emit(OutputHandler.DISAPPOINT.class, concept.getTerm());
        }
        for (let entry of disappointed) {
            if (entry.negConfirmation === null) {
                continue;
            }
            let term: Term = entry.negConfirmation.getTerm();
            let termWithReplacedIntervals: Term = CompoundTerm.replaceIntervals(term);

            { // revise with negative evidence
                let truthOfBeliefWithTerm: TruthValue | null = null;
                {
                    let targetConcept: Concept = nar.memory.concept(termWithReplacedIntervals);
                    if (targetConcept === null) { // target concept does not exist
                        continue;
                    }

                    /* synchronized (targetConcept) { */
                    for (let iBeliefTask of targetConcept.beliefs) {
                        let iBeliefTerm: Term = iBeliefTask.getTerm();

                        let found: boolean = iBeliefTerm.equals(term);
                        if (found) {
                            truthOfBeliefWithTerm = iBeliefTask.sentence.getTruth();
                            break;
                        }
                    }
                    /* } */
                }

                if (truthOfBeliefWithTerm !== null) {
                    // compute amount of negative evidence based on current evidence
                    // we just take the counter and don't add one because we want to compute a w
                    // "unit" which will be revised
                    let countWithNegativeEvidence: long = (term as Implication).counter;
                    let negativeEvidenceRatio: double = 1.0 / Number(countWithNegativeEvidence);

                    // compute confidence by negative evidence
                    let w: double = UtilityFunctions.c2w(truthOfBeliefWithTerm.confidence, narParameters);
                    w *= negativeEvidenceRatio;
                    let c: double = UtilityFunctions.w2c(Float32Math.from(w), narParameters);

                    let truth: TruthValue = TruthValue.fromFrequencyConfidence(0.0, c, narParameters); // frequency of negative
                    // confirmation is 0.0

                    let sentenceForNewTask: Sentence = new Sentence(
                        term,
                        Symbols.JUDGMENT_MARK,
                        truth,
                        new Stamp(nar, nar.memory, Tense.Eternal));
                    let budget: BudgetValue = new BudgetValue(0.99, 0.1, 0.1, nar.narParameters);
                    let t: Task = new Task(sentenceForNewTask, budget, Task.EnumType.DERIVED);

                    concept.memory.inputTask(nar, t, false);
                }
            }

            const index = concept.anticipations.indexOf(entry);
            if (index >= 0) concept.anticipations.splice(index, 1);
        }
    }

    /**
     * Whether a processed judgement task satisfies the anticipations within concept
     *
     * @param task    The judgement task be checked
     * @param concept The concept that is processed
     * @param nal     The derivation context
     */
    public static confirmAnticipation(task: Task, concept: Concept, nal: DerivationContext): void {
        let satisfiesAnticipation: boolean = task.isInput() && !task.sentence.isEternal();
        let isExpectationAboveThreshold: boolean = task.sentence.getTruth()
            .getExpectation() > nal.narParameters.DEFAULT_CONFIRMATION_EXPECTATION;
        const confirmed: Concept.AnticipationEntry[] = [];
        for (let entry of concept.anticipations) {
            if (satisfiesAnticipation && isExpectationAboveThreshold
                && task.sentence.getOccurrenceTime() >= entry.negConfirm_abort_minTime
                && task.sentence.getOccurrenceTime() <= entry.negConfirm_abort_maxTime) {
                confirmed.push(entry);
            }
        }
        if (confirmed.length > 0) {
            nal.memory.emit(OutputHandler.CONFIRM.class, concept.getTerm());
        }
        const confirmedSet = new Set(confirmed);
        concept.anticipations = concept.anticipations.filter((entry) => !confirmedSet.has(entry));
    }

    /**
     * Fire predictive inference based on beliefs that are known to the concept's
     * neighbors
     *
     * @param judgementTask judgement task
     * @param concept       concept that is processed
     * @param nal           derivation context
     * @param time          used to retrieve current time
     * @param taskLink      corresponding taskLink
     */
    public static firePredictions(judgementTask: Task, concept: Concept, nal: DerivationContext,
        time: Timable, taskLink: TaskLink): void {
        if (!judgementTask.sentence.isEternal() && judgementTask.isInput() && judgementTask.sentence.isJudgment()) {
            for (let tl of concept.termLinks) {
                let term: Term = tl.getTarget();
                let tc: Concept = nal.memory.concept(term);
                if (tc !== null && !tc.beliefs.isEmpty() && term instanceof Implication) {
                    let imp: Implication = term as Implication;
                    if (imp.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                        let preCon: Term = imp.getSubject();
                        let component: Term = preCon;
                        if (preCon instanceof Conjunction) {
                            let conj: Conjunction = imp.getSubject() as Conjunction;
                            if (conj.getTemporalOrder() === TemporalRules.ORDER_FORWARD && conj.term.length === 2
                                && conj.term[1] instanceof Interval) {
                                component = conj.term[0]; // (&/,a,+i), so use a
                            }
                        }
                        if (CompoundTerm.replaceIntervals(concept.getTerm())
                            .equals(CompoundTerm.replaceIntervals(component))) {
                            // trigger inference of the task with the belief
                            let cont: DerivationContext = new DerivationContext(nal.memory, nal.narParameters, time);
                            cont.setCurrentTask(judgementTask); // a
                            cont.setCurrentBeliefLink(tl); // a =/> b
                            cont.setCurrentTaskLink(taskLink); // a
                            cont.setCurrentConcept(concept); // a
                            cont.setCurrentTerm(concept.getTerm()); // a
                            RuleTables.reason(taskLink, tl, cont); // generate b
                        }
                    }
                }
            }
        }
    }
}
