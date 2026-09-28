import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";

const projectRoot = process.cwd();
const canonicalRoot = `${projectRoot}/../OpenNARS-304-java-canonical-fixed-build/target`;
const javaArtifactsAvailable = existsSync(`${canonicalRoot}/opennars-3.0.4-SNAPSHOT.jar`)
    && existsSync(`${canonicalRoot}/classes`)
    && existsSync(`${canonicalRoot}/test-classes`);

test("Java and TypeScript local algorithm fixtures remain in parity", {
    skip: process.env.OPENNARS_TEST_MODE === "ts-only" || !javaArtifactsAvailable,
}, () => {
    const result = spawnSync(process.execPath, [
        "--import", "./scripts/register-ts-loader.mjs",
        "scripts/parity/run-local-algorithm-parity.mjs",
    ], {
        cwd: projectRoot,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const snapshot = JSON.parse(result.stdout);
    assert.equal(snapshot.ok, true, JSON.stringify(snapshot.differences));
});
