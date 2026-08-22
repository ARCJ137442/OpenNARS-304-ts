import assert from "node:assert/strict";
import test from "node:test";

test("NAL matrix summary separates timeout from an unverified semantic cause", async () => {
    const { classify, primaryErrorType } = await import("../../scripts/e2e/summarize-nal-matrix.mjs");
    const row = {
        file: "H:\\repo\\java-master\\src\\main\\resources\\nal\\application\\detective2.nal",
        expected: ["marker"],
        functional_pass: false,
        parity: false,
        java_ts_diff: true,
        both_wrong: false,
        java_exception: false,
        java_timeout: false,
        java_not_run: false,
        java_marker_missing: false,
        ts_exception: false,
        ts_timeout: true,
        ts_not_run: false,
        ts_marker_missing: false,
        java: { ok: true, timed_out: false },
        ts: { ok: false, timed_out: true },
    };

    assert.equal(primaryErrorType(row), "timeout");
    const classified = classify(row, row.file);
    assert.equal(classified.error_type, "timeout");
    assert.equal(classified.root_cause_cluster, "unknown");
    assert.match(classified.hypothesis.next_experiment, /bounded event counters/);
});

test("NAL matrix summary records the observed nal4.7 rule-dispatch hypothesis", async () => {
    const { classify } = await import("../../scripts/e2e/summarize-nal-matrix.mjs");
    const file = "H:\\repo\\java-master\\src\\main\\resources\\nal\\single_step\\nal4.7.nal";
    const classified = classify({
        file,
        expected: ["marker"],
        functional_pass: false,
        parity: false,
        java_ts_diff: true,
        both_wrong: false,
        java_exception: false,
        java_timeout: false,
        java_not_run: false,
        java_marker_missing: false,
        ts_exception: false,
        ts_timeout: false,
        ts_not_run: false,
        ts_marker_missing: true,
        java: { ok: true, timed_out: false },
        ts: { ok: false, timed_out: false, marker_missing: true },
    }, file);

    assert.equal(classified.root_cause_cluster, "rule_dispatch_divergence");
    assert.equal(classified.hypothesis.status, "confirmed_first_divergence");
});

test("NAL matrix summary records a longer-budget pass without rewriting the fixed-budget result", async () => {
    const { classify } = await import("../../scripts/e2e/summarize-nal-matrix.mjs");
    const file = "H:\\repo\\java-master\\src\\main\\resources\\nal\\application\\toothbrush.nal";
    const classified = classify({
        file,
        expected: ["marker"],
        functional_pass: false,
        parity: false,
        java_ts_diff: true,
        both_wrong: false,
        java_exception: false,
        java_timeout: false,
        java_not_run: false,
        java_marker_missing: false,
        ts_exception: false,
        ts_timeout: true,
        ts_not_run: false,
        ts_marker_missing: false,
        java: { ok: true, timed_out: false },
        ts: { ok: false, timed_out: true },
    }, file, {
        source_file: "reports/evidence/toothbrush-120s.jsonl",
        functional_pass: true,
        parity: true,
        ts: { ok: true },
    });

    assert.equal(classified.functional_pass, false);
    assert.equal(classified.parity, false);
    assert.equal(classified.root_cause_cluster, "correct_but_slower");
    assert.equal(classified.hypothesis.status, "confirmed_long_budget");
    assert.equal(classified.long_budget_evidence.source_file, "reports/evidence/toothbrush-120s.jsonl");
});
