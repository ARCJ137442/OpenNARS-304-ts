//! Java source: opennars/main/Shell.java
import { java, JavaObject, S, type int } from "jree";
import { readFileSync } from "node:fs";
import { Nar } from "./Nar.ts";
import { NarNode } from "./NarNode.ts";
import { Term } from "../language/Term.ts";
import { Debug } from "./Debug.ts";
import { TextOutputHandler } from "../io/events/TextOutputHandler.ts";
import { InterruptedExceptionCompat, ThreadCompat } from "../runtime/ThreadCompat.ts";
import { javaSystemExit } from "../runtime/jree-compat.ts";
import { NodeStdinInputStream } from "../runtime/NodeStdinInputStream.ts";



/**
 * Run Reasoner inside a command line application for batch processing
 */
/* TODO check duplicated code with {@link org.opennars.main.Nar} */
// Manage the internal working thread. Communicate with Reasoner only.
export class Shell extends JavaObject {

    private readonly nar: Nar;
    private out: java.io.PrintStream = java.lang.System.out;

    public static createNar(args: java.lang.String[]): Nar {
        let nar: Nar | null = null;
        let id: number | null = null;
        const narPath = String(args[0]);
        const idText = String(args[1]);
        if (idText.toLowerCase() !== "null") {
            id = java.lang.Integer.parseInt(idText);
        }

        if (narPath.toLowerCase() === "null") {
            if (id === null) {
                nar = new Nar();
            } else {
                nar = new Nar(BigInt(id));
            }
        } else if (narPath.endsWith(".xml")) {
            const configText = readFileSync(narPath, "utf8");
            if (id === null) {
                nar = new Nar({ configText, configSource: narPath });
            } else {
                nar = new Nar({ narId: BigInt(id), configText, configSource: narPath });
            }
        } else {
            if (id !== null) {
                java.lang.System.out.println(
                    S`Identity of loaded nar can not be changed, set idOrNull to null if Nar from file should be used!`);
                javaSystemExit(1);
            }
            nar = Nar.LoadFromFile(S`${narPath}`);
        }
        if (nar === null) {
            throw new java.lang.IllegalStateException(S`Unable to create Nar from the supplied arguments`);
        }
        return nar;
    }

    public static argInfo(): void {
        java.lang.System.out.println(
            S`expected arguments: none, or: narOrConfigFileOrNull idOrNull nalFileOrNull cyclesToRunOrNull`);
        java.lang.System.out.println(S`or for UDP networking support:`);
        // args length check, it has to be 5+5*k, with k in N0
        java.lang.System.out.println(
            S`narOrConfigFileOrNull idOrNull nalFileOrNull cyclesToRunOrNull listenPort targetIP1 targetPort1 prioThres1 mustContainTermOrNull1 sendInput1 ... targetIPN targetPortN prioThresN mustContainTermOrNullN sendInputN`);
        java.lang.System.out.println(
            S`Here, OrNull means they can be null too, example: null null null null 64001 127.0.0.1 64002 0.5 null True`);
    }

    /**
     * logging
     *
     */
    protected static log(message: java.lang.String): void {
        // l for log
        java.lang.System.out.println(S`[l]: ${message}`);
    }

    /**
     * The entry point of the standalone application.
     *
     * @param args command line arguments
     */
    public static main(args: java.lang.String[]): void {
        if (args.length === 0) { // in that case just run the instance
            args = [S`null`, S`null`, S`null`, S`null`];
        }
        if (args.length !== 4 && ((args.length - 5) % 5 !== 0 || args.length < 5)) { // args length check
            Shell.argInfo();
            javaSystemExit(0);
        }

        const argList = args.map((arg) => String(arg)).join(", ");
        Shell.log(S`creating Nar with args [${argList}] ...`);
        let nar: Nar = Shell.createNar(args);

        if (args.length > 4) {
            Shell.log(S`attaching NarNode networking features to Nar...`);
            let nar1port: int = java.lang.Integer.parseInt(String(args[4]));
            let nar1: NarNode = new NarNode(nar, nar1port);
            for (let i: int = 5; i < args.length; i += 5) {
                let T: Term | null = String(args[i + 3]).toLowerCase() === "null"
                    ? null
                    : new Term(java.lang.String.valueOf(args[i + 3]));
                nar1.addRedirectionTo(args[i], java.lang.Integer.parseInt(String(args[i + 1])), Math.fround(Number.parseFloat(String(args[i + 2]))), T,
                    java.lang.Boolean.parseBoolean(java.lang.String.valueOf(args[i + 4])));
            }
        }

        Shell.log(S`attaching Shell to Nar...`);
        new Shell(nar).run(args);
    }

    public constructor(n: Nar) {
        super();
        this.nar = n;
    }

    public InputThread = (($outer) => {
        return class InputThread extends ThreadCompat {
            private readonly bufIn: java.io.BufferedReader;
            protected readonly nar: Nar;

            public constructor(input: java.io.InputStream, nar: Nar) {
                super();
                this.bufIn = new java.io.BufferedReader(new java.io.InputStreamReader(input));
                this.nar = nar;
            }

            public override  run(): void {
                while (true) {
                    try {
                        let line: java.lang.String | null = this.bufIn.readLine();
                        if (line !== null) {
                            try {
                                this.nar.addInput(line);
                            } catch (ex) {
                                if (ex instanceof java.lang.Exception) {
                                    if (Debug.DETAILED) {
                                        java.lang.System.out.println(S`ERROR: error parsing:${line}`);
                                        ex.printStackTrace();
                                    } else
                                    java.lang.System.out.println(S`ERROR: parsing error`);
                                } else {
                                    throw ex;
                                }
                            }
                        }

                    } catch (e) {
                        if (e instanceof java.io.IOException) {
                            throw new java.lang.IllegalStateException(S`ERROR: Could not read line.`, e);
                        } else {
                            throw e;
                        }
                    }

                    try {
                        ThreadCompat.sleep(1);
                    } catch (e) {
                        if (e instanceof InterruptedExceptionCompat) {
                            // The translated Java Shell still exposes a jree Throwable cause;
                            // keep that compatibility boundary local to the legacy entry point.
                            throw new java.lang.IllegalStateException(
                                S`ERROR: Unexpectedly interrupted while sleeping.`,
                                e as unknown as java.lang.Throwable);
                        } else {
                            throw e;
                        }
                    }
                }
            }
        }
    })(this);


    /**
     * non-static equivalent to {@link #main(String[])} : finish to completion from
     * an addInput file
     */
    public run(args: java.lang.String[]): void {
        let output: TextOutputHandler = new TextOutputHandler(this.nar, new java.io.PrintWriter(this.out, true));
        output.setErrors(true);
        output.setErrorStackTrace(true);
        let it: Shell.InputThread;

        let hasInputFile: boolean = String(args[2]).toLowerCase() !== "null";
        let hasNumberOfSteps: boolean = String(args[3]).toLowerCase() !== "null";

        if (hasInputFile) {
            this.nar.addInputText(readFileSync(String(args[2]), "utf8"));
        }
        it = new this.InputThread(new NodeStdinInputStream(), this.nar);
        it.start();

        let numberOfSteps: int = hasNumberOfSteps ? java.lang.Integer.parseInt(String(args[3])) : -1;

        if (hasNumberOfSteps) {
            this.nar.cycles(numberOfSteps);
            javaSystemExit(0);
        } else {
            this.nar.start(-1n); // 现在使用「-1」默认关闭「自动步进」功能
        }
    }

    public setPrintStream(out: java.io.PrintStream): void {
        this.out = out;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Shell {
    export type InputThread = InstanceType<Shell["InputThread"]>;
}


