import { java, type long, S } from "jree";



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

    public static interval(/* final */  i: java.lang.String | null): Interval | null {
        return new Interval(java.lang.Long.parseLong(i.substring(1)));
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
    public constructor(/* final */  time: long);

    public constructor(/* final */  i: java.lang.String | null);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [time] = args as [long];


                super();
                this.time = time;
                java.lang.Thread.setName(Symbols.INTERVAL_PREFIX + java.lang.String.valueOf(time));


                break;
            }

            case 1: {
                const [i] = args as [java.lang.String];


                this(java.lang.Long.parseLong(i.substring(1)) - 1);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public clone(): Interval | null {
        // can return this as its own clone since it's immutable.
        // originally: return new Interval(magnitude, true);
        return this;
    }
}
