//! Java source: opennars/operator/mental/Consider.java
import { java } from "jree";
import { Operator } from "../Operator.ts";
import { DerivationContext } from "../../control/DerivationContext.ts";
import { GeneralInferenceControl } from "../../control/GeneralInferenceControl.ts";
import type { Operation } from "../Operation.ts";
import type { BudgetValue } from "../../entity/BudgetValue.ts";
import type { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Task } from "../../entity/Task.ts";
import type { Concept } from "../../entity/Concept.ts";



/**
 * Operator that activates a concept
 */
export class Consider extends Operator {

    public static budgetMentalConcept(o: Operation): BudgetValue {
        return o.requireTask().budget.clone();
    }

    public constructor() {
        super("^consider");
    }

    /**
     * To activate a concept as if a question has been asked about it
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> | null {
        let term: Term = args[1];

        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);

        let cont: DerivationContext = new DerivationContext(memory, memory.narParameters, time);
        cont.setCurrentConcept(concept);
        GeneralInferenceControl.fireConcept(cont, 1);

        return null;
    }

}
