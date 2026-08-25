import assert from "node:assert/strict";
import test from "node:test";

test("metrics and output conditions load without an ESM initialization cycle", async () => {
    const { java } = await import("jree");
    const { NalTestMetrics } = await import("../../test/metrics/NalTestMetrics.ts");
    const { Nar } = await import("../../src/main/Nar.ts");
    const { OutputCondition } = await import("../../test/util/test/OutputCondition.ts");

    const values = new java.util.ArrayList<number>();
    values.add(1);
    values.add(Number.POSITIVE_INFINITY);
    values.add(3);
    const filtered = NalTestMetrics.removeInfinities(values);

    assert.equal(filtered.size(), 2);
    assert.equal(NalTestMetrics.calcMedian(filtered), 3);

    const conditions = OutputCondition.getConditions(
        new Nar(),
        new java.lang.String("''outputMustContain('x')\n''expect.outEmpty"),
        5,
    );
    assert.equal(conditions.size(), 2);
});
