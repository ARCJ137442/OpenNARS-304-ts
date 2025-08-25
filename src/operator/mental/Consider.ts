import { java } from "jree";



/**
 * Operator that activates a concept
 */
export class Consider extends Operator {

    public static budgetMentalConcept(/* final */  o: Operation): BudgetValue {
        return o.getTask().budget.clone();
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
    protected execute(/* final */  operation: Operation, /* final */  args: Term[], /* final */  memory: Memory,
            /* final */  time: Timable): java.util.List<Task> {
        let term: Term = args[1];

        let concept: Concept = memory.conceptualize(Consider.budgetMentalConcept(operation), term);

        let cont: DerivationContext = new DerivationContext(memory, memory.narParameters, time);
        cont.setCurrentConcept(concept);
        GeneralInferenceControl.fireConcept(cont, 1);

        return null;
    }

}
