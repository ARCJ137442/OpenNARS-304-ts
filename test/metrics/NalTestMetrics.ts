import { java, JavaObject, type DoubleNumber, type IntNumber } from "../support/legacy-runtime-facade.ts";
import { JavaDoubleCompat } from "../support/legacy-runtime-facade.ts";
import { NALTest } from "../core/NALTest.ts";



/**
 * Computes the metrics of NAL-tests.
 *
 * Metrics are numeric values which indicate how fast NARS could solve problems
 */
export class NalTestMetrics extends JavaObject {
    public static computeMetric(scores: java.util.Map<java.lang.String, java.util.List<DoubleNumber>>): DoubleNumber {
        let metric: DoubleNumber = 0;

        // compute median of (valid) samples
        for (let iValues of scores.values()) {
            // remove infinities because they indicate failed tests and would mess up the
            // metric
            let valuesWithoutInfinities: java.util.List<DoubleNumber> = NalTestMetrics.removeInfinities(iValues);

            let medianOfThisTest: DoubleNumber = NalTestMetrics.calcMedian(valuesWithoutInfinities);

            metric += medianOfThisTest;
        }

        // average of all medians should be fine
        metric /= scores.values().size();

        return metric;
    }

    // helper
    public static removeInfinities(values: java.util.List<DoubleNumber>): java.util.List<DoubleNumber> {
        let result: java.util.List<DoubleNumber> = new java.util.ArrayList<DoubleNumber>();

        for (let iValue of values) {
            if (iValue !== Number.POSITIVE_INFINITY) {
                result.add(iValue);
            }
        }

        return result;
    }

    // helper
    public static calcMedian(values: java.util.List<DoubleNumber>): DoubleNumber {
        return values.get(values.size() / 2);
    }

    public static main(args: java.lang.String[]): void {
        // number of samples was guessed and not computed with probability theory
        // TODO< maybe we need to compute it with probability theory to make sure that
        // we test enough and not to much for a given error margin >
        let numberOfSamples: IntNumber = 50;

        // we are only in multistep problems interested
        NALTest.directories = [
            new java.lang.String("/nal/multi_step/"),
            new java.lang.String("/nal/application/"),
        ];
        NALTest.numberOfSamples = numberOfSamples;

        NALTest.runTests(NALTest.class);

        let metric: DoubleNumber = NalTestMetrics.computeMetric(NALTest.scores);
        java.lang.System.out.println("metric=" + JavaDoubleCompat.toString(metric));
        let debugHere: IntNumber = 5;
    }
}
