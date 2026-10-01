import assert from "node:assert/strict";
import test from "node:test";
import { java } from "../../src/platform/node/legacy-runtime-facade.ts";

test("Task keeps its best solution null until Java sets one", async () => {
    const { Nar } = await import("../../src/main/Nar.ts");
    const { Narsese } = await import("../../src/io/Narsese.ts");

    const nar = new Nar();
    const task = new Narsese(nar).parseTask(new java.lang.String("<a --> b>."));

    assert.equal(task.getBestSolution(), null);
});

test("initialized Term names retain their Java string value", async () => {
    const { Term } = await import("../../src/language/Term.ts");

    assert.equal(String(Term.get(new java.lang.String("a")).name()), "a");
});

test("CompoundTerm rebuilds its name after Java null cache invalidation", async () => {
    const { SetInt } = await import("../../src/language/SetInt.ts");
    const { Term } = await import("../../src/language/Term.ts");

    const set = new SetInt(Term.get(new java.lang.String("a")));
    assert.equal(String(set.name()), "[a]");
    set.invalidateName();
    assert.equal(String(set.name()), "[a]");
});
