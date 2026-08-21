//! Java source: opennars/inference/BudgetFunctions.java
import { java, type float, type double, type int, S } from "jree";
import { TruthValue } from "../entity/TruthValue.ts";
import { Sentence } from "../entity/Sentence.ts";
import { TaskLink } from "../entity/TaskLink.ts";
import { Task } from "../entity/Task.ts";
import { DerivationContext } from "../control/DerivationContext.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Term } from "../language/Term.ts";
import { Memory } from "../storage/Memory.ts";
import { Item } from "../entity/Item.ts";
import { TermLink } from "../entity/TermLink.ts";
import { Concept } from "../entity/Concept.ts";



/**
 * Budget functions for resources allocation
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class BudgetFunctions {

    /* ----------------------- Belief evaluation ----------------------- */
    /**
     * Determine the quality of a judgment by its truth value alone
     * <p>
     * Mainly decided by confidence, though binary judgment is also preferred
     *
     * @param t The truth value of a judgment
     * @return The quality of the judgment, according to truth value only
     */
    public static truthToQuality(t: TruthValue): float {
        let exp: float = t.getExpectation();
        return Math.max(exp, (1 - exp) * 0.75) as float;
    }

    /**
     * Determine the rank of a judgment by its quality and originality (stamp
     * baseLength), called from Concept
     *
     * @param judg The judgment to be ranked
     * @return The rank of the judgment, according to truth value only
     */
    public static rankBelief(judg: Sentence, rankTruthExpectation: boolean): float {
        if (rankTruthExpectation) {
            return judg.getTruth().getExpectation();
        }
        let confidence: double = judg.truth.confidence;
        // final float originality = judg.stamp.getOriginality();
        return confidence as float; // or(confidence, originality);
    }

    /**
     * Evaluate the quality of a revision, then de-prioritize the premises
     *
     * @param tTruth The truth value of the judgment in the task
     * @param bTruth The truth value of the belief
     * @param truth  The truth value of the conclusion of revision
     * @return The budget for the new task
     */
    protected static revise(tTruth: TruthValue, bTruth: TruthValue, truth: TruthValue,
        feedbackToLinks: boolean, nal: DerivationContext): BudgetValue {
        let difT: float = truth.getExpDifAbs(tTruth);
        let task: Task = nal.getCurrentTask();
        task.decPriority(1 - difT);
        task.decDurability(1 - difT);
        if (feedbackToLinks) {
            let tLink: TaskLink = nal.getCurrentTaskLink();
            tLink.decPriority(1 - difT);
            tLink.decDurability(1 - difT);
            let bLink: TermLink = nal.getCurrentBeliefLink();
            let difB: float = truth.getExpDifAbs(bTruth);
            bLink.decPriority(1 - difB);
            bLink.decDurability(1 - difB);
        }
        let dif: double = truth.confidence - Math.max(tTruth.confidence, bTruth.confidence);
        let priority: float = java.math.BigInteger.or(dif as float, task.getPriority());
        let durability: float = aveAri(dif as float, task.getDurability());
        let quality: float = BudgetFunctions.truthToQuality(truth);

        /*
         * if (priority < 0) {
         * memory.nar.output(ERR.class,
         * new
         * IllegalStateException("BudgetValue.revise resulted in negative priority; set to 0"
         * ));
         * priority = 0;
         * }
         * if (durability < 0) {
         * memory.nar.output(ERR.class,
         * new
         * IllegalStateException("BudgetValue.revise resulted in negative durability; set to 0; aveAri(dif="
         * + dif + ", task.getDurability=" + task.getDurability() +") = " +
         * durability));
         * durability = 0;
         * }
         * if (quality < 0) {
         * memory.nar.output(ERR.class,
         * new
         * IllegalStateException("BudgetValue.revise resulted in negative quality; set to 0"
         * ));
         * quality = 0;
         * }
         */

        return new BudgetValue(priority, durability, quality, nal.narParameters);
    }

    /**
     * Update a belief
     *
     * @param task   The task containing new belief
     * @param bTruth Truth value of the previous belief
     * @return Budget value of the updating task
     */
    public static update(task: Task, bTruth: TruthValue, narParameters: Parameters): BudgetValue {
        let tTruth: TruthValue = task.sentence.truth;
        let dif: float = tTruth.getExpDifAbs(bTruth);
        let priority: float = java.math.BigInteger.or(dif, task.getPriority());
        let durability: float = aveAri(dif, task.getDurability());
        let quality: float = BudgetFunctions.truthToQuality(bTruth);
        return new BudgetValue(priority, durability, quality, narParameters);
    }

    /* ----------------------- Links ----------------------- */
    /**
     * Distribute the budget of a task among the links to it
     *
     * @param b The original budget
     * @param n Number of links
     * @return Budget value for each link
     */
    public static distributeAmongLinks(b: BudgetValue, n: int, narParameters: Parameters): BudgetValue {
        let priority: float = (b.getPriority() / java.lang.Math.sqrt(n)) as float;
        return new BudgetValue(priority, b.getDurability(), b.getQuality(), narParameters);
    }

    public static Activating = class Activating extends java.lang.Enum<Activating> {
        public static Max: Activating = new class extends Activating {
        }(S`Max`, 0); public static TaskLink: Activating = new class extends Activating {
        }(S`TaskLink`, 1)
    };


    /* ----------------------- Concept ----------------------- */
    /**
     * Activate a concept by an incoming TaskLink
     *
     * @param receiver The budget receiving the activation
     * @param amount   The budget for the new item
     */
    public static activate(receiver: BudgetValue, amount: BudgetValue, mode: BudgetFunctions.Activating): void {
        switch (mode) {
            case Max:
                BudgetFunctions.merge(receiver, amount);
                break;
            case TaskLink:
                let oldPri: float = receiver.getPriority();
                receiver.setPriority(java.math.BigInteger.or(oldPri, amount.getPriority()));
                receiver.setDurability(aveAri(receiver.getDurability(), amount.getDurability()));
                receiver.setQuality(receiver.getQuality());
                break;

            default:

        }

    }

    /* ---------------- Bag functions, on all Items ------------------- */
    /**
     * Decrease Priority after an item is used, called in Bag.
     * After a constant time, p should become d*p. Since in this period, the
     * item is accessed c*p times, each time p-q should multiple d^(1/(c*p)).
     * The intuitive meaning of the parameter "forgetRate" is: after this number
     * of times of access, priority 1 will become d, it is a system parameter
     * adjustable in run time.
     *
     * @param budget            The previous budget value
     * @param forgetCycles      The budget for the new item
     * @param relativeThreshold The relative threshold of the bag
     */
    public static applyForgetting(budget: BudgetValue, forgetCycles: float,
        relativeThreshold: float): void {
        let quality: float = budget.getQuality() * relativeThreshold; // re-scaled quality
        let p: float = budget.getPriority() - quality; // priority above quality
        if (p > 0) {
            quality += p * java.lang.Math.pow(budget.getDurability(), 1.0 / (forgetCycles * p));
        } // priority Durability
        budget.setPriority(quality);
    }

    /**
     * Merge an item into another one in a bag, when the two are identical
     * except in budget values
     *
     * @param b The budget baseValue to be modified
     * @param a The budget adjustValue doing the adjusting
     */
    public static merge(b: BudgetValue, a: BudgetValue): void {
        b.setPriority(Math.max(b.getPriority(), a.getPriority()));
        b.setDurability(Math.max(b.getDurability(), a.getDurability()));
        b.setQuality(Math.max(b.getQuality(), a.getQuality()));
    }

    /* ----- Task derivation in LocalRules and SyllogisticRules ----- */
    /**
     * Forward inference result and adjustment
     *
     * @param truth The truth value of the conclusion
     * @return The budget value of the conclusion
     */
    public static forward(truth: TruthValue, nal: DerivationContext): BudgetValue {
        return BudgetFunctions.budgetInference(BudgetFunctions.truthToQuality(truth), 1, nal);
    }

    /**
     * Backward inference result and adjustment, stronger case
     *
     * @param truth The truth value of the belief deriving the conclusion
     * @param nal   Reference to the memory
     * @return The budget value of the conclusion
     */
    public static backward(truth: TruthValue, nal: DerivationContext): BudgetValue {
        return BudgetFunctions.budgetInference(BudgetFunctions.truthToQuality(truth), 1, nal);
    }

    /**
     * Backward inference result and adjustment, weaker case
     *
     * @param truth The truth value of the belief deriving the conclusion
     * @param nal   Reference to the memory
     * @return The budget value of the conclusion
     */
    public static backwardWeak(truth: TruthValue, nal: DerivationContext): BudgetValue {
        return BudgetFunctions.budgetInference(w2c(1, nal.narParameters) as float * BudgetFunctions.truthToQuality(truth), 1, nal);
    }

    /* ----- Task derivation in CompositionalRules and StructuralRules ----- */
    /**
     * Forward inference with CompoundTerm conclusion
     *
     * @param truth   The truth value of the conclusion
     * @param content The content of the conclusion
     * @param nal     Reference to the memory
     * @return The budget of the conclusion
     */
    public static compoundForward(truth: TruthValue, content: Term,
        nal: DerivationContext): BudgetValue {
        let complexity: float = (content === null) ? nal.narParameters.COMPLEXITY_UNIT
            : nal.narParameters.COMPLEXITY_UNIT * content.getComplexity();
        return BudgetFunctions.budgetInference(BudgetFunctions.truthToQuality(truth), complexity, nal);
    }

    /**
     * Backward inference with CompoundTerm conclusion, stronger case
     *
     * @param content The content of the conclusion
     * @param nal     Reference to the memory
     * @return The budget of the conclusion
     */
    public static compoundBackward(content: Term, nal: DerivationContext): BudgetValue {
        return BudgetFunctions.budgetInference(1, content.getComplexity() * nal.narParameters.COMPLEXITY_UNIT, nal);
    }

    /**
     * Backward inference with CompoundTerm conclusion, weaker case
     *
     * @param content The content of the conclusion
     * @param nal     Reference to the memory
     * @return The budget of the conclusion
     */
    public static compoundBackwardWeak(content: Term,
        nal: DerivationContext): BudgetValue {
        return BudgetFunctions.budgetInference(w2c(1, nal.narParameters) as float,
            content.getComplexity() * nal.narParameters.COMPLEXITY_UNIT, nal);
    }

    /**
     * Get the current activation level of a concept.
     *
     * @param t The Term naming a concept
     * @return the priority value of the concept
     */
    public static conceptActivation(mem: Memory, t: Term): float {
        let c: Concept = mem.concept(t);
        return (c === null) ? 0 : c.getPriority();
    }

    /**
     * Common processing for all inference step
     *
     * @param qual       Quality of the inference
     * @param complexity Syntactic complexity of the conclusion
     * @param nal        Reference to the memory
     * @return Budget of the conclusion task
     */
    private static budgetInference(qual: float, complexity: float,
        nal: DerivationContext): BudgetValue {
        let t: Item<unknown> = nal.getCurrentTaskLink();
        if (t === null) {
            t = nal.getCurrentTask();
        }
        let priority: float = t.getPriority();
        let durability: float = t.getDurability() / complexity;
        let quality: float = qual / complexity;
        let bLink: TermLink = nal.getCurrentBeliefLink();
        if (bLink !== null) {
            priority = java.math.BigInteger.or(priority, bLink.getPriority());
            durability = java.math.BigInteger.and(durability, bLink.getDurability()) as float;
            let targetActivation: float = BudgetFunctions.conceptActivation(nal.memory, bLink.target);
            bLink.incPriority(java.math.BigInteger.or(quality, targetActivation));
            bLink.incDurability(quality);
        }
        return new BudgetValue(priority, durability, quality, nal.narParameters);
    }

    protected static solutionEval(problem: Sentence, solution: Sentence, task: Task,
        memory: Memory): BudgetValue {
        throw new java.lang.IllegalStateException("Moved to TemporalRules.java");
    }

    public static budgetTermLinkConcept(c: Concept, taskBudget: BudgetValue,
        termLink: TermLink): BudgetValue {
        return taskBudget.clone();
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace BudgetFunctions {
    export type Activating = InstanceType<typeof BudgetFunctions.Activating>;
}


