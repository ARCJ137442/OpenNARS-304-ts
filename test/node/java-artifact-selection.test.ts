import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();
const localRunner = join(projectRoot, "scripts", "parity", "run-local-algorithm-parity.mjs");
const nalRunner = join(projectRoot, "scripts", "e2e", "run-nal-corpus.mjs");
const javaRoot = join(projectRoot, "java-master", "target");
const legacyJar = join(javaRoot, "opennars-3.1.0-SNAPSHOT.jar");
const legacyClasses = join(javaRoot, "classes");
const legacyTestClasses = join(javaRoot, "test-classes");

function run(script: string, args: string[]) {
  const nodeArgs = script === localRunner ? ["--experimental-strip-types", script, ...args] : [script, ...args];
  return spawnSync(process.execPath, nodeArgs, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

test("local parity runner rejects a missing selected Java artifact", () => {
  const result = run(localRunner, ["--java-jar", join(projectRoot, "missing-java-baseline.jar")]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--java-jar path does not exist/);
});

test("NAL runner rejects a missing selected Java artifact", () => {
  const result = run(nalRunner, [
    "--engine", "java",
    "--limit", "1",
    "--cycles", "1",
    "--java-jar", join(projectRoot, "missing-java-baseline.jar"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--java-jar path does not exist/);
});

test("local parity output identifies the selected Java artifact", { skip: !existsSync(legacyJar) || !existsSync(legacyClasses) || !existsSync(legacyTestClasses) }, () => {
  const result = run(localRunner, [
    "--java-jar", legacyJar,
    "--java-classes", legacyClasses,
    "--java-test-classes", legacyTestClasses,
  ]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout);
  assert.equal(output.javaArtifact.jar, legacyJar);
  assert.match(output.javaArtifact.sha256, /^[0-9A-F]{64}$/);
});
