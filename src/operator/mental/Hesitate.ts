//! Java source: opennars/operator/mental/Hesitate.java
import { java } from "jree";
import { Operator } from "../Operator.ts";
import { Consider } from "./Consider.ts";
import type { Operation } from "../Operation.ts";
import type { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Task } from "../../entity/Task.ts";
import type { Concept } from "../../entity/Concept.ts";



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
        time: Timable): java.util.List<Task> | null {
        let term: Term = args[1];
        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);
        concept.discountConfidence(false);
        return null;
    }

}
