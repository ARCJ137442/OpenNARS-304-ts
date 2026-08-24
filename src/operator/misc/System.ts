//! Java source: opennars/operator/misc/System.java
import { execFileSync } from "node:child_process";
import { java } from "jree";
import { FunctionOperator } from "../FunctionOperator.ts";
import type { Memory } from "../../storage/Memory.ts";
import { Term } from "../../language/Term.ts";



/**
 * Count the number of elements in a set
 */
export class System extends FunctionOperator {

    public constructor() {
        super(new java.lang.String("^system"));
    }

    protected function(_memory: Memory, x: Term[]): Term {
        let cmd = "";
        for (let i = 0; i < x.length; ++i) {
            cmd += String(x[i].name()) + " ";
        }
        let ret = "";
        try {
            const output = execFileSync("bash", ["-c", cmd], { encoding: "utf8" });
            ret = output.split(/\r?\n/).join("");
        } catch {
            // Java catches Exception here and returns an empty Term.
        }
        return new Term(new java.lang.String(ret));
    }

    protected getRange(): Term {
        return Term.get(new java.lang.String("system_called"));
    }

}
