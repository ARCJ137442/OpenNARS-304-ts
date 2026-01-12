//! Java source: opennars/inference/UtilityFunctions.java
import { java, JavaObject, type double, type float } from "jree";
import { Parameters } from "../main/Parameters";

/**
 * Common functions on real numbers, mostly in [0,1].
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class UtilityFunctions extends JavaObject {

    /**
     * A function where the output is conjunctively determined by the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The output that is no larger than each input
     */
    public static and(...arr: double[]): double {
        let product: float = 1;
        for (let f of arr) {
            product *= f;
        }
        return product;
    }

    /**
     * A function where the output is disjunctively determined by the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The output that is no smaller than each input
     */
    public static or(...arr: float[]): float {
        let product: float = 1;
        for (let f of arr) {
            product *= (1 - f);
        }
        return 1 - product;
    }

    /**
     * A function where the output is the arithmetic average the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The arithmetic average the inputs
     */
    public static aveAri(...arr: float[]): float {
        let sum: float = 0;
        for (let f of arr) {
            sum += f;
        }
        return sum / arr.length;
    }

    /**
     * A function where the output is the geometric average the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The geometric average the inputs
     */
    public static aveGeo(...arr: float[]): float {
        let product: float = 1;
        for (let f of arr) {
            product *= f;
        }

        if (arr.length === 2) {
            return java.lang.Math.sqrt(arr[0] * arr[1]) as float;
        }
        return java.lang.Math.pow(product, 1.00 / arr.length) as float;
    }

    /**
     * A function to convert weight to confidence
     *
     * @param w             Weight of evidence, a non-negative real number
     * @param narParameters parameters of the reasoner
     * @return The corresponding confidence, in [0, 1)
     */
    public static w2c(w: double, narParameters: Parameters): double {
        return w / (w + narParameters.HORIZON);
    }

    /**
     * A function to convert confidence to weight
     *
     * @param c             confidence, in [0, 1)
     * @param narParameters parameters of the reasoner
     * @return The corresponding weight of evidence, a non-negative real number
     */
    public static c2w(c: double, narParameters: Parameters): double {
        return narParameters.HORIZON * c / (1 - c);
    }
}
