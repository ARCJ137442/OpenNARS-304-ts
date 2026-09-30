import { java, JavaObject, type int, type double } from "../../src/runtime/native-runtime.ts";
import { Debug } from "../../src/main/Debug.ts";
import { Nar } from "../../src/main/Nar.ts";
import { TextOutputHandler } from "../../src/io/events/TextOutputHandler.ts";
import { OutputCondition } from "../util/test/OutputCondition.ts";
import { OutputContainsCondition } from "../util/test/OutputContainsCondition.ts";
import "../util/test/OutputConditionImplementations.ts";
import { ExampleFileInput } from "../util/io/ExampleFileInput.ts";
import { assertTrue } from "../util/junit-assert.ts";
import { javaStringValue } from "../../src/runtime/native-runtime.ts";
import { runSerialParameterized } from "../util/serial-parameterized-runner.ts";



/**
 * Test for the integrity of the different NAL levels.
 * Tests example, multistep etc.
 */
export class NALTest extends JavaObject {
    protected readonly minCycles: int = 1550; // TODO reduce this to one or zero to avoid wasting any extra time during tests
    public static showOutput: boolean = false;
    public static showSuccess: boolean = false;
    public static readonly showFail: boolean = true;
    public static readonly showReport: boolean = true;
    public static readonly requireSuccess: boolean = true;
    public static readonly similarsToSave: int = 5;
    protected static readonly examples: java.util.Map<java.lang.String, java.lang.String> = new java.util.LinkedHashMap(); // path -> script data
    public static readonly tests: java.util.Map<java.lang.String, java.lang.Boolean> = new java.util.LinkedHashMap();

    // we store a list of scores to keep track of each sample
    public static readonly scores: java.util.Map<java.lang.String, java.util.List<double>> = new java.util.LinkedHashMap();
    protected readonly scriptPath: java.lang.String;

    /** how many times should one test be run (to collect run scores) */
    public static numberOfSamples: int = 1;

    // exposed to be able to change it from the outside
    public static directories: java.lang.String[] = [
        new java.lang.String("/nal/single_step/"),
        new java.lang.String("/nal/multi_step/"),
        new java.lang.String("/nal/application/")
    ];

    public static scoreSum: double = 0.0; // sum of all scores
    public static scoreSumWithTime: double = 0.0; // sum of all scores

    public static qaScoreDecayFactor: double = 0.001; // how fast does the score decay? - later answers get less score

    public static timeSum: double = 0.0;
    public static bestAnswerConfSum: double = 0.0;
    public static samplesCnt: number = 0;

    public static getExample(path: java.lang.String): java.lang.String {
        try {
            let existing: java.lang.String | null = NALTest.examples.get(path);
            if (existing !== null)
                return existing;

            existing = ExampleFileInput.load(path);

            NALTest.examples.put(path, existing);
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
    }

    public static params(): java.util.Collection<JavaObject[]> {
        // return all test-paths of all files in the directories

        let et: java.util.Map<java.lang.String, JavaObject[]> = ExampleFileInput.getUnitTests(NALTest.directories);
        let t: java.util.Collection<JavaObject[]> = et.values();
        for (let x of et.keySet())
            NALTest.addTest(x);
        return t;
    }

    public static addTest(name: java.lang.String): void {
        name = name.substring(3, name.indexOf(new java.lang.String(".nal")));
        NALTest.tests.put(name, java.lang.Boolean.TRUE);
    }

    public static runTests(_c: java.lang.Class<unknown>): void {
        NALTest.tests.clear();
        NALTest.scores.clear();
        NALTest.runSerialTests(NALTest.params(), path => new NALTest(path));
    }

    public static runSerialTests(
        parameters: java.util.Collection<JavaObject[]>,
        createTest: (path: java.lang.String) => NALTest,
    ): void {
        runSerialParameterized(parameters, argumentsForTest => {
            const path = argumentsForTest[0] as java.lang.String;
            createTest(path).test();
        }, argumentsForTest => {
            const path = argumentsForTest[0] as java.lang.String;
            NALTest.tests.put(NALTest.testName(path), java.lang.Boolean.FALSE);
        });

        NALTest.doYourOneTimeTeardown();
    }

    private static testName(path: java.lang.String): java.lang.String {
        const normalizedPath = javaStringValue(path).replaceAll("\\\\", "/");
        const fileName = normalizedPath.substring(normalizedPath.lastIndexOf("/") + 1);
        const withoutExtension = fileName.endsWith(".nal") ? fileName.substring(0, fileName.length - 4) : fileName;
        const name = withoutExtension.startsWith("nal") ? withoutExtension.substring(3) : withoutExtension;
        return new java.lang.String(name);
    }

        /*
         * commented because name.split() is broken for a special case in NalTestMetrics
         * final int[] levelSuccess = new int[10];
         * final int[] levelTotals = new int[10];
         *
         * for (final Map.Entry<String, Boolean> e : tests.entrySet()) {
         * final String name = e.getKey();
         * int level = 0;
         * level = Integer.parseInt(name.split("\\.")[0]);
         * levelTotals[level]++;
         * if (e.getValue()) {
         * levelSuccess[level]++;
         * }
         * }
         *
         * if (showReport) {
         * int totalSucceeded = 0, total = 0;
         * for (int i = 0; i < 9; i++) {
         * final float rate = (levelTotals[i] > 0) ? ((float)levelSuccess[i]) /
         * levelTotals[i] : 0;
         * final String prefix = (i > 0) ? ("NAL" + i) : "Other";
         *
         * System.out.println(prefix + ": " + (rate*100.0) + "%  (" + levelSuccess[i] +
         * "/" + levelTotals[i] + ")" );
         * totalSucceeded += levelSuccess[i];
         * total += levelTotals[i];
         * }
         * System.out.println(totalSucceeded + " / " + total);
         * }
         */
    public constructor(scriptPath: java.lang.String) {
        super();
        this.scriptPath = scriptPath;

    }

    public testNAL(path: java.lang.String): void {
        for (let iSample: int = 0; iSample < NALTest.numberOfSamples; iSample++) {
            this.sample(path);
        }
    }

    public sample(path: java.lang.String): double {
        let example: java.lang.String = NALTest.getExample(path);

        if (NALTest.showOutput) {
            java.lang.System.out.println(example);
            java.lang.System.out.println();
        }

        let n: Nar = this.newNAR();

        let extractedExpects: java.util.List<OutputCondition> = OutputCondition.getConditions(n, example, NALTest.similarsToSave);
        let expects: java.util.List<OutputCondition> = new java.util.ArrayList(extractedExpects);

        if (NALTest.showOutput) {
            new TextOutputHandler(n, java.lang.System.out);
        }

        n.addInputText(example);
        n.cycles(this.minCycles);

        if (NALTest.showOutput) {
            java.lang.System.err.flush();
            java.lang.System.out.flush();
        }

        let success: boolean = expects.size() > 0;
        for (let e of expects) {
            if (!e.succeeded) {
                success = false;
            }
        }

        let score: double = 0.0;
        let scoreWithTime: double = 0.0;

        if (success) {
            // long lastSuccess = -1;
            for (let e of expects) {
                /*
                 * if (e.getTrueTime()!=-1) {
                 * if (lastSuccess < e.getTrueTime()) {
                 * lastSuccess = e.getTrueTime();
                 * }
                 * }
                 */
                if (e instanceof OutputContainsCondition) {
                    let occ: OutputContainsCondition = e as OutputContainsCondition;

                    score += occ.confOfBestAnswer;
                    scoreWithTime += ((java.lang.Math.exp(-occ.timeOfBestAnswer * NALTest.qaScoreDecayFactor)) * occ.confOfBestAnswer);

                    // special handling, because occ.timeOfBestAnswer is set to max if no answer was
                    // given
                    if (occ.timeOfBestAnswer !== 0) { // was answer recorded?
                        NALTest.timeSum += occ.timeOfBestAnswer;
                    }

                    NALTest.bestAnswerConfSum += occ.confOfBestAnswer;
                    NALTest.samplesCnt++;
                }
            }

            // if (lastSuccess!=-1) {
            // score = 1.0 + 1.0 / (1+lastSuccess);
            // score = lastSuccess;

            const existingScores = NALTest.scores.get(path);
            if (existingScores !== null) {
                existingScores.add(score);
            } else {
                let scoresList: java.util.List<double> = new java.util.ArrayList<double>();
                scoresList.add(score);
                NALTest.scores.put(path, scoresList);
            }
            // }
        } else {
            const existingScores = NALTest.scores.get(path);
            if (existingScores !== null) {
                existingScores.add(0.0);
            } else {
                let scoresList: java.util.List<double> = new java.util.ArrayList<double>();
                scoresList.add(0.0);
                NALTest.scores.put(path, scoresList);
            }
        }

        java.lang.System.out.println(path + " score = " + score);
        java.lang.System.out.println(path + " score with time = " + scoreWithTime);
        NALTest.scoreSum += score; // accumulate score
        NALTest.scoreSumWithTime += scoreWithTime;

        // System.out.println(lastSuccess + " , " + path + " \t excess cycles=" +
        // (n.time() - lastSuccess) + " end=" + n.time());

        if ((!success && NALTest.showFail) || (success && NALTest.showSuccess)) {
            java.lang.System.err.println('\n' + path + " @" + n.time());
            for (let e of expects) {
                java.lang.System.err.println("  " + e);
            }
        }

        if (NALTest.requireSuccess) {
            assertTrue(javaStringValue(path), success);
        }

        return score;
    }

    public test(): void {
        this.testNAL(this.scriptPath);
    }

    public static doYourOneTimeTeardown(): void {
        java.lang.System.out.println("");
        java.lang.System.out.println("=======");
        java.lang.System.out.println("RESULTS");
        java.lang.System.out.println("=======");
        java.lang.System.out.println("");

        java.lang.System.out.println("score sum = " + NALTest.scoreSum);
        java.lang.System.out.println("score sum with time = " + NALTest.scoreSumWithTime);

        java.lang.System.out.println("---");

        // average time and conf of best answers
        java.lang.System.out.println("avg best time = " + (NALTest.timeSum / NALTest.samplesCnt));
        java.lang.System.out.println("avg best conf = " + (NALTest.bestAnswerConfSum / NALTest.samplesCnt));
    }

    public static main(args: java.lang.String[]): void {
        NALTest.runTests(NALTest.class);
    }

    static {
        Debug.DETAILED = false;
        Debug.TEST = true;
    }
}
