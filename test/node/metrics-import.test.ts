import assert from "node:assert/strict";
import test from "node:test";

test("metrics and output conditions load without an ESM initialization cycle", async () => {
    const { java } = await import("jree");
    const { NalTestMetrics } = await import("../../test/metrics/NalTestMetrics.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { OutputHandler } = await import("../../src/io/events/OutputHandler.ts");
    const { TextOutputHandler } = await import("../../src/io/events/TextOutputHandler.ts");
    const { JavaDecimalFormatCompat, JavaRuntimeCompat, JavaStringJoinerCompat } =
        await import("../../src/runtime/jree-compat.ts");
    const { OutputCondition } = await import("../../test/util/test/OutputCondition.ts");

    const values = new java.util.ArrayList<number>();
    values.add(1);
    values.add(Number.POSITIVE_INFINITY);
    values.add(3);
    const filtered = NalTestMetrics.removeInfinities(values);

    assert.equal(filtered.size(), 2);
    assert.equal(NalTestMetrics.calcMedian(filtered), 3);

    assert.equal(String(new JavaDecimalFormatCompat("#.###").format(1.23456)), "1.235");
    const joiner = new JavaStringJoinerCompat(", ");
    joiner.add(new java.lang.String("a")).add(new java.lang.String("b"));
    assert.equal(String(joiner.toString()), "a, b");
    const runtime = JavaRuntimeCompat.getRuntime();
    assert.ok(runtime.totalMemory() >= runtime.freeMemory());

    const nar = new Nar();
    assert.equal(
        String(TextOutputHandler.getOutputString(
            OutputHandler.OUT.class,
            new java.lang.String("static output"),
            false,
            nar,
        )),
        "static output",
    );

    const conditions = OutputCondition.getConditions(
        nar,
        new java.lang.String("''outputMustContain('x')\n''expect.outEmpty"),
        5,
    );
    assert.equal(conditions.size(), 2);
});
