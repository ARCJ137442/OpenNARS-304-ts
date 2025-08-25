


import { java, JavaObject } from "jree";



/**
 *
 *
 */
export class VariableTest extends JavaObject {

    protected readonly n: Nar | null = new Nar();

    public constructor() {
        super();
    }

    public init(): void {
        this.n.addInput("<a --> 3>. :|:");
        this.n.addInput("<a --> 4>. :/:");
    }

    public testDepQueryVariableDistinct(): void {

        this.n.addInput("<(&/,<a --> 3>,?what) =/> <a --> #wat>>?");

        /*
         * A "Solved" solution of: <(&/,<a --> 3>,+3) =/> <a --> 4>>. %1.00;0.31%
         * shouldn't happen because it should not unify #wat with 4 because its not a
         * query variable
         */
        new class extends EventHandler {
            public event(/* final */  event: java.lang.Class<unknown> | null, /* final */  args: java.lang.Object[] | null): void {
                // nothing should arrive via Solved.class channel
                assertTrue(false);
            }
        }($outer.n, true, Answer.class);

        let e: OutputContainsCondition = new OutputContainsCondition(this.n, "=/> <a --> 4>>.", 5);

        this.n.cycles(32);

        assertTrue(e.isTrue());
    }

    public testQueryVariableUnification(): void {
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
            public event(/* final */  event: java.lang.Class<unknown> | null, /* final */  args: java.lang.Object[] | null): void {
                solutionFound.set(true);
                $outer.n.stop();
            }
        }($outer.n, true, Answer.class);

        this.n.cycles(1024);

        assertTrue(solutionFound.get());

    }
}
