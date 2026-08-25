import { java, JavaObject, type int, type double, type float } from "jree";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";
import { TextOutputHandler } from "../../src/io/events/TextOutputHandler.ts";
import { OutputCondition } from "../util/test/OutputCondition.ts";
import "../util/test/OutputConditionImplementations.ts";
import { ExampleFileInput } from "../util/io/ExampleFileInput.ts";
import { assertTrue } from "../util/junit-assert.ts";
import { NALTest } from "./NALTest.ts";
import { javaStringValue } from "../../src/runtime/jree-compat.ts";



export class StabilityTest extends JavaObject {
    static {
        Debug.DETAILED = false;
        Debug.TEST = true;
    }

    protected readonly minCycles: int = 1550; // TODO reduce this to one or zero to avoid wasting any extra time during tests
    public static showOutput: boolean = false;
    public static saveSimilar: boolean = true;
    public static showSuccess: boolean = false;
    public static readonly showFail: boolean = true;
    public static readonly showReport: boolean = true;
    public static readonly requireSuccess: boolean = true;
    public static readonly similarsToSave: int = 5;
    private static readonly waitForEnterKeyOnStart: boolean = false; // useful for running profiler or some other
    // instrumentation
    protected static readonly examples: java.util.Map<java.lang.String, java.lang.String> = new java.util.LinkedHashMap(); // path -> script data
    public static readonly tests: java.util.Map<java.lang.String, java.lang.Boolean> = new java.util.LinkedHashMap();
    public static readonly scores: java.util.Map<java.lang.String, double> = new java.util.LinkedHashMap();
    protected readonly scriptPath: java.lang.String;

    public static getExample(path: java.lang.String): java.lang.String {
        try {
            let existing: java.lang.String | null = StabilityTest.examples.get(path);
            if (existing !== null)
                return existing;

            existing = ExampleFileInput.load(path);

            StabilityTest.examples.put(path, existing);
            return existing;
        } catch (e) {
            if (e instanceof java.io.IOException) {
                throw new java.lang.IllegalStateException("Could not load path", e);
            } else {
                throw e;
            }
        }
    }

    public newNAR(): Nar {
        return new Nar();
        // return Nar.build(Default.fromJSON("nal/build/pei1.fast.nar"));
        // return new ContinuousBagNARBuilder().build();
        // return new DiscretinuousBagNARBuilder().build();
    }

    public static params(): java.util.Collection<JavaObject[]> {
        let directories: java.lang.String[] = [new java.lang.String("/nal/stability/")];

        let et: java.util.Map<java.lang.String, JavaObject[]> = ExampleFileInput.getUnitTests(directories);
        let t: java.util.Collection<JavaObject[]> = et.values();
        for (let x of et.keySet())
            StabilityTest.addTest(x);
        return t;
    }

    public static addTest(name: java.lang.String): void {
        name = name.substring(3, name.indexOf(new java.lang.String(".nal")));
        StabilityTest.tests.put(name, java.lang.Boolean.TRUE);
    }

    public static runTests(c: java.lang.Class<unknown>): double {

        StabilityTest.tests.clear();
        StabilityTest.scores.clear();

        if (StabilityTest.waitForEnterKeyOnStart) {
            java.lang.System.out.println("When ready, press enter");
            try {
                java.lang.System.in.read();
            } catch (ex) {
                if (ex instanceof java.io.IOException) {
                    throw new java.lang.IllegalStateException("Could not read user input.", ex);
                } else {
                    throw ex;
                }
            }
        }

        // Result result = org.junit.runner.JUnitCore.runClasses(NALTest.class);

        let result: Result = JUnitCore.runClasses(new ParallelComputer(true, true), c);

        for (let f of result.getFailures()) {
            let test: java.lang.String = f.getMessage().substring(f.getMessage().indexOf("/nal/single_step") + 8,
                f.getMessage().indexOf(".nal"));

            StabilityTest.tests.put(test, false);
        }

        let levelSuccess: Int32Array = new Int32Array(10);
        let levelTotals: Int32Array = new Int32Array(10);

        for (let e of StabilityTest.tests.entrySet()) {
            let name: java.lang.String = e.getKey();
            let level: int = 0;
            level = java.lang.Integer.parseInt(name.split("\\.")[0]);
            levelTotals[level]++;
            if (e.getValue()) {
                levelSuccess[level]++;
            }
        }

        let totalScore: double = 0;
        for (let d of StabilityTest.scores.values())
            totalScore += d;

        if (StabilityTest.showReport) {
            let totalSucceeded: int = 0;
            let total: int = 0;
            for (let i: int = 0; i < 9; i++) {
                let rate: float = (levelTotals[i] > 0) ? (levelSuccess[i] as float) / levelTotals[i] : 0;
                let prefix: java.lang.String = new java.lang.String((i > 0) ? ("NAL" + i) : "Other");

                java.lang.System.out.println(
                    prefix + ": " + (rate * 100.0) + "%  (" + levelSuccess[i] + "/" + levelTotals[i] + ")");
                totalSucceeded += levelSuccess[i];
                total += levelTotals[i];
            }
            java.lang.System.out.println(totalSucceeded + " / " + total);

            java.lang.System.out.println("Score: " + totalScore);
        }
        return totalScore;
    }

    public static main(args: java.lang.String[]): void {
        StabilityTest.runTests(org.opennars.core.NALTest.class);
    }

    public constructor(scriptPath: java.lang.String) {
        super();
        this.scriptPath = scriptPath;

    }

    public run(): double {
        return this.testNAL(this.scriptPath);
    }

    protected testNAL(path: java.lang.String): double {
        let expects: java.util.List<OutputCondition> = new java.util.ArrayList<OutputCondition>();

        let error: boolean = false;
        const n: Nar = this.newNAR();
        let example: java.lang.String = StabilityTest.getExample(path);

        if (StabilityTest.showOutput) {
            java.lang.System.out.println(example);
            java.lang.System.out.println();
        }

        let extractedExpects: java.util.List<OutputCondition> = OutputCondition.getConditions(n, example, StabilityTest.similarsToSave);
        expects.addAll(extractedExpects);

        if (StabilityTest.showOutput)
            new TextOutputHandler(n, java.lang.System.out);

        n.addInputFile(path);
        n.cycles(this.minCycles);

        java.lang.System.err.flush();
        java.lang.System.out.flush();

        let success: boolean = expects.size() > 0 && (!error);
        for (let e of expects) {
            if (!e.succeeded)
                success = false;
        }

        let score: double = Number.POSITIVE_INFINITY;
        if (success) {
            let lastSuccess: number = -1;
            for (let e of expects) {
                if (e.getTrueTime() !== -1) {
                    if (lastSuccess < e.getTrueTime())
                        lastSuccess = e.getTrueTime();
                }
            }
            if (lastSuccess !== -1) {
                // score = 1.0 + 1.0 / (1+lastSuccess);
                score = lastSuccess;
                StabilityTest.scores.put(path, score);
            }
        } else {
            StabilityTest.scores.put(path, Number.POSITIVE_INFINITY);
        }

        // System.out.println(lastSuccess + " , " + path + " \t excess cycles=" +
        // (n.time() - lastSuccess) + " end=" + n.time());

        if ((!success && StabilityTest.showFail) || (success && StabilityTest.showSuccess)) {
            java.lang.System.err.println('\n' + path + " @" + n.time());
            for (let e of expects) {
                java.lang.System.err.println("  " + e);
            }
        }

        // System.err.println("Status: " + success + " total=" + expects.size() + " " +
        // expects);
        if (StabilityTest.requireSuccess)
            assertTrue(javaStringValue(path), success);

        return score;
    }

    public test(): void {
        this.testNAL(this.scriptPath);
    }
}
