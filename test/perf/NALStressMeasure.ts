import { java, JavaObject, type double, type int, type long, type float } from "jree";



/**
 * tests performance of NAL, but can also uncover bugs when NAL runs with a
 * heavy and long load
 * useful for examining with a profiler.
 */
export class NALStressMeasure extends JavaObject {
    public static perfNAL(n: Reasoner, path: java.lang.String, extraCycles: int, repeats: int,
        warmups: int, gc: boolean): double {

        let example: java.lang.String = NALTest.getExample(path);

        let p: Performance = new class extends Performance {
            protected totalCycles: long;

            public init(): void {
                java.lang.System.out.print(java.lang.Enum.name + ": ");
                this.totalCycles = 0;
            }

            public run(warmup: boolean): void {
                n.reset();
                n.addInput(example);
                n.cycles(1);
                n.cycles(extraCycles);

                this.totalCycles += n.time();
            }

            public print(): Performance {
                super.print();
                java.lang.System.out.print(", " + df.format(getCycleTimeMS() / this.totalCycles * 1000.0) + " uS/cycle, "
                    + ((this.totalCycles as float) / (warmups + repeats)) + " cycles/run");
                return this;

            }

            public printCSV(finalComma: boolean): Performance {
                super.printCSV(true);
                java.lang.System.out.print(df.format(getCycleTimeMS() / this.totalCycles * 1000.0) + ", "
                    + ((this.totalCycles as float) / (warmups + repeats)));
                if (finalComma)
                    java.lang.System.out.print(", ");
                return this;

            }

        }(path, repeats, warmups, gc);
        p.print();
        java.lang.System.out.println();

        /*
         * p.printCSV(false);
         * System.out.println();
         */

        return p.getCycleTimeMS();

    }

    public static test(n: Reasoner): void {
        let repeats: int = 1;
        let warmups: int = 0;
        let extraCycles: int = 5000;

        let c: java.util.Collection<unknown> = NALTest.params();
        let totalTime: double = 0;
        for (let o of c) {
            let examplePath: java.lang.String = (o as java.lang.Object[])[0] as java.lang.String;
            totalTime += NALStressMeasure.perfNAL(n, examplePath, extraCycles, repeats, warmups, true);
        }
        java.lang.System.out.println("\n\nTotal mean runtime (ms): " + totalTime);
    }

    public static main(args: java.lang.String[]): void {
        let nd: Reasoner = new Nar();
        NALStressMeasure.test(nd);
    }
}
