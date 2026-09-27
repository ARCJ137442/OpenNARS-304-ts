import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { Nar } from "../../src/main/Nar.ts";

test("Nar diagnostics use native text literals at Java exception boundaries", () => {
    const source = readFileSync("src/main/Nar.ts", "utf8");
    assert.doesNotMatch(source, /import \{ java, S \} from "jree"/);
    assert.doesNotMatch(source, /\bS`/);
    assert.match(source, /new java\.lang\.IllegalArgumentException\("Invalid number of arguments"\)/);

    const NarConstructor = Nar as unknown as { new (...args: unknown[]): Nar };
    assert.throws(() => new NarConstructor(1, 2, 3, 4), (error: unknown) => {
        return String(error).includes("Invalid number of arguments");
    });
});
