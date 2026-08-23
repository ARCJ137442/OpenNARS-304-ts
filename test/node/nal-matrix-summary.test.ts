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

test("NAL matrix summary keeps a process safety limit separate from timeout", async () => {
    const { classify, primaryErrorType } = await import("../../scripts/e2e/summarize-nal-matrix.mjs");
    const row = {
        file: "H:\\repo\\java-master\\src\\main\\resources\\nal\\multi_step\\stresstest_bird1.nal",
        expected: ["marker"],
        functional_pass: false,
        parity: false,
        java_ts_diff: true,
        both_wrong: false,
        process_limited: true,
        java_process_limited: false,
        ts_process_limited: true,
        java_exception: false,
        java_timeout: false,
        java_not_run: false,
        java_marker_missing: false,
        ts_exception: false,
        ts_timeout: false,
        ts_not_run: false,
        ts_marker_missing: false,
        java: { ok: true, process_limited: false },
        ts: { ok: false, process_limited: true, timed_out: false },
    };

    assert.equal(primaryErrorType(row), "process_limit");
    const classified = classify(row, row.file);
    assert.equal(classified.error_type, "process_limit");
    assert.equal(classified.timed_out, false);
    assert.equal(classified.process_limited, true);
    assert.equal(classified.root_cause_cluster, "unknown");
    assert.match(classified.hypothesis.next_experiment, /larger safety limit/);
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

test("NAL matrix summary preserves runner provenance for legacy rows", async () => {
    const { classify } = await import("../../scripts/e2e/summarize-nal-matrix.mjs");
    const file = "H:\\repo\\java-master\\src\\main\\resources\\nal\\single_step\\nal4.7.nal";
    const classified = classify({
        file,
        expected: [],
        functional_pass: true,
        parity: true,
        java: { ok: true },
        ts: { ok: true },
    }, file, null, {
        javaProcessMode: "cold",
        tsProcessMode: "hot",
        evidenceVersion: "legacy-hot-v1",
    });

    assert.equal(classified.java_process_mode, "cold");
    assert.equal(classified.ts_process_mode, "hot");
    assert.equal(classified.evidence_version, "legacy-hot-v1");
});
