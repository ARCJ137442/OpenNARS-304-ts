import { java, JavaObject, type int } from "jree";



/**
 * Runs NALTestPerf continuously, for profiling
 */
export class NALPerfLoop extends JavaObject {

    public static main(/* final */  args: java.lang.String[] | null): void {

        let repeats: int = 2;
        let warmups: int = 1;
        let extraCycles: int = 2048;
        let randomExtraCycles: int = 512;

        let n: Reasoner = new Nar();

        let c: java.util.Collection<unknown> = NALTest.params();
        while (true) {
            for (let o of c) {
                let examplePath: java.lang.String = (o as java.lang.Object[])[0] as java.lang.String;
                Debug.DETAILED = false;

                perfNAL(n, examplePath, extraCycles + (java.lang.Math.random() * randomExtraCycles) as int, repeats, warmups,
                    true);
            }
        }
    }
}
