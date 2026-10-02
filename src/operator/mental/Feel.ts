//! Java source: opennars/operator/mental/Feel.java
import type { FloatNumber } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { SetInt } from "../../language/SetInt.ts";
import { Term } from "../../language/Term.ts";
import { Tense } from "../../language/Tense.ts";
import { Operator } from "../Operator.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import { textValue } from "../../runtime/Text.ts";



/**
 * Feeling common operations
 */
export abstract class Feel extends Operator {
    private readonly feelingTerm: Term;

    public constructor(name: string) {
        super(name);

        // remove the "^feel" prefix from name
        this.feelingTerm = Term.get(textValue(name).substring(5).toLowerCase());
    }

    protected static readonly selfSubject: Term = Term.SELF;

    /**
     * To get the current value of an internal sensor
     *
     * @param value  The value to be checked, in [0, 1]
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected feeling(value: FloatNumber, memory: Memory, time: Timable): Task[] {
        let stamp: Stamp = new Stamp(time, memory, Tense.Present);
        let truth: TruthValue = TruthValue.fromFrequencyConfidence(value, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);

        let predicate: Term = new SetInt(this.feelingTerm);

        let content: Term = Inheritance.make(Feel.selfSubject, predicate);
        let sentence: Sentence = new Sentence(
            content,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let quality: FloatNumber = BudgetFunctions.truthToQuality(truth);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            memory.narParameters.DEFAULT_JUDGMENT_DURABILITY, quality, memory.narParameters);

        let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
        return [newTask];

    }
}
