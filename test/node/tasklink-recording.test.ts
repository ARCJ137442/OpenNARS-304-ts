import assert from "node:assert/strict";
import test from "node:test";

import { TaskLink } from "../../src/entity/TaskLink.ts";
import type { TermLink } from "../../src/entity/TermLink.ts";

test("TaskLink.Recording keeps its Java data contract without a jree object shell", () => {
    const link = {} as TermLink;
    const recording = new TaskLink.Recording(link, 7n);

    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(recording)), Object.prototype);
    assert.equal(recording.link, link);
    assert.equal(recording.getTime(), 7n);

    recording.setTime(11n);
    assert.equal(recording.getTime(), 11n);
});
