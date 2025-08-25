import { java, JavaObject, type long, type int } from "jree";



/**
 * Checks for the stability of the system over a long time period (days, weeks,
 * etc)
 *
 * @author Robert Wünsche
 */
export class LongTermStability extends JavaObject {
    public readonly reasoner: Reasoner;

    public readonly counter: LongTermStability.ObjectIdCounter = new LongTermStability.ObjectIdCounter();

    public readonly rng: java.util.Random = new java.util.Random(42);

    public constructor(reasoner: Reasoner) {
        super();
        this.reasoner = reasoner;
    }

    public run(timeToRunInMilliseconds: long): void {
        // TODO< countdown time >
        let remainingTimeToRunInMilliseconds: long = timeToRunInMilliseconds;

        while (true) {
            this.feed(this.reasoner);
            this.cycleReasoner(100000);
        }
    }

    public cycleReasoner(numberOfCycles: int): void {
        this.reasoner.cycles(numberOfCycles);
    }

    public feed(consumer: Reasoner): void {
        let objectIdA: int = this.rng.nextInt(10000);
        let placeIdA: int = this.rng.nextInt(10000);

        this.feedRelation2(consumer, this.rng.nextInt(10000), this.rng.nextInt(10000), "at", false);
        this.feedRelation2(consumer, this.rng.nextInt(10000), this.rng.nextInt(10000), "from", false);
        this.feedRelation2(consumer, this.rng.nextInt(10000), this.rng.nextInt(10000), "a2", false);

        this.feedRelation2(consumer, objectIdA, placeIdA, "at", false);
        this.feedRelation2(consumer, objectIdA, placeIdA, "from", false);

        // feed questions
        this.feedRelation2(consumer, this.rng.nextInt(3000), this.rng.nextInt(3000), "at", true);
        this.feedRelation2(consumer, this.rng.nextInt(3000), this.rng.nextInt(3000), "from", true);
        this.feedRelation2(consumer, this.rng.nextInt(3000), this.rng.nextInt(3000), "a2", true);
    }

    public feedRelation2(consumer: Reasoner, objectId: long, placeId: long, relation: java.lang.String, isQuestion: boolean): void {
        let taskType: java.lang.String = isQuestion ? "?" : ".";

        // we feed a combination of forms
        consumer.addInput(java.lang.String.format("<(*, %d, %d)--> %s>%s :|:", objectId, placeId, relation, taskType));
        consumer.addInput(java.lang.String.format("<(*, {%d}, %d)--> %s>%s :|:", objectId, placeId, relation, taskType));
        consumer.addInput(java.lang.String.format("<(*, {%d}, {%d})--> %s>%s :|:", objectId, placeId, relation, taskType));
        consumer.addInput(java.lang.String.format("<(*, %d, {%d})--> %s>%s :|:", objectId, placeId, relation, taskType));
        // set
        consumer.addInput(java.lang.String.format("<(*, {%d, %d}, {%d})--> %s>%s :|:", objectId, objectId + 500000, placeId,
            relation, taskType));

        // duplicate set
        consumer.addInput(
            java.lang.String.format("<(*, {%d, %d}, {%d})--> %s>%s :|:", objectId, objectId, placeId, relation, taskType));

        consumer.addInput(java.lang.String.format("<%d --> (/, %s, _, %d)>%s :|:", placeId, relation, objectId, taskType));
        consumer.addInput(java.lang.String.format("<%d --> (/, %s, %d, _)>%s :|:", objectId, relation, placeId, taskType));

        consumer.addInput(java.lang.String.format("<{%d} --> (/, %s, _, %d)>%s :|:", placeId, relation, objectId, taskType));
        consumer.addInput(java.lang.String.format("<%d --> (/, %s, {%d}, _)>%s :|:", objectId, relation, placeId, taskType));

        consumer.addInput(java.lang.String.format("<{%d} --> (/, %s, _, {%d})>%s :|:", placeId, relation, objectId, taskType));
        consumer.addInput(java.lang.String.format("<{%d} --> (/, %s, {%d}, _)>%s :|:", objectId, relation, placeId, taskType));

        consumer.addInput(java.lang.String.format("<{%d} --> (/, %s, _, {%d})>%s :|:", placeId, relation, objectId, taskType));
        consumer.addInput(java.lang.String.format("<{%d} --> (/, %s, {%d}, _)>%s :|:", objectId, relation, placeId, taskType));
    }

    public static main(args: java.lang.String[]): void {
        let reasonerUnderTest: Reasoner = new Nar();
        let test: LongTermStability = new LongTermStability(reasonerUnderTest);

        let timeToRunInMilliseconds: long = 7 * 24 * 3600 * 1000;

        reasonerUnderTest.addInput("*volume=0");

        test.run(timeToRunInMilliseconds);
    }

    public static ObjectIdCounter = class ObjectIdCounter extends JavaObject {
        protected counter: long = 0;

        protected retNext(): long {
            return this.counter++;
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LongTermStability {
    export type ObjectIdCounter = InstanceType<typeof LongTermStability.ObjectIdCounter>;
}


