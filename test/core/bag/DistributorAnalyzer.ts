import { java, JavaObject, type IntNumber, type DoubleNumber } from "../../support/legacy-runtime-facade.ts";
import { Distributor } from "../../../src/storage/Distributor.ts";



/**
 * Report the distribution of the bag
 */
export class DistributorAnalyzer extends JavaObject {

    public testDistributorProbabilities(): void {

        let levels: IntNumber = 20;
        let d: Distributor = new Distributor(levels);
        let count: Int32Array = new Int32Array(levels);

        let total: DoubleNumber = 0;
        for (let x of d.order) {
            count[x]++;
            total++;
        }

        let probability: java.util.List<DoubleNumber> = new java.util.ArrayList<DoubleNumber>(levels);
        for (let i: IntNumber = 0; i < levels; i++) {
            probability.add(count[i] / total);
        }

        let probabilityActiveAdjusted: java.util.List<DoubleNumber> = new java.util.ArrayList<DoubleNumber>(levels);
        let activeIncrease: DoubleNumber = 0.009;
        let dormantDecrease: DoubleNumber = ((0.1 * levels) * activeIncrease) / ((1.0 - 0.1) * levels);
        for (let i: IntNumber = 0; i < levels; i++) {
            let p: DoubleNumber = count[i] / total;
            let pd: DoubleNumber = i < ((1.0 - 0.1) * levels) ? -dormantDecrease : activeIncrease;

            p += pd;

            probabilityActiveAdjusted.add(p);
            java.lang.System.out.println((i / (levels as DoubleNumber)) + "\t" + p);
        }
        // System.out.println(probabilityActiveAdjusted);

    }

}
