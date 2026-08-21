//! Java source: opennars/operator/mental/Hesitate.java
import { java } from "jree";
import { Operator } from "../Operator.ts";



/**
 * Operator that activates a concept
 */
export class Hesitate extends Operator {

    public constructor() {
        super("^hesitate");
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
        concept.discountConfidence(false);
        return null;
    }

}
