import { java, JavaObject, type int, type double, S } from "jree";



export abstract class Performance extends JavaObject {
    public readonly repeats: int;
    protected readonly name: java.lang.String;
    private totalTime: number = 0;
    private totalMemory: number = 0;
    protected readonly df: java.text.DecimalFormat = new java.text.DecimalFormat("#.###");

    public constructor(name: java.lang.String, repeats: int, warmups: int);

    public constructor(name: java.lang.String, repeats: int, warmups: int, gc: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                const [name, repeats, warmups] = args as [java.lang.String, int, int];


                this(name, repeats, warmups, true);


                break;
            }

            case 4: {
                const [name, repeats, warmups, gc] = args as [java.lang.String, int, int, boolean];


                super();
                this.repeats = repeats;
                this.name = name;

                this.init();

                this.totalTime = 0;
                this.totalMemory = 0;

                let total: int = repeats + warmups;
                for (let r: int = 0; r < total; r++) {

                    if (gc) {
                        java.lang.System.gc();
                    }

                    let usedMemStart: number = Number(java.lang.Runtime.getRuntime().totalMemory()) - Number(java.lang.Runtime.getRuntime().freeMemory());

                    let start: number = Number(java.lang.System.nanoTime());

                    this.run(warmups !== 0);

                    if (warmups === 0) {
                        this.totalTime += Number(java.lang.System.nanoTime()) - start;
                        this.totalMemory += Number(java.lang.Runtime.getRuntime().totalMemory())
                            - Number(java.lang.Runtime.getRuntime().freeMemory()) - usedMemStart;
                    } else
                        warmups--;
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public print(): Performance {
        java.lang.System.out.print(": " + this.df.format(this.getCycleTimeMS()) + "ms/run, ");
        java.lang.System.out.print(this.df.format(this.totalMemory / this.repeats / 1024.0) + " kb/run");
        return this;
    }

    public printCSV(finalComma: boolean): Performance {
        java.lang.System.out.print(this.name + ", " + this.df.format(this.getCycleTimeMS()) + ", ");
        java.lang.System.out.print(this.df.format(this.totalMemory / this.repeats / 1024.0));
        if (finalComma)
            java.lang.System.out.print(",");
        return this;
    }

    public abstract init(): void;

    public abstract run(warmup: boolean): void;

    public getCycleTimeMS(): double {
        return this.totalTime / this.repeats / 1000000.0;
    }
}
