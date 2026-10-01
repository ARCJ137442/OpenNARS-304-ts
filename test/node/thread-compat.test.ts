import assert from "node:assert/strict";
import test from "node:test";
import { ReasonerInterruptedError, ReasonerScheduler } from "../../src/runtime/ReasonerScheduler.ts";

test("ReasonerScheduler uses native scheduling and preserves the translated call surface", async () => {
    const calls: string[] = [];
    const thread = new ReasonerScheduler({
        run(): void {
            calls.push("target");
        },
    }, "native-test");

    assert.equal(thread.getName(), "native-test");
    assert.equal(thread.isInterrupted(), false);
    assert.deepEqual(thread.stackFrames(), []);

    thread.start();
    assert.deepEqual(calls, []);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.deepEqual(calls, ["target"]);

    thread.interrupt();
    assert.equal(thread.isInterrupted(), true);
});

test("ReasonerScheduler keeps synchronous sleep and native interruption errors", () => {
    ReasonerScheduler.sleep(0);
    ReasonerScheduler.sleep(1);
    const error = new ReasonerInterruptedError();

    assert.equal(error.name, "ReasonerInterruptedError");
    assert.equal(error instanceof Error, true);
    assert.equal(error instanceof ReasonerInterruptedError, true);
});
