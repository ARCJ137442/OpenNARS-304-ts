import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildValidationPlan,
  VALIDATION_CLUSTERS,
  validationClustersForFile,
} from "../../scripts/checking/validation-clusters.mjs";

const projectRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

async function productionTypeScriptFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (/\.tsx?$/.test(entry.name)) files.push(relative(root, path).replaceAll("\\", "/"));
    }
  }
  await visit(join(root, "src"));
  return files;
}

test("five responsibility clusters are stable and expose two to five sentinel NAL files", () => {
  assert.deepEqual(VALIDATION_CLUSTERS.map((cluster) => cluster.id), [
    "J1-runtime-compat",
    "J2-language-parser",
    "J3-inference-core",
    "J4-operator-plugin",
    "J5-main-io-host",
  ]);
  for (const cluster of VALIDATION_CLUSTERS) {
    assert.ok(cluster.affectedNals.length >= 2 && cluster.affectedNals.length <= 5, cluster.id);
  }
});

test("every current production TypeScript file belongs to exactly one responsibility cluster", async () => {
  const files = await productionTypeScriptFiles(projectRoot);
  for (const file of files) {
    assert.equal(validationClustersForFile(file).length, 1, file);
  }
});

test("a risk slice selects cluster sentinels and never creates an M1-minus command", () => {
  const plan = buildValidationPlan({
    files: ["src/storage/Memory.ts", "test/node/memory-string-boundary.test.ts"],
    tier: "T1",
    requestedClusterId: "J3-inference-core",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/memory-slice",
  });
  assert.equal(plan.plan_valid, true);
  assert.equal(plan.validation_profile, "risk-slice");
  assert.equal(plan.affected_nal_files.length, 4);
  assert.ok(plan.affected_nal_command?.includes("--file"));
  assert.equal(plan.m1_minus_command, null);
});

test("a cluster close creates one M1-minus command and omits the redundant sentinel run", () => {
  const plan = buildValidationPlan({
    files: ["src/runtime/Float32.ts", "src/runtime/ReasonerRandom.ts"],
    tier: "T1",
    requestedClusterId: "J1-runtime-compat",
    closeCluster: true,
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/J1-close",
  });
  assert.equal(plan.plan_valid, true);
  assert.equal(plan.validation_profile, "cluster-close");
  assert.equal(plan.affected_nal_command, null);
  assert.ok(plan.m1_minus_command?.includes("--m-minus"));
  assert.equal(plan.m1_minus_command?.includes("--limit"), false);
});

test("one explicit owner may carry at most one small supporting cluster", () => {
  const ownedCrossCluster = buildValidationPlan({
    files: ["src/runtime/Float32.ts", "src/language/Term.ts"],
    tier: "T1",
    requestedClusterId: "J1-runtime-compat",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/cross",
  });
  assert.equal(ownedCrossCluster.plan_valid, true);
  assert.deepEqual(ownedCrossCluster.supporting_clusters.map((cluster) => cluster.id), ["J2-language-parser"]);
  assert.ok(ownedCrossCluster.affected_nal_files.length >= 2);
  assert.ok(ownedCrossCluster.affected_nal_files.length <= 5);

  const ambiguous = buildValidationPlan({
    files: ["src/runtime/Float32.ts", "src/language/Term.ts"],
    tier: "T1",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/ambiguous",
  });
  assert.equal(ambiguous.plan_valid, false);
  assert.match(ambiguous.plan_errors.join(" "), /cross-cluster-owner-required/);

  const tooBroad = buildValidationPlan({
    files: ["src/runtime/Float32.ts", "src/language/Term.ts", "src/storage/Bag.ts"],
    tier: "T1",
    requestedClusterId: "J1-runtime-compat",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/broad",
  });
  assert.equal(tooBroad.plan_valid, false);
  assert.match(tooBroad.plan_errors.join(" "), /too-many-touched-clusters/);
});

test("unknown, untouched and missing-evidence plans fail closed", () => {
  const unknown = buildValidationPlan({
    files: ["src/storage/Bag.ts"],
    tier: "T1",
    requestedClusterId: "J9-unknown",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/unknown",
  });
  assert.equal(unknown.plan_valid, false);
  assert.match(unknown.plan_errors.join(" "), /unknown-cluster/);

  const wrongCluster = buildValidationPlan({
    files: ["src/storage/Bag.ts"],
    tier: "T1",
    requestedClusterId: "J2-language-parser",
    javaBaseline: "C:/evidence/frozen-java.jsonl",
    evidencePrefix: "C:/evidence/wrong",
  });
  assert.equal(wrongCluster.plan_valid, false);
  assert.match(wrongCluster.plan_errors.join(" "), /requested-cluster-not-touched/);

  const missingEvidence = buildValidationPlan({
    files: ["src/operator/Operator.ts"],
    tier: "T1",
    requestedClusterId: "J4-operator-plugin",
  });
  assert.equal(missingEvidence.plan_valid, false);
  assert.match(missingEvidence.plan_errors.join(" "), /baseline/);
  assert.match(missingEvidence.plan_errors.join(" "), /evidence-prefix/);
});

test("stage acceptance requests live Java, full M1 and strict markerless evidence", () => {
  const plan = buildValidationPlan({ files: [], tier: "T2" });
  assert.equal(plan.plan_valid, true);
  assert.equal(plan.live_java_required, true);
  assert.equal(plan.full_m1_required, true);
  assert.equal(plan.strict_markerless_required, true);
});

test("stage M1-prime explicitly replaces only the approved RuntimeLong-cycle contract", () => {
  const plan = (buildValidationPlan as any)({ files: [], tier: "T2", m1Profile: "prime" });
  assert.equal(plan.plan_valid, true);
  assert.equal(plan.live_java_required, true);
  assert.equal(plan.full_m1_required, false);
  assert.equal(plan.m1_prime_required, true);
  assert.equal(plan.m1_profile, "prime");
  assert.equal(plan.strict_markerless_required, true);
});
