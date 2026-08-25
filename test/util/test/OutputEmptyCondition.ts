import { java } from "jree";
import { Nar } from "../../../src/main/Nar.ts";
import { OutputHandler } from "../../../src/io/events/OutputHandler.ts";
import { OutputCondition } from "./OutputCondition.ts";

const OUT = OutputHandler.OUT;
const ERR = OutputHandler.ERR;



/**
 *
 * @author me
 */
export class OutputEmptyCondition extends OutputCondition {
    protected readonly output: java.util.List<java.lang.String> = new java.util.LinkedList();

    public constructor(nar: Nar) {
        super(nar);
        this.succeeded = true;
    }

    public getFalseReason(): java.lang.String {
        return "FAIL: output exists but should not: " + this.output;
    }

    public condition(channel: java.lang.Class<unknown>, signal: java.lang.Object): boolean {
        // any OUT or ERR output is a failure
        if ((channel === OUT.class) || (channel === ERR.class)) {
            this.output.add(channel.getSimpleName() + ": " + signal.toString());
            this.succeeded = false;
            return false;
        }
        return false;
    }

}

OutputCondition.registerOutputEmptyFactory((nar) => new OutputEmptyCondition(nar));
