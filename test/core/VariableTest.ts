import { java, JavaObject } from "../support/legacy-runtime-facade.ts";
import { Nar } from "../../src/main/Nar.ts";
import { EventHandler } from "../../src/io/events/EventHandler.ts";
import { Events } from "../../src/io/events/Events.ts";
import type { EventEmitter } from "../../src/io/events/EventEmitter.ts";
import { OutputContainsCondition } from "../util/test/OutputContainsCondition.ts";
import { assertTrue } from "../util/junit-assert.ts";

const Answer = Events.Answer;



/**
 *
 *
 */
export class VariableTest extends JavaObject {

    protected readonly n: Nar = new Nar();

    public constructor() {
        super();
    }

    public init(): void {
        this.n.addInput("<a --> 3>. :|:");
        this.n.addInput("<a --> 4>. :/:");
    }

    public testDepQueryVariableDistinct(): void {
        const outer = this;

        this.n.addInput("<(&/,<a --> 3>,?what) =/> <a --> #wat>>?");

        /*
         * A "Solved" solution of: <(&/,<a --> 3>,+3) =/> <a --> 4>>. %1.00;0.31%
         * shouldn't happen because it should not unify #wat with 4 because its not a
         * query variable
         */
        new class extends EventHandler {
            public event(event: java.lang.Class<unknown>, args: EventEmitter.EventPayload): void {
                // nothing should arrive via Solved.class channel
                assertTrue(false);
            }
        }(outer.n, true, Answer.class);

        const e = new OutputContainsCondition(this.n, new java.lang.String("=/> <a --> 4>>."), 5);

        this.n.cycles(32);

        assertTrue(e.isTrue());
    }

    public testQueryVariableUnification(): void {
        const outer = this;
        /*
         * <a --> 3>. :|:
         * <a --> 4>. :/:
         * <(&/,<a --> 3>,?what) =/> <a --> ?wat>>?
         *
         * Solved <(&/,<a --> 3>,+3) =/> <a --> 4>>. %1.00;0.31%
         *
         * because ?wat can be unified with 4 since ?wat is a query variable
         */

        this.n.addInput("<(&/,<a --> 3>,?what) =/> <a --> ?wat>>?");

        let solutionFound: java.util.concurrent.atomic.AtomicBoolean = new java.util.concurrent.atomic.AtomicBoolean(false);
        new class extends EventHandler {
            public event(event: java.lang.Class<unknown>, args: EventEmitter.EventPayload): void {
                solutionFound.set(true);
                outer.n.stop();
            }
        }(outer.n, true, Answer.class);

        this.n.cycles(1024);

        assertTrue(solutionFound.get());

    }
}
