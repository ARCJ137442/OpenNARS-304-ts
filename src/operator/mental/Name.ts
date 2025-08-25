import { java } from "jree";



/**
 * Operator that give a CompoundTerm a new name
 */
export class Name extends Operator {

    public constructor() {
        super("^name");
    }

    /**
     * To create a judgment with a given statement
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(/* final */  operation: Operation, /* final */  args: Term[], /* final */  memory: Memory,
            /* final */  time: Timable): java.util.List<Task> {
        let compound: Term = args[1];
        let atomic: Term = args[2];
        let content: Similarity = Similarity.make(compound, atomic);

        let truth: TruthValue = new TruthValue(1, 0.9999, memory.narParameters); // a naming convension
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            new Stamp(time, memory));

        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, truth, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return Lists.newArrayList(newTask);
    }
}
