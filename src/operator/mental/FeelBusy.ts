import { java } from "jree";



/**
 * Feeling busy value
 */
export class FeelBusy extends Feel {

    public constructor() {
        super("^feelBusy");
    }

    /**
     * To get the current value of an internal sensor
     *
     * @param args   Arguments, a set and a variable
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
            /* final */  time: Timable | null): java.util.List<Task> | null {
        if (memory.emotion === null) {
            return null;
        }
        return feeling(memory.emotion.busy(), memory, time);
    }
}
