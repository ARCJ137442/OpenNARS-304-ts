import { java, JavaObject, type float, type double, type int, S } from "jree";



/**
 * Counting and Cardinality
 */
export class Counting extends JavaObject implements Plugin {

    public obs: EventObserver;

    protected static readonly CARDINALITY: Term = Term.get("CARDINALITY");
    public MINIMUM_PRIORITY: float = 0.3;

    public setMINIMUM_PRIORITY(val: double): void {
        this.MINIMUM_PRIORITY = val as float;
    }

    public getMINIMUM_PRIORITY(): double {
        return this.MINIMUM_PRIORITY;
    }

    public constructor();

    public constructor(MINIMUM_PRIORITY: float);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 1: {
                const [MINIMUM_PRIORITY] = args as [float];


                super();
                this.MINIMUM_PRIORITY = MINIMUM_PRIORITY;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public setEnabled(n: Nar, enabled: boolean): boolean {
        let memory: Memory = n.memory;

        if (this.obs === null) {
            this.obs = (event, a) => {

                if ((event !== Events.TaskDerive.class && event !== Events.TaskAdd.class))
                    return;

                let task: Task = a[0] as Task;
                if (task.getPriority() < this.MINIMUM_PRIORITY) {
                    return;
                }

                if (task.sentence.punctuation === Symbols.JUDGMENT_MARK) {
                    // lets say we have <{...} --> M>.
                    if (task.sentence.term instanceof Inheritance) {

                        let inh: Inheritance = task.sentence.term as Inheritance;

                        if (inh.getSubject() instanceof SetExt) {

                            let set_term: SetExt = inh.getSubject() as SetExt;

                            // this gets the cardinality of M
                            let cardinality: int = set_term.size();

                            // now create term <(*,M,cardinality) --> CARDINALITY>.
                            let product_args: Term[] = [
                                inh.getPredicate(),
                                Term.get(cardinality)
                            ];

                            // TODO CARDINATLITY can be a static final instance shared by all
                            let new_term: Term = Inheritance.make(new Product(product_args), /* --> */ Counting.CARDINALITY);
                            if (new_term === null) {
                                // this usually happens when product_args contains the term CARDINALITY in which
                                // case it is an invalid Inheritance statement
                                return;
                            }

                            let truth: TruthValue = task.sentence.truth.clone();
                            let stampi: Stamp = task.sentence.stamp.clone();
                            let j: Sentence = new Sentence(
                                new_term,
                                Symbols.JUDGMENT_MARK,
                                truth,
                                stampi);
                            let budg: BudgetValue = task.budget.clone();

                            let newTask: Task = new Task(j, budg, Task.EnumType.INPUT);

                            memory.addNewTask(newTask, "Derived (Cardinality)");
                        }
                    }
                }
            };
        }

        memory.event.set(this.obs, enabled, Events.TaskDerive.class);
        return true;
    }

}
