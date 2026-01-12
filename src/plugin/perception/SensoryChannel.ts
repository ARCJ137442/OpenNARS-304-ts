//! Java source: opennars/plugin/perception/SensoryChannel.java
import { java, JavaObject, type int, type double, S } from "jree";



export abstract class SensoryChannel extends JavaObject implements Plugin {
    private reportResultsTo: java.util.Collection<SensoryChannel>;
    public nar: Nar; // for top-down influence of concept budgets
    public readonly results: java.util.List<Task> = new java.util.ArrayList();
    public height: int = 0; // 1D channels have height 1
    public width: int = 0;
    public duration: int = -1;
    private label: Term;

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
                const [nar, reportResultsTo, width, height, duration, label] = args as [Nar, java.util.Collection<SensoryChannel>, int, int, int, Term];


                super();
                this.reportResultsTo = reportResultsTo;
                this.nar = nar;
                this.width = width;
                this.height = height;
                this.duration = duration;
                this.label = label;


                break;
            }

            case 6: {
                const [nar, reportResultsTo, width, height, duration, label] = args as [Nar, SensoryChannel, int, int, int, Term];


                this(nar, java.util.Collections.singletonList(reportResultsTo), width, height, duration, label);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public addInput(text: java.lang.String, time: Timable): void {
        try {
            let t: Task = new Narsese(this.nar).parseTask(text);
            this.addInput(t, time);
        } catch (ex) {
            if (ex instanceof Narsese.InvalidInputException) {
                java.lang.System.Logger.getLogger(SensoryChannel.class.getName()).log(java.lang.System.Logger.Level.SEVERE, null, ex);
                throw new java.lang.IllegalStateException("Could not parse input", ex);
            } else {
                throw ex;
            }
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
        if (this instanceof Nar) { // on highest level it is simply the concept priority
            let c: Concept = (this as Nar).memory.concept(t);
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
        this.label = new Term(val);
        this.nar.removePlugin(.newthis.nar.new PluginState(this));
        this.nar.addPlugin(this);
    }
}
