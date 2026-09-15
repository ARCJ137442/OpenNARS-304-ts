//! Java source: opennars/operator/mental/Remind.java
import { Operator } from "../Operator.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { BudgetValue } from "../../entity/BudgetValue.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Concept } from "../../entity/Concept.ts";
import type { Operation } from "../Operation.ts";
import type { Term } from "../../language/Term.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Task } from "../../entity/Task.ts";
import { Consider } from "./Consider.ts";



/**
 * Operator that activates a concept
 */
export class Remind extends Operator {

    public constructor() {
        super("^remind");
    }

    public activate(memory: Memory, c: Concept, b: BudgetValue, mode: BudgetFunctions.Activating): void {
        memory.concepts.pickOut(c.name());
        BudgetFunctions.activate(c.getBudget(), b, mode);
        memory.concepts.putBack(c, memory.cycles(memory.narParameters.CONCEPT_FORGET_DURATIONS), memory);
    }

    /**
     * To activate a concept as if a question has been asked about it
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): Task[] | null {
        let term: Term = args[1];
        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_QUESTION_PRIORITY,
            memory.narParameters.DEFAULT_QUESTION_DURABILITY, 1, memory.narParameters);
        this.activate(memory, concept, budget, BudgetFunctions.Activating.TaskLink);
        return null;
    }

}
