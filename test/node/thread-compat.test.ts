import assert from "node:assert/strict";
import test from "node:test";
import { InterruptedExceptionCompat, ThreadCompat } from "../../src/runtime/ThreadCompat.ts";

test("ThreadCompat uses native scheduling and preserves the translated call surface", async () => {
    const calls: string[] = [];
    const thread = new ThreadCompat({
        run(): void {
            calls.push("target");
        },
    }, "native-test");

    assert.equal(thread.getName(), "native-test");
    assert.equal(thread.isInterrupted(), false);
    assert.deepEqual(thread.getStackTrace(), []);

    thread.start();
    assert.deepEqual(calls, []);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.deepEqual(calls, ["target"]);

    thread.interrupt();
    assert.equal(thread.isInterrupted(), true);
});

test("ThreadCompat keeps synchronous sleep and native interruption errors", () => {
    ThreadCompat.sleep(0);
    ThreadCompat.sleep(1);
    const error = new InterruptedExceptionCompat();

    assert.equal(error.name, "InterruptedExceptionCompat");
    assert.equal(error instanceof Error, true);
    assert.equal(error instanceof InterruptedExceptionCompat, true);
});
