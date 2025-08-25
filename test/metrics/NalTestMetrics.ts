import { java, JavaObject, type double, type int } from "jree";



/**
 * Computes the metrics of NAL-tests.
 *
 * Metrics are numeric values which indicate how fast NARS could solve problems
 */
export class NalTestMetrics extends JavaObject {
    public static computeMetric(/* final */  scores: java.util.Map<java.lang.String, java.util.List<java.lang.Double>>): double {
        let metric: double = 0;

        // compute median of (valid) samples
        for (let iValues of scores.values()) {
            // remove infinities because they indicate failed tests and would mess up the
            // metric
            let valuesWithoutInfinities: java.util.List<java.lang.Double> = NalTestMetrics.removeInfinities(iValues);

            let medianOfThisTest: double = NalTestMetrics.calcMedian(valuesWithoutInfinities);

            metric += medianOfThisTest;
        }

        // average of all medians should be fine
        metric /= scores.values().size();

        return metric;
    }

    // helper
    public static removeInfinities(/* final */  values: java.util.List<java.lang.Double>): java.util.List<java.lang.Double> {
        let result: java.util.List<java.lang.Double> = new java.util.ArrayList();

        for (let iValue of values) {
            if (iValue !== java.lang.Double.POSITIVE_INFINITY) {
                result.add(iValue);
            }
        }

        return result;
    }

    // helper
    public static calcMedian(/* final */  values: java.util.List<java.lang.Double>): double {
        return values.get(values.size() / 2);
    }

    public static main(args: java.lang.String[]): void {
        // number of samples was guessed and not computed with probability theory
        // TODO< maybe we need to compute it with probability theory to make sure that
        // we test enough and not to much for a given error margin >
        let numberOfSamples: int = 50;

        // we are only in multistep problems interested
        NALTest.directories = ["/nal/multi_step/", "/nal/application/"];
        NALTest.numberOfSamples = numberOfSamples;

        NALTest.runTests(NALTest.class);

        let metric: double = NalTestMetrics.computeMetric(NALTest.scores);
        java.lang.System.out.println("metric=" + java.lang.Double.toString(metric));
        let debugHere: int = 5;
    }
}
