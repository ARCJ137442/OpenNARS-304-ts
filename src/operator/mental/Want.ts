


import { java } from "jree";



/**
 * Operator that creates a goal with a given statement
 */
export class Want extends Operator {

    public constructor() {
        super("^want");
    }

    /**
     * To create a goal with a given statement
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
                        /* final */  time: Timable | null): java.util.List<Task> | null {

        let content: Term = args[1];

        let truth: TruthValue = new TruthValue(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.GOAL_MARK,
            truth,
            new Stamp(time, memory));

        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_GOAL_PRIORITY,
            memory.narParameters.DEFAULT_GOAL_DURABILITY, truth, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return Lists.newArrayList(newTask);
    }

}
