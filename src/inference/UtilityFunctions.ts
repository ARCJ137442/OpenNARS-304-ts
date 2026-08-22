//! Java source: opennars/inference/UtilityFunctions.java
import { java, JavaObject, type double, type float } from "jree";
import { Parameters } from "../main/Parameters.ts";

/**
 * Common functions on real numbers, mostly in [0,1].
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class UtilityFunctions extends JavaObject {

    private static float(value: number): float {
        return Math.fround(value) as float;
    }

    /**
     * A function where the output is conjunctively determined by the inputs
     *
     * @param arr The inputs, each in [0, 1]
     * @return The output that is no larger than each input
     */
    public static and(...arr: double[]): double {
        let product: float = 1;
        for (let f of arr) {
            product = UtilityFunctions.float(product * f);
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
            product = UtilityFunctions.float(product * UtilityFunctions.float(1 - f));
        }
        return UtilityFunctions.float(1 - product);
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
            sum = UtilityFunctions.float(sum + f);
        }
        return UtilityFunctions.float(sum / arr.length);
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
            product = UtilityFunctions.float(product * f);
        }

        if (arr.length === 2) {
            return UtilityFunctions.float(Math.sqrt(UtilityFunctions.float(arr[0] * arr[1])));
        }
        return UtilityFunctions.float(Math.pow(product, 1.00 / arr.length));
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
