import { java, type double, JavaObject, type int, type char } from "../../../src/platform/node/legacy-runtime-facade.ts";
import { Nar } from "../../../src/main/Nar.ts";
import { Sentence } from "../../../src/entity/Sentence.ts";
import { Task } from "../../../src/entity/Task.ts";
import { Operator } from "../../../src/operator/Operator.ts";
import { OutputHandler } from "../../../src/io/events/OutputHandler.ts";
import { TextOutputHandler } from "../../../src/io/events/TextOutputHandler.ts";
import { OutputCondition } from "./OutputCondition.ts";
import type { ClassTokenLike } from "../../../src/runtime/RuntimeClass.ts";

const OUT = OutputHandler.OUT;
const EXE = OutputHandler.EXE;

class SortedComparableSet<T> implements Iterable<T> {
    private readonly values: T[] = [];
    private readonly compare: (left: T, right: T) => number;

    public constructor(compare: (left: T, right: T) => number) {
        this.compare = compare;
    }

    public isEmpty(): boolean {
        return this.values.length === 0;
    }

    public size(): int {
        return this.values.length;
    }

    public add(value: T): boolean {
        const index = this.values.findIndex((current) => this.compare(value, current) <= 0);
        if (index >= 0 && this.compare(value, this.values[index]) === 0) {
            return false;
        }
        if (index < 0) {
            this.values.push(value);
        } else {
            this.values.splice(index, 0, value);
        }
        return true;
    }

    public remove(value: T): boolean {
        const index = this.values.findIndex((current) => this.compare(value, current) === 0);
        if (index < 0) {
            return false;
        }
        this.values.splice(index, 1);
        return true;
    }

    public last(): T {
        if (this.values.length === 0) {
            throw new java.lang.IllegalStateException(new java.lang.String("empty sorted set"));
        }
        return this.values[this.values.length - 1];
    }

    public [Symbol.iterator](): Iterator<T> {
        return this.values[Symbol.iterator]();
    }
}
const ExecutionResult = Operator.ExecutionResult;
type ExecutionResult = InstanceType<typeof Operator.ExecutionResult>;



/**
 * OutputCondition that watches for a specific String output,
 * while collecting similar results (according to Levenshtein text distance).
 *
 */
export class OutputContainsCondition extends OutputCondition {
    public confOfBestAnswer: double = 0.0;
    public timeOfBestAnswer: number = 0;

    public readonly exact: java.util.List<unknown> = new java.util.ArrayList<unknown>();

    public static SimilarOutput = class SimilarOutput extends JavaObject implements java.lang.Comparable<SimilarOutput> {
        public readonly signal: java.lang.String;
        public readonly distance: int;

        public constructor(signal: java.lang.String, distance: int) {
            super();
            this.signal = signal;
            this.distance = distance;
        }

        public override  hashCode(): int {
            return this.signal.hashCode();
        }

        public override  equals(obj: java.lang.Object): boolean {
            return this.signal.equals((obj as SimilarOutput).signal);
        }

        public override  toString(): java.lang.String {
            return new java.lang.String(`similar(${this.distance}): ${String(this.signal)}`);
        }

        public compareTo(o: SimilarOutput): int {
            return java.lang.Integer.compare(this.distance, o.distance);
        }

    };


    protected readonly containing: java.lang.String;
    public readonly almost: SortedComparableSet<OutputContainsCondition.SimilarOutput> =
        new SortedComparableSet((left, right) => left.compareTo(right));
    protected readonly saveSimilar: boolean;
    protected maxSimilars: int = 5;

    /**
     *
     * @param nar
     * @param containing
     * @param maxSimilars # of similar results to collect, -1 to disable
     */
    public constructor(nar: Nar, containing: java.lang.String, maxSimilars: int) {
        super(nar);
        this.containing = containing;
        this.maxSimilars = maxSimilars;
        this.saveSimilar = maxSimilars !== -1;
    }

    public getFalseReason(): java.lang.String {
        let s = new java.lang.String(`FAIL: No substring match: ${String(this.containing)}`);
        if (!this.almost.isEmpty()) {
            for (let cs of this.getCandidates(5)) {
                s = new java.lang.String(`${String(s)}\n\t${String(cs)}`);
            }
        }
        return s;
    }

    public getCandidates(max: int): SortedComparableSet<OutputContainsCondition.SimilarOutput> {
        return this.almost;
    }

    /**
     * @author http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#Java
     */
    public static levenshteinDistance(a: java.lang.CharSequence, b: java.lang.CharSequence): int {
        let len0: int = a.length() + 1;
        let len1: int = b.length() + 1;
        let cost: Int32Array = new Int32Array(len0);
        let newcost: Int32Array = new Int32Array(len0);
        for (let i: int = 0; i < len0; i++) {
            cost[i] = i;
        }
        for (let j: int = 1; j < len1; j++) {
            newcost[0] = j;
            const bjValue = b.charAt(j - 1);
            if (bjValue === null) {
                throw new java.lang.IllegalStateException(new java.lang.String("charAt returned null within a valid range"));
            }
            const bj: char = bjValue;
            for (let i: int = 1; i < len0; i++) {
                let match: int = (a.charAt(i - 1) === bj) ? 0 : 1;
                let cost_replace: int = cost[i - 1] + match;
                let cost_insert: int = cost[i] + 1;
                let cost_delete: int = newcost[i - 1] + 1;

                let c: int = cost_insert;
                if (cost_delete < c)
                    c = cost_delete;
                if (cost_replace < c)
                    c = cost_replace;

                newcost[i] = c;
            }
            let swap: Int32Array = cost;
            cost = newcost;
            newcost = swap;
        }
        return cost[len0 - 1];
    }

    public cond(channel: ClassTokenLike, signal: java.lang.Object): boolean {
        if ((channel === OUT.class) || (channel === EXE.class)) {
            let o: java.lang.String;
            if (signal instanceof Task) {
                // only compare for Sentence string, faster than TextOutput.getOutputString
                // which also does unescaping, etc..
                let t: Task = signal as Task;
                let s: Sentence = t.sentence;
                o = new java.lang.String(s.toString(this.nar, false).toString());
                if (String(o).includes(String(this.containing))) {
                    if (this.saveSimilar) {
                        this.exact.add(t);
                    }
                    return true;
                }
            } else {
                let t: Task | null = null;
                if (signal instanceof ExecutionResult)
                    t = (signal as ExecutionResult).getTask();

                const output = TextOutputHandler.getOutputString(channel, signal, false, false, this.nar);
                if (output === null) {
                    return false;
                }
                o = output;

                if (String(o).includes(String(this.containing))) {
                    if ((this.saveSimilar) && (t !== null)) {
                        this.exact.add(t);
                    }
                    return true;
                }
            }
            if (this.saveSimilar) {
                let dist: int = OutputContainsCondition.levenshteinDistance(o, this.containing);

                if (this.almost.size() >= this.maxSimilars) {
                    let last: OutputContainsCondition.SimilarOutput = this.almost.last();

                    if (dist < last.distance) {
                        this.almost.remove(last);
                        this.almost.add(new OutputContainsCondition.SimilarOutput(o, dist));
                    }
                } else {
                    this.almost.add(new OutputContainsCondition.SimilarOutput(o, dist));
                }
            }
        }
        /*
         * if (channel == ERR.class) {
         * Assert.assertTrue(signal.toString(), false);
         * }
         */
        return false;
    }

    public condition(channel: ClassTokenLike, signal: java.lang.Object): boolean {
        if ((channel === OUT.class) || (channel === EXE.class)) {
            if (signal instanceof Task) {
                let t: Task = signal as Task;
                let s: Sentence = t.sentence;
                if (s.truth !== null) {
                    if (s.truth.confidence > this.confOfBestAnswer) {
                        this.timeOfBestAnswer = Number(this.nar.time());
                    }
                    this.confOfBestAnswer = java.lang.Math.max(this.confOfBestAnswer, s.truth.confidence);
                }
            }
        }

        if (this.succeeded) {
            return true;
        }
        return this.cond(channel, signal);
    }

    public getTrueReasons(): java.util.List<unknown> {
        return this.exact;
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace OutputContainsCondition {
    export type SimilarOutput = InstanceType<typeof OutputContainsCondition.SimilarOutput>;
}

OutputCondition.registerOutputContainsFactory(
    (nar, containing, maxSimilars) => new OutputContainsCondition(nar, containing, maxSimilars),
);

