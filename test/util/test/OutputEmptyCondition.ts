import { java } from "../../../src/runtime/native-runtime.ts";
import { Nar } from "../../../src/main/Nar.ts";
import { OutputHandler } from "../../../src/io/events/OutputHandler.ts";
import { OutputCondition } from "./OutputCondition.ts";
import type { ClassTokenLike } from "../../../src/runtime/RuntimeClass.ts";

const OUT = OutputHandler.OUT;
const ERR = OutputHandler.ERR;



/**
 *
 * @author me
 */
export class OutputEmptyCondition extends OutputCondition {
    protected readonly output: java.util.List<java.lang.String> = new java.util.LinkedList<java.lang.String>();

    public constructor(nar: Nar) {
        super(nar);
        this.succeeded = true;
    }

    public getFalseReason(): java.lang.String {
        return new java.lang.String(`FAIL: output exists but should not: ${String(this.output)}`);
    }

    public condition(channel: ClassTokenLike, signal: java.lang.Object): boolean {
        // any OUT or ERR output is a failure
        if ((channel === OUT.class) || (channel === ERR.class)) {
            this.output.add(new java.lang.String(`${String(channel.getSimpleName())}: ${String(signal.toString())}`));
            this.succeeded = false;
            return false;
        }
        return false;
    }

}

OutputCondition.registerOutputEmptyFactory((nar) => new OutputEmptyCondition(nar));
