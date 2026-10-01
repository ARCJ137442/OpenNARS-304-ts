//! Java source: opennars/operator/misc/System.java
import { FunctionOperator } from "../FunctionOperator.ts";
import type { Memory } from "../../storage/Memory.ts";
import { Term } from "../../language/Term.ts";
import { asText } from "../../runtime/Text.ts";
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
        const argumentsText = x.map((term) => String(term.name())).join(" ");
        const cmd = x.length > 0 ? `${argumentsText} ` : "";
        let ret = "";
        if (this.executeSystemCommand === undefined) {
            throw new MissingRuntimeCapabilityError("executeSystemCommand");
        }
        try {
            ret = this.executeSystemCommand(cmd).split(/\r?\n/).join("");
        } catch {
            // Java catches Exception here and returns an empty Term.
        }
        return new Term(asText(ret));
    }

    protected getRange(): Term {
        return Term.get(asText("system_called"));
    }

}
