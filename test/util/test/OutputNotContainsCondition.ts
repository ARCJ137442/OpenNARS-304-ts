import { java } from "jree";



/**
 *
 * @author me
 */
export class OutputNotContainsCondition extends OutputContainsCondition {

    public constructor(nar: Nar, containing: java.lang.String) {
        super(nar, containing, -1);
        succeeded = true;
    }

    public getFalseReason(): java.lang.String {
        return "incorrect output: " + containing;
    }

    public condition(channel: java.lang.Class<unknown>, signal: java.lang.Object): boolean {
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

    protected onFailure(channel: java.lang.Class<unknown>, signal: java.lang.Object): void {
    }

}
