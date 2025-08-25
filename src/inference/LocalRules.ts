import { java, JavaObject, type int, type long, type float } from "jree";



/**
 * Directly process a task by a oldBelief, with only two Terms in both. In
 * matching, the new task is compared with an existing direct Task in that
 * Concept, to carry out:
 * <p>
 * revision: between judgments or goals on non-overlapping evidence;<br>
 * satisfy: between a Sentence and a Question/Goal; <br>
 * merge: between items of the same type and stamp; <br>
 * conversion: between different inheritance relations.<br>
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class LocalRules extends JavaObject {

    /* -------------------- same contents -------------------- */
    /**
     * The task and belief have the same content
     *
     * @param task   The task
     * @param belief The belief
     */
    // called in RuleTables.reason
    public static match(/* final */  task: Task, /* final */  belief: Sentence, beliefConcept: Concept,
            /* final */  nal: DerivationContext): boolean {
        let sentence: Sentence = task.sentence;

        if (sentence.isJudgment()) {
            if (LocalRules.revisable(sentence, belief, nal.narParameters)) {
                return LocalRules.revision(sentence, belief, beliefConcept, true, nal);
            }
        } else {
            if (matchingOrder(sentence, belief)) {
                let u: Term[] = [sentence.term, belief.term];
                if (Variables.unify(nal.memory.randomNumber, Symbols.VAR_QUERY, u)) {
                    LocalRules.trySolution(belief, task, nal, true);
                }
            }
        }
        return false;
    }

    /**
     * Check whether two sentences can be used in revision
     *
     * @param s1 The first sentence
     * @param s2 The second sentence
     * @return If revision is possible between the two sentences
     */
    public static revisable(/* final */  s1: Sentence, /* final */  s2: Sentence, narParameters: Parameters): boolean {
        if (!s1.isEternal() && !s2.isEternal() && java.lang.Math
            .abs(s1.getOccurrenceTime()
                - s2.getOccurrenceTime()) > narParameters.REVISION_MAX_OCCURRENCE_DISTANCE) {
            return false;
        }
        if (s1.term.term_indices !== null && s2.term.term_indices !== null) {
            for (let i: int = 0; i < s1.term.term_indices.length; i++) {
                if (s1.term.term_indices[i] !== s2.term.term_indices[i]) {
                    return false;
                }
            }
        }
        return (s1.getRevisable() &&
            matchingOrder(s1.getTemporalOrder(), s2.getTemporalOrder()) &&
            CompoundTerm.replaceIntervals(s1.term).equals(CompoundTerm.replaceIntervals(s2.term)) &&
            !Stamp.baseOverlap(s1.stamp, s2.stamp));
    }

    /**
     * Belief revision
     *
     * Summarizes the evidence of two beliefs with same content.
     * called from processGoal and processJudgment and LocalRules.match
     *
     * @param newBelief       The new belief in task
     * @param oldBelief       The previous belief with the same content
     * @param feedbackToLinks Whether to send feedback to the links
     */
    public static revision(/* final */  newBelief: Sentence, /* final */  oldBelief: Sentence, /* final */  beliefConcept: Concept,
            /* final */  feedbackToLinks: boolean, /* final */  nal: DerivationContext): boolean {
        if (newBelief.term === null) {
            return false;
        }

        newBelief.stamp.alreadyAnticipatedNegConfirmation = oldBelief.stamp.alreadyAnticipatedNegConfirmation;
        let newTruth: TruthValue = newBelief.truth.clone();
        let oldTruth: TruthValue = oldBelief.truth;
        let useNewBeliefTerm: boolean = LocalRules.intervalProjection(nal, newBelief.getTerm(), oldBelief.getTerm(),
            beliefConcept.recent_intervals, newTruth);

        let truth: TruthValue = TruthFunctions.revision(newTruth, oldTruth, nal.narParameters);
        let budget: BudgetValue = BudgetFunctions.revise(newTruth, oldTruth, truth, feedbackToLinks, nal);

        if (budget.aboveThreshold()) {
            let counter: long = -1; // -1 is invalid
            if (newBelief.term instanceof Implication && oldBelief.term instanceof Implication) {
                // add because the evidence adds up
                counter = (newBelief.term as Implication).counter + (oldBelief.term as Implication).counter;
            }
            return nal.doublePremiseTaskRevised(useNewBeliefTerm ? newBelief.term : oldBelief.term, truth, budget,
                counter);
        }

        return false;
    }

    /**
     * Interval projection
     *
     * Decides to use whether to use old or new term dependent on which one is more
     * usual,
     * also discounting the truth confidence according to the interval difference.
     * called by Revision
     *
     * @param nal
     * @param newBeliefTerm
     * @param oldBeliefTerm
     * @param recent_ivals  recent intervals
     * @param newTruth
     * @return
     */
    public static intervalProjection(/* final */  nal: DerivationContext, /* final */  newBeliefTerm: Term,
            /* final */  oldBeliefTerm: Term, /* final */  recent_ivals: java.util.List<java.lang.Float>, /* final */  newTruth: TruthValue): boolean {
        let useNewBeliefTerm: boolean = false;
        if (newBeliefTerm.hasInterval()) {
            let ivalOld: java.util.List<java.lang.Long> = extractIntervals(nal.memory, oldBeliefTerm);
            let ivalNew: java.util.List<java.lang.Long> = extractIntervals(nal.memory, newBeliefTerm);
            let AbsDiffSumNew: long = 0;
            let AbsDiffSumOld: long = 0;
            /* synchronized (recent_ivals) { */
            if (recent_ivals.isEmpty()) {
                for (let l of ivalOld) {
                    recent_ivals.add(l as float);
                }
            }
            for (let i: int = 0; i < ivalNew.size(); i++) {
                let inBetween: float = (recent_ivals.get(i) + ivalNew.get(i)) / 2.0;
                // vote as one new entry, turtle style
                let speed: float = 1.0
                    / (nal.narParameters.INTERVAL_ADAPT_SPEED * (1.0 - newTruth.getExpectation()));
                // less truth expectation, slower
                recent_ivals.set(i, recent_ivals.get(i) + speed * (inBetween - recent_ivals.get(i)));
            }
            for (let i: int = 0; i < ivalNew.size(); i++) {
                AbsDiffSumNew += java.lang.Math.abs(ivalNew.get(i) - recent_ivals.get(i));
            }
            for (let i: int = 0; i < ivalNew.size(); i++) {
                AbsDiffSumOld += java.lang.Math.abs(ivalOld.get(i) - recent_ivals.get(i));
            }
            /* } */
            let AbsDiffSum: long = 0;
            for (let i: int = 0; i < ivalNew.size(); i++) {
                AbsDiffSum += java.lang.Math.abs(ivalNew.get(i) - ivalOld.get(i));
            }
            let a: float = temporalProjection(0, AbsDiffSum, 0, nal.memory.narParameters);
            // re-project, and it's safe:
            // we won't count more confidence than
            // when the second premise would have been shifted
            // to the necessary time in the first place
            // to build the hypothesis newBelief encodes
            newTruth.setConfidence(newTruth.getConfidence() * a);
            useNewBeliefTerm = AbsDiffSumNew < AbsDiffSumOld;
        }
        return useNewBeliefTerm;
    }

    /**
     * Check if a Sentence provide a better answer to a Question or Goal
     *
     * @param belief The proposed answer
     * @param task   The task to be processed
     */
    public static trySolution(/* final */  belief: Sentence, /* final */  task: Task, /* final */  nal: DerivationContext,
            /* final */  report: boolean): boolean {
        let problem: Sentence = task.sentence;
        let memory: Memory = nal.mem();
        let oldBest: Sentence = task.getBestSolution();

        if (oldBest !== null) {
            let rateByConfidence: boolean = oldBest.getTerm().equals(belief.getTerm());
            let newQ: float = LocalRules.solutionQuality(rateByConfidence, task, belief, memory, nal.time);
            let oldQ: float = LocalRules.solutionQuality(rateByConfidence, task, oldBest, memory, nal.time);
            let isBetterSolution: boolean = newQ > oldQ;
            memory.emit(Events.TrySolution.class, isBetterSolution, task, belief);
            if (!isBetterSolution) {
                if (problem.isGoal() && memory.emotion !== null) {
                    memory.emotion.adjustSatisfaction(oldQ, task.getPriority(), nal);
                }
                memory.emit(Unsolved.class, task, belief, "Lower quality");
                return false;
            }
        }
        task.setBestSolution(memory, belief, nal.time);
        // memory.logic.SOLUTION_BEST.commit(task.getPriority());

        let budget: BudgetValue = LocalRules.solutionEval(task, belief, task, nal);
        if ((budget !== null) && budget.aboveThreshold()) {

            // Solution Activated
            if (task.sentence.punctuation === Symbols.QUESTION_MARK || task.sentence.punctuation === Symbols.QUEST_MARK) {
                if (task.isInput() && report) { // only show input tasks as solutions
                    memory.emit(Answer.class, task, belief);
                } else {
                    memory.emit(OutputHandler.class, task, belief); // solution to quests and questions can be always
                    // showed
                }
            } else {
                memory.emit(OutputHandler.class, task, belief); // goal things only show silence related
            }

            nal.addTask(nal.getCurrentTask(), budget, belief, task.getParentBelief());
            return true;
        } else {
            memory.emit(Unsolved.class, task, belief, "Insufficient budget");
        }
        return false;
    }

    /**
     * Evaluate the quality of the judgment as a solution to a problem
     *
     * @param probT    A goal or question
     * @param solution The solution to be evaluated
     * @return The quality of the judgment as the solution
     */
    public static solutionQuality(/* final */  rateByConfidence: boolean, /* final */  probT: Task, /* final */  solution: Sentence,
            /* final */  memory: Memory, /* final */  time: Timable): float {
        let problem: Sentence = probT.sentence;

        if ((probT.sentence.punctuation !== solution.punctuation && solution.term.hasVarQuery())
            || !matchingOrder(problem.getTemporalOrder(), solution.getTemporalOrder())) {
            return 0.0;
        }

        let truth: TruthValue = solution.truth;
        if (problem.getOccurrenceTime() !== solution.getOccurrenceTime()) {
            truth = solution.projectionTruth(problem.getOccurrenceTime(), time.time(), memory);
        }

        // when the solutions are comparable, we have to use confidence!! else truth
        // expectation.
        // this way negative evidence can update the solution instead of getting ignored
        // due to lower truth expectation.
        // so the previous handling to let whether the problem has query vars decide was
        // wrong.
        if (!rateByConfidence) {
            /*
             * just some function that decreases quality of solution if it is complex, and
             * increases if it has a high truth expecation
             */

            return (truth.getExpectation() / java.lang.Math
                .sqrt(java.lang.Math.sqrt(java.lang.Math.sqrt(solution.term.getComplexity() * memory.narParameters.COMPLEXITY_UNIT)))) as float;
        } else {
            return truth.getConfidence() as float;
        }
    }

    /* ----- Functions used both in direct and indirect processing of tasks ----- */
    /**
     * Evaluate the quality of a belief as a solution to a problem, then reward
     * the belief and de-prioritize the problem
     *
     * @param problem  The problem (question or goal) to be solved
     * @param solution The belief as solution
     * @param task     The task to be immediately processed, or null for continued
     *                 process
     * @return The budget for the new task which is the belief activated, if
     *         necessary
     */
    public static solutionEval(/* final */  problem: Task, /* final */  solution: Sentence, task: Task,
            /* final */  nal: org.opennars.control.DerivationContext): BudgetValue {
        if (problem.sentence.punctuation !== solution.punctuation && solution.term.hasVarQuery()) {
            return null;
        }
        let budget: BudgetValue = null;
        let feedbackToLinks: boolean = false;
        if (task === null) {
            task = nal.getCurrentTask();
            feedbackToLinks = true;
        }
        let judgmentTask: boolean = task.sentence.isJudgment();
        let rateByConfidence: boolean = problem.getTerm().hasVarQuery(); // here its whether its a what or where
        // question for budget adjustment
        let quality: float = LocalRules.solutionQuality(rateByConfidence, problem, solution, nal.mem(), nal.time);

        if (problem.sentence.isGoal() && nal.memory.emotion !== null) {
            nal.memory.emotion.adjustSatisfaction(quality, task.getPriority(), nal);
        }

        if (judgmentTask) {
            task.incPriority(quality);
        } else {
            let taskPriority: float = task.getPriority(); // +goal satisfication is a matter of degree -
            // https://groups.google.com/forum/#!topic/open-nars/ZfCM416Dx1M
            budget = new BudgetValue(UtilityFunctions.or(taskPriority, quality), task.getDurability(),
                BudgetFunctions.truthToQuality(solution.truth), nal.narParameters);
            task.setPriority(java.lang.Math.min(1 - quality, taskPriority));
        }
        if (feedbackToLinks) {
            let tLink: TaskLink = nal.getCurrentTaskLink();
            tLink.setPriority(java.lang.Math.min(1 - quality, tLink.getPriority()));
            let bLink: TermLink = nal.getCurrentBeliefLink();
            bLink.incPriority(quality);
        }
        return budget;
    }

    /* -------------------- same terms, difference relations -------------------- */
    /**
     * The task and belief match reversely
     *
     * @param nal Reference to the memory
     */
    public static matchReverse(/* final */  nal: DerivationContext): void {
        let task: Task = nal.getCurrentTask();
        let belief: Sentence = nal.getCurrentBelief();
        let sentence: Sentence = task.sentence;
        if (matchingOrder(sentence.getTemporalOrder(), java.util.Collections.reverseOrder(belief.getTemporalOrder()))) {
            if (sentence.isJudgment()) {
                LocalRules.inferToSym(sentence, belief, nal);
            } else {
                LocalRules.conversion(nal);
            }
        }
    }

    /**
     * Inheritance/Implication matches Similarity/Equivalence
     *
     * @param asym   A Inheritance/Implication sentence
     * @param sym    A Similarity/Equivalence sentence
     * @param figure location of the shared term
     * @param nal    Reference to the memory
     */
    public static matchAsymSym(/* final */  asym: Sentence, /* final */  sym: Sentence, /* final */  figure: int,
            /* final */  nal: DerivationContext): void {
        if (nal.getCurrentTask().sentence.isJudgment()) {
            LocalRules.inferToAsym(asym, sym, nal);
        } else {
            LocalRules.convertRelation(nal);
        }
    }

    /* -------------------- two-premise inference rules -------------------- */
    /**
     * Produce Similarity/Equivalence from a pair of reversed
     * Inheritance/Implication
     * <br>
     * {<S --> P>, <P --> S} |- <S <-> p>
     *
     * @param judgment1 The first premise
     * @param judgment2 The second premise
     * @param nal       Reference to the memory
     */
    private static inferToSym(/* final */  judgment1: Sentence, /* final */  judgment2: Sentence, /* final */  nal: DerivationContext): void {
        let s1: Statement = judgment1.term as Statement;
        let t1: Term = s1.getSubject();
        let t2: Term = s1.getPredicate();
        let content: Term;
        if (s1 instanceof Inheritance) {
            content = Similarity.make(t1, t2);
        } else {
            content = Equivalence.make(t1, t2, s1.getTemporalOrder());
        }
        let value1: TruthValue = judgment1.truth;
        let value2: TruthValue = judgment2.truth;
        let truth: TruthValue = TruthFunctions.intersection(value1, value2, nal.narParameters);
        let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
        nal.doublePremiseTask(content, truth, budget, false, false); // (allow overlap) but not needed here, isn't
        // detachment
    }

    /**
     * Produce an Inheritance/Implication from a Similarity/Equivalence and a
     * reversed Inheritance/Implication
     * <br>
     * {<S <-> P>, <P --> S>} |- <S --> P>
     *
     * @param asym The asymmetric premise
     * @param sym  The symmetric premise
     * @param nal  Reference to the memory
     */
    private static inferToAsym(/* final */  asym: Sentence, /* final */  sym: Sentence, /* final */  nal: DerivationContext): void {
        let statement: Statement = asym.term as Statement;
        let sub: Term = statement.getPredicate();
        let pre: Term = statement.getSubject();

        let content: Statement = Statement.make(statement, sub, pre, statement.getTemporalOrder());
        if (content === null)
            return;

        let truth: TruthValue = TruthFunctions.reduceConjunction(sym.truth, asym.truth, nal.narParameters);
        let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
        nal.doublePremiseTask(content, truth, budget, false, false);
    }

    /* -------------------- one-premise inference rules -------------------- */
    /**
     * Produce an Inheritance/Implication from a reversed Inheritance/Implication
     * <br>
     * {<P --> S>} |- <S --> P>
     *
     * @param nal Reference to the memory
     */
    private static conversion(/* final */  nal: DerivationContext): void {
        let truth: TruthValue = TruthFunctions.conversion(nal.getCurrentBelief().truth, nal.narParameters);
        let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
        LocalRules.convertedJudgment(truth, budget, nal);
    }

    /**
     * Switch between Inheritance/Implication and Similarity/Equivalence
     * <br>
     * {<S --> P>} |- <S <-> P> {<S <-> P>} |-
     * <S --> P>
     *
     * @param nal Reference to the memory
     */
    private static convertRelation(/* final */  nal: DerivationContext): void {
        let truth: TruthValue = nal.getCurrentBelief().truth;
        if ((nal.getCurrentTask().getTerm() as CompoundTerm).isCommutative()) {
            truth = TruthFunctions.abduction(truth, 1.0, nal.narParameters);
        } else {
            truth = TruthFunctions.deduction(truth, 1.0, nal.narParameters);
        }
        let budget: BudgetValue = BudgetFunctions.forward(truth, nal);
        LocalRules.convertedJudgment(truth, budget, nal);
    }

    /**
     * Convert judgment into different relation
     * <p>
     * called in MatchingRules
     *
     * @param newBudget The budget value of the new task
     * @param newTruth  The truth value of the new task
     * @param nal       Reference to the memory
     */
    private static convertedJudgment(/* final */  newTruth: TruthValue, /* final */  newBudget: BudgetValue,
            /* final */  nal: DerivationContext): void {
        let content: Statement = nal.getCurrentTask().getTerm() as Statement;
        let beliefContent: Statement = nal.getCurrentBelief().term as Statement;
        let order: int = TemporalRules.reverseOrder(beliefContent.getTemporalOrder());
        let subjT: Term = content.getSubject();
        let predT: Term = content.getPredicate();
        let subjB: Term = beliefContent.getSubject();
        let predB: Term = beliefContent.getPredicate();
        let otherTerm: Term;
        if (subjT.hasVarQuery()) {
            otherTerm = (predT.equals(subjB)) ? predB : subjB;
            content = Statement.make(content, otherTerm, predT, order);
        }
        if (predT.hasVarQuery()) {
            otherTerm = (subjT.equals(subjB)) ? predB : subjB;
            content = Statement.make(content, subjT, otherTerm, order);
        }

        if (content === null) {
            return;
        }

        nal.singlePremiseTask(content, Symbols.JUDGMENT_MARK, newTruth, newBudget);
    }

}
