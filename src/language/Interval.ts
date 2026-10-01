//! Java source: opennars/language/Interval.java
import type { long } from "../types.ts"; // Java primitive aliases formerly imported from jree; runtime narrowing is separate.
import { Term } from "./Term.ts";
import { Symbols } from "../io/Symbols.ts";
import { asText, type TextInput } from "../runtime/Text.ts";
import { ReasonerInputError } from "../runtime/ReasonerErrors.ts";



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

    public static interval(i: TextInput): Interval {
        return new Interval(Number.parseInt(String(i).slice(1), 10) as unknown as long);
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

    public constructor(i: TextInput);
    public constructor(...args: unknown[]) {
        if (args.length !== 1) {
            throw new ReasonerInputError("Invalid number of arguments");
        }
        const value = args[0] as long | TextInput;
        super();
        const isString = typeof value === "string" || typeof value === "object";
        const time = isString ? Number.parseInt(String(value).slice(1), 10) - 1 : Number(value);
        this.time = time as unknown as long;
        this.setName(asText(`${Symbols.INTERVAL_PREFIX}${time}`));
    }


    public clone(): Interval {
        // can return this as its own clone since it's immutable.
        // originally: return new Interval(magnitude, true);
        return this;
    }
}
