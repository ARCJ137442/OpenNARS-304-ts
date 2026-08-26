//! Java source: opennars/operator/mental/Want.java
import { Operator } from "../Operator.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { Symbols } from "../../io/Symbols.ts";
import type { Operation } from "../Operation.ts";
import type { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";



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
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): Task[] | null {

        let content: Term = args[1];

        let truth: TruthValue = TruthValue.fromFrequencyConfidence(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.GOAL_MARK,
            truth,
            new Stamp(time, memory));

        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_GOAL_PRIORITY,
            memory.narParameters.DEFAULT_GOAL_DURABILITY, truth, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return [newTask];
    }

}
