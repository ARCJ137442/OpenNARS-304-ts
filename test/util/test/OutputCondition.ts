


import { java, type long, type int } from "jree";



/**
 * Monitors an output stream for certain conditions. Used in testing and
 * analysis.
 *
 * Parameter O is the type of object which will be remembered that can make
 * the condition true
 */
export abstract class OutputCondition extends OutputHandler {
    public succeeded: boolean = false;

    public readonly nar: Nar | null;
    protected successAt: long = -1;

    public constructor(/* final */  nar: Nar | null) {
        super(nar);
        this.nar = nar;
    }

    /** whether this is an "inverse" condition */
    public isInverse(): boolean {
        return false;
    }

    public event(/* final */  channel: java.lang.Class<unknown> | null, /* final */  args: java.lang.Object[] | null): void {
        if ((this.succeeded) && (!this.isInverse())) {
            return;
        }
        if ((channel === OUT.class) || (channel === EXE.class)) {
            let signal: java.lang.Object = args[0];
            if (this.condition(channel, signal)) {
                this.setTrue();
            }
        }
    }

    protected setTrue(): void {
        if (this.successAt === -1) {
            this.successAt = this.nar.time();
        }
        this.succeeded = true;
    }

    public isTrue(): boolean {
        return this.succeeded;
    }

    /** returns true if condition was satisfied */
    public abstract condition(channel: java.lang.Class<unknown> | null, signal: java.lang.Object | null): boolean;

    /**
     * reads an example file line-by-line, before being processed, to extract
     * expectations
     */
    public static getConditions(/* final */  n: Nar | null, /* final */  example: java.lang.String | null,
            /* final */  similarResultsToSave: int): java.util.List<OutputCondition> | null {
        let conditions: java.util.List<OutputCondition> = new java.util.ArrayList();
        let lines: java.lang.String[] = example.split("\n");

        for (let s of lines) {
            s = s.trim();

            let expectOutContains2: java.lang.String = "''outputMustContain('";

            if (s.indexOf(expectOutContains2) === 0) {

                // remove ') suffix:
                let e: java.lang.String = s.substring(expectOutContains2.length(), s.length() - 2);

                /*
                 * try {
                 * Task t = narsese.parseTask(e);
                 * expects.add(new ExpectContainsSentence(n, t.sentence));
                 * } catch (Narsese.InvalidInputException ex) {
                 * expects.add(new ExpectContains(n, e, saveSimilar));
                 * }
                 */

                conditions.add(new OutputContainsCondition(n, e, similarResultsToSave));

            }

            let expectOutNotContains2: java.lang.String = "''outputMustNotContain('";

            if (s.indexOf(expectOutNotContains2) === 0) {

                // remove ') suffix:
                let e: java.lang.String = s.substring(expectOutNotContains2.length(), s.length() - 2);
                conditions.add(new OutputNotContainsCondition(n, e));

            }

            let expectOutEmpty: java.lang.String = "''expect.outEmpty";
            if (s.indexOf(expectOutEmpty) === 0) {
                conditions.add(new OutputEmptyCondition(n));
            }

        }

        return conditions;
    }

    public toString(): java.lang.String | null {
        return java.lang.Object.getClass().getSimpleName() + " " + (this.succeeded ? "OK: " + this.getTrueReasons() : this.getFalseReason());
    }

    public getTrueReasons(): java.util.List<unknown> | null {
        if (!this.isTrue())
            throw new java.lang.IllegalStateException(this + " is not true so has no true reasons");
        return java.util.Collections.emptyList();
    }

    /** if false, a reported reason why this condition is false */
    public abstract getFalseReason(): java.lang.String | null;

    /** if true, when it became true */
    public getTrueTime(): long {
        return this.successAt;
    }

}
