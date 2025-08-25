


import { java, JavaObject, type int, type double } from "jree";



/**
 * Report the distribution of the bag
 */
export class DistributorAnalyzer extends JavaObject {

    public testDistributorProbabilities(): void {

        let levels: int = 20;
        let d: Distributor = new Distributor(levels);
        let count: Int32Array = new Int32Array(levels);

        let total: double = 0;
        for (let x of d.order) {
            count[x]++;
            total++;
        }

        let probability: java.util.List<java.lang.Double> = new java.util.ArrayList(levels);
        for (let i: int = 0; i < levels; i++) {
            probability.add(count[i] / total);
        }

        let probabilityActiveAdjusted: java.util.List<java.lang.Double> = new java.util.ArrayList(levels);
        let activeIncrease: double = 0.009;
        let dormantDecrease: double = ((0.1 * levels) * activeIncrease) / ((1.0 - 0.1) * levels);
        for (let i: int = 0; i < levels; i++) {
            let p: double = count[i] / total;
            let pd: double = i < ((1.0 - 0.1) * levels) ? -dormantDecrease : activeIncrease;

            p += pd;

            probabilityActiveAdjusted.add(p);
            java.lang.System.out.println((i / (levels as double)) + "\t" + p);
        }
        // System.out.println(probabilityActiveAdjusted);

    }

}
