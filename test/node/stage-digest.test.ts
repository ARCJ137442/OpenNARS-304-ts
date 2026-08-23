// @ts-nocheck -- the repository's tsc configuration intentionally lacks Node test typings.
import assert from "node:assert/strict";
import test from "node:test";

import { compareStageDigestPrefix, compareStageDigests, parseStageDigest } from "../../scripts/e2e/compare-nal-stage-digest.mjs";

function stage(eventCount, digest, first = null, last = null) {
  return {
    event_count: eventCount,
    cycles_with_events: eventCount === 0 ? 0 : 1,
    first_event: first,
    last_event: last,
    digest,
  };
}

function digest(totalEvents, derivationDigest = "D") {
  return {
    kind: "summary",
    records: [{
      kind: "window",
      start_cycle: 1,
      end_cycle: 2,
      cycle_count: 2,
      total_events: totalEvents,
      stages: {
        input: stage(1, "I", "TaskAdd|x", "TaskAdd|x"),
        concept: stage(0, "C"),
        links: stage(0, "L"),
        scheduler: stage(0, "S"),
        rule: stage(0, "R"),
        derivation: stage(1, derivationDigest, "TaskDerive|x", "TaskDerive|x"),
        marker: stage(0, "M"),
      },
    }],
  };
}

test("stage digest parser requires the summary contract", () => {
  assert.equal(parseStageDigest(JSON.stringify(digest(2))).kind, "summary");
  assert.equal(parseStageDigest(`${JSON.stringify({ kind: "meta" })}\n${JSON.stringify(digest(2))}`).kind, "summary");
  assert.equal(parseStageDigest(`${JSON.stringify({ kind: "meta" })}\n${JSON.stringify(digest(2).records[0])}\n${JSON.stringify({ kind: "summary", records: [] })}`).records.length, 1);
  assert.throws(() => parseStageDigest(JSON.stringify({ kind: "summary" })), /summary with records/);
});

test("stage digest comparison returns equality for matching windows", () => {
  assert.deepEqual(compareStageDigests(digest(2), digest(2)), { equal: true, first_difference: null });
});

test("stage digest comparison reports the first differing stage and field", () => {
  const result = compareStageDigests(digest(2), digest(2, "different"));
  assert.equal(result.equal, false);
  assert.deepEqual(result.first_difference, {
    window_index: 0,
    start_cycle: 1,
    end_cycle: 2,
    stage: "derivation",
    field: "digest",
    java: "D",
    ts: "different",
  });
});

test("stage digest comparison distinguishes missing windows from equal empty data", () => {
  const result = compareStageDigests(digest(2), { kind: "summary", records: [] });
  assert.deepEqual(result, { equal: false, first_difference: { window_index: 0, reason: "window_count" } });
});

test("stage digest comparison does not ignore pre-cycle input differences", () => {
  const base = digest(2);
  const withPre = {
    ...base,
    records: [{
      kind: "pre",
      total_events: 1,
      stages: { ...base.records[0].stages, input: stage(1, "different", "TaskAdd|different", "TaskAdd|different") },
    }, ...base.records],
  };
  const result = compareStageDigests(base, withPre);
  assert.deepEqual(result, { equal: false, first_difference: { reason: "pre_count", java: 0, ts: 1 } });
});

test("stage digest prefix comparison separates matched windows from unfinished execution", () => {
  const full = digest(2);
  const partial = { kind: "summary", incomplete: true, records: full.records.slice(0, 0) };
  const result = compareStageDigestPrefix(full, partial);
  assert.equal(result.prefix_equal, true);
  assert.equal(result.complete, false);
  assert.equal(result.observed_windows, 0);
  assert.equal(result.expected_windows, 1);
});
