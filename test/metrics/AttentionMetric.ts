import { java, JavaObject, type int, type double, closeResources, handleResourceError, throwResourceError } from "jree";
import {
    JavaClassNotFoundException,
    JavaIllegalAccessException,
    JavaInstantiationException,
    JavaNoSuchMethodException,
    JavaInvocationTargetException,
    JavaParseException,
} from "../../src/runtime/jree-compat.ts";
import { Nar } from "../../src/main/Nar.ts";
import type { Reasoner } from "../../src/interfaces/pub/Reasoner.ts";
import { Narsese } from "../../src/io/Narsese.ts";
import { Parameters } from "../../src/main/Parameters.ts";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Task } from "../../src/entity/Task.ts";
import { TruthValue } from "../../src/entity/TruthValue.ts";
import { TruthFunctions } from "../../src/inference/TruthFunctions.ts";
import { Operator } from "../../src/operator/Operator.ts";
import { EventHandler } from "../../src/io/events/EventHandler.ts";
import { AnswerHandler as JavaAnswerHandler } from "../../src/io/events/AnswerHandler.ts";
import { OutputHandler } from "../../src/io/events/OutputHandler.ts";
import { ExampleFileInput } from "../util/io/ExampleFileInput.ts";
import {
    JavaParserConfigurationException as ParserConfigurationException,
    JavaSAXException as SAXException,
} from "../../src/runtime/jree-compat.ts";



// TODO< run more tests >

export class AttentionMetric extends JavaObject {
    public static directories: java.lang.String[] = ["/nal/multi_step/", "/nal/application/"];

    public static showOutput: boolean = true;

    public static numberOfSamples: int = 8;

    public static rng: java.util.Random = new java.util.Random(65n);

    public static main(args: java.lang.String[]): void {

        let et: java.util.Map<java.lang.String, java.lang.Object> = ExampleFileInput.getUnitTests(AttentionMetric.directories);

        // final Collection t = et.values();

        for (let iTest of et.entrySet()) {
            let enTest: boolean = false;
            if (iTest.getKey().equals("toothbrush2.nal")) {
                enTest = true;
            }

            if (enTest) {
                let paths: java.lang.Object[] = iTest.getValue() as java.lang.Object[];

                let scoreSum: double = 0.0;
                for (let iSample: int = 0; iSample < AttentionMetric.numberOfSamples; iSample++) {
                    scoreSum += AttentionMetric.runMetricTest(paths[0] as java.lang.String);
                }
                let averageScore: double = scoreSum / AttentionMetric.numberOfSamples;
                java.lang.System.out.println(iTest.getKey() + "  avg score = " + averageScore);

            }
        }

        // int debugHere = 5;
    }

    public static calcScore(execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>, narParams: Parameters): double {
        let score: double = 0.0;

        let exponentialDecayTimeWeightFactor: double = 0.0003; // how fast does the "score" decay for a solution?

        let weightOfbestSolution: double = 1.0;
        let weightOfFirstSolution: double = 3.0;

        // we sum up the solutions, faster solutions with a better time get a better
        // score
        for (let iEntry of execOrQaAnswersByTime.entrySet()) {
            let iEntryVal: AttentionMetric.ExecOrAnswerByTime = iEntry.getValue();

            let bestWeight: double = TruthFunctions.c2w(iEntryVal.bestTruth.confidence, narParams); // we care about
            // weight because it
            // doesn't converge
            // to 1.0 like conf,
            // so we can compute
            // a more meaningful
            // score
            let bestTimeWeight: double = java.lang.Math.exp(-Number(iEntry.getValue().bestTime.longValue()) * exponentialDecayTimeWeightFactor); // weight
            // faster
            // answers
            // with a
            // better
            // ranking

            let firstWeight: double = TruthFunctions.c2w(iEntryVal.firstTruth.confidence, narParams); // we care about
            // weight because
            // it doesn't
            // converge to 1.0
            // like conf, so
            // we can compute
            // a more
            // meaningful
            // score
            let firstTimeWeight: double = java.lang.Math.exp(-Number(iEntry.getValue().firstTime.longValue()) * exponentialDecayTimeWeightFactor); // weight
            // faster
            // answers
            // with
            // a
            // better
            // ranking

            let scoreOfThisEntry: double = (bestWeight * bestTimeWeight) * weightOfbestSolution
                + (firstWeight * firstTimeWeight) * weightOfFirstSolution;

            if (true)
                java.lang.System.out.println("score of solution " + iEntry.getKey() + " = " + scoreOfThisEntry);

            score += scoreOfThisEntry;
        }

        return score;
    }

    public static runMetricTest(name: java.lang.String): double {
        let execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime> = new java.util.HashMap();

        let n: Reasoner = null;
        try {
            n = new Nar();
        } catch (e) {
            if (e instanceof java.io.IOException) {
                e.printStackTrace();
            } else if (e instanceof JavaInstantiationException) {
                e.printStackTrace();
            } else if (e instanceof JavaInvocationTargetException) {
                e.printStackTrace();
            } else if (e instanceof JavaNoSuchMethodException) {
                e.printStackTrace();
            } else if (e instanceof ParserConfigurationException) {
                e.printStackTrace();
            } else if (e instanceof JavaIllegalAccessException) {
                e.printStackTrace();
            } else if (e instanceof SAXException) {
                e.printStackTrace();
            } else if (e instanceof JavaClassNotFoundException) {
                e.printStackTrace();
            } else if (e instanceof JavaParseException) {
                e.printStackTrace();
            } else {
                throw e;
            }
        }

        if (n === null)
            throw new java.lang.IllegalStateException("Could not create NAR");
        (n as Nar).memory.randomNumber.setSeed(AttentionMetric.rng.nextInt(10000)); // start it with another seed

        if (AttentionMetric.showOutput) {
            // new TextOutputHandler((Nar)n, System.out);

            n.on(OutputHandler.EXE.class, new AttentionMetric.OutputHandler2(n as Nar, execOrQaAnswersByTime));
        }

        try {
            for (let iLine of AttentionMetric.readFile(name)) {
                java.lang.System.out.println(iLine);

                let isCommented: boolean = iLine.startsWith("'");
                let isQuestion: boolean = !isCommented && iLine.endsWith("?");
                if (isQuestion) {
                    let question: java.lang.String = iLine.substring(0, iLine.length() - 1);
                    n.ask(question, new AttentionMetric.AnswerHandler(n, execOrQaAnswersByTime));
                } else {
                    n.addInput(iLine);
                }
            }
        } catch (e) {
            if (e instanceof java.io.IOException || e instanceof Narsese.InvalidInputException) {
                e.printStackTrace();
            } else {
                throw e;
            }
        }

        let minCycles: int = 1000;
        n.cycles(minCycles);

        let scoreOfThisTest: double = AttentionMetric.calcScore(execOrQaAnswersByTime, (n as Nar).narParameters);

        java.lang.System.out.println("score of " + name + " = " + scoreOfThisTest);

        // int here = 5;

        return scoreOfThisTest;
    }

    public static readFile(filepath: java.lang.String): java.util.List<java.lang.String> {
        let res: java.util.List<java.lang.String> = new java.util.ArrayList();
            // This holds the final error to throw (if any).
            let error: java.lang.Throwable | undefined;

            const br: java.io.BufferedReader = new java.io.BufferedReader(new java.io.FileReader(filepath))
            try {
                try {
                    let line: java.lang.String;
                    while ((line = br.readLine()) !== null) {
                        // process the line.
                        res.add(line);
                    }
                }
                finally {
                    error = closeResources([br]);
                }
            } catch (e) {
                error = handleResourceError(e, error);
            } finally {
                throwResourceError(error);
            }
        return res;
    }

    public static OutputHandler2 = class OutputHandler2 extends EventHandler {
        private readonly execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>;
        private readonly nar: Nar;

        public constructor(nar: Nar, execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>) {
            super(nar, true);
            this.nar = nar;
            this.execOrQaAnswersByTime = execOrQaAnswersByTime;
        }

        public event(event: java.lang.Class<unknown>, args: java.lang.Object[]): void {
            let exeResult: Operator.ExecutionResult = args[0] as Operator.ExecutionResult;
            let task: Task | null = exeResult.getTask();
            if (task === null) {
                throw new java.lang.NullPointerException();
            }
            AttentionMetric.update(this.execOrQaAnswersByTime, task.sentence, this.nar);
        }
    };


    public static AnswerHandler = class AnswerHandler extends JavaAnswerHandler {
        private readonly execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>;
        private readonly reasoner: Reasoner;

        public constructor(reasoner: Reasoner, execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>) {
            super();
            this.reasoner = reasoner;
            this.execOrQaAnswersByTime = execOrQaAnswersByTime;
        }

        public onSolution(belief: Sentence): void {
            AttentionMetric.update(this.execOrQaAnswersByTime, belief, this.reasoner);

            // int here = 5;
        }
    };


    // TODO< handle truth of answer correctly >
    // updates execOrQaAnswersByTime with the result from the sentence
    public static update(execOrQaAnswersByTime: java.util.Map<java.lang.String, AttentionMetric.ExecOrAnswerByTime>, s: Sentence, nar: Reasoner): void {
        let exec: AttentionMetric.ExecOrAnswerByTime;

        if (execOrQaAnswersByTime.containsKey(s.term.toString())) {
            // was executed before

            exec = execOrQaAnswersByTime.get(s.term.toString());
        } else {
            // is first time execution

            exec = new AttentionMetric.ExecOrAnswerByTime("exec", s.term.toString());
            exec.firstTime = new java.lang.Long(nar.time());
            exec.firstTruth = s.truth.clone();

            execOrQaAnswersByTime.put(s.term.toString(), exec);
        }

        if (exec.bestTruth === null) { // is it the first time?
            exec.bestTime = new java.lang.Long(nar.time()); // the first is the best
            exec.bestTruth = s.truth.clone();
        } else if (s.truth.clone().confidence > exec.bestTruth.confidence) { // is the TV this time better
            // than the recorded one?
            exec.bestTime = new java.lang.Long(nar.time());
            exec.bestTruth = s.truth.clone();
        }
    }

    // used to record the first and best answer or exec of op by time
    public static ExecOrAnswerByTime = class ExecOrAnswerByTime extends JavaObject {
        public readonly narseseTerm: java.lang.String;
        public readonly type: java.lang.String;

        public firstTime!: java.lang.Long;
        public firstTruth: TruthValue;

        public bestTime!: java.lang.Long;
        public bestTruth: TruthValue;

        // /param type is the type, "exec" or "q&a"
        // /param narseseTerm term as string
        public constructor(type: java.lang.String, narseseTerm: java.lang.String) {
            super();
            this.type = type;
            this.narseseTerm = narseseTerm;
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace AttentionMetric {
    export type OutputHandler2 = InstanceType<typeof AttentionMetric.OutputHandler2>;
    export type AnswerHandler = InstanceType<typeof AttentionMetric.AnswerHandler>;
    export type ExecOrAnswerByTime = InstanceType<typeof AttentionMetric.ExecOrAnswerByTime>;
}


