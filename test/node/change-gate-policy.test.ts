import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyChangeGate, countProductionSourceLines, runtimeDependencyFingerprint } from "../../scripts/checking/change-gate-policy.mjs";

test("gate policy keeps a bounded documentation or low-risk source edit at T0", () => {
  assert.equal(classifyChangeGate({ files: ["docs/user-guide.md"] }).tier, "T0");
  assert.equal(classifyChangeGate({ files: ["src/util/ListUtil.ts"], sourceChangedLines: 12, patch: "+return text;" }).tier, "T0");
});

test("gate policy escalates a hot Bag slice to T1 without spending the cluster-close M1 budget", () => {
  const bag = classifyChangeGate({ files: ["src/storage/Bag.ts"], sourceChangedLines: 4 });
  assert.equal(bag.tier, "T1");
  assert.equal(bag.m1_minus_required, false);
  assert.equal(bag.affected_nal_required, true);
  assert.equal(bag.validation_profile, "risk-slice");
  assert.match(bag.reasons.join(" "), /high-risk-path/);
  assert.equal(classifyChangeGate({ files: ["src/util/ListUtil.ts"], patch: "+const lookup = new Map();" }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/platform/RuntimeCapabilities.ts"], sourceChangedLines: 4 }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/platform/RuntimeCapabilities.ts"], sourceChangedLines: 4 }).m1_minus_required, false);
  assert.equal(classifyChangeGate({ files: ["src/runtime/Float32.ts"], sourceChangedLines: 4 }).tier, "T1");
});

test("only an explicit enumerated cluster close requires M1-minus", () => {
  const result = classifyChangeGate({
    files: ["src/runtime/Float32.ts"],
    clusterId: "J1-runtime-compat",
    closeCluster: true,
  });
  assert.equal(result.tier, "T1");
  assert.equal(result.m1_minus_required, true);
  assert.deepEqual(result.m1_minus_reasons, ["cluster-close:J1-runtime-compat"]);
  assert.equal(result.affected_nal_required, false);
  assert.equal(result.validation_profile, "cluster-close");
  assert.throws(() => classifyChangeGate({ closeCluster: true }), /requires clusterId/);
  assert.throws(() => classifyChangeGate({
    stage: "023", clusterId: "J1-runtime-compat", closeCluster: true,
  }), /separate gates/);
});

test("gate policy escalates baseline changes and milestone acceptance to T2", () => {
  assert.equal(classifyChangeGate({ files: ["java-master/src/main/resources/nal/x.nal"] }).tier, "T2");
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).tier, "T2");
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).m1_minus_required, false);
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).full_m1_required, true);
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).validation_profile, "stage");
  assert.equal(classifyChangeGate({ files: ["package.json"], runtimeDependenciesChanged: true }).tier, "T2");
  assert.equal(classifyChangeGate({ files: ["package.json"], patch: '+    "test": "echo ok"' }).tier, "T0");
  assert.equal(classifyChangeGate({ files: ["src/storage/Bag.ts"], patch: "-old code" }).tier, "T1");
});

test("gate policy escalates broad production edits", () => {
  assert.equal(classifyChangeGate({ files: ["src/io/Texts.ts", "src/main/Parameters.ts", "src/platform/node/Host.ts"] }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/io/Texts.ts"], sourceChangedLines: 81 }).tier, "T1");
  assert.throws(() => classifyChangeGate({ stage: "unknown" as never }), /unknown stage/);
  assert.throws(() => classifyChangeGate({ clusterId: "" }), /non-empty string/);
});

test("source-line gate counts only production TypeScript, excluding tests, reports, docs and JavaScript", () => {
  const numstat = [
    "4\t3\tsrc/plugin/mental/ComplexEmotions.ts",
    "6\t5\ttest/node/change-gate-policy.test.ts",
    "40\t44\treports/20260918-135638.md",
    "2\t3\tdocs/luna-agent-active-goal.md",
    "9\t9\tscripts/checking/helper.mjs",
    "1\t1\tsrc/__tests__/fixture.ts",
  ].join("\n");
  assert.equal(countProductionSourceLines(numstat), 7);
  const files = [
    "src/plugin/mental/ComplexEmotions.ts",
    "test/node/change-gate-policy.test.ts",
    "reports/20260918-135638.md",
    "docs/luna-agent-active-goal.md",
    "scripts/checking/helper.mjs",
    "src/__tests__/fixture.ts",
  ];
  const slice = classifyChangeGate({ files, sourceChangedLines: countProductionSourceLines(numstat) });
  assert.equal(slice.tier, "T1");
  assert.equal(slice.m1_minus_required, false);
  assert.equal(slice.source_changed_lines, 7);
  const clusterClose = classifyChangeGate({
    files,
    sourceChangedLines: countProductionSourceLines(numstat),
    clusterId: "J4-operator-plugin",
    closeCluster: true,
  });
  assert.equal(clusterClose.m1_minus_required, true);
});

test("runtime dependency fingerprint ignores ordering and scripts but detects version changes", () => {
  const before = { dependencies: { jree: "1.3.0", other: "1" }, scripts: { test: "old" } };
  assert.equal(runtimeDependencyFingerprint(before), runtimeDependencyFingerprint({
    scripts: { test: "new" }, dependencies: { other: "1", jree: "1.3.0" },
  }));
  assert.notEqual(runtimeDependencyFingerprint(before), runtimeDependencyFingerprint({
    dependencies: { other: "1", jree: "2.0.0" },
  }));
});
