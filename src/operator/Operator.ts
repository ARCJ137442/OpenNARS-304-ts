//! Java source: opennars/operator/Operator.java
import { java, type float, JavaObject, S } from "jree";
import { Term } from "../language/Term.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { Operation } from "./Operation.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { OutputHandler } from "../io/events/OutputHandler.ts";
import { Debug } from "../main/Debug.ts";
import type { Product } from "../language/Product.ts";
import type { Statement } from "../language/Statement.ts";
import type { BudgetValue } from "../entity/BudgetValue.ts";
import { javaStringValue } from "../runtime/jree-compat.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Task } from "../entity/Task.ts";
import type { Nar } from "../main/Nar.ts";
import type { Plugin } from "../plugin/Plugin.ts";



/**
 * An individual operator that can be execute by the system, which can be either
 * inside NARS or outside it, in another system or device.
 * <p>
 * This is the only file to modify when registering a new operator into NARS.
 */
export abstract class Operator extends Term implements Plugin {

    protected constructor();

    protected constructor(name: string);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 1: {
                const [name] = args as [java.lang.String];


                super(java.lang.String.valueOf(name));
                if (!javaStringValue(name).startsWith("^"))
                    throw new java.lang.IllegalStateException("Operator name needs ^ prefix");


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(n: Nar, enabled: boolean): boolean {
        return true;
    }

    /**
     * Required method for every operator, specifying the corresponding
     * operation
     *
     * @param args   Arguments of the operation, both input (constant) and output
     *               (variable)
     * @param memory The memory to work on
     * @return The direct collectable results and feedback of the
     *         reportExecution
     */
    protected abstract execute(operation: Operation, args: Term[], memory: Memory, time: Timable): java.util.List<Task> | null;

    public call(op: Operation, memory: Memory, time: Timable): boolean;

    /**
     * The standard way to carry out an operation, which invokes the execute
     * method defined for the operator, and handles feedback tasks as input
     *
     * @param operation The operator to be executed
     * @param args      The arguments to be taken by the operator
     * @param memory    The memory on which the operation is executed
     * @param time      used to retrieve the time
     * @return true if successful, false if an error occurred
     */
    public call(operation: Operation, args: Term[], memory: Memory, time: Timable): boolean;
    public call(...args: unknown[]): boolean {
        switch (args.length) {
            case 3: {
                const [op, memory, time] = args as [Operation, Memory, Timable];


                if (!op.isExecutable(memory)) {
                    return false;
                }
                let operationArgs: Product = op.getArguments();
                return this.call(op, operationArgs.term, memory, time);


                break;
            }

            case 4: {
                const [operation, operationArgs, memory, time] = args as [Operation, Term[], Memory, Timable];


                let feedback: java.util.List<Task> | null = null;
                try {
                    feedback = this.execute(operation, operationArgs, memory, time);
                } catch (ex) {
                    if (ex instanceof java.lang.Exception) {// peripherie, maybe used incorrectly, failure is unavoidable
                        if (Debug.SHOW_EXECUTION_ERRORS) {
                            memory.event.emit(OutputHandler.ERR.class, ex);
                        }
                        if (!Debug.EXECUTION_ERRORS_CONTINUE) {
                            throw new java.lang.IllegalStateException("Execution error:\n", ex);
                        } else {
                            return false; // failure on execution
                        }
                    } else {
                        throw ex;
                    }
                }

                let executionConfidence: float = memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE;
                if (feedback === null || feedback.isEmpty()) { // null operator case
                    memory.executedTask(time, operation, TruthValue.fromFrequencyConfidence(1, executionConfidence, memory.narParameters));
                }

                Operator.reportExecution(operation, operationArgs, feedback, memory);

                if (feedback !== null) {
                    for (let t of feedback) {
                        memory.inputTask(time, t);
                    }
                }

                return true;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static operationExecutionString(operation: Statement): java.lang.String {
        let operator: Term = operation.getPredicate();
        let operationArguments: Term = operation.getSubject();
        let argList: java.lang.String = operationArguments.toString().substring(3); // skip the product prefix "(*,"
        return operator + "(" + argList;
    }

    public clone(): Operator {
        // do not clone operators, just use as-is since it's effectively immutable
        return this;
    }

    // /**
    // * Display a message in the output stream to indicate the reportExecution of
    // * an operation
    // * <p>
    // * @param operation The content of the operation to be executed
    // */
    public static reportExecution(operation: Operation, args: Term[], feedback: java.lang.Object,
        memory: Memory): void {

        let opT: Term = operation.getPredicate();
        if (!(opT instanceof Operator)) {
            return;
        }

        if (memory.emitting(OutputHandler.EXE.class)) {
            // final Operator operator = (Operator) opT;

            if (feedback instanceof java.lang.Exception)
                feedback = feedback.getClass().getSimpleName() + ": " + (feedback as java.lang.Throwable).getMessage();

            memory.emit(OutputHandler.EXE.class, new Operator.ExecutionResult(operation, feedback));
        }
    }

    public static ExecutionResult = class ExecutionResult extends JavaObject {
        private readonly operation: Operation;
        private readonly feedback: java.lang.Object;

        public constructor(op: Operation, feedback: java.lang.Object) {
            super();
            this.operation = op;
            this.feedback = feedback;
        }

        public getTask(): Task {
            return this.operation.getTask();
        }

        public override  toString(): java.lang.String {
            let b: BudgetValue = null;
            if (this.getTask() !== null) {
                b = this.getTask().budget;
            }
            let args: Term[] = this.operation.getArguments().term;
            let operator: Operator = this.operation.getOperator();

            return ((b !== null) ? (b.toStringExternal() + " ") : "") +
                operator + "(" + java.util.Arrays.toString(args) + ")=" + this.feedback;
        }

    };


    public static addPrefixIfMissing(opName: java.lang.String): java.lang.String {
        if (!opName.startsWith("^"))
            return '^' + opName;
        return opName;
    }

}

Inheritance.registerOperatorPredicate((value) => value instanceof Operator);

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Operator {
    export type ExecutionResult = InstanceType<typeof Operator.ExecutionResult>;
}


