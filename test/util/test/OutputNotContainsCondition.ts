import { java } from "../../../src/runtime/native-runtime.ts";
import { Nar } from "../../../src/main/Nar.ts";
import { OutputContainsCondition } from "./OutputContainsCondition.ts";
import { OutputCondition } from "./OutputCondition.ts";



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
        return new java.lang.String(`incorrect output: ${String(this.containing)}`);
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

OutputCondition.registerOutputNotContainsFactory(
    (nar, containing) => new OutputNotContainsCondition(nar, containing),
);
