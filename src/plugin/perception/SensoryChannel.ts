//! Java source: opennars/plugin/perception/SensoryChannel.java
import { ReasonerInputError, ReasonerStateError } from "../../runtime/ReasonerErrors.ts";
import type { IntNumber, DoubleNumber } from "../../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Narsese } from "../../io/Narsese.ts";
import { Parser } from "../../io/Parser.ts";
import { Logger } from "../../runtime/Logger.ts";
import { isArrayConvertible, asText, type ArrayConvertible, type TextInput } from "../../runtime/Text.ts";
import { ReasonerObject } from "../../runtime/ClassIdentity.ts";
import { Term } from "../../language/Term.ts";
import { Concept } from "../../entity/Concept.ts";
import type { Plugin } from "../Plugin.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Task } from "../../entity/Task.ts";
import type { Timable } from "../../interfaces/Timable.ts";



/** Java原始类型：抽象普通基类；无Serializable、equals/hashCode或专用JavaObject行为。 */
export abstract class SensoryChannel extends ReasonerObject implements Plugin {
    /**
     * Java Plugin provides this default implementation; SensoryChannel does
     * not make the method abstract. Keeping the default here also lets Nar
     * remain instantiable without forcing every channel to implement a no-op.
     */
    public setEnabled(_n: Nar, _enabled: boolean): boolean {
        return true;
    }

    // Java source: private Collection<SensoryChannel>; only ordered iteration is used.
    private reportResultsTo: SensoryChannel[] = [];
    public nar!: Nar; // for top-down influence of concept budgets
    // Java source: public List<Task>; native array preserves push/iteration/clear semantics.
    public readonly results: Task[] = [];
    public height: IntNumber = 0; // 1D channels have height 1
    public width: IntNumber = 0;
    public duration: IntNumber = -1;
    protected label: Term = new Term();

    public resetChannel(): void {
    }

    public getHeight(): DoubleNumber {
        return this.height;
    }

    public setHeight(val: DoubleNumber): void {
        this.height = val as IntNumber;
        this.resetChannel();
    }

    public getWidth(): DoubleNumber {
        return this.width;
    }

    public setWidth(val: DoubleNumber): void {
        this.width = val as IntNumber;
    }

    public getDuration(): DoubleNumber {
        return this.duration;
    }

    public setDuration(val: DoubleNumber): void {
        this.duration = val as IntNumber;
    }

    public constructor();

    public constructor(nar: Nar, reportResultsTo: ArrayConvertible<SensoryChannel> | SensoryChannel[], width: IntNumber,
        height: IntNumber, duration: IntNumber, label: Term);

    public constructor(nar: Nar, reportResultsTo: SensoryChannel, width: IntNumber, height: IntNumber,
        duration: IntNumber, label: Term);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 6: {
                const [nar, reportResultsTo, width, height, duration, label] = args as [
                    Nar,
                    ArrayConvertible<SensoryChannel> | SensoryChannel[] | SensoryChannel,
                    IntNumber,
                    IntNumber,
                    IntNumber,
                    Term,
                ];

                super();
                this.reportResultsTo = reportResultsTo instanceof SensoryChannel
                    ? [reportResultsTo]
                    : Array.isArray(reportResultsTo)
                        ? reportResultsTo
                        : isArrayConvertible<SensoryChannel>(reportResultsTo)
                        ? reportResultsTo.toArray([])
                        : [];
                this.nar = nar;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.label = label;

                break;
            }

            default: {
                throw new ReasonerInputError("Invalid number of arguments");
            }
        }
    }

    /** Java's String overload is kept separate because the Task overload is abstract. */
    public addInputText(text: TextInput, time: Timable): void {
        try {
            let parsedTask: Task = new Narsese(this.nar).parseTask(text);
            this.addInput(parsedTask, time);
        } catch (ex) {
            if (ex instanceof Parser.InvalidInputException) {
                Logger.named(SensoryChannel.class.getName()).log(
                    "SEVERE",
                    null,
                    ex,
                );
                throw new ReasonerStateError("Could not parse input", { cause: ex });
            }
            throw ex;
        }
    }

    public abstract addInput(t: Task, time: Timable): Nar;

    public step_start(time: Timable): void {
    } // needs to put results into results and call step_finished when ready

    public step_finished(time: Timable): void {
        for (let ch of this.reportResultsTo) {
            for (let t of this.results) {
                ch.addInput(t, time);
            }
        }
        this.results.length = 0;
    }

    public topDownPriority(t: Term): DoubleNumber {
        let prioritySum: DoubleNumber = 0.0;
        for (let chan of this.reportResultsTo) {
            prioritySum += chan.priority(t);
        }
        return prioritySum / this.reportResultsTo.length as DoubleNumber;
    }

    public priority(t: Term): DoubleNumber {
        const reasoner = this as unknown as { memory?: { concept(term: Term): Concept } };
        if (reasoner.memory !== undefined) { // on highest level it is simply the concept priority
            let c: Concept = reasoner.memory.concept(t);
            if (c !== null) {
                return c.getPriority();
            }
        }
        return 0.0;
    }

    public getName(): string {
        return String(this.label.toString());
    }

    public setName(val: TextInput): void {
        this.label = new Term(asText(val));
        this.nar.removePlugin(new this.nar.PluginState(this));
        this.nar.addPlugin(this);
    }
}
