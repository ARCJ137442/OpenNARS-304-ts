//! Java source: opennars/operator/mental/Believe.java
import { java, type float } from "jree";
import { Operator } from "../Operator.ts";
import { Operation } from "../Operation.ts";
import { Task } from "../../entity/Task.ts";
import { truthFromWordTerm } from "../../entity/TruthValueTerm.ts";
import { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";



/**
 * Operator that creates a judgment with a given statement
 * Causes the system to belief things it has no evidence for
 */
export class Believe extends Operator {

    public constructor() {
        super("^believe");
    }

    /**
     * To create a judgment with a given statement
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     *               + * @return Immediate results as Tasks
     */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): Task[] {

        let content: Term = args[1];

        let truth: TruthValue = truthFromWordTerm(memory.narParameters, args[2]);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            new Stamp(time, memory));

        let quality: float = BudgetFunctions.truthToQuality(truth);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, quality, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

        return Lists.newArrayList(newTask);

    }
}
