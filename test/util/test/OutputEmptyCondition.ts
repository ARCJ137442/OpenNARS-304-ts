import { java } from "jree";



/**
 *
 * @author me
 */
export class OutputEmptyCondition extends OutputCondition {
    protected readonly output: java.util.List<java.lang.String> | null = new java.util.LinkedList();

    public constructor(/* final */  nar: Nar | null) {
        super(nar);
        succeeded = true;
    }

    public getFalseReason(): java.lang.String | null {
        return "FAIL: output exists but should not: " + this.output;
    }

    public condition(/* final */  channel: java.lang.Class<unknown> | null, /* final */  signal: java.lang.Object | null): boolean {
        // any OUT or ERR output is a failure
        if ((channel === OUT.class) || (channel === ERR.class)) {
            this.output.add(channel.getSimpleName() + ": " + signal.toString());
            succeeded = false;
            return false;
        }
        return false;
    }

}
