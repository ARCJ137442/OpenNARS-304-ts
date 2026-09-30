import { java, type int } from "../../src/runtime/native-runtime.ts";
import { AnswerHandler } from "../../src/io/events/AnswerHandler.ts";
import { Nar } from "../../src/main/Nar.ts";
import type { Reasoner } from "../../src/interfaces/pub/Reasoner.ts";
import { Sentence } from "../../src/entity/Sentence.ts";



/**
 * temporal metric to test and quantify the capability of a NARS implementation
 * to retain a temporal relationship it had learned a long time ago with events.
 */
export class TemporalOneShotMetric extends AnswerHandler {
    public reasonerUnderTest: Reasoner | null = null;

    public numberOfShots: int = 2;

    public numberOfTermNames: int = 500;

    public numberOfRandomEventsBeforeTest: int = 14;

    private termNames: java.util.List<java.lang.String> = new java.util.ArrayList<java.lang.String>();

    private rng: java.util.Random = new java.util.Random(42n);

    private wasAnswered: boolean = false;

    public static main(args: java.lang.String[]): void {
        let metric: TemporalOneShotMetric = new TemporalOneShotMetric();
        metric.reasonerUnderTest = new Nar();

        let numberOfRandomEventsBeforeTest: int = 5;
        for (; numberOfRandomEventsBeforeTest < 30; numberOfRandomEventsBeforeTest++) {
            java.lang.System.out.println("checking # of events=" + java.lang.Integer.toString(numberOfRandomEventsBeforeTest));

            metric.numberOfRandomEventsBeforeTest = numberOfRandomEventsBeforeTest;

            let successes: boolean = false;
            for (let try_: int = 0; try_ < 8; try_++) {
                if (metric.check()) {
                    successes = true;
                    break;
                }
            }

            if (!successes) {
                break;
            }
        }

        java.lang.System.out.println("metric of passed # events = " + java.lang.Integer.toString(numberOfRandomEventsBeforeTest - 1));

        let debugMeHere: int = 5;
    }

    public check(): boolean {
        const reasoner = this.reasonerUnderTest;
        if (reasoner === null) {
            throw new java.lang.IllegalStateException("reasonerUnderTest must be assigned before check");
        }

        reasoner.reset();

        this.wasAnswered = false;

        // generate set of random term names
        for (let i: int = 0; i < this.numberOfTermNames; i++) {
            this.termNames.add(TemporalOneShotMetric.createRandomString(7, this.rng));
        }

        // one/many shot learned knowledge
        for (let i: int = 0; i < this.numberOfShots; i++) {
            reasoner.addInput("<flash --> [seen]>. :|:");
            reasoner.addInput("<b --> B>. :|:");
            reasoner.addInput("<spam --> [observed]>. :|:");
            reasoner.addInput("<thunder --> [heard]>. :|:");
        }

        // feed the reasoner with random events

        for (let i: int = 0; i < this.numberOfRandomEventsBeforeTest; i++) {
            let chosenTermName: java.lang.String = this.termNames.get(this.rng.nextInt(this.termNames.size()));

            reasoner.addInput(java.lang.String.format(new java.lang.String("<%s-->[%s_]>. :|:"), chosenTermName, chosenTermName));
            reasoner.cycles(1);
        }

        // check if reasoner still knows the one shot knowledge
        reasoner.ask("<(&/,<flash --> [seen]>,?1,<thunder --> [heard]>,?2) =/> ?3>", this);

        /// give reasoner enough time to reason
        reasoner.cycles(50000);

        return this.wasAnswered;

    }

    private static createRandomString(length: int, rng: java.util.Random): java.lang.String {
        let res = "";

        for (let i: int = 0; i < length; i++) {
            res += String.fromCharCode(0x41 + rng.nextInt(26));
        }

        return new java.lang.String(res);
    }

    public onSolution(belief: Sentence): void {
        this.wasAnswered = true;
    }
}
