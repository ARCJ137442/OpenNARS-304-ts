import { java, type int, type float } from "jree";



/**
 * Superclass of functions that execute synchronously (blocking, in thread) and
 * take
 * N input parameters and one variable argument (as the final argument),
 * generating a new task
 * with the result of the function substituted in the variable's place.
 */
export abstract class FunctionOperator extends Operator {

    protected constructor(/* final */  name: java.lang.String | null) {
        super(name);
    }

    /**
     * y = function(x)
     *
     * @return y, or null if unsuccessful
     */
    protected abstract function(memory: Memory | null, x: Term[] | null): Term | null;

    /**
     * the term that the output will inherit from; analogous to the 'Range' of a
     * function in mathematical terminology
     */
    protected abstract getRange(): Term | null;

    // abstract protected int getMinArity();
    // abstract protected int getMaxArity();

    protected execute(operation: Operation | null, /* final */  args: Term[] | null, /* final */  m: Memory | null, /* final */  time: Timable | null): java.util.List<Task> | null {
        // TODO make memory access optional by constructor argument
        // TODO allow access to Nar instance?
        let numArgs: int = args.length - 1;

        if (numArgs < 1) {
            throw new java.lang.IllegalStateException("Requires at least 1 arguments");
        }

        if (numArgs < 2 /* && !(this instanceof Javascript) */) {
            throw new java.lang.IllegalStateException("Requires at least 2 arguments");
        }

        // last argument a variable?
        // final Term lastTerm = args[numArgs];
        // final boolean variable = lastTerm instanceof Variable;

        let numParam: int = numArgs - 1;

        /*
         * if(this instanceof Javascript && !variable) {
         * numParam++;
         * }
         */

        let x: Term[] = new Array<Term>(numParam);
        java.lang.System.arraycopy(args, 1, x, 0, numParam);

        let y: Term;
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
        let confidence: float = m.narParameters.DEFAULT_JUDGMENT_CONFIDENCE;
        let s: Sentence = new Sentence(operation,
            Symbols.JUDGMENT_MARK,
            new TruthValue(1.0, confidence, m.narParameters),
            new Stamp(time, m));
        let budgetForNewTask: BudgetValue = new BudgetValue(m.narParameters.DEFAULT_JUDGMENT_PRIORITY,
            m.narParameters.DEFAULT_FEEDBACK_DURABILITY,
            truthToQuality(s.getTruth()), m.narParameters);
        let newTask: Task = new Task(s, budgetForNewTask, Task.EnumType.INPUT);
        return Lists.newArrayList(newTask);
    }

    /**
     * (can be overridden in subclasses) the extent to which it is truth
     * that the 2 given terms are equal. in other words, a distance metric
     */
    public equals(/* final */  a: Term | null, /* final */  b: Term | null): float {
        // default: Term equality
        return a.equals(b) ? 1.0 : 0.0;
    }
}
