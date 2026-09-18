import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyChangeGate, runtimeDependencyFingerprint } from "../../scripts/checking/change-gate-policy.mjs";

test("gate policy keeps a bounded documentation or low-risk source edit at T0", () => {
  assert.equal(classifyChangeGate({ files: ["docs/user-guide.md"] }).tier, "T0");
  assert.equal(classifyChangeGate({ files: ["src/util/ListUtil.ts"], changedLines: 12, patch: "+return text;" }).tier, "T0");
});

test("gate policy escalates a single hot Bag edit and semantic collection changes to T1", () => {
  const bag = classifyChangeGate({ files: ["src/storage/Bag.ts"], changedLines: 4 });
  assert.equal(bag.tier, "T1");
  assert.equal(bag.m1_minus_required, true);
  assert.match(bag.reasons.join(" "), /high-risk-path/);
  assert.equal(classifyChangeGate({ files: ["src/util/ListUtil.ts"], patch: "+const lookup = new Map();" }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/platform/RuntimeCapabilities.ts"], changedLines: 4 }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/platform/RuntimeCapabilities.ts"], changedLines: 4 }).m1_minus_required, false);
  assert.equal(classifyChangeGate({ files: ["src/plugin/Plugin.ts"], scope: "responsibility" }).m1_minus_required, true);
  assert.equal(classifyChangeGate({ files: ["src/runtime/Float32.ts"], changedLines: 4 }).tier, "T1");
});

test("gate policy escalates baseline changes and milestone acceptance to T2", () => {
  assert.equal(classifyChangeGate({ files: ["java-master/src/main/resources/nal/x.nal"] }).tier, "T2");
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).tier, "T2");
  assert.equal(classifyChangeGate({ files: [], stage: "023" }).m1_minus_required, false);
  assert.equal(classifyChangeGate({ files: ["package.json"], runtimeDependenciesChanged: true }).tier, "T2");
  assert.equal(classifyChangeGate({ files: ["package.json"], patch: '+    "test": "echo ok"' }).tier, "T0");
  assert.equal(classifyChangeGate({ files: ["src/storage/Bag.ts"], patch: "-old code" }).tier, "T1");
});

test("gate policy escalates broad production edits", () => {
  assert.equal(classifyChangeGate({ files: ["src/io/Texts.ts", "src/main/Parameters.ts", "src/platform/node/Host.ts"] }).tier, "T1");
  assert.equal(classifyChangeGate({ files: ["src/io/Texts.ts"], changedLines: 81 }).tier, "T1");
  assert.throws(() => classifyChangeGate({ stage: "unknown" as never }), /unknown stage/);
  assert.throws(() => classifyChangeGate({ scope: "unknown" as never }), /unknown scope/);
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
