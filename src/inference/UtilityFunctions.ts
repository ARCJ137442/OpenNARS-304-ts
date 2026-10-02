//! Java source: opennars/inference/UtilityFunctions.java
import { Parameters } from "../main/Parameters.ts";

/**
 * Common functions on real numbers, mostly in [0,1].
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class UtilityFunctions {

    private static FloatNumber(value: number): number {
        return Math.fround(value);
    }

    /**
     * A function where the output is conjunctively determined by the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The output that is no larger than each input
     */
    public static and(...arr: number[]): number {
        let product: number = 1;
        for (let f of arr) {
            product = UtilityFunctions.FloatNumber(product * f);
        }
        return product;
    }

    /**
     * A function where the output is disjunctively determined by the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The output that is no smaller than each input
     */
    public static or(...arr: number[]): number {
        let product: number = 1;
        for (let f of arr) {
            const normalizedFactor = UtilityFunctions.FloatNumber(f);
            product = UtilityFunctions.FloatNumber(product * UtilityFunctions.FloatNumber(1 - normalizedFactor));
        }
        return UtilityFunctions.FloatNumber(1 - product);
    }

    /**
     * A function where the output is the arithmetic average the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The arithmetic average the inputs
     */
    public static aveAri(...arr: number[]): number {
        let sum: number = 0;
        for (let f of arr) {
            sum = UtilityFunctions.FloatNumber(sum + UtilityFunctions.FloatNumber(f));
        }
        return UtilityFunctions.FloatNumber(sum / arr.length);
    }

    /**
     * A function where the output is the geometric average the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The geometric average the inputs
     */
    public static aveGeo(...arr: number[]): number {
        let product: number = 1;
        for (let f of arr) {
            product = UtilityFunctions.FloatNumber(product * UtilityFunctions.FloatNumber(f));
        }

        if (arr.length === 2) {
            return UtilityFunctions.FloatNumber(Math.sqrt(UtilityFunctions.FloatNumber(
                UtilityFunctions.FloatNumber(arr[0]) * UtilityFunctions.FloatNumber(arr[1]),
            )));
        }
        return UtilityFunctions.FloatNumber(Math.pow(product, 1.00 / arr.length));
    }

    /**
     * A function to convert weight to confidence
     *
     * @param w             Weight of evidence, a non-negative real number
     * @param narParameters parameters of the reasoner
     * @return The corresponding confidence, in [0, 1)
     */
    public static w2c(w: number, narParameters: Parameters): number {
        return w / (w + narParameters.HORIZON);
    }

    /**
     * A function to convert confidence to weight
     *
     * @param c             confidence, in [0, 1)
     * @param narParameters parameters of the reasoner
     * @return The corresponding weight of evidence, a non-negative real number
     */
    public static c2w(c: number, narParameters: Parameters): number {
        return narParameters.HORIZON * c / (1 - c);
    }
}
