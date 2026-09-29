//! Java source: opennars/plugin/mental/Counting.java
import type { ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import type { float, double, int } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { Events } from "../../io/events/Events.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Inheritance } from "../../language/Inheritance.ts";
import { Product } from "../../language/Product.ts";
import { SetExt } from "../../language/SetExt.ts";
import { Term } from "../../language/Term.ts";
import { Float32Math } from "../../runtime/Float32.ts";
import { JavaIllegalArgumentException } from "../../runtime/JavaExceptions.ts";
import { toJavaString } from "../../runtime/java-text.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Plugin } from "../Plugin.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";

type EventObserver = EventEmitter.EventObserver;



/**
 * Counting and Cardinality
 */
// Java source declares a plain Plugin implementation without a JavaObject base.
// Keep the plugin as a plain TypeScript class; only its boxed-string boundary
// remains in jree-compat while exception identity stays project-owned.
export class Counting implements Plugin {

    public obs: EventObserver | null = null;

    protected static readonly CARDINALITY: Term = Term.get("CARDINALITY");
    public MINIMUM_PRIORITY: float = Float32Math.from(0.3) as float;

    public setMINIMUM_PRIORITY(val: double): void {
        this.MINIMUM_PRIORITY = Float32Math.from(val) as float;
    }

    public getMINIMUM_PRIORITY(): double {
        return this.MINIMUM_PRIORITY;
    }

    public constructor();

    public constructor(MINIMUM_PRIORITY: float);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                break;
            }

            case 1: {
                const [MINIMUM_PRIORITY] = args as [float];

                this.MINIMUM_PRIORITY = Float32Math.from(MINIMUM_PRIORITY) as float;


                break;
            }

            default: {
                throw new JavaIllegalArgumentException("Invalid number of arguments");
            }
        }
    }


    public setEnabled(n: Nar, enabled: boolean): boolean {
        let memory: Memory = n.memory;

        if (this.obs === null) {
            this.obs = {
                event: (event: ClassTokenLike, a: EventEmitter.EventPayload): void => {

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

                            let truth: TruthValue = task.sentence.getTruth().clone();
                            let stampi: Stamp = task.sentence.stamp.clone();
                            let j: Sentence = new Sentence(
                                new_term,
                                Symbols.JUDGMENT_MARK,
                                truth,
                                stampi);
                            let budg: BudgetValue = task.getBudget().clone();

                            let newTask: Task = new Task(j, budg, Task.EnumType.INPUT);

                            memory.addNewTask(newTask, toJavaString("Derived (Cardinality)"));
                        }
                    }
                }
                },
            };
        }

        memory.event.set(this.obs as EventObserver, enabled, Events.TaskDerive.class);
        return true;
    }

}
