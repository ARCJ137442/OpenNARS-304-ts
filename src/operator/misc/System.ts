


import { java, type int } from "jree";



/**
 * Count the number of elements in a set
 */
export class System extends FunctionOperator {

    public constructor() {
        super("^system");
    }

    protected function(/* final */  memory: Memory | null, /* final */  x: Term[] | null): Term | null {
        let cmd: java.lang.String = "";
        for (let i: int = 0; i < x.length; ++i) {
            cmd += x[i].name().toString() + " ";
        }
        let s: java.lang.String;
        let ret: java.lang.String = "";
        let cmds: java.lang.String[] = ["bash", "-c", cmd];
        let r: java.lang.Runtime;
        let p: java.lang.Process;
        try {
            r = java.lang.Runtime.getRuntime();
            p = r.exec(cmds);
            let br: java.io.BufferedReader = new java.io.BufferedReader(
                new java.io.InputStreamReader(p.getInputStream()));
            while ((s = br.readLine()) !== null)
                ret += s;
            // System.out.println("line: " + s);
            p.waitFor();
            // System.out.println ("exit: " + p.exitValue());
            p.destroy();
        } catch (e) {
            if (e instanceof java.lang.Exception) {
            } else {
                throw e;
            }
        }
        return new Term(ret);
    }

    protected getRange(): Term | null {
        return Term.get("system_called");
    }

}
