//! Java source: opennars/plugin/mental/Abbreviation.java
import { java, S } from "jree";
import type { ClassTokenLike } from "../../runtime/RuntimeClass.ts";
import type { double, int, float } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { BudgetValue } from "../../entity/BudgetValue.ts";
import { Sentence } from "../../entity/Sentence.ts";
import { Stamp } from "../../entity/Stamp.ts";
import { Task } from "../../entity/Task.ts";
import { TruthValue } from "../../entity/TruthValue.ts";
import { BudgetFunctions } from "../../inference/BudgetFunctions.ts";
import { Symbols } from "../../io/Symbols.ts";
import { Events } from "../../io/events/Events.ts";
import { CompoundTerm } from "../../language/CompoundTerm.ts";
import { Term } from "../../language/Term.ts";
import { Similarity } from "../../language/Similarity.ts";
import { Operation } from "../../operator/Operation.ts";
import { Operator } from "../../operator/Operator.ts";
import type { Timable } from "../../interfaces/Timable.ts";
import type { JavaChar } from "../../runtime/jree-compat.ts";
import type { Memory } from "../../storage/Memory.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Plugin } from "../Plugin.ts";
import type { EventEmitter } from "../../io/events/EventEmitter.ts";

type EventObserver = EventEmitter.EventObserver;
const TaskDerive = Events.TaskDerive;



/**
 * 1-step abbreviation, which calls ^abbreviate directly and not through an
 * added Task.
 * Experimental alternative to Abbreviation plugin.
 */
// Java source declares Abbreviation as a Plugin without a specialized parent.
// The nested Abbreviate operator has its own Operator identity and is not part
// of this outer-plugin shell migration.
export class Abbreviation implements Plugin {
    public obs: EventObserver | null = null;

    // TODO different parameters for priorities and budgets of both the abbreviation
    // process and the resulting abbreviation judgment
    // public PortableDouble priorityFactor = new PortableDouble(1.0);

    public abbreviationProbability: double = 0.0001;
    public abbreviationComplexityMin: int = 20;
    public abbreviationQualityMin: double = 0.95;

    public setAbbreviationProbability(val: double): void {
        this.abbreviationProbability = val;
    }

    public getAbbreviationProbability(): double {
        return this.abbreviationProbability;
    }

    public setAbbreviationComplexityMin(val: double): void {
        this.abbreviationComplexityMin = val as int;
    }

    public getAbbreviationComplexityMin(): double {
        return this.abbreviationComplexityMin;
    }

    public setAbbreviationQualityMin(val: double): void {
        this.abbreviationQualityMin = val;
    }

    public getAbbreviationQualityMin(): double {
        return this.abbreviationQualityMin;
    }

    public constructor();

    public constructor(abbreviationProbability: double, abbreviationComplexityMin: int, abbreviationQualityMin: double);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                break;
            }

            case 3: {
                const [abbreviationProbability, abbreviationComplexityMin, abbreviationQualityMin] = args as [double, int, double];


                this.abbreviationProbability = abbreviationProbability;
                this.abbreviationComplexityMin = abbreviationComplexityMin;
                this.abbreviationQualityMin = abbreviationQualityMin;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public canAbbreviate(task: Task): boolean {
        return !(task.sentence.term instanceof Operation) &&
            (task.sentence.term.getComplexity() > this.abbreviationComplexityMin) &&
            (task.getBudget().getQuality() > this.abbreviationQualityMin);
    }

    public setEnabled(n: Nar, enabled: boolean): boolean {
        let memory: Memory = n.memory;

        let _abbreviate: Operator = memory.getOperator(new java.lang.String("^abbreviate"));
        if (_abbreviate === null) {
            _abbreviate = memory.addOperator(new Abbreviation.Abbreviate());
        }
        let abbreviate: Operator = _abbreviate;

        if (this.obs === null) {
            this.obs = {
                event: (event: ClassTokenLike, a: EventEmitter.EventPayload): void => {
                if (event !== TaskDerive.class)
                    return;

                if ((this.abbreviationProbability < 1.0) && (n.memory.randomNumber.nextDouble() >= this.abbreviationProbability))
                    return;

                let task: Task = a[0] as Task;

                // is it complex and also important? then give it a name:
                if (this.canAbbreviate(task)) {

                    let operation: Operation = Operation.make(
                        abbreviate, CompoundTerm.termArray(task.sentence.term),
                        false);

                    operation.setTask(task);

                    abbreviate.call(operation, memory, n);
                }

                }
            };
        }

        memory.event.set(this.obs as EventObserver, enabled, TaskDerive.class);

        return true;
    }

    /**
     * Operator that give a CompoundTerm an atomic name
     */
    public static Abbreviate = class Abbreviate extends Operator {

        public constructor() {
            super("^abbreviate");
        }

        private static currentTermSerial: int = 1;

        public newSerialTerm(prefix: JavaChar): Term {
            /* synchronized (currentTermSerial) { */
            Abbreviate.currentTermSerial++;
            /* } */
            return new Term(new java.lang.String(String(prefix) + String(Abbreviate.currentTermSerial)));
        }

        /**
         * To create a judgment with a given statement
         *
         * @param args   Arguments, a Statement followed by an optional tense
         * @param memory The memory in which the operation is executed
         * @return Immediate results as Tasks
         */
        protected execute(operation: Operation, args: Term[], memory: Memory,
            time: Timable): Task[] {

            let compound: Term = args[0];

            let atomic: Term = this.newSerialTerm(Symbols.TERM_PREFIX);

            const content = Similarity.make(compound, atomic);
            if (content === null) {
                return [];
            }
            let sentence: Sentence = new Sentence(
                content,
                Symbols.JUDGMENT_MARK,
                TruthValue.fromFrequencyConfidence(1, memory.narParameters.DEFAULT_JUDGMENT_CONFIDENCE, memory.narParameters), // a
                // naming
                // convension
                new Stamp(time, memory));

            let quality: float = BudgetFunctions.truthToQuality(sentence.getTruth());

            let budget: BudgetValue = new BudgetValue(
                memory.narParameters.DEFAULT_JUDGMENT_PRIORITY,
                memory.narParameters.DEFAULT_JUDGMENT_DURABILITY,
                quality, memory.narParameters);

            let newTask: Task = new Task(sentence, budget, Task.EnumType.INPUT);
            return [newTask];

        }

    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Abbreviation {
    export type Abbreviate = InstanceType<typeof Abbreviation.Abbreviate>;
}


