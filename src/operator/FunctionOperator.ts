//! Java source: opennars/operator/FunctionOperator.java
import type { IntNumber, FloatNumber } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Operator } from "./Operator.ts";
import { BudgetValue } from "../entity/BudgetValue.ts";
import { Sentence } from "../entity/Sentence.ts";
import { Stamp } from "../entity/Stamp.ts";
import { Task } from "../entity/Task.ts";
import { TruthValue } from "../entity/TruthValue.ts";
import { Symbols } from "../io/Symbols.ts";
import { Float32Math } from "../runtime/Float32.ts";
import type { Memory } from "../storage/Memory.ts";
import type { Term } from "../language/Term.ts";
import type { Operation } from "./Operation.ts";
import type { Timable } from "../interfaces/Timable.ts";
import type { CompoundTerm } from "../language/CompoundTerm.ts";
import {
    type TextInput,
} from "../runtime/Text.ts";
import { ReasonerInputError, ReasonerStateError } from "../runtime/ReasonerErrors.ts";

// Keep FunctionOperator below the inference layer. Importing BudgetFunctions
// here would close the FunctionOperator -> Memory -> BudgetFunctions cycle.
const truthToQuality = (truth: any): FloatNumber => {
    return Float32Math.truthToQuality(truth.getExpectation()) as FloatNumber;
};



/**
 * Superclass of functions that execute synchronously (blocking, in thread) and
 * take
 * N input parameters and one variable argument (as the final argument),
 * generating a new task
 * with the result of the function substituted in the variable's place.
 */
export abstract class FunctionOperator extends Operator {

    protected constructor(name: TextInput) {
        super(name);
    }

    /**
     * y = function(x)
     *
     * @return y, or null if unsuccessful
     */
    protected abstract function(memory: Memory, x: Term[]): Term | null;

    /**
     * the term that the output will inherit from; analogous to the 'Range' of a
     * function in mathematical terminology
     */
    protected abstract getRange(): Term;

    // abstract protected IntNumber getMinArity();
    // abstract protected IntNumber getMaxArity();

    protected execute(operation: Operation, args: Term[], m: Memory, time: Timable): Task[] | null {
        // TODO make memory access optional by constructor argument
        // TODO allow access to Nar instance?
        let numArgs: IntNumber = args.length - 1;

        if (numArgs < 1) {
            throw new ReasonerStateError("Requires at least 1 arguments");
        }

        if (numArgs < 2 /* && !(this instanceof Javascript) */) {
            throw new ReasonerStateError("Requires at least 2 arguments");
        }

        // last argument a variable?
        // final Term lastTerm = args[numArgs];
        // final boolean variable = lastTerm instanceof Variable;

        let numParam: IntNumber = numArgs - 1;

        /*
         * if(this instanceof Javascript && !variable) {
         * numParam++;
         * }
         */

        // Java source: System.arraycopy(args, 1, x, 0, numParam). The target
        // is a fresh Term[] and the ranges never overlap, so slice preserves
        // Java's shallow-copy and parameter-order semantics without jree.
        const x: Term[] = args.slice(1, 1 + numParam);

        let y: Term | null;
        // try {
        y = this.function(m, x);
        if (y === null) {
            return null;
        }
        /*
         * if(!variable && this instanceof Javascript) {
         * return null;
         * }
         */
        // m.emit(SynchronousFunctionOperator.class, Arrays.toString(x) + " | " + y);
        /*
         * }
         * catch (Exception e) {
         * throw e;
         * }
         */

        // final Variable var = new Variable("$1");
        // Term actual_part = Similarity.make(var, y);
        // Variable vardep=new Variable("#1");
        // Term actual_dep_part = Similarity.make(vardep, y);
        operation = operation.setComponent(0,
            (operation.getSubject() as CompoundTerm).setComponent(
                numArgs, y, m),
            m) as Operation;
        let confidence: FloatNumber = m.narParameters.DEFAULT_JUDGMENT_CONFIDENCE;
        let s: Sentence = new Sentence(operation,
            Symbols.JUDGMENT_MARK,
            TruthValue.fromFrequencyConfidence(1.0, confidence, m.narParameters),
            new Stamp(time, m));
        let budgetForNewTask: BudgetValue = new BudgetValue(m.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            m.narParameters.DEFAULT_FEEDBACK_DURABILITY,
            truthToQuality(s.getTruth()), m.narParameters);
        let newTask: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);
        return [newTask];
    }

    /**
     * (can be overridden in subclasses) the extent to which it is truth
     * that the 2 given terms are equal. in other words, a distance metric
     */
    public override equals(that: unknown): boolean;
    public equals(a: Term, b: Term): FloatNumber;
    public equals(...args: unknown[]): boolean | FloatNumber {
        if (args.length === 1) {
            // Java overload preservation: FunctionOperator inherits Term.equals(Object)
            // while also exposing the two-argument similarity metric below.
            return super.equals(args[0]);
        }
        if (args.length === 2) {
            const [a, b] = args as [Term, Term];
            return a.equals(b) ? 1.0 : 0.0;
        }
        throw new ReasonerInputError("Invalid number of arguments");
    }
}
