//! Java source: opennars/operator/mental/Believe.java
import { java, type float } from "jree";
import { Operator } from "../Operator.ts";
import { Operation } from "../Operation.ts";
import { Task } from "../../entity/Task.ts";
import { truthFromWordTerm } from "../../entity/TruthValueTerm.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Term } from "../../language/Term.ts";
import type { TruthValue } from "../../entity/TruthValue.ts";



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
        time: Timable): java.util.List<Task> | null {

        let content: Term = args[1];

        let truth: TruthValue | null = truthFromWordTerm(memory.narParameters, args[2]);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            new Stamp(time, memory));
        if (truth === null) {
            throw new java.lang.NullPointerException();
        }

        let quality: float = BudgetFunctions.truthToQuality(truth);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, quality, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

        let result: java.util.List<Task> = new java.util.ArrayList<Task>();
        result.add(newTask);
        return result;

    }
}
