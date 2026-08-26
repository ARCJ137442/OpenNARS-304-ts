//! Java source: opennars/control/concept/ProcessGoal.java
import { java, JavaObject, type double, type float, type long, type int } from "jree";
import { Events } from "../../io/events/Events.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Concept } from "../../entity/Concept.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { LocalRules } from "../../inference/LocalRules.ts";
import { TemporalRules } from "../../inference/TemporalRules.ts";
import { TruthFunctions } from "../../inference/TruthFunctions.ts";
import { Symbols } from "../../io/Symbols.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Conjunction } from "../../language/Conjunction.ts";
import { Equivalence } from "../../language/Equivalence.ts";
import { Implication } from "../../language/Implication.ts";
import { Interval } from "../../language/Interval.ts";
import { Product } from "../../language/Product.ts";
import { Term } from "../../language/Term.ts";
import { Variable } from "../../language/Variable.ts";
import { Variables } from "../../language/Variables.ts";
import { FunctionOperator } from "../../operator/FunctionOperator.ts";
import { Operation } from "../../operator/Operation.ts";
import { Operator } from "../../operator/Operator.ts";
import { ProcessAnticipation } from "./ProcessAnticipation.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import { JavaIllegalAccessError, javaStringValue } from "../../runtime/jree-compat.ts";
import { Debug } from "../../main/Debug.ts";
import { InternalExperience } from "../../plugin/mental/InternalExperience.ts";
import type { DerivationContext } from "../DerivationContext.ts";

const revisable = LocalRules.revisable;
const revision = LocalRules.revision;
const trySolution = LocalRules.trySolution;



/**
 *
 * @author Patrick Hammer
 */
export class ProcessGoal extends JavaObject {
    /**
     * To accept a new goal, and check for revisions and realization, then
     * decide whether to actively pursue it, potentially executing in case of an
     * operation goal
     *
     * @param concept The concept of the goal
     * @param nal     The derivation context
     * @param task    The goal task to be processed
     */
    public static processGoal(concept: Concept, nal: DerivationContext, task: Task): void {
        let goal: Sentence = task.sentence;
        let oldGoalT: Task | null = concept.selectCandidate(task, concept.desires, nal.time); // revise with the existing
        // desire values
        let oldGoal: Sentence | null = null;
        let newStamp: Stamp = goal.stamp;
        if (oldGoalT !== null) {
            oldGoal = oldGoalT.sentence;
            let oldStamp: Stamp = oldGoal.stamp;
            if (newStamp.equals(oldStamp, false, false, true)) {
                return; // duplicate
            }
        }

        let beliefT: Task | null = null;
        if (task.aboveThreshold()) {
            beliefT = concept.selectCandidate(task, concept.beliefs, nal.time);

            for (let iQuest of concept.quests) {
                trySolution(task.sentence, iQuest, nal, true);
            }

            // check if the Goal is already satisfied
            if (beliefT !== null) {
                // check if the Goal is already satisfied (manipulate budget)
                trySolution(beliefT.sentence, task, nal, true);
            }
        }

        if (oldGoalT !== null && oldGoal !== null && revisable(goal, oldGoal, nal.narParameters)) {
            if (oldGoal === null)
                throw new JavaIllegalAccessError("oldGoal == null");
            if (oldGoal.stamp === null)
                throw new JavaIllegalAccessError("oldGoal.stamp ");
            let oldStamp: Stamp = oldGoal.stamp;
            nal.setTheNewStamp(newStamp, oldStamp, nal.time.time());
            let projectedGoal: Sentence = oldGoal.projection(task.sentence.getOccurrenceTime(),
                newStamp.getOccurrenceTime(), concept.memory);
            if (projectedGoal !== null) {
                nal.setCurrentBelief(projectedGoal);
                let wasRevised: boolean = revision(task.sentence, projectedGoal, concept, false, nal);
                if (wasRevised) {
                    /*
                     * It was revised, so there is a new task for which this method will be called
                     * with higher/lower desire.
                     * We return because it is not allowed to go on directly due to decision making.
                     * see https://groups.google.com/forum/#!topic/open-nars/lQD0no2ovx4
                     */
                    return;
                }
            }
        }

        let s2: Stamp = goal.stamp.clone();
        s2.setOccurrenceTime(nal.time.time());
        if (s2.after(task.sentence.stamp, nal.narParameters.DURATION)) {
            // this task is not up to date we have to project it first

            let projGoal: Sentence = task.sentence.projection(nal.time.time(), BigInt(nal.narParameters.DURATION), nal.memory);
            if (projGoal !== null && projGoal.getTruth().getExpectation() > nal.narParameters.DECISION_THRESHOLD) {

                // keep goal updated
                nal.singlePremiseTask(projGoal, task.getBudget().clone());

                // we don't return here, allowing "roundtrips now", relevant for executing
                // multiple steps of learned implication chains
            }
        }

        if (!task.aboveThreshold()) {
            return;
        }

        let AntiSatisfaction: double = 0.5; // we don't know anything about that goal yet
        if (beliefT !== null) {
            let belief: Sentence = beliefT.sentence;
            let projectedBelief: Sentence = belief.projection(task.sentence.getOccurrenceTime(),
                BigInt(nal.narParameters.DURATION), nal.memory);
            AntiSatisfaction = task.sentence.getTruth().getExpDifAbs(projectedBelief.getTruth());
        }

        // Java casts AntiSatisfaction to float before multiplying two float
        // operands; casting only the final result can cross a Bag level.
        const antiSatisfaction: float = Math.fround(AntiSatisfaction) as float;
        task.setPriority(Float32Math.multiply(task.getPriority(), antiSatisfaction) as float);
        if (!task.aboveThreshold()) {
            return;
        }

        let isFulfilled: boolean = AntiSatisfaction < nal.narParameters.SATISFACTION_THRESHOLD;
        let projectedGoal: Sentence = goal.projection(nal.time.time(), nal.time.time(), nal.memory);
        if (!(projectedGoal !== null && task.aboveThreshold() && !isFulfilled)) {
            return;
        }
        let inheritedBabblingGoal: boolean = task.isInput() && !concept.allowBabbling;
        if (inheritedBabblingGoal) {
            return;
        }
        ProcessGoal.bestReactionForGoal(concept, nal, projectedGoal, task);
        ProcessGoal.questionFromGoal(task, nal);
        concept.addToTable(task, false, concept.desires, nal.narParameters.CONCEPT_GOALS_MAX,
            Events.ConceptGoalAdd.class, Events.ConceptGoalRemove.class);
        InternalExperience.InternalExperienceFromTask(concept.memory, task, false, nal.time);
        if (!(task.sentence.getTerm() instanceof Operation)) {
            return;
        }
        ProcessGoal.processOperationGoal(projectedGoal, nal, concept, oldGoalT, task);
    }

    /**
     * To process an operation for potential execution
     * only called by processGoal
     *
     * @param projectedGoal The current goal
     * @param nal           The derivation context
     * @param concept       The concept of the current goal
     * @param oldGoalT      The best goal in the goal table
     * @param task          The goal task
     */
    protected static processOperationGoal(projectedGoal: Sentence, nal: DerivationContext,
        concept: Concept, oldGoalT: Task | null, task: Task): void {
        if (projectedGoal.getTruth().getExpectation() > nal.narParameters.DECISION_THRESHOLD) {
            // see whether the goal evidence is fully included in the old goal, if yes don't
            // execute
            // as execution for this reason already happened (or did not since there was
            // evidence against it)
            let oldEvidence: java.util.Set<Stamp.BaseEntry> = new java.util.LinkedHashSet();
            let Subset: boolean = false;
            if (oldGoalT !== null) {
                Subset = true;
                for (let l of oldGoalT.sentence.stamp.evidentialBase) {
                    oldEvidence.add(l);
                }
                for (let l of task.sentence.stamp.evidentialBase) {
                    if (!oldEvidence.contains(l)) {
                        Subset = false;
                        break;
                    }
                }
            }
            if (!Subset && !ProcessGoal.executeOperation(nal, task)) {
                concept.memory.emit(Events.UnexecutableGoal.class, task, concept, nal);
                return; // it was made true by itself
            }
        }
    }

    /**
     * Generate <?how =/> g>? question for g! goal.
     * only called by processGoal
     *
     * @param task the task for which the question should be processed
     * @param nal  The derivation context
     */
    public static questionFromGoal(task: Task, nal: DerivationContext): void {
        if (nal.narParameters.QUESTION_GENERATION_ON_DECISION_MAKING
            || nal.narParameters.HOW_QUESTION_GENERATION_ON_DECISION_MAKING) {
            // ok, how can we achieve it? add a question of whether it is fulfilled
            const qu: Term[] = [];
            if (nal.narParameters.HOW_QUESTION_GENERATION_ON_DECISION_MAKING) {
                if (!(task.sentence.term instanceof Equivalence) && !(task.sentence.term instanceof Implication)) {
                    let how: Variable = new Variable("?how");
                    // Implication imp=Implication.make(how, task.sentence.term,
                    // TemporalRules.ORDER_CONCURRENT);
                    let imp2: Implication = Implication.make(how, task.sentence.term, TemporalRules.ORDER_FORWARD);
                    // qu.add(imp);
                    if (!(task.sentence.term instanceof Operation)) {
                        qu.push(imp2);
                    }
                }
            }
            if (nal.narParameters.QUESTION_GENERATION_ON_DECISION_MAKING) {
                qu.push(task.sentence.term);
            }
            for (let q of qu) {
                if (q !== null) {
                    let st: Stamp = new Stamp(task.sentence.stamp, nal.time.time());
                    st.setOccurrenceTime(task.sentence.getOccurrenceTime()); // set tense of question to goal tense
                    let s: Sentence = new Sentence(
                        q,
                        Symbols.QUESTION_MARK,
                        null,
                        st);

                    if (s !== null) {
                        let budget: BudgetValue = new BudgetValue(
                            task.getPriority() * nal.narParameters.CURIOSITY_DESIRE_PRIORITY_MUL,
                            task.getDurability() * nal.narParameters.CURIOSITY_DESIRE_DURABILITY_MUL,
                            1, nal.narParameters);
                        nal.singlePremiseTask(s, budget);
                    }
                }
            }
        }
    }

    public static ExecutablePrecondition = class ExecutablePrecondition extends JavaObject {
        public bestOp: Operation | null = null;
        public bestOp_truthExp: float = 0.0;
        public bestOp_truth: TruthValue | null = null;
        public executable_precondition: Task | null = null;
        public minTime: long = -1n;
        public maxTime: long = -1n;
        public timeOffset: float = 0.0;
        public substitution: java.util.Map<Term, Term> | null = null;
    };


    /**
     * When a goal is processed, use the best memorized reaction
     * that is applicable to the current context (recent events) in case that it
     * exists.
     * This is a special case of the choice rule and allows certain behaviors to be
     * automated.
     *
     * @param concept       The concept of the goal to realize
     * @param nal           The derivation context
     * @param projectedGoal The current goal
     * @param task          The goal task
     */
    public static bestReactionForGoal(concept: Concept, nal: DerivationContext,
        projectedGoal: Sentence, task: Task): void {
        concept.incAcquiredQuality(); // useful as it is represents a goal concept that can hold important procedure
        // knowledge
        // 1. pull up variable based preconditions from component concepts without
        // replacing them
        let ret: java.util.Map<Term, java.lang.Integer> = (projectedGoal.getTerm()).countTermRecursively(null);
        const generalPreconditions: Task[] = [];
        for (let t of ret.keySet()) {
            let get_concept: Concept = nal.memory.concept(t); // the concept to pull preconditions from
            if (get_concept === null || get_concept === concept) { // target concept does not exist or is the same as the
                // goal concept
                continue;
            }
            // pull variable based preconditions from component concepts
            /* synchronized (get_concept) { */
            let useful_component: boolean = false;
            for (let precon of get_concept.general_executable_preconditions) {
                // check whether the conclusion matches
                if (Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT,
                    (precon.sentence.term as Implication).getPredicate(), projectedGoal.term,
                    new java.util.LinkedHashMap(), new java.util.LinkedHashMap())) {
                    for (let precondition of get_concept.general_executable_preconditions) {
                        generalPreconditions.push(precondition);
                        useful_component = true;
                    }
                }
            }
            if (useful_component) {
                get_concept.incAcquiredQuality(); // useful as it contributed predictive hypotheses
            }
            /* } */
        }
        // 2. Accumulate all general preconditions of itself too and create list for
        // anticipations
        generalPreconditions.push(...concept.general_executable_preconditions);
        let anticipationsToMake: java.util.Map<Operation, java.util.List<ProcessGoal.ExecutablePrecondition>> = new java.util.LinkedHashMap();
        // 3. For the more specific hypotheses first and then the general
        for (let table of [concept.executable_preconditions, generalPreconditions]) {
            // 4. Apply choice rule, using the highest truth expectation solution and
            // anticipate the results
            let bestOpWithMeta: ProcessGoal.ExecutablePrecondition = ProcessGoal.calcBestExecutablePrecondition(nal, concept, projectedGoal, table,
                anticipationsToMake);
            // 5. And executing it, also forming an expectation about the result
            if (ProcessGoal.executePrecondition(nal, bestOpWithMeta, concept, projectedGoal, task)) {
                const bestOp = bestOpWithMeta.bestOp;
                const executablePrecondition = bestOpWithMeta.executable_precondition;
                if (bestOp === null || executablePrecondition === null) {
                    throw new java.lang.IllegalStateException("Executable precondition metadata is incomplete");
                }
                let op: Concept = nal.memory.concept(bestOp);
                if (op !== null && executablePrecondition.sentence.getTruth()
                    .confidence > nal.narParameters.MOTOR_BABBLING_CONFIDENCE_THRESHOLD) {
                    /* synchronized (op) { */
                    op.allowBabbling = false;
                    /* } */
                }
                java.lang.System.out.println(`Executed based on: ${javaStringValue(executablePrecondition)}`);
                const anticipations = anticipationsToMake.get(bestOp);
                if (anticipations === null) {
                    throw new java.lang.IllegalStateException("Executable precondition anticipation list is missing");
                }
                for (let precon of anticipations) {
                    const preconditionTask = precon.executable_precondition;
                    const substitution = precon.substitution;
                    if (preconditionTask === null || substitution === null) {
                        throw new java.lang.IllegalStateException("Executable precondition result is incomplete");
                    }
                    let distance: float = Float32Math.subtract(precon.timeOffset, Number(nal.time.time())) as float;
                    let urgency: float = Float32Math.add(
                        2.0,
                        Float32Math.divide(1.0, distance),
                    ) as float;

                    ProcessAnticipation.anticipate(nal, preconditionTask.sentence,
                        preconditionTask.getBudget(), precon.minTime, precon.maxTime, urgency,
                        substitution);
                }
                return; // don't try the other table as a specific solution was already used
            }
        }
    }

    /**
     * Search for the best precondition that best matches recent events, and is most
     * successful in leading to goal fulfilment
     *
     * @param nal               The derivation context
     * @param concept           The goal concept
     * @param projectedGoal     The goal projected to the current time
     * @param execPreconditions The procedural hypotheses with the executable
     *                          preconditions
     * @return The procedural hypothesis with the highest result truth expectation
     */
    private static calcBestExecutablePrecondition(nal: DerivationContext,
        concept: Concept, projectedGoal: Sentence, execPreconditions: java.util.List<Task> | Task[],
        anticipationsToMake: java.util.Map<Operation, java.util.List<ProcessGoal.ExecutablePrecondition>>): ProcessGoal.ExecutablePrecondition {
        let result: ProcessGoal.ExecutablePrecondition = new ProcessGoal.ExecutablePrecondition();
        for (let t of execPreconditions) {
            let precTerm: CompoundTerm = ((t.getTerm() as Implication).getSubject() as Conjunction);
            let prec: Term[] = precTerm.term;
            let newprec: Term[] = new Array<Term>(prec.length - 3);
            java.lang.System.arraycopy(prec, 0, newprec, 0, prec.length - 3);
            let timeOffset: float = Float32Math.from(Number((prec[prec.length - 1] as Interval).time)) as float;
            let timeWindowHalf: float = Float32Math.multiply(
                timeOffset,
                nal.narParameters.ANTICIPATION_TOLERANCE,
            ) as float;
            let op: Operation = prec[prec.length - 2] as Operation;
            let precondition: Term = Conjunction.make(newprec, TemporalRules.ORDER_FORWARD);
            let newesttime: long = -1n;
            let bestsofar: Task | null = null;
            const prec_intervals: float[] = [];
            for (let l of CompoundTerm.extractIntervals(nal.memory, precTerm)) {
                prec_intervals.push(Float32Math.from(Number(l)) as float);
            }
            let subsconc: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
            let conclusionMatches: boolean = Variables.findSubstitute(nal.memory.randomNumber, Symbols.VAR_INDEPENDENT,
                CompoundTerm.replaceIntervals((t.getTerm() as Implication).getPredicate()),
                CompoundTerm.replaceIntervals(projectedGoal.getTerm()), subsconc, new java.util.LinkedHashMap());
            // ok we can look now how much it is fullfilled
            // check recent events in event bag
            let subsBest: java.util.Map<Term, Term> = new java.util.LinkedHashMap();
            /* synchronized (concept.memory.seq_current) { */
            for (let p of concept.memory.seq_current) {
                if (p.sentence.isJudgment() && !p.sentence.isEternal()
                    && p.sentence.getOccurrenceTime() > newesttime
                    && p.sentence.getOccurrenceTime() <= nal.time.time()) {
                    let subs: java.util.Map<Term, Term> = new java.util.LinkedHashMap(subsconc);
                    let preconditionMatches: boolean = Variables.findSubstitute(nal.memory.randomNumber,
                        Symbols.VAR_INDEPENDENT,
                        CompoundTerm.replaceIntervals(precondition),
                        CompoundTerm.replaceIntervals(p.sentence.term), subs, new java.util.LinkedHashMap());
                    if (preconditionMatches && conclusionMatches) {
                        let pNew: Task = new Task(p.sentence.clone(), p.getBudget().clone(),
                            p.isInput() ? Task.EnumType.INPUT : Task.EnumType.DERIVED);
                        newesttime = p.sentence.getOccurrenceTime();
                        // Apply interval penalty for interval differences in the precondition
                        LocalRules.intervalProjection(nal, pNew.sentence.term, precondition, prec_intervals,
                            pNew.sentence.getTruth());
                        bestsofar = pNew;
                        subsBest = subs;
                    }
                }
            }
            /* } */
            if (bestsofar === null) {
                continue;
            }
            // ok now we can take the desire value:
            let A: TruthValue = projectedGoal.getTruth();
            // and the truth of the hypothesis:
            let Hyp: TruthValue = t.sentence.getTruth();
            // and derive the conjunction of the left side:
            let leftside: TruthValue = TruthFunctions.desireDed(A, Hyp, concept.memory.narParameters);
            // overlap will almost never happen, but to make sure
            if (Stamp.baseOverlap(projectedGoal.stamp, t.sentence.stamp) ||
                Stamp.baseOverlap(bestsofar.sentence.stamp, t.sentence.stamp) ||
                Stamp.baseOverlap(projectedGoal.stamp, bestsofar.sentence.stamp)) {
                continue;
            }
            // and the truth of the precondition:
            let projectedPrecon: Sentence = bestsofar.sentence.projection(nal.time.time() /*- distance*/,
                nal.time.time(), concept.memory);
            if (projectedPrecon.isEternal()) {
                continue; // projection wasn't better than eternalization, too long in the past
            }
            let precon: TruthValue = projectedPrecon.getTruth();

            // in order to derive the operator desire value:
            let opdesire: TruthValue = TruthFunctions.desireDed(precon, leftside, concept.memory.narParameters);
            let expecdesire: float = opdesire.getExpectation();
            let bestOp: Operation = (op as CompoundTerm).applySubstitute(subsBest) as Operation;
            const timeNow: number = Number(nal.time.time());
            const minTimeFloat: float = Float32Math.subtract(
                Float32Math.add(timeNow, timeOffset), timeWindowHalf);
            const maxTimeFloat: float = Float32Math.add(
                Float32Math.add(timeNow, timeOffset), timeWindowHalf);
            let minTime: long = BigInt(Math.trunc(minTimeFloat));
            let maxTime: long = BigInt(Math.trunc(maxTimeFloat));
            if (expecdesire > result.bestOp_truthExp) {
                result.bestOp = bestOp;
                result.bestOp_truthExp = expecdesire;
                result.bestOp_truth = opdesire;
                result.executable_precondition = t;
                result.substitution = subsBest;
                result.minTime = minTime;
                result.maxTime = maxTime;
                result.timeOffset = timeOffset;
                let anticipations = anticipationsToMake.get(bestOp);
                if (anticipations === null) {
                    anticipations = new java.util.ArrayList<ProcessGoal.ExecutablePrecondition>();
                    anticipationsToMake.put(bestOp, anticipations);
                }
                anticipations.add(result);
            }
        }
        return result;
    }

    /**
     * Execute the operation suggested by the most applicable precondition
     *
     * @param nal           The derivation context
     * @param precon        The procedural hypothesis leading to goal
     * @param concept       The concept of the goal
     * @param projectedGoal The goal projected to the current time
     * @param task          The goal task
     */
    private static executePrecondition(nal: DerivationContext, precon: ProcessGoal.ExecutablePrecondition,
        concept: Concept, projectedGoal: Sentence, task: Task): boolean {
        const bestOp = precon.bestOp;
        const bestOpTruth = precon.bestOp_truth;
        if (bestOp !== null && bestOpTruth !== null && precon.bestOp_truthExp > nal.narParameters.DECISION_THRESHOLD /*
                                                                                                    * && Math.random() <
                                                                                                    * bestOp_truthexp
                                                                                                    */) {
            let createdSentence: Sentence = new Sentence(
                bestOp,
                Symbols.GOAL_MARK,
                bestOpTruth,
                projectedGoal.stamp);
            let t: Task = new Task(createdSentence,
                new BudgetValue(1.0, 1.0, 1.0, nal.narParameters),
                Task.EnumType.DERIVED);
            // System.out.println("used " +t.getTerm().toString() +
            // String.valueOf(nal.memory.randomNumber.nextInt()));
            if (!task.sentence.stamp.evidenceIsCyclic()) {
                if (!ProcessGoal.executeOperation(nal, t)) { // this task is just used as dummy
                    concept.memory.emit(Events.UnexecutableGoal.class, task, concept, nal);
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Entry point for all potentially executable operation tasks.
     * Returns true if the Task has a Term which can be executed
     *
     * @param nal The derivation concept
     * @param t   The operation goal task
     */
    public static executeOperation(nal: DerivationContext, t: Task): boolean {
        let content: Term = t.getTerm();
        if (!(nal.memory.allowExecution) || !(content instanceof Operation)) {
            return false;
        }
        let op: Operation = content as Operation;
        let oper: Operator = op.getOperator();
        let prod: Product = op.getSubject() as Product;
        let arg: Term = prod.term[0];
        if (oper instanceof FunctionOperator) {
            for (let i: int = 0; i < prod.term.length - 1; i++) { // except last one, the output arg
                if (prod.term[i].hasVarDep() || prod.term[i].hasVarIndep()) {
                    return false;
                }
            }
        } else {
            if (content.hasVarDep() || content.hasVarIndep()) {
                return false;
            }
        }
        if (!arg.equals(Term.SELF)) { // will be deprecated in the future
            return false;
        }

        op.setTask(t);
        if (!oper.call(op, nal.memory, nal.time)) {
            return false;
        }
        if (Debug.DETAILED) {
            java.lang.System.out.println(t.toStringLong());
        }
        return true;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace ProcessGoal {
    export type ExecutablePrecondition = InstanceType<typeof ProcessGoal.ExecutablePrecondition>;
}


