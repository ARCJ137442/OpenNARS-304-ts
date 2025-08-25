import { java } from "jree";



/**
 * Operator that creates a quest with a given statement
 */
export class Evaluate extends Operator {

    public constructor() {
        super("^evaluate");
    }

    /**
     * To create a quest with a given statement
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
            /* final */  time: Timable | null): java.util.List<Task> | null {
        let content: Term = args[1];

        let sentence: Sentence = new Sentence(
            content,
            Symbols.QUEST_MARK,
            null,
            new Stamp(time, memory));

        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_QUEST_PRIORITY,
            memory.narParameters.DEFAULT_QUESTION_DURABILITY, 1, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return Lists.newArrayList(newTask);
    }
}
