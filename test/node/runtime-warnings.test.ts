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

test("shell reads an external config in the host adapter without warnings", () => {
  const result = spawnSync(process.execPath, [
    "--import",
    "./scripts/register-ts-loader.mjs",
    "scripts/shell.mjs",
    "--no-prompt",
    "--config",
    "config/defaultConfig.xml",
  ], {
    cwd: process.cwd(),
    input: ":status\n:quit\n",
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[shell\] time=0 running=false/);
  assert.doesNotMatch(result.stderr, /ExperimentalWarning|DEP0151/);
});
