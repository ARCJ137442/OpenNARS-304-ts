//! Java source: opennars/inference/RuleTables.java
import { java, JavaObject, type short, type int, S } from "jree";



/**
 * Table of inference rules, indexed by the TermLinks for the task and the
 * belief. Used in indirective processing of a task, to dispatch inference cases
 * to the relevant inference rules.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class RuleTables extends JavaObject {

    /**
     * Entry point of the inference engine
     *
     * @param tLink The selected TaskLink, which will provide a task
     * @param bLink The selected TermLink, which may provide a belief
     */
    public static reason(tLink: TaskLink, bLink: TermLink, nal: DerivationContext): void {

        // REFACTOR< the body should be split into another static function >

        let memory: Memory = nal.mem();

        let task: Task = nal.getCurrentTask();
        let taskSentence: Sentence = task.sentence;

        let taskTerm: Term = taskSentence.term; // cloning for substitution
        let beliefTerm: Term = bLink.target; // cloning for substitution

        let beliefConcept: Concept = memory.concept(beliefTerm);

        let belief: Sentence = null;
        if (beliefConcept !== null) {
            /* synchronized (beliefConcept) { */ // we only need the target concept to select a belief
            belief = beliefConcept.getBelief(nal, task);
            /* } */
        }

        nal.setCurrentBelief(belief);

        if (belief !== null) {
            beliefTerm = belief.term; // because interval handling that differs on conceptual level

            /*
             * Sentence belief_event = beliefConcept.getBeliefForTemporalInference(task);
             * if(belief_event != null) {
             * boolean found_overlap = false;
             * if(Stamp.baseOverlap(task.sentence.stamp.evidentialBase,
             * belief_event.stamp.evidentialBase)) {
             * found_overlap = true;
             * }
             * if(!found_overlap) { //temporal rules are inductive so no chance to succeed
             * if there is an overlap
             * //and since the temporal rule is relatively expensive the check here was
             * good.
             * Sentence inference_belief = belief;
             * nal.setCurrentBelief(belief_event);
             * nal.setTheNewStamp(task.sentence.stamp, belief_event.stamp,
             * nal.memory.time());
             * TemporalRules.temporalInduction(task.sentence, belief_event, nal, true);
             * nal.setCurrentBelief(inference_belief);
             * nal.setTheNewStamp(task.sentence.stamp, belief.stamp, nal.memory.time());
             * }
             * }
             */

            // too restrictive, its checked for non-deductive inference rules in derivedTask
            // (also for single prem)
            nal.evidentialOverlap = Stamp.baseOverlap(task.sentence.stamp, belief.stamp);
            if (nal.evidentialOverlap && (!task.sentence.isEternal() || !belief.isEternal())) {
                return; // only allow for eternal reasoning for now to prevent derived event floods
            }

            nal.emit(Events.BeliefReason.class, belief, beliefTerm, taskTerm, nal);

            if (LocalRules.match(task, belief, beliefConcept, nal)) { // new tasks resulted from the match, so return
                return;
            }
        }

        // current belief and task may have changed, so set again:
        nal.setCurrentBelief(belief);
        nal.setCurrentTask(task);

        // put here since LocalRules match should be possible even if the belief is
        // foreign
        if (equalSubTermsInRespectToImageAndProduct(taskTerm, beliefTerm))
            return;

        /*
         * if ((memory.getNewTaskCount() > 0) && taskSentence.isJudgment()) {
         * return;
         * }
         */

        RuleTables.applyRuleTable(tLink, bLink, nal, task, taskSentence, taskTerm, beliefTerm, belief);
    }

    private static applyRuleTable(tLink: TaskLink, bLink: TermLink, nal: DerivationContext, task: Task,
        taskSentence: Sentence, taskTerm: Term, beliefTerm: Term, belief: Sentence): void {
        let tIndex: short = tLink.getIndex(0);
        let bIndex: short = bLink.getIndex(0);
        switch (tLink.type) { // dispatch first by TaskLink type
            case TermLink.SELF:
                switch (bLink.type) {
                    case TermLink.COMPONENT:
                        RuleTables.compoundAndSelf(taskTerm as CompoundTerm, beliefTerm, true, bIndex, nal);
                        break;
                    case TermLink.COMPOUND:
                        RuleTables.compoundAndSelf(beliefTerm as CompoundTerm, taskTerm, false, bIndex, nal);
                        break;
                    case TermLink.COMPONENT_STATEMENT:
                        if (belief !== null) {
                            if (taskTerm instanceof Statement) {
                                SyllogisticRules.detachment(taskSentence, belief, bIndex, nal);
                            }
                        } // else {
                        RuleTables.goalFromQuestion(task, taskTerm, nal);
                        // }
                        break;
                    case TermLink.COMPOUND_STATEMENT:
                        if (belief !== null) {
                            SyllogisticRules.detachment(belief, taskSentence, bIndex, nal);
                        }
                        break;
                    case TermLink.COMPONENT_CONDITION:
                        if ((belief !== null) && (taskTerm instanceof Implication)) {
                            bIndex = bLink.getIndex(1);
                            SyllogisticRules.conditionalDedInd(task.sentence, taskTerm as Implication, bIndex,
                                beliefTerm, tIndex, nal);
                        }
                        break;
                    case TermLink.COMPOUND_CONDITION:
                        if ((belief !== null) && (beliefTerm instanceof Implication)) {
                            bIndex = bLink.getIndex(1);
                            SyllogisticRules.conditionalDedInd(belief, beliefTerm as Implication, bIndex, taskTerm,
                                tIndex, nal);
                        }
                        break;

                    default:

                }
                break;
            case TermLink.COMPOUND:
                switch (bLink.type) {
                    case TermLink.COMPOUND:
                        if (taskTerm instanceof CompoundTerm && beliefTerm instanceof CompoundTerm) {
                            RuleTables.compoundAndCompound(taskTerm as CompoundTerm, beliefTerm as CompoundTerm, tIndex, bIndex,
                                nal);
                        }
                        break;
                    case TermLink.COMPOUND_STATEMENT:
                        RuleTables.compoundAndStatement(taskTerm as CompoundTerm, tIndex, beliefTerm as Statement, bIndex,
                            beliefTerm, nal);
                        break;
                    case TermLink.COMPOUND_CONDITION:
                        if (belief !== null) {
                            if (beliefTerm instanceof Implication) {
                                let u: Term[] = [beliefTerm, taskTerm];
                                if (Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT,
                                    (beliefTerm as Statement).getSubject(), taskTerm, u, true)) { // only secure
                                    // place that
                                    let newBelief: Sentence = belief.clone(u[0]); // allows partial match
                                    let newTaskSentence: Sentence = taskSentence.clone(u[1]);
                                    RuleTables.detachmentWithVar(newBelief, newTaskSentence, bIndex, false, nal);
                                } else {
                                    SyllogisticRules.conditionalDedInd(belief, beliefTerm as Implication, bIndex,
                                        taskTerm, -1, nal);
                                }

                            } else if (beliefTerm instanceof Equivalence) {
                                SyllogisticRules.conditionalAna(beliefTerm as Equivalence, bIndex, taskTerm, -1, nal);
                            }
                        }
                        break;

                    default:

                }
                break;
            case TermLink.COMPOUND_STATEMENT:
                switch (bLink.type) {
                    case TermLink.COMPONENT:
                        if (taskTerm instanceof Statement) {
                            RuleTables.goalFromWantBelief(task, tIndex, bIndex, taskTerm, nal, beliefTerm);
                            RuleTables.componentAndStatement(nal.getCurrentTerm() as CompoundTerm, bIndex, taskTerm as Statement,
                                tIndex, nal);
                        }
                        break;
                    case TermLink.COMPOUND:
                        if (taskTerm instanceof Statement && beliefTerm instanceof CompoundTerm) {
                            RuleTables.compoundAndStatement(beliefTerm as CompoundTerm, bIndex, taskTerm as Statement, tIndex,
                                beliefTerm, nal);
                        }
                        break;
                    case TermLink.COMPOUND_STATEMENT:
                        if (belief !== null) {
                            RuleTables.syllogisms(tLink, bLink, taskTerm, beliefTerm, nal);
                        }
                        break;
                    case TermLink.COMPOUND_CONDITION:
                        if (belief !== null) {
                            bIndex = bLink.getIndex(1);
                            if ((taskTerm instanceof Statement) && (beliefTerm instanceof Implication)) {
                                RuleTables.conditionalDedIndWithVar(belief, beliefTerm as Implication, bIndex, taskTerm as Statement,
                                    tIndex, nal);
                            }
                        }
                        break;

                    default:

                }
                break;
            case TermLink.COMPOUND_CONDITION:
                switch (bLink.type) {
                    case TermLink.COMPOUND:
                        if (belief !== null) {
                            RuleTables.detachmentWithVar(taskSentence, belief, tIndex, nal);
                        }
                        break;

                    case TermLink.COMPOUND_STATEMENT:
                        if (belief !== null) {
                            if (taskTerm instanceof Implication) // TODO maybe put instanceof test within
                            // conditionalDedIndWithVar()
                            {
                                let subj: Term = (taskTerm as Statement).getSubject();
                                if (subj instanceof Negation) {
                                    if (taskSentence.isJudgment()) {
                                        RuleTables.componentAndStatement(subj as CompoundTerm, bIndex, taskTerm as Statement, tIndex,
                                            nal);
                                    } else {
                                        RuleTables.componentAndStatement(subj as CompoundTerm, tIndex, beliefTerm as Statement,
                                            bIndex, nal);
                                    }
                                } else {
                                    RuleTables.conditionalDedIndWithVar(task.sentence, taskTerm as Implication, tIndex,
                                        beliefTerm as Statement, bIndex, nal);
                                }
                            }
                            break;
                        }
                        break;

                    default:

                }

            default:

        }
    }

    public static goalFromWantBelief(task: Task, tIndex: short, bIndex: short, taskTerm: Term,
        nal: DerivationContext, beliefTerm: Term): void {
        if (task.sentence.isJudgment() && tIndex === 0 && bIndex === 1 && taskTerm instanceof Operation) {
            let op: Operation = taskTerm as Operation;
            if (op.getPredicate() === nal.memory.getOperator("^want")) {
                let newTruth: TruthValue = TruthFunctions.deduction(task.sentence.truth, nal.narParameters.reliance,
                    nal.narParameters);
                nal.singlePremiseTask((taskTerm as Operation).getArguments().term[1], Symbols.GOAL_MARK, newTruth,
                    BudgetFunctions.forward(newTruth, nal));
            }
        }
    }

    private static goalFromQuestion(task: Task, taskTerm: Term, nal: DerivationContext): void {
        if (task.sentence.punctuation === Symbols.QUESTION_MARK
            && (taskTerm instanceof Implication || taskTerm instanceof Equivalence)) { // <a =/> b>? |- a!
            let goalterm: Term = null;
            let goalterm2: Term = null;
            if (taskTerm instanceof Implication) {
                let imp: Implication = taskTerm as Implication;
                if (imp.getTemporalOrder() !== TemporalRules.ORDER_BACKWARD
                    || imp.getTemporalOrder() === TemporalRules.ORDER_CONCURRENT) {
                    if (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY || imp.getSubject() instanceof Operation) {
                        goalterm = imp.getSubject();
                    }
                    if (goalterm instanceof Variable && goalterm.hasVarQuery()
                        && (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY
                            || imp.getPredicate() instanceof Operation)) {
                        goalterm = imp.getPredicate(); // overwrite, it is a how question, in case of <?how =/> b> it is
                        // b! which is desired
                    }
                } else if (imp.getTemporalOrder() === TemporalRules.ORDER_BACKWARD) {
                    if (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY || imp.getPredicate() instanceof Operation) {
                        goalterm = imp.getPredicate();
                    }
                    if (goalterm instanceof Variable && goalterm.hasVarQuery()
                        && (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY
                            || imp.getSubject() instanceof Operation)) {
                        goalterm = imp.getSubject(); // overwrite, it is a how question, in case of <?how =/> b> it is
                        // b! which is desired
                    }
                }
            } else if (taskTerm instanceof Equivalence) {
                let qu: Equivalence = taskTerm as Equivalence;
                if (qu.getTemporalOrder() === TemporalRules.ORDER_FORWARD
                    || qu.getTemporalOrder() === TemporalRules.ORDER_CONCURRENT) {
                    if (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY || qu.getSubject() instanceof Operation) {
                        goalterm = qu.getSubject();
                    }
                    if (!nal.narParameters.CURIOSITY_FOR_OPERATOR_ONLY || qu.getPredicate() instanceof Operation) {
                        goalterm2 = qu.getPredicate();
                    }
                }
            }
            let truth: TruthValue = TruthValue.fromFrequencyConfidence(1.0,
                nal.narParameters.DEFAULT_GOAL_CONFIDENCE * nal.narParameters.CURIOSITY_DESIRE_CONFIDENCE_MUL,
                nal.narParameters);
            if (goalterm !== null && !(goalterm instanceof Variable) && goalterm instanceof CompoundTerm) {
                goalterm = goalterm.cloneDeep();
                CompoundTerm.transformIndependentVariableToDependent(goalterm as CompoundTerm);
                (goalterm as CompoundTerm).invalidateName();
                let sent: Sentence = new Sentence(
                    goalterm,
                    Symbols.GOAL_MARK,
                    truth,
                    new Stamp(task.sentence.stamp, nal.time.time()));

                nal.singlePremiseTask(sent,
                    new BudgetValue(task.getPriority() * nal.narParameters.CURIOSITY_DESIRE_PRIORITY_MUL,
                        task.getDurability() * nal.narParameters.CURIOSITY_DESIRE_DURABILITY_MUL,
                        BudgetFunctions.truthToQuality(truth), nal.narParameters));
            }
            if (goalterm instanceof CompoundTerm && goalterm2 !== null && !(goalterm2 instanceof Variable)
                && goalterm2 instanceof CompoundTerm) {
                goalterm2 = goalterm2.cloneDeep();
                CompoundTerm.transformIndependentVariableToDependent(goalterm2 as CompoundTerm);
                (goalterm2 as CompoundTerm).invalidateName();
                let sent: Sentence = new Sentence(
                    goalterm2,
                    Symbols.GOAL_MARK,
                    truth.clone(),
                    new Stamp(task.sentence.stamp, nal.time.time()));

                nal.singlePremiseTask(sent,
                    new BudgetValue(task.getPriority() * nal.narParameters.CURIOSITY_DESIRE_PRIORITY_MUL,
                        task.getDurability() * nal.narParameters.CURIOSITY_DESIRE_DURABILITY_MUL,
                        BudgetFunctions.truthToQuality(truth), nal.narParameters));
            }
        }
    }

    /* ----- syllogistic inferences ----- */
    /**
     * Meta-table of syllogistic rules, indexed by the content classes of the
     * taskSentence and the belief
     *
     * @param tLink      The link to task
     * @param bLink      The link to belief
     * @param taskTerm   The content of task
     * @param beliefTerm The content of belief
     * @param nal        Reference to the memory
     */
    private static syllogisms(tLink: TaskLink, bLink: TermLink, taskTerm: Term,
        beliefTerm: Term, nal: DerivationContext): void {
        let taskSentence: Sentence = nal.getCurrentTask().sentence;
        let belief: Sentence = nal.getCurrentBelief();
        let figure: int;
        if (taskTerm instanceof Inheritance) {
            if (beliefTerm instanceof Inheritance) {
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricAsymmetric(taskSentence, belief, figure, nal);
            } else if (beliefTerm instanceof Similarity) {
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricSymmetric(taskSentence, belief, figure, nal);
            } else {
                RuleTables.detachmentWithVar(belief, taskSentence, bLink.getIndex(0), nal);
            }
        } else if (taskTerm instanceof Similarity) {
            if (beliefTerm instanceof Inheritance) {
                figure = RuleTables.indexToFigure(bLink, tLink);
                RuleTables.asymmetricSymmetric(belief, taskSentence, figure, nal);
            } else if (beliefTerm instanceof Similarity) {
                figure = RuleTables.indexToFigure(bLink, tLink);
                RuleTables.symmetricSymmetric(belief, taskSentence, figure, nal);
            } else if (beliefTerm instanceof Implication) {
                // Bridge to higher order statements:
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricSymmetric(belief, taskSentence, figure, nal);
            } else if (beliefTerm instanceof Equivalence) {
                // Bridge to higher order statements:
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.symmetricSymmetric(belief, taskSentence, figure, nal);
            }
        } else if (taskTerm instanceof Implication) {
            if (beliefTerm instanceof Implication) {
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricAsymmetric(taskSentence, belief, figure, nal);
            } else if (beliefTerm instanceof Equivalence) {
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricSymmetric(taskSentence, belief, figure, nal);
            } else if (beliefTerm instanceof Inheritance) {
                RuleTables.detachmentWithVar(taskSentence, belief, tLink.getIndex(0), nal);
            } else if (beliefTerm instanceof Similarity) {
                // Bridge to higher order statements:
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.asymmetricSymmetric(taskSentence, belief, figure, nal);
            }
        } else if (taskTerm instanceof Equivalence) {
            if (beliefTerm instanceof Implication) {
                figure = RuleTables.indexToFigure(bLink, tLink);
                RuleTables.asymmetricSymmetric(belief, taskSentence, figure, nal);
            } else if (beliefTerm instanceof Equivalence) {
                figure = RuleTables.indexToFigure(bLink, tLink);
                RuleTables.symmetricSymmetric(belief, taskSentence, figure, nal);
            } else if (beliefTerm instanceof Inheritance) {
                RuleTables.detachmentWithVar(taskSentence, belief, tLink.getIndex(0), nal);
            } else if (beliefTerm instanceof Similarity) {
                // Bridge to higher order statements:
                figure = RuleTables.indexToFigure(tLink, bLink);
                RuleTables.symmetricSymmetric(belief, taskSentence, figure, nal);
            }
        }
    }

    /**
     * Decide the figure of syllogism according to the locations of the common
     * term in the premises
     *
     * @param link1 The link to the first premise
     * @param link2 The link to the second premise
     * @return The figure of the syllogism, one of the four: 11, 12, 21, or 22
     */
    private static indexToFigure(link1: TLink<unknown>, link2: TLink<unknown>): int {
        return (link1.getIndex(0) + 1) * 10 + (link2.getIndex(0) + 1);
    }

    /**
     * Syllogistic rules whose both premises are on the same asymmetric relation
     *
     * @param taskSentence The taskSentence in the task
     * @param belief       The judgment in the belief
     * @param figure       The location of the shared term
     * @param nal          Reference to the memory
     */
    private static asymmetricAsymmetric(taskSentence: Sentence, belief: Sentence, figure: int,
        nal: DerivationContext): void {
        let taskStatement: Statement = taskSentence.term as Statement;
        let beliefStatement: Statement = belief.term as Statement;

        let u: Term[] = [taskStatement, beliefStatement];

        let figureLeft: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.LEFT);
        let figureRight: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.RIGHT);

        if (!Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT, taskStatement.retBySide(figureLeft),
            beliefStatement.retBySide(figureRight), u)) {
            return;
        }

        taskStatement = u[0] as Statement;
        beliefStatement = u[1] as Statement;
        if (taskStatement.equals(beliefStatement)) {
            return;
        }

        let isDeduction: boolean;
        let t1: Term;
        let t2: Term;

        switch (figure) {
            case 11: // induction
                {
                    let sensational: boolean = SyllogisticRules.abdIndCom(beliefStatement.getPredicate(),
                        taskStatement.getPredicate(), taskSentence, belief, figure, nal);
                    if (sensational) {
                        return;
                    }
                    CompositionalRules.composeCompound(taskStatement, beliefStatement, 0, nal);
                    // if(taskSentence.getOccurenceTime()==Stamp.ETERNAL &&
                    // belief.getOccurenceTime()==Stamp.ETERNAL)
                    CompositionalRules.introVarOuter(taskStatement, beliefStatement, 0, nal);// introVarImage(taskContent,
                    // beliefContent, index,
                    // memory);
                    CompositionalRules.eliminateVariableOfConditionAbductive(figure, taskSentence, belief, nal);
                }
                break;
            case 22: // abduction
                {
                    if (!SyllogisticRules.conditionalAbd(taskStatement.getSubject(), beliefStatement.getSubject(),
                        taskStatement, beliefStatement, nal)) { // if conditional abduction, skip the following
                        let sensational: boolean = SyllogisticRules.abdIndCom(taskStatement.getSubject(),
                            beliefStatement.getSubject(), taskSentence, belief, figure, nal);
                        if (sensational) {
                            return;
                        }
                        CompositionalRules.composeCompound(taskStatement, beliefStatement, 1, nal);
                        CompositionalRules.introVarOuter(taskStatement, beliefStatement, 1, nal);// introVarImage(taskContent,
                        // beliefContent, index,
                        // memory);
                    }

                    CompositionalRules.eliminateVariableOfConditionAbductive(figure, taskSentence, belief, nal);
                }
                break;

            case 12: // deduction
            case 21: // exemplification

                isDeduction = figure === 12;

                t1 = isDeduction ? beliefStatement.getSubject() : taskStatement.getSubject();
                t2 = isDeduction ? taskStatement.getPredicate() : beliefStatement.getPredicate();

                if (Variables.unify(nal.memory.randomNumber, VAR_QUERY, t1, t2,
                    [taskStatement, beliefStatement])) {
                    LocalRules.matchReverse(nal);
                } else {
                    SyllogisticRules.dedExe(t1, t2, taskSentence, belief, nal);
                }

                break;

            default:
        }
    }

    /**
     * Syllogistic rules whose first premise is on an asymmetric relation, and
     * the second on a symmetric relation
     *
     * @param asym   The asymmetric premise
     * @param sym    The symmetric premise
     * @param figure The location of the shared term
     * @param nal    Reference to the memory
     */
    private static asymmetricSymmetric(asym: Sentence, sym: Sentence, figure: int,
        nal: DerivationContext): void {
        let asymSt: Statement = asym.term as Statement;
        let symSt: Statement = sym.term as Statement;

        let figureLeft: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.LEFT);
        let figureRight: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.RIGHT);

        let u: Term[] = [asymSt, symSt];
        if (!Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT, asymSt.retBySide(figureLeft),
            symSt.retBySide(figureRight), u)) {
            return;
        }

        asymSt = u[0] as Statement;
        symSt = u[1] as Statement;
        let t1: Term = asymSt.retBySide(retOppositeSide(figureLeft));
        let t2: Term = symSt.retBySide(retOppositeSide(figureRight));

        if (Variables.unify(nal.memory.randomNumber, VAR_QUERY, t1, t2, u)) {
            LocalRules.matchAsymSym(asym, sym, figure, nal);
        } else {
            switch (figure) {
                case 11:
                case 12:
                    SyllogisticRules.analogy(t2, t1, asym, sym, figure, nal);
                    break;

                case 21:
                case 22:
                    SyllogisticRules.analogy(t1, t2, asym, sym, figure, nal);
                    break;

                default:

            }
        }
    }

    /**
     * converts the side of a figure to a zero based index - which determines the
     * side of the Statement
     *
     * a figure is a encoding for the sides
     *
     * @param figure       figure encoding as 11 or 12 or 21 or 22
     * @param sideOfFigure side
     * @return
     */
    private static retSideFromFigure(figure: int, sideOfFigure: RuleTables.EnumFigureSide): Statement.EnumStatementSide {
        if (sideOfFigure === RuleTables.EnumFigureSide.LEFT) {
            switch (figure) {
                case 11:
                    return Statement.EnumStatementSide.SUBJECT;
                case 12:
                    return Statement.EnumStatementSide.SUBJECT;
                case 21:
                    return Statement.EnumStatementSide.PREDICATE;
                case 22:
                    return Statement.EnumStatementSide.PREDICATE;

                default:

            }
        } else {
            switch (figure) {
                case 11:
                    return Statement.EnumStatementSide.SUBJECT;
                case 12:
                    return Statement.EnumStatementSide.PREDICATE;
                case 21:
                    return Statement.EnumStatementSide.SUBJECT;
                case 22:
                    return Statement.EnumStatementSide.PREDICATE;

                default:

            }
        }

        throw new java.lang.IllegalArgumentException("figure is invalid");
    }

    protected static EnumFigureSide = class EnumFigureSide extends java.lang.Enum<EnumFigureSide> {
        public static readonly LEFT: EnumFigureSide = new class extends EnumFigureSide {
        }(S`LEFT`, 0);
        public static readonly RIGHT: EnumFigureSide = new class extends EnumFigureSide {
        }(S`RIGHT`, 1),
    };


    /**
     * Syllogistic rules whose both premises are on the same symmetric relation
     *
     * @param belief       The premise that comes from a belief
     * @param taskSentence The premise that comes from a task
     * @param figure       The location of the shared term
     * @param nal          Reference to the memory
     */
    private static symmetricSymmetric(belief: Sentence, taskSentence: Sentence, figure: int,
        nal: DerivationContext): void {
        let s1: Statement = belief.term as Statement;
        let s2: Statement = taskSentence.term as Statement;

        let figureLeft: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.LEFT);
        let figureRight: Statement.EnumStatementSide = RuleTables.retSideFromFigure(figure, RuleTables.EnumFigureSide.RIGHT);

        // parameters for unify()
        let ut1: Term = s1.retBySide(figureLeft);
        let ut2: Term = s2.retBySide(figureRight);
        // parameters for resemblance()
        let rt1: Term = s1.retBySide(retOppositeSide(figureLeft));
        let rt2: Term = s2.retBySide(retOppositeSide(figureRight));

        let u: Term[] = [s1, s2];
        if (Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT, ut1, ut2, u)) {
            // recalculate rt1, rt2 from above:
            switch (figure) {
                case 11:
                    rt1 = s1.getPredicate();
                    rt2 = s2.getPredicate();
                    break;
                case 12:
                    rt1 = s1.getPredicate();
                    rt2 = s2.getSubject();
                    break;
                case 21:
                    rt1 = s1.getSubject();
                    rt2 = s2.getPredicate();
                    break;
                case 22:
                    rt1 = s1.getSubject();
                    rt2 = s2.getSubject();
                    break;

                default:

            }

            SyllogisticRules.resemblance(rt1, rt2, belief, taskSentence, figure, nal);

            CompositionalRules.eliminateVariableOfConditionAbductive(
                figure, taskSentence, belief, nal);

        }

    }

    /* ----- conditional inferences ----- */
    /**
     * The detachment rule, with variable unification
     *
     * @param originalMainSentence The premise that is an Implication or
     *                             Equivalence
     * @param subSentence          The premise that is the subject or predicate of
     *                             the
     *                             first one
     * @param index                The location of the second premise in the first
     * @param nal                  Reference to the memory
     */
    private static detachmentWithVar(originalMainSentence: Sentence, subSentence: Sentence,
        index: int, nal: DerivationContext): void;

    private static detachmentWithVar(originalMainSentence: Sentence, subSentence: Sentence, index: int,
        checkTermAgain: boolean, nal: DerivationContext): void;
    private static detachmentWithVar(...args: unknown[]): void {
        switch (args.length) {
            case 4: {
                const [originalMainSentence, subSentence, index, nal] = args as [Sentence, Sentence, int, DerivationContext];


                RuleTables.detachmentWithVar(originalMainSentence, subSentence, index, true, nal);


                break;
            }

            case 5: {
                const [originalMainSentence, subSentence, index, checkTermAgain, nal] = args as [Sentence, Sentence, int, boolean, DerivationContext];


                if (originalMainSentence === null) {
                    return;
                }
                let mainSentence: Sentence = originalMainSentence; // for substitution

                if (!(mainSentence.term instanceof Statement))
                    return;

                let statement: Statement = mainSentence.term as Statement;

                let component: Term = statement.term[index];
                let content: Term = subSentence.term;
                if (nal.getCurrentBelief() !== null) {

                    let u: Term[] = [statement, content];

                    if (!component.hasVarIndep() && !component.hasVarDep()) { // because of example: <<(*,w1,#2) --> [good]> ==>
                        // <w1 --> TRANSLATE>>. <(*,w1,w2) --> [good]>.
                        SyllogisticRules.detachment(mainSentence, subSentence, index, checkTermAgain, nal);
                    } else if (Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT, component, content, u)) { // happens
                        // through
                        // syllogisms
                        mainSentence = mainSentence.clone(u[0]);
                        subSentence = subSentence.clone(u[1]);
                        SyllogisticRules.detachment(mainSentence, subSentence, index, false, nal);
                    } else if ((statement instanceof Implication) && (statement.getPredicate() instanceof Statement)
                        && (nal.getCurrentTask().sentence.isJudgment())) {
                        let s2: Statement = statement.getPredicate() as Statement;
                        if ((content instanceof Statement) && (s2.getSubject().equals((content as Statement).getSubject()))) {
                            CompositionalRules.introVarInner(content as Statement, s2, statement, nal);
                        }
                        CompositionalRules.IntroVarSameSubjectOrPredicate(originalMainSentence, subSentence, component, content,
                            index, nal);
                    } else if ((statement instanceof Equivalence) && (statement.getPredicate() instanceof Statement)
                        && (nal.getCurrentTask().sentence.isJudgment())) {
                        CompositionalRules.IntroVarSameSubjectOrPredicate(originalMainSentence, subSentence, component, content,
                            index, nal);
                    }
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    /**
     * Conditional deduction or induction, with variable unification
     *
     * @param conditional The premise that is an Implication with a Conjunction
     *                    as condition
     * @param index       The location of the shared term in the condition
     * @param statement   The second premise that is a statement
     * @param side        The location of the shared term in the statement
     * @param nal         Reference to the memory
     */
    private static conditionalDedIndWithVar(conditionalSentence: Sentence, conditional: Implication,
        index: short, statement: Statement, side: short, nal: DerivationContext): void {

        if (!(conditional.getSubject() instanceof CompoundTerm))
            return;

        let condition: CompoundTerm = conditional.getSubject() as CompoundTerm;

        if (condition instanceof Conjunction) { // conditionalDedIndWithVar
            for (let t of condition.term) { // does not support the case where
                if (t instanceof Variable) { // we have a variable inside of a conjunction
                    return; // (this can happen since we have # due to image transform,
                } // although not for other conjunctions)
            }
        }

        let component: Term = condition.term[index];
        let component2: Term = null;
        if (statement instanceof Inheritance || statement instanceof Similarity) {
            component2 = statement;
            side = -1;
        } else if (statement instanceof Implication) {
            component2 = statement.term[side];
        }

        if (component2 !== null) {
            let u: Term[] = [conditional, statement];
            if (Variables.unify(nal.memory.randomNumber, VAR_INDEPENDENT, component, component2, u)) {
                conditional = u[0] as Implication;
                statement = u[1] as Statement;
                SyllogisticRules.conditionalDedInd(conditionalSentence, conditional, index, statement, side, nal);
            }
        }
    }

    /* ----- structural inferences ----- */
    /**
     * Inference between a compound term and a component of it
     *
     * @param compound     The compound term
     * @param component    The component term
     * @param compoundTask Whether the compound comes from the task
     * @param nal          Reference to the memory
     */
    private static compoundAndSelf(compound: CompoundTerm, component: Term, compoundTask: boolean,
        index: int, nal: DerivationContext): void {
        if ((compound instanceof Conjunction) || (compound instanceof Disjunction)) {
            if (nal.getCurrentBelief() !== null) {
                if (compound.containsTerm(component)) {
                    StructuralRules.structuralCompound(compound, component, compoundTask, index, nal);
                }
                CompositionalRules.decomposeStatement(compound, component, compoundTask, index, nal);
            } else if (compound.containsTerm(component)) {
                StructuralRules.structuralCompound(compound, component, compoundTask, index, nal);
            }
        } else if (compound instanceof Negation) {
            if (compoundTask) {
                if (compound.term[0] instanceof CompoundTerm)
                    StructuralRules.transformNegation(compound.term[0] as CompoundTerm, nal);
            } else {
                StructuralRules.transformNegation(compound, nal);
            }
        }
    }

    /**
     * Inference between two compound terms
     *
     * @param taskTerm   The compound from the task
     * @param beliefTerm The compound from the belief
     * @param nal        Reference to the memory
     */
    private static compoundAndCompound(taskTerm: CompoundTerm, beliefTerm: CompoundTerm,
        tindex: int, bindex: int, nal: DerivationContext): void {
        if (taskTerm.getClass() === beliefTerm.getClass()) {
            if (taskTerm.size() >= beliefTerm.size()) {
                RuleTables.compoundAndSelf(taskTerm, beliefTerm, true, tindex, nal);
            } else if (taskTerm.size() < beliefTerm.size()) {
                RuleTables.compoundAndSelf(beliefTerm, taskTerm, false, bindex, nal);
            }
        }
    }

    /**
     * Inference between a compound term and a statement
     *
     * @param compound   The compound term
     * @param index      The location of the current term in the compound
     * @param statement  The statement
     * @param side       The location of the current term in the statement
     * @param beliefTerm The content of the belief
     * @param nal        Reference to the memory
     */
    private static compoundAndStatement(compound: CompoundTerm, index: short, statement: Statement,
        side: short, beliefTerm: Term, nal: DerivationContext): void {

        if (index >= compound.term.length) {
            return;
        }
        let component: Term = compound.term[index];

        let task: Task = nal.getCurrentTask();
        if (component.getClass() === statement.getClass()) {
            if ((compound instanceof Conjunction) && (nal.getCurrentBelief() !== null)) {
                let conj: Conjunction = compound as Conjunction;
                let u: Term[] = [compound, statement];
                if (Variables.unify(nal.memory.randomNumber, VAR_DEPENDENT, component, statement, u)
                    && u[0] instanceof Conjunction && u[1] instanceof Statement) {
                    compound = u[0] as Conjunction;
                    statement = u[1] as Statement;
                    if (conj.isSpatial || compound.getTemporalOrder() !== TemporalRules.ORDER_FORWARD || // only allow
                        // dep var
                        // elimination
                        index === 0) { // for (&/ on first component!!
                        SyllogisticRules.elimiVarDep(compound, component,
                            statement.equals(beliefTerm),
                            nal);
                    }
                } else if (task.sentence.isJudgment()) { // && !compound.containsTerm(component)) {
                    CompositionalRules.introVarInner(statement, component as Statement, compound, nal);
                }
            }
        } else {
            if (task.sentence.isJudgment()) {
                if (statement instanceof Inheritance) {
                    StructuralRules.structuralCompose1(compound, index, statement, nal);
                    if (!(compound instanceof SetExt || compound instanceof SetInt || compound instanceof Negation
                        || compound instanceof Conjunction || compound instanceof Disjunction)) {
                        StructuralRules.structuralCompose2(compound, index, statement, side, nal);
                    } // {A --> B, A @ (A&C)} |- (A&C) --> (B&C)
                } else if (!(compound instanceof Negation || compound instanceof Conjunction
                    || compound instanceof Disjunction)) {
                    StructuralRules.structuralCompose2(compound, index, statement, side, nal);
                } // {A <-> B, A @ (A&C)} |- (A&C) <-> (B&C)
            }
        }
    }

    /**
     * Inference between a component term (of the current term) and a statement
     *
     * @param compound  The compound term
     * @param index     The location of the current term in the compound
     * @param statement The statement
     * @param side      The location of the current term in the statement
     * @param nal       Reference to the memory
     */
    private static componentAndStatement(compound: CompoundTerm, index: short, statement: Statement,
        side: short, nal: DerivationContext): void {
        if (statement instanceof Inheritance) {
            StructuralRules.structuralDecompose1(compound, index, statement, nal);
            if (!(compound instanceof SetExt) && !(compound instanceof SetInt)) {
                StructuralRules.structuralDecompose2(statement, index, nal); // {(C-B) --> (C-A), A @ (C-A)} |- A --> B
            } else {
                StructuralRules.transformSetRelation(compound, statement, side, nal);
            }
        } else if (statement instanceof Similarity) {
            StructuralRules.structuralDecompose2(statement, index, nal); // {(C-B) --> (C-A), A @ (C-A)} |- A --> B
            if ((compound instanceof SetExt) || (compound instanceof SetInt)) {
                StructuralRules.transformSetRelation(compound, statement, side, nal);
            }
        }

        else if ((statement instanceof Implication) && (compound instanceof Negation)) {
            if (index === 0) {
                StructuralRules.contraposition(statement, nal.getCurrentTask().sentence, nal);
            } else {
                StructuralRules.contraposition(statement, nal.getCurrentBelief(), nal);
            }
        }

    }

    /* ----- inference with one TaskLink only ----- */
    /**
     * The TaskLink is of type TRANSFORM, and the conclusion is an equivalent
     * transformation
     *
     * @param tLink The task link
     * @param nal   Reference to the memory
     */
    public static transformTask(tLink: TaskLink, nal: DerivationContext): void {
        let content: CompoundTerm = nal.getCurrentTask().getTerm() as CompoundTerm;
        let indices: Int16Array = tLink.index;
        let expectedInheritanceTerm: Term = null; // we store here the (dereferenced) term which we expect to be a
        // inheritance

        { // this block "dereferences" the term by the address which we are storing in
            // "indices"
            if ((indices.length === 2) || (content instanceof Inheritance)) { // <(*, term, #) --> #>
                expectedInheritanceTerm = content;
            } else if (indices.length === 3) { // <<(*, term, #) --> #> ==> #>
                expectedInheritanceTerm = content.term[indices[0]];
            } else if (indices.length === 4) { // <(&&, <(*, term, #) --> #>, #) ==> #>
                let component: Term = content.term[indices[0]];
                if ((component instanceof Conjunction) && (((content instanceof Implication) && (indices[0] === 0))
                    || (content instanceof Equivalence))) {

                    let cterms: Term[] = (component as CompoundTerm).term;
                    if (indices[1] < cterms.length - 1) {
                        expectedInheritanceTerm = cterms[indices[1]];
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            }
        }

        // it is not a fatal error if it is not a inheritance, we just ignore it in this
        // case
        if (expectedInheritanceTerm instanceof Inheritance) {
            StructuralRules.transformProductImage(expectedInheritanceTerm as Inheritance, content, indices, nal);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace RuleTables {
    export type EnumFigureSide = InstanceType<typeof RuleTables.EnumFigureSide>;
}


