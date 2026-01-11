//! Java source: opennars/operator/mental/Remind.java
import { java } from "jree";



/**
 * Operator that activates a concept
 */
export class Remind extends Operator {

    public constructor() {
        super("^remind");
    }

    public activate(memory: Memory, c: Concept, b: BudgetValue, mode: Activating): void {
        memory.concepts.pickOut(c.name());
        BudgetFunctions.activate(c.budget, b, mode);
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
        time: Timable): java.util.List<Task> {
        let term: Term = args[1];
        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);
        let budget: BudgetValue = new BudgetValue(memory.narParameters.DEFAULT_QUESTION_PRIORITY,
            memory.narParameters.DEFAULT_QUESTION_DURABILITY, 1, memory.narParameters);
        this.activate(memory, concept, budget, Activating.TaskLink);
        return null;
    }

}
