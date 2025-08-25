import { java } from "jree";



/**
 *
 * @author me
 */
export class OutputEmptyCondition extends OutputCondition {
    protected readonly output: java.util.List<java.lang.String> = new java.util.LinkedList();

    public constructor(/* final */  nar: Nar) {
        super(nar);
        succeeded = true;
    }

    public getFalseReason(): java.lang.String {
        return "FAIL: output exists but should not: " + this.output;
    }

    public condition(/* final */  channel: java.lang.Class<unknown>, /* final */  signal: java.lang.Object): boolean {
        // any OUT or ERR output is a failure
        if ((channel === OUT.class) || (channel === ERR.class)) {
            this.output.add(channel.getSimpleName() + ": " + signal.toString());
            succeeded = false;
            return false;
        }
        return false;
    }

}
