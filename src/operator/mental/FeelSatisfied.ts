//! Java source: opennars/operator/mental/FeelSatisfied.java
import { java } from "jree";
import { Feel } from "./Feel.ts";
import type { Operation } from "../Operation.ts";
import type { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Task } from "../../entity/Task.ts";



/**
 * Feeling happy value
 */
export class FeelSatisfied extends Feel {

    public constructor() {
        super("^feelSatisfied");
    }

    /**
     * To get the current value of an internal sensor
     *
     * @param args   Arguments, a set and a variable
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> | null {
        if (memory.emotion === null) {
            return null;
        }
        return this.feeling(memory.emotion.happy(), memory, time);
    }
}
