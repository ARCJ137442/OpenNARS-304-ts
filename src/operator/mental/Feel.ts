


import { java, type float } from "jree";



/**
 * Feeling common operations
 */
export abstract class Feel extends Operator {
    private readonly feelingTerm: Term | null;

    public constructor(/* final */  name: java.lang.String | null) {
        super(name);

        // remove the "^feel" prefix from name
        this.feelingTerm = Term.get((name() as java.lang.String).substring(5).toLowerCase());
    }

    protected static readonly selfSubject: Term | null = Term.SELF;

    /**
     * To get the current value of an internal sensor
     *
     * @param value  The value to be checked, in [0, 1]
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected feeling(/* final */  value: float, /* final */  memory: Memory | null, /* final */  time: Timable | null): java.util.List<Task> | null {
        let stamp: Stamp = new Stamp(time, memory, Tense.Present);
        let truth: TruthValue = new TruthValue(value, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);

        let predicate: Term = new SetInt(this.feelingTerm);

        let content: Term = Inheritance.make(Feel.selfSubject, predicate);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let quality: float = BudgetFunctions.truthToQuality(truth);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, quality, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return Lists.newArrayList(newTask);

    }
}
