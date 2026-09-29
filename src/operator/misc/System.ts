//! Java source: opennars/operator/misc/System.java
import { FunctionOperator } from "../FunctionOperator.ts";
import type { Memory } from "../../storage/Memory.ts";
import { Term } from "../../language/Term.ts";
import { toJavaString } from "../../runtime/java-text.ts";
import { MissingRuntimeCapabilityError, type RuntimeCapabilities } from "../../platform/RuntimeCapabilities.ts";



/**
 * Count the number of elements in a set
 */
export class System extends FunctionOperator {
    private readonly executeSystemCommand: RuntimeCapabilities["executeSystemCommand"];

    public constructor(capabilities?: RuntimeCapabilities) {
        super("^system");
        this.executeSystemCommand = capabilities?.executeSystemCommand;
    }

    protected function(_memory: Memory, x: Term[]): Term {
        let cmd = "";
        for (let i = 0; i < x.length; ++i) {
            cmd += String(x[i].name()) + " ";
        }
        let ret = "";
        if (this.executeSystemCommand === undefined) {
            throw new MissingRuntimeCapabilityError("executeSystemCommand");
        }
        try {
            ret = this.executeSystemCommand(cmd).split(/\r?\n/).join("");
        } catch {
            // Java catches Exception here and returns an empty Term.
        }
        return new Term(toJavaString(ret));
    }

    protected getRange(): Term {
        return Term.get(toJavaString("system_called"));
    }

}
