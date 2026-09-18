import { java, type int } from "jree";
import { Nar } from "../../../src/main/Nar.ts";
import { OutputHandler } from "../../../src/io/events/OutputHandler.ts";
import type { EventEmitter } from "../../../src/io/events/EventEmitter.ts";
import type { ClassTokenLike } from "../../../src/runtime/RuntimeClass.ts";

const OUT = OutputHandler.OUT;
const EXE = OutputHandler.EXE;

type OutputContainsFactory = (nar: Nar, containing: java.lang.String, maxSimilars: int) => OutputCondition;
type OutputNotContainsFactory = (nar: Nar, containing: java.lang.String) => OutputCondition;
type OutputEmptyFactory = (nar: Nar) => OutputCondition;


/**
 * Monitors an output stream for certain conditions. Used in testing and
 * analysis.
 *
 * Parameter O is the type of object which will be remembered that can make
 * the condition true
 */
export abstract class OutputCondition extends OutputHandler {
    private static outputContainsFactory: OutputContainsFactory | null = null;
    private static outputNotContainsFactory: OutputNotContainsFactory | null = null;
    private static outputEmptyFactory: OutputEmptyFactory | null = null;

    public succeeded: boolean = false;

    public readonly nar: Nar;
    protected successAt: number = -1;

    public constructor(nar: Nar) {
        super(nar);
        this.nar = nar;
    }

    /** whether this is an "inverse" condition */
    public isInverse(): boolean {
        return false;
    }

    public event(channel: ClassTokenLike, args: EventEmitter.EventPayload): void {
        if ((this.succeeded) && (!this.isInverse())) {
            return;
        }
        if ((channel === OUT.class) || (channel === EXE.class)) {
            let signal: java.lang.Object = args[0] as java.lang.Object;
            if (this.condition(channel, signal)) {
                this.setTrue();
            }
        }
    }

    protected setTrue(): void {
        if (this.successAt === -1) {
            this.successAt = Number(this.nar.time());
        }
        this.succeeded = true;
    }

    public isTrue(): boolean {
        return this.succeeded;
    }

    /** returns true if condition was satisfied */
    public abstract condition(channel: ClassTokenLike, signal: java.lang.Object): boolean;

    public static registerOutputContainsFactory(factory: OutputContainsFactory): void {
        OutputCondition.outputContainsFactory = factory;
    }

    public static registerOutputNotContainsFactory(factory: OutputNotContainsFactory): void {
        OutputCondition.outputNotContainsFactory = factory;
    }

    public static registerOutputEmptyFactory(factory: OutputEmptyFactory): void {
        OutputCondition.outputEmptyFactory = factory;
    }

    private static requireFactory<T>(factory: T | null, name: string): T {
        if (factory === null) {
            throw new java.lang.IllegalStateException(
                new java.lang.String(`${name} implementation was not loaded`),
            );
        }
        return factory;
    }

    /**
     * reads an example file line-by-line, before being processed, to extract
     * expectations
     */
    public static getConditions(n: Nar, example: java.lang.String,
        similarResultsToSave: int): java.util.List<OutputCondition> {
        const conditions: java.util.List<OutputCondition> = new java.util.ArrayList<OutputCondition>();
        let lines: java.lang.String[] = example.split("\n");

        for (let s of lines) {
            s = s.trim();

            const expectOutContains2 = new java.lang.String("''outputMustContain('");

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

                const createOutputContains = OutputCondition.requireFactory(
                    OutputCondition.outputContainsFactory,
                    "OutputContainsCondition",
                );
                conditions.add(createOutputContains(n, e, similarResultsToSave));

            }

            const expectOutNotContains2 = new java.lang.String("''outputMustNotContain('");

            if (s.indexOf(expectOutNotContains2) === 0) {

                // remove ') suffix:
                let e: java.lang.String = s.substring(expectOutNotContains2.length(), s.length() - 2);
                const createOutputNotContains = OutputCondition.requireFactory(
                    OutputCondition.outputNotContainsFactory,
                    "OutputNotContainsCondition",
                );
                conditions.add(createOutputNotContains(n, e));

            }

            const expectOutEmpty = new java.lang.String("''expect.outEmpty");
            if (s.indexOf(expectOutEmpty) === 0) {
                const createOutputEmpty = OutputCondition.requireFactory(
                    OutputCondition.outputEmptyFactory,
                    "OutputEmptyCondition",
                );
                conditions.add(createOutputEmpty(n));
            }

        }

        return conditions;
    }

    public toString(): java.lang.String {
        return new java.lang.String(this.getClass().getSimpleName() + " " + (this.succeeded ? "OK: " + this.getTrueReasons() : this.getFalseReason()));
    }

    public getTrueReasons(): java.util.List<unknown> {
        if (!this.isTrue())
            throw new java.lang.IllegalStateException(this + " is not true so has no true reasons");
        return new java.util.ArrayList<unknown>();
    }

    /** if false, a reported reason why this condition is false */
    public abstract getFalseReason(): java.lang.String;

    /** if true, when it became true */
    public getTrueTime(): number {
        return this.successAt;
    }

}
