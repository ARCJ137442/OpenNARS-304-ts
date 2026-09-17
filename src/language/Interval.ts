//! Java source: opennars/language/Interval.java
import { java, S } from "jree";
import type { long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";



/**
 * This stores the magnitude of a time difference, which is the logarithm of the
 * time difference
 * in base D=duration ( @see Param.java ). The actual printed value is +1 more
 * than the stored
 * magnitude, so for example, it will have name() "+1" if magnitude=0, and "+2"
 * if magnitude=1.
 *
 * @author Pei Wang
 * @author Patrick Hammer
 */
export class Interval extends Term {

    public static interval(i: java.lang.String): Interval {
        return new Interval(java.lang.Long.parseLong(new java.lang.String(String(i).substring(1))) as unknown as long);
    }

    public hasInterval(): boolean {
        return true;
    }

    public readonly time: long;

    /**
     * this constructor has an extra unused argument to differentiate it from the
     * other one,
     * for specifying magnitude directly.
     */
    public constructor(time: long);

    public constructor(i: java.lang.String);
    public constructor(...args: unknown[]) {
        if (args.length !== 1) {
            throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
        }
        const value = args[0] as long | java.lang.String;
        super();
        const hasStringOperations = typeof (value as { substring?: unknown } | null)?.substring === "function";
        const time = hasStringOperations
            ? Number(java.lang.Long.parseLong((value as java.lang.String).substring(1))) - 1
            : Number(value);
        this.time = time as unknown as long;
        this.setName(new java.lang.String(String(Symbols.INTERVAL_PREFIX) + String(time)));
    }


    public clone(): Interval {
        // can return this as its own clone since it's immutable.
        // originally: return new Interval(magnitude, true);
        return this;
    }
}
