import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";

const projectRoot = process.cwd();
const javaArtifactsAvailable = existsSync(`${projectRoot}/java-master/target/opennars-3.1.0-SNAPSHOT.jar`)
    && existsSync(`${projectRoot}/java-master/target/classes`);

test("Java and TypeScript local algorithm fixtures remain in parity", { skip: !javaArtifactsAvailable }, () => {
    const result = spawnSync(process.execPath, [
        "--experimental-strip-types",
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
