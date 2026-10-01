import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sources = ["src/language/ImageExt.ts", "src/language/ImageInt.ts"];

test("ImageExt and ImageInt do not construct jree exception classes directly", () => {
    for (const file of sources) {
        const source = readFileSync(file, "utf8");
        assert.doesNotMatch(source, /new java\.lang\.(IllegalArgumentException|IllegalStateException)\(/, file);
    }
});

test("ImageExt clone and make use project-owned argument/state exceptions", async () => {
    const { ImageExt } = await import("../../src/language/ImageExt.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { JavaIllegalArgumentException, JavaIllegalStateException } = await import("../support/legacy-exceptions.ts");
    const image = new ImageExt([Term.get("relation"), Term.get("component")], 0);
    const clone = image.clone as unknown as (...args: unknown[]) => unknown;
    const make = ImageExt.make as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => clone.call(image, Term.get("unexpected"), Term.get("extra")), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => image.clone([Term.get("only")]), (error: unknown) => error instanceof JavaIllegalStateException);
    assert.throws(() => make(), (error: unknown) => error instanceof JavaIllegalArgumentException);
});

test("ImageInt clone and make use project-owned argument/state exceptions", async () => {
    const { ImageInt } = await import("../../src/language/ImageInt.ts");
    const { Term } = await import("../../src/language/Term.ts");
    const { JavaIllegalArgumentException, JavaIllegalStateException } = await import("../support/legacy-exceptions.ts");
    const image = ImageInt.make([Term.get("relation"), Term.get("component")], 0);
    const clone = image.clone as unknown as (...args: unknown[]) => unknown;
    const make = ImageInt.make as unknown as (...args: unknown[]) => unknown;

    assert.throws(() => clone.call(image, Term.get("unexpected"), Term.get("extra")), (error: unknown) => error instanceof JavaIllegalArgumentException);
    assert.throws(() => image.clone([Term.get("only")]), (error: unknown) => error instanceof JavaIllegalStateException);
    assert.throws(() => make(), (error: unknown) => error instanceof JavaIllegalArgumentException);
});
