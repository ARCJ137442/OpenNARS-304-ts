//! Java source: opennars/operator/mental/Name.java
import { java } from "jree";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Similarity } from "../../language/Similarity.ts";
import { Term } from "../../language/Term.ts";
import { Operation } from "../../operator/Operation.ts";
import { Operator } from "../../operator/Operator.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";



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
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> {
        let compound: Term = args[1];
        let atomic: Term = args[2];
        let content: Similarity = Similarity.make(compound, atomic);

        let truth: TruthValue = TruthValue.fromFrequencyConfidence(1, 0.9999, memory.narParameters); // a naming convension
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            new Stamp(time, memory));

        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, truth, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return new java.util.ArrayList([newTask]);
    }
}
