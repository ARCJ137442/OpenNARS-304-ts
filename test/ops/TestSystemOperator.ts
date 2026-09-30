import { java, JavaObject } from "../../src/runtime/native-runtime.ts";
import { AnswerHandler } from "../../src/io/events/AnswerHandler.ts";
import { Nar } from "../../src/main/Nar.ts";
import { NarseseConsumer } from "../../src/interfaces/NarseseConsumer.ts";
import { Sentence } from "../../src/entity/Sentence.ts";
import { Term } from "../../src/language/Term.ts";
import { javaStringValue, type JavaStringInput } from "../../src/runtime/native-runtime.ts";
import { assertTrue } from "../util/junit-assert.ts";
import { System as SystemOperator } from "../../src/operator/misc/System.ts";



/**
 * (integration) testing of the ^system op
 */
export class TestSystemOperator extends JavaObject {
    public testOpCall(): void {
        { // 0 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new SystemOperator());
            TestSystemOperator.test0Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask(new java.lang.String("<{?0}-->res>"), handler);
            nar.cycles(100);
            assertTrue(javaStringValue(handler.lastAnswerTerm?.toString()) === "<{true} --> res>");
        }

        { // 1 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new SystemOperator());
            TestSystemOperator.test1Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask(new java.lang.String("<{?0}-->res>"), handler);
            nar.cycles(100);
            assertTrue(javaStringValue(handler.lastAnswerTerm?.toString()) === "<{true} --> res>");
        }

        { // 2 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new SystemOperator());
            TestSystemOperator.test2Ret(nar, "bool");
            nar.cycles(500);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask(new java.lang.String("<{?0}-->res>"), handler);
            nar.cycles(100);
            assertTrue(javaStringValue(handler.lastAnswerTerm?.toString()) === "<{true} --> res>");
        }

        { // 3 parameters, boolean result
            let nar: Nar = new Nar();
            nar.addPlugin(new SystemOperator());
            TestSystemOperator.test3Ret(nar, "bool");
            nar.cycles(700);

            // check result of call
            let handler: TestSystemOperator.MyAnswerHandler = new TestSystemOperator.MyAnswerHandler();
            nar.ask(new java.lang.String("<{?0}-->res>"), handler);
            nar.cycles(200);
            assertTrue(javaStringValue(handler.lastAnswerTerm?.toString()) === "<{true} --> res>");
        }
    }

    /**
     *
     * @param consumer
     * @param expectedResultType datatype of the expected result
     */
    private static test0Ret(consumer: NarseseConsumer, expectedResultType: JavaStringInput): void {
        //consumer.addInput("<(&/, <cond0-->Cond0>, (^system, {SELF}, ls, $ret)) =/> <{$ret}-->res>>.");
        const resultType = javaStringValue(expectedResultType);
        TestSystemOperator.addInput(consumer, `<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet${resultType}.sh, $ret)) =/> <{$ret}-->res>>.`);
        TestSystemOperator.addInput(consumer, "<cond0-->Cond0>. :|:");
        TestSystemOperator.addInput(consumer, "<{#0}-->res>!");
    }

    private static test1Ret(consumer: NarseseConsumer, expectedResultType: JavaStringInput): void {
        const resultType = javaStringValue(expectedResultType);
        TestSystemOperator.addInput(consumer, `<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet${resultType}.sh, Arg0, $ret)) =/> <{$ret}-->res>>.`);
        TestSystemOperator.addInput(consumer, "<cond0-->Cond0>. :|:");
        TestSystemOperator.addInput(consumer, "<{#0}-->res>!");
    }

    private static test2Ret(consumer: NarseseConsumer, expectedResultType: JavaStringInput): void {
        const resultType = javaStringValue(expectedResultType);
        TestSystemOperator.addInput(consumer, `<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet${resultType}.sh, Arg0, Arg1, $ret)) =/> <{$ret}-->res>>.`);
        TestSystemOperator.addInput(consumer, "<cond0-->Cond0>. :|:");
        TestSystemOperator.addInput(consumer, "<{#0}-->res>!");
    }

    private static test3Ret(consumer: NarseseConsumer, expectedResultType: JavaStringInput): void {
        const resultType = javaStringValue(expectedResultType);
        TestSystemOperator.addInput(consumer, `<(&/, <cond0-->Cond0>, (^system, {SELF}, ./src/main/resources/unittest/TestscriptRet${resultType}.sh, Arg0, Arg1, Arg2, $ret)) =/> <{$ret}-->res>>.`);
        TestSystemOperator.addInput(consumer, "<cond0-->Cond0>. :|:");
        TestSystemOperator.addInput(consumer, "<{#0}-->res>!");
    }

    private static addInput(consumer: NarseseConsumer, text: string): void {
        consumer.addInput(new java.lang.String(text));
    }

    public static MyAnswerHandler = class MyAnswerHandler extends AnswerHandler {
        public lastAnswerTerm: Term | null = null;

        public onSolution(belief: Sentence): void {
            this.lastAnswerTerm = belief.term;
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TestSystemOperator {
    export type MyAnswerHandler = InstanceType<typeof TestSystemOperator.MyAnswerHandler>;
}


