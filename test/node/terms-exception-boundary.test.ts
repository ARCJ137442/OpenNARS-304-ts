import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JavaIllegalArgumentException, JavaIllegalStateException } from "../../src/runtime/JavaExceptions.ts";

test("Terms uses project-owned argument and state exceptions", () => {
    const source = readFileSync("src/language/Terms.ts", "utf8");
    assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/);
});

test("Terms invalid overloads preserve project exception identity", async () => {
    const { Terms } = await import("../../src/language/Terms.ts");
    assert.throws(() => (Terms as unknown as { term: (...args: unknown[]) => unknown }).term(),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => (Terms as unknown as { term: (...args: unknown[]) => unknown }).term("bad", "extra", "args", "here", "too", "many"),
        (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.ok(JavaIllegalStateException);
});
