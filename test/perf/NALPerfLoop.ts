import { java, JavaObject, type int } from "jree";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";
import type { Reasoner } from "../../src/interfaces/pub/Reasoner.ts";
import { NALTest } from "../core/NALTest.ts";
import { NALStressMeasure } from "./NALStressMeasure.ts";

const perfNAL = NALStressMeasure.perfNAL;



/**
 * Runs NALTestPerf continuously, for profiling
 */
export class NALPerfLoop extends JavaObject {

    public static main(args: java.lang.String[]): void {

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
