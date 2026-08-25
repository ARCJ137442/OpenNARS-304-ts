//! Java source: opennars/plugin/perception/SensoryChannel.java
import { java, JavaObject, type int, type double, S } from "jree";
import { Narsese } from "../../io/Narsese.ts";
import { Parser } from "../../io/Parser.ts";
import { JavaSystemLoggerCompat } from "../../runtime/jree-compat.ts";
import { Term } from "../../language/Term.ts";
import { Concept } from "../../entity/Concept.ts";
import type { Plugin } from "../Plugin.ts";
import type { Nar } from "../../main/Nar.ts";
import type { Task } from "../../entity/Task.ts";
import type { Timable } from "../../interfaces/Timable.ts";



export abstract class SensoryChannel extends JavaObject implements Plugin {
    /**
     * Java Plugin provides this default implementation; SensoryChannel does
     * not make the method abstract. Keeping the default here also lets Nar
     * remain instantiable without forcing every channel to implement a no-op.
     */
    public setEnabled(_n: Nar, _enabled: boolean): boolean {
        return true;
    }

    private reportResultsTo: java.util.Collection<SensoryChannel> = new java.util.ArrayList<SensoryChannel>();
    public nar!: Nar; // for top-down influence of concept budgets
    public readonly results: java.util.List<Task> = new java.util.ArrayList<Task>();
    public height: int = 0; // 1D channels have height 1
    public width: int = 0;
    public duration: int = -1;
    protected label: Term = new Term();

    public resetChannel(): void {
    }

    public getHeight(): double {
        return this.height;
    }

    public setHeight(val: double): void {
        this.height = val as int;
        this.resetChannel();
    }

    public getWidth(): double {
        return this.width;
    }

    public setWidth(val: double): void {
        this.width = val as int;
    }

    public getDuration(): double {
        return this.duration;
    }

    public setDuration(val: double): void {
        this.duration = val as int;
    }

    public constructor();

    public constructor(nar: Nar, reportResultsTo: java.util.Collection<SensoryChannel>, width: int,
        height: int, duration: int, label: Term);

    public constructor(nar: Nar, reportResultsTo: SensoryChannel, width: int, height: int,
        duration: int, label: Term);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                super();


                break;
            }

            case 6: {
                const [nar, reportResultsTo, width, height, duration, label] = args as [
                    Nar,
                    java.util.Collection<SensoryChannel> | SensoryChannel,
                    int,
                    int,
                    int,
                    Term,
                ];

                super();
                this.reportResultsTo = reportResultsTo instanceof SensoryChannel
                    ? java.util.Collections.singletonList(reportResultsTo)
                    : reportResultsTo;
                this.nar = nar;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.label = label;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /** Java's String overload is kept separate because the Task overload is abstract. */
    public addInputText(text: java.lang.String, time: Timable): void {
        try {
            let parsedTask: Task = new Narsese(this.nar).parseTask(text);
            this.addInput(parsedTask, time);
        } catch (ex) {
            if (ex instanceof Parser.InvalidInputException) {
                JavaSystemLoggerCompat.getLogger(SensoryChannel.class.getName()).log(
                    JavaSystemLoggerCompat.Level.SEVERE,
                    null,
                    ex as java.lang.Throwable,
                );
                throw new java.lang.IllegalStateException("Could not parse input", ex);
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
        this.results.clear();
    }

    public topDownPriority(t: Term): double {
        let prioritySum: double = 0.0;
        for (let chan of this.reportResultsTo) {
            prioritySum += chan.priority(t);
        }
        return prioritySum / this.reportResultsTo.size() as double;
    }

    public priority(t: Term): double {
        const reasoner = this as unknown as { memory?: { concept(term: Term): Concept } };
        if (reasoner.memory !== undefined) { // on highest level it is simply the concept priority
            let c: Concept = reasoner.memory.concept(t);
            if (c !== null) {
                return c.getPriority();
            }
        }
        return 0.0;
    }

    public getName(): java.lang.String {
        return this.label.toString();
    }

    public setName(val: java.lang.String): void {
        this.label = new Term(java.lang.String.valueOf(val));
        this.nar.removePlugin(new this.nar.PluginState(this));
        this.nar.addPlugin(this);
    }
}
