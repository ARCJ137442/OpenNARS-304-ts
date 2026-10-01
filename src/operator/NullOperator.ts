//! Java source: opennars/operator/NullOperator.java
import { Operator } from "./Operator.ts";
import { Operation } from "./Operation.ts";
import { Term } from "../language/Term.ts";
import { Debug } from "../main/Debug.ts";
import type { TextInput } from "../runtime/Text.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";
import type { Memory } from "../storage/Memory.ts";
import type { EventEmitter } from "../io/events/EventEmitter.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Task } from "../entity/Task.ts";



/**
 * A class used as a template for Operator definition.
 */
export class NullOperator extends Operator {

    public constructor();

    public constructor(name: TextInput);
    public constructor(...args: unknown[]) {
        if (args.length === 0) {
            super("^sample");
        } else if (args.length === 1) {
            super(args[0] as TextInput);
        } else {
            throw new ReasonerInputError("Invalid number of arguments");
        }
    }


    /** called from Operator */
    protected execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): Task[] | null {
        if (Debug.DETAILED) {
            memory.emit(this.getClass(), ...(args as EventEmitter.EventPayload));
        }
        return null;
    }

}
