import { java } from "jree";
import { Nar } from "../../../src/main/Nar.ts";
import { OutputContainsCondition } from "./OutputContainsCondition.ts";



/**
 *
 * @author me
 */
export class OutputNotContainsCondition extends OutputContainsCondition {

    public constructor(nar: Nar, containing: java.lang.String) {
        super(nar, containing, -1);
        this.succeeded = true;
    }

    public getFalseReason(): java.lang.String {
        return "incorrect output: " + this.containing;
    }

    public condition(channel: java.lang.Class<unknown>, signal: java.lang.Object): boolean {
        if (!this.succeeded) {
            return false;
        }
        if (this.cond(channel, signal)) {
            this.onFailure(channel, signal);
            this.succeeded = false;
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
