import { java, JavaObject } from "jree";



/**
 * (integration) testing of the ^system op
 */
export class TestSystemOperator extends JavaObject {
    public testOpCall(): void {
        { // 0 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new org.opennars.operator.misc.System());
            TestSystemOperator.test0Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask("<{?0}-->res>", handler);
            nar.cycles(100);
            assertTrue(handler.lastAnswerTerm.toString().equals("<{true} --> res>"));
        }

        { // 1 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new org.opennars.operator.misc.System());
            TestSystemOperator.test1Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask("<{?0}-->res>", handler);
            nar.cycles(100);
            assertTrue(handler.lastAnswerTerm.toString().equals("<{true} --> res>"));
        }

        { // 2 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new org.opennars.operator.misc.System());
            TestSystemOperator.test2Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask("<{?0}-->res>", handler);
            nar.cycles(100);
            assertTrue(handler.lastAnswerTerm.toString().equals("<{true} --> res>"));
        }

        { // 3 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new org.opennars.operator.misc.System());
            TestSystemOperator.test3Ret(nar, "bool");
            nar.cycles(700);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask("<{?0}-->res>", handler);
            nar.cycles(200);
            assertTrue(handler.lastAnswerTerm.toString().equals("<{true} --> res>"));
        }
    }

    /**
     *
     * @param consumer
     * @param expectedResultType datatype of the expected result
     */
    private static test0Ret(consumer: NarseseConsumer | null, expectedResultType: java.lang.String | null): void {
        //consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ls, $ret)) =/> <{$ret}-->res>>.");
        consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet" + expectedResultType + ".sh, $ret)) =/> <{$ret}-->res>>.");
        consumer.addInput("<cond0-->Cond0>. :|:");
        consumer.addInput("<{#0}-->res>!");
    }

    private static test1Ret(consumer: NarseseConsumer | null, expectedResultType: java.lang.String | null): void {
        consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet" + expectedResultType + ".sh, Arg0, $ret)) =/> <{$ret}-->res>>.");
        consumer.addInput("<cond0-->Cond0>. :|:");
        consumer.addInput("<{#0}-->res>!");
    }

    private static test2Ret(consumer: NarseseConsumer | null, expectedResultType: java.lang.String | null): void {
        consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet" + expectedResultType + ".sh, Arg0, Arg1, $ret)) =/> <{$ret}-->res>>.");
        consumer.addInput("<cond0-->Cond0>. :|:");
        consumer.addInput("<{#0}-->res>!");
    }

    private static test3Ret(consumer: NarseseConsumer | null, expectedResultType: java.lang.String | null): void {
        consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet" + expectedResultType + ".sh, Arg0, Arg1, Arg2, $ret)) =/> <{$ret}-->res>>.");
        consumer.addInput("<cond0-->Cond0>. :|:");
        consumer.addInput("<{#0}-->res>!");
    }

    public static MyAnswerHandler = class MyAnswerHandler extends AnswerHandler {
        public lastAnswerTerm: Term | null = null;

        public onSolution(belief: Sentence | null): void {
            this.lastAnswerTerm = belief.term;
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TestSystemOperator {
    export type MyAnswerHandler = InstanceType<typeof TestSystemOperator.MyAnswerHandler>;
}


