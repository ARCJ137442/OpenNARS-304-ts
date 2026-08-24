//! Java source: opennars/operator/mental/Register.java
import { java } from "jree";
import { Operator } from "../Operator.ts";
import { NullOperator } from "../NullOperator.ts";
import type { Operation } from "../Operation.ts";
import type { Term } from "../../language/Term.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { Task } from "../../entity/Task.ts";



/**
 * Register a new operator when the system is running
 */
export class Register extends Operator {

    public constructor() {
        super("^register");
    }

    /**
     * To register a new operator
     *
     * @param args   Arguments, a Statement followed by an optional tense
     * @param memory The memory in which the operation is executed
     * @return Immediate results as Tasks
     */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> | null {
        let op: Operator = new NullOperator(args[1].toString());
        memory.addOperator(op); // add error checking
        return null;
    }

}
