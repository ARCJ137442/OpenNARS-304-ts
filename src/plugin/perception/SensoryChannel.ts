


import { java, JavaObject, type int, type double, S } from "jree";



export abstract class SensoryChannel extends JavaObject implements Plugin {
    private reportResultsTo: java.util.Collection<SensoryChannel> | null;
    public nar: Nar | null; // for top-down influence of concept budgets
    public readonly results: java.util.List<Task> | null = new java.util.ArrayList();
    public height: int = 0; // 1D channels have height 1
    public width: int = 0;
    public duration: int = -1;
    private label: Term | null;

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

    public constructor(/* final */  nar: Nar | null, /* final */  reportResultsTo: java.util.Collection<SensoryChannel> | null, /* final */  width: int,
            /* final */  height: int, /* final */  duration: int, label: Term | null);

    public constructor(/* final */  nar: Nar | null, /* final */  reportResultsTo: SensoryChannel | null, /* final */  width: int, /* final */  height: int,
            /* final */  duration: int, label: Term | null);
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


    public addInput(/* final */  text: java.lang.String | null, /* final */  time: Timable | null): void {
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

    public abstract addInput(/* final */  t: Task | null, /* final */  time: Timable | null): Nar | null;

    public step_start(/* final */  time: Timable | null): void {
    } // needs to put results into results and call step_finished when ready

    public step_finished(/* final */  time: Timable | null): void {
        for (let ch of this.reportResultsTo) {
            for (let t of this.results) {
                ch.addInput(t, time);
            }
        }
        this.results.clear();
    }

    public topDownPriority(/* final */  t: Term | null): double {
        let prioritySum: double = 0.0;
        for (let chan of this.reportResultsTo) {
            prioritySum += chan.priority(t);
        }
        return prioritySum / this.reportResultsTo.size() as double;
    }

    public priority(/* final */  t: Term | null): double {
        if (this instanceof Nar) { // on highest level it is simply the concept priority
            let c: Concept = (this as Nar).memory.concept(t);
            if (c !== null) {
                return c.getPriority();
            }
        }
        return 0.0;
    }

    public getName(): java.lang.String | null {
        return this.label.toString();
    }

    public setName(val: java.lang.String | null): void {
        this.label = new Term(val);
        this.nar.removePlugin(.newthis.nar.new PluginState(this));
        this.nar.addPlugin(this);
    }
}
