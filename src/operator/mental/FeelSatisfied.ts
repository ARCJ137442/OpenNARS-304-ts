import { java } from "jree";



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
        time: Timable): java.util.List<Task> {
        if (memory.emotion === null) {
            return null;
        }
        return feeling(memory.emotion.happy(), memory, time);
    }
}
