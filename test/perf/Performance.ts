import { java, JavaObject, type IntNumber, type DoubleNumber, S } from "../support/legacy-runtime-facade.ts";
import { JavaDecimalFormatCompat, JavaRuntimeCompat } from "../support/legacy-runtime-facade.ts";



export abstract class Performance extends JavaObject {
    public readonly repeats: IntNumber;
    protected readonly name: java.lang.String;
    private totalTime: number = 0;
    private totalMemory: number = 0;
    protected readonly df: JavaDecimalFormatCompat = new JavaDecimalFormatCompat("#.###");

    public constructor(name: java.lang.String, repeats: IntNumber, warmups: IntNumber);

    public constructor(name: java.lang.String, repeats: IntNumber, warmups: IntNumber, gc: boolean);
    public constructor(...args: unknown[]) {
        super();
        let name: java.lang.String;
        let repeats: IntNumber;
        let warmups: IntNumber;
        let gc: boolean;
        switch (args.length) {
            case 3: {
                [name, repeats, warmups] = args as [java.lang.String, IntNumber, IntNumber];
                gc = true;
                break;
            }

            case 4: {
                [name, repeats, warmups, gc] = args as [java.lang.String, IntNumber, IntNumber, boolean];
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }

        this.repeats = repeats;
        this.name = name;
        this.init();

        const runtime = JavaRuntimeCompat.getRuntime();
        let total: IntNumber = repeats + warmups;
        for (let r: IntNumber = 0; r < total; r++) {
            if (gc)
                java.lang.System.gc();

            const usedMemStart = runtime.totalMemory() - runtime.freeMemory();
            const start: number = Number(java.lang.System.nanoTime());
            this.run(warmups !== 0);

            if (warmups === 0) {
                this.totalTime += Number(java.lang.System.nanoTime()) - start;
                this.totalMemory += runtime.totalMemory() - runtime.freeMemory() - usedMemStart;
            } else {
                warmups--;
            }
        }
    }


    public print(): Performance {
        java.lang.System.out.print(S`: ${this.df.format(this.getCycleTimeMS())}ms/run, `);
        java.lang.System.out.print(S`${this.df.format(this.totalMemory / this.repeats / 1024.0)} kb/run`);
        return this;
    }

    public printCSV(finalComma: boolean): Performance {
        java.lang.System.out.print(S`${this.name}, ${this.df.format(this.getCycleTimeMS())}, `);
        java.lang.System.out.print(this.df.format(this.totalMemory / this.repeats / 1024.0));
        if (finalComma)
            java.lang.System.out.print(S`, `);
        return this;
    }

    public abstract init(): void;

    public abstract run(warmup: boolean): void;

    public getCycleTimeMS(): DoubleNumber {
        return this.totalTime / this.repeats / 1000000.0;
    }
}
