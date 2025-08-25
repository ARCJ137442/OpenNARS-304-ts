import { java, JavaObject, type int, type double, type long } from "jree";



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
    protected static readonly examples: java.util.Map<java.lang.String, java.lang.String> | null = new java.util.LinkedHashMap(); // path -> script data
    public static readonly tests: java.util.Map<java.lang.String, java.lang.Boolean> | null = new java.util.LinkedHashMap();

    // we store a list of scores to keep track of each sample
    public static readonly scores: java.util.Map<java.lang.String, java.util.List<java.lang.Double>> | null = new java.util.LinkedHashMap();
    protected readonly scriptPath: java.lang.String | null;

    /** how many times should one test be run (to collect run scores) */
    public static numberOfSamples: int = 1;

    // exposed to be able to change it from the outside
    public static directories: java.lang.String[] | null = ["/nal/single_step/", "/nal/multi_step/", "/nal/application/"];

    public static scoreSum: double = 0.0; // sum of all scores
    public static scoreSumWithTime: double = 0.0; // sum of all scores

    public static qaScoreDecayFactor: double = 0.001; // how fast does the score decay? - later answers get less score

    public static timeSum: double = 0.0;
    public static bestAnswerConfSum: double = 0.0;
    public static samplesCnt: long = 0;

    public static getExample(/* final */  path: java.lang.String | null): java.lang.String | null {
        try {
            let existing: java.lang.String = NALTest.examples.get(path);
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

    public newNAR(): Nar | null {
        return new Nar();
    }

    public static params(): java.util.Collection<unknown> | null {
        // return all test-paths of all files in the directories

        let et: java.util.Map<java.lang.String, java.lang.Object> = ExampleFileInput.getUnitTests(NALTest.directories);
        let t: java.util.Collection<unknown> = et.values();
        for (let x of et.keySet())
            NALTest.addTest(x);
        return t;
    }

    public static addTest(name: java.lang.String | null): void {
        name = name.substring(3, name.indexOf(".nal"));
        NALTest.tests.put(name, true);
    }

    public static runTests(/* final */  c: java.lang.Class<unknown> | null): void {

        NALTest.tests.clear();
        NALTest.scores.clear();

        let result: Result = JUnitCore.runClasses(new ParallelComputer(true, true), c);

        for (let f of result.getFailures()) {
            let test: java.lang.String = f.getMessage().substring(f.getMessage().indexOf("/nal/single_step") + 8,
                f.getMessage().indexOf(".nal"));

            NALTest.tests.put(test, false);
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
    }

    public constructor(/* final */  scriptPath: java.lang.String | null) {
        super();
        this.scriptPath = scriptPath;

    }

    public testNAL(/* final */  path: java.lang.String | null): void {
        for (let iSample: int = 0; iSample < NALTest.numberOfSamples; iSample++) {
            this.sample(path);
        }
    }

    public sample(/* final */  path: java.lang.String | null): double {
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

        n.addInputFile(path);
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

            if (NALTest.scores.containsKey(path)) {
                NALTest.scores.get(path).add(score);
            } else {
                let scoresList: java.util.List<java.lang.Double> = new java.util.ArrayList();
                scoresList.add(score);
                NALTest.scores.put(path, scoresList);
            }
            // }
        } else {
            if (NALTest.scores.containsKey(path)) {
                NALTest.scores.get(path).add(0.0);
            } else {
                let scoresList: java.util.List<java.lang.Double> = new java.util.ArrayList();
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

        if ((!success & NALTest.showFail) || (success && NALTest.showSuccess)) {
            java.lang.System.err.println('\n' + path + " @" + n.time());
            for (let e of expects) {
                java.lang.System.err.println("  " + e);
            }
        }

        if (NALTest.requireSuccess) {
            assertTrue(path, success);
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

    public static main(/* final */  args: java.lang.String[] | null): void {
        NALTest.runTests(NALTest.class);
    }

    static {
        Debug.DETAILED = false;
        Debug.TEST = true;
    }
}
