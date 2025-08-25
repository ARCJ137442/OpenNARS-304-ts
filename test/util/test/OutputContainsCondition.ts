


import { java, type double, type long, JavaObject, type int, type char } from "jree";



/**
 * OutputCondition that watches for a specific String output,
 * while collecting similar results (according to Levenshtein text distance).
 *
 */
export class OutputContainsCondition extends OutputCondition {
    public confOfBestAnswer: double = 0.0;
    public timeOfBestAnswer: long = 0;

    public readonly exact: java.util.List<Task> | null = new java.util.ArrayList<Task>();

    public static SimilarOutput = class SimilarOutput extends JavaObject implements java.lang.Comparable<SimilarOutput> {
        public readonly signal: java.lang.String | null;
        public readonly distance: int;

        public constructor(/* final */  signal: java.lang.String | null, /* final */  distance: int) {
            super();
            this.signal = signal;
            this.distance = distance;
        }

        public override  hashCode(): int {
            return this.signal.hashCode();
        }

        public override  equals(/* final */  obj: java.lang.Object | null): boolean {
            return this.signal.equals((obj as SimilarOutput).signal);
        }

        public override  toString(): java.lang.String | null {
            return "similar(" + this.distance + "): " + this.signal;
        }

        public compareTo(/* final */  o: SimilarOutput | null): int {
            return java.lang.Integer.compare(this.distance, o.distance);
        }

    };


    protected readonly containing: java.lang.String | null;
    public readonly almost: java.util.NavigableSet<OutputContainsCondition.SimilarOutput> | null = new java.util.TreeSet();
    protected readonly saveSimilar: boolean;
    protected maxSimilars: int = 5;

    /**
     *
     * @param nar
     * @param containing
     * @param maxSimilars # of similar results to collect, -1 to disable
     */
    public constructor(/* final */  nar: Nar | null, /* final */  containing: java.lang.String | null, /* final */  maxSimilars: int) {
        super(nar);
        this.containing = containing;
        this.maxSimilars = maxSimilars;
        this.saveSimilar = maxSimilars !== -1;
    }

    public getFalseReason(): java.lang.String | null {
        let s: java.lang.String = "FAIL: No substring match: " + this.containing;
        if (!this.almost.isEmpty()) {
            for (let cs of this.getCandidates(5)) {
                s += "\n\t" + cs;
            }
        }
        return s;
    }

    public getCandidates(/* final */  max: int): java.util.Collection<OutputContainsCondition.SimilarOutput> | null {
        return this.almost;
    }

    /**
     * @author http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#Java
     */
    public static levenshteinDistance(/* final */  a: java.lang.CharSequence | null, /* final */  b: java.lang.CharSequence | null): int {
        let len0: int = a.length() + 1;
        let len1: int = b.length() + 1;
        let cost: Int32Array = new Int32Array(len0);
        let newcost: Int32Array = new Int32Array(len0);
        for (let i: int = 0; i < len0; i++) {
            cost[i] = i;
        }
        for (let j: int = 1; j < len1; j++) {
            newcost[0] = j;
            let bj: char = b.charAt(j - 1);
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

    public cond(/* final */  channel: java.lang.Class<unknown> | null, /* final */  signal: java.lang.Object | null): boolean {
        if ((channel === OUT.class) || (channel === EXE.class)) {
            let o: java.lang.String;
            if (signal instanceof Task) {
                // only compare for Sentence string, faster than TextOutput.getOutputString
                // which also does unescaping, etc..
                let t: Task = signal as Task;
                let s: Sentence = t.sentence;
                o = s.toString(nar, false).toString();
                if (o.contains(this.containing)) {
                    if (this.saveSimilar) {
                        this.exact.add(t);
                    }
                    return true;
                }
            } else {
                let t: Task = null;
                if (signal instanceof ExecutionResult)
                    t = (signal as ExecutionResult).getTask();

                o = TextOutputHandler.getOutputString(channel, signal, false, false, nar).toString();

                if (o.contains(this.containing)) {
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

    public condition(/* final */  channel: java.lang.Class<unknown> | null, /* final */  signal: java.lang.Object | null): boolean {
        if ((channel === OUT.class) || (channel === EXE.class)) {
            if (signal instanceof Task) {
                let t: Task = signal as Task;
                let s: Sentence = t.sentence;
                if (s.truth !== null) {
                    if (s.truth.getConfidence() > this.confOfBestAnswer) {
                        this.timeOfBestAnswer = nar.time();
                    }
                    this.confOfBestAnswer = java.lang.Math.max(this.confOfBestAnswer, s.truth.getConfidence());
                }
            }
        }

        if (succeeded) {
            return true;
        }
        return this.cond(channel, signal);
    }

    public getTrueReasons(): java.util.List<unknown> | null {
        return this.exact;
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace OutputContainsCondition {
    export type SimilarOutput = InstanceType<typeof OutputContainsCondition.SimilarOutput>;
}


