


import { java } from "jree";



/**
 *
 * @author me
 */
export class OutputNotContainsCondition extends OutputContainsCondition {

    public constructor(/* final */  nar: Nar | null, /* final */  containing: java.lang.String | null) {
        super(nar, containing, -1);
        succeeded = true;
    }

    public getFalseReason(): java.lang.String | null {
        return "incorrect output: " + containing;
    }

    public condition(/* final */  channel: java.lang.Class<unknown> | null, /* final */  signal: java.lang.Object | null): boolean {
        if (!succeeded) {
            return false;
        }
        if (cond(channel, signal)) {
            this.onFailure(channel, signal);
            succeeded = false;
            return false;
        }
        return true;
    }

    public isInverse(): boolean {
        return true;
    }

    protected onFailure(/* final */  channel: java.lang.Class<unknown> | null, /* final */  signal: java.lang.Object | null): void {
    }

}
