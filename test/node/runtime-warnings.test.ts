import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("shell starts without loader or jree deprecation warnings", () => {
  const result = spawnSync(process.execPath, [
    "--import",
    "./scripts/register-ts-loader.mjs",
    "scripts/shell.mjs",
    "--no-prompt",
  ], {
    cwd: process.cwd(),
    input: ":quit\n",
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /ExperimentalWarning|DEP0151/);
});
