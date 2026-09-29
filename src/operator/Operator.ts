//! Java source: opennars/operator/Operator.java
import type { float } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Term } from "../language/Term.ts";
import { Inheritance } from "../language/Inheritance.ts";
import { Operation } from "./Operation.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { OutputHandler } from "../io/events/OutputHandler.ts";
import { Debug } from "../main/Debug.ts";
import type { Product } from "../language/Product.ts";
import type { Statement } from "../language/Statement.ts";
import type { BudgetValue } from "../entity/BudgetValue.ts";
import { toJavaString, type JavaStringInput } from "../runtime/java-text.ts";
import { javaStringValue } from "../runtime/java-text.ts";
import { isJavaException } from "../runtime/JavaExceptions.ts";
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../runtime/JavaExceptions.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { Task } from "../entity/Task.ts";
import type { Nar } from "../main/Nar.ts";
import type { Plugin } from "../plugin/Plugin.ts";

// Java original type: List<Task> | null. Every current TypeScript operator
// produces a transient ordered Task[] or null, and call() only consumes
// emptiness and iteration. Keep this as a named operator feedback contract
// instead of mechanically weakening domain Set/Map abstractions elsewhere.
export type OperatorFeedback = Task[] | null;

const javaArrayToString = (values: unknown[]): string =>
    `[${values.map((value) => value === null || value === undefined ? "null" : javaStringValue(value)).join(", ")}]`;



/**
 * An individual operator that can be execute by the system, which can be either
 * inside NARS or outside it, in another system or device.
 * <p>
 * This is the only file to modify when registering a new operator into NARS.
 */
export abstract class Operator extends Term implements Plugin {

    protected constructor();

    protected constructor(name: JavaStringInput);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 1: {
                const [name] = args as [JavaStringInput];


                super(toJavaString(name));
                if (!javaStringValue(name).startsWith("^"))
                    throw new JavaIllegalStateException("Operator name needs ^ prefix");


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
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
    protected abstract execute(operation: Operation, args: Term[], memory: Memory,
        time: Timable): OperatorFeedback;

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


                let feedback: OperatorFeedback = null;
                try {
                    feedback = this.execute(operation, operationArgs, memory, time);
                } catch (ex) {
                    if (isJavaException(ex)) {// peripherie, maybe used incorrectly, failure is unavoidable
                        if (Debug.SHOW_EXECUTION_ERRORS) {
                            memory.event.emit(OutputHandler.ERR.class, ex);
                        }
                        if (!Debug.EXECUTION_ERRORS_CONTINUE) {
                            throw new JavaIllegalStateException("Execution error:\n", ex);
                        } else {
                            return false; // failure on execution
                        }
                    } else {
                        throw ex;
                    }
                }

                let executionConfidence: float = memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE;
                if (feedback === null || feedback.length === 0) { // null operator case
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
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public static operationExecutionString(operation: Statement): string {
        const operator: Term = operation.getPredicate();
        const operationArguments: Term = operation.getSubject();
        // Java source returns the final String after skipping the Product prefix
        // "(*,"; no caller consumes Java String identity at this output boundary.
        const argList = javaStringValue(operationArguments.toString()).substring(3);
        return `${javaStringValue(operator)}(${argList}`;
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
    // Java original type: Object. This boundary carries arbitrary feedback and
    // only applies the Exception -> text conversion before emitting the payload.
    public static reportExecution(operation: Operation, args: Term[], feedback: unknown,
        memory: Memory): void {

        let opT: Term = operation.getPredicate();
        if (!(opT instanceof Operator)) {
            return;
        }

        if (memory.emitting(OutputHandler.EXE.class)) {
            // final Operator operator = (Operator) opT;

            if (isJavaException(feedback)) {
                const exception = feedback as JavaExceptionView;
                const className = typeof exception.getClass === "function"
                    ? javaStringValue(exception.getClass().getSimpleName())
                    : exception.name;
                feedback = `${className}: ${javaStringValue(exception.getMessage())}`;
            }

            memory.emit(OutputHandler.EXE.class, new Operator.ExecutionResult(operation, feedback));
        }
    }

    // Java original type: public static class ExecutionResult;
    // it is a plain event payload; no JavaObject/reflection contract is consumed.
    public static ExecutionResult = class ExecutionResult {
        private readonly operation: Operation;
        // Java original field type: Object. No Object identity/reflection
        // contract is consumed by this event payload.
        private readonly feedback: unknown;

        public constructor(op: Operation, feedback: unknown) {
            this.operation = op;
            this.feedback = feedback;
        }

        public getTask(): Task | null {
            return this.operation.getTask();
        }

        public toString(): string {
            let b: BudgetValue = null as unknown as BudgetValue;
            const task = this.getTask();
            if (task !== null) {
                b = task.getBudget();
            }
            let args: Term[] = this.operation.getArguments().term;
            let operator: Operator = this.operation.getOperator();

            const budgetPrefix = b !== null ? javaStringValue(b.toStringExternal()) + " " : "";
            return budgetPrefix + javaStringValue(operator) +
                "(" + javaArrayToString(args) + ")=" + javaStringValue(this.feedback);
        }

    };


    public static addPrefixIfMissing(opName: JavaStringInput): string {
        const text = javaStringValue(opName);
        return text.startsWith("^") ? text : `^${text}`;
    }

}

type JavaExceptionView = {
    name: string;
    getMessage(): unknown;
    getClass?: () => { getSimpleName(): unknown };
};

Inheritance.registerOperatorPredicate((value) => value instanceof Operator);

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Operator {
    export type ExecutionResult = InstanceType<typeof Operator.ExecutionResult>;
}

