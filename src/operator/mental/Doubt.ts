


import { java } from "jree";



/**
 * Operator that activates a concept
 */
export class Doubt extends Operator {

    public constructor() {
        super("^doubt");
    }

    /**
     * To activate a concept as if a question has been asked about it
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(/* final */  operation: Operation | null, /* final */  args: Term[] | null, /* final */  memory: Memory | null,
            /* final */  time: Timable | null): java.util.List<Task> | null {
        let term: Term = args[1];
        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);
        concept.discountConfidence(true);
        return null;
    }

}
