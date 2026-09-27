//! Java source: opennars/control/concept/ProcessJudgment.java
import type { int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Events } from "../../io/events/Events.ts";
import { ProcessAnticipation } from "./ProcessAnticipation.ts";
import { LocalRules } from "../../inference/LocalRules.ts";
import { TemporalRules } from "../../inference/TemporalRules.ts";
import { TemporalInferenceControl } from "../TemporalInferenceControl.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Implication } from "../../language/Implication.ts";
import { Conjunction } from "../../language/Conjunction.ts";
import { Interval } from "../../language/Interval.ts";
import { Operation } from "../../operator/Operation.ts";
import { Operator } from "../../operator/Operator.ts";
import { NativeList } from "../../runtime/NativeList.ts";
import { NativeSet } from "../../runtime/NativeSet.ts";
import type { MapContract } from "../../runtime/NativeMap.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Sentence } from "../../entity/Sentence.ts";
import type { Stamp } from "../../entity/Stamp.ts";
import type { Task } from "../../entity/Task.ts";
import type { Term } from "../../language/Term.ts";
import type { DerivationContext } from "../DerivationContext.ts";
import type { Parameters } from "../../main/Parameters.ts";

// Java source uses Guava Optional only as a private search result.  The
// TypeScript boundary is internal, so null represents Java Optional.empty().
const tryFind = <T>(items: Iterable<T>, predicate: (value: T) => boolean): T | null => {
    for (const item of items) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
};



// Java implicit Object -> native TypeScript class; this class is a static utility namespace.
export class ProcessJudgment {
    /**
     * To accept a new judgment as belief, and check for revisions and solutions.
     * Revisions will be processed as judgment tasks by themselves.
     * Due to their higher confidence, summarizing more evidence,
     * the will become the top entries in the belief table.
     * Additionally, judgements can themselves be the solution to existing questions
     * and goals, which is also processed here.
     *
     * @param task    The judgment task to be accepted
     * @param concept The concept of the judment task
     * @param nal     The derivation context
     */
    public static processJudgment(concept: Concept, nal: DerivationContext, task: Task): void {
        ProcessJudgment.handleOperationFeedback(task, nal);
        let judg: Sentence = task.sentence;
        ProcessAnticipation.confirmAnticipation(task, concept, nal);
        let oldBeliefT: Task | null = concept.selectCandidate(task, concept.beliefs, nal.time); // only revise with the
        // strongest -- how about
        // projection?
        let oldBelief: Sentence | null = null;
        if (oldBeliefT !== null) {
            oldBelief = oldBeliefT.sentence;
            let newStamp: Stamp = judg.stamp;
            let oldStamp: Stamp = oldBelief.stamp; // when table is full, the latter check is especially important too
            if (newStamp.equals(oldStamp, false, false, true)) {
                concept.memory.removeTask(task, "Duplicated");
                return;
            } else if (oldBelief !== null && LocalRules.revisable(judg, oldBelief, nal.narParameters)) {
                nal.setTheNewStamp(newStamp, oldStamp, nal.time.time());
                let projectedBelief: Sentence = oldBelief.projection(nal.time.time(), newStamp.getOccurrenceTime(),
                    concept.memory);
                if (projectedBelief !== null) {
                    nal.setCurrentBelief(projectedBelief);
                    LocalRules.revision(judg, projectedBelief, concept, false, nal);
                }
            }
        }
        if (!task.aboveThreshold()) {
            return;
        }
        let nnq: int = concept.questions.size();
        for (let i: int = 0; i < nnq; i++) {
            LocalRules.trySolution(judg, concept.questions.get(i), nal, true);
        }
        let nng: int = concept.desires.size();
        for (let i: int = 0; i < nng; i++) {
            LocalRules.trySolution(judg, concept.desires.get(i), nal, true);
        }
        concept.addToTable(task, false, concept.beliefs, concept.memory.narParameters.CONCEPT_BELIEFS_MAX,
            Events.ConceptBeliefAdd.class, Events.ConceptBeliefRemove.class);
    }

    /**
     * Handle the feedback of the operation that was processed as a judgment.
     * <br>
     * The purpose is to start a new operation frame which makes the operation
     * concept
     * interpret current events as preconditions and future events as
     * post-conditions to the invoked operation.
     *
     * @param task The judgement task be checked
     * @param nal  The derivation context
     */
    public static handleOperationFeedback(task: Task, nal: DerivationContext): void {
        if (task.isInput() && !task.sentence.isEternal() && task.sentence.term instanceof Operation) {
            let op: Operation = task.sentence.term as Operation;
            let o: Operator = op.getPredicate() as Operator;
            // Java excludes mental operators from operation-frame feedback. Keep
            // this name-based boundary local so the core does not import the
            // operator plugin classes and recreate their initialization cycle.
            const mentalOperatorNames = ["^believe", "^want", "^wonder", "^evaluate", "^anticipate"];
            if (!mentalOperatorNames.includes(String(o.name()))) {
                TemporalInferenceControl.NewOperationFrame(nal.memory, task);
            }
        }
    }

    /**
     * Check whether the task is an executable hypothesis of the form
     * <(&/,a,op()) =/> b>.
     *
     * @param task The judgement task be checked
     * @param nal  The derivation context
     * @return Whether task is an executable precondition
     */
    public static isExecutableHypothesis(task: Task, nal: DerivationContext): boolean {
        let term: Term = task.getTerm();
        if (!task.sentence.isEternal() ||
            !(term instanceof Implication)) {
            return false;
        }
        let imp: Implication = term as Implication;
        if (imp.getTemporalOrder() !== TemporalRules.ORDER_FORWARD) {
            return false;
        }
        // also it has to be enactable, meaning the last entry of the sequence before
        // the interval is an operation:
        let subj: Term = imp.getSubject();
        if (!(subj instanceof Conjunction)) {
            return false;
        }
        let conj: Conjunction = subj as Conjunction;
        let isInExecutableFormat: boolean = !conj.isSpatial &&
            conj.getTemporalOrder() === TemporalRules.ORDER_FORWARD &&
            conj.term.length >= 4 && conj.term.length % 2 === 0 &&
            conj.term[conj.term.length - 1] instanceof Interval &&
            conj.term[conj.term.length - 2] instanceof Operation;
        return isInExecutableFormat;
    }

    /**
     * Add <(&/,a,op()) =/> b> beliefs to preconditions in concept b
     *
     * @param task The potential implication task
     * @param nal  The derivation context
     */
    public static addToTargetConceptsPreconditions(task: Task, nal: DerivationContext): void {
        // Java source: Set<Term> targets = new LinkedHashSet<>();
        // NativeSet keeps the original Set contract: value de-duplication and insertion order.
        const targets = new NativeSet<Term>();
        // add to all components, unless it doesn't have vars
        if (!(task.getTerm() as Implication).getPredicate().hasVar()) {
            targets.add((task.getTerm() as Implication).getPredicate());
        } else {
            let ret: MapContract<Term, int> = (task.getTerm() as Implication).getPredicate().countTermRecursively(null);
            for (let r of ret.keySet()) {
                targets.add(r);
            }
        }
        // the concept of the implication task
        let origin_concept: Concept = nal.memory.concept(task.getTerm());
        if (origin_concept === null) {
            return;
        }
        // get the first eternal. the highest confident one (due to the sorted order):
        let strongest_target: Task | null = null;
        /* synchronized (origin_concept) { */
        strongest_target = tryFind(origin_concept.beliefs, iTask => iTask.sentence.isEternal());
        /* } */
        if (strongest_target === null) {
            return;
        }
        let prec: Term[] = ((strongest_target.getTerm() as Implication).getSubject() as Conjunction).term;
        for (let i: int = 0; i < prec.length - 2; i++) {
            if (prec[i] instanceof Operation) { // don't react to precondition with an operation before the last
                return; // for now, these can be decomposed into smaller such statements anyway
            }
        }
        for (let t of targets) { // the target sub concepts it needs to go to
            let target_concept: Concept = nal.memory.concept(t);
            if (target_concept === null) { // target concept does not exist
                continue;
            }
            // we do not add the target, instead the strongest belief in the target concept
            /* synchronized (target_concept) { */
            let table: NativeList<Task> = strongest_target.sentence.term.hasVar()
                ? target_concept.general_executable_preconditions
                : target_concept.executable_preconditions;
            // at first we have to remove the last one with same content from table
            let i_delete: int = -1;
            for (let i: int = 0; i < table.size(); i++) {
                if (CompoundTerm.replaceIntervals(table.get(i).getTerm()).equals(
                        CompoundTerm.replaceIntervals(strongest_target.getTerm()))) {
                    i_delete = i; // even these with same term but different intervals are removed here
                    break;
                }
            }
            if (i_delete !== -1) {
                table.remove(i_delete);
            }
            // this way the strongest confident result of this content is put into table but
            // the table ranked according to truth expectation
            target_concept.addToTable(strongest_target, true, table,
                target_concept.memory.narParameters.CONCEPT_BELIEFS_MAX, Events.EnactableExplainationAdd.class,
                Events.EnactableExplainationRemove.class);
            /* } */
        }
    }
}
