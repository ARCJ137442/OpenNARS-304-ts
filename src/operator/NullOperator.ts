//! Java source: opennars/operator/NullOperator.java
import { java, S } from "jree";
import { Operator } from "./Operator.ts";
import { Operation } from "./Operation.ts";
import { Term } from "../language/Term.ts";
import { Debug } from "../main/Debug.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Task } from "../entity/Task.ts";



/**
 * A class used as a template for Operator definition.
 */
export class NullOperator extends Operator {

    public constructor();

    public constructor(name: java.lang.String);
    public constructor(...args: unknown[]) {
        if (args.length === 0) {
            super("^sample");
        } else if (args.length === 1) {
            super(args[0] as java.lang.String);
        } else {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
    }


    /** called from Operator */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): java.util.List<Task> {
        if (Debug.DETAILED) {
            memory.emit(this.getClass(), args as java.lang.Object[]);
        }
        return null;
    }

}
