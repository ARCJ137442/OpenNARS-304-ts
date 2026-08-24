//! Java source: opennars/interfaces/TaskConsumer.java
import { java } from "jree";
import type { Task } from "../entity/Task.ts";
import type { Timable } from "./Timable.ts";



/**
 * Implementation can consume tasks
 *
 * R is result type
 *
 * @author Robert Wünsche
 */
export interface TaskConsumer<R> {
    /**
     * consumes a task
     *
     * @param task task to be consumed
     * @param time used to retrieve the time
     * @return something which consumed the task or which was assigned the task
     */
    addInput(task: Task, time: Timable): R;
}
