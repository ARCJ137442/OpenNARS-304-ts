//! Java source: opennars/main/Shell.java
import { java, JavaObject, type int } from "jree";
import { Nar } from "./Nar.ts";
import { NarNode } from "./NarNode.ts";
import { Term } from "../language/Term.ts";
import { Debug } from "./Debug.ts";
import { TextOutputHandler } from "../io/events/TextOutputHandler.ts";
import { InterruptedExceptionCompat, ThreadCompat } from "../runtime/ThreadCompat.ts";



/**
 * Run Reasoner inside a command line application for batch processing
 */
/* TODO check duplicated code with {@link org.opennars.main.Nar} */
// Manage the internal working thread. Communicate with Reasoner only.
export class Shell extends JavaObject {

    private readonly nar: Nar;
    private out: java.io.PrintStream = java.lang.System.out;

    public static createNar(args: java.lang.String[]): Nar {
        let nar: Nar = null;
        let id: java.lang.Integer = null;
        if (!args[1].toLowerCase().equals("null")) {
            id = java.lang.Integer.parseInt(args[1]);
        }

        if (args[0].toLowerCase().equals("null")) {
            if (id === null) {
                nar = new Nar();
            } else {
                nar = new Nar(id);
            }
        } else if (args[0].endsWith(".xml")) {
            if (id === null) {
                nar = new Nar(args[0]);
            } else {
                nar = new Nar(id, args[0]);
            }
        } else {
            if (id !== null) {
                java.lang.System.out.println(
                    "Identity of loaded nar can not be changed, set idOrNull to null if Nar from file should be used!");
                java.lang.System.exit(1);
            }
            nar = Nar.LoadFromFile(args[0]);
        }
        return nar;
    }

    public static argInfo(): void {
        java.lang.System.out.println(
            "expected arguments: none, or: narOrConfigFileOrNull idOrNull nalFileOrNull cyclesToRunOrNull");
        java.lang.System.out.println("or for UDP networking support:");
        // args length check, it has to be 5+5*k, with k in N0
        java.lang.System.out.println(
            "narOrConfigFileOrNull idOrNull nalFileOrNull cyclesToRunOrNull listenPort targetIP1 targetPort1 prioThres1 mustContainTermOrNull1 sendInput1 ... targetIPN targetPortN prioThresN mustContainTermOrNullN sendInputN");
        java.lang.System.out.println(
            "Here, OrNull means they can be null too, example: null null null null 64001 127.0.0.1 64002 0.5 null True");
    }

    /**
     * logging
     *
     */
    protected static log(message: java.lang.String): void {
        // l for log
        java.lang.System.out.println("[l]: " + message);
    }

    /**
     * The entry point of the standalone application.
     *
     * @param args command line arguments
     */
    public static main(args: java.lang.String[]): void {
        if (args.length === 0) { // in that case just run the instance
            args = ["null", "null", "null", "null"];
        }
        if (args.length !== 4 && ((args.length - 5) % 5 !== 0 || args.length < 5)) { // args length check
            Shell.argInfo();
            java.lang.System.exit(0);
        }

        Shell.log("creating Nar with args [" + java.lang.String.join(", ", args) + "] ...");
        let nar: Nar = Shell.createNar(args);

        if (args.length > 4) {
            Shell.log("attaching NarNode networking features to Nar...");
            let nar1port: int = java.lang.Integer.parseInt(args[4]);
            let nar1: NarNode = new NarNode(nar, nar1port);
            for (let i: int = 5; i < args.length; i += 5) {
                let T: Term = args[i + 3].toLowerCase().equals("null") ? null : new Term(java.lang.String.valueOf(args[i + 3]));
                nar1.addRedirectionTo(args[i], java.lang.Integer.parseInt(args[i + 1]), Math.fround(Number.parseFloat(String(args[i + 2]))), T,
                    java.lang.Boolean.parseBoolean(args[i + 4]));
            }
        }

        Shell.log("attaching Shell to Nar...");
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
                        let line: java.lang.String = this.bufIn.readLine();
                        if (line !== null) {
                            try {
                                this.nar.addInput(line);
                            } catch (ex) {
                                if (ex instanceof java.lang.Exception) {
                                    if (Debug.DETAILED) {
                                        java.lang.System.out.println("ERROR: error parsing:" + line);
                                        ex.printStackTrace();
                                    } else
                                        java.lang.System.out.println("ERROR: parsing error");
                                } else {
                                    throw ex;
                                }
                            }
                        }

                    } catch (e) {
                        if (e instanceof java.io.IOException) {
                            throw new java.lang.IllegalStateException("ERROR: Could not read line.", e);
                        } else {
                            throw e;
                        }
                    }

                    try {
                        ThreadCompat.sleep(1);
                    } catch (e) {
                        if (e instanceof InterruptedExceptionCompat) {
                            throw new java.lang.IllegalStateException("ERROR: Unexpectedly interrupted while sleeping.", e);
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

        let hasInputFile: boolean = !args[2].toLowerCase().equals("null");
        let hasNumberOfSteps: boolean = !args[3].toLowerCase().equals("null");

        if (hasInputFile) {
            this.nar.addInputFile(args[2]);
        }
        it = new this.InputThread(java.lang.System.in, this.nar);
        it.start();

        let numberOfSteps: int = hasNumberOfSteps ? java.lang.Integer.parseInt(args[3]) : -1;

        if (hasNumberOfSteps) {
            this.nar.cycles(numberOfSteps);
            java.lang.System.exit(0);
        } else {
            this.nar.start(-1); // 现在使用「-1」默认关闭「自动步进」功能
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


