//! Java source: opennars/operator/Operator.java
import { java, type float, JavaObject, S } from "jree";
import { Term } from "../language/Term";
import { Operation } from "./Operation";
import { Memory } from "../storage/Memory";
import { Timable } from "../interfaces/Timable";
import { Task } from "../entity/Task";
import { Nar } from "../main/Nar";



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


                super(name);
                if (!name.startsWith("^"))
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
    protected abstract execute(operation: Operation, args: Term[], memory: Memory, time: Timable): Task[];

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
                let args: Product = op.getArguments();
                return this.call(op, args.term, memory, time);


                break;
            }

            case 4: {
                const [operation, args, memory, time] = args as [Operation, Term[], Memory, Timable];


                let feedback: java.util.List<Task> = null;
                try {
                    feedback = this.execute(operation, args, memory, time);
                } catch (ex) {
                    if (ex instanceof java.lang.Exception) {// peripherie, maybe used incorrectly, failure is unavoidable
                        if (Debug.SHOW_EXECUTION_ERRORS) {
                            memory.event.emit(ERR.class, ex);
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

                Operator.reportExecution(operation, args, feedback, memory);

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
        let arguments: Term = operation.getSubject();
        let argList: java.lang.String = arguments.toString().substring(3); // skip the product prefix "(*,"
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

        if (memory.emitting(EXE.class)) {
            // final Operator operator = (Operator) opT;

            if (feedback instanceof java.lang.Exception)
                feedback = feedback.getClass().getSimpleName() + ": " + (feedback as java.lang.Throwable).getMessage();

            memory.emit(EXE.class, new Operator.ExecutionResult(operation, feedback));
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

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Operator {
    export type ExecutionResult = InstanceType<typeof Operator.ExecutionResult>;
}


