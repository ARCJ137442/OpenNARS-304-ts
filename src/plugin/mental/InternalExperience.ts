import { java, JavaObject, type float, type double, type int, S } from "jree";



/**
 * To rememberAction an internal action as an operation
 * <p>
 * called from Concept
 */
export class InternalExperience extends JavaObject implements Plugin, EventObserver {
    private memory: Memory | null;

    public static enabled: boolean = false;

    private nar: Nar | null;

    public MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC: float = 0.3;
    public MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE: float = 0.3;

    // internal experience has less durability?
    public INTERNAL_EXPERIENCE_PROBABILITY: float = 0.0001;

    // internal experience has less durability?
    public INTERNAL_EXPERIENCE_DURABILITY_MUL: float = 0.1; // 0.1

    // internal experience has less priority?
    public INTERNAL_EXPERIENCE_PRIORITY_MUL: float = 0.1; // 0.1

    /** less probable form */
    public INTERNAL_EXPERIENCE_RARE_PROBABILITY: float = 0.000025;

    /** dont use internal experience for want and believe if this setting is true */
    public ALLOW_WANT_BELIEF: boolean = true;

    // https://groups.google.com/forum/#!topic/open-nars/DVE5FJd7FaM
    public OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY: boolean = false;

    public FULL_REFLECTION: boolean = false;

    public setMINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC(val: double): void {
        this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC = val as float;
    }

    public getMINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC(): double {
        return this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC;
    }

    public setMINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE(val: double): void {
        this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE = val as float;
    }

    public getMINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE(): double {
        return this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE;
    }

    public setINTERNAL_EXPERIENCE_PROBABILITY(val: double): void {
        this.INTERNAL_EXPERIENCE_PROBABILITY = val as float;
    }

    public getINTERNAL_EXPERIENCE_PROBABILITY(): double {
        return this.INTERNAL_EXPERIENCE_PROBABILITY;
    }

    public setINTERNAL_EXPERIENCE_RARE_PROBABILITY(val: double): void {
        this.INTERNAL_EXPERIENCE_RARE_PROBABILITY = val as float;
    }

    public getINTERNAL_EXPERIENCE_RARE_PROBABILITY(): double {
        return this.INTERNAL_EXPERIENCE_RARE_PROBABILITY;
    }

    public setINTERNAL_EXPERIENCE_DURABILITY_MUL(val: double): void {
        this.INTERNAL_EXPERIENCE_DURABILITY_MUL = val as float;
    }

    public getINTERNAL_EXPERIENCE_DURABILITY_MUL(): double {
        return this.INTERNAL_EXPERIENCE_DURABILITY_MUL;
    }

    public setINTERNAL_EXPERIENCE_PRIORITY_MUL(val: double): void {
        this.INTERNAL_EXPERIENCE_PRIORITY_MUL = val as float;
    }

    public getINTERNAL_EXPERIENCE_PRIORITY_MUL(): double {
        return this.INTERNAL_EXPERIENCE_PRIORITY_MUL;
    }

    public isALLOW_WANT_BELIEF(): boolean {
        return this.ALLOW_WANT_BELIEF;
    }

    public setALLOW_WANT_BELIEF(/* final */  val: boolean): void {
        this.ALLOW_WANT_BELIEF = val;
    }

    public isOLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY(): boolean {
        return this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY;
    }

    public setOLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY(/* final */  val: boolean): void {
        this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY = val;
    }

    public isFULL_REFLECTION(): boolean {
        return this.FULL_REFLECTION;
    }

    public setFULL_REFLECTION(/* final */  val: boolean): void {
        this.FULL_REFLECTION = val;
    }

    public constructor();

    public constructor(MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC: float,
        MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE: float,
        INTERNAL_EXPERIENCE_PROBABILITY: float,
        INTERNAL_EXPERIENCE_RARE_PROBABILITY: float,
        INTERNAL_EXPERIENCE_DURABILITY_MUL: float,
        INTERNAL_EXPERIENCE_PRIORITY_MUL: float,
        ALLOW_WANT_BELIEF: boolean,
        OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY: boolean,
        FULL_REFLECTION: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 9: {
                const [MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC, MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE, INTERNAL_EXPERIENCE_PROBABILITY, INTERNAL_EXPERIENCE_RARE_PROBABILITY, INTERNAL_EXPERIENCE_DURABILITY_MUL, INTERNAL_EXPERIENCE_PRIORITY_MUL, ALLOW_WANT_BELIEF, OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY, FULL_REFLECTION] = args as [float, float, float, float, float, float, boolean, boolean, boolean];


                super();
                this.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC = MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC;
                this.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE = MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE;
                this.INTERNAL_EXPERIENCE_PROBABILITY = INTERNAL_EXPERIENCE_PROBABILITY;
                this.INTERNAL_EXPERIENCE_RARE_PROBABILITY = INTERNAL_EXPERIENCE_RARE_PROBABILITY;
                this.INTERNAL_EXPERIENCE_DURABILITY_MUL = INTERNAL_EXPERIENCE_DURABILITY_MUL;
                this.INTERNAL_EXPERIENCE_PRIORITY_MUL = INTERNAL_EXPERIENCE_PRIORITY_MUL;
                this.ALLOW_WANT_BELIEF = ALLOW_WANT_BELIEF;
                this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY = OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY;
                this.FULL_REFLECTION = FULL_REFLECTION;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(/* final */  n: Nar | null, /* final */  enable: boolean): boolean {
        this.memory = n.memory;
        this.nar = n;

        this.memory.event.set(this, enable, Events.ConceptDirectProcessedTask.class);

        if (this.FULL_REFLECTION)
            this.memory.event.set(this, enable, Events.BeliefReason.class);

        InternalExperience.enabled = enable;

        return true;
    }

    public static toTerm(/* final */  s: Sentence | null, /* final */  mem: Memory | null, /* final */  time: Timable | null): Term | null {
        let opName: java.lang.String;
        switch (s.punctuation) {
            case Symbols.JUDGMENT_MARK:
                opName = "^believe";
                if (!mem.internalExperience.ALLOW_WANT_BELIEF) {
                    return null;
                }
                break;
            case Symbols.GOAL_MARK:
                opName = "^want";
                if (!mem.internalExperience.ALLOW_WANT_BELIEF) {
                    return null;
                }
                break;
            case Symbols.QUESTION_MARK:
                opName = "^wonder";
                break;
            case Symbols.QUEST_MARK:
                opName = "^evaluate";
                break;
            default:
                return null;
        }

        let opTerm: Term = mem.getOperator(opName);
        let arg: Term[] = new Array<Term>(s.truth === null ? 2 : 3);
        arg[0] = Term.SELF;
        arg[1] = s.getTerm();
        if (s.truth !== null) {
            arg[2] = s.projection(time.time(), time.time(), mem).truth.toWordTerm();
        }

        // Operation.make ?
        let operation: Term = Inheritance.make(new Product(arg), opTerm);
        if (operation === null) {
            throw new java.lang.IllegalStateException("Unable to create Inheritance: " + opTerm + ", " + java.util.Arrays.toString(arg));
        }
        return operation;
    }

    public event(/* final */  event: java.lang.Class<unknown> | null, /* final */  a: java.lang.Object[] | null): void {

        if (event === Events.ConceptDirectProcessedTask.class) {
            let task: Task = a[0] as Task;

            // old strategy always, new strategy only for QUESTION and QUEST:
            if (this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY || (!this.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY
                && (task.sentence.punctuation === Symbols.QUESTION_MARK
                    || task.sentence.punctuation === Symbols.QUEST_MARK))) {
                InternalExperience.InternalExperienceFromTaskInternal(this.memory, task, this.FULL_REFLECTION, this.nar);
            }
        } else if (event === Events.BeliefReason.class) {
            // belief, beliefTerm, taskTerm, nal
            let belief: Sentence = a[0] as Sentence;
            let beliefTerm: Term = a[1] as Term;
            let taskTerm: Term = a[2] as Term;
            let nal: DerivationContext = a[3] as DerivationContext;
            this.beliefReason(belief, beliefTerm, taskTerm, nal);
        }
    }

    public static InternalExperienceFromBelief(/* final */  memory: Memory | null, /* final */  task: Task | null, /* final */  belief: Sentence | null,
            /* final */  time: Timable | null): void {
        let newTask: Task = new Task(belief.clone(), task.budget.clone(), Task.EnumType.INPUT);

        InternalExperience.InternalExperienceFromTask(memory, newTask, false, time);
    }

    public static InternalExperienceFromTask(/* final */  memory: Memory | null, /* final */  task: Task | null, /* final */  full: boolean,
            /* final */  time: Timable | null): void {
        if (memory.internalExperience === null) {
            return;
        }
        if (!memory.internalExperience.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY) {
            InternalExperience.InternalExperienceFromTaskInternal(memory, task, full, time);
        }
    }

    public static InternalExperienceFromTaskInternal(/* final */  memory: Memory | null, /* final */  task: Task | null, /* final */  full: boolean,
            /* final */  time: Timable | null): boolean {
        if (!InternalExperience.enabled) {
            return false;
        }

        // if(OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY ||
        // (!OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY &&
        // (task.sentence.punctuation==Symbols.QUESTION_MARK ||
        // task.sentence.punctuation==Symbols.QUEST_MARK))) {
        {
            if (task.sentence.punctuation === Symbols.QUESTION_MARK || task.sentence.punctuation === Symbols.QUEST_MARK) {
                if (task.getPriority() < memory.internalExperience.MINIMUM_PRIORITY_TO_CREATE_WONDER_EVALUATE) {
                    return false;
                }
            } else if (task.getPriority() < memory.internalExperience.MINIMUM_PRIORITY_TO_CREATE_WANT_BELIEVE_ETC) {
                return false;
            }
        }

        let content: Term = task.getTerm();
        // to prevent infinite recursions
        if (content instanceof Operation/*
                                         * || nal.memory.randomNumber.nextDouble()>Parameters.
                                         * INTERNAL_EXPERIENCE_PROBABILITY
                                         */) {
            return true;
        }
        let sentence: Sentence = task.sentence;
        let truth: TruthValue = new TruthValue(1.0, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE,
            memory.narParameters);
        let stamp: Stamp = task.sentence.stamp.clone();
        stamp.setOccurrenceTime(time.time());
        let ret: Term = InternalExperience.toTerm(sentence, memory, time);
        if (ret === null) {
            return true;
        }
        let j: Sentence = new Sentence(
            ret,
            Symbols.JUDGMENT_MARK,
            truth,
            stamp);

        let newbudget: BudgetValue = new BudgetValue(
            memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE
            * memory.internalExperience.INTERNAL_EXPERIENCE_PRIORITY_MUL,
            memory.narParameters.DEFAULT_JUDGMENT_PRIORITY
            * memory.internalExperience.INTERNAL_EXPERIENCE_DURABILITY_MUL,
            BudgetFunctions.truthToQuality(truth), memory.narParameters);

        if (!memory.internalExperience.OLD_BELIEVE_WANT_EVALUATE_WONDER_STRATEGY) {
            newbudget.setPriority(task.getPriority() * memory.internalExperience.INTERNAL_EXPERIENCE_PRIORITY_MUL);
            newbudget
                .setDurability(task.getDurability() * memory.internalExperience.INTERNAL_EXPERIENCE_DURABILITY_MUL);
        }

        let newTask: Task = new Task(j, newbudget, Task.EnumType.INPUT);

        memory.addNewTask(newTask, "Reflected mental operation (Internal Experience)");
        return false;
    }

    protected static readonly nonInnateBeliefOperators: java.lang.String[] | null = [
        "^remind", "^doubt", "^consider", "^evaluate", "hestitate", "^wonder", "^belief", "^want"
    ];

    /** used in full internal experience mode only */
    protected beliefReason(/* final */  belief: Sentence | null, /* final */  beliefTerm: Term | null, /* final */  taskTerm: Term | null,
            /* final */  nal: DerivationContext | null): void {

        let memory: Memory = nal.memory;

        if (nal.memory.randomNumber.nextDouble() < this.INTERNAL_EXPERIENCE_RARE_PROBABILITY) {

            // the operators which dont have a innate belief
            // also get a chance to reveal its effects to the system this way
            let op: Operator = memory.getOperator(
                InternalExperience.nonInnateBeliefOperators[nal.memory.randomNumber.nextInt(InternalExperience.nonInnateBeliefOperators.length)]);

            let prod: Product = new Product(belief.term);

            if (op !== null && prod !== null) {

                let new_term: Term = Inheritance.make(prod, op);
                let sentence: Sentence = new Sentence(
                    new_term,
                    Symbols.GOAL_MARK,
                    new TruthValue(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, memory.narParameters), // a
                    // naming
                    // convension
                    new Stamp(nal.time, memory));

                let quality: float = BudgetFunctions.truthToQuality(sentence.truth);
                let budget: BudgetValue = new BudgetValue(
                    memory.narParameters.DEFAULT_GOAL_PRIORITY * this.INTERNAL_EXPERIENCE_PRIORITY_MUL,
                    memory.narParameters.DEFAULT_GOAL_DURABILITY * this.INTERNAL_EXPERIENCE_DURABILITY_MUL,
                    quality, memory.narParameters);

                let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

                nal.derivedTask(newTask, false, false, false);
            }
        }

        if (beliefTerm instanceof Implication
            && nal.memory.randomNumber.nextDouble() <= this.INTERNAL_EXPERIENCE_PROBABILITY) {
            let imp: Implication = beliefTerm as Implication;
            if (imp.getTemporalOrder() === TemporalRules.ORDER_FORWARD) {
                // 1. check if its (&/,term,+i1,...,+in) =/> anticipateTerm form:
                let valid: boolean = true;
                if (imp.getSubject() instanceof Conjunction) {
                    let conj: Conjunction = imp.getSubject() as Conjunction;
                    if (!conj.term[0].equals(taskTerm)) {
                        valid = false; // the expected needed term is not included
                    }
                    for (let i: int = 1; i < conj.term.length; i++) {
                        if (!(conj.term[i] instanceof Interval)) {
                            valid = false;
                            break;
                        }
                    }
                } else {
                    if (!imp.getSubject().equals(taskTerm)) {
                        valid = false;
                    }
                }

                if (valid) {
                    let op: Operator = memory.getOperator("^anticipate");
                    if (op === null)
                        throw new java.lang.IllegalStateException(this + " requires ^anticipate operator");

                    let args: Product = new Product(imp.getPredicate());
                    let new_term: Term = Operation.make(args, op);

                    let sentence: Sentence = new Sentence(
                        new_term,
                        Symbols.GOAL_MARK,
                        new TruthValue(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, memory.narParameters), // a
                        // naming
                        // convension
                        new Stamp(nal.time, memory));

                    let quality: float = BudgetFunctions.truthToQuality(sentence.truth);
                    let budget: BudgetValue = new BudgetValue(
                        memory.narParameters.DEFAULT_GOAL_PRIORITY * this.INTERNAL_EXPERIENCE_PRIORITY_MUL,
                        memory.narParameters.DEFAULT_GOAL_DURABILITY * this.INTERNAL_EXPERIENCE_DURABILITY_MUL,
                        quality, memory.narParameters);

                    let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);

                    nal.derivedTask(newTask, false, false, false);
                }
            }
        }
    }
}
