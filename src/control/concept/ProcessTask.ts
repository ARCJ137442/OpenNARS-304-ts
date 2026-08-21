//! Java source: opennars/control/concept/ProcessTask.java
import { java, JavaObject, type char } from "jree";
import { Symbols } from "../../io/Symbols.ts";
import { ProcessJudgment } from "./ProcessJudgment.ts";
import { ProcessGoal } from "./ProcessGoal.ts";
import { ProcessQuestion } from "./ProcessQuestion.ts";
import { ProcessAnticipation } from "./ProcessAnticipation.ts";
import { TaskLink } from "../../entity/TaskLink.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Task } from "../../entity/Task.ts";
import type { DerivationContext } from "../DerivationContext.ts";
import type { Timable } from "../../interfaces/Timable.ts";



/**
 * Encapsulates the dispatching task processing
 *
 * @author Patrick Hammer
 *
 */
export class ProcessTask extends JavaObject {
    /**
     * Directly process a new task within a concept.Here task can either be a
     * judgement, goal, question or quest.The function is called exactly once on
     * each task.Using
     * local information and finishing in a constant time.
     * Also providing feedback
     * in the budget value of the task:
     * de-priorize already fullfilled questions and goals
     * increase quality of beliefs if they turned out to be useful.
     * After the re-priorization is done, a taskLink is finally constructed.
     * For input events the concept is set observable too.
     *
     * @param concept The concept of the task
     * @param nal     The derivation context
     * @param task    The task to be processed
     * @param time    The time
     * @return whether it was processed
     */
    // called in Memory.localInference only, for both derived and input tasks
    public static processTask(concept: Concept, nal: DerivationContext, task: Task,
        time: Timable): boolean {
        /* synchronized (concept) { */
        concept.observable |= task.isInput();
        let type: char = task.sentence.punctuation;
        switch (type) {
            case Symbols.JUDGMENT_MARK:
                ProcessJudgment.processJudgment(concept, nal, task);
                break;
            case Symbols.GOAL_MARK:
                ProcessGoal.processGoal(concept, nal, task);
                break;
            case Symbols.QUESTION_MARK:
            case Symbols.QUEST_MARK:
                ProcessQuestion.processQuestion(concept, nal, task);
                break;
            default:
                return false;
        }

        if (task.aboveThreshold()) { // still need to be processed
            let taskl: TaskLink = concept.linkToTask(task, nal);
            if (task.sentence.isJudgment() && ProcessJudgment.isExecutableHypothesis(task, nal)) { // after
                // linkToTask
                ProcessJudgment.addToTargetConceptsPreconditions(task, nal); // because now the components are there
            }
            ProcessAnticipation.firePredictions(task, concept, nal, time, taskl);
        }
        /* } */
        return true;
    }
}
